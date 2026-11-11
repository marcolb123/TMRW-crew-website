/* Shared page behaviour. Portfolio data and playback live in portfolio.js. */
(function () {
  'use strict';
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
  };
  const backButton = document.getElementById('backToTopBtn');
  function onScroll() {
    if (backButton) backButton.style.display = window.scrollY > 300 ? 'flex' : 'none';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
