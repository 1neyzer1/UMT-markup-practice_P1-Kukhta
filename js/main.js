// Flora — vanilla JS. Stage 4: behaviours (burger menu first, sliders next).

(function initBurgerMenu() {
  const header = document.querySelector('.header');
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');

  // Markup absent (e.g. a future page reuses this script) — bail out quietly.
  if (!header || !burger || !nav) {
    return;
  }

  const desktopQuery = window.matchMedia('(min-width: 1440px)');

  function isOpen() {
    return header.classList.contains('is-open');
  }

  function openMenu() {
    header.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    header.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  function toggleMenu() {
    if (isOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // 1. Burger toggles the dropdown panel.
  burger.addEventListener('click', toggleMenu);

  // 2. Choosing a link closes the panel; the native anchor scroll still runs.
  nav.addEventListener('click', function (event) {
    if (event.target.closest('.nav__link')) {
      closeMenu();
    }
  });

  // 3. Escape closes the open panel.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) {
      closeMenu();
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

// Sliders — Bestsellers & Feedbacks carousels. One factory drives every
// [data-slider] region: it measures how many cards fit, translates the flex
// track, and syncs arrow/dot state. Without JS the CSS keeps every card
// visible (see @media (scripting: none)), so this is pure enhancement.
(function initSliders() {
  const roots = document.querySelectorAll('[data-slider]');

  roots.forEach(createSlider);

  function createSlider(root) {
    const viewport = root.querySelector('.slider__viewport');
    const track = root.querySelector('.slider__track');
    const slides = Array.from(root.querySelectorAll('.slider__slide'));
    const prevBtn = root.querySelector('[data-dir="prev"]');
    const nextBtn = root.querySelector('[data-dir="next"]');
    const dotsBox = root.querySelector('.slider-dots');

    // Incomplete markup (e.g. reused elsewhere) — skip quietly.
    if (!viewport || !track || !slides.length || !prevBtn || !nextBtn) {
      return;
    }

    const SWIPE_THRESHOLD = 40;
    let index = 0;
    let maxIndex = 0;
    let stepPx = 0;
    let dots = [];

    // How far one card advances, and how many pages exist at this width.
    function measure() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      stepPx = slideWidth + gap;
      const visibleCount = Math.max(1, Math.round(viewport.clientWidth / stepPx));
      maxIndex = Math.max(0, slides.length - visibleCount);
    }

    function buildDots() {
      if (!dotsBox) {
        return;
      }
      const pageCount = maxIndex + 1;
      if (dots.length === pageCount) {
        return;
      }
      dotsBox.textContent = '';
      dots = [];
      for (let page = 0; page < pageCount; page += 1) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-dots__dot';
        dot.setAttribute('aria-label', 'Go to slide ' + (page + 1));
        const target = page;
        dot.addEventListener('click', function () {
          go(target);
        });
        dotsBox.appendChild(dot);
        dots.push(dot);
      }
    }

    function render() {
      index = Math.max(0, Math.min(index, maxIndex));
      track.style.transform = 'translateX(' + -(index * stepPx) + 'px)';
      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= maxIndex;
      dots.forEach(function (dot, page) {
        const active = page === index;
        dot.classList.toggle('is-active', active);
        if (active) {
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.removeAttribute('aria-current');
        }
      });
    }

    function go(target) {
      index = Math.max(0, Math.min(target, maxIndex));
      render();
    }

    function layout() {
      measure();
      buildDots();
      render();
    }

    prevBtn.addEventListener('click', function () {
      go(index - 1);
    });
    nextBtn.addEventListener('click', function () {
      go(index + 1);
    });

    // Keyboard: Left/Right move the carousel when focus is inside it.
    root.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(index - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(index + 1);
      }
    });

    // Touch: horizontal swipe past the threshold flips one page.
    let startX = 0;
    let startY = 0;
    let deltaX = 0;
    let deltaY = 0;
    let swiping = false;

    viewport.addEventListener(
      'touchstart',
      function (event) {
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        deltaX = 0;
        deltaY = 0;
        swiping = true;
      },
      { passive: true },
    );

    viewport.addEventListener(
      'touchmove',
      function (event) {
        if (!swiping) {
          return;
        }
        const touch = event.touches[0];
        deltaX = touch.clientX - startX;
        deltaY = touch.clientY - startY;
      },
      { passive: true },
    );

    viewport.addEventListener(
      'touchend',
      function () {
        if (!swiping) {
          return;
        }
        swiping = false;
        // Ignore mostly-vertical drags so page scrolling still works.
        if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) {
          return;
        }
        go(deltaX < 0 ? index + 1 : index - 1);
      },
      { passive: true },
    );

    // Re-measure on resize (debounced) — breakpoint changes alter how many
    // cards fit, the page count, and the clamp on the current index.
    let resizeTimer = 0;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(layout, 150);
    });

    layout();
  }
})();
