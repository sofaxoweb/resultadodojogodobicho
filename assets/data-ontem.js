/* ============================================================================
 * Deu no Bicho — ARQUIVO DE DADOS (resultados de ONTEM)
 * ============================================================================
 * Alimenta a página ontem.html. Mesmo formato do assets/data.js:
 *  - "date": data dos resultados no formato AAAA-MM-DD
 *  - cada sorteio: prizes com as milhares (1º ao 10º, ou 1º ao 5º) ou null
 *    quando o resultado não foi publicado/registrado
 *  - grupo e bicho são calculados automaticamente; não informe o bicho
 *
 * Rotina diária sugerida: ao virar o dia, copie o conteúdo de data.js
 * para cá (ontem) e preencha data.js com os sorteios do novo dia.
 * ========================================================================== */

window.JB_DATA = {
  updatedAt: "2026-10-10T17:05:00-03:00",
  date: "2026-10-09",

  bancas: [
    {
      id: "rj",
      name: "Rio de Janeiro",
      short: "RJ",
      flag: "🏖️",
      draws: [
        { code: "PPT", name: "PPT · 9 horas",   time: "09:20", prizes: ["2472","9227","7645","1160","3608","2971","4261","7246","2750","1340"] },
        { code: "PTM", name: "PTM · 11 horas",  time: "11:20", prizes: ["5872","8623","9992","9132","3440","5899","8691","7293","2322","1264"] },
        { code: "PT",  name: "PT · 14 horas",   time: "14:20", prizes: ["9790","9208","1931","1635","5526","9911","7296","9033","0815","5145"] },
        { code: "PTV", name: "PTV · 16 horas",  time: "16:20", prizes: ["8539","3377","4544","8118","5817","8348","5351","3741","9748","7583"] },
        { code: "PTN", name: "PTN · 18 horas",  time: "18:20", prizes: ["5420","1124","8296","9663","1481","5189","4126","2296","0463","8058"] },
        { code: "COR", name: "Corujinha · 21 horas", time: "21:30", prizes: ["2056","7194","4099","1550","0113","2741","0105","5995","6490","0343"] }
      ]
    },
    {
      id: "sp",
      name: "São Paulo",
      short: "SP",
      flag: "🏙️",
      draws: [
        { code: "SP10", name: "PT-SP · 10 horas",        time: "10:00", prizes: ["6911","0747","1482","3788","2920","6013","9747","1488","1728","4824"] },
        { code: "SP15", name: "Bandeirantes · 15 horas", time: "15:20", prizes: ["3489","1413","9386","0807","1557","3190","4438","8180","9367","1827"] },
        { code: "SP17", name: "PT-SP · 17 horas",        time: "17:20", prizes: ["2755","3401","6519","4277","7859","2364","7452","5017","5197","4841"] }
      ]
    },
    {
      id: "mg",
      name: "Minas Gerais",
      short: "MG",
      flag: "⛏️",
      draws: [
        { code: "MG15", name: "Minas Dia · 15 horas",   time: "15:00", prizes: ["7700","4332","9446","7246","9810"] },
        { code: "MG19", name: "Minas Noite · 19 horas", time: "19:00", prizes: ["3379","4902","4399","9136","9741"] }
      ]
    },
    {
      id: "ba",
      name: "Bahia · Paratodos",
      short: "BA",
      flag: "🌵",
      draws: [
        { code: "10H", name: "10 horas", time: "10:00", prizes: ["7133","2401","4622","8259","2646","7286","6077","5240","7957","1022"] },
        { code: "12H", name: "12 horas", time: "12:00", prizes: ["6030","1831","4720","8333","9962","5568","0420","8569","5740","1492"] },
        { code: "15H", name: "15 horas", time: "15:00", prizes: ["8373","7948","3346","5165","4667","0771","1697","5796","3095","3093"] },
        { code: "19H", name: "19 horas", time: "19:00", prizes: ["8578","8741","3383","3948","7954","6105","6182","1457","7099","1679"] },
        { code: "21H", name: "21 horas", time: "21:00", prizes: null }
      ]
    }
  ]
};
