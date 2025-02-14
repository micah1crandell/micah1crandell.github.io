document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.querySelector('.transition-overlay');
  
    // Optional short delay before starting the animation
    setTimeout(() => {
      overlay.classList.remove('animate-in');
      overlay.classList.add('animate-out');
    }, 100); // Adjust delay as desired
  
    // After the transition ends, hide the overlay so it doesn't block page interactions.
    overlay.addEventListener('transitionend', function handleOut(e) {
      // You might want to check e.propertyName to ensure it's the transform transition.
      overlay.style.display = 'none';
      overlay.removeEventListener('transitionend', handleOut);
    });
  
    // Optionally, intercept link clicks for a similar effect when leaving the page.
    document.querySelectorAll('a[href]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        // Process only internal links (adjust the logic as needed)
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
          e.preventDefault();
  
          // Show the overlay again before navigating
          overlay.style.display = 'block';
          // Remove the animate-out class and re-add animate-in to cover the page
          overlay.classList.remove('animate-out');
          // Force a reflow so the removal takes effect immediately
          void overlay.offsetWidth;
          overlay.classList.add('animate-in');
  
          // Navigate to the new page after the transition
          overlay.addEventListener('transitionend', function handleIn(e) {
            window.location.href = href;
            overlay.removeEventListener('transitionend', handleIn);
          });
        }
      });
    });
  });

  // If the page is restored from the cache, the overlay is immediately hidden so it doesn’t block interaction.
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) { // true if the page was restored from bfcache
      const overlay = document.querySelector('.transition-overlay');
      overlay.style.display = 'none';
    }
  });
  