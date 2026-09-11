(()=>{
const base=location.pathname.startsWith('/Zero-trust/')?'/Zero-trust/':'/';
const slug=location.pathname.split('/').filter(Boolean).pop()||'';
const app=document.querySelector('#toolApp');
if(!app)return;
let started=false;
const run=async()=>{
 if(started)return;started=true;
 try{
  app.setAttribute('aria-busy','true');
  let tools=window.ZT_TOOLS;
  if(!tools){const r=await fetch(base+'data/tools-index.json',{cache:'force-cache'});if(r.ok)tools=await r.json();window.ZT_TOOLS=tools||[]}
  const meta=(tools||[]).find(x=>x.slug===slug);
  if(!meta)throw Error('Tool metadata unavailable');
  if(meta.phase===2){const gate=await fetch(`${base}api/tools/${encodeURIComponent(slug)}`,{credentials:'same-origin',cache:'no-store'});const gd=await gate.json().catch(()=>({}));if(!gate.ok||gd.allowed!==true){app.innerHTML=`<div class="output pro-gate"><strong>Pro service</strong><p>${gd.reason==='pro_required'?'This network service requires a server-verified Pro entitlement.':'This service is currently unavailable.'}</p><a class="btn primary" href="${base}pricing/">View plans</a></div>`;app.setAttribute('aria-busy','false');return}}
  const name=meta.name||'';let file;
  if(/hashtag generator|instagram bio generator|youtube title\/tag generator|caption generator|emoji picker\/finder/i.test(name))file='social-tools.js';
  else if(meta.engine==='image')file='strict-image.js';
  else if(meta.engine==='pdf')file='strict-pdf.js';
  else if(meta.engine==='document')file='document-converter.js';
  else if(meta.engine==='audio'||meta.engine==='video')file='media.js';
  else file='extended.js';
  const m=await import(`${base}engines/free/${file}?v=503`);if(!m||typeof m.mount!=='function')throw Error('Tool engine mount() missing');await m.mount(slug);app.setAttribute('aria-busy','false');
 }catch(e){console.error('[Zero Trust] engine',e);app.innerHTML='<div class="output error"><strong>Tool unavailable.</strong><br>'+String(e.message||e)+'</div>';app.setAttribute('aria-busy','false')}
};
const start=()=>{'requestIdleCallback' in window?window.requestIdleCallback(run,{timeout:120}):setTimeout(run,60)};
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();start()}},{rootMargin:'320px 0px'});io.observe(app)}else start();
})();
