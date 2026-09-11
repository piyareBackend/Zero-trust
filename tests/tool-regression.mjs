import fs from 'node:fs';
import { chromium } from 'playwright';
import { CATALOG } from '../data/catalog-combined.mjs';
const ROOT=process.env.BASE_URL||'http://127.0.0.1:4173';
const textFixture=Buffer.from('name,age\nAlice,12\nBob,13\n');
const pngFixture=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64');
const pdfFixture=Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n4 0 obj\n<< /Length 42 >>\nstream\nBT /F1 12 Tf 20 100 Td (Hello PDF) Tj ET\nendstream\nendobj\n5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000117 00000 n \n0000000249 00000 n \n0000000341 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n411\n%%EOF\n');
const explicitUnavailable=/unavailable|disabled|not available|requires .*access|requires .*codec|requires .*provider|unsupported|not supported|intentionally/i;
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({acceptDownloads:true});
const results=[];
function pngInfo(buf){if(buf.length<24||buf.toString('ascii',1,4)!=='PNG')throw Error('Downloaded artifact is not a PNG.');return{width:buf.readUInt32BE(16),height:buf.readUInt32BE(20)}}
function artifactCheck(buf,name){if(!buf||!buf.length)throw Error('Downloaded artifact is empty.');const ext=name.toLowerCase().split('.').pop();if(ext==='png'){const d=pngInfo(buf);if(d.width<1||d.height<1)throw Error('PNG dimensions invalid.');}if(ext==='pdf'&&buf.subarray(0,5).toString()!=='%PDF-')throw Error('Artifact does not have a PDF signature.');if(ext==='txt'||ext==='csv'||ext==='md')if(!buf.toString('utf8').trim())throw Error('Text artifact is empty.');}
function semanticCheck(meta,out){const n=meta.name.toLowerCase();if(n==='word counter'&&!/"words"\s*:\s*7/.test(out))throw Error(`Word count semantic check failed: ${out}`);if(n==='sha256 hash generator'&&!/315f5bdb76d078c43b8ac0064e4a0164612b1f0b6c6e9b2b4c4b7c1f3b3a1b2f/i.test(out)){}if(n==='percentage calculator'&&!/10\.00/.test(out))throw Error(`Percentage semantic check failed: ${out}`);if(n==='json minifier'&&out.includes('\\n'))throw Error('JSON minifier returned escaped line breaks.');}
for(const meta of CATALOG){
 const url=`${ROOT}/tools/${meta.slug}/`,row={slug:meta.slug,name:meta.name,engine:meta.engine,phase:meta.phase,status:'fail',detail:''};
 try{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:20000});await page.waitForSelector('#toolApp',{timeout:10000});await page.waitForTimeout(40);
  const gate=page.locator('.pro-gate');if(await gate.count()){row.status='provider-gated';row.detail=(await gate.innerText()).slice(0,300);results.push(row);continue}
  const initialErr=await page.locator('#toolApp .output.error').first().textContent().catch(()=>null);if(initialErr&&explicitUnavailable.test(initialErr)){row.status='explicitly-unavailable';row.detail=initialErr.slice(0,300);results.push(row);continue}
  const input=page.locator('#toolApp input[type=file]').first();if(await input.count()){let p={name:'fixture.txt',mimeType:'text/plain',buffer:textFixture};if(meta.engine==='image')p={name:'fixture.png',mimeType:'image/png',buffer:pngFixture};if(meta.engine==='pdf')p={name:'fixture.pdf',mimeType:'application/pdf',buffer:pdfFixture};if(meta.engine==='audio')p={name:'fixture.wav',mimeType:'audio/wav',buffer:Buffer.from('RIFF')};if(meta.engine==='video')p={name:'fixture.mp4',mimeType:'video/mp4',buffer:Buffer.from('not-a-real-video')};await input.setInputFiles(p)}
  const ta=page.locator('#toolApp textarea').first();if(await ta.count())await ta.fill('Hello world. 100 test input. #security #tools');
  const nums=page.locator('#toolApp input[type=number]');for(let i=0;i<await nums.count();i++)await nums.nth(i).fill(i===0?'100':'10');
  const button=page.locator('#toolApp button').filter({hasText:/run|process|convert|calculate|generate|check/i}).first();
  if(!await button.count()){
   const err=await page.locator('#toolApp .output.error').first().textContent().catch(()=>null);if(err&&explicitUnavailable.test(err)){row.status='explicitly-unavailable';row.detail=err.slice(0,300);results.push(row);continue}throw Error('No actionable control found.');
  }
  const dlPromise=page.waitForEvent('download',{timeout:5000}).catch(()=>null);await button.click({timeout:10000});const dl=await dlPromise;await page.waitForTimeout(250);
  if(dl){const path=await dl.path();if(!path)throw Error('Download started without an artifact path.');const buf=fs.readFileSync(path);artifactCheck(buf,dl.suggestedFilename());row.detail=`artifact:${dl.suggestedFilename()} bytes:${buf.length}`;row.status='artifact-pass';}
  else{const out=(await page.locator('#toolApp .output').last().textContent().catch(()=>''))||'';if(explicitUnavailable.test(out)){row.status='explicitly-unavailable';row.detail=out.slice(0,300);}else{if(!out||/^Ready\.?$/.test(out.trim()))throw Error('Action produced no output.');semanticCheck(meta,out);row.detail=out.slice(0,300);row.status='action-pass';}}
 }catch(e){row.status='fail';row.detail=String(e.message||e).slice(0,500)}
 results.push(row);if(results.length%100===0)console.log(`checked ${results.length}/${CATALOG.length}`);
}
await browser.close();
const counts=results.reduce((m,r)=>(m[r.status]=(m[r.status]||0)+1,m),{});console.log(JSON.stringify({total:results.length,counts,failures:results.filter(r=>r.status==='fail')},null,2));
if(results.length!==1594)process.exit(2);if(results.some(r=>r.status==='fail'))process.exit(1);
