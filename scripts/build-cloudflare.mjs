import{spawnSync}from'node:child_process';import{cpSync,mkdirSync,rmSync}from'node:fs';import{join}from'node:path';
const root=process.cwd(),dist=join(root,'dist');rmSync(dist,{recursive:true,force:true});
const run=(script,env={})=>{const r=spawnSync(process.execPath,[script],{stdio:'inherit',env:{...process.env,...env}});if(r.status!==0)process.exit(r.status??1)};
run('scripts/build-pages.mjs',{OUT_DIR:'dist',SITE_BASE:'/'});
mkdirSync(dist,{recursive:true});
for(const f of['styles.css','tool-page.css','app.js','tool-engine.js','manifest.json','sw.js','404.html','_headers','_redirects','account.js','account.css','owner.js'])cpSync(join(root,f),join(dist,f));
cpSync(join(root,'engines'),join(dist,'engines'),{recursive:true});cpSync(join(root,'assets'),join(dist,'assets'),{recursive:true});
run('scripts/merge-legacy-pages.mjs',{SITE_BASE:'/'});run('scripts/enhance-platform.mjs',{OUT_DIR:'dist',SITE_BASE:'/'});run('scripts/optimize-tool-pages.mjs',{OUT_DIR:'dist',SITE_BASE:'/'});
console.log('Cloudflare artifact ready in dist/ with the complete 1,594-tool optimization and runtime.');
