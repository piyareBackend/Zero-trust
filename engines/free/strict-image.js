import { mountRealTool } from './real-tools.js';

const exact=new Set([
  'resize image (pixels)','compress jpg','compress png','compress webp',
  'rotate image','flip image','add watermark to image','circle crop for profile picture','image border adder','image flip vertical/horizontal'
]);
const converters=/^(jpg|png|webp|gif|bmp|svg) to (jpg|png|webp) converter$/i;
export async function mount(slug){
  let tools=window.ZT_TOOLS;
  if(!tools){const base=location.pathname.startsWith('/Zero-trust/')?'/Zero-trust/':'/';tools=await fetch(base+'data/tools-index.json').then(r=>r.json());window.ZT_TOOLS=tools}
  const meta=(tools||[]).find(x=>x.slug===slug);const name=meta?.name||slug.replace(/-/g,' ');
  if(exact.has(name.toLowerCase())||converters.test(name))return mountRealTool(slug);
  const app=document.querySelector('#toolApp');
  if(app)app.innerHTML=`<div class="output error"><strong>Unavailable locally</strong><p>${name} is not exposed as a generic image transform. A specialized codec/model is required, so this tool is disabled instead of returning a misleading result.</p></div>`;
}
