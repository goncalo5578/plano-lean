// Plano Lean — intermediário (Cloudflare Worker).
// 1) Calendário: lê o calendário dos turnos (.ics / webcal) e devolve só datas, horas e tipo de turno — nunca os detalhes dos eventos.
// 2) Alimentos: pesquisa produtos à venda em Portugal no Open Food Facts (/alimentos?q=…, /produto?code=…). Dados públicos, sem chave.
// Segredos (nunca no código): CAL_URL = link do calendário · KEY = chave que a app envia.
//   npx wrangler secret put CAL_URL
//   npx wrangler secret put KEY

const ALLOWED_ORIGINS = ['https://goncalo5578.github.io', 'http://localhost:5173'];
const TZ = 'Europe/Lisbon';
const DAYS_BACK = 14, DAYS_AHEAD = 70;
const MIN_SHIFT_MIN = 360; // eventos sem nome reconhecido só contam como turno se durarem 6 h ou mais
const OFF_UA = 'PlanoLean/1.0 (https://github.com/goncalo5578/plano-lean)';

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Headers': 'Authorization',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };
    const json = (body, status = 200) => new Response(JSON.stringify(body), {
      status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'GET') return json({ error: 'metodo' }, 405);

    // ---- Alimentos (Open Food Facts) ----
    const url = new URL(req.url);
    const cached = (body, status = 200) => new Response(JSON.stringify(body), {
      status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
    });
    if (url.pathname === '/alimentos') {
      const q = (url.searchParams.get('q') || '').trim().slice(0, 80);
      if (q.length < 2) return cached({ items: [] });
      try { return cached({ items: await searchFoods(q) }); } catch (e) { return json({ error: 'off' }, 502); }
    }
    if (url.pathname === '/produto') {
      const code = url.searchParams.get('code') || '';
      if (!/^\d{6,14}$/.test(code)) return json({ error: 'codigo' }, 400);
      try { const item = await productByCode(code); return cached({ item: item || null }); } catch (e) { return json({ error: 'off' }, 502); }
    }

    // ---- Calendário ----
    if (!env.KEY || !env.CAL_URL) return json({ error: 'config' }, 500);
    if (req.headers.get('Authorization') !== `Bearer ${env.KEY}`) return json({ error: 'chave' }, 401);

    let ics;
    try {
      const r = await fetch(env.CAL_URL.trim().replace(/^webcal:/i, 'https:'), {
        headers: { 'User-Agent': 'plano-lean-calendario' },
        cf: { cacheTtl: 300, cacheEverything: true },
      });
      if (!r.ok) return json({ error: 'calendario', status: r.status }, 502);
      ics = await r.text();
    } catch (e) {
      return json({ error: 'calendario' }, 502);
    }
    if (!ics.includes('BEGIN:VCALENDAR')) return json({ error: 'formato' }, 502);
    return json({ updated: new Date().toISOString(), events: parseShifts(ics, new Date()) });
  },
};

// ---------- Open Food Facts ----------
const STOP = ['de', 'do', 'da', 'dos', 'das', 'ao', 'com', 'e', 'em', 'sem', 'o', 'a'];
const normTxt = t => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
async function offSearch(q) {
  const u = new URL('https://search.openfoodfacts.org/search');
  u.searchParams.set('q', `${q} AND countries_tags:"en:portugal"`);
  u.searchParams.set('page_size', '50');
  u.searchParams.set('langs', 'pt');
  u.searchParams.set('fields', 'code,product_name,product_name_pt,brands,quantity,nutriments');
  const r = await fetch(u, { headers: { 'User-Agent': OFF_UA }, cf: { cacheTtl: 86400, cacheEverything: true } });
  if (!r.ok) throw new Error('off ' + r.status);
  return (await r.json()).hits || [];
}
// Pesquisa com todas as palavras + só pela primeira (ex.: "skyr pingo doce" → também "skyr"), e ordena
// pelos produtos que têm mais palavras da pesquisa no nome ou na marca.
async function searchFoods(q) {
  const terms = normTxt(q).split(/[^a-z0-9]+/).filter(w => w.length >= 2 && !STOP.includes(w));
  if (!terms.length) return [];
  const queries = [terms.join(' AND ')];
  if (terms.length > 1) queries.push(terms[0]);
  const lists = await Promise.all(queries.map(offSearch));
  const seen = new Set(), out = [];
  lists.flat().forEach((p, order) => {
    if (seen.has(p.code)) return; seen.add(p.code);
    const item = slimProduct(p); if (!item) return;
    const hay = normTxt(item.n + ' ' + (Array.isArray(p.brands) ? p.brands.join(' ') : p.brands || ''));
    const score = terms.filter(w => hay.includes(w)).length;
    if (score) out.push({ item, score, order });
  });
  return out.sort((a, b) => b.score - a.score || a.order - b.order).slice(0, 15).map(x => x.item);
}
async function productByCode(code) {
  const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=code,product_name,product_name_pt,brands,quantity,nutriments`,
    { headers: { 'User-Agent': OFF_UA }, cf: { cacheTtl: 86400, cacheEverything: true } });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('off ' + r.status);
  const j = await r.json();
  return j.product ? slimProduct({ code, ...j.product }) : null;
}
const num = v => (v === undefined || v === null || v === '' || isNaN(+v) ? null : +v);
const r1 = v => Math.round(v * 10) / 10;
export function slimProduct(p) {
  const n = p.nutriments || {};
  let kcal = num(n['energy-kcal_100g']);
  if (kcal === null && num(n.energy_100g) !== null) kcal = num(n.energy_100g) / 4.184; // kJ → kcal
  const name = String(p.product_name_pt || p.product_name || '').trim();
  if (!name || kcal === null) return null;
  const brand = String(Array.isArray(p.brands) ? p.brands[0] || '' : p.brands || '').split(',')[0].trim();
  return { code: String(p.code), n: name, b: brand, q: String(p.quantity || ''), kcal: Math.round(kcal), p: r1(num(n.proteins_100g) || 0), c: r1(num(n.carbohydrates_100g) || 0), f: r1(num(n.fat_100g) || 0) };
}

// ---------- ICS ----------
export function parseShifts(ics, now) {
  const lines = ics.replace(/\r?\n[ \t]/g, '').split(/\r?\n/); // junta linhas dobradas
  const raw = [];
  let ev = null, nested = 0;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { ev = {}; nested = 0; continue; }
    if (line === 'END:VEVENT') { if (ev) raw.push(ev); ev = null; continue; }
    if (!ev) continue;
    if (line.startsWith('BEGIN:')) { nested++; continue; } // ex.: VALARM dentro do evento
    if (line.startsWith('END:')) { nested--; continue; }
    if (nested > 0) continue;
    const i = line.indexOf(':');
    if (i < 0) continue;
    const [name, ...params] = line.slice(0, i).split(';');
    ev[name.toUpperCase()] = { val: line.slice(i + 1), params: params.join(';') };
  }

  const from = isoDate(addDaysUTC(now, -DAYS_BACK)), to = isoDate(addDaysUTC(now, DAYS_AHEAD));
  const out = [];
  for (const e of raw) {
    if (!e.DTSTART || (e.STATUS && /CANCELLED/i.test(e.STATUS.val))) continue;
    const start = toLocal(e.DTSTART);
    if (!start || start.d < from || start.d > to) continue;
    const end = e.DTEND ? toLocal(e.DTEND) : null;
    const k = classify(unescapeText(e.SUMMARY ? e.SUMMARY.val : ''));
    const dur = start.t && end && end.t ? minutesBetween(start, end) : null;
    if (!k && !(dur && dur >= MIN_SHIFT_MIN)) continue; // não parece um turno
    out.push({ d: start.d, s: start.t, dur, k });
  }
  return out.sort((a, b) => (a.d + (a.s || '')).localeCompare(b.d + (b.s || '')));
}

export function classify(title) {
  const s = title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').trim();
  if (!s) return null;
  if (/\b(noite|noturno|nocturno|night)\b/.test(s) || /^n\d*$/.test(s)) return 'N';
  if (/\btarde\b/.test(s) || /^t\d*$/.test(s)) return 'T';
  if (/\bmanha\b/.test(s) || /^m\d*$/.test(s)) return 'M';
  if (/\b(folga|ferias|descanso|df|dc|fe)\b/.test(s) || /^f$/.test(s)) return 'F';
  // Letra solta no título, ex.: "Turno M", "N 24-8"
  const letters = s.split(/\s+/).filter(w => ['m', 't', 'n'].includes(w));
  if (letters.length === 1) return letters[0].toUpperCase();
  return null;
}

function toLocal(prop) {
  const v = prop.val.trim();
  if (/VALUE=DATE(?!-)/i.test(prop.params) || /^\d{8}$/.test(v)) return { d: `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`, t: null };
  const m = v.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
  if (!m) return null;
  if (v.endsWith('Z')) { // UTC → hora de Portugal
    const dt = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]));
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
      timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(dt).map(x => [x.type, x.value]));
    return { d: `${p.year}-${p.month}-${p.day}`, t: `${p.hour}:${p.minute}` };
  }
  return { d: `${m[1]}-${m[2]}-${m[3]}`, t: `${m[4]}:${m[5]}` }; // hora local (TZID) — assume-se Portugal
}

const unescapeText = s => s.replace(/\\n/gi, ' ').replace(/\\([,;\\])/g, '$1');
const addDaysUTC = (d, n) => new Date(d.getTime() + n * 864e5);
const isoDate = d => d.toISOString().slice(0, 10);
function minutesBetween(a, b) {
  const t = x => Date.UTC(+x.d.slice(0, 4), +x.d.slice(5, 7) - 1, +x.d.slice(8, 10), +x.t.slice(0, 2), +x.t.slice(3, 5));
  return Math.round((t(b) - t(a)) / 60000);
}
