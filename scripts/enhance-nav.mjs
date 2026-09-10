import fs from 'node:fs';
import path from 'node:path';

const dist=path.join(process.cwd(),'dist');
const base=(process.env.SITE_BASE||'/').replace(/\/$/,'')+'/';
const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
const categories=JSON.parse(fs.readFileSync(path.join(dist,'data/categories.json'),'utf8'));
const abs=p=>`${base}${p}`.replace(/\/+/g,'/');
const quick=[
  ['PDF Merger','tools/pdf-merger/'],['Image Compressor','tools/image-compressor/'],['QR Generator','tools/qr-generator/'],['Password Generator','tools/password-generator/'],
  ['JSON Formatter','tools/json-formatter/'],['Hash Generator','tools/hash-generator/'],['Base64 Encoder','tools/base64/'],['Unit Converter','tools/unit-converter/']
];
const nav=`<header class="site-header"><a class="brand" href="${abs('')}" aria-label="Zero Trust home"><span class="brand-mark" aria-hidden="true">ZT</span><span class="brand-name">Zero Trust</span></a><nav aria-label="Primary"><div class="desktop-quick"><a class="nav-link nav-special" href="${abs('tools/pdf-merger/')}">PDF</a><a class="nav-link nav-special" href="${abs('tools/image-compressor/')}">Image</a><a class="nav-link nav-special" href="${abs('tools/qr-generator/')}">QR</a><a class="nav-link nav-special" href="${abs('tools/password-generator/')}">Security</a></div><a class="nav-link nav-all" href="${abs('tools/')}">All tools</a><a class="nav-link nav-security" href="${abs('security/')}">Security</a><button id="themeBtn" class="icon-btn" type="button" aria-label="Toggle color theme">Dark</button><button id="menuBtn" class="icon-btn mobile-menu" type="button" aria-expanded="false" aria-controls="mobileNav" aria-label="Open tools menu"><span class="hamburger" aria-hidden="true"><i></i><i></i><i></i></span><span class="menu-label">Menu</span></button></nav><div id="mobileNav" class="mega-menu mobile-panel" hidden><div class="menu-title">Quick tools</div><div class="quick-grid">${quick.map(([n,p])=>`<a class="quick-tool" href="${abs(p)}"><strong>${esc(n)}</strong><span>Open tool</span></a>`).join('')}</div><div class="menu-title">Browse</div><div class="category-grid"><a href="${abs('tools/')}">All tools</a>${categories.map(c=>`<a href="${abs(`tools/category/${c.slug}/`)}">${esc(c.name)} <span>${c.count}</span></a>`).join('')}</div><div class="menu-footer"><a href="${abs('security/')}">Security & privacy</a><a href="${abs('privacy/')}">Privacy</a><a href="${abs('accessibility/')}">Accessibility</a></div></div></header>`;
let changed=0;
function walk(dir){for(const name of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,name.name);if(name.isDirectory())walk(p);else if(name.name==='index.html'){let h=fs.readFileSync(p,'utf8');const next=h.replace(/<header class="site-header">[\s\S]*?<\/header>/,nav);if(next!==h){fs.writeFileSync(p,next);changed++;}}}}
walk(dist);
console.log(`Enhanced navigation in ${changed} HTML pages.`);
