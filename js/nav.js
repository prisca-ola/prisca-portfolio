/* Fixed top bar: go transparent once the page starts scrolling. Shared across every page. */
(function () {
  var bar = document.querySelector(".topbar");
  if (!bar) return;
  function update() { bar.classList.toggle("scrolled", window.scrollY > 8); }
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
})();
