// Base de dados do plano. Valores nutricionais por 100 g (aprox., tabelas INSA/USDA).
// Pesos de arroz, massa, quinoa, aveia e carnes/peixes são em CRU.
// g: número fixo, ou [descanso, treino].
// role: p = proteína, c = hidratos (ajustados automaticamente às calorias alvo), f = gordura, v = legumes/fruta.

const FOODS = {
  aveia:        { n: 'Flocos de aveia', kcal: 379, p: 13.2, c: 67.7, f: 6.5, cat: 'Hidratos' },
  pao:          { n: 'Pão integral', kcal: 250, p: 11, c: 42, f: 3.5, cat: 'Hidratos', u: [30, 'fatia'] },
  tortilha:     { n: 'Tortilha integral (wrap)', kcal: 300, p: 9, c: 48, f: 7, cat: 'Hidratos', u: [60, 'wrap'] },
  arroz:        { n: 'Arroz (cru)', kcal: 360, p: 6.6, c: 79, f: 0.6, cat: 'Hidratos' },
  massa:        { n: 'Massa integral (crua)', kcal: 350, p: 13, c: 68, f: 2.5, cat: 'Hidratos' },
  quinoa:       { n: 'Quinoa (crua)', kcal: 368, p: 14, c: 64, f: 6, cat: 'Hidratos' },
  batata:       { n: 'Batata', kcal: 77, p: 2, c: 17, f: 0.1, cat: 'Hidratos' },
  batataDoce:   { n: 'Batata-doce', kcal: 86, p: 1.6, c: 20, f: 0.1, cat: 'Hidratos' },
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
  atum:         { n: 'Atum ao natural (escorrido)', kcal: 110, p: 25, c: 0, f: 1, cat: 'Proteínas', u: [80, 'lata'] },
  camarao:      { n: 'Camarão / gambas descascados', kcal: 85, p: 20, c: 0, f: 0.5, cat: 'Proteínas' },
  tofu:         { n: 'Tofu firme', kcal: 144, p: 17.3, c: 2.8, f: 8.7, cat: 'Proteínas' },
  fiambre:      { n: 'Fiambre de peru', kcal: 100, p: 18, c: 2, f: 2, cat: 'Proteínas', u: [20, 'fatia'] },
  whey:         { n: 'Proteína whey (opcional)', kcal: 380, p: 78, c: 6, f: 5, cat: 'Outros', u: [25, 'scoop'] },

  ovo:          { n: 'Ovos', kcal: 143, p: 12.6, c: 0.7, f: 9.5, cat: 'Laticínios e ovos', u: [55, 'ovo'] },
  claras:       { n: 'Claras de ovo', kcal: 52, p: 10.9, c: 0.7, f: 0.2, cat: 'Laticínios e ovos' },
  skyr:         { n: 'Skyr / iogurte grego magro natural', kcal: 63, p: 11, c: 4, f: 0.2, cat: 'Laticínios e ovos' },
  leite:        { n: 'Leite meio-gordo', kcal: 47, p: 3.3, c: 4.8, f: 1.6, cat: 'Laticínios e ovos' },
  queijoFresco: { n: 'Queijo fresco magro', kcal: 90, p: 12, c: 3.5, f: 3, cat: 'Laticínios e ovos' },
  cottage:      { n: 'Queijo cottage', kcal: 98, p: 11, c: 3.4, f: 4.3, cat: 'Laticínios e ovos' },

  banana:       { n: 'Banana', kcal: 89, p: 1.1, c: 23, f: 0.3, cat: 'Fruta', u: [120, 'banana média'] },
  maca:         { n: 'Maçã', kcal: 52, p: 0.3, c: 14, f: 0.2, cat: 'Fruta', u: [150, 'maçã'] },
  pera:         { n: 'Pêra', kcal: 57, p: 0.4, c: 15, f: 0.1, cat: 'Fruta', u: [150, 'pêra'] },
  laranja:      { n: 'Laranja', kcal: 47, p: 0.9, c: 12, f: 0.1, cat: 'Fruta', u: [150, 'laranja'] },
  kiwi:         { n: 'Kiwi', kcal: 61, p: 1.1, c: 15, f: 0.5, cat: 'Fruta', u: [75, 'kiwi'] },
  frutosVerm:   { n: 'Frutos vermelhos (podem ser congelados)', kcal: 50, p: 0.8, c: 12, f: 0.3, cat: 'Fruta' },

  legumes:      { n: 'Legumes variados (brócolos, curgete, cenoura, feijão-verde, espinafres…)', kcal: 30, p: 2, c: 5, f: 0.3, cat: 'Legumes' },
  salada:       { n: 'Salada (alface, tomate, pepino, cebola)', kcal: 20, p: 1, c: 3.5, f: 0.2, cat: 'Legumes' },
  sopa:         { n: 'Sopa de legumes caseira', kcal: 35, p: 1.2, c: 5.5, f: 1, cat: 'Legumes', u: [300, 'prato'] },

  azeite:       { n: 'Azeite', kcal: 884, p: 0, c: 0, f: 100, cat: 'Gorduras', u: [10, 'c. sopa'] },
  abacate:      { n: 'Abacate', kcal: 160, p: 2, c: 8.5, f: 14.7, cat: 'Gorduras' },
  amendoas:     { n: 'Amêndoas', kcal: 579, p: 21, c: 22, f: 50, cat: 'Gorduras' },
  nozes:        { n: 'Nozes', kcal: 654, p: 15, c: 14, f: 65, cat: 'Gorduras' },
  manteigaAm:   { n: 'Manteiga de amendoim 100%', kcal: 588, p: 25, c: 20, f: 50, cat: 'Gorduras', u: [15, 'c. sopa'] },
  chia:         { n: 'Sementes de chia', kcal: 486, p: 17, c: 42, f: 31, cat: 'Gorduras' },
  chocolate:    { n: 'Chocolate negro 85%', kcal: 600, p: 11, c: 20, f: 52, cat: 'Outros', u: [10, 'quadrado'] },
};

const SLOTS = [
  { id: 'pa', n: 'Pequeno-almoço', t: '08:00' },
  { id: 'almoco', n: 'Almoço', t: '13:00' },
  { id: 'lanche', n: 'Lanche', nt: 'Lanche pré/pós-treino', t: '17:00' },
  { id: 'jantar', n: 'Jantar', t: '20:30' },
];

// Turnos: hora e nome de cada refeição. Horas antes das 05:00 contam como fim do dia (depois da meia-noite).
// Horários editáveis na app (Perfil → Turnos e horários).
const SHIFT_ORDER = ['M', 'T', 'N', 'S', 'F'];
const SHIFTS = {
  M: { n: 'Manhã', h: '08–16h', col: '#e09a00',
       t: { pa: '06:45', almoco: '12:30', lanche: '16:30', jantar: '20:00' },
       l: { almoco: 'Almoço no turno', lanche: 'Lanche ao sair' },
       tip: 'Pequeno-almoço antes de sair, mesmo que pequeno. O almoço vai na marmita: sobras do jantar de ontem.' },
  T: { n: 'Tarde', h: '16–24h', col: '#7048e8',
       t: { pa: '09:30', almoco: '13:30', lanche: '18:30', jantar: '21:00' },
       l: { lanche: 'Lanche no turno', jantar: 'Jantar no turno' },
       tip: 'Almoço completo antes de sair; o jantar vai na marmita (cozinha o dobro ao almoço). Ao chegar a casa, só algo leve se tiveres fome.' },
  N: { n: 'Noite', h: '24–08h', col: '#3b5bdb',
       t: { pa: '10:30', almoco: '14:30', jantar: '20:30', lanche: '02:00' },
       l: { jantar: 'Jantar antes do turno', lanche: 'Refeição no turno' },
       tip: 'O jantar antes do turno é a refeição principal. Durante a noite, pouco e leve (proteína + fruta), sem doces. Café só na primeira metade do turno.' },
  S: { n: 'Saída de noite', h: 'Depois da noite', col: '#868e96',
       t: { pa: '08:30', almoco: '15:00', lanche: '18:00', jantar: '21:00' },
       l: { pa: 'Pequeno-almoço leve', almoco: 'Almoço ao acordar' },
       tip: 'Ao sair, come algo leve antes de dormir para não acordares com fome. Quarto escuro, 4–6 h de sono; o resto do dia segue normal.' },
  F: { n: 'Folga', h: 'Dia livre', col: '#2f9e44',
       t: { pa: '09:00', almoco: '13:00', lanche: '17:00', jantar: '20:30' },
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
  pa: [
    { id: 'pa1', n: 'Papas de aveia proteicas com frutos vermelhos',
      prep: 'Cozinhar a aveia no leite 3–4 min. Tirar do lume, juntar o skyr, os frutos vermelhos e as amêndoas picadas. Canela à vontade.',
      i: [{ f: 'aveia', g: 35, r: 'c' }, { f: 'leite', g: 150 }, { f: 'skyr', g: 150, r: 'p' }, { f: 'frutosVerm', g: 80 }, { f: 'amendoas', g: 10 }] },
    { id: 'pa2', n: 'Tostas integrais com ovos mexidos e fiambre',
      prep: 'Ovos mexidos em frigideira antiaderente (sem gordura ou com spray). Servir sobre o pão torrado com o fiambre. Fruta à parte.',
      i: [{ f: 'pao', g: 60, r: 'c' }, { f: 'ovo', g: 110, r: 'p' }, { f: 'fiambre', g: 40, r: 'p' }, { f: 'kiwi', g: 100 }] },
    { id: 'pa3', n: 'Taça de skyr com aveia, banana e manteiga de amendoim',
      prep: 'Skyr numa taça, por cima a aveia crua, a banana às rodelas, a chia e a manteiga de amendoim.',
      i: [{ f: 'skyr', g: 250, r: 'p' }, { f: 'aveia', g: 25, r: 'c' }, { f: 'banana', g: 80 }, { f: 'manteigaAm', g: 10 }, { f: 'chia', g: 5 }] },
    { id: 'pa4', n: 'Panquecas de aveia e banana',
      prep: 'Triturar aveia, ovo, claras e metade da banana. Cozinhar em frigideira antiaderente. Servir com skyr e o resto da banana.',
      i: [{ f: 'aveia', g: 35, r: 'c' }, { f: 'ovo', g: 55 }, { f: 'claras', g: 100, r: 'p' }, { f: 'banana', g: 80 }, { f: 'skyr', g: 100, r: 'p' }] },
  ],
  almoco: [
    { id: 'al1', n: 'Frango grelhado com arroz e legumes salteados',
      prep: 'Temperar o frango com alho, limão e ervas. Grelhar. Saltear os legumes com o azeite.',
      i: [{ f: 'frango', g: 130, r: 'p' }, { f: 'arroz', g: [50, 70], r: 'c' }, { f: 'legumes', g: 200 }, { f: 'azeite', g: 10 }] },
    { id: 'al2', n: 'Salmão no forno com batata-doce e brócolos',
      prep: 'Salmão e batata-doce às rodelas no forno a 200 °C ~20 min. Brócolos a vapor. (O salmão já traz gordura — não precisa de azeite.)',
      i: [{ f: 'salmao', g: 130, r: 'p' }, { f: 'batataDoce', g: [150, 220], r: 'c' }, { f: 'legumes', g: 200 }] },
    { id: 'al3', n: 'Salada de grão com atum e ovo',
      prep: 'Misturar grão, atum, ovo cozido picado e salada. Temperar com azeite, vinagre, salsa e cebola roxa.',
      i: [{ f: 'atum', g: 100, r: 'p' }, { f: 'grao', g: [130, 190], r: 'c' }, { f: 'ovo', g: 55 }, { f: 'salada', g: 200 }, { f: 'azeite', g: 5 }] },
    { id: 'al4', n: 'Massa integral à bolonhesa',
      prep: 'Refogar cebola e alho com o azeite, juntar a carne, tomate pelado e cenoura/curgete ralada. Servir com a massa.',
      i: [{ f: 'vaca', g: 120, r: 'p' }, { f: 'massa', g: [50, 70], r: 'c' }, { f: 'legumes', g: 200 }, { f: 'azeite', g: 10 }] },
    { id: 'al5', n: 'Bacalhau com grão, ovo e legumes',
      prep: 'Bacalhau cozido com o grão e os legumes. Ovo cozido. Regar com o azeite e alho picado.',
      i: [{ f: 'bacalhau', g: 150, r: 'p' }, { f: 'grao', g: [120, 180], r: 'c' }, { f: 'ovo', g: 55 }, { f: 'legumes', g: 150 }, { f: 'azeite', g: 8 }] },
    { id: 'al6', n: 'Bowl de lombo com feijão-preto, arroz e abacate',
      prep: 'Lombo grelhado às tiras. Montar a taça com arroz, feijão, salada e abacate. Lima e coentros.',
      i: [{ f: 'lombo', g: 120, r: 'p' }, { f: 'arroz', g: [30, 45], r: 'c' }, { f: 'feijao', g: [80, 110], r: 'c' }, { f: 'salada', g: 150 }, { f: 'abacate', g: 40 }] },
  ],
  lanche: [
    { id: 'la1', n: 'Skyr com maçã e nozes',
      treino: '+ bolachas de arroz nos dias de treino (1–2 h antes)',
      prep: 'Maçã às fatias com canela por cima do skyr. Nozes partidas.',
      i: [{ f: 'skyr', g: 170, r: 'p' }, { f: 'maca', g: 150 }, { f: 'nozes', g: 10 }, { f: 'bolachaArroz', g: [0, 25], r: 'c' }] },
    { id: 'la2', n: 'Tosta de fiambre de peru e queijo fresco + laranja',
      prep: 'Pão integral com fiambre, queijo fresco e tomate. Laranja à parte.',
      i: [{ f: 'pao', g: [40, 70], r: 'c' }, { f: 'fiambre', g: 50, r: 'p' }, { f: 'queijoFresco', g: 60, r: 'p' }, { f: 'laranja', g: 150 }] },
    { id: 'la3', n: 'Batido de proteína com banana',
      prep: 'Bater leite, whey e banana. Sem whey: trocar por 200 g de skyr e bater na mesma.',
      i: [{ f: 'whey', g: 25, r: 'p' }, { f: 'leite', g: 250 }, { f: 'banana', g: [80, 120], r: 'c' }, { f: 'aveia', g: [0, 15], r: 'c' }] },
    { id: 'la4', n: 'Cottage com pêra e bolachas de arroz',
      prep: 'Cottage com a pêra aos cubos e canela. Bolachas de arroz à parte.',
      i: [{ f: 'cottage', g: 150, r: 'p' }, { f: 'pera', g: 150 }, { f: 'bolachaArroz', g: [8, 32], r: 'c' }] },
  ],
  jantar: [
    { id: 'ja1', n: 'Sopa + pescada no forno com batata e legumes',
      prep: 'Pescada no forno com batata às rodelas, cebola, alho e o azeite, 200 °C ~25 min. Começar pela sopa.',
      i: [{ f: 'sopa', g: 300 }, { f: 'pescada', g: 160, r: 'p' }, { f: 'batata', g: [110, 150], r: 'c' }, { f: 'legumes', g: 150 }, { f: 'azeite', g: 10 }] },
    { id: 'ja2', n: 'Omelete de legumes com queijo fresco e pão',
      prep: 'Bater ovos e claras, juntar espinafres/cogumelos/tomate salteados no azeite e o queijo fresco. Pão à parte.',
      i: [{ f: 'ovo', g: 110 }, { f: 'claras', g: 120, r: 'p' }, { f: 'legumes', g: 150 }, { f: 'queijoFresco', g: 50, r: 'p' }, { f: 'pao', g: [40, 50], r: 'c' }, { f: 'azeite', g: 3 }] },
    { id: 'ja3', n: 'Wrap de peru com abacate e molho de iogurte',
      prep: 'Peru grelhado às tiras, salada e abacate dentro do wrap. Molho: skyr + limão + alho + oregãos.',
      i: [{ f: 'tortilha', g: 60, r: 'c' }, { f: 'peru', g: 120, r: 'p' }, { f: 'abacate', g: 50 }, { f: 'salada', g: 100 }, { f: 'skyr', g: 60 }] },
    { id: 'ja4', n: 'Tofu salteado com legumes e quinoa',
      prep: 'Tofu aos cubos bem seco, dourado no azeite. Juntar os legumes, molho de soja, gengibre e alho. Servir com a quinoa.',
      i: [{ f: 'tofu', g: 150, r: 'p' }, { f: 'quinoa', g: [40, 50], r: 'c' }, { f: 'legumes', g: 250 }, { f: 'azeite', g: 5 }] },
    { id: 'ja5', n: 'Sopa + camarão salteado com massa e curgete',
      prep: 'Saltear alho no azeite, juntar camarão e curgete às tiras, envolver na massa. Salsa e limão. Começar pela sopa.',
      i: [{ f: 'sopa', g: 300 }, { f: 'camarao', g: 150, r: 'p' }, { f: 'massa', g: [35, 45], r: 'c' }, { f: 'legumes', g: 150 }, { f: 'azeite', g: 8 }] },
  ],
};

// Rotação base da semana (índices das opções em cada refeição). 0 = segunda-feira.
const WEEK = [
  { pa: 'pa1', almoco: 'al1', lanche: 'la3', jantar: 'ja1' },
  { pa: 'pa2', almoco: 'al3', lanche: 'la1', jantar: 'ja2' },
  { pa: 'pa3', almoco: 'al4', lanche: 'la2', jantar: 'ja3' },
  { pa: 'pa4', almoco: 'al2', lanche: 'la4', jantar: 'ja4' },
  { pa: 'pa1', almoco: 'al5', lanche: 'la3', jantar: 'ja5' },
  { pa: 'pa2', almoco: 'al6', lanche: 'la1', jantar: 'ja1' },
  { pa: 'pa3', almoco: 'al1', lanche: 'la4', jantar: 'ja2' },
];

// Equivalências para trocas livres (mesma quantidade de hidratos/proteína/gordura aprox.)
const SWAPS = [
  { t: 'Hidratos (≈ 30 g de hidratos)', l: ['40 g arroz ou massa (cru)', '130 g grão ou feijão cozido', '180 g batata', '150 g batata-doce', '70 g pão integral (2 fatias)', '45 g aveia', '1 wrap integral', '4 bolachas de arroz'] },
  { t: 'Proteína (≈ 25 g de proteína)', l: ['110 g frango ou peru (cru)', '140 g pescada ou bacalhau', '100 g atum (escorrido)', '125 g camarão', '120 g carne de vaca magra', '125 g salmão (+ gordura)', '150 g tofu firme', '230 g skyr', '4 ovos ou 230 g claras', '1 scoop de whey + ½ copo de leite'] },
  { t: 'Gordura (≈ 10 g de gordura)', l: ['1 c. sopa (10 g) azeite', '20 g amêndoas', '15 g nozes', '20 g manteiga de amendoim', '70 g abacate', '30 g sementes de chia'] },
  { t: 'Fruta (≈ 15–20 g de hidratos)', l: ['1 maçã ou pêra', '1 laranja', '2 kiwis', '1 banana pequena', '150 g frutos vermelhos', '1 fatia grossa de melão/melancia', '150 g de ananás'] },
];

if (typeof module !== 'undefined') module.exports = { FOODS, SLOTS, SHIFTS, SHIFT_ORDER, FORA, MEALS, WEEK, SWAPS };
