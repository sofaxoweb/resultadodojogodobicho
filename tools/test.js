/* Testes do Deu no Bicho — rode com: node tools/test.js
 * 1) Valida o mapeamento milhar -> grupo/bicho contra grupos publicados
 *    pelas bancas (amostra verificada nas fontes em 10/10/2026 e 09/10/2026).
 * 2) Valida que data.js e data-ontem.js estão bem-formados
 *    (4 dígitos; 5 ou 10 prêmios; ou null).
 */
const fs = require("fs");
const path = require("path");

let fails = 0;
function ok(cond, msg) {
  if (!cond) { fails++; console.error("FALHOU:", msg); }
  else { console.log("ok:", msg); }
}

function loadData(file) {
  delete require.cache[require.resolve(file)];
  global.window = {};
  require(file);
  return global.window.JB_DATA;
}

const app = (() => { global.window = {}; return require("../assets/app.js"); })();

/* --- 1) amostra milhar -> grupo esperado (conferido nas fontes) --- */
const amostras = [
  // hoje 10/10 — RJ
  ["6897", 25], ["7135", 9], ["9426", 7], ["9188", 22], ["0053", 14],
  ["3543", 11], ["0710", 3], ["9570", 18], ["0836", 9], ["9474", 19],
  ["1650", 13], ["8766", 17], ["7630", 8], ["9351", 13], ["6874", 19],
  ["9503", 1], ["6448", 12], ["1051", 13], ["6282", 21], ["7648", 12],
  // hoje 10/10 — SP
  ["6920", 5], ["2412", 3], ["1309", 3], ["0924", 6], ["3482", 21],
  ["8654", 14], ["7665", 17], ["0131", 8], ["5609", 3], ["6600", 25],
  ["1208", 2], ["7759", 15], ["5269", 18], ["1656", 14], ["6967", 17],
  ["2808", 2], ["7698", 25], ["4595", 24], ["4955", 14], ["6894", 24],
  ["4563", 16], ["9870", 18], ["7903", 1], ["1213", 4], ["3651", 13],
  // hoje 10/10 — MG / PE / BA
  ["8545", 12], ["1127", 7], ["3387", 22], ["8852", 13], ["9206", 2],
  ["6331", 8], ["4583", 21], ["3716", 4], ["7788", 22], ["1827", 7],
  ["8653", 14], ["3193", 24], ["0941", 11], ["2586", 22], ["2843", 11],
  ["1448", 12], ["8630", 8], ["9053", 14], ["1151", 13], ["2999", 25],
  ["1554", 14], ["4028", 7], ["2378", 20], ["4025", 7], ["0191", 23],
  // hoje 10/10 — Lotep PB
  ["2805", 2], ["0457", 15], ["0270", 18], ["9851", 13], ["0823", 6],
  ["6297", 25], ["7721", 6], ["8306", 2], ["5285", 22], ["4958", 15],
  ["9671", 18], ["9597", 25], ["8294", 24], ["5104", 1], ["9455", 14],
  // hoje 10/10 — LBR DF
  ["1221", 6], ["8922", 6], ["2182", 21], ["5477", 20], ["4490", 23],
  ["3410", 3], ["2912", 3], ["8527", 7], ["4950", 13], ["6363", 16],
  ["3558", 15], ["2167", 17], ["1745", 12], ["3851", 13], ["2974", 19],
  ["1344", 11], ["0620", 5], ["4866", 17], ["9835", 9], ["6395", 24],
  ["4810", 3], ["6682", 21], ["6550", 13], ["2611", 3], ["3981", 21],
  ["8308", 2], ["0866", 17], ["7671", 18], ["6516", 4], ["5426", 7],
  ["0154", 14], ["4795", 24], ["6476", 19], ["0283", 21], ["3539", 10],
  ["5631", 8], ["2896", 24], ["2334", 9], ["0167", 17], ["8685", 22],
  ["2969", 18], ["9226", 7], ["3986", 22], ["9889", 23],
  ["1668", 17], ["9658", 15], ["4126", 7], ["8906", 2], ["2639", 10],
  // ontem 09/10 — RJ
  ["2472", 18], ["9227", 7], ["7645", 12], ["1160", 15], ["3608", 2],
  ["5872", 18], ["8623", 6], ["9992", 23], ["9132", 8], ["3440", 10],
  ["9790", 23], ["9208", 2], ["1931", 8], ["1635", 9], ["5526", 7],
  ["8539", 10], ["3377", 20], ["4544", 11], ["8118", 5], ["5817", 5],
  ["5420", 5], ["1124", 6], ["8296", 24], ["9663", 16], ["1481", 21],
  ["2056", 14], ["7194", 24], ["4099", 25], ["1550", 13], ["0113", 4],
  // ontem 09/10 — SP / MG / BA
  ["6911", 3], ["0747", 12], ["1482", 21], ["3788", 22], ["2920", 5],
  ["3489", 23], ["1413", 4], ["9386", 22], ["0807", 2], ["1557", 15],
  ["2755", 14], ["3401", 1], ["6519", 5], ["4277", 20], ["7859", 15],
  ["7700", 25], ["4332", 8], ["9446", 12], ["7246", 12], ["9810", 3],
  ["3379", 20], ["4902", 1], ["4399", 25], ["9136", 9], ["9741", 11],
  ["7133", 9], ["2401", 1], ["4622", 6], ["8259", 15], ["2646", 12],
  ["6030", 8], ["1831", 8], ["4720", 5], ["8333", 9], ["9962", 16],
  ["8373", 19], ["7948", 12], ["3346", 12], ["5165", 17], ["4667", 17],
  ["8578", 20], ["8741", 11], ["3383", 21], ["3948", 12], ["7954", 14],
  // bordas
  ["0000", 25], ["0097", 25], ["0001", 1], ["0096", 24]
];
let nAmostra = 0;
amostras.forEach(([mil, gEsperado]) => {
  const b = app.bichoFromMilhar(mil);
  nAmostra++;
  if (!(b && b.g === gEsperado)) { fails++; console.error(`FALHOU: milhar ${mil} -> esperado grupo ${gEsperado}, obtido ${b && b.g}`); }
});
console.log(`ok: ${nAmostra} amostras milhar->grupo conferidas`);

/* --- 2) cobertura total: cada dezena 00-99 cai no grupo certo --- */
for (let dz = 0; dz <= 99; dz++) {
  const dzs = String(dz).padStart(2, "0");
  const esperado = dz === 0 ? 25 : Math.ceil(dz / 4);
  const b = app.bichoFromMilhar("12" + dzs);
  if (!b || b.g !== esperado) { fails++; console.error(`FALHOU: dezena ${dzs} -> esperado ${esperado}, obtido ${b && b.g}`); }
}
console.log("ok: dezenas 00-99 mapeadas");

/* --- 3) data.js e data-ontem.js bem-formados --- */
["../assets/data.js", "../assets/data-ontem.js"].forEach(file => {
  const D = loadData(file);
  const tag = file.includes("ontem") ? "ontem" : "hoje";
  ok(/^\d{4}-\d{2}-\d{2}$/.test(D.date), `[${tag}] date no formato AAAA-MM-DD`);
  ok(Array.isArray(D.bancas) && D.bancas.length >= 1, `[${tag}] bancas presentes`);
  // sem ids de banca duplicados
  const ids = D.bancas.map(b => b.id);
  ok(new Set(ids).size === ids.length, `[${tag}] ids de banca únicos`);
  D.bancas.forEach(bn => {
    bn.draws.forEach(d => {
      if (!/^\d{2}:\d{2}$/.test(d.time)) { fails++; console.error(`FALHOU: [${tag}] banca ${bn.id} ${d.code}: horário inválido "${d.time}"`); }
      if (d.prizes === null) return; // aguardando / não disponível
      if (!(d.prizes.length === 5 || d.prizes.length === 10)) {
        fails++; console.error(`FALHOU: [${tag}] banca ${bn.id} ${d.code}: esperado 5 ou 10 prêmios, obtido ${d.prizes.length}`);
      }
      d.prizes.forEach(m => {
        if (!/^\d{4}$/.test(m)) { fails++; console.error(`FALHOU: [${tag}] banca ${bn.id} ${d.code}: milhar "${m}" sem 4 dígitos`); }
      });
    });
  });
  console.log(`ok: [${tag}] ${D.bancas.length} bancas validadas`);
});

/* --- 4) faixas de dezenas dos grupos --- */
ok(app.dezenasDoGrupo(1) === "01–04", "grupo 1 = 01–04");
ok(app.dezenasDoGrupo(25) === "97–00", "grupo 25 = 97–00");

console.log(fails === 0 ? "\nTODOS OS TESTES PASSARAM ✔" : `\n${fails} TESTE(S) FALHARAM ✘`);
process.exit(fails === 0 ? 0 : 1);
