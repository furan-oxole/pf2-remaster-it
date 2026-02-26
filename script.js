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
	const depth = location.pathname.split("/").length - 2;					
	const base = depth > 0 ? "../".repeat(depth).replace(/\/$/, "") : ".";					
	await loadPartial("#site-header", `${base}/partials/header.html`);					
	await loadPartial("#site-leftbar", `${base}/partials/leftbar.html`);					
	await loadPartial("#site-rightbar", `${base}/partials/rightbar.html`);					
	document.addEventListener("click", (e) => {					
		const t = e.target;				
		if (!t) return;				
		if (t.id === "btn-menu") {				
			document.body.classList.toggle("sidebar-open");			
			return;			
		}				
		if (t.classList && t.classList.contains("btn-menu")) {				
			document.body.classList.toggle("sidebar-open");			
		}				
	});					
});						
