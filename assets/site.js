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
  var say = function (msg, state) {
    out.textContent = msg;
    if (state) out.setAttribute('data-state', state); else out.removeAttribute('data-state');
  };
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = (f.email.value || '').trim();
    if (!email || email.indexOf('@') === -1) { say('Enter an email address so Cody can reply.', 'err'); f.email.focus(); return; }
    btn.disabled = true; say('Sending.');
    fetch('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: f.name.value, email: email, message: f.message.value, page: location.pathname })
    }).then(function (r) {
      // server.js answers every failure with { error } in plain words (not
      // configured, rate limited, bad address). Show that when it is there.
      // A network failure or a body that is not JSON gets the generic line
      // instead of the browser's own wording.
      return r.json().catch(function () { return {}; }).then(function (b) {
        if (!r.ok) { var err = new Error(); err.said = b.error; throw err; }
      });
    })
      .then(function () { form.reset(); say(sentText, 'ok'); })
      .catch(function (err) { say((err && err.said) || failedText, 'err'); })
      .then(function () { btn.disabled = false; });
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
