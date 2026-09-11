const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const btn=(t,f)=>{const b=document.createElement('button');b.type='button';b.className='btn primary';b.textContent=t;b.onclick=f;return b};
const say=(o,x,ok=true)=>{o.className=`output ${ok?'success':'error'}`;o.innerHTML=`<pre>${esc(x)}</pre>`};
export async function mount(slug){
  const app=document.querySelector('#toolApp'); if(!app)return;
  const base=location.pathname.startsWith('/Zero-trust/')?'/Zero-trust/':'/';
  let tools=window.ZT_TOOLS;
  try{if(!tools)tools=await fetch(base+'data/tools-index.json').then(r=>r.json());window.ZT_TOOLS=tools}catch{}
  const meta=(tools||[]).find(x=>x.slug===slug)||{name:slug.replace(/-/g,' ')};
  const n=meta.name.toLowerCase();
  app.innerHTML='<div class="zt-card"><div class="zt-local">LOCAL-FIRST SOCIAL TEXT PROCESSING — no upload</div><div class="zt-input"></div><div class="zt-actions tool-actions"></div><div class="zt-output output">Enter text and run the exact generator.</div></div>';
  const input=app.querySelector('.zt-input'),actions=app.querySelector('.zt-actions'),out=app.querySelector('.zt-output');
  const t=document.createElement('textarea');t.placeholder=n.includes('hashtag')?'Enter a topic or caption…':'Enter your topic or context…';input.append(t);
  actions.append(btn('Generate',()=>{const s=t.value.trim();try{
    if(!s&&n.includes('hashtag'))throw Error('Enter a topic or caption.');
    let r;
    if(n.includes('hashtag')){const base=s.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean).slice(0,8);r=[...new Set(base.flatMap(w=>[w,`${w}tips`,`${w}ideas`,`${w}india`]))].slice(0,20).map(x=>'#'+x).join(' ')}
    else if(n.includes('instagram bio'))r=`${s||'Creator'} | Useful ideas\nNew posts weekly`;
    else if(n.includes('youtube title'))r=`${s||'Your Topic'} — Complete Guide\nHow to ${s||'Do It'} (Step by Step)`;
    else if(n.includes('caption'))r=`${s||'New post'} — save this for later.`;
    else if(n.includes('emoji'))r='😀 😎 🚀 ✨ 🎯 🔥 💡 ❤️ 👍';
    else throw Error(`No exact social operation is implemented for “${meta.name}”.`);
    say(out,r);
  }catch(e){say(out,e.message,false)}}));
}
