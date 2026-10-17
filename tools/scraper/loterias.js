/* Deu no Bicho — scraper das Loterias Caixa.
 * Fonte: API oficial da Caixa (servicebus2.caixa.gov.br/portaldeloterias/api).
 * Roda dentro do run.js; nunca é fatal: se uma loteria falhar, mantém o
 * dado anterior e registra o erro no relatório.
 *
 * Uso avulso: node tools/scraper/loterias.js [--dry]
 */
const fs = require("fs");
const path = require("path");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const API = "https://servicebus2.caixa.gov.br/portaldeloterias/api";
const DELAY_MS = 1200;
const TIMEOUT_MS = 25000;

const LOTTERIES = [
  { id: "megasena",      name: "Mega-Sena" },
  { id: "lotofacil",     name: "Lotofácil" },
  { id: "quina",          name: "Quina" },
  { id: "lotomania",     name: "Lotomania" },
  { id: "timemania",     name: "Timemania", extraLabel: "Time do coração" },
  { id: "duplasena",     name: "Dupla Sena", twoDraws: true },
  { id: "diadesorte",    name: "Dia de Sorte", extraLabel: "Mês da Sorte" },
  { id: "supersete",     name: "Super Sete" },
  { id: "maismilionaria", name: "+Milionária", trevos: true },
  { id: "federal",       name: "Loteria Federal", bilhetes: true },
];

const HEADER = `/* ============================================================================
 * Deu no Bicho — LOTERIAS CAIXA (último concurso de cada loteria)
 * ============================================================================
 * Gerado automaticamente pelo scraper (tools/scraper/loterias.js) a partir
 * da API oficial da Caixa. Não edite à mão: a próxima execução sobrescreve.
 * ========================================================================== */

`;

function repoRoot() { return path.resolve(__dirname, "../.."); }
function dataPath() { return path.join(repoRoot(), "assets", "data-loterias.js"); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function loadPrev() {
  try {
    const window = {};
    new Function("window", fs.readFileSync(dataPath(), "utf8"))(window);
    return window.JB_LOTERIAS;
  } catch { return null; }
}

async function fetchJson(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": UA, "Accept": "application/json" },
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } finally { clearTimeout(t); }
}

function brl(v) {
  if (v === null || v === undefined) return null;
  return "R$ " + Number(v).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
}

function toISO(br) {
  // "14/10/2026" -> "2026-10-14"
  const m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(br || "");
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}

function parseLottery(cfg, j) {
  if (!j || typeof j.numero !== "number" || !Array.isArray(j.listaDezenas) || !j.listaDezenas.length) {
    throw new Error("resposta inválida da API");
  }
  const extraRaw = (j.nomeTimeCoracaoMesSorte || "").trim();
  return {
    id: cfg.id,
    name: cfg.name,
    concurso: j.numero,
    date: toISO(j.dataApuracao),
    dezenas: j.listaDezenas,
    dezenas2: cfg.twoDraws && Array.isArray(j.listaDezenasSegundoSorteio) ? j.listaDezenasSegundoSorteio : null,
    extra: cfg.extraLabel && extraRaw ? { label: cfg.extraLabel, value: extraRaw } : null,
    trevos: cfg.trevos && Array.isArray(j.trevosSorteados) ? j.trevosSorteados : null,
    bilhetes: !!cfg.bilhetes,
    acumulado: !!j.acumulado,
    proximoValor: brl(j.valorEstimadoProximoConcurso),
    proximoData: j.dataProximoConcurso || null,
  };
}

async function runLoterias({ dry = false } = {}) {
  const prev = loadPrev();
  const prevById = new Map((prev?.lotteries || []).map(l => [l.id, l]));
  const lotteries = [];
  const errors = [];
  let updated = 0;

  for (let i = 0; i < LOTTERIES.length; i++) {
    const cfg = LOTTERIES[i];
    if (i > 0) await sleep(DELAY_MS);
    try {
      const j = await fetchJson(`${API}/${cfg.id}`);
      const entry = parseLottery(cfg, j);
      const old = prevById.get(cfg.id);
      if (old && old.concurso > entry.concurso) {
        lotteries.push(old); // nunca regride
      } else {
        lotteries.push(entry);
        if (!old || old.concurso !== entry.concurso) updated++;
      }
    } catch (e) {
      const old = prevById.get(cfg.id);
      if (old) lotteries.push(old); // mantém o anterior
      errors.push(`${cfg.id}: ${e.message} (mantido concurso anterior)`);
    }
  }

  const data = {
    updatedAt: new Date().toISOString().replace(/\.\d+Z$/, "-03:00"),
    lotteries,
  };
  if (!dry) {
    fs.writeFileSync(dataPath(), HEADER + "window.JB_LOTERIAS = " + JSON.stringify(data, null, 2) + ";\n", "utf8");
  }
  return { updated, errors, total: lotteries.length };
}

if (require.main === module) {
  const dry = process.argv.includes("--dry");
  runLoterias({ dry }).then(r => {
    console.log(JSON.stringify(r, null, 2));
    process.exit(r.errors.length ? 2 : 0);
  });
}

module.exports = { runLoterias, LOTTERIES };
