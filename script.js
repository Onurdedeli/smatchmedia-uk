// Sticky nav background on scroll
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 30) nav.classList.add('is-scrolled');
  else nav.classList.remove('is-scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu toggle
const toggle = document.querySelector('.nav__toggle');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav__links a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// Ad unit filter
const chips = document.querySelectorAll('.chip');
const units = document.querySelectorAll('.unit');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => {
      c.classList.remove('chip--active');
      c.setAttribute('aria-selected', 'false');
    });
    chip.classList.add('chip--active');
    chip.setAttribute('aria-selected', 'true');
    const filter = chip.dataset.filter;
    units.forEach(unit => {
      const matches = filter === 'all' || unit.dataset.cat === filter;
      unit.style.display = matches ? '' : 'none';
    });
  });
});

// Reveal on scroll
const revealTargets = document.querySelectorAll(
  '.section__head, .card, .unit, .region, .connector, .stat, .hero__content, .hero__visual'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => io.observe(el));

// Position .unit__brand inside .unit__visual (it lives outside in markup for semantic flow)
document.querySelectorAll('.unit').forEach(unit => {
  const brand = unit.querySelector('.unit__brand');
  const visual = unit.querySelector('.unit__visual');
  if (brand && visual && brand.parentElement !== visual) {
    visual.appendChild(brand);
  }
});

// Contact form (Web3Forms) → success state
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const successPanel = document.getElementById('contact-success');
  const submitBtn = contactForm.querySelector('.cform__submit');
  const submitLabel = contactForm.querySelector('.cform__submit-label');
  const errorBox = contactForm.querySelector('.cform__error');

  const showError = (msg) => {
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.hidden = false;
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errorBox) errorBox.hidden = true;

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const accessKey = contactForm.querySelector('input[name="access_key"]')?.value || '';
    if (accessKey.includes('REPLACE_WITH')) {
      showError('Form is not configured yet. Please email info@smatch.media.');
      return;
    }

    submitBtn.classList.add('is-loading');
    if (submitLabel) submitLabel.textContent = 'Sending…';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(contactForm),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        contactForm.hidden = true;
        if (successPanel) successPanel.hidden = false;
      } else {
        showError((data && data.message) || 'Something went wrong. Please email info@smatch.media.');
        submitBtn.classList.remove('is-loading');
        if (submitLabel) submitLabel.textContent = 'Send message';
      }
    } catch (err) {
      showError('Network error. Please check your connection or email info@smatch.media.');
      submitBtn.classList.remove('is-loading');
      if (submitLabel) submitLabel.textContent = 'Send message';
    }
  });
}
