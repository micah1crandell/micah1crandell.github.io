(function() {
  // Inserts the shared header into any page containing <div id="site-header"></div>
  // Uses fetch to load the partial and wires up menu toggle behavior.
  function insertHeader() {
    var host = document.querySelector('#site-header');
    if (!host) return;
    fetch('partials/header.html', { cache: 'no-cache' })
      .then(function(res) { return res.text(); })
      .then(function(html) {
        host.innerHTML = html;
        // After injecting, wire mobile menu toggle
        var menuToggle = host.querySelector('.menu-toggle');
        var navLinks = host.querySelector('.nav-links');
        if (menuToggle && navLinks) {
          menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
            menuToggle.classList.toggle('open');
          });
        }
      })
      .catch(function(err) {
        console.error('Failed to load header partial:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertHeader);
  } else {
    insertHeader();
  }
})();
