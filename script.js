async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} - ${url}`);
    el.innerHTML = await res.text();
  } catch (err) {
    el.textContent = `Errore caricando ${url}\n${err}`;
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const depth = location.pathname.split("/").filter(Boolean).length - 1;
  const base = depth > 0 ? "../".repeat(depth) : "./";

  await loadPartial("#site-header", `${base}partials/header.html`);
  await loadPartial("#site-leftbar", `${base}partials/leftbar.html`);
  await loadPartial("#site-rightbar", `${base}partials/rightbar.html`);

  document.addEventListener("click", (e) => {
    const btnRight = e.target.closest("#btn-right, .btn-right");
    if (btnRight) {
      document.body.classList.toggle("rightbar-open");
      return;
    }

    // chiudi se clicchi fuori (solo mobile)
    if (window.matchMedia("(max-width: 900px)").matches) {
      const insideRight = e.target.closest("#site-rightbar");
      if (!insideRight) document.body.classList.remove("rightbar-open");
    }
  });
});
