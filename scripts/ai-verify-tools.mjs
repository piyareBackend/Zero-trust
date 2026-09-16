#!/usr/bin/env node
import { chromium } from 'playwright';

const BASE = process.env.LIVE_URL || process.env.AI_VERIFY_BASE_URL || 'https://zero-trust.sadab-notes-backup.workers.dev';
const samples = [
  ['Crypto','sha256-hash-generator', async p=>{const i=p.locator('input,textarea').first();await i.fill('hello');await p.locator('button,.btn').first().click();return /2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824/i.test(await p.locator('body').innerText())}],
  ['Crypto','base64-encode', async p=>{const i=p.locator('textarea,input').first();await i.fill('Hello');await p.locator('button,.btn').first().click();return (await p.locator('body').innerText()).includes('SGVsbG8=')}],
  ['Crypto','password-generator', async p=>{await p.locator('button,.btn').first().click();return (await p.locator('body').innerText()).length>0}],
  ['Calculators','sip-calculator', async p=>{await p.locator('button,.btn').first().click();return /[₹\d]/.test(await p.locator('body').innerText())}],
  ['Calculators','emi-calculator', async p=>{await p.locator('button,.btn').first().click();return /[₹\d]/.test(await p.locator('body').innerText())}],
  ['Calculators','compound-interest-calculator', async p=>{await p.locator('button,.btn').first().click();return /[\d₹]/.test(await p.locator('body').innerText())}],
  ['Units','length-converter', async p=>{const ins=p.locator('input');if(await ins.count())await ins.first().fill('1');await p.locator('button,.btn').first().click();return /100|cm|meter/i.test(await p.locator('body').innerText())}],
  ['Units','weight-mass-converter', async p=>{const ins=p.locator('input');if(await ins.count())await ins.first().fill('1');await p.locator('button,.btn').first().click();return /1000|gram|kg/i.test(await p.locator('body').innerText())}],
  ['Units','temperature-converter', async p=>{const ins=p.locator('input');if(await ins.count())await ins.first().fill('0');await p.locator('button,.btn').first().click();return /32|fahrenheit/i.test(await p.locator('body').innerText())}],
  ['India Validators','pan-validator', async p=>{await p.locator('input').first().fill('ABCDE1234F');await p.locator('button,.btn').first().click();return /valid/i.test(await p.locator('body').innerText())}],
  ['India Validators','aadhaar-validator', async p=>{await p.locator('input').first().fill('236323632363');await p.locator('button,.btn').first().click();return !/Tool unavailable/i.test(await p.locator('body').innerText())}],
  ['India Validators','gstin-validator', async p=>{await p.locator('input').first().fill('27AAPFU0939F1ZV');await p.locator('button,.btn').first().click();return !/Tool unavailable/i.test(await p.locator('body').innerText())}],
  ['Text & Data','json-to-csv', async p=>{const i=p.locator('textarea,input').first();await i.fill('{"name":"Ada","age":10}');await p.locator('button,.btn').first().click();return /name.*age|Ada/i.test(await p.locator('body').innerText())}],
  ['Text & Data','camel-case-converter', async p=>{await p.locator('textarea,input').first().fill('hello world');await p.locator('button,.btn').first().click();return /helloWorld/.test(await p.locator('body').innerText())}],
  ['Text & Data','word-count', async p=>{await p.locator('textarea,input').first().fill('one two three');return /3/.test(await p.locator('body').innerText())}],
  ['Color & Network','hex-to-rgb', async p=>{await p.locator('input').first().fill('#ff0000');await p.locator('button,.btn').first().click();return /255.*0.*0/.test(await p.locator('body').innerText())}],
  ['Color & Network','subnet-calculator', async p=>{await p.locator('input').first().fill('192.168.1.42');const ins=p.locator('input');if(await ins.count()>1)await ins.nth(1).fill('24');await p.locator('button,.btn').first().click();return /192\.168\.1\.0|broadcastIP|255\.255\.255\.0/.test(await p.locator('body').innerText())}],
  ['Image & PDF','jpg-to-png-converter', async p=>{return /choose|upload|image|convert/i.test(await p.locator('body').innerText())}],
  ['Image & PDF','merge-pdf', async p=>{return /pdf|upload|choose|merge/i.test(await p.locator('body').innerText())}],
];

const bad = /Tool unavailable|generic error|engine .* failed|module .* failed|Unhandled|Cannot find module/i;
const results=[];let browser;
try { browser=await chromium.launch({headless:true}); } catch(e) { console.error('Playwright launch failed:',e.message); process.exit(2); }
for(const [category,slug,exercise] of samples){const url=`${BASE.replace(/\/$/,'')}/tools/${slug}/`;const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});let ok=false,error='';try{const r=await page.goto(url,{waitUntil:'networkidle',timeout:30000});if(!r||r.status()!==200)throw Error(`HTTP ${r?.status()??'no response'}`);await page.locator('#toolApp').waitFor({state:'visible',timeout:15000});await page.waitForTimeout(500);if(bad.test(await page.locator('body').innerText()))throw Error('Unavailable/error placeholder detected');ok=await exercise(page);if(!ok)throw Error('Sample input did not produce expected real output');if(errors.length)throw Error(`Console exception/error: ${errors.join(' | ')}`)}catch(e){error=e.message}results.push({category,slug,url,ok,error});await page.close()}
await browser.close();
console.log('\n=== ZERO TRUST AI SMOKE TEST ===');console.log(`Base: ${BASE}`);console.log(`Total routes tested: ${results.length}`);console.log(`Passed: ${results.filter(x=>x.ok).length}`);console.log(`Failed: ${results.filter(x=>!x.ok).length}`);for(const r of results.filter(x=>!x.ok))console.log(`FAIL [${r.category}] ${r.url}\n  ${r.error}`);if(results.some(x=>!x.ok))process.exitCode=1;
