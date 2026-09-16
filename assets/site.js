(function () {
  'use strict';
  var form = document.querySelector('form.ask');
  var out = form && form.querySelector('output');
  var btn = form && form.querySelector('button[type="submit"]');
  if (!form || !out || !btn) return;
  var f = form.elements;
  // The confirmation and failure sentences live once, in the fragment's
  // hidden #sent and #failed paragraphs, which the no-JavaScript path reveals.
  var sentEl = document.getElementById('sent'), failedEl = document.getElementById('failed');
  var sentText = sentEl ? sentEl.textContent : 'Received.';
  var failedText = failedEl ? failedEl.textContent : 'That did not send. Try again in a moment.';
  // The status line doubles as a description, so it needs an id to point
  // aria-describedby at. The page gives it one; this covers a fragment that
  // does not. The Send button describes itself with it from the start, so
  // whatever the line says is read again when focus comes back to the button.
  if (!out.id) out.id = 'ask-out';
  btn.setAttribute('aria-describedby', out.id);
  // say(msg, state, field): field is the input an error is about, if any.
  // Only an error about the address marks the email field invalid and ties
  // the line to it. A rate limit, an unconfigured form, a failed send or a
  // network failure is not the field's fault, so those stay in the live
  // region and on the button alone.
  var say = function (msg, state, field) {
    out.textContent = msg;
    if (state) out.setAttribute('data-state', state); else out.removeAttribute('data-state');
    f.email.removeAttribute('aria-invalid');
    f.email.removeAttribute('aria-describedby');
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', out.id);
    }
  };
  // A busy flag instead of btn.disabled: disabling the focused button drops
  // focus to <body>, which sends a keyboard or screen-reader user back to
  // the top of the page after pressing Send.
  var sending = false;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    var email = (f.email.value || '').trim();
    if (!email || email.indexOf('@') === -1) { say('Enter an email address so Cody can reply.', 'err', f.email); f.email.focus(); return; }
    sending = true; btn.setAttribute('aria-disabled', 'true'); say('Sending.');
    fetch('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: f.name.value, email: email, message: f.message.value, page: location.pathname })
    }).then(function (r) {
      // server.js answers every failure with { error } in plain words (not
      // configured, rate limited, bad address). Show that when it is there.
      // A network failure or a body that is not JSON gets the generic line
      // instead of the browser's own wording.
      return r.json().catch(function () { return {}; }).then(function (b) {
        if (!r.ok) { var err = new Error(); err.said = b.error; err.status = r.status; throw err; }
      });
    })
      .then(function () { form.reset(); say(sentText, 'ok'); })
      // server.js answers 400 only when the address fails its check, its one
      // field-level error, so that is the one failure pinned to the input.
      .catch(function (err) { say((err && err.said) || failedText, 'err', err && err.status === 400 ? f.email : null); })
      .then(function () { sending = false; btn.removeAttribute('aria-disabled'); });
  });
})();

(function () {
  'use strict';
  if (!('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Section content fades up once as it scrolls into view. The timer adds
  // `in` to everything regardless, so nothing stays hidden if the observer
  // never fires.
  var els = document.querySelectorAll('main > section:not(.hero):not(.page) > *');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  els.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 1500);

  // The drawings loop (marching dashes, blinking markers) for as long as the
  // page is open. Pause them while the drawing is off screen; op.css maps
  // `.paused` to animation-play-state: paused on everything inside.
  var figs = document.querySelectorAll('svg.fig, svg.map, .frame svg');
  var pauser = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { e.target.classList.toggle('paused', !e.isIntersecting); });
  });
  figs.forEach(function (el) { pauser.observe(el); });
})();

(function () {
  'use strict';
  // iOS Safari only paints :active on a tap once the page listens for touch.
  // The listener does nothing itself; op.css carries the press states.
  document.addEventListener('touchstart', function () {}, { passive: true });

  // Each drawing's .scroll wrapper ships tabindex="0" so a keyboard can reach
  // one that scrolls sideways without JavaScript. Where the whole drawing
  // fits there is nothing to scroll, so the stop is dropped; it comes back if
  // the viewport narrows. A wrapper that currently has focus keeps it.
  var wrappers = document.querySelectorAll('.scroll');
  if (!wrappers.length) return;
  var sync = function () {
    wrappers.forEach(function (el) {
      if (el.scrollWidth > el.clientWidth) el.setAttribute('tabindex', '0');
      else if (el !== document.activeElement) el.removeAttribute('tabindex');
    });
  };
  // Where scroll-driven animations are missing (WebKit as of Safari 18), the
  // thumb under a drawing is placed from the scroll position instead.
  if (!('CSS' in window && CSS.supports && CSS.supports('animation-timeline: scroll()'))) {
    wrappers.forEach(function (el) {
      var at = function () {
        var max = el.scrollWidth - el.clientWidth;
        el.setAttribute('data-at', el.scrollLeft < 2 ? 'start' : el.scrollLeft > max - 2 ? 'end' : 'mid');
      };
      at();
      el.addEventListener('scroll', at, { passive: true });
    });
  }
  sync();
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(sync);
    wrappers.forEach(function (el) { ro.observe(el); });
  } else {
    addEventListener('resize', sync);
  }
})();

(function () {
  'use strict';
  // The phone menu is a native details element and works without this. Here
  // it also closes on Escape, on a tap outside it, and once a link is chosen,
  // and it gives focus back to the summary when closed from the keyboard.
  var menu = document.querySelector('details.menu');
  if (!menu) return;
  var summary = menu.querySelector('summary');
  var close = function (refocus) { if (menu.open) { menu.open = false; if (refocus) summary.focus(); } };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(true); });
  document.addEventListener('click', function (e) { if (!menu.contains(e.target)) close(false); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) close(false); });
})();
