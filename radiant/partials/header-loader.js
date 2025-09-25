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

        // If we're on the training resources page, intercept dropdown links to smooth scroll
        try {
          var onTrainingPage = /training_resources\.html$/.test(window.location.pathname);
          if (onTrainingPage) {
            var trLinks = host.querySelectorAll('a[href^="training_resources.html#"]');
            if (trLinks && trLinks.length) {
              trLinks.forEach(function(a){
                a.addEventListener('click', function(e){
                  e.preventDefault();
                  var href = a.getAttribute('href');
                  var hashIndex = href.indexOf('#');
                  if (hashIndex > -1) {
                    var id = href.substring(hashIndex + 1);
                    var target = document.getElementById(id);
                    if (target && target.scrollIntoView) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    // Close mobile menu if open
                    if (navLinks && navLinks.classList) navLinks.classList.remove('open');
                    if (menuToggle && menuToggle.classList) menuToggle.classList.remove('open');
                  }
                });
              });
            }
          }
        } catch (err) {
          // no-op: smooth scroll enhancement failed
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
