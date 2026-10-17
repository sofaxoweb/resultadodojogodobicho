/* Deu no Bicho — scraper update.
 * Aplica resultados verificados em assets/data.js com guarda de conflitos:
 *  - só preenche sorteios com prizes: null (nunca sobrescreve publicado)
 *  - se o publicado divergir do raspado, registra conflito e NÃO toca
 *  - virada de dia: copia data.js -> data-ontem.js e recomeça do esqueleto
 *
 * Caminhos relativos à raiz do repo (repo-root layout: assets/ na raiz).
 */
const fs = require("fs");
const path = require("path");
const { BANCAS } = require("./mapping");

const HEADER = `/* ============================================================================
 * Deu no Bicho — ARQUIVO DE DADOS (resultados de HOJE)
 * ============================================================================
 * Gerado/atualizado automaticamente pelo scraper (tools/scraper).
 * Edição manual continua valendo: só troque prizes: null pela lista de
 * milhares (1º ao 10º ou 1º ao 5º, sempre 4 dígitos). Grupo e bicho são
 * calculados pelo site. Sorteios futuros ficam com prizes: null.
 * O arquivo do dia anterior vive em assets/data-ontem.js (ontem.html).
 * ========================================================================== */

`;

function repoRoot() { return path.resolve(__dirname, "../.."); }
function dataPath() { return path.join(repoRoot(), "assets", "data.js"); }
function ontemPath() { return path.join(repoRoot(), "assets", "data-ontem.js"); }

function loadData() {
  const window = {};
  const src = fs.readFileSync(dataPath(), "utf8");
  new Function("window", src)(window);
  return window.JB_DATA;
}

function todaySP() {
  const p = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const g = t => p.find(x => x.type === t).value;
  return `${g("year")}-${g("month")}-${g("day")}`;
}

function skeleton() {
  return {
    updatedAt: new Date().toISOString(),
    date: todaySP(),
    bancas: BANCAS.map(b => ({
      id: b.id, name: b.name, short: b.short, flag: b.flag,
      draws: b.draws.map(d => ({ code: d.code, name: d.name, time: d.time, prizes: null })),
    })),
  };
}

function serialize(data) {
  return HEADER + "window.JB_DATA = " + JSON.stringify(data, null, 2) + ";\n";
}

function same(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

/* results: [{bancaId, code, milhares}] já verificados.
 * Retorna {data, applied, skipped, conflicts, rolledOver}. Não escreve nada
 * se dry=true. */
function applyUpdates(results, { dry = false } = {}) {
  const today = todaySP();
  let data = loadData();
  let rolledOver = false;

  if (data.date !== today) {
    if (!dry) fs.copyFileSync(dataPath(), ontemPath());
    rolledOver = true;
    data = skeleton();
  }

  const applied = [], skipped = [], conflicts = [];
  const byBanca = new Map(data.bancas.map(b => [b.id, b]));

  for (const r of results) {
    const banca = byBanca.get(r.bancaId);
    if (!banca) { skipped.push(`${r.bancaId}/${r.code}: banca fora do data.js`); continue; }
    const draw = banca.draws.find(d => d.code === r.code);
    if (!draw) { skipped.push(`${r.bancaId}/${r.code}: sorteio fora do data.js`); continue; }
    if (!draw.prizes) {
      draw.prizes = r.milhares;
      applied.push(`${r.bancaId}/${r.code}`);
    } else if (same(draw.prizes, r.milhares)) {
      skipped.push(`${r.bancaId}/${r.code}: já publicado igual`);
    } else {
      conflicts.push({ draw: `${r.bancaId}/${r.code}`, reason: "diverge do publicado", published: draw.prizes, scraped: r.milhares });
    }
  }

  if (!dry && (applied.length || rolledOver)) {
    data.updatedAt = new Date().toISOString().replace(/\.\d+Z$/, "-03:00");
    fs.writeFileSync(dataPath(), serialize(data), "utf8");
  }
  return { data, applied, skipped, conflicts, rolledOver };
}

module.exports = { applyUpdates, loadData, todaySP, skeleton, serialize, repoRoot };
