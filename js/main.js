/* ============================================================
   MAIN.JS — Niyam Rathod Portfolio
   Requires: GSAP 3, ScrollTrigger, Lenis (all loaded via CDN)
   ============================================================ */

const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Lenis smooth scroll ────────────────────────────────────── */
let lenis;
if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
  lenis = new Lenis({
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

/* ── Set initial hidden states before load fires ────────────── */
// (prevents elements flashing visible before JS has a chance to animate them)
gsap.set('.nav__brand', { opacity: 0, y: -10 });
gsap.set('.nav__link',  { opacity: 0, y: -10 });
gsap.set('.hero__tagline',    { opacity: 0, y: 20 });
gsap.set('.hero__links',      { opacity: 0, y: 20 });
gsap.set('.hero__scroll-hint',{ opacity: 0 });
// hero__name opacity is controlled in CSS (opacity:0) and revealed inside initLoad

/* ── Custom cursor ──────────────────────────────────────────── */
(function initCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  if (!window.matchMedia('(pointer: fine)').matches) {
    cursor.style.display = 'none';
    return;
  }

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx, cy = my;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  gsap.ticker.add(() => {
    const lerp = prefersReducedMotion ? 1 : 0.11;
    cx += (mx - cx) * lerp;
    cy += (my - cy) * lerp;
    gsap.set(cursor, { x: cx, y: cy });
  });

  // Grow cursor over interactive elements
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

/* ── Page-load intro animation ──────────────────────────────── */
function initLoad() {
  // Wrap each hero name line in a .word-inner span for the clip reveal
  document.querySelectorAll('.hero__name-line').forEach(line => {
    const text = line.textContent.trim();
    // aria-hidden duplicate — screen readers use the visible text directly
    line.innerHTML = `<span class="word-inner" aria-hidden="true">${text}</span>`;
  });

  if (prefersReducedMotion) {
    // Show everything immediately, no animation
    gsap.set(
      ['.hero__name', '.nav__brand', '.nav__link',
       '.hero__tagline', '.hero__links', '.hero__scroll-hint'],
      { opacity: 1, y: 0, clearProps: 'all' }
    );
    gsap.set('.hero__name-line .word-inner', { y: 0 });
    return;
  }

  // Position name children below clip before revealing parent
  gsap.set('.hero__name', { opacity: 1 });
  gsap.set('.hero__name-line .word-inner', { y: '108%' });

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl
    // Name lines slide up through clip mask
    .to('.hero__name-line .word-inner', {
      y: 0,
      duration: 1.2,
      stagger: 0.1,
    }, 0)
    // Nav
    .to('.nav__brand', { opacity: 1, y: 0, duration: 0.55 }, 0.35)
    .to('.nav__link',  { opacity: 1, y: 0, duration: 0.45, stagger: 0.07 }, 0.45)
    // Below-name content
    .to('.hero__tagline',     { opacity: 1, y: 0, duration: 0.65 }, 0.6)
    .to('.hero__links',       { opacity: 1, y: 0, duration: 0.6  }, 0.75)
    .to('.hero__scroll-hint', { opacity: 1,        duration: 0.5  }, 1.0);
}

window.addEventListener('load', initLoad);

/* ── Scroll-triggered reveals ───────────────────────────────── */
(function initScrollReveal() {
  if (prefersReducedMotion) return;

  // Section labels and headings
  gsap.utils.toArray('.section-label, .section-heading').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 28 },
      {
        opacity: 1, y: 0,
        duration: 0.85, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 87%', once: true },
      }
    );
  });

  // Project cards — staggered by column position
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 48 },
      {
        opacity: 1, y: 0,
        duration: 0.75, ease: 'expo.out',
        delay: (i % 2) * 0.11,
        scrollTrigger: { trigger: card, start: 'top 86%', once: true },
      }
    );
  });

  // About text paragraphs
  gsap.utils.toArray('.about__text').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 22 },
      {
        opacity: 1, y: 0,
        duration: 0.7, ease: 'expo.out',
        delay: i * 0.1,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
  });

  // Skills groups
  gsap.utils.toArray('.skills-group').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 18 },
      {
        opacity: 1, y: 0,
        duration: 0.6, ease: 'expo.out',
        delay: i * 0.09,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }
    );
  });

  // Contact block — child elements stagger in
  gsap.fromTo('.contact__inner > *',
    { opacity: 0, y: 32 },
    {
      opacity: 1, y: 0,
      duration: 0.8, ease: 'expo.out',
      stagger: 0.1,
      scrollTrigger: { trigger: '.contact', start: 'top 82%', once: true },
    }
  );

  // Footer wordmark slides in from left
  gsap.fromTo('.footer__wordmark',
    { x: -80, opacity: 0 },
    {
      x: 0, opacity: 1,
      duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: '.footer', start: 'top 92%', once: true },
    }
  );
})();

/* ── Magnetic buttons ───────────────────────────────────────── */
(function initMagnetic() {
  if (prefersReducedMotion) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

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
