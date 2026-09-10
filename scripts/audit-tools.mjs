import { CATALOG } from '../data/catalog-combined.mjs';

const PASS_THROUGH = /return\s+s\b|r\s*=\s*s\s*;|Result\s*=\s*\$\{a\+b\}/;
const localPatterns = [
  ['text','word counter|character counter|letter counter|sentence counter|paragraph counter|vowel|reverse|upper|lower|title|case converter|duplicate|sort|extra space|whitespace|line break|find and replace|slug|palindrome|anagram|frequency|morse|pig latin|nato|repeater|bionic|ascii art|binary|ascii to text|hex|base64|url encode|url decode|rot13|html entity|remove invisible|random word|random sentence'],
  ['security','password|random string|token|uuid|sha1|sha256|sha512|hash generator|base64|url encode|url decode|rot13|xor|aes|strength|jwt decoder|html entity'],
  ['calculator','percentage|discount|gst|tax|simple interest|compound interest|emi|mortgage|ratio|roi|profit margin|markup|break-even|fuel cost|mileage|dice|coin|random number'],
  ['unit','length converter|weight|mass converter|temperature converter|area converter|volume converter|speed converter|data storage converter'],
  ['color','hex to rgb|rgb to hex|random color|contrast'],
  ['data','json to csv|csv to json|json formatter|json minifier|json validator|json converter|base64'],
  ['developer','json|regex tester|slug|timestamp|epoch|http status|markdown to html|html to markdown|robots|meta tag'],
  ['seo','keyword density|readability|canonical|open graph|schema|serp'],
  ['network','cidr|subnet|user-agent|http status'],
  ['random','name|emoji|country|8-ball|date'],
  ['qr','qr code generator'],
  ['image','image'],
];
const providers = [/audio/i,/video/i,/\.pdf/i,/ocr/i,/background/i,/watermark/i,/exif/i,/upscal/i,/favicon fetch/i,/screenshot/i,/dns/i,/mx record/i,/whois/i,/port checker/i,/website speed/i,/broken link/i,/backlink/i,/plagiarism/i,/keyword position/i,/username availability/i,/youtube thumbnail downloader/i];
const hasPattern=(engine,name)=>localPatterns.some(([e,p])=>e===engine&&new RegExp(p,'i').test(name));
const rows=CATALOG.map(t=>{
  const name=t.name;
  let status='unsupported', reason='No concrete operation mapping';
  if(providers.some(r=>r.test(name))) { status='provider-or-specialized'; reason='Requires a specialized decoder/model or network/provider operation; must not be presented as generic local processing'; }
  else if(hasPattern(t.engine||'text',name)) { status='mapped'; reason='Concrete runtime family mapping exists'; }
  else if(t.engine==='document') { status='document-specialized'; reason='Document engine requires exact format capability validation'; }
  else if(t.engine==='pdf') { status='pdf-specialized'; reason='PDF engine requires artifact validation'; }
  return {...t,status,reason};
});
const counts=rows.reduce((m,r)=>(m[r.status]=(m[r.status]||0)+1,m),{});
console.log(JSON.stringify({total:rows.length,counts,unsupported:rows.filter(r=>r.status==='unsupported').map(r=>({slug:r.slug,name:r.name,engine:r.engine})),specialized:rows.filter(r=>r.status==='provider-or-specialized').map(r=>({slug:r.slug,name:r.name,engine:r.engine}))},null,2));
if(CATALOG.length!==1594) throw new Error(`Expected 1594 unique routes, found ${CATALOG.length}`);
if(rows.some(r=>PASS_THROUGH.test(r.reason))) throw new Error('Audit report contains pass-through marker');
