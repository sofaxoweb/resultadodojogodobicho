/* Deu no Bicho — scraper orquestrador.
 * Uso:
 *   node tools/scraper/run.js                 → raspa de verdade (cortesia)
 *   node tools/scraper/run.js --dry           → não escreve data.js/data-ontem.js
 *   node tools/scraper/run.js --fixtures=dir  → usa HTMLs locais (testes)
 *
 * Fluxo: fetch → parse → checa data da página → casa sorteios → verifica
 * (A×B) → aplica só verificados/sem conflito em sorteios ainda vazios.
 *
 * Saída: tools/scraper/report.json
 * Códigos: 0 = ok · 2 = conflitos ou erros (o que era seguro FOI aplicado).
 */
const fs = require("fs");
const path = require("path");
const { BANCAS, IGNORE_RE } = require("./mapping");
const { fetchAll } = require("./fetch");
const { parsePage, matchDraw } = require("./parse");
const { verify } = require("./verify");
const { applyUpdates, todaySP } = require("./update");

const DIR = __dirname;
const REPORT = path.join(DIR, "report.json");

function args() {
  const o = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([^=]+)(=(.*))?$/);
    if (m) o[m[1]] = m[3] === undefined ? true : m[3];
  }
  return o;
}

async function main() {
  const o = args();
  const today = todaySP();
  const report = {
    at: new Date().toISOString(), today,
    verified: [], single: [], conflicts: [],
    unmapped: [], duplicates: [], errors: [], applied: [], skipped: [], rolledOver: false,
  };

  try {
    // ---- 1) obtém HTML ----
    // fixtures: arquivos "<bancaId>-<source>.html", ex. rj-a.html, sp-b.html
    let jobs = [];
    if (o.fixtures) {
      const dir = path.resolve(o.fixtures);
      for (const f of fs.readdirSync(dir)) {
        if (!f.endsWith(".html")) continue;
        const base = f.replace(/\.html$/, "");
        const dash = base.lastIndexOf("-");
        const bancaId = base.slice(0, dash), source = base.slice(dash + 1);
        const banca = BANCAS.find(b => b.id === bancaId);
        if (!banca) throw new Error(`fixture sem banca: ${f}`);
        jobs.push({ banca, source, html: fs.readFileSync(path.join(dir, f), "utf8") });
      }
      if (!jobs.length) throw new Error("sem fixtures em " + dir);
    } else {
      const { pages: p, errors } = await fetchAll();
      report.errors.push(...errors);
      for (const [url, html] of Object.entries(p)) {
        const banca = BANCAS.find(b => Object.values(b.pages).includes(url));
        if (!banca) { report.errors.push(`página sem banca mapeada: ${url}`); continue; }
        const source = Object.entries(banca.pages).find(([, u]) => u === url)[0];
        jobs.push({ banca, source, html });
      }
    }

    // ---- 2) parse + casa sorteios ----
    // candidatos: "bancaId/code" -> {a: [{heading, milhares}], b: [...]}
    const found = new Map();
    const bump = (bancaId, code, source, heading, milhares) => {
      const k = `${bancaId}/${code}`;
      if (!found.has(k)) found.set(k, { a: [], b: [] });
      found.get(k)[source].push({ heading, milhares });
    };
    const BARE_RE = /^\d{1,2}h\d{2}\s+de Hoje$/i; // bloco-resumo duplicado: só vale se for o único

    for (const { banca, source, html } of jobs) {
      const { date, draws } = parsePage(html);
      if (date !== today) {
        report.errors.push(`${banca.id}/${source}: página com data ${date || "?"} (hoje é ${today}) — ignorada`);
        continue;
      }
      for (const d of draws) {
        if (IGNORE_RE.test(d.heading)) continue;
        const cfg = banca.draws.find(c => matchDraw(d.heading, c));
        if (!cfg) {
          if (d.milhares.length >= 5) report.unmapped.push(`${banca.id}/${source}: "${d.heading}"`);
          continue;
        }
        if (d.milhares.length === 5 || d.milhares.length === 10) {
          bump(banca.id, cfg.code, source, d.heading, d.milhares);
        }
        // 0 milhares = "Aguardando sorteio": nada a fazer
      }
    }

    // resolve duplicatas na mesma página/fonte: prefere o cabeçalho canônico
    // ("13 Horas (13h40min) de Hoje") ao bloco-resumo ("13h40 de Hoje");
    // entre tabelas do mesmo sorteio, prefere a mais completa (10 > 5)
    const resolved = new Map();
    for (const [k, v] of found) {
      const out = {};
      for (const s of ["a", "b"]) {
        const cands = v[s];
        if (!cands.length) { out[s] = null; continue; }
        const score = c =>
          (BARE_RE.test(c.heading) ? 0 : 100) + c.milhares.length;
        const pick = [...cands].sort((x, y) => score(y) - score(x))[0];
        out[s] = pick.milhares;
        for (const c of cands) {
          if (c !== pick) report.duplicates.push(`${k}/${s}: ignorado "${c.heading}"`);
        }
      }
      resolved.set(k, out);
    }

    // ---- 3) verifica A×B ----
    const v = verify(resolved);
    report.verified = v.verified.map(x => x.draw);
    report.single = v.single.map(x => `${x.draw} (só ${x.source})`);
    report.conflicts.push(...v.conflicts);

    // ---- 4) aplica ----
    const toApply = [...v.verified, ...v.single].map(x => {
      const [bancaId, code] = x.draw.split("/");
      return { bancaId, code, milhares: x.milhares };
    });
    if (o.dry) {
      report.dry = true;
      report.wouldApply = toApply.map(x => `${x.bancaId}/${x.code}`);
    } else if (toApply.length) {
      const r = applyUpdates(toApply);
      report.applied = r.applied;
      report.skipped = r.skipped;
      report.conflicts.push(...r.conflicts);
      report.rolledOver = r.rolledOver;
    }

    fs.writeFileSync(REPORT, JSON.stringify(report, null, 2), "utf8");
    const bad = report.conflicts.length || report.errors.length;
    console.log(JSON.stringify({
      verified: report.verified.length, single: report.single.length,
      applied: report.applied.length, conflicts: report.conflicts.length,
      errors: report.errors.length, unmapped: report.unmapped.length,
      rolledOver: report.rolledOver,
    }, null, 2));
    process.exit(bad ? 2 : 0);
  } catch (e) {
    report.errors.push("fatal: " + e.message);
    try { fs.writeFileSync(REPORT, JSON.stringify(report, null, 2), "utf8"); } catch {}
    console.error("FATAL:", e.message);
    process.exit(2);
  }
}

main();
