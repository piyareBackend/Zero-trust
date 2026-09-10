import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const ctx={window:{},document:{addEventListener(){}}};
vm.runInNewContext(app,ctx,{filename:'app.js'});
const tools=ctx.window.ZT_TOOLS||[];
if(tools.length<500)throw new Error(`Expected 500+ tools, found ${tools.length}`);
const base='/Zero-trust/';
const esc=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const categories=[...new Set(tools.map(t=>t[2]))];
const nav=`<header class="site-header"><a class="brand" href="${base}" aria-label="Zero Trust home"><span class="brand-mark">ZT</span><span>Zero Trust</span></a><nav><details class="nav-menu"><summary>Tools</summary><div class="mega-menu"><a href="${base}tools/">All tools (${tools.length})</a>${categories.map(c=>`<a href="${base}tools/category/${c}/">${esc(c[0].toUpperCase()+c.slice(1))}</a>`).join('')}</div></details><a class="nav-link" href="${base}tools/">Search</a><a class="nav-link" href="${base}security/">Security</a><button id="themeBtn" class="icon-btn" type="button">Dark</button><button id="menuBtn" class="icon-btn mobile-menu" type="button" aria-expanded="false">Menu</button></nav><div id="mobileNav" class="mega-menu" hidden><a href="${base}tools/">All tools</a>${categories.map(c=>`<a href="${base}tools/category/${c}/">${esc(c)}</a>`).join('')}</div></header>`;
const footer=`<footer><span>© 2026 Zero Trust</span><span><a href="${base}privacy/">Privacy</a> · <a href="${base}security/">Security</a> · <a href="${base}accessibility/">Accessibility</a></span></footer>`;
const shell=(title,description,body,canonical,robots='index,follow')=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="${robots}"><link rel="canonical" href="${base}${canonical}"><link rel="stylesheet" href="${base}styles.css"><script type="application/ld+json">${JSON.stringify({ '@context':'https://schema.org','@type':'WebApplication',name:title,applicationCategory:'UtilitiesApplication',operatingSystem:'Any',description})}</script></head><body>${nav}<main>${body}</main>${footer}<script src="${base}app.js?v=204" defer></script></body></html>`;
const write=(rel,html,overwrite=true)=>{const file=path.join(root,rel);if(!overwrite&&fs.existsSync(file))return;fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,html)};
for(const [slug,name,cat] of tools){
 const related=tools.filter(t=>t[0]!==slug&&t[2]===cat).slice(0,8);
 const desc=`Use ${name} online for fast, privacy-first browser processing. Learn how it works, supported input, and related tools.`;
 const faq=[`What is ${name}?`,`How do I use ${name}?`,`Are files uploaded?`];
 const body=`<section class="tool-shell"><div class="breadcrumbs"><a href="${base}tools/">All tools</a> / <a href="${base}tools/category/${cat}/">${esc(cat)}</a> / ${esc(name)}</div><div class="eyebrow">${esc(cat).toUpperCase()} TOOL</div><h1 id="toolTitle">${esc(name)}</h1><p id="toolDesc">${esc(desc)}</p><span class="privacy-badge">LOCAL-FIRST WHEN SUPPORTED</span><div id="toolApp"></div><section class="content-section"><h2>How to use ${esc(name)}</h2><ol><li>Choose the input required by this tool.</li><li>Run the operation in your browser.</li><li>Review the result and download it when ready.</li></ol><h2>Privacy and file handling</h2><p>Zero Trust is designed around local-first processing. Network-dependent capabilities are disclosed in the tool interface.</p><h2>Frequently asked questions</h2>${faq.map(q=>`<h3>${esc(q)}</h3><p>The tool page explains the supported operation and processing mode before you run it.</p>`).join('')}</section></section><section class="section related-section"><div class="section-head"><div><div class="eyebrow">RELATED TOOLS</div><h2>More ${esc(cat)} tools</h2></div><a href="${base}tools/category/${cat}/">View category</a></div><div class="tool-grid">${related.map(t=>`<a class="tool-card" href="${base}tools/${t[0]}/"><span class="eyebrow">${esc(t[2])}</span><h3>${esc(t[1])}</h3><p>Private browser-based utility.</p></a>`).join('')}</div></section>`;
 const faqSchema={'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq.map(q=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:'See the tool instructions and processing details on this page.'}}))};
 const html=shell(`${name} — Zero Trust`,desc,body,`tools/${slug}/`).replace('</head>',`<script type="application/ld+json">${JSON.stringify(faqSchema)}</script></head>`);
 write(`tools/${slug}/index.html`,html,false);
}
for(const cat of categories){
 const items=tools.filter(t=>t[2]===cat);
 const body=`<section class="page"><div class="eyebrow">CATEGORY</div><h1>${esc(cat[0].toUpperCase()+cat.slice(1))} tools</h1><p>Browse ${items.length} privacy-first ${esc(cat)} tools. Search is instant and each tool has its own documentation, metadata and related links.</p><div class="tool-grid">${items.map(t=>`<a class="tool-card" href="${base}tools/${t[0]}/"><span class="eyebrow">${esc(cat)}</span><h3>${esc(t[1])}</h3><p>Private browser-based utility.</p></a>`).join('')}</div></section>`;
 write(`tools/category/${cat}/index.html`,shell(`${cat} tools — Zero Trust`,`Browse ${items.length} ${cat} tools from Zero Trust.`,body,`tools/category/${cat}/`));
}
const robots=`User-agent: *\nAllow: /\nSitemap: https://piyarebackend.github.io/Zero-trust/sitemap.xml\n`;
write('robots.txt',robots);
const sitemap=['https://piyarebackend.github.io/Zero-trust/','https://piyarebackend.github.io/Zero-trust/tools/'];
for(const [slug] of tools)sitemap.push(`https://piyarebackend.github.io/Zero-trust/tools/${slug}/`);
for(const cat of categories)sitemap.push(`https://piyarebackend.github.io/Zero-trust/tools/category/${cat}/`);
write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap.map(u=>`<url><loc>${u}</loc></url>`).join('')}</urlset>`);
console.log(`Generated catalogue for ${tools.length} tools and ${categories.length} categories.`);