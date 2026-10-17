/* Deu no Bicho — scraper mapping.
 * Fonte A (primária): deunoposte.com.br — páginas por banca com todos os sorteios do dia.
 * Fonte B (verificação): bicholoterias.com.br — mesmas bancas onde a página existe.
 *
 * Cada sorteio casa com o cabeçalho <h3> da página por:
 *   times: lista de horários aceitos "HH:MM" (tolerância ±10 min, cobre 8h20/8h30 etc.)
 *   any:   pelo menos UMA destas substrings precisa aparecer (minúsculas)
 *   exact: pelo menos UM destes tokens exatos precisa aparecer (evita "pt" casar "ptm")
 *   (se any e exact estiverem vazios, só o horário decide)
 *
 * IMPORTANTE: esta lista de bancas/sorteios (code,name,time) é a fonte da
 * verdade do esqueleto do data.js. O teste tools/test.js valida que
 * assets/data.js tem exatamente estes codes e times.
 */
const BANCAS = [
  {
    id: "rj", name: "Rio de Janeiro", short: "RJ", flag: "🏖️",
    pages: {
      a: "https://deunoposte.com.br/resultado-jogo-do-bicho-rio-de-janeiro/",
      b: "https://bicholoterias.com.br/resultado-jogo-do-bicho-rio-de-janeiro/",
    },
    draws: [
      { code: "PPT", name: "PPT · 9 horas",        time: "09:20", times: ["09:20"], exact: ["ppt", "pt"] },
      { code: "PTM", name: "PTM · 11 horas",       time: "11:20", times: ["11:20"], exact: ["ptm"] },
      { code: "PT",  name: "PT · 14 horas",        time: "14:20", times: ["14:20"], exact: ["pt"] },
      { code: "PTV", name: "PTV · 16 horas",       time: "16:20", times: ["16:20"], exact: ["ptv"] },
      { code: "PTN", name: "PTN · 19 horas",       time: "19:20", times: ["19:20", "18:20"], exact: ["ptn"] },
      { code: "COR", name: "Corujinha · 21 horas", time: "21:30", times: ["21:30", "21:20"], any: ["coruj"] },
    ],
  },
  {
    id: "sp", name: "São Paulo", short: "SP", flag: "🏙️",
    pages: {
      a: "https://deunoposte.com.br/resultado-jogo-do-bicho-sao-paulo/",
      b: "https://bicholoterias.com.br/resultado-jogo-do-bicho-sao-paulo/",
    },
    draws: [
      { code: "SP8",  name: "PT-SP · 8 horas",         time: "08:20", times: ["08:20", "08:30"], any: ["pt-sp", "ptsp"] },
      { code: "SP10", name: "PT-SP · 10 horas",        time: "10:20", times: ["10:20", "10:30"], any: ["pt-sp", "ptsp"] },
      { code: "SP12", name: "PT-SP · 12 horas",        time: "12:20", times: ["12:20", "12:30"], any: ["pt-sp", "ptsp"] },
      { code: "SP13", name: "PT-SP · 13 horas",        time: "13:20", times: ["13:20", "13:30"], any: ["pt-sp", "ptsp"] },
      { code: "SP15", name: "Bandeirantes · 15 horas", time: "15:20", times: ["15:20", "15:30"], any: ["bandeir"] },
      { code: "SP17", name: "PT-SP · 17 horas",        time: "17:20", times: ["17:20", "17:30"], any: ["pt-sp", "ptsp"] },
      { code: "SP18", name: "18 horas",                time: "18:20", times: ["18:20", "18:30"] },
      { code: "SP19", name: "PT-SP · 19 horas",        time: "19:20", times: ["19:20", "19:30"], any: ["pt-sp", "ptsp"] },
      { code: "SP20", name: "PTN-SP · 20 horas",       time: "20:20", times: ["20:20", "20:30"], any: ["ptn"] },
    ],
  },
  {
    id: "mg", name: "Minas Gerais", short: "MG", flag: "⛏️",
    pages: {
      a: "https://deunoposte.com.br/resultado-jogo-do-bicho-minas-gerais/",
    },
    draws: [
      { code: "MG11", name: "União · 11 horas",     time: "11:00", times: ["11:00"], any: ["uniao", "juiz"] },
      { code: "MG12", name: "Alvorada · 12 horas",  time: "12:00", times: ["12:00"], any: ["alvorada"] },
      { code: "MG15", name: "Minas Dia · 15 horas", time: "15:00", times: ["15:00"], any: ["minas dia"] },
    ],
  },
  {
    id: "pe", name: "Pernambuco · Agreste", short: "PE", flag: "🌊",
    pages: {
      a: "https://deunoposte.com.br/resultado-jogo-do-bicho-agreste/",
    },
    draws: [
      { code: "PE930",  name: "Sorteio das 9h30",  time: "09:30", times: ["09:30"] },
      { code: "PE1030", name: "Sorteio das 10h30", time: "10:30", times: ["10:30"] },
      { code: "PE1240", name: "Sorteio das 12h40", time: "12:40", times: ["12:40"] },
      { code: "PE1540", name: "Sorteio das 15h40", time: "15:40", times: ["15:40"] },
      { code: "PE18",   name: "Sorteio das 18h",   time: "18:00", times: ["18:00"] },
      { code: "PE20",   name: "Sorteio das 20h",   time: "20:00", times: ["20:00"] },
    ],
  },
  {
    id: "pb", name: "Paraíba · Lotep", short: "PB", flag: "☀️",
    pages: {
      a: "https://deunoposte.com.br/resultado-lotep/",
      b: "https://bicholoterias.com.br/resultado-lotep/",
    },
    draws: [
      { code: "PB945",  name: "Paraíba Paratodos · 9h45", time: "09:45", times: ["09:45"], any: ["paratodos", "paraiba"] },
      { code: "PB1045", name: "Lotep · 10h45",            time: "10:45", times: ["10:45"], any: ["lotep"] },
      { code: "PB1245", name: "Lotep · 12h45",            time: "12:45", times: ["12:45"], any: ["lotep"] },
      { code: "PB1545", name: "Lotep · 15h45",            time: "15:45", times: ["15:45"], any: ["lotep"] },
      { code: "PB18",   name: "Lotep · 18h",              time: "18:00", times: ["18:00"], any: ["lotep"] },
      { code: "PB20",   name: "Paraíba Paratodos · 20h",  time: "20:00", times: ["20:00"], any: ["paratodos", "paraiba"] },
    ],
  },
  {
    id: "df", name: "Brasília · LBR", short: "DF", flag: "🏛️",
    pages: {
      a: "https://deunoposte.com.br/resultado-lbr-loterias/",
      b: "https://bicholoterias.com.br/resultado-lbr-loterias/",
    },
    draws: [
      { code: "DF040",  name: "Meia-noite · 0h40", time: "00:40", times: ["00:40"] },
      { code: "DF140",  name: "Madrugada · 1h40",  time: "01:40", times: ["01:40"] },
      { code: "DF240",  name: "Madrugada · 2h40",  time: "02:40", times: ["02:40"] },
      { code: "DF740",  name: "Manhã · 7h40",      time: "07:40", times: ["07:40"] },
      { code: "DF840",  name: "Manhã · 8h40",      time: "08:40", times: ["08:40"] },
      { code: "DF940",  name: "Manhã · 9h40",      time: "09:40", times: ["09:40"] },
      { code: "DF1030", name: "Manhã · 10h30",     time: "10:30", times: ["10:30"] },
      { code: "DF1140", name: "Manhã · 11h40",     time: "11:40", times: ["11:40"] },
      { code: "DF1340", name: "Tarde · 13h40",     time: "13:40", times: ["13:40"] },
      { code: "DF1440", name: "Tarde · 14h40",     time: "14:40", times: ["14:40"] },
      { code: "DF1500", name: "Tarde · 15 horas",  time: "15:00", times: ["15:00"] },
      { code: "DF1640", name: "Tarde · 16h40",     time: "16:40", times: ["16:40"] },
      { code: "DF1700", name: "Tarde · 17 horas",  time: "17:00", times: ["17:00"] },
      { code: "DF1840", name: "Noite · 18h40",     time: "18:40", times: ["18:40"] },
      { code: "DF1900", name: "Noite · 19 horas",  time: "19:00", times: ["19:00"] },
      { code: "DF2040", name: "Noite · 20h40",     time: "20:40", times: ["20:40"] },
      { code: "DF2140", name: "Noite · 21h40",     time: "21:40", times: ["21:40"] },
      { code: "DF2230", name: "Noite · 22h30",     time: "22:30", times: ["22:30"] },
      { code: "DF2330", name: "Noite · 23h30",     time: "23:30", times: ["23:30"] },
    ],
  },
  {
    id: "ba", name: "Bahia · Paratodos", short: "BA", flag: "🌵",
    pages: {
      a: "https://deunoposte.com.br/resultado-paratodos-bahia/",
    },
    draws: [
      { code: "10H", name: "10 horas", time: "10:00", times: ["10:00"] },
      { code: "12H", name: "12 horas", time: "12:00", times: ["12:00"] },
      { code: "15H", name: "15 horas", time: "15:00", times: ["15:00"] },
      { code: "19H", name: "19 horas", time: "19:00", times: ["19:00"] },
      { code: "21H", name: "21 horas", time: "21:00", times: ["21:00"] },
    ],
  },
  {
    id: "ce", name: "Ceará · Lotece", short: "CE", flag: "🪁",
    pages: {
      a: "https://deunoposte.com.br/resultado-jogo-do-bicho-ceara/",
    },
    draws: [
      { code: "CE11", name: "Lotece · 11 horas", time: "11:00", times: ["11:00"], any: ["lotece"] },
      { code: "CE14", name: "Lotece · 14 horas", time: "14:00", times: ["14:00"], any: ["lotece"] },
      { code: "CE1545", name: "Lotece · 15h45", time: "15:45", times: ["15:45"], any: ["lotece"] },
      { code: "CE19", name: "Lotece · 19 horas", time: "19:00", times: ["19:00"], any: ["lotece"] },
    ],
  },
  {
    id: "go", name: "Goiás", short: "GO", flag: "🌾",
    pages: {
      a: "https://deunoposte.com.br/resultado-jogo-do-bicho-goias/",
    },
    draws: [
      { code: "GO720", name: "Goiás · 7h20",  time: "07:20", times: ["07:20"] },
      { code: "GO920", name: "Goiás · 9h20",  time: "09:20", times: ["09:20"] },
      { code: "GO1120", name: "Goiás · 11h20", time: "11:20", times: ["11:20"] },
      { code: "GO1420", name: "Goiás · 14h20", time: "14:20", times: ["14:20"] },
      { code: "GO1620", name: "Goiás · 16h20", time: "16:20", times: ["16:20"] },
      { code: "GO1820", name: "Goiás · 18h20", time: "18:20", times: ["18:20"] },
      { code: "GO2120", name: "Goiás · 21h20", time: "21:20", times: ["21:20"] },
      { code: "GO2320", name: "Goiás · 23h20", time: "23:20", times: ["23:20"] },
    ],
  },
  {
    id: "pr", name: "Paraná", short: "PR", flag: "🌲",
    pages: {
      a: "https://deunoposte.com.br/resultado-jogo-do-bicho-parana/",
    },
    draws: [
      { code: "PR11", name: "Paraná · 11 horas", time: "11:00", times: ["11:00"] },
      { code: "PR14", name: "Paraná · 14 horas", time: "14:00", times: ["14:00"] },
      { code: "PR16", name: "Paraná · 16 horas", time: "16:00", times: ["16:00"] },
      { code: "PR18", name: "Paraná · 18 horas", time: "18:00", times: ["18:00"] },
      { code: "PR21", name: "Paraná · 21 horas", time: "21:00", times: ["21:00"] },
    ],
  },
  {
    id: "rs", name: "Rio Grande do Sul", short: "RS", flag: "🧉",
    pages: {
      a: "https://deunoposte.com.br/resultado-jogo-do-bicho-rio-grande-do-sul/",
    },
    draws: [
      { code: "RS14", name: "RS · 14 horas", time: "14:00", times: ["14:00"] },
    ],
  },
  {
    id: "ba2", name: "Bahia", short: "BA", flag: "🏝️",
    pages: {
      a: "https://deunoposte.com.br/resultado-jogo-do-bicho-bahia/",
    },
    draws: [
      { code: "BA10", name: "Bahia · 10 horas", time: "10:00", times: ["10:00"] },
      { code: "BA12", name: "Bahia · 12 horas", time: "12:00", times: ["12:00"] },
      { code: "BA15", name: "Bahia · 15 horas", time: "15:00", times: ["15:00"] },
      { code: "BA19", name: "Bahia · 19 horas", time: "19:00", times: ["19:00"] },
      { code: "BA21", name: "Bahia · 21 horas", time: "21:00", times: ["21:00"] },
    ],
  },
  {
    id: "cg", name: "Campina Grande · PB", short: "CG", flag: "🎭",
    pages: {
      a: "https://deunoposte.com.br/resultado-jogo-do-bicho-campina-grande/",
    },
    draws: [
      { code: "CG945", name: "Campina Grande · 9h45",  time: "09:45", times: ["09:45"] },
      { code: "CG1045", name: "Campina Grande · 10h45", time: "10:45", times: ["10:45"] },
      { code: "CG1245", name: "Campina Grande · 12h45", time: "12:45", times: ["12:45"] },
      { code: "CG1545", name: "Campina Grande · 15h45", time: "15:45", times: ["15:45"] },
      { code: "CG1805", name: "Campina Grande · 18h05", time: "18:05", times: ["18:05"] },
    ],
  },
  {
    id: "aval", name: "AVAL · Pernambuco", short: "AVAL", flag: "⭐",
    pages: {
      a: "https://deunoposte.com.br/resultado-aval-pernambuco/",
    },
    draws: [
      { code: "AV920", name: "AVAL · 9h20",  time: "09:20", times: ["09:20"] },
      { code: "AV11", name: "AVAL · 11 horas", time: "11:00", times: ["11:00"] },
      { code: "AV1245", name: "AVAL · 12h45", time: "12:45", times: ["12:45"] },
      { code: "AV14", name: "AVAL · 14 horas", time: "14:00", times: ["14:00"] },
      { code: "AV1545", name: "AVAL · 15h45", time: "15:45", times: ["15:45"] },
      { code: "AV17", name: "AVAL · 17 horas", time: "17:00", times: ["17:00"] },
      { code: "AV19", name: "AVAL · 19 horas", time: "19:00", times: ["19:00"] },
    ],
  },
  {
    id: "abaese", name: "ABAESE", short: "ABAESE", flag: "🎯",
    pages: {
      a: "https://deunoposte.com.br/resultado-abaese/",
    },
    draws: [
      { code: "AB10", name: "ABAESE · 10 horas", time: "10:00", times: ["10:00"] },
      { code: "AB13", name: "ABAESE · 13 horas", time: "13:00", times: ["13:00"] },
      { code: "AB16", name: "ABAESE · 16 horas", time: "16:00", times: ["16:00"] },
    ],
  },
  {
    id: "bs", name: "Boa Sorte · Goiás", short: "BS", flag: "🍀",
    pages: {
      a: "https://deunoposte.com.br/resultado-boa-sorte-goias/",
    },
    draws: [
      { code: "BS9", name: "Boa Sorte · 9 horas",  time: "09:00", times: ["09:00"] },
      { code: "BS11", name: "Boa Sorte · 11 horas", time: "11:00", times: ["11:00"] },
      { code: "BS14", name: "Boa Sorte · 14 horas", time: "14:00", times: ["14:00"] },
      { code: "BS16", name: "Boa Sorte · 16 horas", time: "16:00", times: ["16:00"] },
      { code: "BS18", name: "Boa Sorte · 18 horas", time: "18:00", times: ["18:00"] },
      { code: "BS21", name: "Boa Sorte · 21 horas", time: "21:00", times: ["21:00"] },
      { code: "BS2330", name: "Boa Sorte · 23h30", time: "23:30", times: ["23:30"] },
    ],
  },
  {
    id: "sonhos", name: "Loteria dos Sonhos", short: "SONHOS", flag: "💭",
    pages: {
      a: "https://deunoposte.com.br/resultado-loteria-dos-sonhos/",
    },
    draws: [
      { code: "SO11", name: "Sonhos · 11 horas", time: "11:00", times: ["11:00"], any: ["lotece"] },
      { code: "SO14", name: "Sonhos · 14 horas", time: "14:00", times: ["14:00"], any: ["lotece"] },
      { code: "SO1545", name: "Sonhos · 15h45", time: "15:45", times: ["15:45"], any: ["lotece"] },
      { code: "SO19", name: "Sonhos · 19 horas", time: "19:00", times: ["19:00"], any: ["lotece"] },
    ],
  },
  {
    id: "popular", name: "Popular · Recife", short: "POP", flag: "🎪",
    pages: {
      a: "https://deunoposte.com.br/resultado-loteria-popular-recife/",
    },
    draws: [
      { code: "PO930", name: "Popular · 9h30",  time: "09:30", times: ["09:30"] },
      { code: "PO11", name: "Popular · 11 horas", time: "11:00", times: ["11:00"] },
      { code: "PO1240", name: "Popular · 12h40", time: "12:40", times: ["12:40"] },
      { code: "PO14", name: "Popular · 14 horas", time: "14:00", times: ["14:00"] },
      { code: "PO1540", name: "Popular · 15h40", time: "15:40", times: ["15:40"] },
      { code: "PO17", name: "Popular · 17 horas", time: "17:00", times: ["17:00"] },
      { code: "PO1830", name: "Popular · 18h30", time: "18:30", times: ["18:30"] },
    ],
  },
  {
    id: "fed", name: "Loteria Federal", short: "FED", flag: "🇧🇷",
    ignore: /maluca|soma|multiplica|cabecalho/i,
    pages: {
      a: "https://deunoposte.com.br/resultado-loteria-federal-jogo-do-bicho/",
    },
    draws: [
      { code: "FED20", name: "Federal · 20 horas", time: "20:00", times: ["20:00"], any: ["federal"] },
    ],
  },
  {
    id: "giro", name: "Giro Paraíba", short: "GIRO", flag: "🔄",
    pages: {
      a: "https://deunopostenacional.com.br/giro-paraiba-jogo-do-bicho/",
    },
    draws: [
      { code: "GI930", name: "Giro · 9h30",  time: "09:30", times: ["09:30"] },
      { code: "GI14", name: "Giro · 14 horas", time: "14:00", times: ["14:00"] },
      { code: "GI17", name: "Giro · 17 horas", time: "17:00", times: ["17:00"] },
      { code: "GI1930", name: "Giro · 19h30", time: "19:30", times: ["19:30"] },
    ],
  },
];

/* Cabeçalhos que nunca são sorteios (nem entram no relatório de unmapped). */
const IGNORE_RE = /federal|maluca|soma|multiplica|cabecalho/i;

module.exports = { BANCAS, IGNORE_RE };
