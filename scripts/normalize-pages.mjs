import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const base='/Zero-trust/';
const files=[];
function walk(dir){for(const name of fs.readdirSync(dir)){const p=path.join(dir,name);const st=fs.statSync(p);if(st.isDirectory())walk(p);else if(name==='index.html')files.push(p)}}
walk(path.join(root,'tools'));
for(const file of files){let html=fs.readFileSync(file,'utf8');html=html.replace(/<script\s+src=["']\/Zero-trust\/tool-engine\.js\?[^"']*["'][^>]*><\/script>/gi,'');html=html.replace(/<script\s+src=["']\/Zero-trust\/app\.js\?[^"']*["'][^>]*><\/script>/gi,'');html=html.replace(/<script\s+src=["']\/Zero-trust\/app\.js["'][^>]*><\/script>/gi,'');const tag=`<script src="${base}app.js?v=207" defer></script>`;html=html.replace(/<\/body>/i,`${tag}</body>`);fs.writeFileSync(file,html)}
console.log(`Normalized ${files.length} tool pages to one shared app bootstrap.`);
