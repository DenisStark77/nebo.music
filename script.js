// nebo.music — minimal client JS
// Language toggle, mobile menu, fade-in on scroll, painting lightbox.

(function () {
  'use strict';

  // --- Language toggle ---
  // Initial <html lang> is set synchronously by an inline script in <head>
  // (reads localStorage → navigator.language → 'en' fallback). Here we sync
  // button state, document.title, and wire the toggle.
  const STORAGE_KEY = 'nebo-lang';
  const SUPPORTED = ['en', 'ru'];
  const TITLES = {
    en: 'nebo.music – Jane Stark · hear yourself',
    ru: 'nebo.music – Евгения Старк · услышать себя'
  };

  function applyLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = 'en';
    document.documentElement.lang = lang;
    document.title = TITLES[lang] || TITLES.en;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    document.querySelectorAll('.lang-toggle button[data-lang]').forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
    });
    // aria-labels that follow the language (e.g. carousel arrows)
    document.querySelectorAll('[data-label-en]').forEach((el) => {
      el.setAttribute('aria-label', el.dataset['label' + (lang === 'ru' ? 'Ru' : 'En')]);
    });
  }

  // Sync button state + title with whatever <html lang> already is.
  applyLang(document.documentElement.lang || 'en');

  document.querySelectorAll('.lang-toggle button[data-lang]').forEach((btn) => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });

  function currentLang() {
    return SUPPORTED.includes(document.documentElement.lang) ? document.documentElement.lang : 'en';
  }

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
    let currentPainting = null;

    function paintingTitle(p) {
      const lang = currentLang();
      return (lang === 'ru' && p.dataset.titleRu) ? p.dataset.titleRu : p.dataset.title;
    }
    function paintingMeta(p) {
      const lang = currentLang();
      return (lang === 'ru' && p.dataset.metaRu) ? p.dataset.metaRu : p.dataset.meta;
    }

    function openLb(painting) {
      currentPainting = painting;
      lastFocus = document.activeElement;
      img.src = painting.dataset.full;
      img.alt = painting.querySelector('img').alt;
      cap.textContent = paintingTitle(painting);
      meta.textContent = paintingMeta(painting);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
      document.body.style.overflow = 'hidden';
    }
    function closeLb() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      img.src = '';
      currentPainting = null;
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    // If the user toggles language while the lightbox is open, re-render its caption.
    document.querySelectorAll('.lang-toggle button[data-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (currentPainting) {
          cap.textContent = paintingTitle(currentPainting);
          meta.textContent = paintingMeta(currentPainting);
        }
      });
    });

    document.querySelectorAll('.painting').forEach((p) => {
      p.addEventListener('click', () => openLb(p));
      p.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(p); }
      });
      p.setAttribute('tabindex', '0');
      p.setAttribute('role', 'button');
      p.setAttribute('aria-label', `View ${p.dataset.title} larger`);
    });
    closeBtn.addEventListener('click', closeLb);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLb();
    });
  }
  // --- Sticky "join the group" button (phones) ---
  // Visible only between the hero and the footer; CSS hides it on wide screens.
  const joinSticky = document.querySelector('.join-sticky');
  const heroEl = document.querySelector('.hero');
  const footerEl = document.querySelector('footer');
  if (joinSticky && heroEl && footerEl && 'IntersectionObserver' in window) {
    let heroVisible = true;
    let footerVisible = false;
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === heroEl) heroVisible = entry.isIntersecting;
        if (entry.target === footerEl) footerVisible = entry.isIntersecting;
      });
      joinSticky.classList.toggle('show', !heroVisible && !footerVisible);
    }, { threshold: 0 });
    io2.observe(heroEl);
    io2.observe(footerEl);
  }

  // --- Book cover carousels ---
  // Scroll-snap track does the swiping; JS only drives arrows, dots and state.
  document.querySelectorAll('.book .b-cover').forEach((cover) => {
    const track = cover.querySelector('.track');
    const prev = cover.querySelector('.arrow.prev');
    const next = cover.querySelector('.arrow.next');
    const dots = cover.querySelector('.dots');
    if (!track || !prev || !next || !dots) return;
    const slides = Array.from(track.querySelectorAll('img'));
    if (slides.length < 2) { prev.remove(); next.remove(); return; }
    let current = 0;
    const behavior = reduce ? 'auto' : 'smooth';
    const goTo = (i) => track.scrollTo({ left: track.clientWidth * i, behavior });
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', `${i + 1} / ${slides.length}`);
      d.addEventListener('click', () => goTo(i));
      dots.appendChild(d);
    });
    const dotEls = Array.from(dots.children);
    function render() {
      dotEls.forEach((d, i) => d.setAttribute('aria-current', i === current ? 'true' : 'false'));
      prev.classList.toggle('is-hidden', current === 0);
      next.classList.toggle('is-hidden', current === slides.length - 1);
    }
    prev.addEventListener('click', () => track.scrollBy({ left: -track.clientWidth, behavior }));
    next.addEventListener('click', () => track.scrollBy({ left: track.clientWidth, behavior }));
    let raf = 0;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
        if (i !== current) { current = i; render(); }
      });
    }, { passive: true });
    render();
  });
})();
