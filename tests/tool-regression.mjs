import fs from 'node:fs';
import { chromium } from 'playwright';
import { CATALOG } from '../data/catalog-combined.mjs';

const ROOT = process.env.BASE_URL || 'http://127.0.0.1:4173';
const WORKERS = Math.max(2, Math.min(4, Number(process.env.REGRESSION_WORKERS || 4)));
const TOOL_TIMEOUT = 15000;
const PAGE_TIMEOUT = 8000;
const ACTION_TIMEOUT = 12000;
const CONTEXT_BATCH = 40;
const textFixture = Buffer.from('name,age\nAlice,12\nBob,13\n');
const pngFixture = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
const pdfFixture = Buffer.from('JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUiBdIC9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCjw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL01lZGlhQm94IFswIDAgMzAwIDE0NF0gL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNSAwIFIgPj4gPj4gL0NvbnRlbnRzIDQgMCBSID4+CmVuZG9iago0IDAgb2JqCjw8IC9MZW5ndGggNDYgPj4Kc3RyZWFtCkJUIC9GMSAxMiBUZiAxMCAxMDAgVGQgKFplcm8gVHJ1c3QgVGVzdCkgVGo gRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNDEgMDAwMDAwIG4gCjAwMDAwMDAzMzcgMDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgNiAvUm9vdCAxIDAgUiA+PgpzdGFydHhyZWYKNDA3CiUlRU9GCg=='.replace(/\s/g, ''), 'base64');
const explicitUnavailable = /unavailable|disabled|not available|requires .*access|requires .*codec|requires .*provider|unsupported|not supported|intentionally/i;
const withTimeout = (p, ms, label) => Promise.race([p, new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms))]);

function artifactCheck(buf, name) {
  if (!buf?.length) throw Error('Downloaded artifact is empty.');
  const ext = name.toLowerCase().split('.').pop();
  if (ext === 'png') {
    if (buf.length < 24 || buf.toString('ascii', 1, 4) !== 'PNG') throw Error('Downloaded artifact is not a PNG.');
    if (buf.readUInt32BE(16) < 1 || buf.readUInt32BE(20) < 1) throw Error('PNG dimensions invalid.');
  }
  if (ext === 'pdf' && buf.subarray(0, 5).toString() !== '%PDF-') throw Error('Artifact does not have a PDF signature.');
  if (['txt', 'csv', 'md', 'html'].includes(ext) && !buf.toString('utf8').trim()) throw Error('Text artifact is empty.');
}

function semanticCheck(meta, out) {
  const n = meta.name.toLowerCase();
  if (n === 'word counter' && !/"words"\s*:\s*7/.test(out)) throw Error(`Word count semantic check failed: ${out}`);
  if (n === 'percentage calculator' && !/10(?:\.00)?/.test(out)) throw Error(`Percentage semantic check failed: ${out}`);
}

async function prepareInputs(page, meta) {
  const n = meta.name.toLowerCase();
  const input = page.locator('#toolApp input[type=file]').first();
  if (await input.count()) {
    let p = { name: 'fixture.txt', mimeType: 'text/plain', buffer: textFixture };
    if (meta.engine === 'image') p = { name: 'fixture.png', mimeType: 'image/png', buffer: pngFixture };
    if (meta.engine === 'pdf') p = { name: 'fixture.pdf', mimeType: 'application/pdf', buffer: pdfFixture };
    if (meta.engine === 'audio') p = { name: 'fixture.wav', mimeType: 'audio/wav', buffer: Buffer.from('RIFF') };
    if (meta.engine === 'video') p = { name: 'fixture.mp4', mimeType: 'video/mp4', buffer: Buffer.from('not-a-real-video') };
    await input.setInputFiles(p);
  }
  const ta = page.locator('#toolApp textarea').first();
  if (await ta.count()) await ta.fill(/json/.test(n) ? '{"name":"Alice","age":12,"items":[1,2]}' : 'Hello world. 100 test input. #security #tools');
  const nums = page.locator('#toolApp input[type=number]');
  for (let i = 0; i < await nums.count(); i++) await nums.nth(i).fill(i === 0 ? '100' : '10');
  const selects = page.locator('#toolApp select');
  for (let i = 0; i < await selects.count(); i++) {
    const options = selects.nth(i).locator('option');
    const count = await options.count();
    if (count > 1) {
      const value = await options.nth(i === 1 ? 1 : 0).getAttribute('value');
      if (value != null) await selects.nth(i).selectOption(value);
    }
  }
}

async function testTool(page, meta) {
  const row = { slug: meta.slug, name: meta.name, engine: meta.engine, phase: meta.phase, status: 'fail', detail: '' };
  try {
    await withTimeout(page.goto(`${ROOT}/tools/${meta.slug}/`, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT }), TOOL_TIMEOUT, 'page load');
    await page.waitForSelector('#toolApp', { timeout: PAGE_TIMEOUT });
    await page.waitForFunction(() => document.querySelector('#toolApp')?.getAttribute('aria-busy') !== 'true', { timeout: PAGE_TIMEOUT }).catch(() => {});
    const gate = page.locator('.pro-gate');
    if (await gate.count()) {
      row.status = 'provider-gated';
      row.detail = (await gate.innerText()).slice(0, 300);
      return row;
    }
    await prepareInputs(page, meta);
    const button = page.locator('#toolApp button').first();
    if (!await button.count()) throw Error('No actionable control found.');
    const before = (await page.locator('#toolApp .output').last().textContent().catch(() => '')) || '';
    const downloadPromise = page.waitForEvent('download', { timeout: ACTION_TIMEOUT }).then(async dl => {
      const path = await dl.path();
      if (!path) throw Error('Download started without an artifact path.');
      const buf = fs.readFileSync(path);
      artifactCheck(buf, dl.suggestedFilename());
      return { kind: 'artifact', detail: `artifact:${dl.suggestedFilename()} bytes:${buf.length}` };
    }).catch(() => null);
    const outputPromise = page.waitForFunction(previous => {
      const values = [...document.querySelectorAll('#toolApp .output')].map(el => el.textContent?.trim() || '');
      return values.some(value => value && value !== previous && value !== 'Ready.');
    }, before, { timeout: ACTION_TIMEOUT }).then(async () => {
      const out = (await page.locator('#toolApp .output').last().textContent().catch(() => '')) || '';
      if (explicitUnavailable.test(out)) throw Error(`Tool self-reported unavailable after action: ${out.slice(0, 300)}`);
      if (!out.trim() || /^Ready\.?$/.test(out.trim())) throw Error('Action produced no output.');
      semanticCheck(meta, out);
      return { kind: 'action', detail: out.slice(0, 300) };
    });
    await button.click({ timeout: ACTION_TIMEOUT });
    const result = await withTimeout(Promise.race([downloadPromise, outputPromise]), TOOL_TIMEOUT, 'tool action');
    if (!result) throw Error('Action produced no output.');
    row.status = result.kind === 'artifact' ? 'artifact-pass' : 'action-pass';
    row.detail = result.detail;
  } catch (e) {
    row.detail = String(e?.message || e).slice(0, 500);
  }
  return row;
}

const browser = await chromium.launch({ headless: true, args: ['--disable-gpu', '--disable-dev-shm-usage', '--no-sandbox'] });
const results = new Array(CATALOG.length);
let next = 0;
let completed = 0;

async function worker(workerId) {
  let context = null;
  let page = null;
  let inBatch = 0;
  const reset = async () => {
    await context?.close().catch(() => {});
    context = await browser.newContext({ acceptDownloads: true });
    page = await context.newPage();
    page.setDefaultTimeout(PAGE_TIMEOUT);
    inBatch = 0;
  };
  await reset();
  try {
    while (true) {
      if (inBatch >= CONTEXT_BATCH || page.isClosed()) await reset();
      const index = next++;
      if (index >= CATALOG.length) return;
      let result = await testTool(page, CATALOG[index]);
      if (/Target page, context or browser has been closed|Browser.*closed/i.test(result.detail)) {
        await reset();
        result = await testTool(page, CATALOG[index]);
      }
      results[index] = result;
      inBatch++;
      completed++;
      if (completed % 50 === 0 || completed === CATALOG.length) console.log(`checked ${completed}/${CATALOG.length} with ${WORKERS} workers (worker ${workerId})`);
    }
  } finally {
    await context?.close().catch(() => {});
  }
}

await Promise.all(Array.from({ length: WORKERS }, (_, i) => worker(i + 1)));
await browser.close();

const counts = results.reduce((m, r) => (m[r.status] = (m[r.status] || 0) + 1, m), {});
const failures = results.filter(r => r.status === 'fail');
const report = { total: results.length, workers: WORKERS, counts, failures };
fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/tool-regression.json', JSON.stringify(report, null, 2));
fs.writeFileSync('reports/tool-regression-failures.txt', failures.map(x => `${x.slug}\t${x.name}\t${x.engine}\t${x.detail}`).join('\n'));
console.log(JSON.stringify({ total: results.length, workers: WORKERS, counts, failures: failures.slice(0, 200) }, null, 2));
if (results.length !== CATALOG.length) process.exit(2);
if (failures.length) process.exit(1);
