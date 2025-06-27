document.addEventListener('DOMContentLoaded', () => {
  const reveals = [...document.querySelectorAll('.reveal')];

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  const FOCUSABLE =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  const isOpen = () => document.body.classList.contains('nav-open');

  function trapFocus(e) {
    if (!isOpen() || e.key !== 'Tab') return;

    const focusable = navLinks.querySelectorAll(FOCUSABLE);
    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    }
  }

  function closeMenu () {
    navLinks.classList.remove('show');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    document.removeEventListener('keydown', trapFocus);
  }

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('show');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.classList.toggle('nav-open', open);

    if (open) {
      setTimeout(() => navLinks.querySelector('a')?.focus(), 150);
      document.addEventListener('keydown', trapFocus);
    }
  });

  navLinks.addEventListener('click', e => {
    if (e.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', e => {
    if (!isOpen()) return;
    if (!e.target.closest('.nav__links') && !e.target.closest('#hamburger')) {
      closeMenu();
    }
  });
});
