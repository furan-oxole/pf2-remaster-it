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
    const btn = e.target.closest("#btn-left, #btn-right, .btn-left, .btn-right");
    if (!btn) return;

    if (btn.id === "btn-left" || btn.classList.contains("btn-left")) {
      document.body.classList.toggle("leftbar-open");
      document.body.classList.remove("rightbar-open");
      return;
    }

    if (btn.id === "btn-right" || btn.classList.contains("btn-right")) {
      document.body.classList.toggle("rightbar-open");
      document.body.classList.remove("leftbar-open");
    }
  });
});
