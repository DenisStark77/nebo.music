// nebo.music — minimal client JS
// Mobile menu, fade-in on scroll, painting lightbox.

(function () {
  'use strict';

  // --- Mobile menu ---
  const nav = document.querySelector('nav.top');
  const menuBtn = document.querySelector('.menu-btn');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      nav.classList.toggle('menu-open');
      const open = nav.classList.contains('menu-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.links a').forEach((a) => {
      a.addEventListener('click', () => nav.classList.remove('menu-open'));
    });
  }

  // --- Reveal on scroll ---
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '-10% 0px', threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  }

  // --- Spotify album covers (via oEmbed) ---
  // The .album cards ship with a gradient placeholder; on load we fetch the
  // real cover art from Spotify's public oEmbed endpoint and layer it on top.
  // If the fetch fails the gradient stays as the fallback.
  document.querySelectorAll('a.album[href*="open.spotify.com/album/"]').forEach((a) => {
    const cover = a.querySelector('.cover');
    if (!cover) return;
    const url = `https://open.spotify.com/oembed?url=${encodeURIComponent(a.href)}`;
    fetch(url)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        const thumb = data && data.thumbnail_url;
        if (!thumb) return;
        const img = new Image();
        img.onload = () => {
          const existing = cover.style.backgroundImage;
          cover.style.backgroundImage = `url("${thumb}"), ${existing}`;
        };
        img.src = thumb;
      })
      .catch(() => {});
  });

  // --- Painting lightbox ---
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const img = lightbox.querySelector('img');
    const cap = lightbox.querySelector('.lb-caption .title');
    const meta = lightbox.querySelector('.lb-caption .lb-meta');
    const closeBtn = lightbox.querySelector('.lb-close');
    let lastFocus = null;

    function open(painting) {
      lastFocus = document.activeElement;
      img.src = painting.dataset.full;
      img.alt = painting.querySelector('img').alt;
      cap.textContent = painting.dataset.title;
      meta.textContent = painting.dataset.meta;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      img.src = '';
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    document.querySelectorAll('.painting').forEach((p) => {
      p.addEventListener('click', () => open(p));
      p.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(p); }
      });
      p.setAttribute('tabindex', '0');
      p.setAttribute('role', 'button');
      p.setAttribute('aria-label', `View ${p.dataset.title} larger`);
    });
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
    });
  }
})();
