#!/usr/bin/env node
/* ==========================================================================
   Page composer.

   Wraps content fragments in pages/ with layouts/base.html, expands partial
   includes, substitutes site constants, and writes static HTML to dist/.
   Assets are copied verbatim. Express then serves dist/ as plain static files.

   No framework, no bundler, no client-side rendering. The only reason this
   exists is that header and footer markup was already duplicated across pages
   and had drifted out of sync.

   Fragment format — an optional metadata comment, then markup:

     <!--meta
     title: Page title
     description: Meta description
     nav: project
     -->
     <section>...</section>

   Template syntax:
     {{key}}        value from metadata or the SITE constants below
     {{> name}}     inline partials/name.html
   ========================================================================== */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIRS = {
  pages: path.join(ROOT, 'pages'),
  partials: path.join(ROOT, 'partials'),
  layouts: path.join(ROOT, 'layouts'),
  assets: path.join(ROOT, 'assets'),
  out: path.join(ROOT, 'dist'),
};

// Single source of truth for every cross-property URL. Pages reference these
// by token so a domain change is one edit here, not a grep across the site.
const SITE = {
  siteUrl: 'https://openpasture.dev',
  orgUrl: 'https://github.com/open-pasture',
  kitRepo: 'https://github.com/open-pasture/openpasture-agent-kit',
  kitDocs: 'https://github.com/open-pasture/openpasture-agent-kit/tree/main/docs-site',
  licenseUrl: 'https://www.gnu.org/licenses/agpl-3.0.en.html',
  contactEmail: 'hello@openpasture.com',
  statusDate: 'September 14, 2026',
  year: String(new Date().getFullYear()),
};

const DEFAULTS = {
  nav: '',
  description: 'Open, repairable livestock collars and an intelligence layer for pasture-based farming, built in the open by one person.',
};

/* --- helpers -------------------------------------------------------------- */

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function parseFragment(raw) {
  const match = raw.match(/^\s*<!--meta\s*([\s\S]*?)-->/);
  if (!match) return { meta: {}, body: raw };

  const meta = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    if (!key) continue;
    meta[key] = line.slice(idx + 1).trim();
  }
  return { meta, body: raw.slice(match[0].length) };
}

// Partials may include other partials. Depth-limited so a cycle fails loudly
// instead of hanging the build.
function expandPartials(html, depth = 0) {
  if (depth > 8) {
    throw new Error('Partial nesting too deep — probable include cycle');
  }
  return html.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) => {
    const file = path.join(DIRS.partials, `${name}.html`);
    if (!fs.existsSync(file)) {
      throw new Error(`Missing partial: partials/${name}.html`);
    }
    return expandPartials(read(file), depth + 1);
  });
}

function substitute(html, context) {
  return html.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (whole, key) => {
    if (Object.prototype.hasOwnProperty.call(context, key)) return context[key];
    // Leave unknown tokens visible rather than silently blanking them, so a
    // typo shows up in the page instead of disappearing.
    console.warn(`  ! unresolved token ${whole}`);
    return whole;
  });
}

// Flags the nav item matching this page so the header can style it. Done as a
// post-pass so the header partial stays a static file.
function markActiveNav(html, nav) {
  if (!nav) return html;
  return html.replace(
    new RegExp(`data-nav="${nav}"`, 'g'),
    `data-nav="${nav}" aria-current="page"`
  );
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

/* --- build ---------------------------------------------------------------- */

function build() {
  const started = Date.now();

  fs.rmSync(DIRS.out, { recursive: true, force: true });
  fs.mkdirSync(DIRS.out, { recursive: true });

  const layout = read(path.join(DIRS.layouts, 'base.html'));
  const pages = fs
    .readdirSync(DIRS.pages)
    .filter((f) => f.endsWith('.html'))
    .sort();

  for (const file of pages) {
    const slug = path.basename(file, '.html');
    const { meta, body } = parseFragment(read(path.join(DIRS.pages, file)));

    const route = slug === 'index' ? '/' : `/${slug}`;
    const context = {
      ...SITE,
      ...DEFAULTS,
      ...meta,
      route,
      canonical: SITE.siteUrl + (slug === 'index' ? '' : route),
    };

    // Content first, so a page can use partials and tokens of its own.
    context.content = substitute(expandPartials(body), context);

    let html = substitute(expandPartials(layout), context);
    html = markActiveNav(html, context.nav);

    fs.writeFileSync(path.join(DIRS.out, file), html);
    console.log(`  ${route.padEnd(16)} ${file}`);
  }

  copyDir(DIRS.assets, path.join(DIRS.out, 'assets'));

  console.log(`\nbuilt ${pages.length} pages in ${Date.now() - started}ms -> dist/`);
}

try {
  build();
} catch (err) {
  console.error(`\nbuild failed: ${err.message}`);
  process.exit(1);
}
