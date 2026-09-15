/* ==========================================================================
   OPEN PASTURE — procedural digital camo field

   Renders a grayscale digital-camouflage pattern to a full-bleed canvas.
   Generated rather than shipped as a raster so it stays pixel-sharp at any
   viewport size and device pixel ratio.

   Pattern:
     1. fractal value noise (4 octaves) sampled on a coarse cell grid
     2. quantized into 5 hard grayscale bands  -> extreme contrast
     3. stochastic dithering near band edges   -> the pixelated camo fringe

   Boot:
     The field arrives as raw static and resolves into the pattern in a swept
     pass. Cold and grid-locked — a scan, not a flame.

   The grid is painted into an offscreen canvas at one pixel per cell and
   scaled up with smoothing disabled. That keeps blocks perfectly sharp and
   makes a full repaint cheap enough to animate every frame.
   ========================================================================== */
(function () {
  'use strict';

  var CELL = 8;          // camo pixel size, CSS px
  var SEED = 20260816;   // fixed so the pattern is identical on every load
  var OCTAVES = 4;
  var GAIN = 0.46;       // octave falloff

  // Black through near-white. The spread is deliberately extreme; a dark scrim
  // sits on top in CSS, so a gentler ramp would mud out completely.
  var BANDS = [0x00, 0x2e, 0x69, 0xa9, 0xf2];

  // Cutoffs between bands, spread fairly evenly so all five tones actually get
  // coverage. Weighting these dark reads as a black field, not as camo.
  var CUTS = [0.3, 0.52, 0.72, 0.89];

  var DITHER = 0.07;     // noise distance from a cutoff that can flip a cell

  // Blob size, as a divisor of the cell count. Lower = larger blobs.
  var BLOB = 9;

  var BOOT_MS = 760;     // full resolve duration
  var BOOT_BAND = 0.2;   // width of the live static wavefront, in progress units

  var canvas = document.getElementById('camo');
  if (!canvas) return;

  var host = canvas.parentNode;
  var ctx = canvas.getContext('2d', { alpha: false });
  ctx.imageSmoothingEnabled = false;

  var buffer = document.createElement('canvas');
  var bctx = buffer.getContext('2d');

  var cols = 0;
  var rows = 0;
  var scale = 1;
  var targets = null;    // Uint8Array of band indices, one per cell
  var thresholds = null; // Float32Array reveal times, one per cell
  var image = null;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- noise -------------------------------------------------------------- */

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function makeLattice(rand, w, h) {
    var g = new Float32Array(w * h);
    for (var i = 0; i < g.length; i++) g[i] = rand();
    return { g: g, w: w, h: h };
  }

  function at(n, x, y) {
    var xi = ((x % n.w) + n.w) % n.w;
    var yi = ((y % n.h) + n.h) % n.h;
    return n.g[yi * n.w + xi];
  }

  // Bilinear sample with smoothstep easing -> rounded blobs before quantizing.
  function sample(n, x, y) {
    var x0 = Math.floor(x);
    var y0 = Math.floor(y);
    var fx = x - x0;
    var fy = y - y0;
    var sx = fx * fx * (3 - 2 * fx);
    var sy = fy * fy * (3 - 2 * fy);

    var a = at(n, x0, y0);
    var b = at(n, x0 + 1, y0);
    var c = at(n, x0, y0 + 1);
    var d = at(n, x0 + 1, y0 + 1);

    return (a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy;
  }

  function bandFor(v) {
    for (var i = 0; i < CUTS.length; i++) {
      if (v < CUTS[i]) return i;
    }
    return CUTS.length;
  }

  /* --- layout ------------------------------------------------------------- */

  function measure() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = host.getBoundingClientRect();
    var cssW = Math.max(1, rect.width || window.innerWidth);
    var cssH = Math.max(1, rect.height || window.innerHeight);

    // Snap the cell to whole device pixels so block edges never land on a
    // fractional boundary and get antialiased into mush.
    scale = Math.max(1, Math.round(CELL * dpr));

    cols = Math.ceil((cssW * dpr) / scale);
    rows = Math.ceil((cssH * dpr) / scale);

    canvas.width = cols * scale;
    canvas.height = rows * scale;
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';

    buffer.width = cols;
    buffer.height = rows;

    image = bctx.createImageData(cols, rows);
    ctx.imageSmoothingEnabled = false;
  }

  /* --- pattern ------------------------------------------------------------ */

  function computeTargets() {
    var rand = mulberry32(SEED);

    // Base lattice resolution controls blob size. Tied to the cell count so
    // blobs stay visually consistent across viewport sizes.
    var baseX = Math.max(4, Math.round(cols / BLOB));
    var baseY = Math.max(3, Math.round(rows / BLOB));

    var lattices = [];
    for (var o = 0; o < OCTAVES; o++) {
      var f = 1 << o;
      lattices.push(makeLattice(rand, baseX * f + 1, baseY * f + 1));
    }

    var ditherRand = mulberry32(SEED ^ 0x9e3779b9);
    var sweepRand = mulberry32(SEED ^ 0x85ebca6b);

    targets = new Uint8Array(cols * rows);
    thresholds = new Float32Array(cols * rows);

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var amp = 1;
        var norm = 0;
        var v = 0;

        for (var i = 0; i < OCTAVES; i++) {
          var f2 = 1 << i;
          v += amp * sample(lattices[i], (c / cols) * baseX * f2, (r / rows) * baseY * f2);
          norm += amp;
          amp *= GAIN;
        }
        v /= norm;

        var band = bandFor(v);

        // Flip cells sitting close to a threshold. This is what produces the
        // scattered single-pixel fringe that reads as "digital" camo rather
        // than smooth blobs.
        for (var k = 0; k < CUTS.length; k++) {
          if (Math.abs(v - CUTS[k]) < DITHER && ditherRand() > 0.55) {
            band = v < CUTS[k] ? k + 1 : k;
            break;
          }
        }

        var idx = r * cols + c;
        targets[idx] = band;

        // Reveal order: mostly top-to-bottom so it agrees with the scanline
        // sweeping the page, with a slight lean to the right and per-cell
        // jitter so the wavefront is ragged instead of a ruler edge.
        var base = 0.78 * (r / rows) + 0.22 * (c / cols);
        thresholds[idx] = base * 0.76 + sweepRand() * 0.24;
      }
    }
  }

  /* --- paint -------------------------------------------------------------- */

  function paint(progress, noiseRand) {
    var data = image.data;
    var total = cols * rows;

    for (var i = 0; i < total; i++) {
      var grey;

      if (progress >= 1) {
        grey = BANDS[targets[i]];
      } else {
        var t = thresholds[i];
        if (t <= progress) {
          grey = BANDS[targets[i]];
        } else if (t <= progress + BOOT_BAND) {
          // Live wavefront: full-range static, re-rolled every frame.
          grey = BANDS[(noiseRand() * BANDS.length) | 0];
        } else {
          // Ahead of the wave: dark static, so the field reads as raw signal
          // waiting to be decoded rather than as an empty black box.
          grey = BANDS[(noiseRand() * 2) | 0];
        }
      }

      var p = i * 4;
      data[p] = grey;
      data[p + 1] = grey;
      data[p + 2] = grey;
      data[p + 3] = 255;
    }

    bctx.putImageData(image, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(buffer, 0, 0, cols, rows, 0, 0, canvas.width, canvas.height);
  }

  /* --- boot --------------------------------------------------------------- */

  var booting = false;

  function boot() {
    if (reduceMotion) {
      paint(1);
      return;
    }

    booting = true;
    var start = performance.now();
    var noiseRand = mulberry32((Math.random() * 0xffffffff) | 0);

    function frame(now) {
      var p = (now - start) / BOOT_MS;
      if (p >= 1) {
        paint(1);
        booting = false;
        return;
      }
      paint(p, noiseRand);
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function render(animate) {
    measure();
    computeTargets();
    if (animate) boot();
    else paint(1);
  }

  render(true);

  var resizeTimer;
  var lastW = window.innerWidth;

  window.addEventListener('resize', function () {
    // Ignore pure height changes from mobile browser chrome collapsing.
    if (Math.abs(window.innerWidth - lastW) < 1) return;
    lastW = window.innerWidth;

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (booting) return;
      render(false);
    }, 150);
  });
})();
