(function () {
  'use strict';
  var form = document.querySelector('form.ask');
  if (!form) return;
  var out = form.querySelector('output');
  var btn = form.querySelector('button[type="submit"]');
  var say = function (msg, state) {
    out.textContent = msg;
    if (state) out.setAttribute('data-state', state); else out.removeAttribute('data-state');
  };
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = (form.email.value || '').trim();
    if (!email || email.indexOf('@') === -1) { say('Enter an email address so Cody can reply.', 'err'); form.email.focus(); return; }
    btn.disabled = true; say('Sending.');
    fetch('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name.value, email: email, message: form.message.value, source: 'involved', page: location.pathname })
    }).then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function () { form.reset(); say('Received. Cody reads these himself.', 'ok'); })
      .catch(function () { say('That did not send. Email works too.', 'err'); })
      .then(function () { btn.disabled = false; });
  });
})();

(function () {
  'use strict';
  if (!('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var els = document.querySelectorAll('main > section:not(.hero):not(.page) > *');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  els.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  setTimeout(function () { els.forEach(function (el) { el.classList.add('in'); }); }, 1500);
})();
