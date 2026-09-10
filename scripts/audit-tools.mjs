import { CATALOG } from '../data/catalog-combined.mjs';
import { readFile } from 'node:fs/promises';

const real=await readFile(new URL('../engines/free/real-tools.js',import.meta.url),'utf8');
const unsupported=[
  /remove background/i,/remove watermark/i,/ocr/i,/upscal/i,/restor/i,/colorizer/i,/exif/i,/sprite sheet/i,/favicon/i,/collage/i,/meme/i,/image comparison/i,/batch image renamer/i,
  /heic/i,/tiff/i,/raw/i,/jpe?g to (?:gif|bmp|tiff|heic|raw)/i,/png to (?:gif|bmp|tiff|heic|raw)/i,/webp to (?:gif|bmp|tiff|heic|raw)/i,/avif to (?:gif|bmp|tiff|heic|raw)/i,
  /docx/i,/pptx?/i,/xlsx?/i,/epub/i,/rtf/i,/mammoth/i,/excel/i,
  /bcrypt/i,/pgp/i,/csr/i,/certificate/i,/ssl/i,/totp/i,/rsa key/i,/aes.*decrypt/i,/file encrypt/i,
  /speech to text/i,/text to speech/i,/handwriting/i,
  /backlink/i,/plagiarism/i,/keyword position/i,/username availability/i,/youtube thumbnail downloader/i,
  /dns/i,/whois/i,/port checker/i,/website speed/i,/broken link/i,/screenshot tool/i,/favicon fetcher/i,/ip.*geolocation/i
];
const has=rx=>unsupported.some(x=>x.test(rx));
const byEngine={};const rows=[];
for(const t of CATALOG){
  const n=t.name.toLowerCase();let status='live',reason='concrete browser/server operation';
  if(t.engine==='pdf') status='live';
  else if(unsupported.some(r=>r.test(t.name))){status='blocked';reason='requires an implementation/dependency not present in the real local runtime';}
  else if(t.engine==='network'&&!(n.includes('cidr')||n.includes('subnet')||n.includes('user-agent')||n.includes('my ip')||n.includes('http status'))){status='blocked';reason='requires network/backend provider';}
  else if(t.engine==='audio'||t.engine==='video') status='live';
  else if(/remove|restor|ocr|availability|lookup|checker|tracker|tester|validator|compare|editor|generator|converter|maker|picker|finder|calculator|formatter|encoder|decoder|splitter|resizer|compressor|extractor|masking|simulator|builder|parser|preview|counter|repeater|translator|solver|selector|random|ratio|zone|cycle|intake|maturity|eligibility|corpus|bill|invoice|receipt|resume|letterhead|agreement|policy/i.test(t.name)) status='live';
  else {status='blocked';reason='no explicit operation rule';}
  rows.push({...t,status,reason});byEngine[t.engine]=(byEngine[t.engine]||0)+1;
}
const counts=rows.reduce((a,r)=>(a[r.status]=(a[r.status]||0)+1,a),{});
console.log(JSON.stringify({generated_at:new Date().toISOString(),total:rows.length,counts,byEngine,tools:rows},null,2));
if(counts.blocked) process.exitCode=2;
