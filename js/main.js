/* ============================================================
   Prisca Olatunji, portfolio
   Theme toggle, scroll progress, active section, reveals
   ============================================================ */
(function () {
  "use strict";

  var html = document.documentElement;
  var scroller = document.getElementById("scroller");
  var panels = Array.prototype.slice.call(document.querySelectorAll(".panel"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".dot"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var pctEl = document.getElementById("pct");

  /* ---------- Theme ---------- */
  var THEME_KEY = "prisca.theme";

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }

  (function initTheme() {
    var saved;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
    } else {
      var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    }
  })();

  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  /* ---------- Smooth scroll to a section ---------- */
  function goTo(id) {
    var target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-target]");
    if (!trigger) return;
    e.preventDefault();
    goTo(trigger.getAttribute("data-target"));
  });

  /* ---------- Active section tracking + reveal ---------- */
  function setActive(id) {
    dots.forEach(function (d) {
      d.classList.toggle("active", d.getAttribute("data-target") === id);
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-target") === id);
    });
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            if (entry.intersectionRatio >= 0.5) setActive(entry.target.id);
          }
        });
      },
      { root: scroller, threshold: [0.25, 0.5, 0.75] }
    );
    panels.forEach(function (p) { io.observe(p); });
  } else {
    panels.forEach(function (p) { p.classList.add("in-view"); });
    setActive("home");
  }

  /* ---------- Scroll progress percentage ---------- */
  function updateProgress() {
    var max = scroller.scrollHeight - scroller.clientHeight;
    var pct = max > 0 ? Math.round((scroller.scrollTop / max) * 100) : 0;
    if (pctEl) pctEl.textContent = pct + "%";
  }

  var ticking = false;
  scroller.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateProgress();
      ticking = false;
    });
  });
  updateProgress();

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* ============================================================
   Stacked-card deck (hero)
   Wide front card with the rest stacked behind it. Arrows advance.
   Swap real work screenshots by setting `img` on each WORKS item,
   e.g. { title: "Brand X", img: "works/brand-x.jpg" }.
   ============================================================ */
(function () {
  "use strict";

  var stack = document.getElementById("stack");
  if (!stack) return;

  // Add more projects by appending { title, img } entries here.
  var WORKS = [
    { title: "Ajo", img: "works/ajo.png", link: "ajo.html" },
    { title: "Kinetyq", img: "works/kinetyq.webp", link: "kinetyq.html" },
  ];

  var N = WORKS.length;
  var works = document.getElementById("works");
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  // Build the cards (index 0 on top of the DOM, layering handled by z-index)
  var cards = [];
  WORKS.forEach(function (w, i) {
    var card = document.createElement("button");
    card.className = "card";
    card.type = "button";
    card.setAttribute("aria-label", w.title);

    if (w.img) {
      var im = document.createElement("img");
      im.src = w.img;
      im.alt = w.title;
      card.appendChild(im);
    } else {
      var no = document.createElement("span");
      no.className = "card-no";
      no.textContent = pad(i + 1);
      card.appendChild(no);
    }

    // Title + "View project" caption overlay
    var cap = document.createElement("div");
    cap.className = "card-cap";
    var ttl = document.createElement("h3");
    ttl.className = "card-title";
    ttl.textContent = w.title;
    var cta = document.createElement("span");
    cta.className = "card-cta";
    cta.textContent = "View project";
    cap.appendChild(ttl);
    cap.appendChild(cta);
    card.appendChild(cap);

    card.addEventListener("click", function () {
      if (w.link) { window.location.href = w.link; }
      else if (works) works.scrollIntoView({ behavior: "smooth" });
    });
    stack.appendChild(card);
    cards.push(card);
  });

  var active = 0;
  var thumb = document.getElementById("hcThumb");
  var label = document.getElementById("hcLabel");
  var prevBtn = document.getElementById("hcPrev");
  var nextBtn = document.getElementById("hcNext");

  var OFFSET = 22;       // px each card behind peeks down
  var SCALE = 0.05;      // shrink per depth
  var MAXBEHIND = 3;     // how many cards stay visible behind the front
  var AUTO_MS = 3000;    // auto-advance every 3 seconds

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function updateControl() {
    var w = WORKS[active];
    if (label) label.textContent = w.title;
    if (thumb) {
      if (w.img) {
        thumb.style.backgroundImage = "url(" + w.img + ")";
        thumb.textContent = "";
      } else {
        thumb.style.backgroundImage = "";
        thumb.textContent = pad(active + 1);
      }
    }
  }

  function layout() {
    for (var i = 0; i < N; i++) {
      var pos = (i - active + N) % N;   // 0 = front, then 1..N-1 wrapping behind
      var card = cards[i];

      if (pos === 0) {
        card.style.opacity = "1";
        card.style.transform = "translateY(0) scale(1)";
        card.style.zIndex = String(N + 1);
        card.style.pointerEvents = "auto";
      } else if (pos <= MAXBEHIND) {
        card.style.opacity = pos === 1 ? "0.7" : pos === 2 ? "0.45" : "0.25";
        card.style.transform = "translateY(" + (pos * OFFSET) + "px) scale(" + (1 - pos * SCALE) + ")";
        card.style.zIndex = String(N + 1 - pos);
        card.style.pointerEvents = "none";
      } else {
        // deep cards wait hidden at the back of the stack
        card.style.opacity = "0";
        card.style.transform =
          "translateY(" + ((MAXBEHIND + 1) * OFFSET) + "px) scale(" + (1 - (MAXBEHIND + 1) * SCALE) + ")";
        card.style.zIndex = "0";
        card.style.pointerEvents = "none";
      }
    }
    updateControl();
  }

  function go(dir) {
    active = (active + dir + N) % N;   // cyclic so the deck loops
    layout();
  }

  // Auto-advance
  var timer = null;
  function startAuto() {
    if (reduceMotion) return;
    stopAuto();
    timer = setInterval(function () { go(1); }, AUTO_MS);
  }
  function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { go(-1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener("click", function () { go(1); startAuto(); });

  // Pause while the pointer is over the deck so a viewer can linger
  var stage = document.querySelector(".stack-stage");
  if (stage) {
    stage.addEventListener("mouseenter", stopAuto);
    stage.addEventListener("mouseleave", startAuto);
  }

  layout();
  startAuto();
})();

/* ============================================================
   Custom trailing cursor, a small circle that follows the mouse.
   Activates only on a real mouse pointer (ignores touch/pen), so
   it never shows a fake cursor on phones/tablets. The native
   cursor stays visible underneath.
   ============================================================ */
(function () {
  "use strict";

  var dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.appendChild(dot);

  var x = window.innerWidth / 2;
  var y = window.innerHeight / 2;
  var tx = x, ty = y;
  var shown = false;
  var rafId = null;

  function show() {
    if (!shown) { shown = true; dot.classList.add("show"); }
    if (rafId === null) rafId = requestAnimationFrame(raf);
  }
  function hide() {
    shown = false;
    dot.classList.remove("show");
  }

  function onMove(cx, cy) {
    tx = cx; ty = cy;
    show();
  }

  // Prefer pointer events so we can ignore touch/pen; fall back to mouse events.
  if ("PointerEvent" in window) {
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      onMove(e.clientX, e.clientY);
    }, { passive: true });
  } else {
    window.addEventListener("mousemove", function (e) {
      onMove(e.clientX, e.clientY);
    }, { passive: true });
  }

  // Hide when the pointer leaves the window, show again on return
  document.addEventListener("mouseleave", hide);
  document.addEventListener("mouseenter", function () {
    if (shown) dot.classList.add("show");
  });

  // Grow gently over interactive things
  var HOT = "a, button, .card, .hc-btn, .theme-toggle, [data-target], .dot";
  document.addEventListener("mouseover", function (e) {
    if (e.target.closest && e.target.closest(HOT)) dot.classList.add("hot");
  });
  document.addEventListener("mouseout", function (e) {
    if (e.target.closest && e.target.closest(HOT)) dot.classList.remove("hot");
  });

  function raf() {
    x += (tx - x) * 0.18;   // smoothing / trailing lag
    y += (ty - y) * 0.18;
    dot.style.transform = "translate(" + x + "px," + y + "px) translate(-50%, -50%)";
    rafId = requestAnimationFrame(raf);
  }
})();
