// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Booking form — submits to Formspree (which forwards to Jose's email).
// If the form action still has the placeholder, we fall back to a mailto: link
// so the site is functional immediately even before Formspree is wired up.
const form = document.getElementById('booking-form');
const note = document.getElementById('form-note');
const JOSE_PHONE = '+16827129271';
// Email-to-SMS gateway. T-Mobile: <number>@tmomail.net.
// Bookings get cc'd here so a text lands on the phone in real time.
const SMS_GATEWAY = '9784732513@tmomail.net';
const NOTIFY_EMAIL = 'jose@lawnsbyjv.com';

form.addEventListener('submit', async (e) => {
  const action = form.getAttribute('action') || '';
  const usingPlaceholder = action.includes('YOUR_FORM_ID');

  if (usingPlaceholder) {
    e.preventDefault();
    // Build a mailto fallback so the booking goes through even before
    // Formspree is configured. Opens the customer's mail client.
    const data = new FormData(form);
    const subject = encodeURIComponent('Booking request — Lawns By Jose V');
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\n` +
      `Phone: ${data.get('phone')}\n` +
      `Email: ${data.get('email')}\n` +
      `Address: ${data.get('address')}\n` +
      `Service: ${data.get('service')}\n` +
      `Preferred Day: ${data.get('day')}\n\n` +
      `Notes:\n${data.get('notes') || '(none)'}`
    );
    note.className = 'form-note success';
    note.textContent = 'Opening your email app… you can also text Jose at 682-712-9271.';
    const cc = encodeURIComponent(SMS_GATEWAY);
    window.location.href = `mailto:${NOTIFY_EMAIL}?cc=${cc}&subject=${subject}&body=${body}`;
    return;
  }

  // Real submission via Formspree (async fetch so we stay on page)
  e.preventDefault();
  note.className = 'form-note';
  note.textContent = 'Sending…';

  try {
    const res = await fetch(action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      form.reset();
      note.className = 'form-note success';
      note.textContent = "Got it — Jose will reach out shortly. Need it fast? Text 682-712-9271.";
    } else {
      throw new Error('Submission failed');
    }
  } catch (err) {
    note.className = 'form-note error';
    note.innerHTML = 'Something went wrong. Please call or text <a href="sms:+16827129271">682-712-9271</a>.';
  }
});
