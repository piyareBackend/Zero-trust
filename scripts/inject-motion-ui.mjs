import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, process.env.OUT_DIR || 'dist');
const link = '<link rel="stylesheet" href="/motion-ui.css">';

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.isFile() && entry.name.endsWith('.html')) {
      const html = fs.readFileSync(file, 'utf8');
      if (!html.includes('motion-ui.css')) {
        fs.writeFileSync(file, html.replace('</head>', `${link}\n</head>`));
      }
    }
  }
}

if (fs.existsSync(dist)) walk(dist);
console.log('Motion UI stylesheet injected into all generated HTML pages.');
