/* ==========================================================================
   Static server for openpasture.dev.

   Serves dist/ (written by build.js), redirects routes from earlier versions
   of the site, and accepts the form on /involved at POST /api/contact, which
   is relayed to CONTACT_EMAIL through Resend. Nothing else runs here.

   Environment (see .env.example):
     PORT                 injected by Railway; 3000 locally
     NODE_ENV             production on Railway; unset locally
     RAILWAY_ENVIRONMENT  injected by Railway; either one marks the deploy as production
     RESEND_API_KEY       unset locally: submissions are logged, not sent;
                          unset in production: POST /api/contact answers 503
     CONTACT_EMAIL        inbox that receives submissions; required with the key
     RESEND_FROM          sender on a domain verified in Resend; defaults to
                          Resend's test sender, which only reaches the account owner
   ========================================================================== */

'use strict';

const express = require('express');
const compression = require('compression');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, 'dist');
const PRODUCTION =
  process.env.NODE_ENV === 'production' || Boolean(process.env.RAILWAY_ENVIRONMENT);

/* --- mail configuration --------------------------------------------------- */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL;
const RESEND_FROM = process.env.RESEND_FROM;

// Resend's shared test sender. It delivers only to the address that owns the
// Resend account, which is enough for a one-person project; a sender on a
// verified domain (RESEND_FROM) lifts that limit.
const DEFAULT_FROM = 'openpasture <onboarding@resend.dev>';
const FROM = RESEND_FROM || DEFAULT_FROM;

const MAIL_CONFIGURED = Boolean(RESEND_API_KEY);
if (MAIL_CONFIGURED) {
  // The public address shown on pages lives in build.js. This one is only the
  // delivery target, so it has no fallback: a misconfigured deploy fails here
  // instead of quietly mailing the wrong inbox.
  if (!CONTACT_EMAIL) {
    console.error('CONTACT_EMAIL is required when RESEND_API_KEY is set. See .env.example.');
    process.exit(1);
  }
  if (!RESEND_FROM) {
    console.warn(`RESEND_FROM is not set: sending as ${DEFAULT_FROM}, which only delivers to the Resend account owner.`);
  }
} else {
  console.warn(
    PRODUCTION
      ? 'RESEND_API_KEY is not set: POST /api/contact answers 503 until it is.'
      : 'RESEND_API_KEY is not set: POST /api/contact logs submissions instead of sending.'
  );
}

// Sending is one POST to Resend's REST API, called directly: the SDK would
// add React and html-to-text for templating that this plain-text mail never
// uses. A non-2xx answer or a timeout throws; the caller turns that into a 500.
async function sendMail(mail) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(mail),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const detail = (await res.text().catch(() => '')).slice(0, 300);
    throw new Error(`Resend answered ${res.status}${detail ? `: ${detail}` : ''}`);
  }
}

/* --- app ------------------------------------------------------------------ */

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1); // Railway's proxy, so req.ip is the visitor

// Railway's edge passes responses through uncompressed, so gzip here. The
// default filter only touches text types (HTML, CSS, JS, SVG, JSON); the
// woff2 fonts and PNGs are already compressed and are left alone. Mounted
// before everything else so it wraps both static handlers and the 404 page.
app.use(compression());

// Every resource is self-hosted and nothing is styled or scripted inline, so
// the policy is strict. A style attribute or <style> block in a page would be
// blocked; keep styling in op.css. Trusted Types are required for scripts, so
// site.js must keep to textContent and friends: innerHTML, insertAdjacentHTML
// or document.write with a plain string would throw in Chrome.
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    "require-trusted-types-for 'script'",
  ].join('; '),
};
app.use((req, res, next) => {
  res.set(SECURITY_HEADERS);
  next();
});

// One canonical host. Railway serves both openpasture.dev and www.openpasture.dev;
// send the www form to the apex so there is a single URL for every page.
app.use((req, res, next) => {
  if (req.hostname === 'www.openpasture.dev') {
    return res.redirect(301, `https://openpasture.dev${req.originalUrl}`);
  }
  next();
});

// Routes from earlier versions of the site, mapped to where that content lives now.
const REDIRECTS = {
  '/manifesto': '/about',
  '/mission': '/about',
  '/landing': '/',
  '/roadmap': '/project',
  '/agent-kit': '/project',
  '/cloud': '/project',
  '/integrations': '/project',
  '/open-source': '/project',
  '/contact': '/involved',
};
for (const [from, to] of Object.entries(REDIRECTS)) {
  app.get([from, `${from}.html`], (req, res) => res.redirect(301, to));
}

function notFound(req, res) {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found.' });
  }
  res.status(404).sendFile(path.join(DIST, '404.html'), {
    headers: { 'Cache-Control': 'no-cache' },
  });
}

// The not-found page is a file in dist/, so without this it would be served
// as an ordinary page with status 200.
app.get(['/404', '/404.html'], notFound);

// One URL per page. express.static would also answer /<slug>.html and /index,
// and would 404 /<slug>/; collapse those onto the canonical form instead.
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  let clean = req.path.replace(/\/{2,}/g, '/');
  if (/\.html$/i.test(clean)) clean = clean.replace(/(?:\/index)?\.html$/i, '') || '/';
  if (clean === '/index') clean = '/';
  if (clean.length > 1 && clean.endsWith('/')) clean = clean.replace(/\/+$/, '');
  if (clean === req.path) return next();
  res.redirect(301, clean + req.originalUrl.slice(req.path.length));
});

// The stylesheet, script, icons, and share image are linked with a content
// hash (?v=) that build.js computes over all of assets/, and the font files
// carry their weight in the filename, so everything under /assets can be
// cached for a year without revalidation.
app.use('/assets', express.static(path.join(DIST, 'assets'), {
  index: false,
  redirect: false,
  maxAge: '1y',
  immutable: true,
}));

// Pages are served at their extensionless route. HTML, robots.txt, and
// sitemap.xml always revalidate so a deploy shows up on the next navigation.
app.use(express.static(DIST, {
  extensions: ['html'],
  redirect: false,
  setHeaders(res, file) {
    if (/\.html$|robots\.txt$|sitemap\.xml$/.test(file)) res.setHeader('Cache-Control', 'no-cache');
  },
}));

/* --- contact form --------------------------------------------------------- */

// site.js posts JSON and reads JSON back. Without JavaScript the same form
// posts urlencoded and expects a page, so it is sent back to /involved with a
// fragment that reveals the matching confirmation line.
function isFormPost(req) {
  return Boolean(req.is('application/x-www-form-urlencoded'));
}

function reply(req, res, status, body) {
  if (isFormPost(req)) {
    return res.redirect(303, status < 400 ? '/involved#sent' : '/involved#failed');
  }
  return res.status(status).json(body);
}

// Five submissions per address per ten minutes, tracked in memory. Enough for
// anyone writing by hand; not enough to burn the Resend quota.
const RATE_WINDOW = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map(); // ip -> submission times within the window

// /privacy says an address is held for ten minutes, then dropped. This sweep
// runs every minute so that stays true for an address that never posts again;
// unref'd so it does not hold the process open on shutdown.
setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of hits) {
    if (now - times[times.length - 1] >= RATE_WINDOW) hits.delete(ip);
  }
}, 60 * 1000).unref();

function rateLimit(req, res, next) {
  const now = Date.now();
  const recent = (hits.get(req.ip) || []).filter((t) => now - t < RATE_WINDOW);
  if (recent.length >= RATE_MAX) {
    return reply(req, res, 429, { error: 'Too many messages. Try again later.' });
  }
  recent.push(now);
  hits.set(req.ip, recent);
  next();
}

// Only strings are accepted. Control characters are stripped so nothing can
// inject a header into the subject or a fake line into the body; the message
// keeps its newlines and tabs.
const CONTROL = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function line(value, max) {
  return (typeof value === 'string' ? value : '')
    .replace(CONTROL, '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, max);
}

function paragraph(value, max) {
  return (typeof value === 'string' ? value : '')
    .replace(CONTROL, '')
    .replace(/\r\n?/g, '\n')
    .trim()
    .slice(0, max);
}

async function contact(req, res) {
  const body = req.body || {};
  const email = line(body.email, 254);
  const name = line(body.name, 200);
  const page = line(body.page, 200);
  const message = paragraph(body.message, 5000);

  if (!EMAIL.test(email)) {
    return reply(req, res, 400, { error: 'A valid email address is required.' });
  }

  const mail = {
    from: FROM,
    to: [CONTACT_EMAIL],
    reply_to: email,
    subject: `openpasture: message from ${email}`,
    text:
      `From: ${name || '(no name)'} <${email}>\n` +
      `Page: ${page || 'unknown'}\n` +
      `Time: ${new Date().toISOString()}\n\n` +
      `${message || '(no message)'}\n`,
  };

  if (!MAIL_CONFIGURED) {
    if (PRODUCTION) {
      return reply(req, res, 503, { error: 'The form is not configured yet. Please email instead.' });
    }
    console.log(`RESEND_API_KEY not set; logging instead of sending.\n${mail.subject}\n${mail.text}`);
    return reply(req, res, 200, { success: true });
  }

  try {
    await sendMail(mail);
  } catch (err) {
    console.error('Resend error:', err.message || err);
    return reply(req, res, 500, { error: 'Failed to send message. Please try again.' });
  }
  return reply(req, res, 200, { success: true });
}

app.post(
  '/api/contact',
  rateLimit,
  express.json({ limit: '32kb' }),
  express.urlencoded({ extended: false, limit: '32kb' }),
  contact
);

/* --- fallbacks ------------------------------------------------------------ */

app.use(notFound);

// Body-parser rejections (malformed JSON, oversized bodies) and anything else
// thrown on the way through end here instead of at Express's default handler,
// which would print a stack trace with filesystem paths into the response.
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = Number(err.status || err.statusCode) || 500;
  if (status >= 500) console.error(err);
  const error =
    status === 413 ? 'Message too long.'
    : status < 500 ? 'Bad request.'
    : 'Server error. Please try again.';
  reply(req, res, status, { error });
});

/* --- start ---------------------------------------------------------------- */

const server = app.listen(PORT, () => {
  console.log(`openpasture site listening on port ${PORT}`);
});

// Railway sends SIGTERM on redeploy. Stop accepting connections, let in-flight
// requests finish, and give up after ten seconds.
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 10000).unref();
});
