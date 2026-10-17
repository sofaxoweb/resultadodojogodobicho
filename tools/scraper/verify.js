/* Deu no Bicho — scraper verify.
 * Cruza fonte A x fonte B por sorteio. A fonte B às vezes publica as
 * milhares em ordem crescente, então a comparação é por CONJUNTO;
 * a ordem publicada é sempre a da fonte A (primária, canônica 1º–10º).
 *   verified: as duas fontes trazem as mesmas milhares  → aplica (ordem de A)
 *   single:   só uma fonte trouxe                         → aplica (marcado)
 *   conflict: os conjuntos divergem                       → NÃO aplica, alerta
 */
function keyOf(bancaId, code) { return `${bancaId}/${code}`; }

function setKey(arr) { return [...arr].sort().join(","); }

/* found: Map "bancaId/code" -> {a: milhares|null, b: milhares|null}
 * (null = fonte não trouxe / sorteio ainda não publicado na fonte) */
function verify(found) {
  const verified = [], single = [], conflicts = [];
  for (const [key, v] of found) {
    const hasA = v.a && v.a.length >= 5;
    const hasB = v.b && v.b.length >= 5;
    if (hasA && hasB) {
      if (setKey(v.a) === setKey(v.b)) verified.push({ draw: key, milhares: v.a });
      else conflicts.push({ draw: key, reason: "A×B divergem", a: v.a, b: v.b });
    } else if (hasA || hasB) {
      single.push({ draw: key, milhares: (hasA ? v.a : v.b), source: hasA ? "A" : "B" });
    }
  }
  return { verified, single, conflicts };
}

module.exports = { verify, setKey };
