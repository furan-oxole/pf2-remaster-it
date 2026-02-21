async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} - ${url}`);
    const html = await res.text();
    el.innerHTML = html;
  } catch (err) {
    el.innerHTML = `<pre>Errore caricando ${url}\n${err}</pre>`;
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("#site-header", "../partials/header.html");
  loadPartial("#site-sidebar", "../partials/sidebar.html");
  loadPartial("#site-footer", "../partials/footer.html");
});
