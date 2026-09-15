/* ==========================================================================
   OPEN PASTURE — "the resolve"

   Load motion: text arrives as raw signal and decodes into legibility, led by
   a single scanline pass. Cold and grid-locked — a scan, not a flame.

   This is decoration over markup that is already complete. Every element it
   touches ships its real text in the HTML; the script scrambles what is
   already there and restores it. If this file never loads, or throws, or the
   reader prefers reduced motion, the page is correct and fully readable.

   Usage:
     <h1 data-resolve>Real text</h1>       decode on reveal
     <div data-tile>...</div>              tile in on reveal
     data-resolve-delay="120"              stagger, ms
   ========================================================================== */
(function () {
  'use strict';

  // ASCII only, deliberately. The vendored fonts are latin-subset woff2 files,
  // so block and shade characters (U+2591-2593) would fall back to a system
  // font mid-decode and break the monospace advance width — the whole reason
  // this effect stays free of layout shift.
  var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\|=+*#%&@<>[]{}~^-_';

  var FRAME_MS = 34;      // glyph re-roll interval
  var PER_CHAR = 1.6;     // frames of scramble each glyph gets before locking
  var MAX_FRAMES = 26;    // ceiling, so a long line still lands inside budget
  var SCAN_MS = 820;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function randChar() {
    return CHARS.charAt((Math.random() * CHARS.length) | 0);
  }

  /* --- text decode -------------------------------------------------------- */

  function decode(el) {
    if (el.dataset.resolved === '1') return;
    el.dataset.resolved = '1';

    var finalText = el.textContent;
    // Nothing to gain on very long strings, and scrambling a paragraph is
    // hostile to anyone trying to read it.
    if (!finalText.trim() || finalText.length > 120) return;

    var chars = finalText.split('');
    var lockAt = chars.map(function (ch, i) {
      // Whitespace never scrambles, so word shape stays stable throughout.
      return /\s/.test(ch) ? 0 : Math.min(MAX_FRAMES, Math.round((i + 1) * PER_CHAR));
    });

    var totalFrames = Math.max.apply(null, lockAt.concat([1]));
    var frame = 0;
    el.classList.add('is-decoding');

    var timer = setInterval(function () {
      frame++;

      var out = '';
      for (var i = 0; i < chars.length; i++) {
        out += frame >= lockAt[i] ? chars[i] : randChar();
      }
      el.textContent = out;

      if (frame >= totalFrames) {
        clearInterval(timer);
        el.textContent = finalText;
        el.classList.remove('is-decoding');
      }
    }, FRAME_MS);
  }

  /* --- reveal scheduling -------------------------------------------------- */

  function schedule(el, fn) {
    var delay = parseInt(el.dataset.resolveDelay || '0', 10);
    if (delay > 0) setTimeout(fn, delay);
    else fn();
  }

  function observe(nodes, apply) {
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(apply);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target); // once per load; never on scroll-back
          schedule(entry.target, function () {
            apply(entry.target);
          });
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.15 }
    );

    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  /* --- boot --------------------------------------------------------------- */

  // The full resolve is delightful once and tiresome by the fourth page, so it
  // runs on first entry to the site only. Later navigations get the view
  // transition wipe and the panel tile-in, but no scanline and no decode.
  function isFirstEntry() {
    try {
      if (sessionStorage.getItem('op:entered') === '1') return false;
      sessionStorage.setItem('op:entered', '1');
      return true;
    } catch (err) {
      return true; // private mode etc. — fall back to showing the effect
    }
  }

  function start() {
    var texts = Array.prototype.slice.call(document.querySelectorAll('[data-resolve]'));
    var tiles = Array.prototype.slice.call(document.querySelectorAll('[data-tile]'));

    var showTiles = function () {
      tiles.forEach(function (t) {
        t.classList.add('is-tiled');
      });
    };

    if (reduceMotion) {
      // Final state, immediately. Nothing animates, nothing is hidden.
      showTiles();
      return;
    }

    observe(tiles, function (el) {
      el.classList.add('is-tiled');
    });

    if (!isFirstEntry()) return;

    // The scanline is the conductor: one pass, then it is gone.
    document.body.classList.add('is-scanning');
    setTimeout(function () {
      document.body.classList.remove('is-scanning');
    }, SCAN_MS);

    observe(texts, decode);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
