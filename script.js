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

  // Click sui bottoni menu (sinistra/destra)
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!t) return;

    // Bottone nel contenuto: controlla la SINISTRA
    if (t.id === "btn-menu") {
      document.body.classList.toggle("sidebar-open");
      document.body.classList.remove("right-open");
      return;
    }

    // Bottoni dentro le sidebar: hanno class btn-menu
    if (t.classList.contains("btn-menu")) {
      const side = t.getAttribute("data-side");

      // Se è quello della sidebar DESTRA
      if (side === "right") {
        document.body.classList.toggle("right-open");
        document.body.classList.remove("sidebar-open");
        return;
      }

      // Altrimenti: SINISTRA (default)
      document.body.classList.toggle("sidebar-open");
      document.body.classList.remove("right-open");
    }
  });
});
