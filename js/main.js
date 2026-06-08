/* ============================================================
   MAIN.JS — Niyam Rathod Portfolio
   Requires: GSAP 3, ScrollTrigger, Lenis (loaded via CDN)
   ============================================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = !window.matchMedia('(pointer: fine)').matches;

// Full animations only on desktop with motion enabled.
// On mobile: content is always visible, no hiding, no load sequence.
const shouldAnimate = !prefersReducedMotion && !isTouch;

/* ── Lenis smooth scroll (desktop only) ────────────────────── */
if (shouldAnimate && typeof Lenis !== 'undefined') {
  const lenis = new Lenis({
    duration: 1.25,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time) {
    lenis.raf(time);
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* ── GSAP plugin registration ───────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── Set initial hidden states (desktop only) ───────────────── */
// On mobile we skip this entirely so content is always visible.
if (shouldAnimate) {
  gsap.set('.hero__name',         { opacity: 0 });
  gsap.set('.nav__brand',         { opacity: 0, y: -10 });
  gsap.set('.nav__link',          { opacity: 0, y: -10 });
  gsap.set('.hero__tagline',      { opacity: 0, y: 20 });
  gsap.set('.hero__links',        { opacity: 0, y: 20 });
  gsap.set('.hero__scroll-hint',  { opacity: 0 });
}

/* ── Custom cursor (desktop only) ───────────────────────────── */
(function initCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor || isTouch) {
    if (cursor) cursor.style.display = 'none';
    return;
  }

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  gsap.ticker.add(() => {
    cx += (mx - cx) * 0.11;
    cy += (my - cy) * 0.11;
    gsap.set(cursor, { x: cx, y: cy });
  });

  document.querySelectorAll('a, button, .magnetic').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
  });
})();

/* ── Nav: blur-glass on scroll ──────────────────────────────── */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  ScrollTrigger.create({
    start: 'top -8',
    onEnter:     () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });
})();

/* ── Page-load intro animation (desktop only) ───────────────── */
function initLoad() {
  if (!shouldAnimate) return; // Mobile: everything already visible

  // Wrap each hero name line in a .word-inner span for the clip reveal
  document.querySelectorAll('.hero__name-line').forEach(line => {
    const text = line.textContent.trim();
    line.innerHTML = `<span class="word-inner" aria-hidden="true">${text}</span>`;
  });

  gsap.set('.hero__name', { opacity: 1 });
  gsap.set('.hero__name-line .word-inner', { y: '108%' });

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl
    .to('.hero__name-line .word-inner', { y: 0, duration: 1.2, stagger: 0.1 }, 0)
    .to('.nav__brand', { opacity: 1, y: 0, duration: 0.55 }, 0.35)
    .to('.nav__link',  { opacity: 1, y: 0, duration: 0.45, stagger: 0.07 }, 0.45)
    .to('.hero__tagline',      { opacity: 1, y: 0, duration: 0.65 }, 0.6)
    .to('.hero__links',        { opacity: 1, y: 0, duration: 0.6  }, 0.75)
    .to('.hero__scroll-hint',  { opacity: 1,        duration: 0.5  }, 1.0);
}

window.addEventListener('load', initLoad);

/* ── Scroll-triggered reveals (desktop only) ────────────────── */
(function initScrollReveal() {
  if (!shouldAnimate) return;

  gsap.utils.toArray('.section-label, .section-heading').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.85, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 87%', once: true } }
    );
  });

  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 48 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'expo.out',
        delay: (i % 2) * 0.11,
        scrollTrigger: { trigger: card, start: 'top 86%', once: true } }
    );
  });

  gsap.utils.toArray('.about__text').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
        delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    );
  });

  gsap.utils.toArray('.skills-group').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out',
        delay: i * 0.09,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
    );
  });

  gsap.fromTo('.contact__inner > *',
    { opacity: 0, y: 32 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1,
      scrollTrigger: { trigger: '.contact', start: 'top 82%', once: true } }
  );

  gsap.fromTo('.footer__wordmark',
    { x: -80, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: '.footer', start: 'top 92%', once: true } }
  );
})();

/* ── Magnetic buttons (desktop only) ───────────────────────── */
(function initMagnetic() {
  if (!shouldAnimate) return;

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.3;
      const y = (e.clientY - r.top  - r.height / 2) * 0.3;
      gsap.to(el, { x, y, duration: 0.45, ease: 'expo.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  });
})();
