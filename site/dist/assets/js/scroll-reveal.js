/* Progressive enhancement: without motion support, every element stays readable. */
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const selector = [
    '.prologue > p', '.about-photo', '.about-content > *',
    '.section-heading > *', '.toriten-photo', '.dish-copy > *',
    '.text-dish > *', '.secondary-copy > *', '.deli > figure',
    '.space-copy > *', '.space-photo', '.info-copy > .eyebrow',
    '.info-copy > h2', '.info-copy > dl', '.access-map',
    '.exterior-photo', '.contact-main'
  ].join(',');
  const elements = [...document.querySelectorAll(selector)];
  const verse = document.querySelector('#prologue-title');
  const reveal = element => {
    element.classList.add('is-revealed');
    observer.unobserve(element);
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) reveal(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  elements.forEach(element => {
    // Content already above the reader must remain visible after anchor navigation.
    if (element.getBoundingClientRect().bottom < 0) return;
    element.classList.add('scroll-reveal');
    const siblings = [...element.parentElement.children].filter(e => e.matches(selector));
    element.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(element), 3) * 100}ms`);
    observer.observe(element);
  });
  if (verse) {
    if (verse.getBoundingClientRect().bottom >= 0) {
      verse.classList.add('verse-reveal');
      observer.observe(verse);
    }
  }
  const showAll = () => {
    observer.disconnect();
    elements.forEach(e => e.classList.add('is-revealed'));
    verse?.classList.add('is-revealed');
  };
  preference.addEventListener('change', event => { if (event.matches) showAll(); });
  // Keyboard navigation should never focus an invisible control.
  document.addEventListener('focusin', event => {
    const parent = event.target.closest('.scroll-reveal');
    if (parent) reveal(parent);
  });
})();
