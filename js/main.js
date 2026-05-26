/* ============================================
   VEEL CONSULTING — MAIN JS
   ============================================ */
(function () {
  'use strict';

  // ── THEME ──────────────────────────────────
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const stored = localStorage.getItem('veel-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const setTheme = (t) => {
    html.setAttribute('data-theme', t);
    localStorage.setItem('veel-theme', t);
  };
  if (stored) setTheme(stored);
  else if (prefersDark) setTheme('dark');
  else setTheme('dark'); // default to dark
  themeBtn?.addEventListener('click', () => {
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // ── NAV SCROLL ─────────────────────────────
  const nav = document.getElementById('nav');
  const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 48);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── MOBILE BURGER ──────────────────────────
  const burger = document.getElementById('navBurger');
  const mobileNav = document.getElementById('navMobile');
  burger?.addEventListener('click', () => mobileNav?.classList.toggle('open'));
  mobileNav?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileNav.classList.remove('open'))
  );

  // ── REVEAL ON SCROLL ───────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach(el => revealObserver.observe(el));

  // ── SMOOTH ANCHOR LINKS ────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });

  // ── MARQUEE — seamless infinite loop ───────
  function initMarquee() {
    const track = document.getElementById('marqueeTrack');
    if (!track) return;
    // Clone until we have enough content to fill 3x viewport width
    const originalWidth = track.scrollWidth;
    const needed = window.innerWidth * 3;
    let clones = 0;
    while (track.scrollWidth < needed && clones < 10) {
      const clone = track.cloneNode(true);
      clone.removeAttribute('id');
      clone.setAttribute('aria-hidden', 'true');
      track.parentElement.appendChild(clone);
      clones++;
    }
    // Wrap all tracks in a runner
    const strip = track.parentElement;
    const allTracks = strip.querySelectorAll('.marquee-track');
    const totalWidth = Array.from(allTracks).reduce((acc, t) => acc + t.scrollWidth, 0);
    const singleWidth = allTracks[0].scrollWidth;
    // Apply animation to the strip via JS so we can set the exact translate distance
    let pos = 0;
    const speed = 0.5; // px per frame
    let paused = false;
    strip.addEventListener('mouseenter', () => paused = true);
    strip.addEventListener('mouseleave', () => paused = false);
    function tick() {
      if (!paused) {
        pos += speed;
        if (pos >= singleWidth + 32) pos = 0; // 32 = gap
        strip.style.transform = `translateX(-${pos}px)`;
      }
      requestAnimationFrame(tick);
    }
    // Remove CSS animation and use JS instead
    allTracks.forEach(t => t.style.animation = 'none');
    strip.style.display = 'flex';
    strip.style.width = 'max-content';
    requestAnimationFrame(tick);
  }
  // Run after fonts load
  if (document.fonts?.ready) {
    document.fonts.ready.then(initMarquee);
  } else {
    window.addEventListener('load', initMarquee);
  }

  // ── WORK CATALOGUE FILTER ──────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const catalogueCards = document.querySelectorAll('.catalogue-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      catalogueCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  // ── CONTACT FORM ───────────────────────────
  const form = document.getElementById('briefForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        form.innerHTML = `
          <div class="form-success">
            <div class="form-success__icon">✓</div>
            <h3>Message received.</h3>
            <p>We'll be in touch within 24 hours.</p>
          </div>`;
      }, 1200);
    });
  }

  // ── CURSOR GLOW (desktop only) ─────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:fixed;pointer-events:none;z-index:9999;
      width:400px;height:400px;border-radius:50%;
      background:radial-gradient(circle,rgba(200,169,110,0.04) 0%,transparent 70%);
      transform:translate(-50%,-50%);
      transition:left 0.8s cubic-bezier(0.23,1,0.32,1),top 0.8s cubic-bezier(0.23,1,0.32,1);
      will-change:left,top;`;
    document.body.appendChild(glow);
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

})();
