(async()=>{
	const load=async(id,url)=>{
		const el=document.getElementById(id);
		if(!el)return;
		const r=await fetch(url,{cache:"no-store"});
		el.innerHTML=await r.text();
	};
	const inject=()=>{
		const src=document.getElementById("page-rightbar");
		if(!src)return;
		const slot=document.querySelector("#site-rightbar [data-rightbar-slot]");
		if(!slot)return;
		slot.innerHTML=src.innerHTML;
	};
	const wire=()=>{
		const btn=document.getElementById("btn-right");
		if(!btn)return;
		btn.addEventListener("click",e=>{
			e.preventDefault();
			document.body.classList.toggle("rightbar-open");
		});
		document.addEventListener("click",e=>{
			if(window.innerWidth>=900)return;
			if(!document.body.classList.contains("rightbar-open"))return;
			const rb=document.getElementById("site-rightbar");
			if(rb&&!rb.contains(e.target)&&e.target!==btn)document.body.classList.remove("rightbar-open");
		});
	};
	document.addEventListener("DOMContentLoaded",async()=>{
		await load("site-header","partials/header.html");
		await load("site-leftbar","partials/leftbar.html");
		await load("site-rightbar","partials/rightbar.html");
		inject();
		wire();
	});
})();
