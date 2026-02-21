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

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartial("#site-header", "../partials/header.html");
  await loadPartial("#site-sidebar", "../partials/sidebar.html");
  await loadPartial("#site-footer", "../partials/footer.html");

  const btn = document.getElementById("btn-menu");
  if (btn) {
    btn.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-open");
    });
  }
});
