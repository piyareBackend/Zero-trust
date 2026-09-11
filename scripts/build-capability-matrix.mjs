import fs from 'node:fs';
import { CATALOG } from '../data/catalog-combined.mjs';

const exact = (names) => new Set(names.map(x => x.toLowerCase()));
const supported = {
  text: exact(['word counter','character counter','case converter (upper/lower/title)','text reverser','duplicate line remover','sort lines alphabetically','remove extra spaces','find and replace text','readability score checker','ascii art generator','morse code translator','pig latin translator','nato phonetic alphabet converter','letter counter','random word generator','random sentence generator','palindrome checker','anagram solver','anagram generator','word frequency counter','invisible character remover','whitespace remover','line break remover','line break adder','bionic reading converter','text repeater','sentence counter','paragraph counter','vowel/consonant counter']),
  security: exact(['password generator','password strength checker','sha1 hash generator','sha256 hash generator','sha512 hash generator','base64 encode','base64 decode','url encode','url decode','jwt decoder','html entity encoder/decoder','rot13 encoder/decoder','xor cipher tool','uuid/guid generator','random string generator','aes text encrypt/decrypt']),
  calculator: exact(['percentage calculator','emi calculator','gst calculator','compound interest calculator','simple interest calculator','discount calculator','fuel cost calculator','mileage calculator','mortgage calculator','break-even point calculator','roi calculator','profit margin calculator','markup calculator','random number generator','dice roller','coin flip tool']),
  unit: exact(['length converter','weight/mass converter','temperature converter','area converter','volume converter','speed converter','data storage converter (kb/mb/gb/tb)']),
  color: exact(['hex to rgb converter','rgb to hex converter','random color generator','color contrast checker (wcag)']),
  data: exact(['json to csv converter','csv to json converter','json formatter','json minifier','json validator','json converter']),
  developer: exact(['json formatter','json validator','json minifier','regex tester','slug generator','timestamp/epoch converter','http status code lookup','markdown to html','html to markdown','robots.txt generator','meta tag generator','url encode','url decode','base64 encode','base64 decode']),
  random: exact(['random name generator','random emoji generator','random country picker','magic 8-ball','random date generator']),
  network: exact(['subnet calculator','cidr calculator','user-agent lookup','http status code checker']),
  image: exact(['crop image','rotate image','flip image','add watermark to image','circle crop for profile picture','rounded corner image tool','image border adder','image flip vertical/horizontal','blur/pixelate tool','image format detector','social media image size guide/resizer','image dpi changer','image compressor by target size','reduce image quality selector','resize image (pixels)','compress jpg','compress png','compress webp']),
  social: exact(['hashtag generator','instagram bio generator','youtube title/tag generator','caption generator','emoji picker/finder'])
};
const pdfImplemented=/^(pdf page counter|merge pdf|split pdf|rotate pdf|crop pdf|add watermark to pdf|add page numbers to pdf|add pdf password|remove pdf password|reorder pdf pages|delete pdf pages|extract pdf pages|pdf to single images \(per page\)|edit pdf metadata|flatten pdf|grayscale pdf converter|scale\/resize pdf pages|n-up pdf \(multiple pages per sheet\)|pdf bookmark editor|pdf to text \(ocr\)|pdf table extractor|unlock pdf permissions|pdf header\/footer editor|combine images into one pdf|pdf to pdf\/a converter|reduce pdf file size)$/i;
const artifactEngines=new Set(['image','pdf','document','audio','video','qr']);
function classify(t){
  const name=t.name.toLowerCase();
  if(t.phase===2)return{status:'REAL_EXTERNAL',runtime:'provider/server',dependency:'external service or provider',reason:'Phase-2 catalog capability; requires network/provider processing.'};
  if(t.engine==='audio'||t.engine==='video')return{status:'UNSUPPORTED',runtime:'none',dependency:'media codec',reason:'No bundled browser codec is present; pass-through conversion is forbidden.'};
  if(t.engine==='qr')return{status:'REAL_EXTERNAL',runtime:'browser + CDN dependency',dependency:'qrcode package from CDN',reason:'Real QR generation, but current runtime loads the encoder from a network CDN.'};
  if(t.engine==='pdf')return pdfImplemented.test(name)?{status:'REAL_EXTERNAL',runtime:'browser + PDF libraries',dependency:'pdf-lib/pdfjs-dist CDN',reason:'Exact PDF operation exists, but current parser/codec dependencies are network-loaded.'}:{status:'UNSUPPORTED',runtime:'none',dependency:'PDF library/model',reason:'No exact implementation is exposed for this PDF operation.'};
  if(t.engine==='document')return /\bto\s+(txt|rtf|html|csv|markdown)\b/i.test(name)?{status:'REAL_LOCAL',runtime:'browser Blob/Text APIs',dependency:'none',reason:'Exact text-oriented conversion is implemented locally.'}:{status:'UNSUPPORTED',runtime:'none',dependency:'document format codec',reason:'Requested document conversion is not supported by the bundled local codec.'};
  if(t.engine==='image')return supported.image.has(name)?{status:'REAL_LOCAL',runtime:'Canvas/Image APIs',dependency:'none',reason:'Exact local image operation is implemented.'}:{status:'UNSUPPORTED',runtime:'none',dependency:'specialized image codec/model',reason:'No exact semantic implementation is exposed; generic canvas processing would be misleading.'};
  if(t.engine==='social')return supported.social.has(name)?{status:'PARTIAL',runtime:'browser JavaScript',dependency:'none',reason:'Template/heuristic generation only; not image understanding or platform API intelligence.'}:{status:'UNSUPPORTED',runtime:'none',dependency:'specialized social provider',reason:'No exact operation is exposed.'};
  if(supported[t.engine]?.has(name))return{status:'REAL_LOCAL',runtime:'browser JavaScript/Web Crypto',dependency:'none',reason:'Exact operation is implemented locally.'};
  return{status:'UNSUPPORTED',runtime:'none',dependency:'specialized implementation',reason:'No exact operation mapping exists in the free runtime.'};
}
const matrix=CATALOG.map(t=>{const c=classify(t);return{id:t.slug,name:t.name,category:t.categoryName||t.category,phase:t.phase,engine:t.engine||'text',promisedInput:'See tool page input contract',processingMethod:c.runtime,dependency:c.dependency,localFree:c.status==='REAL_LOCAL',externalRequired:c.status==='REAL_EXTERNAL',implemented:['REAL_LOCAL','REAL_EXTERNAL','PARTIAL'].includes(c.status),tested:false,artifactTested:artifactEngines.has(t.engine),status:c.status,reason:c.reason};});
const counts=Object.fromEntries([...new Set(matrix.map(x=>x.status))].map(s=>[s,matrix.filter(x=>x.status===s).length]));
const out={generatedAt:new Date().toISOString(),total:matrix.length,counts,tools:matrix};
fs.mkdirSync('reports',{recursive:true});fs.writeFileSync('reports/tool-capability-matrix.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({total:out.total,counts},null,2));
if(out.total!==1594)process.exit(1);
if(matrix.some(x=>!new Set(['REAL_LOCAL','REAL_EXTERNAL','PARTIAL','UNSUPPORTED','DISABLED']).has(x.status)))process.exit(1);
