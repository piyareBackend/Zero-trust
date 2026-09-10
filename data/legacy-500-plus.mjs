// Recovery of the pre-1009 500+ registry.
// The old build contained 200 named routes plus 400 generated family routes.
// Keep these IDs alive so historical links do not disappear.
import { LEGACY_TOOLS } from './legacy-tools.mjs';

const families={
  pdf:{ops:['merge','split','extract','rotate','crop','scale','resize','compress','inspect','report','preview','watermark','stamp','number','label','metadata','text','image','page','document','bookmark','outline','security','permission','form','annotation','checksum','optimize','convert','export','import','compare','audit','cleanup','flatten','reorder','reverse','duplicate','insert','delete','alternate','interleave','append','prepend','combine','search','find','count','dimensions','orientation','version','encryption','web'],mods:['Quick','Batch','Smart','Advanced','Professional'],count:220},
  image:{ops:['compress','resize','crop','rotate','flip','grayscale','brightness','contrast','sharpen','blur','pixelate','convert','optimize','metadata','dimensions','dpi','palette','background','border','padding','mirror','thumbnail','sprite','contact-sheet','compare'],mods:['Quick','Batch','Smart','Advanced'],count:48},
  text:{ops:['count','sort','reverse','deduplicate','normalize','clean','extract','replace','compare','case','slug','wrap','trim','split','join','frequency','lines','paragraphs','sentences','reading-time','markdown','html','json','csv','quote'],mods:['Quick','Batch','Smart','Advanced'],count:38},
  developer:{ops:['encode','decode','format','minify','validate','escape','unescape','hash','uuid','timestamp','regex','json','url','base64','hex','binary','csv','xml','sql','jwt'],mods:['Quick','Batch','Smart','Advanced'],count:30},
  security:{ops:['password','random','hash','checksum','token','uuid','secret','entropy','validate','inspect','redact','mask','sanitize','encode'],mods:['Quick','Batch','Advanced','Private'],count:24},
  qr:{ops:['url','text','email','phone','sms','wifi','vcard','calendar','location','bitcoin','event','payment','contact','batch'],mods:['Quick','Styled','Batch','Printable'],count:20},
  calculator:{ops:['percentage','ratio','average','discount','tax','gst','emi','loan','interest','age','date','unit','time','speed','length','weight','temperature','data','finance','geometry'],mods:['Basic','Advanced'],count:20}
};
const extra=[];const seen=new Set(LEGACY_TOOLS.map(t=>t.slug));
for(const [category,spec] of Object.entries(families)){
  let i=0;
  for(const op of spec.ops){
    for(const mod of spec.mods){
      if(i>=spec.count)break;
      const suffix=mod.toLowerCase().replace(/[^a-z0-9]+/g,'-');
      const slug=`${category}-${op}-${suffix}`;
      if(!seen.has(slug)){seen.add(slug);const prefix=category==='pdf'?'PDF ':category==='image'?'Image ':'';extra.push({slug,name:`${mod} ${op.replace(/-/g,' ')} ${prefix}`.replace(/\s+/g,' ').trim().replace(/^./,c=>c.toUpperCase()),category,categoryName:category==='pdf'?'PDF Utility Tools':category==='image'?'Image Editing & Utility Tools':category==='qr'?'QR & Barcode Tools':category==='security'?'Security & Crypto Tools':category==='developer'?'Developer Tools':category==='text'?'Text Utility Tools':'Calculators (incl. India Finance)',phase:1,engine:category});}
      i++;
    }
    if(i>=spec.count)break;
  }
  while(i<spec.count){
    const op=spec.ops[i%spec.ops.length],n=Math.floor(i/spec.ops.length)+1,slug=`${category}-${op}-${n}`;
    if(!seen.has(slug)){seen.add(slug);extra.push({slug,name:`${category.toUpperCase()} ${op.replace(/-/g,' ')} ${n}`,category,categoryName:category==='pdf'?'PDF Utility Tools':category==='image'?'Image Editing & Utility Tools':category==='qr'?'QR & Barcode Tools':category==='security'?'Security & Crypto Tools':category==='developer'?'Developer Tools':category==='text'?'Text Utility Tools':'Calculators (incl. India Finance)',phase:1,engine:category});}
    i++;
  }
}

export const LEGACY_500_PLUS=[...LEGACY_TOOLS,...extra];
export const LEGACY_NAMED_COUNT=LEGACY_TOOLS.length;
export const LEGACY_GENERATED_COUNT=extra.length;
if(LEGACY_NAMED_COUNT!==200)throw new Error(`Historical named registry changed: ${LEGACY_NAMED_COUNT}`);
if(LEGACY_GENERATED_COUNT!==400)throw new Error(`Historical generated registry changed: ${LEGACY_GENERATED_COUNT}`);
if(new Set(LEGACY_500_PLUS.map(t=>t.slug)).size!==LEGACY_500_PLUS.length)throw new Error('Historical 500+ registry contains duplicate slugs');
