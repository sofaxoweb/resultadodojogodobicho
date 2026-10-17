/* ============================================================================
 * Deu no Bicho — ARQUIVO DE DADOS (resultados de HOJE)
 * ============================================================================
 * ESTE É O ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR PARA ATUALIZAR O SITE.
 *
 * Como atualizar após cada sorteio:
 *  1. Troque "date" pela data do sorteio no formato AAAA-MM-DD.
 *  2. Em cada sorteio ("draws"), troque prizes: null por uma lista com as
 *     milhares sorteadas, do 1º ao 10º prêmio (ou do 1º ao 5º quando a banca
 *     só divulgar 5), sempre com 4 dígitos (use "0053", nunca 53).
 *     Exemplo: prizes: ["6897","7135","9426","9188","0053","6799","8141","9328","7568","4535"]
 *  3. O grupo e o nome do bicho são calculados AUTOMATICAMENTE pelo site
 *     a partir dos dois últimos dígitos de cada milhar. Você não precisa
 *     informar o bicho.
 *  4. Sorteios ainda não realizados ficam com prizes: null — o site mostra
 *     "Aguardando sorteio" com contagem regressiva automática.
 *  5. Atualize "updatedAt" com data/hora de Brasília (só informativo).
 *
 * Horários de referência (podem variar por banca/feriado — ajuste "time"
 * se a sua banca usar outro horário; a contagem regressiva usa este campo).
 *
 * ARQUIVO DO ONTEM: os resultados do dia anterior ficam em
 * assets/data-ontem.js (mesmo formato) e alimentam a página ontem.html.
 * ========================================================================== */

window.JB_DATA = {
  updatedAt: "2026-10-10T17:05:00-03:00",
  date: "2026-10-10",

  bancas: [
    {
      id: "rj",
      name: "Rio de Janeiro",
      short: "RJ",
      flag: "🏖️",
      draws: [
        { code: "PPT", name: "PPT · 9 horas",   time: "09:20", prizes: ["6897","7135","9426","9188","0053","6799","8141","9328","7568","4535"] },
        { code: "PTM", name: "PTM · 11 horas",  time: "11:20", prizes: ["3543","0710","9570","0836","9474","3090","5758","4173","3006","0160"] },
        { code: "PT",  name: "PT · 14 horas",   time: "14:20", prizes: ["1650","8766","7630","9351","6874","1879","6763","5635","0601","9149"] },
        { code: "PTV", name: "PTV · 16 horas",  time: "16:20", prizes: ["9503","6448","1051","6282","7648","9616","5402","0458","3812","0220"] },
        { code: "PTN", name: "PTN · 18 horas",  time: "18:20", prizes: null },
        { code: "COR", name: "Corujinha · 21 horas", time: "21:20", prizes: null }
      ]
    },
    {
      id: "sp",
      name: "São Paulo",
      short: "SP",
      flag: "🏙️",
      draws: [
        { code: "SP8",  name: "PT-SP · 8 horas",       time: "08:20", prizes: ["6920","2412","1309","0924","3482","6210","9439","2102","0294","3092"] },
        { code: "SP10", name: "PT-SP · 10 horas",      time: "10:20", prizes: ["8654","7665","0131","5609","6600","8705","6616","5630","4519","4129"] },
        { code: "SP12", name: "PT-SP · 12 horas",      time: "12:20", prizes: ["1208","7759","5269","1656","6967","1751","2726","0565","8996","6897"] },
        { code: "SP13", name: "PT-SP · 13 horas",      time: "13:20", prizes: ["2808","7698","4595","4955","6894","2744","8659","0995","8855","8203"] },
        { code: "SP15", name: "Bandeirantes · 15 horas", time: "15:20", prizes: ["4563","9870","7903","1213","3651","4971","5892","6701","3033","7797"] }
      ]
    },
    {
      id: "mg",
      name: "Minas Gerais",
      short: "MG",
      flag: "⛏️",
      draws: [
        { code: "MG11", name: "União · 11 horas",     time: "11:00", prizes: ["8545","1127","3387","8852","9206"] },
        { code: "MG12", name: "Alvorada · 12 horas",  time: "12:00", prizes: ["6331","4583","3716","7788","1827"] },
        { code: "MG15", name: "Minas Dia · 15 horas", time: "15:00", prizes: null }
      ]
    },
    {
      id: "pe",
      name: "Pernambuco · Agreste",
      short: "PE",
      flag: "🌊",
      draws: [
        { code: "PE930",  name: "Sorteio das 9h30",  time: "09:30", prizes: ["8653","3193","0941","2586","2843","8302","6195","5948","3316","1977"] },
        { code: "PE1030", name: "Sorteio das 10h30", time: "10:30", prizes: ["4122","6480","0506","3794","6258","4603","1457","2809","2064","2093"] },
        { code: "PE1240", name: "Sorteio das 12h40", time: "12:40", prizes: ["1448","8630","9053","1151","2999","1891","4601","4355","8031","2159"] },
        { code: "PE1540", name: "Sorteio das 15h40", time: "15:40", prizes: null },
        { code: "PE18",   name: "Sorteio das 18h",   time: "18:00", prizes: null },
        { code: "PE20",   name: "Sorteio das 20h",   time: "20:00", prizes: null }
      ]
    },
    {
      id: "ba",
      name: "Bahia · Paratodos",
      short: "BA",
      flag: "🌵",
      draws: [
        { code: "10H", name: "10 horas", time: "10:00", prizes: ["1554","4028","2378","4025","0191","2413","2405","9001","8876","7936"] },
        { code: "12H", name: "12 horas", time: "12:00", prizes: ["3047","7958","9176","6400","7965","6922","3424","4183","6346","5293"] },
        { code: "15H", name: "15 horas", time: "15:00", prizes: ["3618","2450","6317","3732","2953","2629","6284","0646","4072","1181"] },
        { code: "19H", name: "19 horas", time: "19:00", prizes: null },
        { code: "21H", name: "21 horas", time: "21:00", prizes: null }
      ]
    },
    {
      id: "pb",
      name: "Paraíba · Lotep",
      short: "PB",
      flag: "☀️",
      draws: [
        { code: "PB945",  name: "Paraíba Paratodos · 9h45", time: "09:45", prizes: ["2805","0457","0270","9851","0823","2009","8428","0575","5701","0919"] },
        { code: "PB1045", name: "Lotep · 10h45",            time: "10:45", prizes: ["6297","7721","8306","5285","4958","6785","2732","9208","7165","8457"] },
        { code: "PB1245", name: "Lotep · 12h45",            time: "12:45", prizes: ["9671","9597","8294","5104","9455","9985","6521","7990","1744","8361"] },
        { code: "PB1545", name: "Lotep · 15h45",            time: "15:45", prizes: null },
        { code: "PB18",   name: "Lotep · 18h",              time: "18:00", prizes: null },
        { code: "PB20",   name: "Paraíba Paratodos · 20h",  time: "20:00", prizes: null }
      ]
    },
    {
      id: "df",
      name: "Brasília · LBR",
      short: "DF",
      flag: "🏛️",
      draws: [
        { code: "DF040",  name: "Meia-noite · 0h40", time: "00:40", prizes: ["1221","8922","2182","5477","4490"] },
        { code: "DF140",  name: "Madrugada · 1h40",  time: "01:40", prizes: ["3410","2912","8527","4950","6363"] },
        { code: "DF240",  name: "Madrugada · 2h40",  time: "02:40", prizes: ["3558","2167","1745","3851","2974"] },
        { code: "DF740",  name: "Manhã · 7h40",      time: "07:40", prizes: ["1344","0620","4866","9835","6395"] },
        { code: "DF840",  name: "Manhã · 8h40",      time: "08:40", prizes: ["4810","6682","6550","2611","3981"] },
        { code: "DF940",  name: "Manhã · 9h40",      time: "09:40", prizes: ["8308","0866","7671","6516","5426"] },
        { code: "DF1030", name: "Manhã · 10h30",     time: "10:30", prizes: ["0154","4795","6476","0283","3539"] },
        { code: "DF1140", name: "Manhã · 11h40",     time: "11:40", prizes: ["5631","2896","2334","0167","8685"] },
        { code: "DF1340", name: "Tarde · 13h40",     time: "13:40", prizes: ["2969","5477","9226","3986","9889"] },
        { code: "DF1440", name: "Tarde · 14h40",     time: "14:40", prizes: ["1668","9658","4126","8906","2639"] }
      ]
    }
  ]
};
