import { mount as mountPdf } from './pdf-universal.js';

const exact=/^(merge pdf|split pdf|rotate pdf|crop pdf|add watermark to pdf|add page numbers to pdf|remove pdf password|add pdf password|reorder pdf pages|delete pdf pages|extract pdf pages|pdf to single images \(per page\)|edit pdf metadata|flatten pdf|grayscale pdf converter|scale\/resize pdf pages|pdf page counter|combine images into one pdf|pdf header\/footer editor|pdf to text \(ocr\)|reduce pdf file size)$/i;
export async function mount(slug){
  let tools=window.ZT_TOOLS;
  if(!tools){const base=location.pathname.startsWith('/Zero-trust/')?'/Zero-trust/':'/';tools=await fetch(base+'data/tools-index.json').then(r=>r.json());window.ZT_TOOLS=tools}
  const meta=(tools||[]).find(x=>x.slug===slug);const name=meta?.name||slug.replace(/-/g,' ');
  if(exact.test(name))return mountPdf(slug);
  const app=document.querySelector('#toolApp');
  if(app)app.innerHTML=`<div class="output error"><strong>Unavailable</strong><p>${name} is not implemented exactly in the current browser PDF runtime. The tool is disabled rather than returning the input as a fake successful conversion.</p></div>`;
}
