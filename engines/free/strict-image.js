import { mountRealTool } from './real-tools.js';
import { mount as mountIndividual } from './individual-tools.js';
const exact=new Set(['resize image (pixels)','compress jpg','compress png','compress webp','rotate image','flip image','add watermark to image','circle crop for profile picture','image border adder','image flip vertical/horizontal']);
const converters=/^(jpg|png|webp|gif|bmp|svg) to (jpg|png|webp) converter$/i;
export async function mount(slug){
 let tools=window.ZT_TOOLS;
 if(!tools){const base=location.pathname.startsWith('/Zero-trust/')?'/Zero-trust/':'/';tools=await fetch(base+'data/tools-index.json',{cache:'force-cache'}).then(r=>r.json());window.ZT_TOOLS=tools}
 const meta=(tools||[]).find(x=>x.slug===slug),name=meta?.name||slug.replace(/-/g,' ');
 if(exact.has(name.toLowerCase())||converters.test(name))return mountRealTool(slug);
 return mountIndividual(slug);
}
