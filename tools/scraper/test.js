/* Deu no Bicho — testes do scraper.
 * Uso: node tools/scraper/test.js
 * Usa fixtures HTML reais (salvas em tools/scraper/fixtures/) com a data
 * de HOJE injetada, para validar parse + matching sem depender da rede.
 */
const fs = require("fs");
const path = require("path");
const assert = require("assert");
const { BANCAS } = require("./mapping");
const { parsePage, matchDraw, headingTime } = require("./parse");
const { verify } = require("./verify");
const { skeleton, serialize } = require("./update");

const DIR = __dirname;
const FIX = path.join(DIR, "fixtures");
let pass = 0;
function ok(name, cond) {
  if (!cond) { console.error("FALHOU:", name); process.exit(1); }
  pass++;
}

// ---------- 1) headingTime ----------
ok("h20", headingTime("Sorteio das 11 Horas (11h20) PTM") === 680);
ok("h30min", headingTime("11 Horas PTM (11h20min)") === 680);
ok("horas secas", headingTime("Sorteio das 15 Horas") === 900);
ok("meia-noite", headingTime("Sorteio da Meia Noite (0h40)") === 40);
ok("1 hora", headingTime("Sorteio da 1 hora (1h40)") === 100);

// ---------- 2) matchDraw ----------
const rj = BANCAS.find(b => b.id === "rj");
const ppt = rj.draws.find(d => d.code === "PPT");
const pt = rj.draws.find(d => d.code === "PT");
const ptm = rj.draws.find(d => d.code === "PTM");
ok("PPT casa", matchDraw("Sorteio das 9 Horas (9h20) PPT", ppt));
ok("PT casa", matchDraw("Sorteio das 14 Horas (14h20) PT", pt));
ok("PT não casa PTM", !matchDraw("Sorteio das 11 Horas (11h20) PTM", pt));
ok("PTM casa fonte B", matchDraw("11 Horas PTM (11h20min)", ptm));
const ptn = rj.draws.find(d => d.code === "PTN");
ok("PTN 19h20", matchDraw("Sorteio das 19 Horas (19h20) PTN", ptn));
ok("PTN 18h20 (alt)", matchDraw("19 Horas (18h20min) PTN", ptn));
const sp = BANCAS.find(b => b.id === "sp");
const sp8 = sp.draws.find(d => d.code === "SP8");
ok("SP8 8h20", matchDraw("Sorteio das 8 Horas (8h20) PT-SP", sp8));
ok("SP8 8h30 (alt fonte B)", matchDraw("8 Horas PT-SP (8h30min)", sp8));
const sp18 = sp.draws.find(d => d.code === "SP18");
ok("SP18 só horário", matchDraw("Sorteio das 18 Horas (18h20)", sp18));
const ba = BANCAS.find(b => b.id === "ba");
const h10 = ba.draws.find(d => d.code === "10H");
ok("BA 10h", matchDraw("Sorteio das 10 Horas", h10));
ok("BA 10h não casa 12h", !matchDraw("Sorteio das 12 Horas", h10));
const mg = BANCAS.find(b => b.id === "mg");
ok("MG União", matchDraw("Sorteio das 11 Horas (União Juiz de Fora)", mg.draws[0]));
ok("MG Alvorada", matchDraw("Sorteio das 12 Horas (Alvorada)", mg.draws[1]));
const df = BANCAS.find(b => b.id === "df");
ok("DF 19 draws", df.draws.length === 19);
ok("DF meia-noite", matchDraw("Sorteio da Meia Noite (0h40)", df.draws[0]));
ok("DF 23h30", matchDraw("Sorteio das 23 Horas (23h30)", df.draws[18]));

// ---------- 3) skeleton x data.js ----------
const skel = skeleton();
const window = {};
new Function("window", fs.readFileSync(path.join(DIR, "../../assets/data.js"), "utf8"))(window);
const live = window.JB_DATA;
const skelCodes = skel.bancas.flatMap(b => b.draws.map(d => `${b.id}/${d.code}|${d.time}`)).sort();
const liveCodes = live.bancas.flatMap(b => b.draws.map(d => `${b.id}/${d.code}|${d.time}`)).sort();
ok("mapping == data.js (codes+times)", JSON.stringify(skelCodes) === JSON.stringify(liveCodes));

// ---------- 4) fixtures reais (se existirem) ----------
if (fs.existsSync(FIX) && fs.readdirSync(FIX).some(f => f.endsWith(".html"))) {
  const { execSync } = require("child_process");
  const today = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date()).split("/").reverse().join("-");
  // injeta a data de hoje nas fixtures copiando para tmp
  const tmp = path.join(DIR, "fixtures.tmp");
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  for (const f of fs.readdirSync(FIX)) {
    if (!f.endsWith(".html")) continue;
    let html = fs.readFileSync(path.join(FIX, f), "utf8");
    html = html.replace(/\d{2}\/\d{2}\/\d{4}/g, today.split("-").reverse().join("/"));
    fs.writeFileSync(path.join(tmp, f), html);
  }
  try {
    execSync(`node ${path.join(DIR, "run.js")} --fixtures=${tmp} --dry`, { encoding: "utf8", stdio: "pipe" });
  } catch (e) { /* código 2 = conflitos/erros: o report conta a história */ }
  const rep = JSON.parse(fs.readFileSync(path.join(DIR, "report.json"), "utf8"));
  ok("fixtures sem erros fatais", rep.errors.filter(e => e.startsWith("fatal")).length === 0);
  ok("fixtures acharam sorteios", (rep.verified.length + rep.single.length) > 0);
  console.log("fixtures:", JSON.stringify({ verified: rep.verified.length, single: rep.single.length, unmapped: rep.unmapped.length, errors: rep.errors.length }));
  fs.rmSync(tmp, { recursive: true, force: true });
} else {
  console.log("(sem fixtures — pulando teste de HTML real)");
}

// ---------- 5) verify ----------
const v = verify(new Map([
  ["rj/PTM", { a: ["1111","2222","3333","4444","5555"], b: ["1111","2222","3333","4444","5555"] }],
  ["rj/PT",  { a: ["1111","2222","3333","4444","5555"], b: ["9999","2222","3333","4444","5555"] }],
  ["mg/MG11",{ a: ["1111","2222","3333","4444","5555"], b: null }],
]));
ok("verified", v.verified.length === 1 && v.verified[0].draw === "rj/PTM");
ok("conflict", v.conflicts.length === 1 && v.conflicts[0].draw === "rj/PT");
ok("single", v.single.length === 1 && v.single[0].draw === "mg/MG11");

// ---------- 6) serialize round-trip ----------
const rt = {};
new Function("window", serialize(skel))(rt);
ok("serialize round-trip", rt.JB_DATA.bancas.length === skel.bancas.length);

console.log(`\nOK — ${pass} testes passaram.`);
