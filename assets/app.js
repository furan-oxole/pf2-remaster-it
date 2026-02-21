// Funzione: carica un file HTML e lo inserisce dentro un elemento della pagina
async function loadPartial(selector, url) {
  // Trova il "contenitore" nella pagina (es. #site-header)
  const el = document.querySelector(selector);
  // Se il contenitore non esiste in questa pagina, non fare nulla
  if (!el) return;

  try {
    // Scarica il file partial (es. partials/header.html)
    const res = await fetch(url);
    // Se il server risponde con errore (404 ecc.), segnala
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} - ${url}`);
    // Legge il testo HTML del file scaricato
    const html = await res.text();
    // Inserisce l'HTML dentro al contenitore
    el.innerHTML = html;
  } catch (err) {
    // Se qualcosa va storto, mostra un messaggio visibile in pagina
    el.innerHTML = `<pre>Errore caricando ${url}\n${err}</pre>`;
    // E stampa l'errore in console (F12) per debug
    console.error(err);
  }
}

// Quando la pagina è pronta, carica i partial comuni
document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML("afterbegin", "<div>JS OK</div>");
  // Carica header comune
  loadPartial("#site-header", "../partials/header.html");
  // Carica sidebar sinistra comune
  loadPartial("#site-sidebar", "../partials/sidebar.html");
  // Carica footer comune
  loadPartial("#site-footer", "../partials/footer.html");
});
