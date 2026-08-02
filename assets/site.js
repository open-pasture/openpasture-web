// shared site behavior: icons, mobile menu, early-access form
(function () {
  if (window.lucide) lucide.createIcons();

  var toggle = document.querySelector('.mobile-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var menu = document.querySelector('.mobile-menu');
      if (menu) menu.classList.toggle('open');
    });
  }

  var form = document.querySelector('.ea-form');
  if (form) {
    var status = form.querySelector('.ea-status');
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var email = form.querySelector('[name=email]').value.trim();
      var name = form.querySelector('[name=name]').value.trim();
      var message = form.querySelector('[name=message]').value.trim();
      if (!email || email.indexOf('@') === -1) {
        status.textContent = 'a valid email is required.';
        status.classList.add('error');
        return;
      }
      status.classList.remove('error');
      status.textContent = 'sending…';
      try {
        var res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message,
            source: 'early-access',
            page: location.pathname,
          }),
        });
        if (!res.ok) throw new Error('request failed');
        form.querySelectorAll('input, textarea, button').forEach(function (el) { el.disabled = true; });
        status.textContent = 'received. we read every one of these.';
      } catch (err) {
        status.textContent = 'something failed on our end — email hello@openpasture.com instead.';
        status.classList.add('error');
      }
    });
  }
})();
