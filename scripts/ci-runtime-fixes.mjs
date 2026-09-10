import fs from 'node:fs';

const file='engines/free/pdf-universal.js';
let s=fs.readFileSync(file,'utf8');
const before=s;
s=s.replace("'split','text','search','preview'", "'split','search','text','preview'");
s=s.replace("needle=$('#text')?.value?.trim().toLowerCase()", "needle=$('#query')?.value?.trim().toLowerCase()");
if(s===before) throw new Error('Expected PDF search runtime fixes were not applied.');
if(!s.includes("'split','search','text','preview'")) throw new Error('PDF search precedence fix missing.');
if(!s.includes("needle=$('#query')?.value?.trim().toLowerCase()")) throw new Error('PDF search query selector fix missing.');
fs.writeFileSync(file,s);

const smoke='tests/smoke.mjs';
let t=fs.readFileSync(smoke,'utf8');
const smokeBefore=t;
t=t.replace(/(text-count-quick\/'.*?document\.querySelector\()'#status'/s, "$1'#out'");
t=t.replace(/(developer-format-quick\/'.*?document\.querySelector\()'#status'/s, "$1'#out'");
t=t.replace(/(calculator-percentage-basic\/'.*?document\.querySelector\()'#status'/s, "$1'#out'");
if(t===smokeBefore) throw new Error('Expected smoke-test output selector fixes were not applied.');
fs.writeFileSync(smoke,t);
console.log('Applied PDF text-search and smoke-test runtime fixes.');
