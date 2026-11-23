// Base de dados do plano. Valores nutricionais por 100 g (aprox., tabelas INSA/USDA).
// Pesos de arroz, massa, quinoa, aveia e carnes/peixes são em CRU.
// g: número fixo, ou [descanso, treino]. m: 1 = aguenta bem numa marmita. also: outras refeições onde a receita também aparece.
// role: p = proteína, c = hidratos (ajustados automaticamente às calorias alvo), f = gordura, v = legumes/fruta.

const FOODS = {
  aveia:        { n: 'Flocos de aveia', kcal: 379, p: 13.2, c: 67.7, f: 6.5, cat: 'Hidratos' },
  pao:          { n: 'Pão integral', kcal: 250, p: 11, c: 42, f: 3.5, cat: 'Hidratos', u: [30, 'fatia'] },
  tortilha:     { n: 'Tortilha integral (wrap)', kcal: 300, p: 9, c: 48, f: 7, cat: 'Hidratos', u: [60, 'wrap'] },
  arroz:        { n: 'Arroz (cru)', kcal: 360, p: 6.6, c: 79, f: 0.6, cat: 'Hidratos' },
  massa:        { n: 'Massa integral (crua)', kcal: 350, p: 13, c: 68, f: 2.5, cat: 'Hidratos' },
  esparguete:   { n: 'Esparguete (cru)', kcal: 357, p: 12, c: 72, f: 1.5, cat: 'Hidratos' },
  massaNormal:  { n: 'Massa (crua)', kcal: 357, p: 12, c: 72, f: 1.5, cat: 'Hidratos' },
  paoHamb:      { n: 'Pão de hambúrguer', kcal: 270, p: 9, c: 48, f: 4.5, cat: 'Hidratos', u: [60, 'pão'] },
  quinoa:       { n: 'Quinoa (crua)', kcal: 368, p: 14, c: 64, f: 6, cat: 'Hidratos' },
  batata:       { n: 'Batata', kcal: 77, p: 2, c: 17, f: 0.1, cat: 'Hidratos' },
  batataDoce:   { n: 'Batata-doce', kcal: 86, p: 1.6, c: 20, f: 0.1, cat: 'Hidratos' },
  paoForma:     { n: 'Pão de forma integral (Continente)', kcal: 243, p: 11, c: 40, f: 3, cat: 'Hidratos' },
  bolachaMilho: { n: 'Bolachas de milho (Sondey)', kcal: 383, p: 7, c: 85, f: 1.4, cat: 'Hidratos', u: [8, 'bolacha'] },
  bolachaArroz: { n: 'Bolachas de arroz', kcal: 387, p: 8, c: 81, f: 3, cat: 'Hidratos', u: [8, 'bolacha'] },
  grao:         { n: 'Grão-de-bico cozido (escorrido)', kcal: 139, p: 7, c: 22.5, f: 2.6, cat: 'Hidratos' },
  feijao:       { n: 'Feijão-preto cozido (escorrido)', kcal: 110, p: 7.5, c: 18, f: 0.5, cat: 'Hidratos' },

  frango:       { n: 'Peito de frango', kcal: 120, p: 22.5, c: 0, f: 2.6, cat: 'Proteínas' },
  peru:         { n: 'Peito de peru', kcal: 107, p: 24, c: 0, f: 1, cat: 'Proteínas' },
  vaca:         { n: 'Carne de vaca magra picada (5% gordura)', kcal: 130, p: 21, c: 0, f: 5, cat: 'Proteínas' },
  lombo:        { n: 'Lombo de porco', kcal: 120, p: 22, c: 0, f: 3.5, cat: 'Proteínas' },
  pescada:      { n: 'Pescada', kcal: 80, p: 17.8, c: 0, f: 0.9, cat: 'Proteínas' },
  bacalhau:     { n: 'Bacalhau demolhado', kcal: 82, p: 18, c: 0, f: 0.7, cat: 'Proteínas' },
  salmao:       { n: 'Salmão', kcal: 208, p: 20, c: 0, f: 13, cat: 'Proteínas' },
  atumOleo:     { n: 'Atum em óleo (escorrido)', kcal: 198, p: 29, c: 0, f: 8.2, cat: 'Proteínas', u: [80, 'lata'] },
  carneMista:   { n: 'Carne picada mista (porco e vaca)', kcal: 215, p: 18, c: 0, f: 16, cat: 'Proteínas' },
  atum:         { n: 'Atum ao natural (escorrido)', kcal: 110, p: 25, c: 0, f: 1, cat: 'Proteínas', u: [80, 'lata'] },
  camarao:      { n: 'Camarão / gambas descascados', kcal: 85, p: 20, c: 0, f: 0.5, cat: 'Proteínas' },
  tofu:         { n: 'Tofu firme', kcal: 144, p: 17.3, c: 2.8, f: 8.7, cat: 'Proteínas' },
  fiambre:      { n: 'Fiambre de peru', kcal: 100, p: 18, c: 2, f: 2, cat: 'Proteínas', u: [20, 'fatia'] },
  whey:         { n: 'Proteína whey (opcional)', kcal: 380, p: 78, c: 6, f: 5, cat: 'Outros', u: [25, 'scoop'] },

  ovo:          { n: 'Ovos', kcal: 143, p: 12.6, c: 0.7, f: 9.5, cat: 'Laticínios e ovos', u: [55, 'ovo'] },
  claras:       { n: 'Claras de ovo', kcal: 52, p: 10.9, c: 0.7, f: 0.2, cat: 'Laticínios e ovos' },
  skyr:         { n: 'Skyr / iogurte grego magro natural', kcal: 63, p: 11, c: 4, f: 0.2, cat: 'Laticínios e ovos' },
  leite:        { n: 'Leite meio-gordo', kcal: 47, p: 3.3, c: 4.8, f: 1.6, cat: 'Laticínios e ovos' },
  leiteMG:      { n: 'Leite meio-gordo (Milbona)', kcal: 45, p: 3.2, c: 4.7, f: 1.5, cat: 'Laticínios e ovos' },
  leiteSL:      { n: 'Leite meio-gordo sem lactose (Milbona)', kcal: 45, p: 3.1, c: 4.5, f: 1.6, cat: 'Laticínios e ovos' },
  skyrMorango:  { n: 'Skyr de morango (Milbona)', kcal: 56, p: 8.9, c: 4.5, f: 0.2, cat: 'Laticínios e ovos' },
  iogurteNat:   { n: 'Iogurte natural (Milbona)', kcal: 75, p: 5, c: 4.7, f: 3.8, cat: 'Laticínios e ovos' },
  queijoFresco: { n: 'Queijo fresco magro', kcal: 90, p: 12, c: 3.5, f: 3, cat: 'Laticínios e ovos' },
  cottage:      { n: 'Queijo cottage', kcal: 98, p: 11, c: 3.4, f: 4.3, cat: 'Laticínios e ovos' },

  banana:       { n: 'Banana', kcal: 89, p: 1.1, c: 23, f: 0.3, cat: 'Fruta', u: [120, 'banana média'] },
  maca:         { n: 'Maçã', kcal: 52, p: 0.3, c: 14, f: 0.2, cat: 'Fruta', u: [150, 'maçã'] },
  pera:         { n: 'Pêra', kcal: 57, p: 0.4, c: 15, f: 0.1, cat: 'Fruta', u: [150, 'pêra'] },
  laranja:      { n: 'Laranja', kcal: 47, p: 0.9, c: 12, f: 0.1, cat: 'Fruta', u: [150, 'laranja'] },
  kiwi:         { n: 'Kiwi', kcal: 61, p: 1.1, c: 15, f: 0.5, cat: 'Fruta', u: [75, 'kiwi'] },
  frutosVerm:   { n: 'Frutos vermelhos (podem ser congelados)', kcal: 50, p: 0.8, c: 12, f: 0.3, cat: 'Fruta' },

  polpaTomate:  { n: 'Polpa de tomate', kcal: 25, p: 1.3, c: 4, f: 0.2, cat: 'Legumes' },
  legumes:      { n: 'Legumes variados (curgete, cenoura, feijão-verde, pimento, espinafres…)', kcal: 30, p: 2, c: 5, f: 0.3, cat: 'Legumes' },
  salada:       { n: 'Salada (alface, tomate, pepino, cebola)', kcal: 20, p: 1, c: 3.5, f: 0.2, cat: 'Legumes' },
  sopa:         { n: 'Sopa de legumes caseira', kcal: 35, p: 1.2, c: 5.5, f: 1, cat: 'Legumes', u: [300, 'prato'] },

  azeite:       { n: 'Azeite', kcal: 884, p: 0, c: 0, f: 100, cat: 'Gorduras', u: [10, 'c. sopa'] },
  manteigaMagra: { n: 'Manteiga magra (Mimosa)', kcal: 379, p: 0.2, c: 3.3, f: 41, cat: 'Gorduras' },
  abacate:      { n: 'Abacate', kcal: 160, p: 2, c: 8.5, f: 14.7, cat: 'Gorduras' },
  amendoas:     { n: 'Amêndoas', kcal: 579, p: 21, c: 22, f: 50, cat: 'Gorduras' },
  nozes:        { n: 'Nozes', kcal: 654, p: 15, c: 14, f: 65, cat: 'Gorduras' },
  manteigaAm:   { n: 'Manteiga de amendoim 100%', kcal: 588, p: 25, c: 20, f: 50, cat: 'Gorduras', u: [15, 'c. sopa'] },
  chia:         { n: 'Sementes de chia', kcal: 486, p: 17, c: 42, f: 31, cat: 'Gorduras' },
  chocolate:    { n: 'Chocolate negro 85%', kcal: 600, p: 11, c: 20, f: 52, cat: 'Outros', u: [10, 'quadrado'] },
};

const SLOTS = [
  { id: 'pa', n: 'Pequeno-almoço', t: '08:00' },
  { id: 'lm', n: 'Lanche da manhã', t: '11:00', opt: 1 }, // opcional: só nos dias em que se junta
  { id: 'almoco', n: 'Almoço', t: '13:00' },
  { id: 'lanche', n: 'Lanche', nt: 'Lanche pré/pós-treino', t: '17:00' },
  { id: 'jantar', n: 'Jantar', t: '20:30' },
];

// Turnos: hora e nome de cada refeição. Horas antes das 05:00 contam como fim do dia (depois da meia-noite).
// Horários editáveis na app (Perfil → Turnos e horários).
const SHIFT_ORDER = ['M', 'T', 'N', 'F'];
const SHIFTS = {
  M: { n: 'Manhã', h: '08–16h', col: '#e09a00',
       t: { pa: '06:45', lm: '10:00', almoco: '12:30', lanche: '16:30', jantar: '20:00' },
       l: { lm: 'Lanche da manhã no turno', almoco: 'Almoço no turno', lanche: 'Lanche ao sair' },
       tip: 'Pequeno-almoço antes de sair, mesmo que pequeno. O almoço vai na marmita: sobras do jantar de ontem.' },
  T: { n: 'Tarde', h: '16–24h', col: '#7048e8',
       t: { pa: '09:30', lm: '11:30', almoco: '13:30', lanche: '18:30', jantar: '21:00' },
       l: { lanche: 'Lanche no turno', jantar: 'Jantar no turno' },
       tip: 'Almoço completo antes de sair; o jantar vai na marmita (cozinha o dobro ao almoço). Ao chegar a casa, só algo leve se tiveres fome.' },
  N: { n: 'Noite', h: '24–08h', col: '#3b5bdb',
       t: { pa: '10:30', lm: '12:30', almoco: '14:30', jantar: '20:30', lanche: '02:00' },
       l: { jantar: 'Jantar antes do turno', lanche: 'Refeição no turno' },
       tip: 'O jantar antes do turno é a refeição principal. Durante a noite, pouco e leve (proteína + fruta), sem doces. Café só na primeira metade do turno.' },
  // Não é um turno: ajusta a manhã de qualquer dia a seguir a uma noite (folga, tarde ou outra noite)
  PN: { n: 'Depois de uma noite', h: 'Manhã a dormir', col: '#868e96',
       t: { pa: '08:30', almoco: '15:00' },
       l: { pa: 'Pequeno-almoço leve', almoco: 'Almoço ao acordar' },
       tip: 'Ao sair, come algo leve antes de dormir para não acordares com fome. Quarto escuro, 4–6 h de sono; o almoço ao acordar é a primeira refeição a sério.' },
  F: { n: 'Folga', h: 'Dia livre', col: '#2f9e44',
       t: { pa: '09:00', lm: '11:00', almoco: '13:00', lanche: '17:00', jantar: '20:30' },
       l: {},
       tip: '' },
};

// Refeições "fora do plano" (cantina, restaurante, imprevistos) — estimativa rápida.
const FORA = [
  { kcal: 300, n: 'Leve', d: 'sandes, sopa + fruta, iogurte' },
  { kcal: 500, n: 'Média', d: 'prato da cantina, marmita de outra pessoa' },
  { kcal: 750, n: 'Grande', d: 'restaurante, prato + sobremesa' },
  { kcal: 1000, n: 'Muito grande', d: 'fast food, jantar de grupo' },
];

const MEALS = {
  lm: [
    { id: 'lm6', n: 'Bolachas de milho', m: 1, prep: '4 bolachas.',
      i: [{ f: 'bolachaMilho', g: 32, r: 'c' }] },
    { id: 'lm7', n: 'Maçã', m: 1, prep: '',
      i: [{ f: 'maca', g: 150 }] },
  ],
  pa: [
    { id: 'pa2', n: 'Pão integral com ovos mexidos e leite',
      prep: 'Ovos mexidos em frigideira antiaderente (sem gordura ou com spray). Servir sobre o pão torrado. Leite à parte.',
      i: [{ f: 'paoForma', g: 40, r: 'c' }, { f: 'ovo', g: 110 }, { f: 'leiteSL', g: 150 }] },
    { id: 'pa3', n: 'Taça de skyr com aveia e fruta',
      prep: 'Skyr numa taça, por cima a aveia crua e a banana às rodelas.',
      i: [{ f: 'iogurteNat', g: 150 }, { f: 'aveia', g: 20, r: 'c' }, { f: 'banana', g: 60 }] },
    { id: 'pa4', n: 'Panquecas de aveia e banana com leite',
      prep: 'Triturar aveia, ovo, claras e metade da banana. Cozinhar em frigideira antiaderente. Servir com o resto da banana. Leite à parte.',
      i: [{ f: 'aveia', g: 25, r: 'c' }, { f: 'ovo', g: 55 }, { f: 'claras', g: 100 }, { f: 'banana', g: 50 }, { f: 'leiteSL', g: 150 }] },
    { id: 'pa7', n: 'Torradas com manteiga e leite',
      prep: 'Torrar o pão e barrar com a manteiga. Leite à parte. Dica: barra com o pão ainda quente, porque espalha melhor e chega metade da manteiga.',
      i: [{ f: 'paoForma', g: 60, r: 'c' }, { f: 'manteigaMagra', g: 15 }, { f: 'leiteMG', g: 250 }] },
    { id: 'pa5', n: 'Overnight oats de skyr e frutos vermelhos', m: 1, prep: 'Na véspera, misturar num frasco a aveia, o skyr, o leite e a chia. Pôr os frutos vermelhos e as nozes partidas por cima e guardar no frigorífico. De manhã é só levar.', i: [{ f: 'aveia', g: 35, r: 'c' }, { f: 'skyr', g: 170, r: 'p' }, { f: 'leite', g: 80 }, { f: 'frutosVerm', g: 100 }, { f: 'chia', g: 10 }, { f: 'nozes', g: 10 }] },
  ],
  almoco: [
    { id: 'al1', n: 'Frango grelhado com arroz e legumes salteados', m: 1, also: ['jantar'],
      prep: 'Temperar o frango com alho, limão e ervas. Grelhar. Saltear os legumes com o azeite.',
      i: [{ f: 'frango', g: 130, r: 'p' }, { f: 'arroz', g: [50, 70], r: 'c' }, { f: 'legumes', g: 200 }, { f: 'azeite', g: 10 }] },
    { id: 'al12', n: 'Frango grelhado com massa e legumes salteados', m: 1, also: ['jantar'],
      prep: 'Temperar o frango com alho, limão e ervas. Grelhar. Cozer a massa. Saltear os legumes com o azeite.',
      i: [{ f: 'frango', g: 130, r: 'p' }, { f: 'massaNormal', g: [50, 70], r: 'c' }, { f: 'legumes', g: 200 }, { f: 'azeite', g: 10 }] },
    { id: 'al2', n: 'Salmão no forno com batata-doce e feijão-verde', also: ['jantar'],
      prep: 'Salmão e batata-doce às rodelas no forno a 200 °C ~20 min. Feijão-verde cozido a vapor. (O salmão já traz gordura — não precisa de azeite.)',
      i: [{ f: 'salmao', g: 130, r: 'p' }, { f: 'batataDoce', g: [150, 220], r: 'c' }, { f: 'legumes', g: 200 }] },
    { id: 'al4', n: 'Esparguete à bolonhesa', m: 1, also: ['jantar'],
      prep: 'Refogar cebola e alho com o azeite, juntar a carne, tomate pelado e cenoura/curgete ralada. Servir com o esparguete.',
      i: [{ f: 'vaca', g: 120, r: 'p' }, { f: 'esparguete', g: [50, 70], r: 'c' }, { f: 'legumes', g: 200 }, { f: 'azeite', g: 10 }] },
    { id: 'al10', n: 'Esparguete com atum', m: 1, also: ['jantar'],
      prep: 'Refogar ½ cebola e 1 dente de alho com 1 colher de chá do óleo do atum. Juntar a polpa de tomate e deixar 5 min. Juntar o atum e envolver no esparguete cozido.',
      i: [{ f: 'esparguete', g: 60, r: 'c' }, { f: 'atumOleo', g: 80, r: 'p' }, { f: 'polpaTomate', g: 150 }] },
    { id: 'al11', n: 'Arroz de atum', m: 1, also: ['jantar'],
      prep: 'Refogar cebola, alho e tomate com 1 colher de chá do óleo do atum. Juntar o arroz, os legumes (ervilhas, cenoura, pimento) e o dobro da água. Cozinhar 15 min e juntar o atum no fim.',
      i: [{ f: 'arroz', g: 60, r: 'c' }, { f: 'atumOleo', g: 80, r: 'p' }, { f: 'legumes', g: 100 }] },
  ],
  lanche: [
    { id: 'la7', n: 'Iogurte natural com aveia, fruta e proteína',
      prep: 'Misturar a proteína no iogurte até ficar cremoso. Por cima, a aveia e a fruta às rodelas.',
      i: [{ f: 'iogurteNat', g: 150 }, { f: 'aveia', g: 20, r: 'c' }, { f: 'banana', g: 60 }, { f: 'whey', g: 10, r: 'p' }] },
  ],
  jantar: [
    { id: 'ja1', n: 'Pescada no forno com batata e legumes', also: ['almoco'],
      prep: 'Pescada no forno com batata às rodelas, cebola, alho e o azeite, 200 °C ~25 min.',
      i: [{ f: 'pescada', g: 160, r: 'p' }, { f: 'batata', g: [180, 230], r: 'c' }, { f: 'legumes', g: 150 }, { f: 'azeite', g: 10 }] },
    { id: 'ja3', n: 'Wrap de peru com queijo fresco, tomate e molho de iogurte', m: 1, also: ['almoco'],
      prep: 'Peru grelhado às tiras, salada, tomate e queijo fresco dentro do wrap. Molho: skyr + limão + alho + orégãos.',
      i: [{ f: 'tortilha', g: 60 }, { f: 'peru', g: 120, r: 'p' }, { f: 'queijoFresco', g: 50, r: 'p' }, { f: 'salada', g: 100 }, { f: 'skyr', g: 60 }] },
    { id: 'ja8', n: 'Frango assado com batata e legumes no forno', m: 1, also: ['almoco'], prep: 'Tudo no mesmo tabuleiro: frango temperado com alho, limão e colorau, batata e legumes aos pedaços, o azeite. Forno a 200 °C ~35 min. Faz-se a dobrar sem esforço.', i: [{ f: 'frango', g: 150, r: 'p' }, { f: 'batata', g: [150, 200], r: 'c' }, { f: 'legumes', g: 250 }, { f: 'azeite', g: 10 }] },
    { id: 'ja9', n: 'Hambúrguer caseiro de porco e vaca no pão, com salada', also: ['almoco'],
      prep: 'Temperar a carne com sal, pimenta e alho e moldar o hambúrguer. Grelhar em frigideira sem gordura, 4–5 min de cada lado. Servir no pão com alface, tomate e cebola.',
      i: [{ f: 'carneMista', g: 130, r: 'p' }, { f: 'paoHamb', g: 60 }, { f: 'salada', g: 100 }] },
  ],
};

// Rotação base da semana (índices das opções em cada refeição). 0 = segunda-feira.
const WEEK = [
  { pa: 'pa2', lm: 'lm6', almoco: 'al1', lanche: 'la7', jantar: 'ja1' },
  { pa: 'pa3', lm: 'lm6', almoco: 'al11', lanche: 'la7', jantar: 'ja8' },
  { pa: 'pa5', lm: 'lm7', almoco: 'al4', lanche: 'la7', jantar: 'ja3' },
  { pa: 'pa7', lm: 'lm6', almoco: 'al10', lanche: 'la7', jantar: 'ja9' },
  { pa: 'pa3', lm: 'lm6', almoco: 'al2', lanche: 'la7', jantar: 'ja8' },
  { pa: 'pa4', lm: 'lm7', almoco: 'al4', lanche: 'la7', jantar: 'ja9' },
  { pa: 'pa7', lm: 'lm6', almoco: 'al1', lanche: 'la7', jantar: 'ja3' },
];

// Equivalências para trocas livres (mesma quantidade de hidratos/proteína/gordura aprox.)
const SWAPS = [
  { t: 'Hidratos (≈ 30 g de hidratos)', l: ['40 g arroz ou massa (cru)', '130 g grão ou feijão cozido', '180 g batata', '150 g batata-doce', '70 g pão integral (2 fatias)', '45 g aveia', '1 wrap integral', '4 bolachas de arroz'] },
  { t: 'Proteína (≈ 25 g de proteína)', l: ['110 g frango ou peru (cru)', '140 g pescada ou bacalhau', '100 g atum (escorrido)', '125 g camarão', '120 g carne de vaca magra', '125 g salmão (+ gordura)', '150 g tofu firme', '230 g skyr', '4 ovos ou 230 g claras', '1 scoop de whey + ½ copo de leite'] },
  { t: 'Gordura (≈ 10 g de gordura)', l: ['1 c. sopa (10 g) azeite', '20 g amêndoas', '15 g nozes', '20 g manteiga de amendoim', '70 g abacate', '30 g sementes de chia'] },
  { t: 'Fruta (≈ 15–20 g de hidratos)', l: ['1 maçã ou pêra', '1 laranja', '2 kiwis', '1 banana pequena', '150 g frutos vermelhos', '1 fatia grossa de melão/melancia', '150 g de ananás'] },
];

if (typeof module !== 'undefined') module.exports = { FOODS, SLOTS, SHIFTS, SHIFT_ORDER, FORA, MEALS, WEEK, SWAPS };
