/* Deu no Bicho — scraper parse.
 * Extrai de cada página: data da página + lista de {heading, milhares[], isFull}.
 * Depois casa cada sorteio com a config do mapping (horário ±10 min + tokens).
 *
 * Estrutura das fontes: <h3>Sorteio das 11 Horas (11h20) PTM</h3> seguido de
 * <table class="resultado-tabela"> com linhas [Prêmio, Milhar, Bicho (Grupo)].
 * "--" na coluna Milhar = sorteio ainda não publicado.
 */

function stripTags(s) {
  return s.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

/* Data da página = DD/MM/AAAA mais frequente no HTML. */
function pageDate(html) {
  const counts = {};
  const re = /(\d{2})\/(\d{2})\/(\d{4})/g;
  let m;
  while ((m = re.exec(html))) {
    const k = `${m[3]}-${m[2]}-${m[1]}`;
    counts[k] = (counts[k] || 0) + 1;
  }
  let best = null, bestN = 0;
  for (const [k, n] of Object.entries(counts)) {
    if (n > bestN) { best = k; bestN = n; }
  }
  return best; // AAAA-MM-DD ou null
}

/* "11h20" -> 680 (minutos). "11 Horas" -> 660. null se não achar. */
function headingTime(heading) {
  const low = heading.toLowerCase();
  let m = low.match(/(\d{1,2})h(\d{2})/);
  if (m) return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  m = low.match(/(\d{1,2})\s*horas?/);
  if (m) return parseInt(m[1], 10) * 60;
  m = low.match(/meia[\s-]?noite/);
  if (m) return 0;
  return null;
}

function toMins(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/* Casa um cabeçalho com a config de um sorteio. */
function matchDraw(heading, draw) {
  const low = heading.toLowerCase();
  const ht = headingTime(heading);
  if (ht === null) return false;
  const okTime = draw.times.some(t => Math.abs(toMins(t) - ht) <= 10);
  if (!okTime) return false;
  if (draw.any && draw.any.length && !draw.any.some(s => low.includes(s))) return false;
  if (draw.exact && draw.exact.length) {
    const tokens = low.split(/[^a-z0-9-]+/);
    if (!draw.exact.some(s => tokens.includes(s))) return false;
  }
  return true;
}

/* Extrai as milhares (4 dígitos) da tabela. "--" ou Soma/Multiplicação caem fora. */
function tableMilhares(tableHtml) {
  const rows = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(m => m[1]);
  const out = [];
  for (const r of rows) {
    const cells = [...r.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(m => stripTags(m[1]));
    if (cells.length < 2) continue;
    if (/prêmio/i.test(cells[0])) continue; // cabeçalho
    const mil = cells[1].trim();
    if (/^\d{4}$/.test(mil)) out.push(mil);
  }
  return out;
}

/* Retorna { date, draws: [{heading, key, milhares, isFull}] } — um item por sorteio. */
function parsePage(html) {
  const date = pageDate(html);
  const byKey = new Map();
  const h3re = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
  let m;
  while ((m = h3re.exec(html))) {
    const heading = stripTags(m[1]);
    if (!heading) continue;
    // acha a próxima <table class="resultado-tabela"> após este h3
    const rest = html.slice(m.index + m[0].length);
    const tm = rest.match(/<table class="resultado-tabela">([\s\S]*?)<\/table>/i);
    if (!tm) continue;
    // garante que não há outro h3 entre este h3 e a tabela
    const between = rest.slice(0, tm.index);
    if (/<h3/i.test(between)) continue;
    const isFull = /1º\s*ao\s*10º/.test(heading);
    const key = heading.replace(/1º\s*ao\s*10º/gi, "").trim().toLowerCase().replace(/\s+/g, " ");
    const milhares = tableMilhares(tm[1]);
    const prev = byKey.get(key);
    // prefere a tabela "1º ao 10º"; senão fica com a primeira
    if (!prev || (isFull && !prev.isFull)) {
      byKey.set(key, { heading, key, milhares, isFull });
    }
  }
  return { date, draws: [...byKey.values()] };
}

module.exports = { parsePage, pageDate, headingTime, matchDraw, tableMilhares, stripTags };
