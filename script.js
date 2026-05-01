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
