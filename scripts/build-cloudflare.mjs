import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
rmSync(dist, { recursive: true, force: true });

const run = (script, env = {}) => {
  const r = spawnSync(process.execPath, [script], {
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

run('scripts/build-pages.mjs', { OUT_DIR: 'dist', SITE_BASE: '/' });
mkdirSync(dist, { recursive: true });

// Build a Worker-specific asset bundle. Pages-only control files are deliberately
// excluded: Worker security headers are applied in api/main.mjs, and the Worker
// itself normalizes the legacy /Zero-trust path. This prevents Cloudflare's
// static-asset parser from consuming stale Pages metadata during deployment.
for (const f of [
  'styles.css',
  'tool-page.css',
  'app.js',
  'tool-engine.js',
  'manifest.json',
  'sw.js',
  '404.html',
  'account.js',
  'account.css',
  'owner.js',
]) {
  cpSync(join(root, f), join(dist, f));
}
cpSync(join(root, 'engines'), join(dist, 'engines'), { recursive: true });
cpSync(join(root, 'assets'), join(dist, 'assets'), { recursive: true });

// Defense in depth: if a future build step introduces Pages control files,
// Wrangler must never upload or parse them as Worker static assets.
writeFileSync(join(dist, '.assetsignore'), '_headers\n_redirects\n');

run('scripts/merge-legacy-pages.mjs', { SITE_BASE: '/' });
run('scripts/enhance-platform.mjs', { OUT_DIR: 'dist', SITE_BASE: '/' });
run('scripts/optimize-tool-pages.mjs', { OUT_DIR: 'dist', SITE_BASE: '/' });

const toolRoot = join(dist, 'tools');
const addToolStyles = (dir) => {
  const file = join(toolRoot, dir, 'index.html');
  if (!readFileSync(file, 'utf8').includes('tool-page.css')) {
    const html = readFileSync(file, 'utf8').replace(
      '</head>',
      '<link rel="stylesheet" href="/tool-page.css">\n</head>',
    );
    writeFileSync(file, html);
  }
};
for (const entry of readdirSync(toolRoot, { withFileTypes: true })) {
  if (entry.isDirectory() && entry.name !== 'category') addToolStyles(entry.name);
}

console.log('Cloudflare artifact ready in dist/ with the complete 1,594-tool optimization and runtime.');
