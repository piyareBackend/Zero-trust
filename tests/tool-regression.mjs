import { chromium } from 'playwright';
import { CATALOG } from '../data/catalog-combined.mjs';

const ROOT=process.env.BASE_URL||'http://127.0.0.1:4173';
const textFixture=Buffer.from('name,age\nAlice,12\nBob,13\n');
const pngFixture=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64');
const pdfFixture=Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF');
const explicitUnavailable=/disabled|not available|requires .*access|requires .*codec|requires .*provider|unsupported|not supported|intentionally/i;
const fileEngine=new Set(['image','pdf','document','audio','video']);
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({acceptDownloads:true});
const results=[];
for(const meta of CATALOG){
  const url=`${ROOT}/tools/${meta.slug}/`;
  const row={slug:meta.slug,name:meta.name,engine:meta.engine,phase:meta.phase,status:'fail',detail:''};
  try{
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:20000});
    await page.waitForSelector('#toolApp',{timeout:10000});
    await page.waitForTimeout(50);
    const gate=await page.locator('.pro-gate').count();
    if(gate){row.status='provider-gated';row.detail=(await page.locator('.pro-gate').innerText()).slice(0,300);results.push(row);continue}
    const failure=await page.locator('.output.error').first().textContent().catch(()=>null);
    if(failure&&/Tool engine failed/i.test(failure))throw Error(failure);
    const input=page.locator('#toolApp input[type=file]').first();
    if(await input.count()){
      let payload={name:'fixture.txt',mimeType:'text/plain',buffer:textFixture};
      if(meta.engine==='image')payload={name:'fixture.png',mimeType:'image/png',buffer:pngFixture};
      if(meta.engine==='pdf')payload={name:'fixture.pdf',mimeType:'application/pdf',buffer:pdfFixture};
      if(meta.engine==='audio')payload={name:'fixture.wav',mimeType:'audio/wav',buffer:Buffer.from('RIFF0000WAVEfmt ')};
      if(meta.engine==='video')payload={name:'fixture.mp4',mimeType:'video/mp4',buffer:Buffer.from('not-a-real-video')};
      await input.setInputFiles(payload);
    }
    const ta=page.locator('#toolApp textarea').first();
    if(await ta.count())await ta.fill('Hello world. 100 test input. #security #tools');
    const nums=page.locator('#toolApp input[type=number]');
    for(let i=0;i<await nums.count();i++)await nums.nth(i).fill(i===0?'100':'10');
    const button=page.locator('#toolApp button').filter({hasText:/run|process|convert|calculate|generate|check/i}).first();
    if(await button.count()){
      let download=null;const dlPromise=page.waitForEvent('download',{timeout:5000}).catch(()=>null);
      await button.click({timeout:10000});download=await dlPromise;
      await page.waitForTimeout(300);
      if(download){const path=await download.path();if(!path)throw Error('Download started without an artifact path.');row.detail=`download:${download.suggestedFilename()}`;row.status='pass';}
      else{
        const out=(await page.locator('#toolApp .output').last().textContent().catch(()=>''))||'';
        if(!out||/^Ready\.?$/.test(out.trim()))throw Error('Action produced no output.');
        if(/No (?:exact|real).*implemented|returning the input|Tool engine failed/i.test(out)&&!explicitUnavailable.test(out))throw Error(`Placeholder/failure output: ${out}`);
        row.detail=out.slice(0,300);row.status=explicitUnavailable.test(out)?'explicitly-unavailable':'pass';
      }
    }else if(await page.locator('#toolApp .pro-gate').count())row.status='provider-gated';
    else throw Error('No actionable control found.');
  }catch(e){row.status='fail';row.detail=String(e.message||e).slice(0,500)}
  results.push(row);
  if(results.length%100===0)console.log(`checked ${results.length}/${CATALOG.length}`);
}
await browser.close();
const counts=results.reduce((m,r)=>(m[r.status]=(m[r.status]||0)+1,m),{});
console.log(JSON.stringify({total:results.length,counts,failures:results.filter(r=>r.status==='fail')},null,2));
if(results.length!==1594)process.exit(2);
if(results.some(r=>r.status==='fail'))process.exit(1);
