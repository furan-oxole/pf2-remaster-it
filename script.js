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
	const norm=s=>(s||"").toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9\s_-]/g," ").replace(/\s+/g," ").trim();
	const uniq=a=>Array.from(new Set(a));
	const tokenize=s=>uniq(norm(s).split(" ").filter(Boolean));
	const loadIndex=async()=>{
		try{
			const r=await fetch("search-index.json",{cache:"no-store"});
			if(!r.ok)return [];
			const data=await r.json();
			if(!Array.isArray(data))return [];
			return data.map(x=>{
				const title=(x&&x.title)||"";
				const url=(x&&x.url)||"";
				const tags=Array.isArray(x&&x.tags)?x.tags:[];
				const tagsNorm=uniq(tags.map(t=>norm(t)).filter(Boolean));
				return {title,url,tagsNorm};
			}).filter(x=>x.title&&x.url);
		}catch(e){
			return [];
		}
	};
	const wireSearch=async()=>{
		const input=document.getElementById("search-input");
		const box=document.getElementById("search-results");
		if(!input||!box)return;
		const index=await loadIndex();
		const render=items=>{
			box.innerHTML="";
			if(!items.length)return;
			const ul=document.createElement("ul");
			ul.className="right-index-list";
			items.forEach(it=>{
				const li=document.createElement("li");
				const a=document.createElement("a");
				a.href=it.url;
				const st=document.createElement("strong");
				st.textContent=it.title;
				a.appendChild(st);
				li.appendChild(a);
				ul.appendChild(li);
			});
			box.appendChild(ul);
		};
		const scorePage=(p,qTokens)=>{
			let score=0;
			for(const qt of qTokens){
				if(qt.length<2)continue;
				let best=0;
				for(const tag of p.tagsNorm){
					if(tag===qt){best=2;break;}
					if(best<1&&(tag.startsWith(qt)||tag.includes(qt)))best=1;
				}
				score+=best;
			}
			return score;
		};
		const search=q=>{
			const qTokens=tokenize(q);
			if(!qTokens.length){box.innerHTML="";return;}
			const scored=index.map(p=>{
				const score=scorePage(p,qTokens);
				return {title:p.title,url:p.url,score};
			}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.title.localeCompare(b.title,"it"));
			render(scored.slice(0,30));
		};
		input.addEventListener("input",()=>search(input.value));
	};
	document.addEventListener("DOMContentLoaded",async()=>{
		await load("site-header","partials/header.html");
		await load("site-leftbar","partials/leftbar.html");
		await load("site-rightbar","partials/rightbar.html");
		inject();
		wire();
		await wireSearch();
	});
})();
