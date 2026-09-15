#!/usr/bin/env node
/* ==========================================================================
   Page composer.

   Wraps content fragments in pages/ with layouts/base.html, expands partial
   includes, substitutes site constants, and writes static HTML to dist/.
   Assets are copied verbatim, and robots.txt and sitemap.xml are generated
   from the page list. Express then serves dist/ as plain static files.

   Compose-time only: no framework, bundler, or client-side rendering. Two
   post-passes: aria-current is added to the header link whose data-nav
   matches the page's nav metadata, and the 404 page gets a noindex meta tag
   in place of its canonical and og:url tags. An unresolved {{token}} fails
   the build.

   Output is staged in dist.tmp/ and renamed to dist/ only once every page
   has built, so a failed build leaves the previous dist/ intact instead of
   a half-written one.

   Fragment format — a metadata comment, then markup:

     <!--meta
     title: Page title
     description: Meta description
     nav: project
     -->
     <section>...</section>

   title and description are required; nav is optional.

   Template syntax:
     {{key}}        value from metadata or the SITE constants below
     {{> name}}     inline partials/name.html
   ========================================================================== */

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIRS = {
  pages: path.join(ROOT, 'pages'),
  partials: path.join(ROOT, 'partials'),
  layouts: path.join(ROOT, 'layouts'),
  assets: path.join(ROOT, 'assets'),
  out: path.join(ROOT, 'dist'),
  // Pages are written here first and the directory is renamed to dist/ only
  // after the whole build succeeds. Removed again on failure.
  stage: path.join(ROOT, 'dist.tmp'),
};

/* --- helpers -------------------------------------------------------------- */

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

// Short hash of everything under assets/, appended as ?v= to the stylesheet,
// script, icon, and share-image URLs in the layout. Browsers key the cache on
// the full URL, so the server can send a long immutable cache lifetime for
// /assets without pinning a stale file: editing op.css or re-rendering og.png
// changes the hash and so the URL. The font files are the exception: op.css
// and the preload links reference them without a version, so a changed font
// needs a new filename (the names already carry the weight).
function assetVersion() {
  const files = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue; // .DS_Store and the like
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else files.push(file);
    }
  })(DIRS.assets);
  const hash = crypto.createHash('sha1');
  for (const file of files.sort()) {
    hash.update(path.relative(DIRS.assets, file));
    hash.update(fs.readFileSync(file));
  }
  return hash.digest('hex').slice(0, 8);
}

// Single source of truth for every cross-property URL. Pages reference these
// by token so a domain change is one edit here, not a grep across the site.
const SITE = {
  siteUrl: 'https://openpasture.dev',
  kitRepo: 'https://github.com/open-pasture/openpasture-agent-kit',
  kitDocs: 'https://github.com/open-pasture/openpasture-agent-kit/tree/main/docs-site',
  licenseUrl: 'https://www.gnu.org/licenses/agpl-3.0.en.html',
  // The inbox the Railway service already delivers form submissions to
  // (CONTACT_EMAIL on the openpasture-web service, read 2026-09-15).
  // openpasture.dev has registrar forwarding MX records; openpasture.com,
  // where the earlier address lived, has none. Change here and in Railway
  // together.
  contactEmail: 'cody@openpasture.dev',
  // Describes scripts/og-source.svg; change both together.
  ogImageAlt: "Farm like you're in the future. openpasture.dev, with a drawn paddock boundary and a proposed next boundary.",
  statusDate: 'September 14, 2026',
  statusDateIso: '2026-09-14',
  v: assetVersion(),
};

// nav is the only optional metadata field. title and description have no
// fallback, so a page that forgets one fails the build instead of shipping
// generic text.
const DEFAULTS = {
  nav: '',
};

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

// A token with no value in the context is an error, not a warning: the build
// stops and names the page so a typo never reaches dist/.
function substitute(html, context, where) {
  return html.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (whole, key) => {
    if (Object.prototype.hasOwnProperty.call(context, key)) return context[key];
    throw new Error(`${where}: unresolved token ${whole}`);
  });
}

// Flags the nav item matching this page so the header can style it. Done as a
// post-pass so the header partial stays a static file. Plain string matching,
// so data-nav is reserved for the header partial: any other element carrying
// the same data-nav value would be marked current too.
function markActiveNav(html, nav) {
  if (!nav) return html;
  return html
    .split(`data-nav="${nav}"`)
    .join(`data-nav="${nav}" aria-current="page"`);
}

// The 404 page is reached only through a missing route and the server always
// answers it with status 404, so crawlers are told not to index it. The
// layout's canonical link and og:url meta are removed at the same time: a
// canonical URL on a noindex page contradicts it, and /404 is not a URL that
// ever answers 200. Done as a post-pass because the shared layout has no slot
// for page-specific head tags. Whole lines are removed so the head keeps its
// one-tag-per-line shape.
function markNoindex(html) {
  html = html
    .replace(/^[ \t]*<link rel="canonical"[^>]*>\r?\n/m, '')
    .replace(/^[ \t]*<meta property="og:url"[^>]*>\r?\n/m, '');
  if (html.includes('name="robots"')) return html;
  return html.replace('</head>', '  <meta name="robots" content="noindex">\n</head>');
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue; // same file set as assetVersion()
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

// robots.txt and sitemap.xml are derived from the pages that were just
// built, so they cannot drift from SITE.siteUrl or the page list. The 404
// page is not a public URL and is left out.
function writeCrawlerFiles(out, urls) {
  const robots = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    `Sitemap: ${SITE.siteUrl}/sitemap.xml`,
    '',
  ].join('\n');

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${url}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');

  fs.writeFileSync(path.join(out, 'robots.txt'), robots);
  fs.writeFileSync(path.join(out, 'sitemap.xml'), sitemap);
}

/* --- build ---------------------------------------------------------------- */

function build() {
  const started = Date.now();
  const out = DIRS.stage;

  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });

  const layout = read(path.join(DIRS.layouts, 'base.html'));
  const pages = fs
    .readdirSync(DIRS.pages)
    .filter((f) => f.endsWith('.html'))
    .sort();

  const publicUrls = [];

  for (const file of pages) {
    const slug = path.basename(file, '.html');
    const isNotFound = slug === '404';
    const { meta, body } = parseFragment(read(path.join(DIRS.pages, file)));

    const route = slug === 'index' ? '/' : `/${slug}`;
    const context = {
      ...SITE,
      ...DEFAULTS,
      ...meta,
      canonical: SITE.siteUrl + route,
    };

    // Content first, so a page can use partials and tokens of its own.
    context.content = substitute(expandPartials(body), context, `pages/${file}`);

    let html = substitute(expandPartials(layout), context, `pages/${file}`);
    html = markActiveNav(html, context.nav);
    if (isNotFound) html = markNoindex(html);

    fs.writeFileSync(path.join(out, file), html);
    if (!isNotFound) publicUrls.push(context.canonical);
    console.log(`  ${route.padEnd(16)} ${file}`);
  }

  copyDir(DIRS.assets, path.join(out, 'assets'));
  // Home first, then the rest in page order.
  const home = `${SITE.siteUrl}/`;
  writeCrawlerFiles(out, [home, ...publicUrls.filter((url) => url !== home)]);

  // Everything built: replace dist/ with the staged tree in one step.
  fs.rmSync(DIRS.out, { recursive: true, force: true });
  fs.renameSync(out, DIRS.out);

  console.log(`\nbuilt ${pages.length} pages in ${Date.now() - started}ms -> dist/`);
}

try {
  build();
} catch (err) {
  console.error(`\nbuild failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  // A no-op after success, when the staged tree has already become dist/.
  // After a failure it removes the partial output so nothing misleading is
  // left behind.
  fs.rmSync(DIRS.stage, { recursive: true, force: true });
}
