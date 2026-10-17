/* Deu no Bicho — app.js
 * Renderiza tudo a partir de window.JB_DATA (assets/data.js).
 * O grupo/bicho é calculado automaticamente pelos 2 últimos dígitos da milhar.
 */
(function () {
  "use strict";

  /* ---------- tabela dos 25 bichos ---------- */
  var BICHOS = [
    { g: 1,  nome: "Avestruz",  emo: "🐦" },
    { g: 2,  nome: "Águia",     emo: "🦅" },
    { g: 3,  nome: "Burro",     emo: "🫏" },
    { g: 4,  nome: "Borboleta", emo: "🦋" },
    { g: 5,  nome: "Cachorro",  emo: "🐶" },
    { g: 6,  nome: "Cabra",     emo: "🐐" },
    { g: 7,  nome: "Carneiro",  emo: "🐑" },
    { g: 8,  nome: "Camelo",    emo: "🐫" },
    { g: 9,  nome: "Cobra",     emo: "🐍" },
    { g: 10, nome: "Coelho",    emo: "🐰" },
    { g: 11, nome: "Cavalo",    emo: "🐴" },
    { g: 12, nome: "Elefante",  emo: "🐘" },
    { g: 13, nome: "Galo",      emo: "🐓" },
    { g: 14, nome: "Gato",      emo: "🐱" },
    { g: 15, nome: "Jacaré",    emo: "🐊" },
    { g: 16, nome: "Leão",      emo: "🦁" },
    { g: 17, nome: "Macaco",    emo: "🐵" },
    { g: 18, nome: "Porco",     emo: "🐷" },
    { g: 19, nome: "Pavão",     emo: "🦚" },
    { g: 20, nome: "Peru",      emo: "🦃" },
    { g: 21, nome: "Touro",     emo: "🐂" },
    { g: 22, nome: "Tigre",     emo: "🐯" },
    { g: 23, nome: "Urso",      emo: "🐻" },
    { g: 24, nome: "Veado",     emo: "🦌" },
    { g: 25, nome: "Vaca",      emo: "🐄" }
  ];

  function dezenasDoGrupo(g) {
    if (g === 25) return "97–00";
    var ini = (g - 1) * 4 + 1, fim = g * 4;
    return String(ini).padStart(2, "0") + "–" + String(fim).padStart(2, "0");
  }

  /* dezena 00 -> grupo 25, senão teto(dezena/4) */
  function grupoFromDezena(dz) {
    dz = parseInt(dz, 10);
    if (isNaN(dz)) return null;
    if (dz === 0) return 25;
    return Math.ceil(dz / 4);
  }
  function bichoFromMilhar(milhar) {
    var dz = String(milhar).slice(-2);
    var g = grupoFromDezena(dz);
    return g ? BICHOS[g - 1] : null;
  }

  /* ---------- data/hora ---------- */
  function parseYMD(ymd) {
    var p = ymd.split("-");
    return new Date(p[0], p[1] - 1, p[2]);
  }
  function fmtDateLong(ymd) {
    try {
      return new Intl.DateTimeFormat("pt-BR", {
        weekday: "long", day: "2-digit", month: "long", year: "numeric"
      }).format(parseYMD(ymd));
    } catch (e) { return ymd; }
  }
  function fmtDateShort(ymd) {
    var p = ymd.split("-");
    return p[2] + "/" + p[1] + "/" + p[0];
  }
  /* hora atual em São Paulo (as bancas seguem horário de Brasília) */
  function nowSP() {
    var parts = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit", minute: "2-digit", hour12: false
    }).formatToParts(new Date());
    var h = 0, m = 0;
    parts.forEach(function (p) {
      if (p.type === "hour") h = parseInt(p.value, 10);
      if (p.type === "minute") m = parseInt(p.value, 10);
    });
    return { h: h, m: m, mins: h * 60 + m };
  }
  function timeToMins(t) {
    var p = t.split(":");
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }
  /* data atual em São Paulo no formato AAAA-MM-DD */
  function spDateStr() {
    var y = "", m = "", d = "";
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date()).forEach(function (x) {
      if (x.type === "year") y = x.value;
      if (x.type === "month") m = x.value;
      if (x.type === "day") d = x.value;
    });
    return y + "-" + m + "-" + d;
  }
  function fmtCountdown(ms) {
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
    function z(n) { return String(n).padStart(2, "0"); }
    return z(h) + ":" + z(m) + ":" + z(ss);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var DATA = (typeof window !== "undefined") ? window.JB_DATA : null;

  /* ---------- tudo abaixo desta linha só executa no navegador ---------- */
  if (typeof document !== "undefined" && DATA) {

  /* ---------- cabeçalho de data ---------- */
  document.querySelectorAll("[data-jb-date]").forEach(function (el) {
    el.textContent = fmtDateLong(DATA.date);
    el.setAttribute("datetime", DATA.date);
  });
  document.querySelectorAll("[data-jb-dateshort]").forEach(function (el) {
    el.textContent = fmtDateShort(DATA.date);
  });
  document.querySelectorAll("[data-jb-updated]").forEach(function (el) {
    el.textContent = DATA.updatedAt.replace("T", " às ").slice(0, 16) + "h";
  });

  /* ================= PÁGINA INICIAL ================= */
  var tabsEl = document.getElementById("banca-tabs");
  var drawsEl = document.getElementById("draws");
  var nextEl = document.getElementById("next-draws");

  function isDataToday() { return !!(DATA && DATA.date === spDateStr()); }

  function drawStatus(draw) {
    if (draw.prizes && draw.prizes.length) return "ok";
    if (!isDataToday()) return "na";
    var now = nowSP().mins, t = timeToMins(draw.time);
    if (now >= t && now - t < 45) return "apuracao";
    return "wait";
  }

  function prizeRows(draw) {
    var html = "";
    var n = draw.prizes.length;
    draw.prizes.forEach(function (mil, i) {
      var b = bichoFromMilhar(mil);
      var cls = i === 0 ? ' class="head-prize"' : (i >= 7 ? ' class="extra-prize"' : "");
      var pos = (i + 1) + "º";
      html += "<tr" + cls + "><td class=\"pos\">" + pos + "</td>" +
        "<td class=\"mil\">" + esc(mil) + "</td>" +
        "<td><span class=\"bicho-cell\"><span class=\"emo\">" + b.emo + "</span>" +
        "<span>" + esc(b.nome) + " <span class=\"grp\">grupo " + b.g + "</span></span></span></td></tr>";
    });
    if (n > 7) {
      html += "<tr class=\"more-row\"><td colspan=\"3\">" +
        "<button class=\"more-btn\" data-toggle>▼ ver do 1º ao " + n + "º</button></td></tr>";
    }
    return html;
  }

  function waitingBox(draw, status) {
    if (status === "na") {
      return "<div class=\"waiting-box\"><span class=\"big\">📭</span>" +
        "<strong>Resultado não disponível</strong><br>para esta data.</div>";
    }
    var now = nowSP().mins, t = timeToMins(draw.time);
    var diffMs = (t - now) * 60000 - new Date().getSeconds() * 1000;
    if (status === "apuracao") {
      return "<div class=\"waiting-box\"><span class=\"big\">⏳</span>" +
        "<strong>Sorteio em apuração…</strong><br>Os números entram aqui assim que forem divulgados.</div>";
    }
    return "<div class=\"waiting-box\"><span class=\"big\">🕐</span>" +
      "Aguardando sorteio das <strong>" + esc(draw.time) + "</strong><br>" +
      "<span class=\"cd\" data-countdown=\"" + t + "\">" + fmtCountdown(diffMs) + "</span></div>";
  }

  function renderDraws(bancaId) {
    var banca = DATA.bancas.find(function (b) { return b.id === bancaId; });
    if (!banca || !drawsEl) return;
    var html = "";
    banca.draws.forEach(function (d) {
      var st = drawStatus(d);
      var badge = st === "ok"
        ? "<span class=\"badge ok\">Publicado</span>"
        : (st === "apuracao" ? "<span class=\"badge wait\">Em apuração</span>"
        : (st === "na" ? "<span class=\"badge wait\">Não disponível</span>" : "<span class=\"badge wait\">Aguardando</span>"));
      html += "<article class=\"draw-card" + (st === "ok" ? "" : " pending") + "\">" +
        "<div class=\"draw-head\"><h3>" + esc(d.name) + "</h3>" + badge + "</div>";
      if (st === "ok") {
        html += "<table class=\"prizes\"><thead><tr><th>Prêmio</th><th>Milhar</th><th>Bicho (grupo)</th></tr></thead>" +
          "<tbody>" + prizeRows(d) + "</tbody></table>";
      } else {
        html += waitingBox(d, st);
      }
      html += "</article>";
    });
    drawsEl.innerHTML = html;
    drawsEl.querySelectorAll("[data-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var card = btn.closest(".draw-card");
        card.classList.toggle("show-all");
        var total = card.querySelectorAll("tbody tr").length - 1;
        btn.textContent = card.classList.contains("show-all") ? "▲ mostrar só até o 7º" : "▼ ver do 1º ao " + total + "º";
      });
    });
  }

  function renderTabs() {
    if (!tabsEl) return;
    tabsEl.innerHTML = "";
    DATA.bancas.forEach(function (b, i) {
      var btn = document.createElement("button");
      btn.className = "tab" + (i === 0 ? " active" : "");
      btn.innerHTML = "<span class=\"flag\">" + b.flag + "</span>" + esc(b.name);
      btn.addEventListener("click", function () {
        tabsEl.querySelectorAll(".tab").forEach(function (t) { t.classList.remove("active"); });
        btn.classList.add("active");
        renderDraws(b.id);
      });
      tabsEl.appendChild(btn);
    });
    renderDraws(DATA.bancas[0].id);
  }

  /* banner: último sorteio publicado do dia */
  function renderLastResult() {
    var el = document.getElementById("last-result");
    if (!el) return;
    var best = null;
    DATA.bancas.forEach(function (b) {
      b.draws.forEach(function (d) {
        if (d.prizes && d.prizes.length) {
          var t = timeToMins(d.time);
          if (!best || t > best.t) best = { t: t, d: d, b: b };
        }
      });
    });
    if (!best) {
      el.innerHTML = "<span class=\"lbl\">Resultado de hoje</span><span class=\"bicho\">Nenhum sorteio publicado ainda — volte em breve.</span>";
      return;
    }
    var b0 = bichoFromMilhar(best.d.prizes[0]);
    el.innerHTML =
      "<span class=\"lbl\">Último resultado · " + esc(best.b.name) + "</span>" +
      "<span class=\"draw-name\">" + esc(best.d.name) + " — 1º prêmio</span>" +
      "<span class=\"milhar\">" + esc(best.d.prizes[0]) + "</span>" +
      "<span class=\"bicho\">" + b0.emo + " " + esc(b0.nome) + " (grupo " + b0.g + ")</span>";
  }

  /* faixa "próximos sorteios" */
  function renderNext() {
    if (!nextEl) return;
    if (!isDataToday()) {
      nextEl.innerHTML = "<span class=\"t\">Arquivo</span><span class=\"next-item\">Você está vendo os resultados de <b>" +
        fmtDateShort(DATA.date) + "</b>. <a href=\"index.html\" style=\"color:var(--gold);font-weight:700\">← Ver resultados de hoje</a></span>";
      return;
    }
    var now = nowSP().mins;
    var items = [];
    DATA.bancas.forEach(function (b) {
      b.draws.forEach(function (d) {
        var t = timeToMins(d.time);
        if (!(d.prizes && d.prizes.length) && t > now) {
          items.push({ b: b, d: d, t: t });
        }
      });
    });
    items.sort(function (a, b2) { return a.t - b2.t; });
    items = items.slice(0, 4);
    if (!items.length) {
      nextEl.innerHTML = "<span class=\"t\">Próximos sorteios</span><span class=\"next-item\">Todos os sorteios de hoje foram publicados. Amanhã tem mais. 🍀</span>";
      return;
    }
    var html = "<span class=\"t\">Próximos sorteios</span>";
    items.forEach(function (it) {
      var diffMs = (it.t - now) * 60000 - new Date().getSeconds() * 1000;
      html += "<span class=\"next-item\">" + esc(it.b.short) + " · <b>" + esc(it.d.name) +
        "</b> em <span class=\"cd\" data-countdown=\"" + it.t + "\">" + fmtCountdown(diffMs) + "</span></span>";
    });
    nextEl.innerHTML = html;
  }

  /* atualiza contagens regressivas a cada segundo */
  function tick() {
    var now = nowSP().mins;
    document.querySelectorAll("[data-countdown]").forEach(function (el) {
      var t = parseInt(el.getAttribute("data-countdown"), 10);
      var diffMs = (t - now) * 60000 - new Date().getSeconds() * 1000;
      el.textContent = fmtCountdown(diffMs);
    });
  }

  if (tabsEl && drawsEl) {
    renderTabs();
    renderLastResult();
    renderNext();
    setInterval(function () { tick(); renderNext(); }, 1000);
    /* re-render leve a cada 60s para virar "em apuração" na hora certa */
    setInterval(function () {
      var active = tabsEl.querySelector(".tab.active");
      var idx = Array.prototype.indexOf.call(tabsEl.children, active);
      renderDraws(DATA.bancas[idx < 0 ? 0 : idx].id);
    }, 60000);
  }

  /* ================= PÁGINA CONSULTAR ================= */
  var form = document.getElementById("consult-form");
  if (form) {
    var input = document.getElementById("consult-input");
    var panel = document.getElementById("consult-result");

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var raw = input.value.replace(/\D/g, "");
      if (raw.length !== 2 && raw.length !== 4) {
        panel.className = "result-panel show";
        panel.innerHTML = "<div class=\"no-hit\">Digite 2 dígitos (dezena) ou 4 dígitos (milhar). Ex.: 25 ou 7025.</div>";
        return;
      }
      var dezena = raw.slice(-2);
      var g = grupoFromDezena(dezena);
      var b = BICHOS[g - 1];

      var html = "<div class=\"bicho-hero\"><span class=\"emo\">" + b.emo + "</span><div>" +
        "<div class=\"nm\">" + esc(b.nome) + " <span style=\"font-weight:400;font-size:1rem\">(grupo " + b.g + ")</span></div>" +
        "<div class=\"dt\">" +
        (raw.length === 4
          ? "Milhar <strong>" + esc(raw) + "</strong> · centena " + esc(raw.slice(1)) + " · dezena " + esc(dezena)
          : "Dezena <strong>" + esc(dezena) + "</strong>") +
        " · dezenas do grupo: " + dezenasDoGrupo(b.g) + "</div></div></div>";

      /* confere nos sorteios publicados de hoje */
      var hits = [];
      DATA.bancas.forEach(function (bn) {
        bn.draws.forEach(function (d) {
          if (!d.prizes) return;
          d.prizes.forEach(function (mil, i) {
            var isMilhar = raw.length === 4 && mil === raw;
            var isDezena = mil.slice(-2) === dezena && i < 5;
            if (isMilhar || (raw.length === 2 && isDezena)) {
              hits.push("<li>🎯 <b>" + esc(bn.name) + " · " + esc(d.name) + "</b> — " +
                (i + 1) + "º prêmio: milhar <b>" + esc(mil) + "</b> (" + esc(bichoFromMilhar(mil).nome) + ")" +
                (isMilhar ? " — <b>milhar exata!</b>" : " — dezena " + esc(dezena) + " no " + (i + 1) + "º prêmio") +
                "</li>");
            }
          });
        });
      });

      if (hits.length) {
        html += "<h3 style=\"margin:18px 0 8px\">✅ Saiu hoje (" + fmtDateShort(DATA.date) + ")</h3><ul class=\"hit-list\">" + hits.join("") + "</ul>";
      } else {
        html += "<div class=\"no-hit\">Não saiu em nenhum prêmio publicado hoje (" + fmtDateShort(DATA.date) + "). Boa sorte no próximo sorteio! 🍀</div>";
      }
      panel.className = "result-panel show";
      panel.innerHTML = html;
    });
  }

  /* tabela dos 25 bichos (usada na página consultar) */
  var grid = document.getElementById("bicho-grid");
  if (grid) {
    grid.innerHTML = BICHOS.map(function (b) {
      return "<div class=\"bicho-card\"><div class=\"emo\">" + b.emo + "</div>" +
        "<div class=\"gp\">Grupo " + b.g + "</div>" +
        "<div class=\"nm\">" + esc(b.nome) + "</div>" +
        "<div class=\"dz\">" + dezenasDoGrupo(b.g) + "</div></div>";
    }).join("");
  }

  } /* fim do bloco executado apenas no navegador */

  /* expõe para testes (node) */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { BICHOS: BICHOS, grupoFromDezena: grupoFromDezena, bichoFromMilhar: bichoFromMilhar, dezenasDoGrupo: dezenasDoGrupo };
  }
})();
