/* ════════════════════════════════════════════════════
   RBM CONSTRUCTORA — script.js
   ════════════════════════════════════════════════════ */

'use strict';

/* ── Helpers ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ════════════════════════════════════════════════════
   1. HEADER — Scroll behaviour
   ════════════════════════════════════════════════════ */
(function initHeader() {
  const header = $('#header');
  if (!header) return;

  const update = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ════════════════════════════════════════════════════
   2. BURGER MENU
   ════════════════════════════════════════════════════ */
(function initBurger() {
  const burger  = $('#burger');
  const nav     = $('#mobileNav');
  const overlay = $('#navOverlay');
  if (!burger || !nav) return;

  const open = () => {
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    nav.classList.add('open');
    nav.setAttribute('aria-hidden', 'false');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    nav.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    burger.classList.contains('open') ? close() : open();
  });
  overlay.addEventListener('click', close);

  // Close on link tap
  $$('[data-close]', nav).forEach(link => {
    link.addEventListener('click', close);
  });
})();


/* ════════════════════════════════════════════════════
   3. HERO PARTICLES
   ════════════════════════════════════════════════════ */
(function initParticles() {
  const container = $('#particles');
  if (!container) return;

  const count = 14;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'hero__particle';

    const left     = 5 + Math.random() * 90;           // %
    const height   = 60 + Math.random() * 180;          // px
    const delay    = Math.random() * 7;                  // s
    const duration = 7 + Math.random() * 6;             // s

    el.style.cssText = `
      left: ${left}%;
      height: ${height}px;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
    `;
    container.appendChild(el);
  }
})();


/* ════════════════════════════════════════════════════
   4. SCROLL REVEAL — IntersectionObserver
   ════════════════════════════════════════════════════ */
(function initReveal() {
  // Hero emblem
  const emblem = $('.emblem');
  if (emblem) {
    // Trigger after a short delay on load
    setTimeout(() => emblem.classList.add('visible'), 150);
  }

  // Generic [data-animate] elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger children if data-animate="stagger"
          if (entry.target.dataset.animate === 'stagger') {
            [...entry.target.children].forEach((child, ci) => {
              setTimeout(() => child.classList.add('visible'), ci * 120);
            });
          }
          // Small delay per item in list
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, Number(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  $$('[data-animate]').forEach((el, i) => {
    // Stagger sibling services/gallery items
    if (el.closest('.services-list') || el.closest('.gallery')) {
      el.dataset.delay = (i % 6) * 80;
    }
    observer.observe(el);
  });
})();


/* ════════════════════════════════════════════════════
   5. COUNTER ANIMATION
   ════════════════════════════════════════════════════ */
(function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animate = (el) => {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
})();


/* ════════════════════════════════════════════════════
   6. VIDEO VERTICAL (sección nosotros)
   ════════════════════════════════════════════════════ */
(function initVideoVertical() {
  const video   = document.getElementById('videoVertical');
  const overlay = document.getElementById('videoOverlay');
  if (!video || !overlay) return;

  overlay.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      overlay.classList.add('hidden');
    } else {
      video.pause();
      overlay.classList.remove('hidden');
    }
  });

  video.addEventListener('ended', () => {
    overlay.classList.remove('hidden');
  });
})();

/* ════════════════════════════════════════════════════
   7. GALLERY — Touch / Drag + Dots
   ════════════════════════════════════════════════════ */
(function initGallery() {
  const track = $('#galleryTrack');
  const dots  = $$('.gallery__dot');
  if (!track || !dots.length) return;

  let isDragging = false;
  let startX     = 0;
  let scrollLeft = 0;

  // Touch drag
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX     = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  track.addEventListener('mouseleave', () => {
    isDragging = false;
    track.style.cursor = 'grab';
  });
  track.addEventListener('mouseup', () => {
    isDragging = false;
    track.style.cursor = 'grab';
  });
  track.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x    = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4;
    track.scrollLeft = scrollLeft - walk;
  });

  // Update active dot on scroll
  const updateDots = () => {
    const cardWidth = track.querySelector('.gallery__card')?.offsetWidth || 0;
    const gap       = 16;
    const index     = Math.round(track.scrollLeft / (cardWidth + gap));
    dots.forEach((dot, i) => {
      dot.classList.toggle('gallery__dot--active', i === index);
    });
  };

  track.addEventListener('scroll', updateDots, { passive: true });

  // Dot click — scroll to card
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index     = parseInt(dot.dataset.index, 10);
      const cardWidth = track.querySelector('.gallery__card')?.offsetWidth || 0;
      const gap       = 16;
      track.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
    });
  });
})();


/* ════════════════════════════════════════════════════
   8. SMOOTH SECTION TRANSITIONS
     (light gold line that sweeps in on section entry)
   ════════════════════════════════════════════════════ */
(function initSectionLines() {
  // Inject a thin decorative top-line into each section
  $$('.section').forEach((sec) => {
    const line = document.createElement('div');
    line.style.cssText = `
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(to right, transparent, rgba(196,145,79,0.25), transparent);
      pointer-events: none;
    `;
    if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
    sec.prepend(line);
  });
})();


/* ════════════════════════════════════════════════════
   9. ACTIVE NAV LINK on scroll
   ════════════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = $$('section[id]');
  const links    = $$('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => {
            const href = link.getAttribute('href');
            link.style.color = href === `#${entry.target.id}`
              ? 'var(--gold)'
              : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((sec) => observer.observe(sec));
})();


/* ════════════════════════════════════════════════════
   10. WA Float — hide on CTA section visible
   ════════════════════════════════════════════════════ */
(function initWaFloat() {
  const btn  = $('.wa-float');
  const cta  = $('#contacto');
  if (!btn || !cta) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      btn.style.opacity    = entry.isIntersecting ? '0' : '1';
      btn.style.pointerEvents = entry.isIntersecting ? 'none' : 'all';
    },
    { threshold: 0.3 }
  );
  observer.observe(cta);
})();

/* ════════════════════════════════════════════════════
   11. PING-PONG LOGO — dos videos, sin seeking, sin trabas
   ════════════════════════════════════════════════════ */
(function initPingPong() {
  const vidFwd = document.getElementById('vidForward');
  const vidRev = document.getElementById('vidReverse');
  if (!vidFwd || !vidRev) return;

  // Cuando termina el video de ida → muestra el de vuelta
  vidFwd.addEventListener('ended', () => {
    vidFwd.classList.add('emblem__video--hidden');
    vidRev.classList.remove('emblem__video--hidden');
    vidRev.currentTime = 0;
    vidRev.play();
  });

  // Cuando termina el video de vuelta → muestra el de ida
  vidRev.addEventListener('ended', () => {
    vidRev.classList.add('emblem__video--hidden');
    vidFwd.classList.remove('emblem__video--hidden');
    vidFwd.currentTime = 0;
    vidFwd.play();
  });

  // Arrancar
  vidFwd.play();
})();
