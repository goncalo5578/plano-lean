/* Pulso — plano alimentar (sem servidor; os dados ficam guardados no próprio telemóvel). */
(() => {
  'use strict';

  // ================= Estado =================
  const KEY = 'planoLean.v1';
  const DEFAULT_PROFILE = { nome: '', idade: 23, altura: 162, peso: 60, atividade: 1.375, defice: 12, treinoDias: [0, 2, 4], autoSobras: true, shifts: {}, tema: 'light' };
  const blank = () => ({ profile: { ...DEFAULT_PROFILE }, days: {}, weights: [], shop: {}, links: {}, cal: { shifts: {}, autoS: true }, recipes: { custom: [], edits: {}, removed: {}, foods: {} } });
  let S = load();

  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.profile) return { ...blank(), ...s, profile: { ...DEFAULT_PROFILE, ...s.profile } };
    } catch (e) { /* sem armazenamento */ }
    return blank();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignorar */ } }

  // ================= Ícones =================
  const I = {
    plate: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
    cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    bag: '<path d="M5 8h14l-1 12.5H6zM9 8V6.5a3 3 0 0 1 6 0V8"/>',
    chart: '<path d="M4 20h16M6.5 15.5l4-4.5 3 3 5.5-6.5"/>',
    user: '<circle cx="12" cy="8.5" r="3.75"/><path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/>',
    sunrise: '<path d="M3 18h18M7 18a5 5 0 0 1 10 0M12 5v4M5.6 10.6l1.4 1.4M18.4 10.6 17 12M3 14.5h1.5M19.5 14.5H21"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    apple: '<path d="M12 7.5c-1.5-1-5.5-1.3-6.5 2.5-.9 3.4 1.3 9.5 4 9.5 1 0 1.5-.5 2.5-.5s1.5.5 2.5.5c2.7 0 4.9-6.1 4-9.5-1-3.8-5-3.5-6.5-2.5zM12 7.5c0-2 1-3.5 3-4"/>',
    moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    chevR: '<path d="M9 5l7 7-7 7"/>',
    chevL: '<path d="M15 5l-7 7 7 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    share: '<path d="M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/>',
    swap: '<path d="M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
    pot: '<path d="M4 10h16v5.5A4.5 4.5 0 0 1 15.5 20h-7A4.5 4.5 0 0 1 4 15.5zM2 10h2M20 10h2M9.5 7c0-1.2 1-1.6 1-2.8M14 7c0-1.2 1-1.6 1-2.8"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    barcode: '<path d="M4 7V5.5A1.5 1.5 0 0 1 5.5 4H7M17 4h1.5A1.5 1.5 0 0 1 20 5.5V7M20 17v1.5a1.5 1.5 0 0 1-1.5 1.5H17M7 20H5.5A1.5 1.5 0 0 1 4 18.5V17M8 8v8M11 8v8M14 8v8M17 8v8"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    fish: '<path d="M2.5 12c2.6-3.6 6.6-5.2 10.6-4.3 1.6.4 3 1.2 4.2 2.3l3.2-2.5v9l-3.2-2.5c-1.2 1.1-2.6 1.9-4.2 2.3-4 .9-8-.7-10.6-4.3z"/><path d="M7.5 11.5v.01"/>',
    egg: '<path d="M12 3.5c3.6 0 6.5 5.4 6.5 9.8a6.5 6.5 0 0 1-13 0c0-4.4 2.9-9.8 6.5-9.8z"/>',
    wheat: '<path d="M12 21V9"/><path d="M12 9c-2.2-.6-3.5-2.4-3.5-4.8 2.2.4 3.5 2 3.5 4.8zM12 9c2.2-.6 3.5-2.4 3.5-4.8-2.2.4-3.5 2-3.5 4.8zM12 14c-2.2-.6-3.5-2.4-3.5-4.8 2.2.4 3.5 2 3.5 4.8zM12 14c2.2-.6 3.5-2.4 3.5-4.8-2.2.4-3.5 2-3.5 4.8zM12 19c-2.2-.6-3.5-2.4-3.5-4.8 2.2.4 3.5 2 3.5 4.8zM12 19c2.2-.6 3.5-2.4 3.5-4.8-2.2.4-3.5 2-3.5 4.8z"/>',
    book: '<path d="M4.5 5.5A2 2 0 0 1 6.5 3.5H19v14H6.5a2 2 0 0 0-2 2z"/><path d="M4.5 19.5a2 2 0 0 0 2 2H19v-4"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M4.2 7.5l2.1 1.2M17.7 15.3l2.1 1.2M4.2 16.5l2.1-1.2M17.7 8.7l2.1-1.2"/><circle cx="12" cy="12" r="7"/>',
    camera: '<path d="M4 8.5h3.2l1.6-2.5h6.4l1.6 2.5H20V19H4z"/><circle cx="12" cy="13.2" r="3.4"/>',
    contrast: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4.5H15"/>',
    dumbbell: '<rect x="4.5" y="6.5" width="3.5" height="11" rx="1.2"/><rect x="16" y="6.5" width="3.5" height="11" rx="1.2"/><path d="M2.5 10v4M21.5 10v4M8 12h8"/>',
    drop: '<path d="M12 3.5c3.5 4.2 6 7.6 6 10.5a6 6 0 0 1-12 0c0-2.9 2.5-6.3 6-10.5z"/>',
    flame: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.3-5.4 3.9-7.6.4 1.6 1.3 2.7 2.4 3.2-.2-3 1.3-5.9 3.4-7.4.1 3.3 3.3 5.6 3.3 9.8 0 4.4-2.6 8.2-6.5 8.2z"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
    alert: '<path d="M12 4 2.8 19.5h18.4z"/><path d="M12 10v4.2M12 17h.01"/>',
    ruler: '<rect x="2.5" y="8" width="19" height="8" rx="2"/><path d="M6.5 8v3M10.5 8v4M14.5 8v3M18.5 8v4"/>',
    repeat: '<path d="M17 2.5l3 3-3 3"/><path d="M4 11.5v-1a5 5 0 0 1 5-5h11"/><path d="M7 21.5l-3-3 3-3"/><path d="M20 12.5v1a5 5 0 0 1-5 5H4"/>',
    gauge: '<path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4-5"/>',
    users: '<circle cx="9" cy="9" r="3.25"/><circle cx="16.5" cy="10" r="2.5"/><path d="M3.5 19c.9-3 3-4.5 5.5-4.5s4.6 1.5 5.5 4.5M15 14.6c2.4-.3 4.6.9 5.5 3.9"/>',
    cycle: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4"/>',
    leaf: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14zM5 19l7-7"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".8"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    box: '<path d="M4 7.5L12 4l8 3.5v9L12 20l-8-3.5z"/><path d="M4 7.5l8 3.5 8-3.5M12 11v9"/>',
    doc: '<path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    trash: '<path d="M4 7h16M10 7V4.5h4V7M6.5 7l1 13h9l1-13"/>',
    scale: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8.5 9.5a5 5 0 0 1 7 0L12 12.5z"/>',
  };
  const ic = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;
  const SLOT_IC = { pa: 'sunrise', lm: 'apple', almoco: 'sun', lanche: 'apple', jantar: 'moon' };
  const SLOT_COL = { pa: '#e8a317', lm: '#2f9e44', almoco: '#e2590f', lanche: '#d6336c', jantar: '#4c5fd5' };

  // ================= Datas =================
  const DOW = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const DOW_S = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const MON_L = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const MON = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const pad = n => String(n).padStart(2, '0');
  const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (k, n) => { const d = fromKey(k); d.setDate(d.getDate() + n); return keyOf(d); };
  const dowIdx = k => (fromKey(k).getDay() + 6) % 7;
  const mondayOf = k => addDays(k, -dowIdx(k));
  const todayKey = () => keyOf(new Date());
  const niceDate = k => { const d = fromKey(k); return `${d.getDate()} ${MON[d.getMonth()]}`; };
  const dayNum = k => fromKey(k).getDate();

  // ================= Cálculos =================
  const r10 = x => Math.round(x / 10) * 10;
  function targets(p = S.profile) {
    const bmr = 10 * p.peso + 6.25 * p.altura - 5 * p.idade - 161; // Mifflin-St Jeor (mulher)
    const tdee = bmr * p.atividade;
    const avg = tdee * (1 - p.defice / 100);
    const nT = p.treinoDias.length, diff = 200; // +200 kcal (hidratos) nos dias de treino
    const rest = r10(avg - (nT * diff) / 7);
    const train = rest + diff;
    const prot = Math.round(2.0 * p.peso);
    const fat = Math.round(0.9 * p.peso);
    const carbs = k => Math.round((k - prot * 4 - fat * 9) / 4);
    return { bmr, tdee, avg, rest, train, prot, fat, cT: carbs(train), cD: carbs(rest) };
  }

  const ALL_MEALS = Object.values(MEALS).flat();
  const R = () => (S.recipes ||= { custom: [], edits: {}, removed: {}, foods: {} });
  const DELETED_FOOD = { n: 'Alimento apagado', kcal: 0, p: 0, c: 0, f: 0, cat: 'Outros' };
  const food = id => FOODS[id] || R().foods[id] || DELETED_FOOD;
  const builtinSlot = id => Object.keys(MEALS).find(sl => MEALS[sl].some(m => m.id === id));
  const slotOfMeal = id => builtinSlot(id) || (R().custom.find(m => m.id === id) || {}).slot;
  function mealsOf(slot) {
    const r = R();
    return [...MEALS[slot].filter(m => !r.removed[m.id]).map(m => r.edits[m.id] || m), ...r.custom.filter(m => m.slot === slot)];
  }
  const mealById = id => R().edits[id] || R().custom.find(m => m.id === id) || ALL_MEALS.find(m => m.id === id);
  // ================= Fotos das receitas (só no telemóvel, em IndexedDB; não pesam no resto dos dados) =================
  const PHOTO_URL = {}; // id da receita → endereço da foto já carregada
  // Miniaturas das fotos guardadas logo no arranque (localStorage): os cartões mostram a foto certa desde o primeiro
  // instante, em vez da imagem por defeito durante os milissegundos que a foto grande demora a carregar
  const THUMB_KEY = 'pulso.miniaturas';
  let THUMB = {};
  try { THUMB = JSON.parse(localStorage.getItem(THUMB_KEY)) || {}; } catch (e) { THUMB = {}; }
  const saveThumbs = () => { try { localStorage.setItem(THUMB_KEY, JSON.stringify(THUMB)); } catch (e) { /* sem espaço: fica só a foto grande */ } };
  async function makeThumb(blob) {
    const src = await createImageBitmap(blob);
    const k = Math.min(1, 360 / Math.max(src.width, src.height));
    const cv = document.createElement('canvas'); cv.width = Math.round(src.width * k); cv.height = Math.round(src.height * k);
    cv.getContext('2d').drawImage(src, 0, 0, cv.width, cv.height);
    return cv.toDataURL('image/jpeg', 0.72);
  }
  const hasPhoto = id => !!(id && (PHOTO_URL[id] || THUMB[id]));
  let photoDB = null;
  const idb = () => (photoDB ||= new Promise((ok, ko) => {
    const r = indexedDB.open('pulso', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('fotos');
    r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error);
  }));
  // devolve true se mudou alguma coisa que se vê (miniaturas novas ou apagadas)
  async function loadPhotos() {
    const blobs = {};
    try {
      const db = await idb();
      await new Promise(ok => {
        const tx = db.transaction('fotos'), req = tx.objectStore('fotos').openCursor();
        req.onsuccess = () => { const c = req.result; if (!c) return; PHOTO_URL[c.key] = URL.createObjectURL(c.value); blobs[c.key] = c.value; c.continue(); };
        tx.oncomplete = ok; tx.onerror = ok;
      });
    } catch (e) { return false; /* sem IndexedDB: ficam as imagens por defeito */ }
    let changed = false;
    for (const id of Object.keys(THUMB)) if (!blobs[id]) { delete THUMB[id]; changed = true; }
    for (const id of Object.keys(blobs)) if (!THUMB[id]) { try { THUMB[id] = await makeThumb(blobs[id]); changed = true; } catch (e) { /* fica a foto grande */ } }
    if (changed) saveThumbs();
    return changed;
  }
  async function setPhoto(id, blob) {
    const db = await idb();
    await new Promise((ok, ko) => { const tx = db.transaction('fotos', 'readwrite'); const st = tx.objectStore('fotos'); blob ? st.put(blob, id) : st.delete(id); tx.oncomplete = ok; tx.onerror = () => ko(tx.error); });
    if (PHOTO_URL[id]) URL.revokeObjectURL(PHOTO_URL[id]);
    if (blob) PHOTO_URL[id] = URL.createObjectURL(blob); else delete PHOTO_URL[id];
    if (blob) { try { THUMB[id] = await makeThumb(blob); } catch (e) { delete THUMB[id]; } } else delete THUMB[id];
    saveThumbs();
  }
  // Reduz a foto (máx. 720 px) para ocupar pouco espaço no telemóvel
  async function shrinkPhoto(file) {
    let src;
    try { src = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch (e) { src = await new Promise((ok, ko) => { const im = new Image(); im.onload = () => ok(im); im.onerror = ko; im.src = URL.createObjectURL(file); }); }
    const w0 = src.width, h0 = src.height, k = Math.min(1, 720 / Math.max(w0, h0));
    const cv = document.createElement('canvas'); cv.width = Math.round(w0 * k); cv.height = Math.round(h0 * k);
    cv.getContext('2d').drawImage(src, 0, 0, cv.width, cv.height);
    return new Promise(ok => cv.toBlob(ok, 'image/jpeg', 0.82));
  }
  // Imagem de cada refeição: a tua foto, ou um degradé com o ícone do tipo de refeição
  const SLOT_GRAD = { pa: ['#ffd36b', '#f59f00'], lm: ['#8ce99a', '#2f9e44'], almoco: ['#ffa94d', '#e8590c'], lanche: ['#faa2c1', '#d6336c'], jantar: ['#91a7ff', '#4c5fd5'] };
  const imgVars = slot => `--g1:${SLOT_GRAD[slot][0]};--g2:${SLOT_GRAD[slot][1]}`;
  // cartões usam a miniatura (já está em memória no arranque); a imagem grande dos detalhes usa a foto inteira
  const photoSrc = (id, big) => (big ? PHOTO_URL[id] || THUMB[id] : THUMB[id] || PHOTO_URL[id]);
  const mealPic = (id, slot, cls = 'm-pic') => id && photoSrc(id, cls === 'ms-pic')
    ? `<span class="${cls} has-photo"><img src="${photoSrc(id, cls === 'ms-pic')}" alt=""></span>`
    : `<span class="${cls}" style="${imgVars(slot)}">${cls !== 'm-band' ? ic(SLOT_IC[slot]) : ''}</span>`;

  const dayState = k => (S.days[k] ||= { swaps: {}, done: {}, agua: 0 });
  const peekDay = k => S.days[k] || { swaps: {}, done: {}, agua: 0 };
  const lmOn = k => { const v = peekDay(k).lm; return v === undefined ? S.profile.lmSempre === true : v; };
  const activeSlots = k => SLOTS.filter(s => !s.opt || lmOn(k));
  const dayType = k => peekDay(k).type || (S.profile.treinoDias.includes(dowIdx(k)) ? 'T' : 'D');

  function sumItems(items) {
    const r = { kcal: 0, p: 0, c: 0, f: 0 };
    for (const it of items) { const F = food(it.f); for (const k in r) r[k] += F[k] * it.g / 100; }
    return r;
  }
  const roundG = (f, g) => f === 'bolachaArroz' ? Math.max(8, Math.round(g / 8) * 8) : Math.max(5, Math.round(g / 5) * 5);

  // ---- Turnos ----
  const calShift = k => { const v = (S.cal && S.cal.url && S.cal.shifts && S.cal.shifts[k]) || null; return v === 'S' ? null : v; };
  const shiftOf = k => { const v = peekDay(k).turno || calShift(k) || 'F'; return v === 'S' ? 'F' : v; }; // 'S' antigo = folga
  const afterNight = k => shiftOf(addDays(k, -1)) === 'N'; // manhã a dormir: não dá para fazer manhã
  function shiftCfg(id) {
    const o = (S.profile.shifts || {})[id] || {};
    return { ...SHIFTS[id], h: o.h || SHIFTS[id].h, t: { ...SHIFTS[id].t, ...(o.t || {}) } };
  }
  const sortTime = t => (t < '05:00' ? '2' : '1') + t; // depois da meia-noite vai para o fim
  function slotInfo(k, slot, isT) {
    const c = shiftCfg(shiftOf(k)), s = SLOTS.find(x => x.id === slot);
    if (afterNight(k) && (slot === 'pa' || slot === 'almoco')) { const pn = shiftCfg('PN'); return { n: pn.l[slot], t: pn.t[slot] }; }
    return { n: c.l[slot] || (isT && s.nt ? s.nt : s.n), t: c.t[slot] };
  }

  // ---- Sobras (cozinhar a dobrar) ----
  // S.links['dia|refeição destino'] = 'dia|refeição origem' (manual) ou 'none' (desligar a regra automática)
  const LK = (k, s) => `${k}|${s}`;
  function autoSource(k, slot) {
    if (S.profile.autoSobras === false) return null;
    const sh = shiftOf(k);
    if (slot === 'almoco' && sh === 'M') return LK(addDays(k, -1), 'jantar');
    if (slot === 'jantar' && sh === 'T') return LK(k, 'almoco');
    return null;
  }
  function sourceOf(k, slot) {
    const man = (S.links || {})[LK(k, slot)];
    if (man === 'none') return null;
    return man || autoSource(k, slot);
  }
  const destCandidates = (k, slot) => slot === 'jantar' ? [[addDays(k, 1), 'almoco'], [addDays(k, 1), 'jantar']]
    : slot === 'almoco' ? [[k, 'jantar'], [addDays(k, 1), 'almoco']] : [];
  const directDests = (k, slot) => destCandidates(k, slot).filter(([k2, s2]) => sourceOf(k2, s2) === LK(k, slot));
  // Inclui cadeias (ex.: almoço → jantar → almoço de amanhã): tudo o que sai da mesma panela
  const destsOf = (k, slot, depth = 0) => depth > 3 ? [] : directDests(k, slot).flatMap(d => [d, ...destsOf(d[0], d[1], depth + 1)]);
  function baseMealId(k, slot) {
    const list = mealsOf(slot), has = id => list.some(m => m.id === id);
    const sw = peekDay(k).swaps[slot];
    if (sw && has(sw)) return sw;
    const def = WEEK[dowIdx(k)][slot];
    if (has(def) || !list.length) return def;
    return list[dowIdx(k) % list.length].id; // a receita do plano foi eliminada: usa outra
  }
  const baseKcal = o => Math.round(sumItems(o.i.map(it => ({ f: it.f, g: Array.isArray(it.g) ? it.g[0] : it.g }))).kcal);
  function recipeTags(o) {
    const r = R(), own = r.custom.some(m => m.id === o.id), edited = !!r.edits[o.id];
    return [`~${baseKcal(o)} kcal`, o.m ? '<span class="mk-m">Marmita</span>' : '', own ? 'criada por ti' : edited ? 'editada' : ''].filter(Boolean).join(' · ');
  }
  function mealIdAt(k, slot, depth = 0) {
    const src = depth < 3 && sourceOf(k, slot);
    if (src) { const [k2, s2] = src.split('|'); return mealIdAt(k2, s2, depth + 1); }
    return baseMealId(k, slot);
  }
  function whenTxt(fromK, k, slot) {
    const d = Math.round((fromKey(k) - fromKey(fromK)) / 864e5);
    const day = d === 0 ? 'de hoje' : d === 1 ? 'de amanhã' : d === -1 ? 'de ontem' : `de ${DOW[dowIdx(k)].toLowerCase()}`;
    return `${slot === 'almoco' ? 'almoço' : 'jantar'} ${day}`;
  }

  function dayPlan(k) {
    const st = peekDay(k), type = dayType(k), t = type === 'T' ? 1 : 0;
    const T = targets();
    const goal = t ? T.train : T.rest;
    const meals = activeSlots(k).map(s => {
      const m = mealById(mealIdAt(k, s.id));
      const items = m.i.map(it => ({ f: it.f, r: it.r, g: Array.isArray(it.g) ? it.g[t] : it.g })).filter(it => it.g > 0);
      return { slot: { ...s, ...slotInfo(k, s.id, t) }, meal: m, items, src: sourceOf(k, s.id), dests: destsOf(k, s.id), fora: (st.fora || {})[s.id] };
    }).sort((a, b) => sortTime(a.slot.t).localeCompare(sortTime(b.slot.t)));
    // Ajusta os hidratos (role c) para bater nas calorias alvo do dia
    const all = meals.flatMap(m => m.items);
    const base = sumItems(all).kcal;
    const carbK = sumItems(all.filter(i => i.r === 'c')).kcal;
    const factor = carbK > 0 ? Math.min(1.7, Math.max(0.6, 1 + (goal - base) / carbK)) : 1;
    for (const it of all) if (it.r === 'c') it.g = roundG(it.f, it.g * factor);
    for (const m of meals) m.tot = sumItems(m.items);
    const tot = sumItems(all);
    const doneMeals = meals.filter(m => st.done[m.slot.id] && !m.fora);
    const done = sumItems(doneMeals.flatMap(m => m.items));
    const foraK = meals.reduce((a, m) => a + (m.fora || 0), 0);
    done.kcal += foraK;
    return { k, type, shift: shiftOf(k), goal, meals, tot, done, foraK, nDone: doneMeals.length + meals.filter(m => m.fora).length, st, T };
  }

  // ================= Formatação =================
  const PLURAL = { fatia: 'fatias', wrap: 'wraps', bolacha: 'bolachas', lata: 'latas', scoop: 'scoops', ovo: 'ovos', 'banana média': 'bananas médias', 'maçã': 'maçãs', 'pêra': 'pêras', laranja: 'laranjas', kiwi: 'kiwis', prato: 'pratos', quadrado: 'quadrados' };
  const plural = (lbl, n) => (n > 1 && PLURAL[lbl]) ? PLURAL[lbl] : lbl;
  function unitHint(f, g) {
    const F = food(f); if (!F.u) return '';
    const q = Math.max(0.25, Math.round((g / F.u[0]) * 4) / 4), w = Math.floor(q);
    const fr = { 0.25: '¼', 0.5: '½', 0.75: '¾' }[q - w] || '';
    return `≈ ${(w || '') + fr} ${plural(F.u[1], q)}`;
  }
  const isLiquid = f => f === 'leite';
  const qty = (f, g) => `${g} ${isLiquid(f) ? 'ml' : 'g'}`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const n0 = n => Math.round(n).toLocaleString('pt-PT');
  const n1 = n => n.toLocaleString('pt-PT', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const macroLine = t => `<span class="macro-inline num"><span><i class="dot bg-p"></i>${n0(t.p)}</span><span><i class="dot bg-c"></i>${n0(t.c)}</span><span><i class="dot bg-f"></i>${n0(t.f)}</span></span>`;
  const steps = txt => txt.split(/(?<=\.)\s+(?=[A-ZÀ-Ú(])/).map(s => `<li>${esc(s)}</li>`).join('');

  // ================= Tema =================
  const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');
  function applyTheme() {
    const t = S.profile.tema || 'light';
    document.documentElement.dataset.theme = t;
    const dark = t === 'dark' || (t === 'auto' && darkMQ.matches);
    document.getElementById('themeColor').setAttribute('content', dark ? '#0e1013' : '#eceef2');
  }
  // Com uma janela aberta, o fundo escurece (preto a 35%): a barra das notificações acompanha o fundo,
  // também enquanto a janela abre, fecha ou é arrastada para baixo (level: 0 = normal, 1 = escurecido)
  let barLevel = 0, barAnim = 0;
  function setBar(level) {
    barLevel = level;
    const t = document.documentElement.dataset.theme, base = t === 'dark' || (t === 'auto' && darkMQ.matches) ? '#0e1013' : '#eceef2';
    const k = 1 - 0.35 * level;
    const hex = '#' + [1, 3, 5].map(n => Math.round(parseInt(base.slice(n, n + 2), 16) * k).toString(16).padStart(2, '0')).join('');
    const meta = document.getElementById('themeColor');
    if (meta.getAttribute('content') !== hex) meta.setAttribute('content', hex);
  }
  // Abrir/fechar: o Chrome já anima sozinho a mudança de cor da barra; se a mudarmos a cada imagem ele
  // recomeça essa animação e fica para trás. Por isso damos logo a cor final, ao mesmo tempo que o fundo começa.
  function barTo(on) { cancelAnimationFrame(barAnim); setBar(on ? 1 : 0); }
  // Ao arrastar: a barra muda ao mesmo tempo que o fundo, em cada movimento do dedo
  function barDrag(level) { setBar(level); }
  darkMQ.addEventListener('change', applyTheme);
  applyTheme();

  // ================= Navegação =================
  // ================= Atualizar o ecrã sem o redesenhar todo =================
  // Quando nada muda de página, o HTML novo é aplicado por cima do que já existe: só mudam os textos e atributos
  // diferentes, por isso as barras, anéis e vistos deslizam (transições CSS) em vez de saltarem.
  const NATIVE_HTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  function morphChildren(a, b) {
    const an = [...a.childNodes], bn = [...b.childNodes];
    bn.forEach((y, i) => {
      const x = an[i];
      if (!x) { a.appendChild(y); return; }
      if (x.nodeType !== y.nodeType || x.nodeName !== y.nodeName) { a.replaceChild(y, x); return; }
      if (x.nodeType !== 1) { if (x.nodeValue !== y.nodeValue) x.nodeValue = y.nodeValue; return; }
      for (const at of [...x.attributes]) if (!y.hasAttribute(at.name)) x.removeAttribute(at.name);
      for (const at of [...y.attributes]) if (x.getAttribute(at.name) !== at.value) x.setAttribute(at.name, at.value);
      morphChildren(x, y);
      const focused = x === document.activeElement;
      if (x.tagName === 'INPUT') { if (x.type === 'checkbox' || x.type === 'radio') x.checked = y.checked; else if (!focused && x.value !== y.value) x.value = y.value; }
      if ((x.tagName === 'TEXTAREA' || x.tagName === 'SELECT') && !focused && x.value !== y.value) x.value = y.value;
    });
    for (let i = an.length - 1; i >= bn.length; i--) an[i].remove();
  }
  let morphNext = false;
  function smartHTML(el) {
    Object.defineProperty(el, 'innerHTML', {
      configurable: true,
      get() { return NATIVE_HTML.get.call(this); },
      set(html) {
        if (!morphNext || !this.firstChild) return NATIVE_HTML.set.call(this, html);
        const tpl = document.createElement('template');
        tpl.innerHTML = html;
        morphChildren(this, tpl.content);
      },
    });
  }
  // Números que contam até ao valor novo
  const countPrev = {};
  // jump = true (mudar de dia, de aba…): os números aparecem logo com o valor certo, sem contar
  function animateCounts(jump = false) {
    const still = jump || matchMedia('(prefers-reduced-motion: reduce)').matches;
    $view.querySelectorAll('[data-count]').forEach(el => {
      const key = el.dataset.count, to = +el.dataset.v, from = countPrev[key];
      countPrev[key] = to;
      if (still || from === undefined || from === to) return;
      el.textContent = n0(from); // começa no valor anterior (sem mostrar o final por um instante)
      const t0 = performance.now(), dur = 950;
      const step = now => {
        if (!el.isConnected || +el.dataset.v !== to) return;
        // exponencial: arranca rápido e abranda cada vez mais até parar no valor certo
        const k = Math.min(1, (now - t0) / dur), e = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
        el.textContent = n0(from + (to - from) * e);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  const $view = document.getElementById('view');
  const $hdr = document.getElementById('hdr');
  const $top = document.getElementById('topbar');
  const $tabs = document.getElementById('tabs');
  smartHTML($view); smartHTML($hdr);
  const TABS = [['hoje', 'Hoje', 'plate'], ['semana', 'Semana', 'cal'], ['compras', 'Compras', 'bag'], ['progresso', 'Progresso', 'chart'], ['perfil', 'Perfil', 'user']];
  let tab = 'hoje', sub = null, curDay = todayKey(), weekOffset = 0, shopMode = 'w0', range = 30;
  let semBack = null; // dia do Hoje guardado enquanto há uma refeição da Semana aberta
  // Percurso: os ecrãs por onde passaste (para o "voltar" refazer o caminho ao contrário).
  // screenDay: o dia com que o Hoje atual foi aberto (hoje, ou o dia que abriste na Semana)
  let navStack = [], screenDay = todayKey();
  const navSnap = () => ({ tab, sub, subParent, recCat, curDay: semBack ?? curDay, weekOffset, shopMode, range, screenDay, y: Math.round(window.scrollY) });
  const NAV_KEY = 'planoLean.nav';

  $tabs.innerHTML = TABS.map(([id, l, i]) => `<button data-tab="${id}" class="press">${ic(i)}<span>${l}</span></button>`).join('');
  $tabs.addEventListener('click', e => {
    const b = e.target.closest('[data-tab]'); if (!b) return;
    const t = b.dataset.tab;
    if (t !== tab) return go(t);
    // Tocar na aba em que já estás não volta a abrir a mesma página. Só faz algo útil quando há para onde voltar:
    if (sub) { sub = null; subParent = null; recCat = null; render('pop'); window.scrollTo(0, 0); return; } // numa página do Perfil → início do Perfil
    if (t === 'hoje' && curDay !== todayKey()) { const dir = todayKey() > curDay ? 'next' : 'prev'; curDay = todayKey(); render(dir); } // noutro dia → hoje
    if (t === 'semana' && weekOffset !== 1) { const dir = weekOffset < 1 ? 'next' : 'prev'; weekOffset = 1; render(dir); } // noutra semana → próxima
  });

  try { localStorage.removeItem('pulso.look'); sessionStorage.removeItem('pulso.look'); } catch (e) { /* restos da pré-visualização dos visuais */ }

  function go(t, subpage = null, day = null) {
    if (t !== tab || subpage) navStack.push(navSnap());
    if (t === 'hoje') curDay = day || todayKey(); // a aba Hoje abre sempre no dia de hoje (ou no dia que abriste na Semana)
    if (t === 'hoje') screenDay = curDay;
    if (t === 'semana' && tab !== 'semana') weekOffset = 1; // a Semana serve para preparar a próxima: abre sempre nela
    tab = t; sub = subpage;
    render('fade'); window.scrollTo(0, 0);
  }
  // anim: 'fade' (mudar de aba) · 'push' (entrar numa página) · 'pop' (voltar) · 'next' / 'prev' (outro dia ou semana)
  const V_ANIM = ['v-fade', 'v-push', 'v-pop', 'v-next', 'v-prev'];
  let slideT = 0;
  function render(anim) {
    $tabs.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    // Mudar de dia (Hoje) ou de semana (Semana): o atual sai por um lado enquanto o novo entra pelo outro (carrossel)
    const slide = (tab === 'hoje' || tab === 'semana') && (anim === 'next' || anim === 'prev');
    if (slide) { clearTimeout(slideT); $view.querySelectorAll('.day-pane.ghost').forEach(g => g.remove()); } // cancela a passagem anterior se ainda estava a meio
    const oldPane = slide ? $view.querySelector('.day-pane:not(.ghost)') : null;
    // se veio de arrastar com o dedo, a saída e a entrada continuam de onde o dedo largou (lido antes de limpar)
    const dragDx = oldPane && oldPane.dataset.drag ? oldPane.style.getPropertyValue('--dx') : '';
    if (oldPane) { oldPane.classList.remove('in-left', 'in-right'); oldPane.style.removeProperty('--dx'); delete oldPane.dataset.drag; }
    const ghost = oldPane ? oldPane.cloneNode(true) : null;
    if (ghost) { ghost.style.removeProperty('transform'); ghost.style.removeProperty('transition'); if (dragDx) ghost.style.setProperty('--dx', dragDx); }
    morphNext = !anim || slide; // no carrossel só se atualiza o que muda (título e botões ficam quietos)
    ({ hoje: renderHoje, semana: renderSemana, compras: renderCompras, progresso: renderProgresso, perfil: renderPerfil })[tab]();
    morphNext = false;
    if (anim) {
      const cls = 'v-' + (anim === true ? 'fade' : anim);
      for (const el of ghost ? [$hdr, $view.querySelector('.wk-lbl')].filter(Boolean) : [$view, $hdr]) { el.classList.remove(...V_ANIM); void el.offsetWidth; el.classList.add(cls); }
      if (ghost) {
        $view.classList.remove(...V_ANIM);
        const stage = $view.querySelector('.day-stage'), pane = stage.querySelector('.day-pane');
        ghost.classList.remove('in-left', 'in-right', 'out-left', 'out-right');
        ghost.classList.add('ghost', anim === 'next' ? 'out-left' : 'out-right');
        ghost.setAttribute('aria-hidden', 'true');
        pane.classList.add(anim === 'next' ? 'in-right' : 'in-left');
        if (dragDx) pane.style.setProperty('--dx', dragDx);
        stage.appendChild(ghost);
        slideT = setTimeout(() => { ghost.remove(); pane.classList.remove('in-right', 'in-left'); pane.style.removeProperty('--dx'); }, 450);
      }
    }
    animateCounts(!!anim); // só conta ao marcar refeições, água, etc. (no mesmo dia)
    onScroll();
    syncGuard();
    try { sessionStorage.setItem(NAV_KEY, JSON.stringify({ tab, sub, subParent, recCat, curDay: semBack ?? curDay, weekOffset, shopMode, range, screenDay, stack: navStack, on: todayKey() })); } catch (e) { /* sem armazenamento */ }
  }
  function header(over, title, actions = '') {
    $hdr.innerHTML = `<div><div class="over">${over}</div><h1>${title}</h1></div><div class="hdr-actions">${actions}</div>`;
    $top.textContent = title.replace(/<[^>]+>/g, '');
  }
  // na Semana não aparece a pastilha com o nome da aba ao descer
  const onScroll = () => { $top.classList.toggle('show', window.scrollY > 56 && !(tab === 'semana' && !sub)); document.documentElement.classList.toggle('scrolled', window.scrollY > 4); };
  window.addEventListener('scroll', onScroll, { passive: true });

  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 1700);
  }

  // ================= Folha (bottom sheet) =================
  let sheetEl = null, sheetBody = null, backEl = null, sheetRender = null, dragging = false; // sheetBody: a parte de dentro, a que desliza
  let sheetNoClose = false;
  function openSheet(renderFn, { noClose = false } = {}) {
    sheetRender = renderFn; sheetNoClose = noClose;
    if (!sheetEl) {
      backEl = document.createElement('div'); backEl.className = 'backdrop';
      sheetEl = document.createElement('div'); sheetEl.className = 'sheet'; sheetEl.setAttribute('role', 'dialog'); sheetEl.setAttribute('aria-modal', 'true');
      // A janela (cantos arredondados) não desliza; quem desliza é uma caixa por dentro.
      // Assim o Android recorta sempre os cantos (numa caixa com scroll às vezes deixava-os retos).
      sheetBody = document.createElement('div'); sheetBody.className = 'sheet-in'; sheetEl.appendChild(sheetBody);
      smartHTML(sheetBody);
      document.body.append(backEl, sheetEl);
      backEl.addEventListener('click', closeSheet);
      sheetEl.addEventListener('click', onSheetClick);
      sheetEl.addEventListener('submit', onSheetSubmit);
      sheetEl.addEventListener('input', onRecipeInput);
      sheetEl.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'bc_in') { e.preventDefault(); lookupBarcode(e.target.value); } });
      sheetEl.addEventListener('change', onRecipeInput);
      sheetEl.addEventListener('pointerdown', e => {
        const b = e.target.closest('[data-step]'); if (!b) return;
        e.preventDefault(); stopHold();
        const d = +b.dataset.step; stepWeight(d);
        holdT = setTimeout(() => { holdT = setInterval(() => stepWeight(d), 70); }, 450);
      });
      let y0 = null;
      sheetEl.addEventListener('touchstart', e => { y0 = sheetBody.scrollTop <= 0 ? e.touches[0].clientY : null; dragging = false; }, { passive: true });
      // Arrastar a janela para baixo (só a partir do topo do conteúdo). Enquanto se arrasta, o conteúdo não desliza:
      // assim, ao voltar a subir o dedo, a janela só regressa ao sítio (antes também fazia scroll ao mesmo tempo).
      sheetEl.addEventListener('touchmove', e => {
        if (y0 == null) return; const dy = e.touches[0].clientY - y0;
        if (!dragging && dy <= 0) return; // a subir desde o início: é scroll normal do conteúdo
        if (e.cancelable) e.preventDefault();
        if (!dragging) { dragging = true; sheetEl.style.transition = 'none'; backEl.style.transition = 'none'; sheetEl.style.willChange = 'transform'; }
        const d = Math.max(0, dy), lv = Math.max(0, 1 - d / 450);
        sheetEl.style.transform = `translateY(${d}px)`; backEl.style.opacity = String(lv); barDrag(lv);
      }, { passive: false });
      sheetEl.addEventListener('touchend', e => {
        if (y0 == null) return; const dy = e.changedTouches[0].clientY - y0, wasDrag = dragging; y0 = null;
        dragging = false;
        if (!wasDrag) return; // foi só scroll do conteúdo
        sheetEl.style.willChange = '';
        sheetEl.style.transition = ''; sheetEl.style.transform = ''; backEl.style.transition = ''; backEl.style.opacity = '';
        if (dy > 110) closeSheet(); else barTo(true); // não fechou: volta ao sítio e a barra volta a escurecer
      });
    }
    sheetFresh = true; paintSheet(); sheetFresh = false;
    backEl.hidden = sheetEl.hidden = false;
    void sheetEl.offsetHeight; // garante a animação de entrada depois de display:none
    backEl.classList.add('open'); sheetEl.classList.add('open'); barTo(true);
    sheetBody.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    syncGuard();
  }
  let sheetFresh = false;
  function paintSheet() {
    // Sem botão X: fecha-se a deslizar para baixo, a tocar fora, com o "voltar" do telemóvel ou nos botões da própria folha
    morphNext = !sheetFresh;
    sheetBody.innerHTML = `<div class="grabber" aria-hidden="true"></div>${sheetRender()}`;
    morphNext = false;
    syncGuard();
  }
  let pendingConfirm = null;
  function askConfirm({ title, text, ok, onOk, okCls = 'danger-fill' }) {
    pendingConfirm = onOk;
    openSheet(() => `<div class="over">Confirmar</div><h2>${title}</h2>
      <div class="prose"><p>${text}</p></div>
      <div class="btn-stack"><button class="btn ${okCls} press" data-act="confirm-ok">${ok}</button>
      <button class="btn secondary press" data-act="close">Cancelar</button></div>`, { noClose: true });
  }
  function closeSheet() {
    if (typeof stopScan === 'function') stopScan();
    if (!sheetEl) return;
    backEl.classList.remove('open'); sheetEl.classList.remove('open'); barTo(false);
    if (semBack !== null) { curDay = semBack; semBack = null; }
    syncGuard();
    document.body.style.overflow = '';
    setTimeout(() => { if (!sheetEl.classList.contains('open')) { backEl.hidden = sheetEl.hidden = true; } }, 380);
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

  // ================= HOJE =================
  function dayTitle(k) {
    const diff = Math.round((fromKey(k) - fromKey(todayKey())) / 864e5);
    return diff === 0 ? 'Hoje' : diff === 1 ? 'Amanhã' : diff === -1 ? 'Ontem' : DOW[dowIdx(k)];
  }
  function shiftPhrase(id) {
    const c = shiftCfg(id);
    return id === 'F' ? 'Folga' : `Turno da ${c.n.toLowerCase()}`;
  }
  function renderHoje() {
    const P = dayPlan(curDay), T = P.T, isT = P.type === 'T';
    const isToday = curDay === todayKey(), future = curDay > todayKey();
    const sc = shiftCfg(P.shift);
    header(`${DOW[dowIdx(curDay)]}, ${niceDate(curDay)}`, dayTitle(curDay),
      (isToday ? '' : `<button class="pill-btn press" data-act="today">Hoje</button>`) +
      `<button class="shift-btn press" style="--sc:${sc.col}" data-act="dayset" aria-label="Turno do dia: ${sc.n}, ${sc.h}. Mudar turno e treino"><span class="sb-ic">${ic(SHIFT_IC[P.shift] || 'leaf')}</span><span class="sb-t"><b>${sc.n}</b></span>${ic('chevR', 'sb-chev')}</button>`);

    const mon = mondayOf(curDay);
    let strip = '<div class="strip" id="strip">';
    for (let i = 0; i < 7; i++) {
      const k = addDays(mon, i), st = peekDay(k), sh = shiftOf(k);
      const act = activeSlots(k), nDone = act.filter(s => (st.done || {})[s.id] || (st.fora || {})[s.id]).length;
      strip += `<button class="${k === curDay ? 'sel' : ''} ${k === todayKey() ? 'today' : ''} ${dayType(k) === 'T' ? 'train' : ''}" style="--lv:${Math.round((nDone / act.length) * 100)}%" data-act="day" data-k="${k}" aria-label="${DOW[i]} ${niceDate(k)}, ${SHIFTS[sh].n}">
        <span class="wd">${DOW_S[i]}</span><span class="ring" style="--pct:${(nDone / act.length) * 100}"><span class="dn num">${dayNum(k)}</span></span><span class="mk" style="color:${SHIFTS[sh].col}">${sh}</span></button>`;
    }
    strip += '</div>';

    const left = P.goal - P.done.kcal;
    const pct = Math.min(100, (P.done.kcal / P.goal) * 100);
    const cG = isT ? T.cT : T.cD;
    const mac = (lbl, cls, v, g) => `<div><div class="m-lbl"><i class="dot bg-${cls}"></i>${lbl}</div>
      <div class="m-val num"><b data-count="m-${cls}" data-v="${Math.round(v)}">${n0(v)}</b> / ${g} g</div><div class="track thin"><i class="bg-${cls}" style="width:${Math.min(100, (v / g) * 100)}%"></i></div></div>`;

    const leftNum = `<b class="num" data-count="left" data-v="${Math.round(Math.abs(left))}">${n0(Math.abs(left))}</b>`;
    const leftLbl = left >= 0 ? 'kcal por comer' : 'kcal acima da meta';
    const eatenTxt = `<span>Comido <b data-count="eaten" data-v="${Math.round(P.done.kcal)}">${n0(P.done.kcal)}</b> kcal</span><span>Meta <b>${n0(P.goal)}</b> kcal</span>`;
    let h = `
      <section class="card energy">
        <div class="energy-top">
          <div><div class="big num">${leftNum}</div><div class="big-lbl">${leftLbl}</div></div>
          <div class="daytype ${isT ? 'is-train' : 'is-rest'}">
            <span class="dt-ic">${ic(isT ? 'dumbbell' : 'moon')}</span>
            <span><b>${isT ? 'Dia de treino' : 'Dia de descanso'}</b><small>${isT ? `+${T.train - T.rest} kcal` : 'Recuperação'}</small></span>
          </div>
        </div>
        <div class="track"><i style="width:${pct}%"></i></div>
        <div class="meta num">${eatenTxt}</div>
        <div class="macros3">${mac('Proteína', 'p', P.done.p, T.prot)}${mac('Hidratos', 'c', P.done.c, cG)}${mac('Gordura', 'f', P.done.f, T.fat)}</div>
      </section>`;
    // Notas dos turnos: tocar minimiza (fica só o título) ou volta a mostrar a dica; a escolha fica guardada
    // cada nota (a do turno e a de depois de uma noite) abre e fecha sozinha; a escolha fica guardada
    const notaMin = S.profile.notaMin || (S.profile.notaTurnoMin ? { turno: true, pn: true } : {});
    const shiftNote = (key, col, icon, title, tip) => `<button class="note shiftnote ${notaMin[key] ? 'min' : ''}" style="--sc:${col}" data-act="shiftnote" data-n="${key}" aria-expanded="${!notaMin[key]}">${ic(icon)}<div><b>${title}</b><span class="sn-tip">${tip}</span></div>${ic('chevR', 'sn-chev')}</button>`;
    if (sc.tip) h += shiftNote('turno', sc.col, 'clock', `${shiftPhrase(P.shift)} · ${sc.h}`, sc.tip);
    if (afterNight(curDay)) { const pn = shiftCfg('PN'); h += shiftNote('pn', pn.col, 'moon', 'Depois de uma noite', pn.tip); }

    // Refeições num só cartão: título, barra com uma parte por refeição (enche ao marcar) e os cartões encaixados
    const anim = animSlot; animSlot = null;
    h += `<section class="meal-box ${anim ? 'm-anim' : ''}"><h2 class="sec-h">Refeições <small class="num">${P.nDone} de ${P.meals.length}</small></h2>
      <div class="meal-prog" aria-hidden="true">${P.meals.map(m => `<i class="${P.st.done[m.slot.id] || m.fora ? 'on' : ''}" style="--c1:${SLOT_GRAD[m.slot.id][1]}"></i>`).join('')}</div><div class="mcards">`;
    P.meals.forEach((m, mi) => {
      const id = m.slot.id, done = !!P.st.done[id] || !!m.fora;
      let extra = '';
      if (!m.fora && m.src) { const [k2, s2] = m.src.split('|'); extra = `<span class="lo">${ic('box')}Sobras do ${whenTxt(curDay, k2, s2)}</span>`; }
      else if (!m.fora && m.dests.length) extra = `<span class="lo">${ic('pot')}Fazer ×${m.dests.length + 1} · ${m.dests.map(([k2, s2]) => whenTxt(curDay, k2, s2)).join(' e ')}</span>`;
      // cada refeição num cartão: imagem à esquerda com recorte na diagonal e faixa; o texto acompanha o recorte.
      // Tocar na imagem marca como comido; o resto do cartão (com a seta) abre a receita. Em dias que ainda não chegaram não se marca.
      const mid = m.fora ? null : m.meal.id;
      h += `<div class="row tap meal-row mrow ${done ? 'done' : ''} ${id === anim ? 'm-anim' : ''} ${mi === P.meals.length - 1 ? 'm-last' : ''}" data-act="meal" data-slot="${id}">
        ${mealPic(mid, id)}${mealPic(mid, id, 'm-band')}
        ${future && !done ? '' : `<button class="m-tap" data-act="done" data-slot="${id}" aria-pressed="${done}" aria-label="${done ? 'Desmarcar' : 'Marcar'} ${m.slot.n} como comido"><span class="m-done">${ic('check')}<span>Feita</span></span><span class="m-hollow"></span></button>`}
        <div class="row-main"><span class="m-shape" aria-hidden="true"></span>
          <div class="over">${m.slot.n} · ${m.slot.t}</div>
          <div class="ttl">${m.fora ? 'Outra refeição' : esc(m.meal.n)}</div>
          <div class="sub num">${m.fora ? `Fora do plano · ~${m.fora} kcal` : `${n0(m.tot.kcal)} kcal &nbsp;${macroLine(m.tot)}`}</div>
          ${extra}
        </div>
        ${ic('chevR', 'chev-r')}</div>`;
    });
    if (!lmOn(curDay)) h += `<button class="row tap add-row" data-act="lmadd">${ic('plus')}<div class="row-main"><div class="ttl">Juntar lanche da manhã</div><div class="sub">Só hoje · as outras refeições ajustam-se</div></div></button>`;
    h += `</div></section>`;
    if (P.foraK) h += `<p class="cap">Refeições fora do plano contam só nas calorias (estimativa). Não faz mal — o que conta é a média da semana.</p>`;

    const agua = P.st.agua || 0;
    // Hidratação no mesmo estilo das refeições: cartão branco com título e o bloco dos copos por dentro
    h += `<section class="meal-box water-box"><h2 class="sec-h">Hidratação <small class="num">${agua} de 10 copos</small></h2>
      <div class="water-in">
        <span class="w-pic">${ic('drop')}</span>
        <div class="row-main"><div class="num w-amt"><b>${(agua * 0.25).toLocaleString('pt-PT', { maximumFractionDigits: 2 })} L</b> <span>de 2,5 L</span></div>
          <div class="glasses" aria-hidden="true">${Array.from({ length: 10 }, (_, i) => `<i class="${i < agua ? 'on' : ''}"></i>`).join('')}</div></div>
        <div class="stepper"><button class="press" data-act="agua" data-d="-1" aria-label="Menos um copo">${ic('minus')}</button><button class="press" data-act="agua" data-d="1" aria-label="Mais um copo">${ic('plus')}</button></div>
      </div></section>`;
    // O conteúdo do dia fica num "palco" para poder deslizar de lado ao mudar de dia (a barra dos dias fica parada)
    $view.innerHTML = `${strip}<div class="day-stage"><div class="day-pane">${h}</div></div>`;
    fitMealCards();
  }
  // Cartões das refeições: o texto segue o recorte (shape-outside) e fica centrado na altura do cartão.
  // Com muito texto (nome comprido + "Fazer ×2 · …"), a letra vai diminuindo até caber; o cartão mantém a altura.
  const CARD_H = 104, TEXT_ZOOM = [1, 0.95, 0.9, 0.86, 0.82, 0.78];
  function fitMealCards(root = $view) {
    for (const c of root.querySelectorAll('.mrow')) {
      const m = c.querySelector('.row-main'), sh = m.querySelector('.m-shape');
      // altura do texto com o cartão e o espaço de cima dados (as linhas mudam de largura com a altura, por causa do recorte)
      const textH = (H, pad) => {
        c.style.height = H + 'px'; sh.style.height = H + 'px';
        m.style.paddingTop = pad + 'px'; sh.style.marginTop = -pad + 'px';
        return m.lastElementChild.getBoundingClientRect().bottom - m.getBoundingClientRect().top - pad;
      };
      const center = H => { let pad = 12, h = 0; for (let k = 0; k < 4; k++) { h = textH(H, pad); const next = Math.max(6, Math.round((H - h) / 2)); if (Math.abs(next - pad) < 1) break; pad = next; } return h; };
      let fits = false;
      for (const z of TEXT_ZOOM) {
        m.style.setProperty('--z', z);
        if (center(CARD_H) + 12 <= CARD_H) { fits = true; break; }
      }
      if (fits) continue;
      // mesmo com a letra mais pequena não cabe: só aí o cartão cresce
      let H = CARD_H;
      for (let k = 0; k < 4; k++) { const need = Math.ceil(center(H) + 16); if (need <= H) break; H = need; }
    }
  }
  if (document.fonts) document.fonts.ready.then(() => fitMealCards());
  window.addEventListener('resize', () => fitMealCards());

  let msDoses = 1; // doses a ver nos ingredientes (só na janela de detalhes)
  function mealSheet(slotId) {
    return () => {
      const P = dayPlan(curDay), m = P.meals.find(x => x.slot.id === slotId), isT = P.type === 'T', T = P.T;
      const done = !!P.st.done[slotId] || !!m.fora, future = curDay > todayKey();
      const mode = sheetEl.dataset.mode;
      const col = SLOT_GRAD[slotId][1], mid = m.fora ? null : m.meal.id;
      const sec = (title, body, extra = '') => `<section class="ms-sec" style="--slc:${col}"><h3>${title}</h3>${body}</section>${extra}`;

      // Imagem grande (a tua foto ou a cor da refeição); aqui não mostra se já foi comida
      let h = `<div class="ms-hero">
        ${mealPic(mid, slotId, 'ms-pic')}
        ${m.fora ? '' : `<label class="ms-photo">${ic('camera')}${hasPhoto(mid) ? 'Mudar foto' : 'Foto'}<input type="file" accept="image/*" hidden data-photo="${mid}"></label>`}
        <div class="ms-cap"><div class="over">${m.slot.n} · ${m.slot.t}${m.meal.m ? ` <span class="ms-tag">${ic('box')}Marmita</span>` : ''}</div><h2>${esc(m.meal.n)}</h2></div>
      </div>`;
      if (m.fora) h += `<div class="note" style="margin:0 0 12px">${ic('info')}<div>Registaste outra refeição (~${m.fora} kcal). <button class="link" data-act="unfora" data-slot="${slotId}">Desfazer</button></div></div>`;

      // Calorias e macros como no cartão do Hoje: a barra mostra quanto esta refeição dá da meta do dia
      const cG = isT ? T.cT : T.cD;
      const mac = (lbl, cls, v, g) => `<div><div class="m-lbl"><i class="dot bg-${cls}"></i>${lbl}</div><div class="m-val num"><b>${n0(v)}</b> g</div><div class="track thin"><i class="bg-${cls}" style="width:${Math.min(100, (v / g) * 100)}%"></i></div></div>`;
      h += `<section class="card ms-macros"><div class="ms-kcal num"><b>${n0(m.tot.kcal)}</b><span>kcal · ${Math.round((m.tot.kcal / P.goal) * 100)}% do dia</span></div>
        <div class="macros3">${mac('Proteína', 'p', m.tot.p, T.prot)}${mac('Hidratos', 'c', m.tot.c, cG)}${mac('Gordura', 'f', m.tot.f, T.fat)}</div></section>`;

      // Totais a cozinhar quando esta refeição também serve outras
      const cook = {};
      if (!m.src && m.dests.length) {
        for (const it of m.items) cook[it.f] = it.g;
        for (const [k2, s2] of m.dests) for (const it of dayPlan(k2).meals.find(x => x.slot.id === s2).items) cook[it.f] = (cook[it.f] || 0) + it.g;
      }
      if (m.src) {
        const [k2, s2] = m.src.split('|');
        h += `<div class="note good">${ic('box')}<div><b>Sobras do ${whenTxt(curDay, k2, s2)}</b><br>Já está feito — é só aquecer. <button class="link" data-act="unlink" data-slot="${slotId}">Cozinhar outra coisa</button></div></div>`;
      } else if (m.dests.length) {
        h += `<div class="note good">${ic('pot')}<div><b>Cozinhar ×${m.dests.length + 1}</b><br>Esta dose + ${m.dests.map(([k2, s2]) => whenTxt(curDay, k2, s2)).join(' e ')}. Por baixo de cada ingrediente está o total a cozinhar.</div></div>`;
      }
      if (isT && m.meal.treino && !m.src) h += `<div class="note train">${ic('flame')}<div>${esc(m.meal.treino)}</div></div>`;

      // Ingredientes para 1 ou mais doses (− / +); com 1 dose mostra também o total a cozinhar quando serve outras refeições
      const nd = msDoses, scale = g => Math.round(g * nd);
      const dosesCtl = `<span class="ms-doses num"><button class="press" data-act="doses" data-d="-1" aria-label="Menos uma dose" ${nd <= 1 ? 'disabled' : ''}>${ic('minus')}</button><b>${nd} ${nd === 1 ? 'dose' : 'doses'}</b><button class="press" data-act="doses" data-d="1" aria-label="Mais uma dose" ${nd >= 8 ? 'disabled' : ''}>${ic('plus')}</button></span>`;
      h += sec(`<span>${m.src ? 'A tua dose' : 'Ingredientes'}</span>${dosesCtl}`, `<div class="list">${m.items.map(it => {
        const g = scale(it.g), hint = nd === 1 && cook[it.f] ? `cozinhar ${qty(it.f, cook[it.f])}` : unitHint(it.f, g);
        return `<div class="row ing"><div class="row-main">${esc(food(it.f).n)}</div><div class="q num">${qty(it.f, g)}${hint ? `<small>${hint}</small>` : ''}</div></div>`;
      }).join('')}</div>`);
      if (!m.src) h += sec('Preparação', `<div class="list"><ol class="steps">${steps(m.meal.prep)}</ol></div>`);

      // Cozinhar a dobrar
      if (!m.src && !m.fora && (slotId === 'almoco' || slotId === 'jantar')) {
        h += sec('Cozinhar a dobrar', `<div class="list">${destCandidates(curDay, slotId).map(([k2, s2]) => {
          const on = sourceOf(k2, s2) === LK(curDay, slotId);
          const sh = shiftOf(k2), info = slotInfo(k2, s2, false);
          return `<button class="row tap" data-act="link" data-slot="${slotId}" data-dk="${k2}" data-ds="${s2}" aria-pressed="${on}">
            <div class="row-main"><div class="ttl" style="font-weight:500">Para o ${whenTxt(curDay, k2, s2)}</div>
            <div class="sub">${info.n} · ${info.t}${sh !== 'F' ? ` · ${shiftPhrase(sh).toLowerCase()}` : ''}</div></div>
            <span class="switch ${on ? 'on' : ''}"></span></button>`;
        }).join('')}</div><p class="cap">A refeição de destino passa a ser a mesma e a lista de compras conta as duas doses.</p>`);
      }

      if (mode === 'alts') {
        const noTurno = /turno/i.test(m.slot.n);
        const opts = mealsOf(slotId).map((o, i) => ({ o, i })).sort((a, b) => (noTurno ? (b.o.m ? 1 : 0) - (a.o.m ? 1 : 0) : 0) || a.i - b.i).map(x => x.o);
        h += sec(`Escolher outra opção${noTurno ? ' <small>marmitas primeiro</small>' : ''}`, `<div class="list">${opts.map(o => {
          const sel = o.id === m.meal.id;
          return `<button class="row tap alt ${sel ? 'sel' : ''}" data-act="pick" data-slot="${slotId}" data-id="${o.id}"><div class="row-main"><div class="ttl">${esc(o.n)}</div><div class="sub">${recipeTags(o)}</div></div>${sel ? ic('check', 'ok') : ''}</button>`;
        }).join('')}<button class="row tap add-row" data-act="rnew" data-slot="${slotId}" data-pick="1">${ic('plus')}<div class="row-main"><div class="ttl">Nova receita</div><div class="sub">Fica logo escolhida para este dia</div></div></button></div>`);
      }
      if (mode === 'fora') {
        h += sec('Comi outra coisa <small>quanto, mais ou menos?</small>', `<div class="list">${FORA.map(o => `
          <button class="row tap" data-act="fora" data-slot="${slotId}" data-kcal="${o.kcal}"><div class="row-main"><div class="ttl">${o.n} <span class="num" style="color:var(--ink-3);font-weight:500">· ~${o.kcal} kcal</span></div><div class="sub">${o.d}</div></div></button>`).join('')}</div>
          <p class="cap">Não precisa de ser exato. Se puderes, escolhe algo com proteína (carne, peixe, ovos, iogurte).</p>`);
      }

      // Ações: marcar em destaque; as outras em quadrados lado a lado
      const acts = [
        mode === 'alts' ? '' : `<button class="ms-act press" data-act="mode" data-v="alts">${ic('swap')}<span>Trocar</span></button>`,
        m.fora || mode === 'fora' || future ? '' : `<button class="ms-act press" data-act="mode" data-v="fora">${ic('plate')}<span>Comi outra</span></button>`,
      ].filter(Boolean);
      // dias que ainda não chegaram: dá para trocar, mas não para marcar como comido nem registar outra coisa
      h += `<div class="btn-stack">${m.fora || (future && !done) ? '' : `<button class="btn primary press" data-act="done" data-slot="${slotId}">${done ? 'Desmarcar' : ic('check') + ' Marcar como comido'}</button>`}</div>
        ${acts.length ? `<div class="ms-actions" style="--n:${acts.length}">${acts.join('')}</div>` : ''}
        ${slotId === 'lm' ? `<div class="btn-stack" style="margin-top:10px"><button class="btn danger press" data-act="lmrem">Hoje não faço lanche da manhã</button></div>` : ''}`;
      return h;
    };
  }

  function calNote(k) {
    if (!S.cal || !S.cal.url) return '';
    const c = calShift(k), man = peekDay(k).turno;
    if (man && man !== (c || 'F')) return `<div class="note">${ic('cal')}<div>No calendário: <b>${c ? SHIFTS[c].n : 'sem turno'}</b>. Mudaste à mão. <button class="link" data-act="calreset" data-k="${k}">Voltar ao calendário</button></div></div>`;
    return `<div class="note good">${ic('cal')}<div>${c ? "Turno lido do teu calendário." : "Sem turno no calendário para este dia."} Se mudares aqui, a tua escolha fica por cima.</div></div>`;
  }
  // Turno e treino do dia: os quatro turnos em círculos com o seu ícone e cor; o escolhido fica cheio
  const SHIFT_IC = { M: 'sunrise', T: 'sun', N: 'moon', F: 'leaf' };
  function daySheet(k) {
    return () => {
      const cur = shiftOf(k), isT = dayType(k) === 'T';
      return `<div class="over">${DOW[dowIdx(k)]}, ${niceDate(k)}</div><h2>Turno e treino</h2>
        <section class="ms-sec"><h3>Turno</h3><div class="shift4">${SHIFT_ORDER.map(id => {
          const c = shiftCfg(id), blocked = id === 'M' && afterNight(k);
          return `<button class="s4 press ${cur === id ? 'on' : ''} ${blocked ? 'blocked' : ''}" style="--sc:${c.col}" data-act="setshift" data-k="${k}" data-v="${id}" aria-pressed="${cur === id}" ${blocked ? 'aria-disabled="true" aria-label="Manhã: não dá depois de uma noite"' : ''}>
            <span class="s4-c">${ic(SHIFT_IC[id])}</span><b>${c.n}</b><small>${blocked ? 'Depois da noite' : c.h}</small></button>`;
        }).join('')}</div></section>
        <button class="train-card press" data-act="settrain" data-k="${k}" aria-pressed="${isT}"><span class="tc-ic">${ic('dumbbell')}</span>
          <span class="row-main"><b>Dia de treino</b><span>+200 kcal, sobretudo hidratos</span></span><span class="switch ${isT ? 'on' : ''}"></span></button>
        ${calNote(k)}
        <p class="cap">Os horários das refeições mudam com o turno. Podes ajustá-los em Perfil → Turnos e horários.</p>
        <div class="btn-stack"><button class="btn primary press" data-act="close">Feito</button></div>`;
    };
  }


  // ================= Editor de receitas =================
  let subParent = null; // página de onde se abriu a atual (Guia ou Definições)
  let rDraft = null, recCat = null; // recCat: refeição aberta em Perfil → As minhas receitas
  const roleOf = f => (food(f).cat === 'Hidratos' ? 'c' : food(f).cat === 'Proteínas' ? 'p' : undefined);
  const normTxt = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const FOOD_CATS = ['Proteínas', 'Laticínios e ovos', 'Hidratos', 'Legumes', 'Fruta', 'Gorduras', 'Outros'];
  function openEditor(meal, slot, pickFor = null) {
    rDraft = meal
      ? { id: meal.id, slot: slotOfMeal(meal.id), n: meal.n, prep: meal.prep || '', m: meal.m ? 1 : 0, i: meal.i.map(it => ({ f: it.f, g: Array.isArray(it.g) ? it.g[0] : it.g })), isNew: false }
      : { id: null, slot: slot || 'almoco', n: '', prep: '', m: 0, i: [], isNew: true };
    rDraft.pickFor = pickFor; rDraft.view = 'edit';
    if (PHOTO_URL[DRAFT_PHOTO]) { URL.revokeObjectURL(PHOTO_URL[DRAFT_PHOTO]); delete PHOTO_URL[DRAFT_PHOTO]; }
    openSheet(editorSheet);
  }
  function syncDraftFromDom() {
    if (!rDraft || rDraft.view !== 'edit' || !sheetEl.querySelector('#r_n')) return;
    rDraft.n = sheetEl.querySelector('#r_n').value;
    rDraft.prep = sheetEl.querySelector('#r_prep').value;
    rDraft.m = sheetEl.querySelector('#r_m').checked ? 1 : 0;
    sheetEl.querySelectorAll('.g-in').forEach(el => { const v = parseFloat(el.value.replace(',', '.')); rDraft.i[+el.dataset.ri].g = v > 0 ? v : 0; });
  }
  const draftTotals = () => sumItems(rDraft.i.filter(it => it.g > 0));
  const totalsHTML = t => `<div><b>${n0(t.kcal)}</b><span>kcal</span></div><div><b style="color:var(--p)">${n0(t.p)}</b><span>proteína</span></div><div><b style="color:var(--c)">${n0(t.c)}</b><span>hidratos</span></div><div><b style="color:var(--f)">${n0(t.f)}</b><span>gordura</span></div>`;
  function foodListHTML(q) {
    const all = { ...FOODS, ...R().foods }, nq = normTxt(q.trim());
    const hits = Object.keys(all).filter(f => !nq || normTxt(all[f].n).includes(nq));
    if (!hits.length) return `<p class="cap" style="text-align:center;margin:16px 0">Não encontrei "${esc(q)}". Cria-o em baixo.</p>`;
    return FOOD_CATS.map(c => {
      const rows = hits.filter(f => (all[f].cat || 'Outros') === c).sort((a, b) => all[a].n.localeCompare(all[b].n, 'pt'));
      if (!rows.length) return '';
      return `<div class="group-label">${c}</div><div class="list">${rows.map(f => `<button class="row tap" data-act="raddf" data-f="${f}"><div class="row-main"><div class="ttl" style="font-weight:500">${esc(all[f].n)}</div><div class="sub num">${Math.round(all[f].kcal)} kcal · P ${n1(all[f].p)} · H ${n1(all[f].c)} · G ${n1(all[f].f)} por 100 g</div></div>${ic('plus', 'chev')}</button>`).join('')}</div>`;
    }).join('');
  }
  function editorSheet() {
    const d = rDraft;
    if (d.view === 'food') {
      return `<div class="over">${esc(d.n || 'Receita')}</div><h2>Adicionar ingrediente</h2>
        <div class="list search-row">${ic('search')}<input id="f_q" type="search" placeholder="Procurar alimento ou produto" autocomplete="off" aria-label="Procurar alimento ou produto"></div>
        <div class="list" style="margin-top:10px"><button class="row tap" data-act="rview" data-v="scan"><span class="tile" style="background:var(--accent-soft);color:var(--accent)">${ic('barcode')}</span><div class="row-main"><div class="ttl" style="font-weight:500">Ler código de barras</div><div class="sub">Da embalagem do produto</div></div>${ic('chevR', 'chev')}</button></div>
        <div id="f_list">${foodListHTML('')}</div>
        <div class="group-label">Produtos do supermercado</div>
        <div id="off_list"><p class="cap" style="margin:0 4px">Escreve pelo menos 3 letras para procurar produtos à venda em Portugal (Open Food Facts).</p></div>
        <div class="btn-stack"><button class="btn secondary press" data-act="rview" data-v="newfood">${ic('plus')} Alimento que não está na lista</button>
        <button class="btn secondary press" data-act="rview" data-v="edit">Voltar à receita</button></div>`;
    }
    if (d.view === 'scan') {
      const hasCam = 'BarcodeDetector' in window && navigator.mediaDevices;
      return `<div class="over">${esc(d.n || 'Receita')}</div><h2>Ler código de barras</h2>
        ${hasCam ? `<div class="scan-box"><video id="scan_v" playsinline muted></video><span class="scan-line"></span></div>
          <p class="cap" id="scan_msg" style="text-align:center">Aponta a câmara para o código de barras.</p>`
          : `<p class="cap" style="margin:0 4px 10px">Este telemóvel não deixa ler o código com a câmara dentro da app. Escreve os números que estão por baixo das barras.</p>`}
        <div class="list search-row">${ic('barcode')}<input id="bc_in" type="text" inputmode="numeric" autocomplete="off" placeholder="5601234567890" aria-label="Número do código de barras"><button type="button" class="link" data-act="bcgo">Procurar</button></div>
        <div id="bc_res"></div>
        <div class="btn-stack"><button class="btn secondary press" data-act="rview" data-v="food">Voltar</button></div>`;
    }
    if (d.view === 'newfood') {
      const num = (id, l) => `<div class="form-row"><label for="${id}">${l}</label><input id="${id}" type="text" inputmode="decimal" autocomplete="off" placeholder="0"></div>`;
      return `<div class="over">Novo alimento</div><h2>Alimento que não está na lista</h2>
        <div class="list"><div class="form-row"><label for="nf_n">Nome</label><input id="nf_n" type="text" autocomplete="off" placeholder="Cuscuz, cogumelos…"></div>
          <div class="form-row"><label for="nf_cat">Tipo</label><select id="nf_cat">${FOOD_CATS.map(c => `<option>${c}</option>`).join('')}</select></div></div>
        <div class="group-label">Por 100 g (vem no rótulo)</div>
        <div class="list">${num('nf_kcal', 'Calorias (kcal)')}${num('nf_p', 'Proteína (g)')}${num('nf_c', 'Hidratos (g)')}${num('nf_f', 'Gordura (g)')}</div>
        <p class="cap err" id="nf_err"></p>
        <div class="btn-stack"><button class="btn primary press" data-act="rfoodsave">Guardar e juntar à receita</button>
        <button class="btn secondary press" data-act="rview" data-v="food">Voltar</button></div>`;
    }
    const t = draftTotals();
    return `<div class="over">${d.isNew ? 'Nova receita' : 'Editar receita'}</div><h2>${esc(d.n) || 'Receita sem nome'}</h2>
      <div class="list"><div class="form-row"><label for="r_n">Nome</label><input id="r_n" type="text" autocomplete="off" value="${esc(d.n)}" placeholder="Frango com arroz"></div></div>
      <div class="group-label">Refeição</div>
      <div class="seg full seg-slots" role="group" aria-label="Refeição">${SLOTS.map(sl => `<button type="button" class="${d.slot === sl.id ? 'on' : ''}" data-act="rslot" data-v="${sl.id}">${{ pa: 'P. almoço', lm: 'L. manhã', almoco: 'Almoço', lanche: 'Lanche', jantar: 'Jantar' }[sl.id]}</button>`).join('')}</div>
      <div class="group-label">Ingredientes · 1 dose</div>
      <div class="list">${d.i.map((it, idx) => `<div class="row ing-edit"><div class="row-main"><div class="ttl" style="font-weight:500">${esc(food(it.f).n)}</div><div class="sub num" data-rk="${idx}">${n0(food(it.f).kcal * it.g / 100)} kcal</div></div>
          <input class="g-in num" data-ri="${idx}" type="text" inputmode="decimal" autocomplete="off" value="${it.g ? String(it.g).replace('.', ',') : ''}" aria-label="Quantidade de ${esc(food(it.f).n)}" onfocus="this.select()"><span class="unit">${isLiquid(it.f) ? 'ml' : 'g'}</span>
          <button type="button" class="mini" data-act="rdel" data-ri="${idx}" aria-label="Tirar ${esc(food(it.f).n)}">${ic('x')}</button></div>`).join('')}
        <button class="row tap add-row" data-act="rview" data-v="food">${ic('plus')}<div class="row-main"><div class="ttl">Adicionar ingrediente</div></div></button></div>
      <div class="stat4 num" id="r_tot" style="margin-top:12px">${totalsHTML(t)}</div>
      <div class="group-label">Preparação</div>
      <div class="list"><textarea id="r_prep" rows="4" placeholder="Passos, separados por pontos. Ex.: Grelhar o frango. Cozer o arroz.">${esc(d.prep)}</textarea></div>
      <div class="list" style="margin-top:12px"><label class="form-row" style="cursor:pointer"><span>Boa para marmita</span><input id="r_m" type="checkbox" class="sw-in" ${d.m ? 'checked' : ''}><span class="switch"></span></label></div>
      <div class="group-label">Foto</div>${photoRow(d.id || DRAFT_PHOTO, d.slot)}
      <p class="cap err" id="r_err"></p>
      <div class="btn-stack"><button class="btn primary press" data-act="rsave">Guardar receita</button>
        ${d.isNew ? '' : '<button class="btn danger press" data-act="rdelete">Eliminar receita</button>'}
        <button class="btn secondary press" data-act="close">Cancelar</button></div>
      <p class="cap">As quantidades de hidratos ajustam-se sozinhas à meta de cada dia.</p>`;
  }
  // ---- Foto da receita ----
  const DRAFT_PHOTO = '__nova'; // receita nova ainda sem id: a foto fica à espera até guardar
  function photoRow(id, slot) {
    const has = hasPhoto(id) || !!PHOTO_URL[id];
    return `<div class="list"><label class="row tap photo-row"><span class="ph-thumb">${mealPic(id, slot)}</span>
      <div class="row-main"><div class="ttl" style="font-weight:500">${has ? 'Mudar foto' : 'Adicionar foto'}</div><div class="sub">${has ? 'Aparece no Hoje em vez da cor da refeição' : 'Da galeria ou da câmara'}</div></div>${ic('chevR', 'chev')}
      <input type="file" accept="image/*" hidden data-photo="${id}"></label>
      ${has ? `<button class="row tap" data-act="photodel" data-id="${id}"><div class="row-main"><div class="ttl" style="font-weight:500;color:var(--danger)">Remover foto</div></div></button>` : ''}</div>`;
  }
  async function onPhotoPicked(el) {
    const file = el.files && el.files[0], id = el.dataset.photo;
    if (!file) return;
    try {
      const blob = await shrinkPhoto(file);
      if (id === DRAFT_PHOTO) {
        if (PHOTO_URL[DRAFT_PHOTO]) URL.revokeObjectURL(PHOTO_URL[DRAFT_PHOTO]);
        rDraft.photoBlob = blob; PHOTO_URL[DRAFT_PHOTO] = URL.createObjectURL(blob);
      } else await setPhoto(id, blob);
      syncDraftFromDom(); paintSheet(); render(); toast('Foto guardada');
    } catch (err) { toast('Não deu para usar esta foto'); }
  }
  function removePhoto(id) {
    if (id === DRAFT_PHOTO) { delete rDraft.photoBlob; if (PHOTO_URL[id]) URL.revokeObjectURL(PHOTO_URL[id]); delete PHOTO_URL[id]; syncDraftFromDom(); paintSheet(); return; }
    setPhoto(id, null).then(() => { syncDraftFromDom(); paintSheet(); render(); toast('Foto removida'); }).catch(() => {});
  }
  function onRecipeInput(e) {
    const el = e.target;
    if (el.dataset && el.dataset.photo !== undefined) { if (e.type === 'change') onPhotoPicked(el); return; }
    if (el.id === 'f_q') {
      sheetEl.querySelector('#f_list').innerHTML = foodListHTML(el.value);
      clearTimeout(offTimer); offTimer = setTimeout(() => searchOFF(el.value), 450);
      return;
    }
    if (!rDraft || rDraft.view !== 'edit') return;
    if (el.classList.contains('g-in')) {
      const idx = +el.dataset.ri, v = parseFloat(el.value.replace(',', '.'));
      rDraft.i[idx].g = v > 0 ? v : 0;
      const k = sheetEl.querySelector(`[data-rk="${idx}"]`); if (k) k.textContent = `${n0(food(rDraft.i[idx].f).kcal * rDraft.i[idx].g / 100)} kcal`;
      sheetEl.querySelector('#r_tot').innerHTML = totalsHTML(draftTotals());
    }
    if (el.id === 'r_n') rDraft.n = el.value;
  }
  // ---- Produtos do supermercado (Open Food Facts, através do Worker) ----
  const FOOD_API = 'https://plano-lean-calendario.goncalo5578.workers.dev';
  let offTimer = null, offSeq = 0, offHits = [], camStream = null, scanTimer = null;
  const guessCat = x => (x.p >= 15 && x.c < 10 ? 'Proteínas' : x.c >= 40 ? 'Hidratos' : x.f >= 40 ? 'Gorduras' : 'Outros');
  const offRow = (x, i) => `<button class="row tap" data-act="raddoff" data-i="${i}"><div class="row-main"><div class="ttl" style="font-weight:500">${esc(x.n)}</div>
    <div class="sub num">${[x.b, x.q].filter(Boolean).map(esc).join(' · ')}${x.b || x.q ? ' · ' : ''}${x.kcal} kcal · P ${n1(x.p)} · H ${n1(x.c)} · G ${n1(x.f)} por 100 g</div></div>${ic('plus', 'chev')}</button>`;
  async function searchOFF(q) {
    const box = sheetEl.querySelector('#off_list'); if (!box) return;
    q = q.trim();
    if (q.length < 3) { box.innerHTML = '<p class="cap" style="margin:0 4px">Escreve pelo menos 3 letras para procurar produtos à venda em Portugal (Open Food Facts).</p>'; return; }
    const seq = ++offSeq;
    box.innerHTML = '<p class="cap" style="margin:0 4px">A procurar…</p>';
    try {
      const r = await fetch(`${FOOD_API}/alimentos?q=${encodeURIComponent(q)}&v=2`);
      if (!r.ok) throw new Error();
      const { items } = await r.json();
      if (seq !== offSeq || !sheetEl.querySelector('#off_list')) return; // já escreveste outra coisa
      offHits = items;
      box.innerHTML = items.length ? `<div class="list">${items.map(offRow).join('')}</div><p class="cap">Valores do rótulo, partilhados por voluntários no Open Food Facts. Confirma se parecerem estranhos.</p>`
        : `<p class="cap" style="margin:0 4px">Não encontrei produtos com "${esc(q)}".</p>`;
    } catch (e) {
      if (seq === offSeq) box.innerHTML = '<p class="cap" style="margin:0 4px">Sem ligação à internet — por agora só aparecem os alimentos da app.</p>';
    }
  }
  function addOffFood(x) {
    const id = 'off_' + x.code;
    R().foods[id] = { n: x.b && !x.n.toLowerCase().includes(x.b.toLowerCase()) ? `${x.n} (${x.b})` : x.n, cat: guessCat(x), kcal: x.kcal, p: x.p, c: x.c, f: x.f, off: x.code };
    save();
    rDraft.i.push({ f: id, g: 100 }); rDraft.view = 'edit'; stopScan(); paintSheet();
    const ins = sheetEl.querySelectorAll('.g-in'); if (ins.length) { ins[ins.length - 1].focus(); ins[ins.length - 1].select(); }
  }
  async function lookupBarcode(code) {
    code = String(code).replace(/\D/g, '');
    const box = sheetEl.querySelector('#bc_res'); if (!box) return;
    if (code.length < 6) { box.innerHTML = '<p class="cap err">O código tem de ter pelo menos 6 números.</p>'; return; }
    box.innerHTML = '<p class="cap" style="margin:10px 4px 0">A procurar…</p>';
    try {
      const r = await fetch(`${FOOD_API}/produto?code=${code}`);
      const { item } = await r.json();
      if (!item) { box.innerHTML = `<p class="cap" style="margin:10px 4px">Não encontrei o produto ${code}. Podes criá-lo com os valores do rótulo.</p><div class="btn-stack" style="margin-top:8px"><button class="btn secondary press" data-act="rview" data-v="newfood">${ic('plus')} Criar alimento</button></div>`; return; }
      offHits = [item];
      box.innerHTML = `<div class="group-label">Encontrado</div><div class="list">${offRow(item, 0)}</div>`;
    } catch (e) { box.innerHTML = '<p class="cap" style="margin:10px 4px">Sem ligação à internet. Tenta outra vez.</p>'; }
  }
  async function startScan() {
    const v = sheetEl.querySelector('#scan_v'); if (!v) return;
    const msg = t => { const m = sheetEl.querySelector('#scan_msg'); if (m) m.textContent = t; };
    try {
      camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      if (!sheetEl.querySelector('#scan_v')) return stopScan();
      v.srcObject = camStream; await v.play();
      const det = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] });
      scanTimer = setInterval(async () => {
        if (!v.videoWidth) return;
        try {
          const codes = await det.detect(v);
          if (codes.length) { const c = codes[0].rawValue; stopScan(); sheetEl.querySelector('#bc_in').value = c; msg(`Código lido: ${c}`); lookupBarcode(c); }
        } catch (e) { /* tenta na próxima imagem */ }
      }, 300);
    } catch (e) { stopScan(); msg('Não consegui abrir a câmara. Escreve o número do código em baixo.'); }
  }
  function stopScan() {
    clearInterval(scanTimer); scanTimer = null;
    if (camStream) { camStream.getTracks().forEach(t => t.stop()); camStream = null; }
  }
  const showErr = (id, msg) => { const e = sheetEl.querySelector('#' + id); if (e) e.textContent = msg; };
  function saveNewFood() {
    const v = id => sheetEl.querySelector('#' + id).value.trim();
    const num = id => parseFloat(v(id).replace(',', '.'));
    const n = v('nf_n'), kcal = num('nf_kcal'), p = num('nf_p') || 0, c = num('nf_c') || 0, f = num('nf_f') || 0;
    if (!n) return showErr('nf_err', 'Escreve o nome do alimento.');
    if (!(kcal > 0)) return showErr('nf_err', 'Escreve as calorias por 100 g (estão no rótulo).');
    const id = 'uf_' + Date.now().toString(36);
    R().foods[id] = { n, cat: v('nf_cat'), kcal, p, c, f };
    save();
    rDraft.i.push({ f: id, g: 100 }); rDraft.view = 'edit'; paintSheet();
  }
  function saveRecipe() {
    syncDraftFromDom();
    const d = rDraft, n = d.n.trim(), items = d.i.filter(it => it.g > 0);
    if (!n) return showErr('r_err', 'Dá um nome à receita.');
    if (!items.length) return showErr('r_err', 'Junta pelo menos um ingrediente com quantidade.');
    const meal = { n, m: d.m, prep: d.prep.trim(), i: items.map(it => ({ f: it.f, g: Math.round(it.g * 10) / 10, ...(roleOf(it.f) ? { r: roleOf(it.f) } : {}) })) };
    const r = R(), bslot = d.id && builtinSlot(d.id);
    let id = d.id;
    if (bslot && bslot === d.slot) r.edits[id] = { id, ...meal };
    else {
      if (bslot) { r.removed[id] = true; delete r.edits[id]; id = null; } // receita do plano mudada de refeição: passa a ser tua
      if (id) Object.assign(r.custom.find(m => m.id === id), meal, { slot: d.slot });
      else { id = 'u_' + Date.now().toString(36); r.custom.push({ id, slot: d.slot, ...meal }); }
    }
    if (d.pickFor && d.pickFor.slot === d.slot) dayState(d.pickFor.k).swaps[d.slot] = id;
    // a foto acompanha a receita (nova, ou receita do plano que mudou de refeição e ganhou outro id)
    const photo = d.photoBlob ? Promise.resolve(d.photoBlob) : d.id && id !== d.id && PHOTO_URL[d.id] ? fetch(PHOTO_URL[d.id]).then(x => x.blob()) : null;
    if (photo) photo.then(b => setPhoto(id, b)).then(() => { if (PHOTO_URL[DRAFT_PHOTO]) { URL.revokeObjectURL(PHOTO_URL[DRAFT_PHOTO]); delete PHOTO_URL[DRAFT_PHOTO]; } render(); }).catch(() => {});
    save(); closeSheet(); render(); toast(d.isNew ? 'Receita criada' : 'Receita guardada');
  }
  function deleteRecipe() {
    const d = rDraft;
    if (mealsOf(d.slot).length <= 1) return showErr('r_err', 'Tem de ficar pelo menos uma receita nesta refeição.');
    askConfirm({ title: 'Eliminar receita?', ok: 'Eliminar receita', text: `<b>${esc(d.n)}</b> deixa de aparecer no plano e é substituída por outra receita. Isto não pode ser desfeito.`,
      onOk: () => {
        const r = R();
        if (builtinSlot(d.id)) { r.removed[d.id] = true; delete r.edits[d.id]; } else r.custom = r.custom.filter(m => m.id !== d.id);
        if (PHOTO_URL[d.id]) setPhoto(d.id, null).catch(() => {});
        save(); render(); toast('Receita eliminada');
      } });
  }

  // refeição acabada de marcar/desmarcar: só ela anima (mudar de dia ou abrir a app não repete a animação)
  let animSlot = null;
  function toggleDone(slot) {
    const st = dayState(curDay);
    if (st.fora && st.fora[slot]) { delete st.fora[slot]; st.done[slot] = false; }
    else st.done[slot] = !st.done[slot];
    save();
  }
  function setShift(k, v) {
    const st = dayState(k);
    if (v === (calShift(k) || 'F')) delete st.turno; else st.turno = v; // igual ao calendário → volta a seguir o calendário
    save();
  }
  function toggleTrain(k) {
    const st = dayState(k), def = S.profile.treinoDias.includes(dowIdx(k)) ? 'T' : 'D';
    const nxt = dayType(k) === 'T' ? 'D' : 'T';
    if (nxt === def) delete st.type; else st.type = nxt;
    save();
  }

  // ================= SEMANA =================
  const weekMon = () => addDays(mondayOf(todayKey()), weekOffset * 7);
  // Avisos da semana: pratos que se repetem muito e turnos sem marmita (sobras) para levar
  function weekWarnings(plans) {
    const out = [], count = {};
    plans.forEach(P => P.meals.forEach(m => {
      if (m.src || m.fora || (m.slot.id !== 'almoco' && m.slot.id !== 'jantar')) return;
      (count[m.meal.id] ||= { n: m.meal.n, c: 0 }).c++;
    }));
    Object.values(count).filter(x => x.c >= 3).forEach(x => out.push(`<b>${esc(x.n)}</b> aparece ${x.c} vezes`));
    if (S.profile.autoSobras !== false) plans.forEach((P, i) => {
      const slot = P.shift === 'M' ? 'almoco' : P.shift === 'T' ? 'jantar' : null;
      const m = slot && P.meals.find(x => x.slot.id === slot);
      if (m && !m.src && !m.fora) out.push(`<b>${DOW[i]}</b>: ${m.slot.n.toLowerCase()} sem marmita, é para preparar à parte`);
    });
    return out;
  }
  // Copia as refeições da semana anterior (trocas, sobras feitas à mão e lanche da manhã) para a semana que estás a ver
  function repeatPrevWeek() {
    const mon = weekMon(), prev = addDays(mon, -7), inPrev = k => k >= prev && k < mon, inCur = k => k >= mon && k < addDays(mon, 7);
    for (let i = 0; i < 7; i++) {
      const from = peekDay(addDays(prev, i)), st = dayState(addDays(mon, i));
      st.swaps = { ...(from.swaps || {}) };
      if ('lm' in from) st.lm = from.lm; else delete st.lm;
    }
    S.links ||= {};
    for (const key of Object.keys(S.links)) if (inCur(key.split('|')[0])) delete S.links[key];
    for (const [key, v] of Object.entries({ ...S.links })) {
      const [k, s] = key.split('|'); if (!inPrev(k)) continue;
      S.links[LK(addDays(k, 7), s)] = v === 'none' ? 'none' : LK(addDays(v.split('|')[0], 7), v.split('|')[1]);
    }
    save(); render(); toast('Refeições repetidas');
  }
  function renderSemana() {
    const mon = weekMon();
    const lbl = weekOffset === 0 ? 'Esta semana' : weekOffset === 1 ? 'Próxima semana' : weekOffset === -1 ? 'Semana passada'
      : weekOffset > 1 ? `Daqui a ${weekOffset} semanas` : `Há ${-weekOffset} semanas`;
    const m0 = fromKey(mon), m6 = fromKey(addDays(mon, 6));
    const range = m0.getMonth() === m6.getMonth() ? `${m0.getDate()} – ${m6.getDate()} ${MON[m6.getMonth()]}` : `${niceDate(mon)} – ${niceDate(addDays(mon, 6))}`;
    header(`${niceDate(mon)} – ${niceDate(addDays(mon, 6))}`, 'Semana');
    const plans = Array.from({ length: 7 }, (_, i) => dayPlan(addDays(mon, i)));
    // Aba para preparar a semana: os turnos em cima (tocar no cartão abre a escala da semana toda) e, por dia, as refeições principais
    // com o que é marmita e o que é para cozinhar a dobrar (toca numa para a trocar)
    let h = `<div class="weeknav">
        <button class="circle-btn press" data-act="wk" data-d="-1" aria-label="Semana anterior">${ic('chevL', 'sm')}</button>
        <div class="wk-lbl" aria-live="polite"><b>${lbl}</b><span class="num">${range}</span></div>
        <button class="circle-btn press" data-act="wk" data-d="1" aria-label="Semana seguinte">${ic('chevR', 'sm')}</button></div>
      <div class="day-stage"><div class="day-pane week-pane">
      <section class="card wk-shifts tap" data-act="escala" role="button" tabindex="0" aria-label="Turnos e treinos da semana. Mudar"><h2 class="sec-h">Turnos <small>Escala ${ic('chevR', 'sm')}</small></h2><div class="wk-strip">${plans.map((P, i) => {
        const c = shiftCfg(P.shift);
        return `<span class="wks ${P.shift !== 'F' ? 'work' : ''} ${P.k === todayKey() ? 'today' : ''}" style="--sc:${c.col}" aria-hidden="true">
          <span class="wks-c">${ic(SHIFT_IC[P.shift] || 'leaf')}${P.type === 'T' ? `<span class="wks-tr">${ic('dumbbell')}</span>` : ''}</span><small>${P.k === todayKey() ? 'Hoje' : DOW_S[i]}</small></span>`;
      }).join('')}</div></section>
      <section class="meal-box week-box"><h2 class="sec-h">Refeições principais <button class="wk-rep press" data-act="wkrepeat">${ic('repeat')}Repetir<span class="rp-x"> anterior</span></button></h2><div class="mcards">`;
    plans.forEach((P, i) => {
      const c = shiftCfg(P.shift), isToday = P.k === todayKey();
      const main = P.meals.filter(m => m.slot.id === 'almoco' || m.slot.id === 'jantar' || m.src || m.dests.length);
      const line = m => {
        const tag = m.src ? `<span class="wm-tag take">${ic('box')}${P.shift !== 'F' && /turno/i.test(m.slot.n) ? 'Marmita' : 'Sobras'}</span>`
          : m.dests.length ? `<span class="wm-tag cook">${ic('pot')}Faz o dobro</span>` : '';
        return `<button class="wm press ${tag ? 'hl' : ''}" data-act="wmeal" data-k="${P.k}" data-slot="${m.slot.id}" aria-label="${esc(m.slot.n)}, ${esc(m.meal.n)}. Trocar"><span class="wm-t num">${m.slot.t}</span><span class="wm-n">${esc(m.meal.n)}</span>${tag}</button>`;
      };
      h += `<div class="row tap wrow ${isToday ? 'is-today' : ''} ${i === 6 ? 'm-last' : ''}" data-act="open" data-k="${P.k}" style="--sc:${c.col}">
        <div class="wr-date"><span class="wd">${isToday ? 'Hoje' : DOW_S[i]}</span><b class="num">${dayNum(P.k)}</b></div>
        <div class="row-main">
          <div class="wr-top"><span class="wr-shift"><span class="wr-ic">${ic(SHIFT_IC[P.shift] || 'leaf')}</span>${c.n}${P.shift !== 'F' ? ` <span class="wr-h num">${c.h}</span>` : ''}</span>${afterNight(P.k) ? `<span class="wr-tag">${ic('moon')}Depois da noite</span>` : ''}${P.type === 'T' ? `<span class="wr-tag train">${ic('dumbbell')}Treino</span>` : ''}${ic('chevR', 'chev-r')}</div>
          <div class="wmeals">${main.map(line).join('')}</div>
        </div></div>`;
    });
    const warns = weekWarnings(plans);
    h += `</div></section>${warns.length ? `<section class="card wk-warn"><span class="wi">${ic('alert')}</span><div><b>${warns.length === 1 ? '1 coisa a ver' : `${warns.length} coisas a ver`}</b><ul>${warns.map(w => `<li>${w}</li>`).join('')}</ul></div></section>`
      : `<p class="cap wk-ok">${ic('check', 'sm')}Nada a apontar nesta semana.</p>`}${calStatus()}</div></div>`;
    $view.innerHTML = h;
  }


  function escalaSheet() {
    return () => {
      const mon = weekMon();
      // Escala no estilo da janela do turno: em cada dia, os quatro turnos em círculos pequenos e o haltere do treino
      let h = `<div class="over">${niceDate(mon)} – ${niceDate(addDays(mon, 6))}</div><h2>Escala da semana</h2><section class="ms-sec esc-sec"><div class="list">`;
      for (let i = 0; i < 7; i++) {
        const k = addDays(mon, i), cur = shiftOf(k), isT = dayType(k) === 'T';
        h += `<div class="row esc2 ${k === todayKey() ? 'is-today' : ''}"><div class="wr-date"><span class="wd">${k === todayKey() ? 'Hoje' : DOW_S[i]}</span><b class="num">${dayNum(k)}</b></div>
          <div class="esc-c" role="group" aria-label="Turno de ${DOW[i]}">${SHIFT_ORDER.map(id => { const blocked = id === 'M' && afterNight(k); return `<button class="ec press ${cur === id ? 'on' : ''} ${blocked ? 'blocked' : ''}" style="--sc:${SHIFTS[id].col}" data-act="setshift" data-k="${k}" data-v="${id}" aria-label="${SHIFTS[id].n}${blocked ? ' (não dá depois de uma noite)' : ''}" aria-pressed="${cur === id}" ${blocked ? 'aria-disabled="true"' : ''}>${ic(SHIFT_IC[id])}</button>`; }).join('')}</div>
          <button class="ec ec-train press ${isT ? 'on' : ''}" style="--sc:var(--train)" data-act="settrain" data-k="${k}" aria-label="Treino em ${DOW[i]}" aria-pressed="${isT}">${ic('dumbbell')}</button></div>`;
      }
      return h + `</div></section>
        <div class="esc-legend">${SHIFT_ORDER.map(id => `<span style="--sc:${SHIFTS[id].col}"><i>${ic(SHIFT_IC[id])}</i>${SHIFTS[id].n}</span>`).join('')}<span style="--sc:var(--train)"><i>${ic('dumbbell')}</i>Treino</span></div>
        <p class="cap">Depois de uma noite não dá para fazer manhã, e a app ajusta a manhã desse dia sozinha.${S.cal && S.cal.url ? ' Os turnos vêm do calendário; o que mudares aqui fica por cima.' : ''}</p>
        <div class="btn-stack"><button class="btn primary press" data-act="close">Feito</button></div>`;
    };
  }


  // ================= COMPRAS =================
  // Período das compras: w0 esta semana · w1 próxima semana · m0 de hoje até ao fim do mês · m1 o mês seguinte inteiro
  const SHOP_MODES = [['w0', 'Esta semana'], ['w1', 'Próx. semana'], ['m0', 'Este mês'], ['m1', 'Próx. mês']];
  function shopRange() {
    const tk = todayKey(), t = fromKey(tk);
    if (shopMode === 'm0' || shopMode === 'm1') {
      const first = new Date(t.getFullYear(), t.getMonth() + (shopMode === 'm1' ? 1 : 0), 1);
      const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
      return { from: shopMode === 'm0' ? tk : keyOf(first), to: keyOf(last), key: 'm:' + keyOf(first).slice(0, 7), month: true };
    }
    const mon = addDays(mondayOf(tk), shopMode === 'w1' ? 7 : 0);
    return { from: mon, to: addDays(mon, 6), key: mon, month: false };
  }
  const shopKey = () => shopRange().key;
  const rangeTxt = r => `${niceDate(r.from)} – ${niceDate(r.to)}`;
  const daysIn = r => Math.round((fromKey(r.to) - fromKey(r.from)) / 864e5) + 1;
  const CAT_ORDER = ['Proteínas', 'Laticínios e ovos', 'Hidratos', 'Legumes', 'Fruta', 'Gorduras', 'Outros'];
  function shopItems() {
    const r = shopRange(), agg = {};
    for (let k = r.from; k <= r.to; k = addDays(k, 1)) for (const m of dayPlan(k).meals) for (const it of m.items) agg[it.f] = (agg[it.f] || 0) + it.g;
    const cats = {};
    for (const f in agg) (cats[food(f).cat] ||= []).push({ f, g: agg[f] });
    for (const c in cats) cats[c].sort((a, b) => food(a.f).n.localeCompare(food(b.f).n, 'pt'));
    return cats;
  }
  function amountTxt(f, g) {
    if (f === 'sopa') return { a: `${Math.ceil(g / 300)} pratos`, h: '1–2 panelas' };
    const liq = isLiquid(f), F = food(f);
    const a = g >= 1000 ? `${n1(Math.ceil(g / 100) / 10)} ${liq ? 'L' : 'kg'}` : `${Math.ceil(g / 10) * 10} ${liq ? 'ml' : 'g'}`;
    let h = '';
    if (F.u && !['azeite', 'manteigaAm', 'chocolate'].includes(f)) { const n = Math.ceil(g / F.u[0] - 0.15); h = `${n} ${plural(F.u[1], n)}`; }
    if (f === 'claras') h = `${Math.ceil(g / 33)} claras`;
    return { a, h };
  }
  // Cor e ícone de cada categoria da lista de compras
  const CAT_STYLE = {
    'Proteínas': ['fish', 'var(--f)'], 'Laticínios e ovos': ['egg', 'var(--p)'], 'Hidratos': ['wheat', 'var(--c)'],
    'Legumes': ['leaf', 'var(--accent)'], 'Fruta': ['apple', 'var(--train)'], 'Gorduras': ['drop', '#b08a2e'], 'Outros': ['box', 'var(--ink-3)'],
  };
  function renderCompras() {
    const r = shopRange(), k = r.key, cats = shopItems(), got = S.shop[k] || {};
    const all = Object.values(cats).flat(), total = all.length, nGot = all.filter(i => got[i.f]).length, left = total - nGot, days = daysIn(r);
    header(rangeTxt(r), 'Compras', `<button class="shift-btn press" style="--sc:var(--accent)" data-act="share" aria-label="Partilhar lista"><span class="sb-ic">${ic('share')}</span><span class="sb-t"><b>Partilhar</b></span></button>`);
    // No estilo do Hoje: período num cartão, resumo como o cartão das calorias e cada categoria num cartão com os artigos empilhados
    let h = `<div class="shop-nav"><div class="seg full seg-shop" role="group" aria-label="Período">${SHOP_MODES.map(([v, l]) => `<button class="${shopMode === v ? 'on' : ''}" data-act="sw" data-w="${v}">${l}</button>`).join('')}</div></div>
      <section class="card energy shop-sum">
        <div class="energy-top">
          <div><div class="big num" data-count="shopleft" data-v="${left}">${left}</div><div class="big-lbl">${left === 1 ? 'artigo por comprar' : 'artigos por comprar'}</div></div>
          <div class="daytype is-rest"><span class="dt-ic">${ic('cal')}</span><div><b class="num">${days} ${days === 1 ? 'dia' : 'dias'}</b><small>${SHOP_MODES.find(x => x[0] === shopMode)[1].replace('Próx.', 'Próximo').replace('Próximo semana', 'Próxima semana')}</small></div></div>
        </div>
        <div class="track"><i style="width:${total ? (nGot / total) * 100 : 0}%"></i></div>
        <div class="meta num"><span>Comprado <b>${nGot}</b> de ${total}</span>${nGot ? '<button class="link" data-act="clear">Limpar</button>' : ''}</div>
      </section>`;
    if (total && !left) h += `<section class="card done-card">${ic('check')}<div><b>Tudo comprado</b><span>A lista deste período está completa.</span></div></section>`;
    for (const c of CAT_ORDER) {
      if (!cats[c]) continue;
      const [icon, col] = CAT_STYLE[c] || ['box', 'var(--ink-3)'];
      const n = cats[c].length, cGot = cats[c].filter(it => got[it.f]).length, complete = cGot === n, min = !!(S.profile.shopMin || {})[c];
      // tocar no título da categoria minimiza / abre os artigos (fica guardado)
      h += `<section class="meal-box shop-box ${min ? 'min' : ''}" style="--cc:${col}"><button class="sec-h shop-h" data-act="shopcat" data-c="${c}" aria-expanded="${!min}"><span class="cat-ic">${ic(icon)}</span><span class="cat-n">${c}</span>
        <small class="cat-c num ${complete ? 'ok' : ''}">${complete ? `${ic('check')}Tudo` : `${cGot} de ${n}`}</small>${ic('chevR', 'sh-chev')}</button><div class="shop-body"><div class="mcards">`;
      cats[c].forEach((it, i) => {
        const A = amountTxt(it.f, it.g), on = !!got[it.f];
        h += `<button class="row tap shop-row ${on ? 'got' : ''} ${i === n - 1 ? 'm-last' : ''}" data-act="got" data-f="${it.f}" aria-pressed="${on}">
          <span class="cb">${ic('check')}</span>
          <span class="row-main"><span class="ttl">${esc(food(it.f).n)}</span>${A.h ? `<span class="sub">${A.h}</span>` : ''}</span>
          <span class="amt num">${A.a}</span></button>`;
      });
      h += `</div></div></section>`;
    }
    if (r.month) h += `<div class="note">${ic('info')}<div>Fruta, legumes, carne e peixe frescos aguentam poucos dias: congela-os ou compra-os semana a semana.</div></div>`;
    $view.innerHTML = h;
  }

  async function shareList() {
    const cats = shopItems(), got = S.shop[shopKey()] || {};
    let txt = `Lista de compras · ${rangeTxt(shopRange())}\n`;
    for (const c of CAT_ORDER) {
      const rows = (cats[c] || []).filter(it => !got[it.f]);
      if (!rows.length) continue;
      txt += `\n${c}\n` + rows.map(it => { const A = amountTxt(it.f, it.g); return `• ${food(it.f).n} — ${A.a}${A.h ? ` (${A.h})` : ''}`; }).join('\n') + '\n';
    }
    try {
      if (navigator.share) await navigator.share({ title: 'Lista de compras', text: txt });
      else { await navigator.clipboard.writeText(txt); toast('Lista copiada'); }
    } catch (e) { /* cancelado */ }
  }

  // ================= PROGRESSO =================
  function weeklyAvg(endKey) {
    const from = addDays(endKey, -6);
    const v = S.weights.filter(w => w.d >= from && w.d <= endKey).map(w => w.kg);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
  }
  function renderProgresso() {
    S.weights.sort((a, b) => a.d.localeCompare(b.d));
    const W = S.weights, tk = todayKey();
    const todayRec = W.find(w => w.d === tk);
    // registar fica em cima, como o botão do turno no Hoje
    header('Peso e medidas', 'Progresso', `<button class="shift-btn press" style="--sc:var(--accent)" data-act="addw" aria-label="${todayRec ? 'Alterar o peso de hoje' : 'Registar o peso de hoje'}"><span class="sb-ic">${ic(todayRec ? 'check' : 'plus')}</span><span class="sb-t"><b class="num">${todayRec ? `${n1(todayRec.kg)} kg` : 'Pesar'}</b></span></button>`);
    if (!W.length) {
      $view.innerHTML = `<section class="card prog-empty"><span class="pe-ic">${ic('scale')}</span><b>Sem registos</b><span>Pesa-te 3–7 manhãs por semana, em jejum.</span><div class="btn-stack"><button class="btn primary press" data-act="addw">${ic('plus')} Registar peso</button></div></section>${guideNote(null)}`;
      return;
    }
    const last = W[W.length - 1];
    const nowAvg = weeklyAvg(last.d), prevAvg = weeklyAvg(addDays(last.d, -7));
    const delta = nowAvg != null && prevAvg != null ? nowAvg - prevAvg : null;
    const cint = [...W].reverse().find(w => w.cint);
    const tot = nowAvg - W[0].kg;
    // cartão principal como o das calorias: média em grande, ritmo à direita, gráfico e período
    let h = `<section class="card energy prog-card">
      <div class="energy-top">
        <div><div class="big num">${n1(nowAvg)}<span class="big-u"> kg</span></div><div class="big-lbl">média dos últimos 7 dias</div></div>
        ${delta != null ? `<div class="daytype ${delta < 0 ? 'is-rest' : 'is-flat'}"><span class="dt-ic">${ic('chart')}</span><div><b class="num">${delta > 0 ? '+' : delta < 0 ? '−' : ''}${n1(Math.abs(delta))} kg</b><small>por semana</small></div></div>` : ''}
      </div>
      ${chart(W)}
      <div class="seg full prog-seg">${[[30, '1 mês'], [90, '3 meses'], [0, 'Tudo']].map(([v, l]) => `<button class="${range === v ? 'on' : ''}" data-act="range" data-v="${v}">${l}</button>`).join('')}</div>
    </section>
    <section class="card prog-kpis num">
      <div><span class="ws-ic" style="--sc:var(--p)">${ic('scale')}</span><b>${n1(W[0].kg)}</b><span>início · ${niceDate(W[0].d)}</span></div>
      <div><span class="ws-ic" style="--sc:${tot <= 0 ? 'var(--accent)' : 'var(--train)'}">${ic('chart')}</span><b>${tot > 0 ? '+' : ''}${n1(tot)}</b><span>kg no total</span></div>
      <div><span class="ws-ic" style="--sc:var(--c)">${ic('ruler')}</span><b>${cint ? n1(cint.cint) : '—'}</b><span>cintura (cm)</span></div>
    </section>
    ${guideNote(delta != null ? (delta / prevAvg) * 100 : null)}`;
    const meds = [['cint', 'Cintura'], ...MEDIDAS].map(([k, n]) => ({ k, n, rs: W.filter(w => w[k]) })).filter(m => m.rs.length);
    if (meds.some(m => m.k !== 'cint')) h += `<section class="meal-box shop-box med-box"><h2 class="sec-h shop-h"><span class="cat-ic" style="--cc:var(--c)">${ic('ruler')}</span><span class="cat-n">Medidas</span><small class="cat-c">cm</small></h2><div class="mcards">${meds.map(({ k, n, rs }, i) => {
      const first = rs[0][k], lastv = rs[rs.length - 1][k], dd = lastv - first;
      return `<div class="row mrow2 ${i === meds.length - 1 ? 'm-last' : ''}"><div class="row-main"><div class="ttl">${n}</div><div class="sub">${rs.length > 1 ? `desde ${niceDate(rs[0].d)} · <span class="${dd < 0 ? 'h-down' : ''}">${dd > 0 ? '+' : dd < 0 ? '−' : '±'}${n1(Math.abs(dd))} cm</span>` : `medido a ${niceDate(rs[0].d)}`}</div></div><b class="num m-val">${n1(lastv)}</b></div>`;
    }).join('')}</div></section>`;
    if (Math.abs(nowAvg - S.profile.peso) >= 1) h += `<div class="btn-stack" style="margin-top:12px"><button class="btn secondary press" data-act="usepeso" data-kg="${Math.round(nowAvg * 10) / 10}">Recalcular plano para ${n1(nowAvg)} kg</button></div>`;
    // histórico num cartão como as categorias das Compras: minimizável, com os registos empilhados
    const list = W.slice(-60).reverse(), prevOf = w => W[W.indexOf(w) - 1];
    h += `<section class="meal-box shop-box hist-box ${histOpen ? '' : 'min'}"><button class="sec-h shop-h" data-act="hist" aria-expanded="${histOpen}"><span class="cat-ic" style="--cc:var(--accent)">${ic('clock')}</span><span class="cat-n">Histórico</span>
        <small class="cat-c num">${W.length} ${W.length === 1 ? 'registo' : 'registos'}</small>${ic('chevR', 'sh-chev')}</button><div class="shop-body"><div class="mcards">${list.map((w, i) => `
      <div class="row hrow ${i === list.length - 1 ? 'm-last' : ''}"><div class="wr-date"><span class="wd">${w.d === tk ? 'Hoje' : DOW_S[dowIdx(w.d)]}</span><b class="num">${dayNum(w.d)}</b></div>
        <div class="row-main"><div class="ttl num">${n1(w.kg)} kg</div><div class="sub">${niceDate(w.d)}${prevOf(w) ? (dd => ` · <span class="${dd < 0 ? 'h-down' : ''}">${dd > 0 ? '+' : dd < 0 ? '−' : '±'}${n1(Math.abs(dd))} kg</span>`)(w.kg - prevOf(w).kg) : ''}${w.cint ? ` · cintura ${n1(w.cint)} cm` : ''}</div></div>
        <button class="h-del press" data-act="delw" data-d="${w.d}" aria-label="Apagar registo de ${niceDate(w.d)}">${ic('trash', 'sm')}</button></div>`).join('')}</div></div></section>
      <p class="cap">A cintura (ao nível do umbigo) e fotos mensais dizem mais do que a balança quando se treina força. Compara sempre na mesma fase do ciclo.</p>`;
    $view.innerHTML = h;
  }

  function guideNote(pctW) {
    if (pctW == null) return ''; // sem ritmo calculado ainda: não mostra nada
    let t, cls = '';
    if (pctW < -0.8) t = 'Estás a descer depressa (mais de 0,8% por semana). Para proteger músculo e hormonas, reduz o défice em Perfil → Ajustes.';
    else if (pctW <= -0.2) { t = 'Ritmo ideal. Mantém o plano.'; cls = 'good'; }
    else t = 'Média estável — normal na fase lútea ou se estás a ganhar músculo; confirma pela cintura. Se ficar igual 3 semanas seguidas, aumenta o défice em Ajustes ou junta ~2000 passos por dia.';
    return `<div class="note ${cls}">${ic(cls ? 'check' : 'info')}<div>${t}</div></div>`;
  }
  function chart(W) {
    const from = range ? addDays(todayKey(), -range) : '0000';
    const pts = W.filter(w => w.d >= from);
    if (pts.length < 2) return `<p class="cap" style="margin:16px 0 0">O gráfico aparece a partir de 2 registos neste período.</p>`;
    const w = 340, h = 150, pl = 4, pr = 38, pt = 10, pb = 20;
    const t0 = fromKey(pts[0].d).getTime(), t1 = fromKey(pts[pts.length - 1].d).getTime();
    const avgs = pts.map(p => weeklyAvg(p.d));
    const vals = pts.map(p => p.kg).concat(avgs);
    const lo = Math.floor(Math.min(...vals) - 0.3), hi = Math.ceil(Math.max(...vals) + 0.3);
    const X = t => pl + ((t - t0) / Math.max(1, t1 - t0)) * (w - pl - pr);
    const Y = v => pt + (1 - (v - lo) / Math.max(0.1, hi - lo)) * (h - pt - pb);
    const step = Math.max(1, Math.ceil((hi - lo) / 3));
    let g = '';
    const lastP = pts[pts.length - 1], yl = Y(lastP.kg), xl = X(fromKey(lastP.d).getTime());
    // linhas da grelha; o número da grelha esconde-se se ficar por baixo da etiqueta do último peso
    for (let v = lo; v <= hi; v += step) g += `<line class="grid" x1="${pl}" x2="${w - pr}" y1="${Y(v)}" y2="${Y(v)}"/>${Math.abs(Y(v) - yl) < 11 ? '' : `<text x="${w - pr + 8}" y="${Y(v) + 3.5}">${v}</text>`}`;
    const line = pts.map((p, i) => [X(fromKey(p.d).getTime()), Y(avgs[i])]);
    const path = line.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join('');
    const area = `${path}L${line[line.length - 1][0].toFixed(1)},${h - pb}L${line[0][0].toFixed(1)},${h - pb}Z`;
    const dots = pts.map(p => `<circle class="raw" cx="${X(fromKey(p.d).getTime())}" cy="${Y(p.kg)}" r="2.6"/>`).join('');
    g += `<text x="${pl}" y="${h - 4}">${niceDate(pts[0].d)}</text><text x="${w - pr}" y="${h - 4}" text-anchor="end">${niceDate(pts[pts.length - 1].d)}</text>`;
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Evolução do peso">
      <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".22"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
      ${g}<path d="${area}" fill="url(#ga)"/>${dots}<path class="avg" d="${path}"/>
      <line class="last-l" x1="${xl}" x2="${w - pr + 2}" y1="${yl}" y2="${yl}"/><circle class="last-d" cx="${xl}" cy="${yl}" r="3.6"/>
      <rect class="last-r" x="${w - pr + 2}" y="${yl - 8.5}" width="${pr - 2}" height="17" rx="8.5"/><text class="last-t" x="${w - pr / 2 + 1}" y="${yl + 3.6}" text-anchor="middle">${n1(lastP.kg)}</text></svg>`;
  }
  let histOpen = false, wSel = null, holdT = null;
  // Medidas além da cintura (opção "Mais medidas" ao registar): as que se costumam tirar a mulheres
  const MEDIDAS = [
    ['busto', 'Peito / busto', 'Na parte mais saliente, com a fita paralela ao chão'],
    ['anca', 'Anca', 'Na parte mais larga das nádegas'],
    ['coxa', 'Coxa', 'Na parte mais grossa, sempre na mesma perna'],
    ['braco', 'Braço', 'A meio, entre o ombro e o cotovelo, relaxado'],
    ['gemeo', 'Gémeo', 'Na parte mais grossa, sempre na mesma perna'],
  ];
  const lastOf = key => [...S.weights].reverse().find(w => w[key]);
  const lastWeight = () => (S.weights.length ? S.weights[S.weights.length - 1] : null);
  const lastHint = () => { const l = lastWeight(); return l ? `Último registo: ${n1(l.kg)} kg · ${DOW_S[dowIdx(l.d)].toLowerCase()}, ${niceDate(l.d)}` : 'O primeiro registo começa no peso do teu perfil.'; };
  function weightSheet() {
    wSel = todayKey();
    return () => {
      const last = lastWeight(), lastCint = [...S.weights].reverse().find(w => w.cint);
      const has = new Set(S.weights.map(w => w.d));
      let chips = '';
      for (let i = 5; i >= 0; i--) {
        const k = addDays(todayKey(), -i), d = fromKey(k);
        chips += `<button type="button" class="dchip press ${k === wSel ? 'sel' : ''} ${i === 0 ? 'today' : ''}" data-act="wdate" data-k="${k}" aria-label="${DOW[dowIdx(k)]}, ${niceDate(k)}">${has.has(k) ? '<i class="has"></i>' : ''}<span class="wd">${i === 0 ? 'Hoje' : DOW_S[dowIdx(k)]}</span><span class="dn num">${d.getDate()}</span><span class="mo">${MON[d.getMonth()]}</span></button>`;
      }
      chips += `<button type="button" class="dchip other press" data-act="wother" aria-expanded="false" aria-controls="wcal">${ic('cal')}<span class="mo" id="wdOtherLbl">Outra</span></button>`;
      return `<div class="over">Novo registo</div><h2>Registar peso</h2>
      <form id="wform">
        <div class="date-strip" id="dstrip">${chips}</div>
        <div class="mcal" id="wcal" hidden></div>
        <input type="hidden" id="wd" value="${wSel}">
        <section class="card weigh">
          <button type="button" class="step" data-step="-0.1" aria-label="Menos 100 gramas">${ic('minus')}</button>
          <div class="wval"><input id="wk" type="text" inputmode="decimal" autocomplete="off" value="${n1(last ? last.kg : S.profile.peso)}" aria-label="Peso em kg" onfocus="this.select()"><span>kg</span></div>
          <button type="button" class="step" data-step="0.1" aria-label="Mais 100 gramas">${ic('plus')}</button>
        </section>
        <p class="cap" id="wHint" style="text-align:center">${lastHint()}</p>
        <div class="list" style="margin-top:14px"><div class="form-row"><label for="wc">Cintura (cm)</label><input id="wc" type="text" inputmode="decimal" autocomplete="off" placeholder="${lastCint ? n1(lastCint.cint) + ' da última vez' : 'opcional'}"></div></div>
        <button type="button" class="more-m press ${S.profile.medidasMais ? 'open' : ''}" data-act="moremed" aria-expanded="${!!S.profile.medidasMais}">${ic('ruler')}<span>Mais medidas</span>${ic('chevR', 'mm-chev')}</button>
        <div class="mm-body ${S.profile.medidasMais ? 'open' : ''}"><div class="mm-in"><div class="list">${MEDIDAS.map(([k, n, tip]) => { const l = lastOf(k);
          return `<div class="form-row mm-row"><label for="m_${k}">${n} (cm)<small>${tip}</small></label><input id="m_${k}" data-m="${k}" type="text" inputmode="decimal" autocomplete="off" placeholder="${l ? 'antes ' + n1(l[k]) : 'opcional'}"></div>`; }).join('')}</div>
          <p class="cap">Fita flexível, justa mas sem apertar, sempre no mesmo sítio. Uma vez por mês chega.</p></div></div>
        <p class="cap">De manhã, em jejum, depois da casa de banho.</p>
        <div class="btn-stack"><button class="btn primary press" type="submit">Guardar</button></div></form>`;
    };
  }
  let wcalMonth = null; // 1.º dia do mês mostrado
  function renderWCal() {
    const box = sheetEl.querySelector('#wcal'); if (!box) return;
    const first = fromKey(wcalMonth), y = first.getFullYear(), m = first.getMonth(), tk = todayKey();
    const lead = (first.getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
    const has = new Set(S.weights.map(w => w.d));
    let cells = '<span></span>'.repeat(lead);
    for (let d = 1; d <= days; d++) {
      const k = keyOf(new Date(y, m, d));
      cells += `<button type="button" class="${k === wSel ? 'sel' : ''} ${k === tk ? 'today' : ''}" data-act="wcalday" data-k="${k}" ${k > tk ? 'disabled' : ''} aria-label="${d} de ${MON_L[m]}${has.has(k) ? ', com registo' : ''}">${d}${has.has(k) ? '<i></i>' : ''}</button>`;
    }
    const nextOff = keyOf(new Date(y, m + 1, 1)) > tk;
    box.innerHTML = `<div class="mcal-h">
        <button type="button" class="circle-btn press" data-act="wcalnav" data-d="-1" aria-label="Mês anterior">${ic('chevL', 'sm')}</button>
        <b>${MON_L[m][0].toUpperCase() + MON_L[m].slice(1)} ${y}</b>
        <button type="button" class="circle-btn press" data-act="wcalnav" data-d="1" aria-label="Mês seguinte" ${nextOff ? 'disabled' : ''}>${ic('chevR', 'sm')}</button>
      </div>
      <div class="mcal-wd">${DOW_S.map(x => `<span>${x}</span>`).join('')}</div>
      <div class="mcal-grid">${cells}</div>`;
  }
  function toggleWCal(open) {
    const box = sheetEl.querySelector('#wcal'), chip = sheetEl.querySelector('.dchip.other');
    if (open === undefined) open = box.hidden;
    if (open) { const d = fromKey(wSel); wcalMonth = keyOf(new Date(d.getFullYear(), d.getMonth(), 1)); renderWCal(); }
    box.hidden = !open; chip.setAttribute('aria-expanded', open);
    if (open) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function selectWDate(k) {
    if (!k || k > todayKey()) return;
    wSel = k;
    sheetEl.querySelector('#wd').value = k;
    let inStrip = false;
    sheetEl.querySelectorAll('.dchip[data-k]').forEach(c => { const on = c.dataset.k === k; c.classList.toggle('sel', on); inStrip ||= on; });
    sheetEl.querySelector('.dchip.other').classList.toggle('sel', !inStrip);
    sheetEl.querySelector('#wdOtherLbl').textContent = inStrip ? 'Outra' : niceDate(k);
    const rec = S.weights.find(w => w.d === k), hint = sheetEl.querySelector('#wHint');
    if (rec) {
      sheetEl.querySelector('#wk').value = n1(rec.kg);
      sheetEl.querySelector('#wc').value = rec.cint ? n1(rec.cint) : '';
      sheetEl.querySelectorAll('[data-m]').forEach(el => { el.value = rec[el.dataset.m] ? n1(rec[el.dataset.m]) : ''; });
      hint.textContent = `Já registaste ${n1(rec.kg)} kg neste dia — guardar substitui.`;
    } else hint.textContent = lastHint();
  }
  function stepWeight(d) {
    const el = sheetEl.querySelector('#wk');
    let v = parseFloat(el.value.replace(',', '.'));
    if (!(v > 0)) v = lastWeight() ? lastWeight().kg : S.profile.peso;
    el.value = n1(Math.min(200, Math.max(30, Math.round((v + d) * 10) / 10)));
  }
  const stopHold = () => { clearTimeout(holdT); clearInterval(holdT); holdT = null; };
  window.addEventListener('pointerup', stopHold);
  window.addEventListener('pointercancel', stopHold);

  // ================= PERFIL =================
  // [id, título, ícone, cor, descrição]
  const PLANO = [
    ['metas', 'As tuas metas', 'target', '#e2590f', 'Calorias, proteína e gordura de cada dia'],
    ['refeicoes', 'As minhas receitas', 'pot', '#1d5c45', 'Criar, editar e eliminar receitas'],
  ];
  const GUIDE = [
    ['turnos', 'Turnos e dias caóticos', 'clock', '#3b5bdb', 'Marmitas, noites, cantina'],
    ['sexo', 'Homem vs mulher', 'users', '#d6336c', 'O que muda na dieta'],
    ['ciclo', 'Ciclo menstrual', 'cycle', '#ae3ec9', 'Como ajustar em cada fase'],
    ['micro', 'Micronutrientes', 'leaf', '#2b8a3e', 'Ferro, cálcio, vitamina D…'],
    ['regras', 'Regras para ficar lean', 'target', '#e2590f', 'Treino, sono, passos'],
    ['trocas', 'Tabela de trocas', 'swap', '#1c7ed6', 'Equivalências entre alimentos'],
  ];
  const SETTINGS = [
    ['ajustes', 'Ajustes do plano', 'sliders', '#e2590f', 'Nome, peso, défice, dias de treino'],
    ['horarios', 'Turnos e horários', 'clock', '#7048e8', 'Horas das refeições em cada turno'],
    ['calendario', 'Calendário dos turnos', 'cal', '#3b5bdb', 'Ler a escala do teu calendário'],
    ['aparencia', 'Aparência', 'contrast', '#5c636a', ''],
    ['dados', 'Cópia de segurança', 'box', '#5c636a', 'Exportar e importar os teus dados'],
  ];
  const HUBS = [
    ['guia', 'Guia', 'book', '#3b5bdb', `${GUIDE.length} temas: turnos, ciclo, micronutrientes…`],
    ['definicoes', 'Definições', 'gear', '#5c636a', 'Plano, turnos, calendário, aparência'],
  ];
  const HUB_ITEMS = { guia: GUIDE, definicoes: SETTINGS };
  const PAGES = [...PLANO, ...HUBS, ...GUIDE, ...SETTINGS];
  const TEMA_N = { light: 'Claro', dark: 'Escuro', auto: 'Automático' };
  const navRow = ([id, l, i, col, d], parent = '') => `<button class="row tap nav-row" data-act="sub" data-id="${id}" ${parent ? `data-parent="${parent}"` : ''}><span class="tile" style="background:${col}">${ic(i)}</span>
    <span class="row-main"><span class="ttl">${l}</span>${d ? `<span class="sub">${d}</span>` : ''}</span>${ic('chevR', 'chev')}</button>`;

  function renderPerfil() {
    if (sub) return renderSub(sub);
    const T = targets(), p = S.profile;
    const W = [...S.weights].sort((x, y) => x.d.localeCompare(y.d)), last = W[W.length - 1];
    const now = last ? weeklyAvg(last.d) : p.peso, since = W.length > 1 ? now - W[0].kg : null;
    const name = (p.nome || '').trim();
    header('', 'Perfil');
    $view.innerHTML = `
      <section class="card me-card">
        <div class="me-top">
          <div class="avatar" aria-hidden="true">${name ? esc(name[0].toUpperCase()) : ic('user')}</div>
          <div class="me-id"><b>${name ? esc(name) : 'O teu perfil'}</b><span>${p.idade} anos · ${(p.altura / 100).toLocaleString('pt-PT', { minimumFractionDigits: 2 })} m</span></div>
          <button class="circle-btn press" data-act="sub" data-id="ajustes" aria-label="Editar os teus dados">${ic('edit', 'sm')}</button>
        </div>
        <div class="me-stats num">
          <div><b>${n1(now)}</b><span>kg atuais</span></div>
          <div><b class="${since !== null && since < 0 ? 'down' : ''}">${since === null ? '—' : (since > 0 ? '+' : since < 0 ? '−' : '') + n1(Math.abs(since))}</b><span>kg desde o início</span></div>
          <div><b>${n1(p.peso / (p.altura / 100) ** 2)}</b><span>IMC</span></div>
        </div>
      </section>
      <div class="tile-grid">${[
        ['metas', 'Metas', 'target', '#e2590f', `${n0(dayType(todayKey()) === 'T' ? T.train : T.rest)} kcal hoje`],
        ['refeicoes', 'Receitas', 'pot', '#1d5c45', `${SLOTS.reduce((n, sl) => n + mealsOf(sl.id).length, 0)} receitas`],
        ['guia', 'Guia', 'book', '#3b5bdb', `${GUIDE.length} temas`],
        ['definicoes', 'Definições', 'gear', '#5c636a', 'Plano, turnos, aparência'],
      ].map(([id, l, i, col, d]) => `<button class="ptile press" data-act="sub" data-id="${id}"><span class="tile" style="background:${col}">${ic(i)}</span><span><b>${l}</b><small>${d}</small></span></button>`).join('')}</div>
      <p class="cap" style="margin-top:20px">Informativo — não substitui um nutricionista. Com historial de distúrbios alimentares, gravidez ou doença, procura acompanhamento profissional.</p>`;
  }

  function renderSub(id) {
    const meta = PAGES.find(x => x[0] === id);
    const catSlot = id === 'refeicoes' && recCat ? SLOTS.find(x => x.id === recCat) : null;
    const title = catSlot ? catSlot.n : meta[1];
    const parent = subParent ? PAGES.find(x => x[0] === subParent) : null;
    $hdr.innerHTML = `<div><button class="back over" data-act="${catSlot ? 'rcatback' : parent ? 'subback' : 'back'}" style="font-size:16px">${ic('chevL', 'sm')}${catSlot ? 'Receitas' : parent ? parent[1] : 'Perfil'}</button><h1>${title}</h1></div>`;
    $top.textContent = title;
    const p = S.profile, T = targets();
    const item = (t, d) => `<div class="item"><h4>${t}</h4><p>${d}</p></div>`;
    const vs = (t, w, m) => `<div class="item"><h4>${t}</h4><div class="vs">${m == null ? `<div class="both">${w}</div>` : `<div><span>Mulher</span>${w}</div><div><span>Homem</span>${m}</div>`}</div></div>`;
    const kv = (l, v) => `<div class="row kv-row"><div class="row-main" style="font-size:15px">${l}</div><div class="val num"><b>${v}</b></div></div>`;
    let h = '';
    if (id === 'turnos') {
      h = `<div class="prose">
        ${item('Não tem de ser perfeito', 'Se acertares na proteína e mais ou menos nas calorias na maioria dos dias, resulta. Um dia fora do plano não estraga nada — conta a média da semana. Quando comes outra coisa, regista em “Comi outra coisa” e segue.')}
        ${item('Marmitas a partir das sobras', 'Turno da manhã: faz o dobro ao jantar e leva no dia seguinte. Turno da tarde: faz o dobro ao almoço e leva para o jantar. A app organiza isto sozinha a partir da escala.')}
        ${item('Cozinhar de uma vez', 'Na folga, prepara 2–3 bases para a semana: uma proteína (frango, carne picada, grão), um hidrato (arroz, batata, massa) e legumes assados. Dura 3–4 dias no frigorífico; o resto congela.')}
        ${item('Turno da noite', 'A refeição principal é o jantar antes de entrar. Durante a noite, refeições pequenas com proteína (iogurte, ovos, atum, fruta) em vez de doces e bolachas do serviço. Ao sair, algo leve antes de dormir.')}
        ${item('Café com hora', 'A cafeína dura 5–6 h no corpo. Nas noites, só na primeira metade do turno; nos turnos de manhã e tarde, evita nas 6 h antes de dormir.')}
        ${item('Kit de emergência na mala', 'Para os dias sem pausa: iogurte proteico ou skyr, uma lata de atum, 30 g de frutos secos, fruta, bolachas de arroz. Evita a máquina de vending.')}
        ${item('Cantina do hospital', 'Regra do prato: metade legumes ou sopa, um quarto proteína (do tamanho da palma da mão), um quarto hidratos (um punho). Fruta como sobremesa.')}
        ${item('Água no posto', 'Deixa uma garrafa de 1 L à vista. A sede durante o turno confunde-se com fome e cansaço.')}
      </div>`;
    } else if (id === 'horarios') {
      h = `<form id="turnos">${SHIFT_ORDER.map(sid => {
        const c = shiftCfg(sid);
        return `<div class="group-label"><span class="sdot" style="--sc:${c.col};margin-right:6px"></span>${c.n}</div><div class="list">
          <div class="form-row"><label for="h_${sid}">Horário</label><input id="h_${sid}" name="h_${sid}" type="text" value="${esc(c.h)}"></div>
          ${SLOTS.map(sl => `<div class="form-row"><label for="t_${sid}_${sl.id}">${c.l[sl.id] || sl.n}</label><input id="t_${sid}_${sl.id}" name="t_${sid}_${sl.id}" type="time" value="${c.t[sl.id]}"></div>`).join('')}
        </div>`;
      }).join('')}${(() => { const pn = shiftCfg('PN'); return `<div class="group-label"><span class="sdot" style="--sc:${pn.col};margin-right:6px"></span>Depois de uma noite</div><div class="list">
          ${['pa', 'almoco'].map(sl => `<div class="form-row"><label for="t_PN_${sl}">${pn.l[sl]}</label><input id="t_PN_${sl}" name="t_PN_${sl}" type="time" value="${pn.t[sl]}"></div>`).join('')}
        </div>`; })()}</form>
      <div class="btn-stack"><button class="btn secondary press" data-act="resetturnos">Repor horários originais</button></div>
      <p class="cap">As refeições aparecem por esta ordem no ecrã Hoje. Horas antes das 05:00 contam como depois da meia-noite.</p>`;
    } else if (id === 'aparencia') {
      const cur = p.tema || 'light';
      h = `<div class="list" style="margin-top:4px">${[['light', 'Claro', 'sun'], ['dark', 'Escuro', 'moon'], ['auto', 'Automático', 'contrast']].map(([v, l, i]) => `
        <button class="row tap" data-act="tema" data-v="${v}" aria-pressed="${cur === v}"><span class="tile" style="background:var(--fill);color:var(--ink-2)">${ic(i)}</span><span class="row-main ttl" style="font-weight:500">${l}</span>${cur === v ? ic('check', 'ok') : ''}</button>`).join('')}</div>
        <p class="cap">Automático segue o modo claro ou escuro do telemóvel.</p>`;
    } else if (HUB_ITEMS[id]) {
      h = `<div class="list" style="margin-top:4px">${HUB_ITEMS[id].map(r => navRow(r[0] === 'aparencia' ? [...r.slice(0, 4), TEMA_N[p.tema || 'light']] : r, id)).join('')}</div>`;
    } else if (id === 'metas') {
      const ea = Math.round((T.train - 300) / (p.peso * 0.73));
      h = `<div class="hero-grid goals num" style="margin-top:4px">
          <div><span><i class="dot" style="background:var(--train)"></i>Dia de treino</span><b>${n0(T.train)}<small>kcal</small></b></div>
          <div><span><i class="dot" style="background:var(--accent)"></i>Dia de descanso</span><b>${n0(T.rest)}<small>kcal</small></b></div>
          <div><span><i class="dot bg-p"></i>Proteína</span><b>${T.prot}<small>g / dia</small></b></div>
          <div><span><i class="dot bg-f"></i>Gordura mínima</span><b>${T.fat}<small>g / dia</small></b></div>
        </div>
        <div class="prose" style="margin-top:12px"><p>Nos <b>dias de treino</b> comes mais 200 kcal, quase tudo em hidratos, para teres energia e recuperares. A <b>proteína</b> é igual todos os dias (2 g por kg) para manter o músculo enquanto perdes gordura. A <b>gordura</b> nunca desce deste mínimo, porque é precisa para as hormonas e o ciclo. Os <b>hidratos</b> ocupam o resto das calorias e são o que a app ajusta em cada refeição.</p></div>
        <div class="group-label">Como são calculadas</div>
        <div class="list">${kv('Metabolismo basal', `${n0(T.bmr)} kcal`)}${kv(`Gasto diário (× ${String(p.atividade).replace('.', ',')})`, `${n0(T.tdee)} kcal`)}${kv(`Média com défice de ${p.defice}%`, `${n0(T.avg)} kcal`)}${kv('Dia de treino', `${n0(T.train)} kcal`)}${kv('Dia de descanso', `${n0(T.rest)} kcal`)}</div>
        <div class="group-label">Macronutrientes</div><div class="list">${kv('<i class="dot bg-p"></i>&nbsp; Proteína · 2,0 g/kg', `${T.prot} g`)}${kv('<i class="dot bg-f"></i>&nbsp; Gordura · 0,9 g/kg', `${T.fat} g`)}${kv('<i class="dot bg-c"></i>&nbsp; Hidratos treino / descanso', `${T.cT} / ${T.cD} g`)}${kv('IMC', n1(p.peso / (p.altura / 100) ** 2))}</div>
        <div class="prose" style="margin-top:12px"><p>O IMC está no intervalo saudável, por isso o objetivo é <b>recomposição</b>: perder gordura devagar mantendo — ou ganhando — músculo. Défice pequeno, proteína alta e treino de força dão um aspeto definido sem perder energia.</p>
        <p style="color:var(--ink-2);font-size:14px">Fórmula de Mifflin-St Jeor. Disponibilidade energética estimada num dia de treino: ~${ea} kcal por kg de massa magra, acima do limiar de risco (~30).</p></div>`;
    } else if (id === 'sexo') {
      h = `<div class="prose">
        ${vs('Calorias', 'Menores em valor absoluto, por haver menos massa magra. A fórmula subtrai 161 kcal.', 'A fórmula soma 5 kcal — cerca de 166 kcal a mais com o mesmo peso, altura e idade.')}
        ${vs('Proteína', 'Igual por kg: 1,6–2,2 g/kg em défice para manter músculo. As mulheres tendem a comer pouca — é a prioridade número um.')}
        ${vs('Gordura', 'Não descer de ~0,8 g/kg (20–25% das calorias): é necessária para o estrogénio e um ciclo regular.', 'Tolera melhor dietas pobres em gordura.')}
        ${vs('Combustível', 'Usa mais gordura em repouso e em exercício moderado; poupa glicogénio.', 'Usa mais hidratos. A diferença diminui com o treino.')}
        ${vs('Défice', 'Mais sensível a défices grandes: falhas do ciclo, perda óssea, fadiga (RED-S). Preferir −10 a −20%.', 'Tolera melhor défices agressivos a curto prazo.')}
        ${vs('Ciclo hormonal', 'Na fase lútea o gasto em repouso sobe 2,5–11,5%, com mais fome e retenção de líquidos.', 'Hormonas estáveis ao longo do mês.')}
        ${vs('Ferro', '16 mg/dia (EFSA), por causa das perdas menstruais.', '11 mg/dia.')}
        ${vs('Massa magra', 'Tende a perder menos músculo durante a dieta.', 'Perde mais facilmente com défices grandes.')}
      </div>`;
    } else if (id === 'ciclo') {
      h = `<div class="prose">
        ${item('Fase folicular · dias 1–14', 'Da menstruação à ovulação. Melhor sensibilidade à insulina e mais energia — boa altura para treinos pesados e para cumprir o défice.')}
        ${item('Fase lútea · dias 15–28', 'O corpo gasta um pouco mais e a fome sobe; é normal querer mais hidratos. Podes juntar 100–150 kcal nesses dias (uma fruta e um quadrado de chocolate negro, ou mais 20 g de aveia).')}
        ${item('Retenção de líquidos', 'Nos dias antes da menstruação a balança pode subir 1–2 kg. Não é gordura — compara com o mesmo momento do ciclo anterior.')}
        ${item('Contraceção hormonal', 'Com pílula as oscilações são menores; segue o plano normalmente.')}
        ${item('Sinal de alarme', 'Se a menstruação falhar ou ficar irregular, aumenta as calorias e fala com um médico — é sinal de défice excessivo.')}
      </div>`;
    } else if (id === 'micro') {
      h = `<div class="prose">
        ${item('Ferro · 16 mg', 'Carne vermelha magra, grão, feijão, lentilhas, espinafres, ovos, tofu. Junta vitamina C (laranja, kiwi, pimento) às leguminosas e evita café ou chá às refeições.')}
        ${item('Cálcio · 1000 mg', 'Skyr, leite, queijo fresco, tofu, amêndoas, brócolos. O plano inclui 2–3 porções de lácteos por dia.')}
        ${item('Vitamina D', '15–20 minutos de sol por dia e peixe gordo. No inverno, pede análise ao médico.')}
        ${item('Ómega-3', 'Peixe gordo 1–2 vezes por semana, nozes, chia.')}
        ${item('Folato · 330 µg', 'Vegetais de folha verde, leguminosas, laranja.')}
        ${item('Fibra · 25 g ou mais', 'Legumes, fruta, aveia, leguminosas, pão integral — também ajudam na saciedade.')}
      </div>`;
    } else if (id === 'regras') {
      h = `<div class="prose">
        ${item('Força 3× por semana', 'Com progressão: mais peso ou mais repetições. É o que dá forma; o cardio é extra.')}
        ${item('7 000–10 000 passos', 'Conta mais para o gasto total do que cardio intenso.')}
        ${item('Proteína em todas as refeições', '25–40 g por refeição.')}
        ${item('Dormir 7–9 horas', 'Pouco sono aumenta a fome e trava a perda de gordura.')}
        ${item('Regra 80/20', 'Uma refeição livre por semana cabe no plano. Não compenses no dia seguinte.')}
        ${item('Paciência', '8–12 semanas para uma diferença clara. Fotos de 4 em 4 semanas.')}
        ${item('Álcool', 'Trava a perda de gordura. Se beberes, que seja ocasional e sem misturas açucaradas.')}
      </div>`;
    } else if (id === 'trocas') {
      h = SWAPS.map(s => `<div class="group-label">${esc(s.t)}</div><div class="list"><ul class="swap-list">${s.l.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('') +
        `<p class="cap">Pesos de arroz, massa, quinoa, carne e peixe em cru.</p>`;
    } else if (id === 'ajustes') {
      const opt = (arr, cur) => arr.map(([v, l]) => `<option value="${v}" ${cur === v ? 'selected' : ''}>${l}</option>`).join('');
      h = `<form id="perfil">
        <div class="group-label" style="margin-top:8px">Tu</div><div class="list">
          <div class="form-row"><label for="nome">Nome</label><input id="nome" name="nome" type="text" autocomplete="given-name" maxlength="30" value="${esc(p.nome || '')}" placeholder="O teu nome"></div>
        </div>
        <div class="group-label">Corpo</div><div class="list">
          <div class="form-row"><label for="idade">Idade</label><input id="idade" name="idade" type="number" min="14" max="90" value="${p.idade}" inputmode="numeric"></div>
          <div class="form-row"><label for="altura">Altura (cm)</label><input id="altura" name="altura" type="number" min="120" max="220" value="${p.altura}" inputmode="numeric"></div>
          <div class="form-row"><label for="peso">Peso (kg)</label><input id="peso" name="peso" type="number" step="0.1" min="30" max="200" value="${p.peso}" inputmode="decimal"></div>
        </div>
        <div class="group-label">Objetivo</div><div class="list">
          <div class="form-row"><label for="defice">Défice</label><select id="defice" name="defice">${opt([[0, 'Manutenção'], [8, '8% · muito suave'], [12, '12% · suave'], [15, '15% · moderado'], [20, '20% · máximo']], p.defice)}</select></div>
          <div class="form-row"><label for="atividade">Atividade</label><select id="atividade" name="atividade">${opt([[1.2, 'Sedentária'], [1.375, 'Ligeira · 3 treinos'], [1.465, 'Moderada · 3–4 treinos + passos'], [1.55, 'Ativa · 5 treinos']], p.atividade)}</select></div>
        </div>
        <div class="group-label">Refeições</div><div class="list">
          <label class="form-row" style="cursor:pointer"><span>Lanche da manhã todos os dias</span><input type="checkbox" name="lmSempre" class="sw-in" ${p.lmSempre ? 'checked' : ''}><span class="switch"></span></label>
          <label class="form-row" style="cursor:pointer"><span>Sobras automáticas</span><input type="checkbox" name="autoSobras" class="sw-in" ${p.autoSobras !== false ? 'checked' : ''}><span class="switch"></span></label>
        </div>
        <p class="cap">Lanche da manhã: desligado, junta-se dia a dia no ecrã Hoje. Sobras — turno da manhã: o almoço é a sobra do jantar da véspera. Turno da tarde: o jantar é a sobra do almoço. Podes mudar refeição a refeição.</p>
        <div class="group-label">Dias de treino habituais</div><div class="list"><div class="days">
          ${DOW_S.map((d, i) => `<label><input type="checkbox" name="td" value="${i}" ${p.treinoDias.includes(i) ? 'checked' : ''}><span>${d}</span></label>`).join('')}
        </div></div>
        <p class="cap">Ponto de partida para semanas novas — muda dia a dia em Semana → Escala. Recomendado: défice de 12% e atividade ligeira. Se ao fim de 3 semanas a média de peso e a cintura não descerem, sobe o défice um nível.</p>
      </form>`;
    } else if (id === 'refeicoes' && catSlot) {
      const list = mealsOf(catSlot.id);
      h = `<div class="group-label" style="margin-top:8px">${list.length} ${list.length === 1 ? 'receita' : 'receitas'}</div><div class="list">${list.map(o => `
          <button class="row tap" data-act="redit" data-id="${o.id}"><div class="row-main"><div class="ttl" style="font-weight:500">${esc(o.n)}</div><div class="sub">${recipeTags(o)}</div></div>${ic('chevR', 'chev')}</button>`).join('')}</div>
        <div class="fab-wrap"><button class="fab-add" data-act="rnew" data-slot="${catSlot.id}">${ic('plus')}<span>Nova receita</span></button></div>`;
    } else if (id === 'refeicoes') {
      const r = R(), changed = Object.keys(r.edits).length + Object.keys(r.removed).length;
      h = `<div class="btn-stack" style="margin-top:4px"><button class="btn primary press" data-act="rnew" data-slot="almoco">${ic('plus')} Nova receita</button></div>
        <div class="group-label">Refeições</div><div class="cat-cards">${SLOTS.map(sl => { const n = mealsOf(sl.id).length; return `
          <button class="row tap cat-card press" data-act="rcat" data-slot="${sl.id}"><span class="tile" style="background:var(--accent-soft);color:var(--accent)">${ic(SLOT_IC[sl.id] || 'apple')}</span><div class="row-main"><div class="ttl" style="font-weight:500">${sl.n}</div><div class="sub">${n} ${n === 1 ? 'receita' : 'receitas'}</div></div>${ic('chevR', 'chev')}</button>`; }).join('')}</div>
` +
        (changed ? `<div class="btn-stack"><button class="btn secondary press" data-act="rreset">Repor as receitas originais</button></div>` : '');
    } else if (id === 'calendario') {
      const c = S.cal || {};
      if (!c.url) {
        h = `<div class="prose"><p>Liga o calendário onde tens os turnos e a escala preenche-se sozinha sempre que abres a app. Podes mudar qualquer dia à mão — a tua escolha fica por cima do calendário.</p></div>
          <form id="calform"><div class="group-label">Ligação</div><div class="list">
            <div class="form-row"><label for="cal_url">Endereço</label><input id="cal_url" name="url" type="url" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="https://…workers.dev" required></div>
            <div class="form-row"><label for="cal_key">Chave</label><input id="cal_key" name="key" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="XXXX-XXXX-XXXX-XXXX" required></div>
          </div>
          <p class="cap">O endereço e a chave ficam guardados só neste telemóvel.</p>
          <div class="btn-stack"><button class="btn primary press" type="submit">Ligar calendário</button></div></form>`;
      } else {
        const n = Object.keys(c.shifts || {}).filter(k => k >= todayKey()).length;
        h = `<div class="list">
            <div class="row kv-row"><div class="row-main" style="font-size:15px">Estado</div><div class="val"><b style="color:${c.err ? 'var(--danger)' : 'var(--accent)'}">${c.err ? esc(c.err) : 'Ligado'}</b></div></div>
            <div class="row kv-row"><div class="row-main" style="font-size:15px">Última sincronização</div><div class="val"><b>${c.sync ? ago(c.sync) : '—'}</b></div></div>
            <div class="row kv-row"><div class="row-main" style="font-size:15px">Turnos a partir de hoje</div><div class="val num"><b>${n}</b></div></div>
          </div>
          <div class="btn-stack"><button class="btn secondary press" data-act="calsync">Sincronizar agora</button>
          <button class="btn danger press" data-act="caloff">Desligar calendário</button></div>
          <p class="cap">A app lê o calendário ao abrir (no máximo de 10 em 10 minutos). Sem internet, usa a última escala lida.</p>`;
      }
    } else if (id === 'dados') {
      h = `<div class="prose"><p>Tudo fica guardado apenas neste telemóvel, sem contas nem servidores. Exporta uma cópia de vez em quando — por exemplo, antes de mudar de telemóvel.</p></div>
        <div class="btn-stack"><button class="btn secondary press" data-act="export">Exportar cópia</button>
        <label class="btn secondary press" style="cursor:pointer">Importar cópia<input id="importFile" type="file" accept="application/json,.json" hidden></label>
        <button class="btn danger press" data-act="reset">Apagar todos os dados</button></div>`;
    }
    $view.innerHTML = h;
  }

  function saveProfile(f) {
    const num = n => parseFloat(f.elements[n].value);
    const p = S.profile;
    for (const k of ['idade', 'altura', 'peso']) if (num(k) > 0) p[k] = num(k);
    p.defice = num('defice'); p.atividade = num('atividade');
    p.treinoDias = [...f.querySelectorAll('input[name=td]:checked')].map(i => +i.value);
    p.autoSobras = f.elements.autoSobras.checked;
    p.lmSempre = f.elements.lmSempre.checked;
    p.nome = f.elements.nome.value.trim();
    save(); toast('Plano recalculado');
  }
  function saveShifts(f) {
    const out = {};
    for (const sid of SHIFT_ORDER) {
      const o = { t: {} }, h = f.elements['h_' + sid].value.trim();
      if (h && h !== SHIFTS[sid].h) o.h = h;
      for (const sl of SLOTS) { const v = f.elements[`t_${sid}_${sl.id}`].value; if (v && v !== SHIFTS[sid].t[sl.id]) o.t[sl.id] = v; }
      if (o.h || Object.keys(o.t).length) out[sid] = o;
    }
    const pn = { t: {} };
    for (const sl of ['pa', 'almoco']) { const v = f.elements[`t_PN_${sl}`].value; if (v && v !== SHIFTS.PN.t[sl]) pn.t[sl] = v; }
    if (Object.keys(pn.t).length) out.PN = pn;
    S.profile.shifts = out; save(); toast('Horários guardados');
  }
  const blobToData = b => new Promise(ok => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(b); });
  async function exportData() {
    const photos = {};
    for (const id of Object.keys(PHOTO_URL)) if (id !== DRAFT_PHOTO) { try { photos[id] = await blobToData(await (await fetch(PHOTO_URL[id])).blob()); } catch (e) { /* ignora esta foto */ } }
    const blob = new Blob([JSON.stringify(Object.keys(photos).length ? { ...S, photos } : S, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `pulso-${todayKey()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function importData(file) {
    if (!file) return;
    file.text().then(t => {
      const d = JSON.parse(t);
      if (!d || !d.profile) throw new Error('formato');
      const photos = d.photos || {}; delete d.photos;
      S = { ...blank(), ...d, profile: { ...DEFAULT_PROFILE, ...d.profile } }; save(); applyTheme(); toast('Dados importados');
      return Promise.all(Object.entries(photos).map(([id, url]) => fetch(url).then(x => x.blob()).then(b => setPhoto(id, b)).catch(() => {}))).then(() => render());
    }).catch(() => toast('Ficheiro inválido'));
  }

  // ================= Eventos =================
  function handle(a, b) {
    switch (a) {
      // Hoje
      case 'today': { const dir = todayKey() > curDay ? 'next' : 'prev'; curDay = todayKey(); render(dir); return; }
      case 'day': { if (b.dataset.k === curDay) return; const dir = b.dataset.k > curDay ? 'next' : 'prev'; curDay = b.dataset.k; render(dir); return; }
      case 'type': if (b.dataset.v !== dayType(curDay)) toggleTrain(curDay); break;
      case 'dayset': openSheet(daySheet(curDay)); return;
      case 'escala': openSheet(escalaSheet()); return;
      case 'done': animSlot = b.dataset.slot; toggleDone(b.dataset.slot); if (sheetEl && sheetEl.classList.contains('open')) closeSheet(); break;
      case 'meal': if (sheetEl) delete sheetEl.dataset.mode; msDoses = 1; openSheet(mealSheet(b.dataset.slot)); return;
      case 'hist': histOpen = !histOpen; break;
      case 'shopcat': { const m = S.profile.shopMin ||= {}; if (m[b.dataset.c]) delete m[b.dataset.c]; else m[b.dataset.c] = true; save(); break; }
      case 'shiftnote': {
        const m = S.profile.notaMin ||= (S.profile.notaTurnoMin ? { turno: true, pn: true } : {});
        delete S.profile.notaTurnoMin;
        m[b.dataset.n] = !m[b.dataset.n]; save(); break;
      }
      case 'agua': { const st = dayState(curDay); st.agua = Math.max(0, Math.min(20, (st.agua || 0) + +b.dataset.d)); save(); break; }
      // Semana
      case 'wk': weekOffset += +b.dataset.d; render(+b.dataset.d > 0 ? 'next' : 'prev'); return;
      case 'open': go('hoje', null, b.dataset.k); return;
      // refeição de outro dia aberta na Semana: os detalhes usam esse dia e, ao fechar, o Hoje volta ao dia em que estava
      case 'wkrepeat': {
        const mon = weekMon(), prev = addDays(mon, -7);
        askConfirm({ title: 'Repetir a semana anterior?', ok: 'Repetir refeições', okCls: 'primary', onOk: repeatPrevWeek,
          text: `As refeições de <b>${niceDate(mon)} a ${niceDate(addDays(mon, 6))}</b> passam a ser iguais às de ${niceDate(prev)} a ${niceDate(addDays(prev, 6))}. As trocas que já fizeste nesta semana são substituídas. Os turnos e os treinos ficam como estão.` });
        return;
      }
      case 'wmeal': if (semBack === null) semBack = curDay; curDay = b.dataset.k; if (sheetEl) delete sheetEl.dataset.mode; msDoses = 1; openSheet(mealSheet(b.dataset.slot)); return;
      // Compras
      case 'sw': shopMode = b.dataset.w; break;
      case 'got': { const m = (S.shop[shopKey()] ||= {}); m[b.dataset.f] = !m[b.dataset.f]; save(); break; }
      case 'share': shareList(); return;
      case 'clear': delete S.shop[shopKey()]; save(); break;
      // Progresso
      case 'addw': openSheet(weightSheet()); return;
      case 'range': range = +b.dataset.v; break;
      case 'delw': {
        const w = S.weights.find(x => x.d === b.dataset.d); if (!w) return;
        askConfirm({ title: 'Apagar registo?', ok: 'Apagar registo',
          text: `<b class="num">${n1(w.kg)} kg${w.cint ? ` · ${n1(w.cint)} cm` : ''}</b> de ${DOW[dowIdx(w.d)].toLowerCase()}, ${niceDate(w.d)}. Isto não pode ser desfeito.`,
          onOk: () => { S.weights = S.weights.filter(x => x.d !== w.d); save(); render(); toast('Registo apagado'); } });
        return;
      }
      case 'usepeso': S.profile.peso = +b.dataset.kg; save(); toast(`Plano recalculado para ${n1(+b.dataset.kg)} kg`); break;
      // Perfil
      case 'sub': sub = b.dataset.id; subParent = b.dataset.parent || null; recCat = null; render('push'); window.scrollTo(0, 0); return;
      case 'back': sub = null; subParent = null; recCat = null; render('pop'); window.scrollTo(0, 0); return;
      case 'subback': sub = subParent; subParent = null; render('pop'); window.scrollTo(0, 0); return;
      case 'rcat': recCat = b.dataset.slot; render('push'); window.scrollTo(0, 0); return;
      case 'rcatback': recCat = null; render('pop'); window.scrollTo(0, 0); return;
      case 'export': exportData(); return;
      case 'tema': S.profile.tema = b.dataset.v; save(); applyTheme(); break;
      case 'calreset': delete dayState(b.dataset.k).turno; save(); render(); if (sheetEl && sheetEl.classList.contains('open')) paintSheet(); return;
      case 'calsync': syncCal(true).then(n => toast(`${n} turnos lidos`)).catch(e => toast(e.message)); return;
      case 'caloff':
        askConfirm({ title: 'Desligar o calendário?', ok: 'Desligar', text: 'Os turnos que mudaste à mão ficam; os do calendário deixam de aparecer.',
          onOk: () => { S.cal = { shifts: {}, autoS: true }; save(); render(); toast('Calendário desligado'); } });
        return;
      case 'redit': openEditor(mealById(b.dataset.id)); return;
      case 'rnew': openEditor(null, b.dataset.slot); return;
      case 'rreset':
        askConfirm({ title: 'Repor as receitas originais?', ok: 'Repor', text: 'As receitas do plano que editaste ou eliminaste voltam ao original. As que criaste ficam.',
          onOk: () => { const r = R(); r.edits = {}; r.removed = {}; save(); render(); toast('Receitas repostas'); } });
        return;
      case 'lmadd': dayState(curDay).lm = true; save(); toast('Lanche da manhã adicionado'); break;
      case 'resetturnos': S.profile.shifts = {}; save(); toast('Horários repostos'); break;
      case 'reset':
        askConfirm({ title: 'Apagar todos os dados?', ok: 'Apagar tudo', text: 'Pesos, refeições marcadas, trocas, preferências e ajustes. Isto não pode ser desfeito — se quiseres, exporta antes uma cópia.',
          onOk: () => { S = blank(); save(); applyTheme(); render(); toast('Dados apagados'); } });
        return;
      default: return;
    }
    render();
  }
  $view.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (b) handle(b.dataset.act, b); });
  $hdr.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (b) handle(b.dataset.act, b); });
  $view.addEventListener('submit', e => {
    if (e.target.id !== 'calform') return;
    e.preventDefault();
    const f = e.target, url = f.elements.url.value.trim(), key = f.elements.key.value.trim();
    if (!/^(https:\/\/|http:\/\/localhost[:/])/.test(url)) { toast('O endereço tem de começar por https://'); return; }
    S.cal = { ...(S.cal || {}), url, key, shifts: {}, autoS: true };
    save();
    syncCal(true).then(n => { toast(`Ligado — ${n} turnos lidos`); render(); })
      .catch(err => { toast(err.message); render(); });
  });
  $view.addEventListener('change', e => {
    const el = e.target;
    if (el.form && el.form.id === 'perfil') saveProfile(el.form);
    if (el.form && el.form.id === 'turnos') saveShifts(el.form);
    if (el.id === 'importFile') importData(el.files[0]);
  });

  function onSheetClick(e) {
    const stp = e.target.closest('[data-step]');
    if (stp) { if (e.detail === 0) stepWeight(+stp.dataset.step); return; } // teclado
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act;
    if (a === 'close') { pendingConfirm = null; return closeSheet(); }
    if (a === 'confirm-ok') { const f = pendingConfirm; pendingConfirm = null; closeSheet(); if (f) f(); return; }
    if (a === 'wdate') { toggleWCal(false); return selectWDate(b.dataset.k); }
    if (a === 'wother') return toggleWCal();
    if (a === 'photodel') return removePhoto(b.dataset.id);
    if (a === 'doses') { msDoses = Math.max(1, Math.min(8, msDoses + +b.dataset.d)); paintSheet(); return; }
    if (a === 'wcalday') { selectWDate(b.dataset.k); return toggleWCal(false); }
    if (a === 'wcalnav') { const d = fromKey(wcalMonth); wcalMonth = keyOf(new Date(d.getFullYear(), d.getMonth() + +b.dataset.d, 1)); return renderWCal(); }
    const slot = b.dataset.slot;
    const refresh = () => { save(); render(); paintSheet(); };
    switch (a) {
      case 'moremed': { S.profile.medidasMais = !S.profile.medidasMais; save(); const on = S.profile.medidasMais;
        b.classList.toggle('open', on); b.setAttribute('aria-expanded', on); sheetEl.querySelector('.mm-body').classList.toggle('open', on); return; }
      case 'mode': sheetEl.dataset.mode = b.dataset.v; paintSheet(); sheetBody.scrollTo({ top: sheetBody.scrollHeight, behavior: 'smooth' }); return;
      case 'pick': {
        const st = dayState(curDay);
        if (sourceOf(curDay, slot)) S.links[LK(curDay, slot)] = 'none';
        if (b.dataset.id === WEEK[dowIdx(curDay)][slot]) delete st.swaps[slot]; else st.swaps[slot] = b.dataset.id;
        delete sheetEl.dataset.mode; refresh(); sheetBody.scrollTop = 0; toast('Refeição trocada'); return;
      }
      case 'done': if (tab === 'hoje') animSlot = slot; toggleDone(slot); render(); closeSheet(); return;
      case 'fora': { const st = dayState(curDay); (st.fora ||= {})[slot] = +b.dataset.kcal; st.done[slot] = false; save(); render(); closeSheet(); toast('Registado'); return; }
      case 'unfora': { const st = dayState(curDay); delete st.fora[slot]; refresh(); return; }
      case 'unlink': S.links[LK(curDay, slot)] = 'none'; refresh(); toast('Sem sobras nesta refeição'); return;
      case 'link': {
        const dest = LK(b.dataset.dk, b.dataset.ds), on = sourceOf(b.dataset.dk, b.dataset.ds) === LK(curDay, slot);
        S.links[dest] = on ? 'none' : LK(curDay, slot);
        refresh(); return;
      }
      case 'calreset': delete dayState(b.dataset.k).turno; save(); render(); paintSheet(); toast('A seguir o calendário'); return;
      case 'lmrem': { const st = dayState(curDay); st.lm = false; delete st.done.lm; if (st.fora) delete st.fora.lm; save(); render(); closeSheet(); toast('Lanche da manhã retirado'); return; }
      case 'redit': openEditor(mealById(b.dataset.id)); return;
      case 'rnew': openEditor(null, b.dataset.slot, b.dataset.pick ? { k: curDay, slot } : null); return;
      case 'rview': syncDraftFromDom(); stopScan(); rDraft.view = b.dataset.v; paintSheet(); sheetBody.scrollTop = 0;
        if (b.dataset.v === 'food') sheetEl.querySelector('#f_q').focus();
        if (b.dataset.v === 'scan') startScan();
        return;
      case 'raddoff': if (offHits[+b.dataset.i]) addOffFood(offHits[+b.dataset.i]); return;
      case 'bcgo': lookupBarcode(sheetEl.querySelector('#bc_in').value); return;
      case 'rslot': syncDraftFromDom(); rDraft.slot = b.dataset.v; paintSheet(); return;
      case 'rdel': syncDraftFromDom(); rDraft.i.splice(+b.dataset.ri, 1); paintSheet(); return;
      case 'raddf': { const F = food(b.dataset.f); rDraft.i.push({ f: b.dataset.f, g: F.u ? F.u[0] : 100 }); rDraft.view = 'edit'; paintSheet(); const ins = sheetEl.querySelectorAll('.g-in'); if (ins.length) { ins[ins.length - 1].focus(); ins[ins.length - 1].select(); } return; }
      case 'rfoodsave': return saveNewFood();
      case 'rsave': return saveRecipe();
      case 'rdelete': return deleteRecipe();
      case 'setshift':
        if (b.dataset.v === 'M' && afterNight(b.dataset.k)) { toast('Depois de uma noite não dá para fazer manhã'); return; }
        setShift(b.dataset.k, b.dataset.v); render(); paintSheet();
        if (b.dataset.v === 'N' && shiftOf(addDays(b.dataset.k, 1)) === 'M') toast('O dia a seguir está como Manhã — muda-o');
        return;
      case 'settrain': toggleTrain(b.dataset.k); render(); paintSheet(); return;
    }
  }
  function onSheetSubmit(e) {
    if (e.target.id !== 'wform') return;
    e.preventDefault();
    const d = sheetEl.querySelector('#wd').value;
    const kg = parseFloat(sheetEl.querySelector('#wk').value.replace(',', '.'));
    const c = parseFloat(sheetEl.querySelector('#wc').value.replace(',', '.'));
    if (!d || !(kg > 0)) return;
    const extra = {};
    sheetEl.querySelectorAll('[data-m]').forEach(el => { const v = parseFloat(el.value.replace(',', '.')); if (v > 0) extra[el.dataset.m] = v; });
    S.weights = S.weights.filter(w => w.d !== d);
    S.weights.push({ d, kg, ...(c > 0 ? { cint: c } : {}), ...extra });
    save(); closeSheet(); render(); toast('Registo guardado');
  }

  // Deslizar a barra de dias para mudar de semana
  let sx = null;
  $view.addEventListener('touchstart', e => { sx = e.target.closest('#strip') ? e.touches[0].clientX : null; }, { passive: true });
  $view.addEventListener('touchend', e => {
    if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) { curDay = addDays(curDay, dx < 0 ? 7 : -7); render(dx < 0 ? 'next' : 'prev'); }
  });

  // ================= Calendário =================
  // O intermediário (pasta worker/) devolve [{ d: 'AAAA-MM-DD', s: 'HH:MM' | null, dur: minutos, k: 'M'|'T'|'N'|'F'|null }]
  function buildShifts(events) {
    const rank = { N: 4, T: 3, M: 2, F: 1 }, map = {};
    for (const ev of events) {
      let L = ev.k;
      if (!L && ev.s) { const h = +ev.s.slice(0, 2); L = h >= 5 && h < 11 ? 'M' : h >= 11 && h < 18 ? 'T' : 'N'; }
      if (!L) continue;
      const d = L === 'N' && ev.s && ev.s < '05:00' ? addDays(ev.d, -1) : ev.d; // noite que começa à meia-noite pertence ao dia anterior
      if (!map[d] || rank[L] > rank[map[d]]) map[d] = L;
    }
    return map;
  }
  let syncing = null;
  function syncCal(force) {
    const c = S.cal;
    if (!c || !c.url || !c.key) return Promise.resolve(0);
    if (!force && c.sync && Date.now() - c.sync < 10 * 60e3) return Promise.resolve(Object.keys(c.shifts || {}).length);
    if (syncing) return syncing;
    syncing = fetch(c.url, { headers: { Authorization: `Bearer ${c.key}` }, cache: 'no-store' })
      .then(r => {
        if (r.status === 401) throw new Error('Chave errada');
        if (!r.ok) throw new Error(r.status === 502 ? 'Não consegui ler o calendário' : `Erro ${r.status}`);
        return r.json();
      })
      .then(data => {
        c.events = data.events || []; c.shifts = buildShifts(c.events); c.sync = Date.now(); c.err = null;
        save(); render();
        return Object.keys(c.shifts).length;
      })
      .catch(err => {
        c.err = err instanceof TypeError ? 'Sem ligação' : err.message; save();
        if (tab === 'semana' || (tab === 'perfil' && sub === 'calendario')) render();
        throw new Error(c.err);
      })
      .finally(() => { syncing = null; });
    return syncing;
  }
  function ago(ts) {
    const m = Math.round((Date.now() - ts) / 60000);
    return m < 1 ? 'agora mesmo' : m < 60 ? `há ${m} min` : m < 1440 ? `há ${Math.round(m / 60)} h` : `há ${Math.round(m / 1440)} dias`;
  }
  function calStatus() {
    const c = S.cal;
    if (!c || !c.url) return '';
    return `<p class="cap" style="display:flex;align-items:center;gap:6px;margin-top:12px">${ic('cal', 'sm')}${c.err ? `Calendário: ${esc(c.err)} — a usar a escala de ${c.sync ? ago(c.sync) : 'antes'}` : `Calendário sincronizado ${c.sync ? ago(c.sync) : ''}`}</p>`;
  }

  // Migração: refeições marcadas com "não gosto" passam a eliminadas
  if (S.prefs && S.prefs.hide && Object.keys(S.prefs.hide).length) { Object.assign(R().removed, S.prefs.hide); delete S.prefs; save(); }

  // ================= Gesto / botão "voltar" do telemóvel =================
  // A app é uma página única: guardamos uma entrada extra no histórico sempre que não estamos no ecrã inicial,
  // para o "voltar" recuar um passo dentro da app em vez de a fechar.
  const sheetOpen = () => !!(sheetEl && sheetEl.classList.contains('open'));
  // Profundidade atual da interface (0 = ecrã Hoje, no dia de hoje, sem nada aberto)
  function uiDepth() {
    let d = navStack.length;
    if (tab !== 'hoje') { if (!navStack.length) d++; } else if (curDay !== screenDay) d++;
    if (sub) d++;
    if (sub && subParent) d++;
    if (sub && recCat) d++;
    if (sheetOpen()) {
      d++;
      if (sheetEl.dataset.mode) d++;
      if (sheetRender === editorSheet && rDraft && rDraft.view !== 'edit') d += rDraft.view === 'food' ? 1 : 2;
    }
    return d;
  }
  // O histórico do browser acompanha a profundidade. As entradas novas só são criadas durante um toque
  // (o Chrome do Android salta entradas criadas sem toque), e o "voltar" só desfaz — nunca cria.
  let histD = (history.state && history.state.d) || 0, expectD = null, expectT = 0, inPop = false;
  function syncGuard() {
    if (inPop || expectD !== null) return; // à espera de um recuo pedido pela app: acerta quando ele chegar
    const t = uiDepth();
    while (histD < t) { histD++; history.pushState({ d: histD }, ''); }
    if (t < histD) { // fechaste algo pela app: tira as entradas a mais (um recuo de cada vez)
      expectD = t; history.go(t - histD);
      expectT = setTimeout(() => { if (expectD === null) return; expectD = null; histD = (history.state && history.state.d) || 0; syncGuard(); }, 700);
    }
  }
  function backStep() {
    if (sheetOpen()) {
      if (sheetRender === editorSheet && rDraft && rDraft.view !== 'edit') { stopScan(); rDraft.view = rDraft.view === 'food' ? 'edit' : 'food'; paintSheet(); sheetBody.scrollTop = 0; return; }
      if (sheetEl.dataset.mode) { delete sheetEl.dataset.mode; paintSheet(); return; }
      pendingConfirm = null; closeSheet(); return;
    }
    if (tab === 'perfil' && recCat) { recCat = null; render('pop'); window.scrollTo(0, 0); return; }
    if (sub && subParent) { sub = subParent; subParent = null; render('pop'); window.scrollTo(0, 0); return; }
    if (sub) { sub = null; recCat = null; render('pop'); window.scrollTo(0, 0); return; }
    if (tab === 'hoje' && curDay !== screenDay) { const dir = screenDay > curDay ? 'next' : 'prev'; curDay = screenDay; render(dir); return; }
    if (navStack.length) { // volta ao ecrã anterior, como estava (incluindo onde estavas na página)
      const s = navStack.pop();
      ({ tab, sub, subParent, recCat, curDay, weekOffset, shopMode, range, screenDay } = s);
      render('fade');
      window.scrollTo(0, s.y || 0); requestAnimationFrame(() => window.scrollTo(0, s.y || 0));
      return;
    }
    if (tab !== 'hoje') { tab = 'hoje'; render('fade'); window.scrollTo(0, 0); }
  }
  window.addEventListener('popstate', e => {
    const d = (e.state && e.state.d) || 0;
    if (expectD !== null) { clearTimeout(expectT); expectD = null; histD = d; syncGuard(); return; }
    inPop = true;
    for (let n = 0; n < Math.min(10, histD - d); n++) backStep(); // um passo por cada entrada recuada
    inPop = false;
    histD = d;
    syncGuard();
  });
  // iPhone (app no ecrã principal): não há gesto de voltar do sistema — deslizar do bordo esquerdo para a direita
  if (/iPhone|iPad|iPod/.test(navigator.userAgent) && navigator.standalone) {
    let ex = null, ey = 0;
    document.addEventListener('touchstart', e => { const t = e.touches[0]; ex = t.clientX < 24 ? t.clientX : null; ey = t.clientY; }, { passive: true });
    document.addEventListener('touchend', e => {
      if (ex === null) return;
      const t = e.changedTouches[0];
      if (t.clientX - ex > 70 && Math.abs(t.clientY - ey) < 60 && uiDepth() > 0) history.back();
      ex = null;
    }, { passive: true });
  }

  // ================= Arranque =================
  // Depois de recarregar, volta ao sítio onde estavas
  try {
    const nav = JSON.parse(sessionStorage.getItem(NAV_KEY));
    if (nav && TABS.some(t => t[0] === nav.tab)) {
      tab = nav.tab;
      if (tab === 'perfil' && PAGES.some(x => x[0] === nav.sub)) { sub = nav.sub; subParent = HUB_ITEMS[nav.subParent] ? nav.subParent : null; recCat = SLOTS.some(x => x.id === nav.recCat) ? nav.recCat : null; }
      if (nav.on === todayKey() && /^\d{4}-\d{2}-\d{2}$/.test(nav.curDay || '')) curDay = nav.curDay;
      if (nav.on === todayKey() && Array.isArray(nav.stack)) { navStack = nav.stack; if (/^\d{4}-\d{2}-\d{2}$/.test(nav.screenDay || '')) screenDay = nav.screenDay; }
      weekOffset = +nav.weekOffset || 0; shopMode = ['w0', 'w1', 'm0', 'm1'].includes(nav.shopMode) ? nav.shopMode : 'w0'; range = [0, 30, 90].includes(nav.range) ? nav.range : 30;
    }
  } catch (e) { /* começa no Hoje */ }
  if (!history.state || typeof history.state.d !== 'number') history.replaceState({ d: 0 }, '');
  render();

  // ================= Puxar para baixo para atualizar =================
  const ptr = document.createElement('div');
  ptr.className = 'ptr'; ptr.setAttribute('aria-hidden', 'true'); ptr.innerHTML = ic('refresh');
  document.body.appendChild(ptr);
  const PTR_MAX = 92, PTR_GO = 64;
  let py0 = null, px0 = 0, pull = 0, refreshing = false;
  const setPtr = (y, anim) => {
    ptr.style.transition = anim ? 'transform .3s var(--ease), opacity .3s' : 'none';
    ptr.style.transform = `translateY(${y - 56}px) rotate(${y * 4}deg)`;
    ptr.style.opacity = Math.min(1, y / PTR_GO);
    ptr.classList.toggle('ready', y >= PTR_GO);
  };
  document.addEventListener('touchstart', e => {
    py0 = (!refreshing && !sheetOpen() && window.scrollY <= 0) ? e.touches[0].clientY : null;
    px0 = e.touches[0].clientX; pull = 0;
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (py0 === null) return;
    const dy = e.touches[0].clientY - py0, dx = Math.abs(e.touches[0].clientX - px0);
    if (dy <= 0 || dx > dy || window.scrollY > 0) { if (pull) setPtr(0, true); pull = 0; return; }
    pull = Math.min(PTR_MAX, dy * 0.5);
    setPtr(pull, false);
  }, { passive: true });
  document.addEventListener('touchend', () => {
    if (py0 === null) return;
    py0 = null;
    if (pull >= PTR_GO) pullRefresh(); else if (pull) setPtr(0, true);
    pull = 0;
  }, { passive: true });
  async function pullRefresh() {
    refreshing = true;
    setPtr(PTR_GO, true); ptr.classList.add('spin');
    const t0 = Date.now();
    try {
      const reg = 'serviceWorker' in navigator && await navigator.serviceWorker.getRegistration();
      if (reg) await reg.update();
    } catch (e) { /* sem internet */ }
    await syncCal(true).catch(() => {});
    await new Promise(r => setTimeout(r, Math.max(0, 700 - (Date.now() - t0))));
    // Com internet recarrega sempre: assim apanha a versão nova mesmo que o telemóvel já a tenha descarregado
    // em segundo plano (a app fica aberta em memória dias seguidos). Volta ao mesmo ecrã.
    if (navigator.onLine !== false) { location.reload(); return; }
    render();
    ptr.classList.remove('spin'); setPtr(0, true);
    refreshing = false;
    toast(navigator.onLine === false ? 'Sem internet — a mostrar o que está guardado' : 'Atualizado');
  }
  // Versão nova instalada enquanto a app estava aberta: recarrega quando não estiveres a meio de alguma coisa
  let newVersion = false;
  const reloadIfNew = () => { if (newVersion && !(sheetEl && sheetEl.classList.contains('open')) && document.visibilityState === 'visible') location.reload(); };
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.addEventListener('controllerchange', () => { newVersion = true; reloadIfNew(); });
  }
  let lastToday = todayKey();
  document.addEventListener('visibilitychange', () => {
    reloadIfNew();
    if (document.visibilityState !== 'visible') return;
    if (todayKey() !== lastToday) { lastToday = curDay = screenDay = todayKey(); navStack = []; render(); }
    syncCal().catch(() => {});
  });
  syncCal().catch(() => {});
  loadPhotos().then(changed => { if (changed) render(); });
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
