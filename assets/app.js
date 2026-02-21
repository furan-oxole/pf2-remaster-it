async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} - ${url}`);
    el.innerHTML = await res.text();
  } catch (err) {
    el.innerHTML = `<pre>Errore caricando ${url}\n${err}</pre>`;
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Calcola quante cartelle profonde sei (root=0, /giocatore/=1, /pages/=1, ecc.)
  // E costruisce un base path corretto per raggiungere la root del sito.
  const depth = location.pathname.split("/").length - 2;
  const base = depth > 0 ? "../".repeat(depth).replace(/\/$/, "") : ".";

  await loadPartial("#site-header", `${base}/partials/header.html`);
  await loadPartial("#site-sidebar", `${base}/partials/sidebar.html`);
  await loadPartial("#site-footer", `${base}/partials/footer.html`);

  // Sidebar destra: caricata solo se la pagina ha il contenitore
  await loadPartial("#site-right-sidebar", `${base}/partials/right_sidebar.html`);

  // Click su QUALSIASI bottone menu (contenuto o sidebar)
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t && (t.id === "btn-menu" || t.classList.contains("btn-menu"))) {
      document.body.classList.toggle("sidebar-open");
    }
  });
});
