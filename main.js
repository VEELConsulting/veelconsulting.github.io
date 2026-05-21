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

  themeBtn?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ── NAV SCROLL ─────────────────────────────
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 48);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── MOBILE BURGER ──────────────────────────
  const burger = document.getElementById('navBurger');
  const mobileNav = document.getElementById('navMobile');
  burger?.addEventListener('click', () => {
    mobileNav?.classList.toggle('open');
  });
  mobileNav?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileNav.classList.remove('open'));
  });

  // ── REVEAL ON SCROLL ───────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
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
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── CURSOR GLOW (desktop only) ─────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 400px; height: 400px; border-radius: 50%;
      background: radial-gradient(circle, rgba(200,169,110,0.04) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: left 0.8s cubic-bezier(0.23,1,0.32,1), top 0.8s cubic-bezier(0.23,1,0.32,1);
      will-change: left, top;
    `;
    document.body.appendChild(glow);
    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      glow.style.left = mx + 'px';
      glow.style.top = my + 'px';
    });
  }

})();
