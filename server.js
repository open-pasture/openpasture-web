const express = require('express');
const { Resend } = require('resend');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'hello@openpasture.com';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

app.use(express.json());

// legacy pages -> manifesto-era equivalents
app.get(['/mission', '/mission.html'], (req, res) => res.redirect(301, '/manifesto'));
app.get(['/pricing', '/pricing.html'], (req, res) => res.redirect(301, '/#early-access'));

app.use(express.static(path.join(__dirname), {
  extensions: ['html'],
}));

app.post('/api/contact', async (req, res) => {
  const { name, email, message, source, page } = req.body;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const sanitize = (str) => {
    if (!str) return '';
    return String(str).replace(/[<>&"']/g, (c) => ({
      '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;'
    }[c]));
  };

  const safeName = sanitize(name) || '(not provided)';
  const safeEmail = sanitize(email);
  const safeMessage = sanitize(message) || '(no message)';
  const safeSource = sanitize(source) || 'unknown';
  const safePage = sanitize(page) || 'unknown';
  const timestamp = new Date().toISOString();

  const subject = `[OpenPasture] New lead: ${safeSource} — ${safeEmail}`;

  const html = `
    <div style="font-family: 'Courier New', monospace; max-width: 560px; margin: 0 auto; color: #1a1e18;">
      <div style="background: #2a3028; color: #f6f8f4; padding: 16px 20px; font-size: 13px;">
        <strong>openpasture</strong> — new lead
      </div>
      <div style="background: #ffffff; border: 1px solid #c4d0c0; padding: 24px 20px;">
        <div style="background: #f2f6ee; border: 1px solid #c0d0a8; padding: 6px 12px; display: inline-block; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #4a6a2e; margin-bottom: 16px;">
          ${safeSource}
        </div>

        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #647060; vertical-align: top; width: 80px;">source</td>
            <td style="padding: 8px 0;"><strong>${safeSource}</strong> from <strong>${safePage}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #647060; vertical-align: top;">name</td>
            <td style="padding: 8px 0;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #647060; vertical-align: top;">email</td>
            <td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #4a6a2e; font-weight: bold;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #647060; vertical-align: top;">message</td>
            <td style="padding: 8px 0;">${safeMessage}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #647060; vertical-align: top;">time</td>
            <td style="padding: 8px 0; font-size: 12px; color: #647060;">${timestamp}</td>
          </tr>
        </table>
      </div>
      <div style="background: #f6f8f4; border: 1px solid #c4d0c0; border-top: none; padding: 12px 20px; font-size: 11px; color: #647060;">
        sent by openpasture lead capture
      </div>
    </div>
  `;

  if (!resend) {
    console.log('RESEND_API_KEY not set — logging lead locally');
    console.log({ name: safeName, email: safeEmail, source: safeSource, page: safePage, message: safeMessage });
    return res.json({ success: true });
  }

  try {
    await resend.emails.send({
      from: 'OpenPasture <onboarding@resend.dev>',
      to: [CONTACT_EMAIL],
      replyTo: email,
      subject,
      html,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`openpasture server running on port ${PORT}`);
});
