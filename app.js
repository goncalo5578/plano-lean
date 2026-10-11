/* Plano Lean — plano alimentar (sem servidor; os dados ficam guardados no próprio telemóvel). */
(() => {
  'use strict';

  // ================= Estado =================
  const KEY = 'planoLean.v1';
  const DEFAULT_PROFILE = { idade: 23, altura: 162, peso: 60, atividade: 1.375, defice: 12, treinoDias: [0, 2, 4] };
  const blank = () => ({ profile: { ...DEFAULT_PROFILE }, days: {}, weights: [], shop: {} });
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
    drop: '<path d="M12 3.5c3.5 4.2 6 7.6 6 10.5a6 6 0 0 1-12 0c0-2.9 2.5-6.3 6-10.5z"/>',
    flame: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.3-5.4 3.9-7.6.4 1.6 1.3 2.7 2.4 3.2-.2-3 1.3-5.9 3.4-7.4.1 3.3 3.3 5.6 3.3 9.8 0 4.4-2.6 8.2-6.5 8.2z"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.2"/>',
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
  const SLOT_IC = { pa: 'sunrise', almoco: 'sun', lanche: 'apple', jantar: 'moon' };

  // ================= Datas =================
  const DOW = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  const DOW_S = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
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
  const mealById = id => ALL_MEALS.find(m => m.id === id);
  const dayState = k => (S.days[k] ||= { swaps: {}, done: {}, agua: 0 });
  const peekDay = k => S.days[k] || { swaps: {}, done: {}, agua: 0 };
  const dayType = k => peekDay(k).type || (S.profile.treinoDias.includes(dowIdx(k)) ? 'T' : 'D');

  function sumItems(items) {
    const r = { kcal: 0, p: 0, c: 0, f: 0 };
    for (const it of items) { const F = FOODS[it.f]; for (const k in r) r[k] += F[k] * it.g / 100; }
    return r;
  }
  const roundG = (f, g) => f === 'bolachaArroz' ? Math.max(8, Math.round(g / 8) * 8) : Math.max(5, Math.round(g / 5) * 5);

  function dayPlan(k) {
    const st = peekDay(k), type = dayType(k), t = type === 'T' ? 1 : 0, idx = dowIdx(k);
    const T = targets();
    const goal = t ? T.train : T.rest;
    const meals = SLOTS.map(s => {
      const m = mealById(st.swaps[s.id] || WEEK[idx][s.id]);
      const items = m.i.map(it => ({ f: it.f, r: it.r, g: Array.isArray(it.g) ? it.g[t] : it.g })).filter(it => it.g > 0);
      return { slot: s, meal: m, items };
    });
    // Ajusta os hidratos (role c) para bater nas calorias alvo do dia
    const all = meals.flatMap(m => m.items);
    const base = sumItems(all).kcal;
    const carbK = sumItems(all.filter(i => i.r === 'c')).kcal;
    const factor = carbK > 0 ? Math.min(1.7, Math.max(0.6, 1 + (goal - base) / carbK)) : 1;
    for (const it of all) if (it.r === 'c') it.g = roundG(it.f, it.g * factor);
    for (const m of meals) m.tot = sumItems(m.items);
    const tot = sumItems(all);
    const doneMeals = meals.filter(m => st.done[m.slot.id]);
    const done = sumItems(doneMeals.flatMap(m => m.items));
    return { k, type, goal, meals, tot, done, nDone: doneMeals.length, st, T };
  }

  // ================= Formatação =================
  const PLURAL = { fatia: 'fatias', wrap: 'wraps', bolacha: 'bolachas', lata: 'latas', scoop: 'scoops', ovo: 'ovos', 'banana média': 'bananas médias', 'maçã': 'maçãs', 'pêra': 'pêras', laranja: 'laranjas', kiwi: 'kiwis', prato: 'pratos', quadrado: 'quadrados' };
  const plural = (lbl, n) => (n > 1 && PLURAL[lbl]) ? PLURAL[lbl] : lbl;
  function unitHint(f, g) {
    const F = FOODS[f]; if (!F.u) return '';
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

  // ================= Navegação =================
  const $view = document.getElementById('view');
  const $hdr = document.getElementById('hdr');
  const $top = document.getElementById('topbar');
  const $tabs = document.getElementById('tabs');
  const TABS = [['hoje', 'Hoje', 'plate'], ['semana', 'Semana', 'cal'], ['compras', 'Compras', 'bag'], ['progresso', 'Progresso', 'chart'], ['perfil', 'Perfil', 'user']];
  let tab = 'hoje', sub = null, curDay = todayKey(), weekOffset = 0, shopWeek = 0, range = 30;

  $tabs.innerHTML = TABS.map(([id, l, i]) => `<button data-tab="${id}" class="press">${ic(i)}<span>${l}</span></button>`).join('');
  $tabs.addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) go(b.dataset.tab); });

  function go(t, subpage = null) {
    if (t === 'hoje' && tab === 'hoje' && !subpage) curDay = todayKey();
    tab = t; sub = subpage;
    render(true); window.scrollTo(0, 0);
  }
  function render(anim) {
    $tabs.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    ({ hoje: renderHoje, semana: renderSemana, compras: renderCompras, progresso: renderProgresso, perfil: renderPerfil })[tab]();
    if (anim) { $view.classList.remove('fade'); void $view.offsetWidth; $view.classList.add('fade'); }
    onScroll();
  }
  function header(over, title, actions = '') {
    $hdr.innerHTML = `<div><div class="over">${over}</div><h1>${title}</h1></div><div class="hdr-actions">${actions}</div>`;
    $top.textContent = title.replace(/<[^>]+>/g, '');
  }
  const onScroll = () => $top.classList.toggle('show', window.scrollY > 56);
  window.addEventListener('scroll', onScroll, { passive: true });

  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 1700);
  }

  // ================= Folha (bottom sheet) =================
  let sheetEl = null, backEl = null, sheetRender = null;
  function openSheet(renderFn) {
    sheetRender = renderFn;
    if (!sheetEl) {
      backEl = document.createElement('div'); backEl.className = 'backdrop';
      sheetEl = document.createElement('div'); sheetEl.className = 'sheet'; sheetEl.setAttribute('role', 'dialog'); sheetEl.setAttribute('aria-modal', 'true');
      document.body.append(backEl, sheetEl);
      backEl.addEventListener('click', closeSheet);
      sheetEl.addEventListener('click', onSheetClick);
      sheetEl.addEventListener('submit', onSheetSubmit);
      let y0 = null;
      sheetEl.addEventListener('touchstart', e => { y0 = sheetEl.scrollTop <= 0 ? e.touches[0].clientY : null; }, { passive: true });
      sheetEl.addEventListener('touchmove', e => {
        if (y0 == null) return; const dy = e.touches[0].clientY - y0;
        if (dy > 0) { sheetEl.style.transition = 'none'; sheetEl.style.transform = `translateY(${dy}px)`; }
      }, { passive: true });
      sheetEl.addEventListener('touchend', e => {
        if (y0 == null) return; const dy = e.changedTouches[0].clientY - y0; y0 = null;
        sheetEl.style.transition = ''; sheetEl.style.transform = '';
        if (dy > 110) closeSheet();
      });
    }
    paintSheet();
    backEl.hidden = sheetEl.hidden = false;
    void sheetEl.offsetHeight; // garante a animação de entrada depois de display:none
    backEl.classList.add('open'); sheetEl.classList.add('open');
    sheetEl.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }
  function paintSheet() {
    sheetEl.innerHTML = `<div class="grabber"></div><button class="sheet-close press" data-act="close" aria-label="Fechar">${ic('x')}</button>${sheetRender()}`;
  }
  function closeSheet() {
    if (!sheetEl) return;
    backEl.classList.remove('open'); sheetEl.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { if (!sheetEl.classList.contains('open')) { backEl.hidden = sheetEl.hidden = true; } }, 380);
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

  // ================= HOJE =================
  function dayTitle(k) {
    const diff = Math.round((fromKey(k) - fromKey(todayKey())) / 864e5);
    return diff === 0 ? 'Hoje' : diff === 1 ? 'Amanhã' : diff === -1 ? 'Ontem' : DOW[dowIdx(k)];
  }
  function renderHoje() {
    const P = dayPlan(curDay), T = P.T, isT = P.type === 'T';
    const isToday = curDay === todayKey();
    header(`${DOW[dowIdx(curDay)]}, ${niceDate(curDay)}`, dayTitle(curDay),
      isToday ? '' : `<button class="pill-btn press" data-act="today">Hoje</button>`);

    const mon = mondayOf(curDay);
    let strip = '<div class="strip" id="strip">';
    for (let i = 0; i < 7; i++) {
      const k = addDays(mon, i), st = peekDay(k);
      const pct = (Object.values(st.done || {}).filter(Boolean).length / SLOTS.length) * 100;
      strip += `<button class="${k === curDay ? 'sel' : ''} ${k === todayKey() ? 'today' : ''} ${dayType(k) === 'T' ? 'train' : ''}" data-act="day" data-k="${k}" aria-label="${DOW[i]} ${niceDate(k)}">
        <span class="wd">${DOW_S[i]}</span><span class="ring" style="--pct:${pct}"><span class="dn num">${dayNum(k)}</span></span><span class="mk"></span></button>`;
    }
    strip += '</div>';

    const left = P.goal - P.done.kcal;
    const pct = Math.min(100, (P.done.kcal / P.goal) * 100);
    const cG = isT ? T.cT : T.cD;
    const mac = (lbl, cls, v, g) => `<div><div class="m-lbl"><i class="dot bg-${cls}"></i>${lbl}</div>
      <div class="m-val num"><b>${n0(v)}</b> / ${g} g</div><div class="track thin"><i class="bg-${cls}" style="width:${Math.min(100, (v / g) * 100)}%"></i></div></div>`;

    let h = strip + `
      <section class="card">
        <div class="energy-top">
          <div><div class="big num">${n0(Math.abs(left))}</div><div class="big-lbl">${left >= 0 ? 'kcal por comer' : 'kcal acima da meta'}</div></div>
          <div class="seg" role="group" aria-label="Tipo de dia">
            <button class="${isT ? 'on train' : ''}" data-act="type" data-v="T">Treino</button>
            <button class="${!isT ? 'on' : ''}" data-act="type" data-v="D">Descanso</button>
          </div>
        </div>
        <div class="track"><i style="width:${pct}%"></i></div>
        <div class="meta num"><span>Comido <b>${n0(P.done.kcal)}</b></span><span>Meta <b>${n0(P.goal)}</b> kcal</span></div>
        <div class="macros3">${mac('Proteína', 'p', P.done.p, T.prot)}${mac('Hidratos', 'c', P.done.c, cG)}${mac('Gordura', 'f', P.done.f, T.fat)}</div>
      </section>`;
    if (isT) h += `<div class="note train">${ic('flame')}<div>Dia de treino — mais hidratos ao almoço e no lanche. Treina 1–3 h depois do lanche, ou come-o logo a seguir ao treino.</div></div>`;

    h += `<h2 class="sec-h">Refeições <small class="num">${P.nDone} de ${P.meals.length}</small></h2><div class="list">`;
    for (const m of P.meals) {
      const done = !!P.st.done[m.slot.id];
      h += `<div class="row tap meal-row ${done ? 'done' : ''}" data-act="meal" data-slot="${m.slot.id}">
        <button class="check ${done ? 'on' : ''}" data-act="done" data-slot="${m.slot.id}" aria-pressed="${done}" aria-label="Marcar ${m.slot.n} como comido">${ic('check')}</button>
        <div class="row-main">
          <div class="over">${isT && m.slot.nt ? m.slot.nt : m.slot.n} · ${m.slot.t}</div>
          <div class="ttl">${esc(m.meal.n)}</div>
          <div class="sub num">${n0(m.tot.kcal)} kcal &nbsp;${macroLine(m.tot)}</div>
        </div>${ic('chevR', 'chev')}</div>`;
    }
    h += `</div>`;

    const agua = P.st.agua || 0;
    h += `<h2 class="sec-h">Hidratação</h2>
      <section class="card water">
        <div class="w-ic">${ic('drop')}</div>
        <div class="row-main"><div class="num"><b style="font-size:18px">${n1(agua * 0.25)} L</b> <span style="color:var(--ink-3);font-size:14px">de 2,5 L</span></div>
          <div class="track"><i style="width:${Math.min(100, agua * 10)}%"></i></div></div>
        <div class="stepper"><button class="press" data-act="agua" data-d="-1" aria-label="Menos um copo">${ic('minus')}</button><button class="press" data-act="agua" data-d="1" aria-label="Mais um copo">${ic('plus')}</button></div>
      </section>
      <p class="cap">1 copo = 250 ml. As quantidades de hidratos ajustam-se sozinhas à meta do dia (${n0(P.tot.kcal)} kcal planeadas).</p>`;
    $view.innerHTML = h;
  }

  function mealSheet(slotId) {
    return () => {
      const P = dayPlan(curDay), m = P.meals.find(x => x.slot.id === slotId), isT = P.type === 'T';
      const done = !!P.st.done[slotId];
      const showAlts = sheetEl && sheetEl.dataset.alts === slotId;
      let h = `<div class="over">${isT && m.slot.nt ? m.slot.nt : m.slot.n} · ${m.slot.t}</div><h2>${esc(m.meal.n)}</h2>
        <div class="stat4 num"><div><b>${n0(m.tot.kcal)}</b><span>kcal</span></div><div><b style="color:var(--p)">${n0(m.tot.p)}</b><span>proteína</span></div>
        <div><b style="color:var(--c)">${n0(m.tot.c)}</b><span>hidratos</span></div><div><b style="color:var(--f)">${n0(m.tot.f)}</b><span>gordura</span></div></div>`;
      if (isT && m.meal.treino) h += `<div class="note train">${ic('flame')}<div>${esc(m.meal.treino)}</div></div>`;
      h += `<div class="group-label">Ingredientes</div><div class="list">${m.items.map(it => `<div class="row ing"><div class="row-main">${esc(FOODS[it.f].n)}</div><div class="q num">${qty(it.f, it.g)}${unitHint(it.f, it.g) ? `<small>${unitHint(it.f, it.g)}</small>` : ''}</div></div>`).join('')}</div>
        <div class="group-label">Preparação</div><div class="list"><ol class="steps">${steps(m.meal.prep)}</ol></div>`;
      if (showAlts) {
        h += `<div class="group-label">Escolher outra opção</div><div class="list">${MEALS[slotId].map(o => {
          const sel = o.id === m.meal.id;
          return `<button class="row tap alt ${sel ? 'sel' : ''}" data-act="pick" data-slot="${slotId}" data-id="${o.id}"><div class="row-main"><div class="ttl">${esc(o.n)}</div></div>${sel ? ic('check', 'ok') : ''}</button>`;
        }).join('')}</div>`;
      }
      h += `<div class="btn-stack">
        <button class="btn primary press" data-act="done" data-slot="${slotId}">${done ? 'Desmarcar' : ic('check') + ' Marcar como comido'}</button>
        ${showAlts ? '' : `<button class="btn secondary press" data-act="alts" data-slot="${slotId}">${ic('swap')} Trocar refeição</button>`}
      </div>`;
      return h;
    };
  }

  function toggleDone(slot) { const st = dayState(curDay); st.done[slot] = !st.done[slot]; save(); }

  // ================= SEMANA =================
  function renderSemana() {
    const mon = addDays(mondayOf(todayKey()), weekOffset * 7);
    const lbl = weekOffset === 0 ? 'Esta semana' : weekOffset === 1 ? 'Próxima semana' : weekOffset === -1 ? 'Semana passada' : `${niceDate(mon)} – ${niceDate(addDays(mon, 6))}`;
    header(`${niceDate(mon)} – ${niceDate(addDays(mon, 6))}`, 'Semana');
    const plans = Array.from({ length: 7 }, (_, i) => dayPlan(addDays(mon, i)));
    const avg = plans.reduce((a, p) => a + p.tot.kcal, 0) / 7;
    const avgP = plans.reduce((a, p) => a + p.tot.p, 0) / 7;
    const nT = plans.filter(p => p.type === 'T').length;
    let h = `<div class="weeknav">
        <button class="circle-btn press" data-act="wk" data-d="-1" aria-label="Semana anterior">${ic('chevL', 'sm')}</button>
        <span class="lbl">${lbl}</span>
        <button class="circle-btn press" data-act="wk" data-d="1" aria-label="Semana seguinte">${ic('chevR', 'sm')}</button></div>
      <section class="card kpis num"><div><b>${n0(avg)}</b><span>kcal / dia</span></div><div><b>${n0(avgP)} g</b><span>proteína / dia</span></div><div><b>${nT}</b><span>treinos</span></div></section>
      <div class="list">`;
    plans.forEach((P, i) => {
      const isT = P.type === 'T';
      h += `<div class="row tap ${P.k === todayKey() ? 'is-today' : ''}" data-act="open" data-k="${P.k}">
        <div class="day-date"><div class="wd">${DOW_S[i]}</div><div class="dn num">${dayNum(P.k)}</div></div>
        <div class="row-main">
          <div class="tag ${isT ? 'train' : 'rest'}">${isT ? ic('flame', 'sm') + 'Treino' : 'Descanso'} <span style="color:var(--ink-3);font-weight:500" class="num">· ${n0(P.tot.kcal)} kcal</span></div>
          <div class="sub clamp">${P.meals.map(m => esc(m.meal.n)).join(' · ')}</div>
        </div>${ic('chevR', 'chev')}</div>`;
    });
    h += `</div><p class="cap">Os dias de treino escolhem-se em Perfil → Ajustes. Toca num dia para ver as quantidades.</p>`;
    $view.innerHTML = h;
  }

  // ================= COMPRAS =================
  const shopKey = () => addDays(mondayOf(todayKey()), shopWeek * 7);
  const CAT_ORDER = ['Proteínas', 'Laticínios e ovos', 'Hidratos', 'Legumes', 'Fruta', 'Gorduras', 'Outros'];
  function shopItems() {
    const mon = shopKey(), agg = {};
    for (let i = 0; i < 7; i++) for (const m of dayPlan(addDays(mon, i)).meals) for (const it of m.items) agg[it.f] = (agg[it.f] || 0) + it.g;
    const cats = {};
    for (const f in agg) (cats[FOODS[f].cat] ||= []).push({ f, g: agg[f] });
    for (const c in cats) cats[c].sort((a, b) => FOODS[a.f].n.localeCompare(FOODS[b.f].n, 'pt'));
    return cats;
  }
  function amountTxt(f, g) {
    if (f === 'sopa') return { a: `${Math.ceil(g / 300)} pratos`, h: '1–2 panelas' };
    const liq = isLiquid(f), F = FOODS[f];
    const a = g >= 1000 ? `${n1(Math.ceil(g / 100) / 10)} ${liq ? 'L' : 'kg'}` : `${Math.ceil(g / 10) * 10} ${liq ? 'ml' : 'g'}`;
    let h = '';
    if (F.u && !['azeite', 'manteigaAm', 'chocolate'].includes(f)) { const n = Math.ceil(g / F.u[0] - 0.15); h = `${n} ${plural(F.u[1], n)}`; }
    if (f === 'claras') h = `${Math.ceil(g / 33)} claras`;
    return { a, h };
  }
  function renderCompras() {
    const k = shopKey(), cats = shopItems(), got = S.shop[k] || {};
    const total = Object.values(cats).flat().length, nGot = Object.values(cats).flat().filter(i => got[i.f]).length;
    header(`${niceDate(k)} – ${niceDate(addDays(k, 6))}`, 'Compras', `<button class="circle-btn press" data-act="share" aria-label="Partilhar lista">${ic('share', 'sm')}</button>`);
    let h = `<div class="seg full"><button class="${shopWeek === 0 ? 'on' : ''}" data-act="sw" data-w="0">Esta semana</button><button class="${shopWeek === 1 ? 'on' : ''}" data-act="sw" data-w="1">Próxima semana</button></div>
      <section class="card" style="margin-top:12px"><div class="meta num" style="margin:0"><span><b>${nGot}</b> de ${total} artigos</span>${nGot ? '<button data-act="clear" style="color:var(--accent);font-weight:600;font-size:13px">Limpar</button>' : ''}</div>
      <div class="track thin"><i style="width:${total ? (nGot / total) * 100 : 0}%"></i></div></section>`;
    for (const c of CAT_ORDER) {
      if (!cats[c]) continue;
      h += `<div class="group-label">${c}</div><div class="list">`;
      for (const it of cats[c]) {
        const A = amountTxt(it.f, it.g), on = !!got[it.f];
        h += `<button class="row tap shop-row ${on ? 'got' : ''}" data-act="got" data-f="${it.f}" aria-pressed="${on}">
          <span class="cb">${ic('check')}</span><span class="row-main ttl">${esc(FOODS[it.f].n)}</span>
          <span class="val num">${A.a}${A.h ? `<small>${A.h}</small>` : ''}</span></button>`;
      }
      h += `</div>`;
    }
    h += `<p class="cap">Inclui as trocas de refeições feitas para essa semana. Temperos (alho, cebola, limão, ervas, especiarias, vinagre, molho de soja, tomate pelado) não estão na lista.</p>`;
    $view.innerHTML = h;
  }
  async function shareList() {
    const cats = shopItems(), got = S.shop[shopKey()] || {};
    let txt = `Lista de compras · ${niceDate(shopKey())}\n`;
    for (const c of CAT_ORDER) {
      const rows = (cats[c] || []).filter(it => !got[it.f]);
      if (!rows.length) continue;
      txt += `\n${c}\n` + rows.map(it => { const A = amountTxt(it.f, it.g); return `• ${FOODS[it.f].n} — ${A.a}${A.h ? ` (${A.h})` : ''}`; }).join('\n') + '\n';
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
    header('Peso e medidas', 'Progresso', `<button class="circle-btn press" data-act="addw" aria-label="Novo registo">${ic('plus', 'sm')}</button>`);
    S.weights.sort((a, b) => a.d.localeCompare(b.d));
    const W = S.weights, tk = todayKey();
    if (!W.length) {
      $view.innerHTML = `<section class="card empty">${ic('scale')}<b>Sem registos</b>Pesa-te 3–7 manhãs por semana, em jejum.<div class="btn-stack"><button class="btn primary press" data-act="addw">${ic('plus')} Registar peso</button></div></section>${guideNote(null)}`;
      return;
    }
    const last = W[W.length - 1];
    const nowAvg = weeklyAvg(last.d), prevAvg = weeklyAvg(addDays(last.d, -7));
    const delta = nowAvg != null && prevAvg != null ? nowAvg - prevAvg : null;
    const cint = [...W].reverse().find(w => w.cint);
    let h = `<section class="card">
      <div class="energy-top"><div><div class="big-lbl" style="margin:0 0 6px">Média de 7 dias</div><div class="big num">${n1(nowAvg)}<span style="font-size:20px;color:var(--ink-3);font-weight:600"> kg</span></div></div>
        ${delta != null ? `<span class="delta ${delta < 0 ? 'down' : ''} num">${delta > 0 ? '+' : delta < 0 ? '−' : ''}${n1(Math.abs(delta))} kg/sem</span>` : ''}</div>
      ${chart(W)}
      <div class="seg full" style="margin-top:12px">${[[30, '1 mês'], [90, '3 meses'], [0, 'Tudo']].map(([v, l]) => `<button class="${range === v ? 'on' : ''}" data-act="range" data-v="${v}">${l}</button>`).join('')}</div>
    </section>
    <section class="card kpis num"><div><b>${n1(W[0].kg)}</b><span>início · ${niceDate(W[0].d)}</span></div><div><b>${(nowAvg - W[0].kg) > 0 ? '+' : ''}${n1(nowAvg - W[0].kg)}</b><span>kg no total</span></div><div><b>${cint ? n1(cint.cint) : '—'}</b><span>cintura (cm)</span></div></section>
    ${guideNote(delta != null ? (delta / prevAvg) * 100 : null)}`;
    if (Math.abs(nowAvg - S.profile.peso) >= 1) h += `<div class="btn-stack" style="margin-top:12px"><button class="btn secondary press" data-act="usepeso" data-kg="${Math.round(nowAvg * 10) / 10}">Recalcular plano para ${n1(nowAvg)} kg</button></div>`;
    h += `<div class="group-label">Histórico</div><div class="list">${W.map((w, i) => ({ w, i })).reverse().slice(0, 60).map(({ w, i }) => `
      <div class="row"><div class="row-main"><div class="ttl num">${n1(w.kg)} kg${w.cint ? ` <span style="color:var(--ink-3);font-weight:500">· ${n1(w.cint)} cm</span>` : ''}</div><div class="sub">${DOW[dowIdx(w.d)]}, ${niceDate(w.d)}</div></div>
      <button class="circle-btn press" style="box-shadow:none;background:var(--fill);color:var(--ink-3);width:32px;height:32px" data-act="delw" data-i="${i}" aria-label="Apagar registo">${ic('trash', 'sm')}</button></div>`).join('')}</div>
      <p class="cap">A cintura (ao nível do umbigo) e fotos mensais dizem mais do que a balança quando se treina força. Compara sempre na mesma fase do ciclo.</p>`;
    $view.innerHTML = h;
  }
  function guideNote(pctW) {
    let t = 'Objetivo: −0,25 a −0,5 kg por semana. Compara médias semanais, não dias soltos.', cls = '';
    if (pctW != null) {
      if (pctW < -0.8) t = 'Estás a descer depressa (mais de 0,8% por semana). Para proteger músculo e hormonas, reduz o défice em Perfil → Ajustes.';
      else if (pctW <= -0.2) { t = 'Ritmo ideal. Mantém o plano.'; cls = 'good'; }
      else t = 'Média estável — normal na fase lútea ou se estás a ganhar músculo; confirma pela cintura. Se ficar igual 3 semanas seguidas, aumenta o défice em Ajustes ou junta ~2000 passos por dia.';
    }
    return `<div class="note ${cls}">${ic(cls ? 'check' : 'info')}<div>${t}</div></div>`;
  }
  function chart(W) {
    const from = range ? addDays(todayKey(), -range) : '0000';
    const pts = W.filter(w => w.d >= from);
    if (pts.length < 2) return `<p class="cap" style="margin:16px 0 0">O gráfico aparece a partir de 2 registos neste período.</p>`;
    const w = 340, h = 150, pl = 4, pr = 30, pt = 10, pb = 20;
    const t0 = fromKey(pts[0].d).getTime(), t1 = fromKey(pts[pts.length - 1].d).getTime();
    const avgs = pts.map(p => weeklyAvg(p.d));
    const vals = pts.map(p => p.kg).concat(avgs);
    const lo = Math.floor(Math.min(...vals) - 0.3), hi = Math.ceil(Math.max(...vals) + 0.3);
    const X = t => pl + ((t - t0) / Math.max(1, t1 - t0)) * (w - pl - pr);
    const Y = v => pt + (1 - (v - lo) / Math.max(0.1, hi - lo)) * (h - pt - pb);
    const step = Math.max(1, Math.ceil((hi - lo) / 3));
    let g = '';
    for (let v = lo; v <= hi; v += step) g += `<line class="grid" x1="${pl}" x2="${w - pr}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${w - pr + 6}" y="${Y(v) + 3.5}">${v}</text>`;
    const line = pts.map((p, i) => [X(fromKey(p.d).getTime()), Y(avgs[i])]);
    const path = line.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)},${q[1].toFixed(1)}`).join('');
    const area = `${path}L${line[line.length - 1][0].toFixed(1)},${h - pb}L${line[0][0].toFixed(1)},${h - pb}Z`;
    const dots = pts.map(p => `<circle class="raw" cx="${X(fromKey(p.d).getTime())}" cy="${Y(p.kg)}" r="2.6"/>`).join('');
    g += `<text x="${pl}" y="${h - 4}">${niceDate(pts[0].d)}</text><text x="${w - pr}" y="${h - 4}" text-anchor="end">${niceDate(pts[pts.length - 1].d)}</text>`;
    return `<svg class="chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Evolução do peso">
      <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".22"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
      ${g}<path d="${area}" fill="url(#ga)"/>${dots}<path class="avg" d="${path}"/></svg>`;
  }
  function weightSheet() {
    return () => `<div class="over">Novo registo</div><h2>Registar peso</h2>
      <form id="wform"><div class="list">
        <div class="form-row"><label for="wd">Data</label><input id="wd" type="date" value="${todayKey()}" max="${todayKey()}" required></div>
        <div class="form-row"><label for="wk">Peso (kg)</label><input id="wk" type="number" step="0.1" min="30" max="200" inputmode="decimal" placeholder="${n1(S.weights.length ? S.weights[S.weights.length - 1].kg : S.profile.peso)}" required></div>
        <div class="form-row"><label for="wc">Cintura (cm)</label><input id="wc" type="number" step="0.5" min="40" max="200" inputmode="decimal" placeholder="opcional"></div>
      </div>
      <p class="cap">De manhã, em jejum, depois da casa de banho.</p>
      <div class="btn-stack"><button class="btn primary press" type="submit">Guardar</button></div></form>`;
  }

  // ================= PERFIL =================
  const GUIDE = [
    ['numeros', 'Os teus números', 'gauge', '#1d5c45'],
    ['sexo', 'Homem vs mulher', 'users', '#d6336c'],
    ['ciclo', 'Ciclo menstrual', 'cycle', '#ae3ec9'],
    ['micro', 'Micronutrientes', 'leaf', '#2b8a3e'],
    ['regras', 'Regras para ficar lean', 'target', '#e2590f'],
    ['trocas', 'Tabela de trocas', 'swap', '#1c7ed6'],
  ];
  const SETTINGS = [['ajustes', 'Ajustes do plano', 'sliders', '#5c636a'], ['dados', 'Cópia de segurança', 'box', '#5c636a'], ['fontes', 'Fontes científicas', 'doc', '#5c636a']];
  const navRow = ([id, l, i, col]) => `<button class="row tap" data-act="sub" data-id="${id}"><span class="tile" style="background:${col}">${ic(i)}</span><span class="row-main ttl" style="font-weight:500">${l}</span>${ic('chevR', 'chev')}</button>`;

  function renderPerfil() {
    if (sub) return renderSub(sub);
    const T = targets(), p = S.profile;
    header(`${p.idade} anos · ${(p.altura / 100).toLocaleString('pt-PT', { minimumFractionDigits: 2 })} m · ${n1(p.peso)} kg`, 'Perfil');
    $view.innerHTML = `
      <div class="hero-grid num">
        <div><span>Dia de treino</span><b>${n0(T.train)}<small>kcal</small></b></div>
        <div><span>Dia de descanso</span><b>${n0(T.rest)}<small>kcal</small></b></div>
        <div><span>Proteína</span><b>${T.prot}<small>g / dia</small></b></div>
        <div><span>Gordura mínima</span><b>${T.fat}<small>g / dia</small></b></div>
      </div>
      <p class="cap">Défice de ${p.defice}% sobre um gasto estimado de ${n0(T.tdee)} kcal · ${p.treinoDias.length} treinos por semana.</p>
      <div class="group-label">Guia</div><div class="list">${GUIDE.map(navRow).join('')}</div>
      <div class="group-label">Definições</div><div class="list">${SETTINGS.map(navRow).join('')}</div>
      <p class="cap" style="margin-top:20px">Informativo — não substitui um nutricionista. Com historial de distúrbios alimentares, gravidez ou doença, procura acompanhamento profissional.</p>`;
  }

  function renderSub(id) {
    const all = [...GUIDE, ...SETTINGS], meta = all.find(x => x[0] === id);
    $hdr.innerHTML = `<div><button class="back over" data-act="back" style="font-size:16px">${ic('chevL', 'sm')}Perfil</button><h1>${meta[1]}</h1></div>`;
    $top.textContent = meta[1];
    const p = S.profile, T = targets();
    const item = (t, d) => `<div class="item"><h4>${t}</h4><p>${d}</p></div>`;
    const vs = (t, w, m) => `<div class="item"><h4>${t}</h4><div class="vs">${m == null ? `<div class="both">${w}</div>` : `<div><span>Mulher</span>${w}</div><div><span>Homem</span>${m}</div>`}</div></div>`;
    const kv = (l, v) => `<div class="row kv-row"><div class="row-main" style="font-size:15px">${l}</div><div class="val num"><b>${v}</b></div></div>`;
    let h = '';
    if (id === 'numeros') {
      const ea = Math.round((T.train - 300) / (p.peso * 0.73));
      h = `<div class="list">${kv('Metabolismo basal', `${n0(T.bmr)} kcal`)}${kv(`Gasto diário (× ${String(p.atividade).replace('.', ',')})`, `${n0(T.tdee)} kcal`)}${kv(`Média com défice de ${p.defice}%`, `${n0(T.avg)} kcal`)}${kv('Dia de treino', `${n0(T.train)} kcal`)}${kv('Dia de descanso', `${n0(T.rest)} kcal`)}</div>
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
        <div class="group-label" style="margin-top:8px">Corpo</div><div class="list">
          <div class="form-row"><label for="idade">Idade</label><input id="idade" name="idade" type="number" min="14" max="90" value="${p.idade}" inputmode="numeric"></div>
          <div class="form-row"><label for="altura">Altura (cm)</label><input id="altura" name="altura" type="number" min="120" max="220" value="${p.altura}" inputmode="numeric"></div>
          <div class="form-row"><label for="peso">Peso (kg)</label><input id="peso" name="peso" type="number" step="0.1" min="30" max="200" value="${p.peso}" inputmode="decimal"></div>
        </div>
        <div class="group-label">Objetivo</div><div class="list">
          <div class="form-row"><label for="defice">Défice</label><select id="defice" name="defice">${opt([[0, 'Manutenção'], [8, '8% · muito suave'], [12, '12% · suave'], [15, '15% · moderado'], [20, '20% · máximo']], p.defice)}</select></div>
          <div class="form-row"><label for="atividade">Atividade</label><select id="atividade" name="atividade">${opt([[1.2, 'Sedentária'], [1.375, 'Ligeira · 3 treinos'], [1.465, 'Moderada · 3–4 treinos + passos'], [1.55, 'Ativa · 5 treinos']], p.atividade)}</select></div>
        </div>
        <div class="group-label">Dias de treino</div><div class="list"><div class="days">
          ${DOW_S.map((d, i) => `<label><input type="checkbox" name="td" value="${i}" ${p.treinoDias.includes(i) ? 'checked' : ''}><span>${d}</span></label>`).join('')}
        </div></div>
        <p class="cap">Recomendado: défice de 12% e atividade ligeira. Se ao fim de 3 semanas a média de peso e a cintura não descerem, sobe o défice um nível.</p>
      </form>`;
    } else if (id === 'dados') {
      h = `<div class="prose"><p>Tudo fica guardado apenas neste telemóvel, sem contas nem servidores. Exporta uma cópia de vez em quando — por exemplo, antes de mudar de telemóvel.</p></div>
        <div class="btn-stack"><button class="btn secondary press" data-act="export">Exportar cópia</button>
        <label class="btn secondary press" style="cursor:pointer">Importar cópia<input id="importFile" type="file" accept="application/json,.json" hidden></label>
        <button class="btn danger press" data-act="reset">Apagar todos os dados</button></div>`;
    } else if (id === 'fontes') {
      h = `<div class="prose"><ol class="src" style="margin:14px 0">
        <li>Sims ST et al. (2023). ISSN position stand: nutritional concerns of the female athlete. <i>J Int Soc Sports Nutr</i> 20(1). <a href="https://doi.org/10.1080/15502783.2023.2204066" target="_blank" rel="noopener">doi</a></li>
        <li>Wohlgemuth KJ et al. (2021). Sex differences and considerations for female specific nutritional strategies. <i>J Int Soc Sports Nutr</i> 18:27. <a href="https://doi.org/10.1186/s12970-021-00422-8" target="_blank" rel="noopener">doi</a></li>
        <li>Mountjoy M et al. (2023). IOC consensus statement on Relative Energy Deficiency in Sport (REDs). <i>Br J Sports Med</i> 57:1073–97. <a href="https://pubmed.ncbi.nlm.nih.gov/37752011/" target="_blank" rel="noopener">PubMed</a></li>
        <li>Jäger R et al. (2017). ISSN position stand: protein and exercise. <i>J Int Soc Sports Nutr</i> 14:20.</li>
        <li>Aragon AA et al. (2017). ISSN position stand: diets and body composition. <i>J Int Soc Sports Nutr</i> 14:16.</li>
        <li>EFSA — valores de referência: <a href="https://www.efsa.europa.eu/en/efsajournal/pub/4254" target="_blank" rel="noopener">ferro</a> (2015), cálcio (2015), folato (2014), fibra (2010).</li>
        <li>Mifflin MD, St Jeor ST et al. (1990). A new predictive equation for resting energy expenditure. <i>Am J Clin Nutr</i> 51:241–7.</li>
      </ol><p style="color:var(--ink-2);font-size:14px">Valores nutricionais aproximados (tabelas INSA/USDA).</p></div>`;
    }
    $view.innerHTML = h;
  }

  function saveProfile(f) {
    const num = n => parseFloat(f.elements[n].value);
    const p = S.profile;
    for (const k of ['idade', 'altura', 'peso']) if (num(k) > 0) p[k] = num(k);
    p.defice = num('defice'); p.atividade = num('atividade');
    p.treinoDias = [...f.querySelectorAll('input[name=td]:checked')].map(i => +i.value);
    save(); toast('Plano recalculado');
  }
  function exportData() {
    const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `plano-lean-${todayKey()}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function importData(file) {
    if (!file) return;
    file.text().then(t => {
      const d = JSON.parse(t);
      if (!d || !d.profile) throw new Error('formato');
      S = { ...blank(), ...d, profile: { ...DEFAULT_PROFILE, ...d.profile } }; save(); toast('Dados importados');
    }).catch(() => toast('Ficheiro inválido'));
  }

  // ================= Eventos =================
  function handle(a, b) {
    switch (a) {
      // Hoje
      case 'today': curDay = todayKey(); break;
      case 'day': curDay = b.dataset.k; break;
      case 'type': {
        const st = dayState(curDay), def = S.profile.treinoDias.includes(dowIdx(curDay)) ? 'T' : 'D';
        if (b.dataset.v === def) delete st.type; else st.type = b.dataset.v;
        save(); break;
      }
      case 'done': toggleDone(b.dataset.slot); if (sheetEl && sheetEl.classList.contains('open')) closeSheet(); break;
      case 'meal': if (sheetEl) delete sheetEl.dataset.alts; openSheet(mealSheet(b.dataset.slot)); return;
      case 'agua': { const st = dayState(curDay); st.agua = Math.max(0, Math.min(20, (st.agua || 0) + +b.dataset.d)); save(); break; }
      // Semana
      case 'wk': weekOffset += +b.dataset.d; break;
      case 'open': curDay = b.dataset.k; go('hoje'); return;
      // Compras
      case 'sw': shopWeek = +b.dataset.w; break;
      case 'got': { const m = (S.shop[shopKey()] ||= {}); m[b.dataset.f] = !m[b.dataset.f]; save(); break; }
      case 'share': shareList(); return;
      case 'clear': delete S.shop[shopKey()]; save(); break;
      // Progresso
      case 'addw': openSheet(weightSheet()); return;
      case 'range': range = +b.dataset.v; break;
      case 'delw': if (confirm('Apagar este registo?')) { S.weights.splice(+b.dataset.i, 1); save(); } break;
      case 'usepeso': S.profile.peso = +b.dataset.kg; save(); toast(`Plano recalculado para ${n1(+b.dataset.kg)} kg`); break;
      // Perfil
      case 'sub': sub = b.dataset.id; render(true); window.scrollTo(0, 0); return;
      case 'back': sub = null; render(true); window.scrollTo(0, 0); return;
      case 'export': exportData(); return;
      case 'reset':
        if (confirm('Apagar todos os registos (pesos, refeições marcadas, trocas e ajustes)? Não pode ser desfeito.')) { S = blank(); save(); toast('Dados apagados'); }
        break;
      default: return;
    }
    render();
  }
  $view.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (b) handle(b.dataset.act, b); });
  $hdr.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (b) handle(b.dataset.act, b); });
  $view.addEventListener('change', e => {
    const el = e.target;
    if (el.form && el.form.id === 'perfil') saveProfile(el.form);
    if (el.id === 'importFile') importData(el.files[0]);
  });

  function onSheetClick(e) {
    const b = e.target.closest('[data-act]'); if (!b) return;
    const a = b.dataset.act;
    if (a === 'close') return closeSheet();
    if (a === 'alts') { sheetEl.dataset.alts = b.dataset.slot; paintSheet(); return; }
    if (a === 'pick') {
      const st = dayState(curDay), slot = b.dataset.slot;
      if (b.dataset.id === WEEK[dowIdx(curDay)][slot]) delete st.swaps[slot]; else st.swaps[slot] = b.dataset.id;
      delete sheetEl.dataset.alts; save(); render(); paintSheet(); sheetEl.scrollTop = 0; toast('Refeição trocada');
      return;
    }
    if (a === 'done') { toggleDone(b.dataset.slot); render(); closeSheet(); }
  }
  function onSheetSubmit(e) {
    if (e.target.id !== 'wform') return;
    e.preventDefault();
    const d = sheetEl.querySelector('#wd').value;
    const kg = parseFloat(sheetEl.querySelector('#wk').value.replace(',', '.'));
    const c = parseFloat(sheetEl.querySelector('#wc').value.replace(',', '.'));
    if (!d || !(kg > 0)) return;
    S.weights = S.weights.filter(w => w.d !== d);
    S.weights.push({ d, kg, ...(c > 0 ? { cint: c } : {}) });
    save(); closeSheet(); render(); toast('Registo guardado');
  }

  // Deslizar a barra de dias para mudar de semana
  let sx = null;
  $view.addEventListener('touchstart', e => { sx = e.target.closest('#strip') ? e.touches[0].clientX : null; }, { passive: true });
  $view.addEventListener('touchend', e => {
    if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50) { curDay = addDays(curDay, dx < 0 ? 7 : -7); render(); }
  });

  // ================= Arranque =================
  render();
  let lastToday = todayKey();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && todayKey() !== lastToday) { lastToday = curDay = todayKey(); render(); }
  });
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
