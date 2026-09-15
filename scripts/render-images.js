#!/usr/bin/env node
/* ==========================================================================
   Renders the raster images the site links but does not draw at runtime:

     assets/og.png               1200 x 630, from scripts/og-source.svg
     assets/favicon-32.png       32 x 32, the OP mark full bleed
     assets/favicon-16.png       16 x 16, the OP mark full bleed
     assets/apple-touch-icon.png 180 x 180, the OP mark with margin, because
                                 iOS masks the corners

   The palette is not repeated here. Each page gets the :root{...} block from
   assets/op.css injected into its <style>, so the mark and the share image
   read var(--bg), var(--fg) and var(--blaze) from the same place the site
   does. Run it after editing scripts/og-source.svg, after changing a token in
   op.css, or after changing the mark's pixel pattern. That pattern lives in
   four places that must stay identical: assets/favicon.svg, partials/mark.html,
   scripts/og-source.svg, and the rows array below:

     node scripts/render-images.js

   It drives the installed Google Chrome headless (override the path with
   CHROME=/path/to/chrome), so the site's own woff2 fonts are used rather than
   whatever the OS falls back to. No npm dependencies.
   ========================================================================== */

'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CHROME =
  process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// The :root{...} rule from op.css, verbatim, so the palette has one source.
function tokens() {
  const css = fs.readFileSync(path.join(ROOT, 'assets/op.css'), 'utf8');
  const match = css.match(/:root\s*\{[^}]*\}/);
  if (!match) throw new Error('assets/op.css has no :root{...} block to take the palette from');
  return match[0];
}
const TOKENS = tokens();

function fontFace(family, weight, file) {
  const data = fs.readFileSync(path.join(ROOT, 'assets/fonts', file)).toString('base64');
  return `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${data}) format('woff2')}`;
}

// The share image: the SVG inlined so the page's @font-face rules and custom
// properties apply to it. Fonts are embedded as data URIs so no file://
// permissions are needed.
function ogPage() {
  const svg = fs.readFileSync(path.join(ROOT, 'scripts/og-source.svg'), 'utf8');
  return `<!doctype html><meta charset="utf-8"><style>
${TOKENS}
${fontFace('Barlow', 500, 'barlow-latin-500.woff2')}
${fontFace('IBM Plex Mono', 400, 'ibm-plex-mono-latin-400.woff2')}
html,body{margin:0;background:var(--bg)}svg{display:block}
</style>${svg}`;
}

// The OP mark as a CSS grid, same cell order as partials/mark.html (and the
// same pattern as assets/favicon.svg and scripts/og-source.svg), so each
// cell lands on whole pixels at the requested size. Chrome will not open
// a window smaller than about 100px, so the mark is drawn centered on a
// larger canvas and cropped afterwards.
function markPage(canvas, size, cell, offset) {
  const rows = ['xxx..', 'x.x..', 'xxx..', '...xx', '...xb'];
  const paint = { x: 'var(--fg)', b: 'var(--blaze)', '.': 'transparent' };
  const cells = rows
    .join('')
    .split('')
    .map((c) => `<i style="background:${paint[c]}"></i>`)
    .join('');
  const at = (canvas - size) / 2 + offset;
  return `<!doctype html><meta charset="utf-8"><style>
${TOKENS}
html,body{margin:0;background:var(--bg)}
.m{position:absolute;left:${at}px;top:${at}px;display:grid;grid-template-columns:repeat(5,${cell}px);grid-auto-rows:${cell}px}
.m i{display:block}
</style><div class="m">${cells}</div>`;
}

function render(html, width, height, out, crop) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'op-render-'));
  const page = path.join(dir, 'page.html');
  fs.writeFileSync(page, html);
  execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${width},${height}`,
      '--virtual-time-budget=3000',
      `--screenshot=${out}`,
      `file://${page}`,
    ],
    { stdio: ['ignore', 'ignore', 'ignore'] }
  );
  if (crop) {
    // Center crop. sips ships with macOS, which is also where the default
    // Chrome path points.
    execFileSync('sips', ['-c', String(crop), String(crop), out], { stdio: 'ignore' });
  }
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`  ${path.relative(ROOT, out)}  ${crop || width}x${crop || height}`);
}

if (!fs.existsSync(CHROME)) {
  console.error(`Chrome not found at ${CHROME}. Set CHROME=/path/to/chrome.`);
  process.exit(1);
}

const A = (f) => path.join(ROOT, 'assets', f);
const CANVAS = 200;
render(ogPage(), 1200, 630, A('og.png'));
render(markPage(CANVAS, 32, 6, 1), CANVAS, CANVAS, A('favicon-32.png'), 32);
render(markPage(CANVAS, 16, 3, 0), CANVAS, CANVAS, A('favicon-16.png'), 16);
render(markPage(CANVAS, 180, 24, 30), CANVAS, CANVAS, A('apple-touch-icon.png'), 180);
