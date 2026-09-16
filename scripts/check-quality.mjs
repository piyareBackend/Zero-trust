import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { CATALOG } from '../data/catalog-combined.mjs';
const run=(cmd,args)=>{const r=spawnSync(cmd,args,{stdio:'inherit',shell:false});if(r.status!==0)process.exit(r.status??1)};
for(const dir of ['api','engines','scripts','tests']){const walk=(p)=>{for(const e of readdirSync(p,{withFileTypes:true})){const q=`${p}/${e.name}`;if(e.isDirectory())walk(q);else if(/\.(js|mjs)$/u.test(e.name))run(process.execPath,['--check',q])}};walk(dir)}
if(CATALOG.length!==1595||new Set(CATALOG.map(x=>x.slug)).size!==1595)throw Error(`Catalog integrity failure: ${CATALOG.length} routes`);
run(process.execPath,['scripts/build-capability-matrix.mjs']);
run(process.execPath,['scripts/build-pages.mjs']);
console.log(`Quality preflight passed: ${CATALOG.length} unique tool routes.`);
