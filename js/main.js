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
    document.documentElement.classList.add('is-menu-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    header.classList.remove('is-open');
    document.documentElement.classList.remove('is-menu-open');
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
      const visibleCount = Math.max(
        1,
        Math.round(viewport.clientWidth / stepPx),
      );
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
        if (
          Math.abs(deltaX) < SWIPE_THRESHOLD ||
          Math.abs(deltaX) <= Math.abs(deltaY)
        ) {
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

// Order modal — product cards open a request-form modal. Cards arrive both
// statically (bestsellers) and dynamically (bouquets fetched over HTTP), so a
// single delegated click handler covers every "Order" button. The demo forms
// are prevented from actually submitting.
(function initOrderModal() {
  const backdrop = document.querySelector('#order-modal');
  if (!backdrop) {
    return;
  }

  const modal = backdrop.querySelector('.modal');
  const closeBtn = backdrop.querySelector('.modal__close');
  const root = document.documentElement;

  function isOpen() {
    return backdrop.classList.contains('is-open');
  }

  function openModal() {
    backdrop.classList.add('is-open');
    root.classList.add('is-menu-open'); // lock background scroll
  }

  function closeModal() {
    backdrop.classList.remove('is-open');
    root.classList.remove('is-menu-open');
  }

  // Give each static product card (bestsellers) an "Order" trigger. Dynamic
  // bouquet cards ship their own button straight from the render template.
  document
    .querySelectorAll('.bestsellers__list .card')
    .forEach(function (card) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'button card__order';
      button.textContent = 'Order';
      card.appendChild(button);
    });

  // Delegated: any "Order" button (static or dynamically rendered) opens it.
  document.addEventListener('click', function (event) {
    if (event.target.closest('.card__order')) {
      openModal();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // A click on the dark backdrop (outside the modal) closes it.
  backdrop.addEventListener('click', function (event) {
    if (!modal.contains(event.target)) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) {
      closeModal();
    }
  });

  // Demo forms have no backend: block submission, then reset (and close modal).
  const orderForm = backdrop.querySelector('.form');
  if (orderForm) {
    orderForm.addEventListener('submit', function (event) {
      event.preventDefault();
      orderForm.reset();
      closeModal();
    });
  }

  const newsletter = document.querySelector('.footer__newsletter');
  if (newsletter) {
    newsletter.addEventListener('submit', function (event) {
      event.preventDefault();
      newsletter.reset();
    });
  }
})();

// Dynamic bouquets — the gallery has NO static markup; every card is built
// from data fetched over HTTP (axios + async/await) and inserted into the DOM.
// Three behaviours sit on top of the fetch:
//   • PAGINATION — "Show More" requests the next page (_page/_per_page) and
//     appends it; the button hides once the last page is reached.
//   • FILTERING — the price chips send query parameters (price_lt / price_gte
//     / price_lte) so json-server returns only matching rows; switching a
//     filter resets to page 1.
//   • DYNAMIC UPDATE — every change re-renders in place, with no page reload.
// Run json-server (see README) to serve db.json at http://localhost:3000; when
// it is unreachable (a plain static preview) we fetch db.json once and apply
// the same filter/paginate logic client-side so the UI behaves identically.
(function initBouquets() {
  const list = document.querySelector('.bouquets__list');
  const moreBtn = document.querySelector('.bouquets__more');
  const filterBar = document.querySelector('.bouquets__filters');
  const emptyMsg = document.querySelector('.bouquets__empty');
  if (!list || typeof axios === 'undefined') {
    return;
  }

  const API_URL = 'http://localhost:3000/bouquets';
  const FALLBACK_URL = './db.json';
  const PER_PAGE = 4;

  // Each price filter maps to the query params json-server understands, plus a
  // `test` so the static fallback can filter the cached array identically.
  const FILTERS = {
    all: { params: {}, test: null },
    'lt-40': { params: { price_lt: 40 }, test: (price) => price < 40 },
    '40-49': {
      params: { price_gte: 40, price_lte: 49 },
      test: (price) => price >= 40 && price <= 49,
    },
    'gte-50': { params: { price_gte: 50 }, test: (price) => price >= 50 },
  };

  let activeFilter = 'all';
  let page = 1;
  let mode = null; // 'server' once a live request succeeds, 'file' for fallback
  let pool = []; // file mode: the full cached array (filtered per render)
  let loadToken = 0; // guards against overlapping/out-of-order loads

  function cardMarkup(item) {
    return `
      <li class="card">
        <img
          class="card__image"
          src="${item.image}"
          srcset="${item.image} 1x, ${item.image2x} 2x"
          width="${item.width}"
          height="${item.height}"
          loading="lazy"
          decoding="async"
          alt="${item.alt}"
        />
        <h3 class="card__title">${item.name}</h3>
        <p class="card__price">$${item.price}</p>
        <button class="button card__order" type="button">Order</button>
      </li>`;
  }

  function appendCards(items) {
    list.insertAdjacentHTML('beforeend', items.map(cardMarkup).join(''));
  }

  function setMore(hasMore) {
    if (moreBtn) {
      moreBtn.hidden = !hasMore;
    }
  }

  // Show the empty-state message only when the rendered list has no cards.
  function updateEmpty() {
    if (emptyMsg) {
      emptyMsg.hidden = list.children.length > 0;
    }
  }

  // Query params for the current page of the active filter.
  function queryParams() {
    return Object.assign(
      { _page: page, _per_page: PER_PAGE },
      FILTERS[activeFilter].params,
    );
  }

  // File mode: the cached array narrowed to the active filter.
  function filteredPool() {
    const test = FILTERS[activeFilter].test;
    return test ? pool.filter((item) => test(Number(item.price))) : pool;
  }

  // Render one page. `reset` clears the list and returns to page 1 (used on
  // first load and on every filter change). Each call takes a token: after an
  // await, a stale call (one a newer load has superseded — e.g. a quick filter
  // switch) bails before touching the DOM, so cards never mix or duplicate.
  // Show More is also disabled while a load is in flight, so a double-click
  // can't skip a page.
  async function loadPage(reset) {
    const token = ++loadToken;
    if (reset) {
      page = 1;
      list.innerHTML = '';
    }
    if (moreBtn) {
      moreBtn.disabled = true;
    }

    try {
      // Server mode (or the first attempt): ask json-server for this page.
      if (mode !== 'file') {
        try {
          const response = await axios.get(API_URL, { params: queryParams() });
          if (token !== loadToken) {
            return; // a newer load superseded this one
          }
          const data = response.data;
          // json-server (beta.15) wraps paginated results: rows under .data,
          // .next is null on the last page — that is true server-side paging.
          if (data && !Array.isArray(data) && Array.isArray(data.data)) {
            mode = 'server';
            appendCards(data.data);
            setMore(data.next != null);
            updateEmpty();
            return;
          }
          // A bare array means the server did not paginate — page it ourselves.
          mode = 'file';
        } catch (error) {
          if (token !== loadToken) {
            return;
          }
          mode = 'file';
        }

        // Entering file mode: cache the full list once from the raw file.
        if (!pool.length) {
          try {
            const fallback = await axios.get(FALLBACK_URL);
            if (token !== loadToken) {
              return;
            }
            pool = fallback.data.bouquets || [];
          } catch (fallbackError) {
            console.error('Could not load bouquets:', fallbackError);
            return;
          }
        }
      }

      // File mode: slice the filtered pool to the current page and append.
      const view = filteredPool();
      const start = (page - 1) * PER_PAGE;
      appendCards(view.slice(start, start + PER_PAGE));
      setMore(start + PER_PAGE < view.length);
      updateEmpty();
    } finally {
      // Re-enable only for the current load (setMore controls visibility);
      // a superseded call must not un-disable a button a newer load owns.
      if (token === loadToken && moreBtn) {
        moreBtn.disabled = false;
      }
    }
  }

  // Show More → load and append the next page (disabled while in flight).
  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      page += 1;
      loadPage(false);
    });
  }

  // Price chips → set the active filter, reflect it in aria-pressed, reload.
  if (filterBar) {
    filterBar.addEventListener('click', function (event) {
      const chip = event.target.closest('.bouquets__filter');
      if (!chip || !FILTERS[chip.dataset.filter]) {
        return;
      }
      activeFilter = chip.dataset.filter;
      filterBar.querySelectorAll('.bouquets__filter').forEach(function (other) {
        other.setAttribute('aria-pressed', String(other === chip));
      });
      loadPage(true);
    });
  }

  loadPage(true);
})();
