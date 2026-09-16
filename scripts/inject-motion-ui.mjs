import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), process.env.OUT_DIR || 'dist');
const base = (process.env.SITE_BASE || '/').replace(/\/$/, '') + '/';
const abs = p => `${base}${p}`.replace(/\\+/g, '/');
const link = `<link rel="stylesheet" href="${abs('motion-ui.css')}">`;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      let html = fs.readFileSync(file, 'utf8');
      if (!html.includes('motion-ui.css')) html = html.replace('</head>', `${link}\n</head>`);
      if (html.includes('<header class="site-header">') && !html.includes('id="mobileNav"')) {
        const nav = `<header class="site-header"><a class="brand" href="${abs('')}" aria-label="Zero Trust home"><span class="brand-mark" aria-hidden="true">ZT</span><span class="brand-name">Zero Trust</span></a><nav aria-label="Primary"><div class="desktop-quick"><a class="nav-link nav-special" href="${abs('tools/pdf-merger/')}">PDF</a><a class="nav-link nav-special" href="${abs('tools/image-compressor/')}">Image</a><a class="nav-link nav-special" href="${abs('tools/qr-generator/')}">QR</a><a class="nav-link nav-special" href="${abs('tools/password-generator/')}">Security</a></div><a class="nav-link nav-all" href="${abs('tools/')}">All tools</a><a class="nav-link nav-security" href="${abs('security/')}">Security</a><button id="themeBtn" class="icon-btn" type="button" aria-label="Toggle color theme">Dark</button><button id="menuBtn" class="icon-btn mobile-menu" type="button" aria-expanded="false" aria-controls="mobileNav" aria-label="Open tools menu"><span class="hamburger" aria-hidden="true"><i></i><i></i><i></i></span><span class="menu-label">Menu</span></button></nav><div id="mobileNav" class="mega-menu mobile-panel" hidden><div class="menu-title">Quick tools</div><div class="quick-grid"><a class="quick-tool" href="${abs('tools/pdf-merger/')}"><strong>PDF Merger</strong><span>Open tool</span></a><a class="quick-tool" href="${abs('tools/image-compressor/')}"><strong>Image Compressor</strong><span>Open tool</span></a><a class="quick-tool" href="${abs('tools/qr-generator/')}"><strong>QR Generator</strong><span>Open tool</span></a><a class="quick-tool" href="${abs('tools/password-generator/')}"><strong>Password Generator</strong><span>Open tool</span></a></div><div class="menu-title">Browse</div><div class="category-grid"><a href="${abs('tools/')}">All tools</a><a href="${abs('security/')}">Security</a><a href="${abs('privacy/')}">Privacy</a><a href="${abs('accessibility/')}">Accessibility</a></div><div class="menu-footer"><a href="${abs('security/')}">Security & privacy</a><a href="${abs('privacy/')}">Privacy</a></div></div></header>`;
        html = html.replace(/<header class="site-header">[\s\S]*?<\/header>/, nav);
      }
      fs.writeFileSync(file, html);
    }
  }
}

if (fs.existsSync(dist)) walk(dist);
console.log('Motion UI injected and responsive navigation normalized across generated HTML pages.');
