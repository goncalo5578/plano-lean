// Plano Lean — intermediário do calendário (Cloudflare Worker).
// Lê o calendário dos turnos (.ics / webcal) e devolve só datas, horas e tipo de turno — nunca os detalhes dos eventos.
// Segredos (nunca no código): CAL_URL = link do calendário · KEY = chave que a app envia.
//   npx wrangler secret put CAL_URL
//   npx wrangler secret put KEY

const ALLOWED_ORIGINS = ['https://goncalo5578.github.io', 'http://localhost:5173'];
const TZ = 'Europe/Lisbon';
const DAYS_BACK = 14, DAYS_AHEAD = 70;
const MIN_SHIFT_MIN = 360; // eventos sem nome reconhecido só contam como turno se durarem 6 h ou mais

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
