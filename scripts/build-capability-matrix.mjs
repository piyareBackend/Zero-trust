import fs from 'node:fs';
import { CATALOG } from '../data/catalog-combined.mjs';
const exact=n=>new Set(n.map(x=>x.toLowerCase()));
const local={
 text:exact(['word counter','character counter','case converter (upper/lower/title)','text reverser','duplicate line remover','sort lines alphabetically','remove extra spaces','find and replace text','ascii art generator','morse code translator','pig latin translator','nato phonetic alphabet converter','letter counter','random word generator','random sentence generator','palindrome checker','anagram solver','anagram generator','word frequency counter','invisible character remover','whitespace remover','line break remover','line break adder','bionic reading converter','text repeater','sentence counter','paragraph counter','vowel/consonant counter']),
 security:exact(['password generator','password strength checker','sha1 hash generator','sha256 hash generator','sha512 hash generator','base64 encode','base64 decode','url encode','url decode','jwt decoder','html entity encoder/decoder','rot13 encoder/decoder','xor cipher tool','uuid/guid generator','random string generator','aes text encrypt/decrypt']),
 calculator:exact(['percentage calculator','emi calculator','gst calculator','compound interest calculator','simple interest calculator','discount calculator','fuel cost calculator','mileage calculator','mortgage calculator','break-even point calculator','roi calculator','profit margin calculator','markup calculator','random number generator','dice roller','coin flip tool']),
 unit:exact(['length converter','weight/mass converter','temperature converter','area converter','volume converter','speed converter','data storage converter (kb/mb/gb/tb)']),
 color:exact(['hex to rgb converter','rgb to hex converter','random color generator','color contrast checker (wcag)']),
 data:exact(['json to csv converter','csv to json converter','json formatter','json minifier','json validator','json converter']),
 developer:exact(['json formatter','json validator','json minifier','regex tester','slug generator','timestamp/epoch converter','http status code lookup','markdown to html','html to markdown','robots.txt generator','meta tag generator','url encode','url decode','base64 encode','base64 decode']),
 random:exact(['random name generator','random emoji generator','random country picker','magic 8-ball','random date generator']),
 network:exact(['subnet calculator','cidr calculator','user-agent lookup','http status code checker']),
 image:exact(['resize image (pixels)','compress jpg','compress png','compress webp','rotate image','flip image','add watermark to image','circle crop for profile picture','image border adder','image flip vertical/horizontal']),
 social:exact(['hashtag generator','instagram bio generator','youtube title/tag generator','caption generator','emoji picker/finder'])
};
const pdfImplemented=/^(merge pdf|split pdf|rotate pdf|crop pdf|add watermark to pdf|add page numbers to pdf|remove pdf password|add pdf password|reorder pdf pages|delete pdf pages|extract pdf pages|pdf to single images \(per page\)|edit pdf metadata|flatten pdf|grayscale pdf converter|scale\/resize pdf pages|pdf page counter|combine images into one pdf|pdf header\/footer editor|pdf to text \(ocr\)|reduce pdf file size)$/i;
const artifactEngines=new Set(['image','pdf','document','audio','video','qr']);
function classify(t){
 const n=t.name.toLowerCase();
 if(t.phase===2)return{status:'REAL_EXTERNAL',runtime:'provider/server',dependency:'external service or provider',reason:'Phase-2 catalog capability; requires network/provider processing.'};
 if(t.engine==='audio'||t.engine==='video')return{status:'UNSUPPORTED',runtime:'none',dependency:'media codec',reason:'No bundled browser codec is present; pass-through conversion is forbidden.'};
 if(t.engine==='qr')return{status:'REAL_EXTERNAL',runtime:'browser + CDN dependency',dependency:'qrcode package from CDN',reason:'Real QR generation currently depends on a network-loaded encoder.'};
 if(t.engine==='pdf')return pdfImplemented.test(n)?{status:'REAL_EXTERNAL',runtime:'browser + PDF libraries',dependency:'pdf-lib/pdfjs-dist CDN',reason:'Exact PDF operation exists, but current parser/codec dependencies are network-loaded.'}:{status:'UNSUPPORTED',runtime:'none',dependency:'PDF library/model',reason:'No exact implementation is exposed for this PDF operation.'};
 if(t.engine==='document')return /\bto\s+(txt|rtf|html|csv|markdown)\b/i.test(n)?{status:'REAL_LOCAL',runtime:'browser Blob/Text APIs',dependency:'none',reason:'Exact text-oriented conversion is implemented locally.'}:{status:'UNSUPPORTED',runtime:'none',dependency:'document format codec',reason:'Requested document conversion is not supported by the bundled local codec.'};
 if(t.engine==='image'&&local.social.has(n))return{status:'PARTIAL',runtime:'browser JavaScript',dependency:'none',reason:'Heuristic/template social generation; no image understanding is claimed.'};
 if(t.engine==='image')return local.image.has(n)||/^(jpg|png|webp|gif|bmp|svg) to (jpg|png|webp) converter$/i.test(n)?{status:'REAL_LOCAL',runtime:'Canvas/Image APIs',dependency:'none',reason:'Exact local image operation is implemented.'}:{status:'UNSUPPORTED',runtime:'none',dependency:'specialized image codec/model',reason:'No exact semantic image implementation is exposed.'};
 if(local[t.engine]?.has(n))return{status:'REAL_LOCAL',runtime:'browser JavaScript/Web Crypto',dependency:'none',reason:'Exact operation is implemented locally.'};
 return{status:'UNSUPPORTED',runtime:'none',dependency:'specialized implementation',reason:'No exact operation mapping exists in the free runtime.'};
}
const matrix=CATALOG.map(t=>{const c=classify(t);return{id:t.slug,name:t.name,category:t.categoryName||t.category,phase:t.phase,engine:t.engine||'text',promisedInput:'See tool page input contract',processingMethod:c.runtime,dependency:c.dependency,localFree:c.status==='REAL_LOCAL',externalRequired:c.status==='REAL_EXTERNAL',implemented:['REAL_LOCAL','REAL_EXTERNAL','PARTIAL'].includes(c.status),tested:false,artifactTested:artifactEngines.has(t.engine),status:c.status,reason:c.reason};});
const counts=Object.fromEntries([...new Set(matrix.map(x=>x.status))].map(s=>[s,matrix.filter(x=>x.status===s).length]));
fs.mkdirSync('reports',{recursive:true});fs.writeFileSync('reports/tool-capability-matrix.json',JSON.stringify({generatedAt:new Date().toISOString(),total:matrix.length,counts,tools:matrix},null,2)+'\n');
console.log(JSON.stringify({total:matrix.length,counts},null,2));
if(matrix.length!==1594)process.exit(1);
