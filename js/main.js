// Flora — vanilla JS. Mobile menu: toggle the fullscreen overlay via the
// `is-open` class (accessible: focus trap, Escape, click-outside, return focus).

(function initBurgerMenu() {
  const header = document.querySelector('.header');
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');

  // Markup absent (e.g. a future page reuses this script) — bail out quietly.
  if (!header || !burger || !nav) {
    return;
  }

  const desktopQuery = window.matchMedia('(min-width: 1440px)');
  const navClose = nav.querySelector('.nav__close');
  let lastFocused = null;

  function focusable() {
    return Array.prototype.slice.call(
      nav.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
  }

  // Keep Tab focus inside the open fullscreen overlay (wrap at the ends).
  function trapTab(event) {
    const items = focusable();
    if (!items.length) {
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function isOpen() {
    return header.classList.contains('is-open');
  }

  function openMenu() {
    lastFocused = document.activeElement;
    header.classList.add('is-open');
    document.documentElement.classList.add('is-menu-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    if (navClose) {
      navClose.focus(); // move focus into the overlay
    }
  }

  function closeMenu() {
    header.classList.remove('is-open');
    document.documentElement.classList.remove('is-menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus(); // return focus to the trigger
    }
  }

  function toggleMenu() {
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // 1. Burger toggles the fullscreen menu overlay.
  burger.addEventListener('click', toggleMenu);

  // 2. A link, the logo, or the close button closes the menu (the native
  //    anchor scroll still runs for links).
  nav.addEventListener('click', function (event) {
    if (
      event.target.closest('.nav__link') ||
      event.target.closest('.nav__close') ||
      event.target.closest('.logo')
    ) {
      closeMenu();
    }
  });

  // 3. Escape closes the open panel; Tab is trapped inside it while open.
  document.addEventListener('keydown', function (event) {
    if (!isOpen()) {
      return;
    }
    if (event.key === 'Escape') {
      closeMenu();
    } else if (event.key === 'Tab') {
      trapTab(event);
    }
  });

  // 4. A click outside the panel and the burger closes it.
  document.addEventListener('click', function (event) {
    if (!isOpen()) {
      return;
    }
    if (event.target.closest('.nav') || event.target.closest('.burger')) {
      return;
    }
    closeMenu();
  });

  // 5. Reaching the desktop inline nav (>=1440) clears any stale open state.
  desktopQuery.addEventListener('change', function (event) {
    if (event.matches) {
      closeMenu();
    }
  });
})();
