import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), process.env.OUT_DIR || 'dist');

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && entry.name.endsWith('.html')) enhance(file);
  }
}

const esc = s => String(s ?? '').replace(/[&<>\"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '\"':'&quot;', "'":'&#39;' }[c]));
const initials = s => String(s || 'ZT').trim().split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase().slice(0, 2) || 'ZT';

function visual(category) {
  const label = esc(initials(category));
  return `<div class="tool-card-media" aria-hidden="true"><svg viewBox="0 0 120 80" role="presentation"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0"/><stop offset="1" stop-opacity=".35"/></linearGradient></defs><rect x="12" y="10" width="96" height="60" rx="16" fill="none" stroke="currentColor" stroke-opacity=".28" stroke-width="2"/><circle cx="35" cy="40" r="15" fill="currentColor" fill-opacity=".12"/><path d="M54 52 68 35l11 10 9-12 15 19" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="35" y="45" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor">${label}</text></svg></div>`;
}

function enhance(file) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('class="tool-card"') || html.includes('class="tool-card-media"')) return;
  html = html.replace(/(<a class="tool-card"[^>]*>)(<span class="eyebrow">)([\s\S]*?)(<\/span>)(<h3>)([\s\S]*?)(<\/h3>)(<p>)([\s\S]*?)(<\/p>)(<\/a>)/g,
    (_, open, eyebrowOpen, category, eyebrowClose, h3Open, title, h3Close, pOpen, desc, pClose, close) => `${open}${visual(category.replace(/<[^>]*>/g, ''))}${eyebrowOpen}${category}${eyebrowClose}<div class="card-copy">${h3Open}${title}${h3Close}${pOpen}${desc}${pClose}</div>${close}`);
  fs.writeFileSync(file, html);
}

walk(dist);
console.log('Motion product-card visuals added across generated pages.');
