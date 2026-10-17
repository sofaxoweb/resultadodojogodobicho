/* Deu no Bicho — scraper fetch.
 * Baixa as páginas das bancas com cortesia: sequencial, intervalo entre
 * requisições, timeout e User-Agent identificável.
 */
const { BANCAS } = require("./mapping");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const DELAY_MS = 1500;
const TIMEOUT_MS = 25000;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* Lista única de {bancaId, source, url} na ordem das bancas. */
function jobList() {
  const jobs = [];
  for (const b of BANCAS) {
    for (const [source, url] of Object.entries(b.pages)) {
      jobs.push({ bancaId: b.id, source, url });
    }
  }
  return jobs;
}

async function fetchOne(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": UA, "Accept": "text/html", "Accept-Language": "pt-BR,pt;q=0.9" },
      redirect: "follow",
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const html = await res.text();
    if (html.length < 20000) throw new Error("resposta curta demais (" + html.length + " bytes)");
    return html;
  } finally {
    clearTimeout(t);
  }
}

/* Retorna { pages: {url: html}, errors: [..] }. */
async function fetchAll() {
  const pages = {};
  const errors = [];
  const jobs = jobList();
  for (let i = 0; i < jobs.length; i++) {
    const j = jobs[i];
    if (i > 0) await sleep(DELAY_MS);
    try {
      pages[j.url] = await fetchOne(j.url);
    } catch (e) {
      errors.push(`${j.bancaId}/${j.source}: ${e.message}`);
    }
  }
  return { pages, errors };
}

module.exports = { fetchAll, jobList, fetchOne };
