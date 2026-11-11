/* Shared page behaviour. Portfolio data and playback live in portfolio.js. */
(function () {
  'use strict';
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
  };
  const photos = [
    'optimized/events/2. Page 2.webp',
    'optimized/events/3. Shok Page 3.webp',
    'optimized/events/4. WAAKING page 4.webp',
    'optimized/events/9. OSC & LEI.webp',
    'optimized/events/6. HIP HOP Nevil.webp',
    'optimized/events/7. REGGAETON Leila.webp'
  ];
  let current = 0;
  const image = document.getElementById('workshop-slideshow-image');
  const dots = document.getElementById('workshop-slideshow-dots');
  const buttons = [];
  function show(index) {
    if (!image) return;
    current = (index + photos.length) % photos.length;
    image.src = photos[current];
    image.alt = `TMRW Crew workshop poster ${current + 1} of ${photos.length}`;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
  }
  if (image && dots) {
    photos.forEach((photo, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'slideshow-dot';
      button.setAttribute('aria-label', `Show workshop poster ${index + 1}`);
      button.addEventListener('click', () => show(index));
      dots.append(button);
      buttons.push(button);
    });
    show(0);
  }
  window.changeWorkshopSlide = delta => show(current + delta);
  const backButton = document.getElementById('backToTopBtn');
  function onScroll() {
    if (backButton) backButton.style.display = window.scrollY > 300 ? 'flex' : 'none';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
