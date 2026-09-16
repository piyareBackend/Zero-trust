import { chromium } from 'playwright';
const base=process.env.BASE_URL||'http://127.0.0.1:4173';
const cases=[
  ['merge-pdf','Merge PDF'],['image-compressor','Image compressor'],['qr-code-generator-url','QR generator'],['password-generator','Password generator'],['json-formatter','JSON formatter'],['sha256-hash-generator','SHA-256'],['base64-encode','Base64'],['length-converter','Unit converter']
];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
const failures=[];
for(const [slug,label] of cases){
  try{
    await page.goto(`${base}/tools/${slug}/`,{waitUntil:'networkidle',timeout:15000});
    await page.locator('#toolApp button, #toolApp input, #toolApp textarea, #toolApp select').first().waitFor({timeout:5000});
    if(slug==='json-formatter'){
      await page.locator('#ztInput').fill('{"b":2,"a":1}');await page.locator('#ztRun').click();const v=await page.locator('#ztOut').textContent();if(!v.includes('"a": 1'))throw Error('JSON output is not formatted');
    } else if(slug==='sha256-hash-generator'){
      await page.locator('#ztInput').fill('abc');await page.locator('#ztRun').click();const v=await page.locator('#ztOut').textContent();if(v.trim()!=='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')throw Error('SHA-256 mismatch');
    } else if(slug==='base64-encode'){
      await page.locator('#ztInput').fill('Zero Trust');await page.locator('#ztRun').click();const v=await page.locator('#ztOut').textContent();if(v.trim()!=='WmVybyBUcnVzdA==')throw Error('Base64 mismatch');
    } else if(slug==='password-generator'){
      await page.locator('#pwRun').click();const v=await page.locator('#pwOut').inputValue();if(v.length!==24)throw Error('Password length mismatch');
    } else if(slug==='length-converter'){
      await page.locator('#uVal').fill('1');await page.locator('#uFrom').selectOption('meter');await page.locator('#uTo').selectOption('centimeter');await page.locator('#uRun').click();const v=await page.locator('#uOut').textContent();if(!v.includes('100'))throw Error('Length conversion mismatch');
    } else if(slug==='image-compressor'){
      const data=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=100;c.height=100;const x=c.getContext('2d');x.fillStyle='red';x.fillRect(0,0,100,100);return new Promise(r=>c.toBlob(async b=>r([...new Uint8Array(await b.arrayBuffer())]),'image/png'))});
      await page.locator('#imgFile').setInputFiles({name:'sample.png',mimeType:'image/png',buffer:Buffer.from(data)});await page.locator('#imgRun').click();await page.locator('#imgOut').waitFor({state:'visible'});
    } else if(slug==='qr-code-generator-url'){
      const area=page.locator('#text');if(await area.count()){await area.fill('https://example.com');await page.locator('#run').click();await page.locator('#qrPreview canvas').waitFor({timeout:10000});}
    } else if(slug==='merge-pdf'){
      const f=page.locator('#file');if(await f.count()===0)throw Error('PDF file input missing');
    }
  }catch(e){failures.push(`${label}: ${e.message}`)}
}
await browser.close();
if(failures.length){console.error(failures.join('\n'));process.exit(1)}
console.log(`Priority smoke passed: ${cases.length}/${cases.length}`);
