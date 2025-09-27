document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.querySelector('.transition-overlay');
  if (!overlay) return;

  // Optional short delay before starting the animation
  const startHide = () => {
    overlay.classList.remove('animate-in');
    overlay.classList.add('animate-out');
  };
  setTimeout(startHide, 100); // Adjust delay as desired

  // Fallback: ensure the overlay hides even if transitionend doesn't fire
  const hideFallback = setTimeout(() => {
    overlay.style.display = 'none';
    overlay.classList.remove('animate-in', 'animate-out');
  }, 1800); // longest circle delay (0.4s) + duration (1s) + buffer

  // After the transition ends, hide the overlay so it doesn't block page interactions.
  overlay.addEventListener('transitionend', function handleOut(e) {
    // Only respond to transform transitions bubbling up
    if (e.propertyName !== 'transform') return;
    overlay.style.display = 'none';
    overlay.classList.remove('animate-in', 'animate-out');
    clearTimeout(hideFallback);
    overlay.removeEventListener('transitionend', handleOut);
  });

  // Intercept internal link clicks for a similar effect when leaving the page.
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      // Process only internal links (adjust logic as needed)
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        e.preventDefault();

        // Show the overlay again before navigating
        overlay.style.display = 'block';
        // Reset classes
        overlay.classList.remove('animate-out');
        // Force a reflow so the removal takes effect immediately
        void overlay.offsetWidth;
        overlay.classList.add('animate-in');

        // Fallback navigate in case transitionend doesn't fire
        const navFallback = setTimeout(() => {
          window.location.href = href;
        }, 1500);

        // Navigate to the new page after the transition
        const handleIn = function(e2) {
          if (e2.propertyName !== 'transform') return;
          clearTimeout(navFallback);
          window.location.href = href;
          overlay.removeEventListener('transitionend', handleIn);
        };
        overlay.addEventListener('transitionend', handleIn);
      }
    });
  });
});

  // If the page is restored from the cache, the overlay is immediately hidden so it doesn’t block interaction.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) { // true if the page was restored from bfcache
      const overlay = document.querySelector('.transition-overlay');
      if (overlay) overlay.style.display = 'none';
    }
  });
  