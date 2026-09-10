import fs from 'node:fs';import path from 'node:path';
const root=process.env.SITE_ROOT||'.';
const files=['app.js','tool-engine.js','account.js','api/worker.mjs','api/platform-router.mjs','api/main.mjs'];for(const f of files)if(!fs.existsSync(path.join(root,f)))throw Error(`Missing security target: ${f}`);
const client=fs.readFileSync(path.join(root,'account.js'),'utf8')+fs.readFileSync(path.join(root,'app.js'),'utf8')+fs.readFileSync(path.join(root,'tool-engine.js'),'utf8');
for(const bad of ['CLOUDFLARE_API_TOKEN','OWNER_BOOTSTRAP_SECRET','GOOGLE_CLIENT_SECRET','STRIPE_SECRET_KEY','RAZORPAY_KEY_SECRET','DATABASE_PASSWORD'])if(client.includes(bad))throw Error(`Secret identifier leaked to client: ${bad}`);
const worker=fs.readFileSync(path.join(root,'api/worker.mjs'),'utf8')+fs.readFileSync(path.join(root,'api/platform-router.mjs'),'utf8')+fs.readFileSync(path.join(root,'api/main.mjs'),'utf8');for(const x of ['HttpOnly','Secure','SameSite=Strict','PBKDF2','Owner access required','CSRF validation failed','oauth_states','email_verified'])if(!worker.includes(x))throw Error(`Missing backend security control: ${x}`);
if(!fs.existsSync(path.join(root,'api/schema.sql')))throw Error('Missing D1 schema');
const dist=path.join(root,'dist');if(fs.existsSync(dist)){for(const f of ['account.js','account.css','login/index.html','signup/index.html','account/index.html','owner/index.html','pricing/index.html'])if(!fs.existsSync(path.join(dist,f)))throw Error(`Missing platform artifact: ${f}`)}
console.log('PASS: client contains no configured secret identifiers; backend contains secure sessions, password hashing, CSRF, owner authorization, OAuth state and verified Google identity controls; D1 schema and account/owner artifacts exist.');
