/* ============================================================
   BIG MART — STATIC PAGES (Contact + FAQ)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- CONTACT FORM ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('ctName').value.trim();
      const email = document.getElementById('ctEmail').value.trim();
      const subject = document.getElementById('ctSubject').value.trim();
      const message = document.getElementById('ctMessage').value.trim();

      if (!name || !email || !subject || !message) {
        if (typeof showToast === 'function') showToast('Please fill in all fields.', 'warning');
        return;
      }
      if (!email.includes('@') || !email.includes('.')) {
        if (typeof showToast === 'function') showToast('Please enter a valid email address.', 'warning');
        return;
      }

      if (typeof showToast === 'function') {
        showToast("Thanks! We'll get back to you soon.", 'success');
      }
      contactForm.reset();
    });
  }

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-question');
    btn?.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
});