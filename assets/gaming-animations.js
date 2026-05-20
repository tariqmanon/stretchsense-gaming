(() => {
  if (window.__gamingAnimationsInit) return;
  window.__gamingAnimationsInit = true;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const reveal = (root = document) => {
    const targets = root.querySelectorAll('[data-reveal]:not(.is-revealed)');
    if (!targets.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  };

  const onReady = () => reveal();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady, { once: true });
  } else {
    onReady();
  }

  document.addEventListener('shopify:section:load', (e) => reveal(e.target));
})();
