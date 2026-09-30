/* ============================================================
   BIG MART — SHOP PAGE (Phase 4)
   Products rendering · Sorting · Filtering · Mobile drawer
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  /* ------------------------------------------------------------
     CONFIG
     ------------------------------------------------------------ */
  const IMAGE_EXTENSION = '.jpg'; //default - used when a product has no'ext'
  const isSubPage = window.location.pathname.includes('/pages/');
  const IMAGE_BASE = isSubPage
    ? '../images/products/'
    : 'images/products/';

  const category = document.body.dataset.category || 'all';
  const allProducts = window.BIGMART_PRODUCTS || [];
  const categoryProducts = category === 'all'
    ? allProducts
    : allProducts.filter((p) => p.category === category);

  /* ------------------------------------------------------------
     STATE
     ------------------------------------------------------------ */
  const maxPriceInCategory = categoryProducts.length
    ? Math.ceil(Math.max(...categoryProducts.map((p) => p.price)))
    : 100;

  const state = {
    sort: 'popular',
    categories: new Set([category === 'all' ? null : category].filter(Boolean)),
    maxPrice: maxPriceInCategory,
    minRating: 0,
    stock: { instock: false, sale: false },
  };


    /* ------------------------------------------------------------
     VIEW MODE (grid / list)
     ------------------------------------------------------------ */
  function applyViewMode(mode) {
    grid.classList.toggle('list-view', mode === 'list');
    document.querySelectorAll('.view-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === mode);
    });
  }

  /* ------------------------------------------------------------
     CURRENT PRODUCTS LIST (used by quick view)
     ------------------------------------------------------------ */
  function findProductByName(name) {
    return categoryProducts.find((p) => p.name === name) || null;
  }

  /* ------------------------------------------------------------
     FILTER + SORT
     ------------------------------------------------------------ */
  function applyFiltersAndSort() {
    let list = [...categoryProducts];

    /* Category filter */
    if (state.categories.size > 0 && !state.categories.has(null)) {
      list = list.filter((p) => state.categories.has(p.category));
    }

    /* Price */
    list = list.filter((p) => p.price <= state.maxPrice);

    /* Rating */
    if (state.minRating > 0) {
      list = list.filter((p) => p.rating >= state.minRating);
    }

    /* Stock / Sale (OR logic if either is checked) */
    const stockChecked = state.stock.instock || state.stock.sale;
    if (stockChecked) {
      list = list.filter((p) => {
        const matchesStock = state.stock.instock && p.inStock;
        const matchesSale  = state.stock.sale && p.oldPrice;
        return matchesStock || matchesSale;
      });
    }

    /* Sort */
    switch (state.sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort((a, b) => (b.added || 0) - (a.added || 0));
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        /* keep source order */
        break;
    }

    return list;
  }

  /* ------------------------------------------------------------
     RENDER GRID
     ------------------------------------------------------------ */
  function renderGrid() {
    const list = applyFiltersAndSort();

    if (!list.length) {
      grid.innerHTML = `
        <div class="no-products">
          <div class="no-products-icon">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 class="no-products-title">No products found</h3>
          <p class="no-products-desc">Try adjusting your filters or clearing them to see more.</p>
          <button class="no-products-btn" id="noProductsClear">Clear Filters</button>
        </div>
      `;
      document.getElementById('noProductsClear')?.addEventListener('click', clearAllFilters);
      updateCounts(0);
      return;
    }

    grid.innerHTML = list.map((p, i) => {
      const dir = ['left', 'up', 'right'][i % 3];
      return cardHTML(p, dir);
    }).join('');

    updateCounts(list.length);
    initReveal(grid);
    restoreHearts();
    wireCardActions(grid);
  }

  function cardHTML(p, dir) {
    return `
      <article class="product-card" data-reveal="${dir}" data-product-id="${p.id}">
        <div class="product-media">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          <button class="wishlist-btn" data-product="${p.name}" aria-label="Add ${p.name} to wishlist">
            <i class="fa-regular fa-heart"></i>
          </button>
          <img src="${IMAGE_BASE}${p.image}${p.ext || IMAGE_EXTENSION}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="product-info">
          <span class="product-tag">${p.tag}</span>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-rating">
            <i class="fa-solid fa-star"></i> ${p.rating} <span>(${p.reviews})</span>
          </div>
          <div class="product-bottom">
            <div class="product-price">
              <span class="price-current">$${p.price.toFixed(2)}</span>
              ${p.oldPrice ? `<span class="price-old">$${p.oldPrice.toFixed(2)}</span>` : ''}
            </div>
            <button class="add-cart-btn" data-product="${p.name}">
              <i class="fa-solid fa-cart-plus"></i> Add
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function updateCounts(count) {
    const toolbar = document.getElementById('toolbarCount');
    const banner = document.getElementById('bannerCount');
    const label = `${count} product${count === 1 ? '' : 's'}`;
    if (toolbar) toolbar.textContent = `Showing ${label}`;
    if (banner) banner.textContent = label;
  }

  /* ------------------------------------------------------------
     SCROLL REVEAL
     ------------------------------------------------------------ */
  function initReveal(container) {
    const targets = container.querySelectorAll('.product-card');
    if (!targets.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const el = entry.target;
          if (entry.isIntersecting) {
            el.style.transitionDelay = '';
            el.classList.add('revealed');
            const delay = parseFloat(getComputedStyle(el).transitionDelay) * 1000 || 0;
            setTimeout(() => { el.style.transitionDelay = '0s'; }, delay + 800);
          } else {
            el.style.transitionDelay = '';
            el.classList.remove('revealed');
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      targets.forEach((el) => observer.observe(el));
    } else {
      targets.forEach((el) => el.classList.add('revealed'));
    }
  }

  /* ------------------------------------------------------------
     RESTORE HEARTS
     ------------------------------------------------------------ */
  function restoreHearts() {
    if (typeof getCurrentUser !== 'function') return;
    const user = getCurrentUser();
    if (!user) return;

    let list = [];
    try { list = JSON.parse(localStorage.getItem(`bigmart_wishlist_${user.email}`) || '[]'); }
    catch (err) { list = []; }

    grid.querySelectorAll('.wishlist-btn').forEach((btn) => {
      if (list.includes(btn.dataset.product)) {
        btn.classList.add('active');
        const icon = btn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
        }
      }
    });
  }

  /* ------------------------------------------------------------
     CARD ACTIONS (cart + wishlist)
     ------------------------------------------------------------ */
  function wireCardActions(container) {
    container.querySelectorAll('.wishlist-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const product = btn.dataset.product || 'this item';

        if (typeof isLoggedIn !== 'function' || !isLoggedIn()) {
          if (typeof openLoginModal === 'function') {
            openLoginModal(`Log in to save <strong>${product}</strong> to your wishlist.`);
          }
          return;
        }

        const isActive = btn.classList.contains('active');
        const icon = btn.querySelector('i');

        if (isActive) {
          btn.classList.remove('active');
          if (icon) { icon.classList.remove('fa-solid'); icon.classList.add('fa-regular'); }
          if (typeof showToast === 'function') showToast(`Removed "${product}" from wishlist`, 'info');
        } else {
          btn.classList.add('active');
          if (icon) { icon.classList.remove('fa-regular'); icon.classList.add('fa-solid'); }
          if (typeof showToast === 'function') showToast(`Added "${product}" to wishlist`, 'success');
        }

        btn.classList.add('popping');
        setTimeout(() => btn.classList.remove('popping'), 450);
      });
    });

    container.querySelectorAll('.add-cart-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const product = btn.dataset.product || 'this item';

        if (typeof isLoggedIn !== 'function' || !isLoggedIn()) {
          if (typeof openLoginModal === 'function') {
            openLoginModal(`Log in to add <strong>${product}</strong> to your cart.`);
          }
          return;
        }
        if (typeof showToast === 'function') showToast(`Added "${product}" to cart`, 'success');
      });
    });
  }

  /* ------------------------------------------------------------
     SORT DROPDOWN
     ------------------------------------------------------------ */
  const sortSelect = document.getElementById('sortSelect');
  sortSelect?.addEventListener('change', () => {
    state.sort = sortSelect.value;
    renderGrid();
  });

  /* ------------------------------------------------------------
     FILTER GROUP ACCORDION
     ------------------------------------------------------------ */
  document.querySelectorAll('.filter-group').forEach((group, i) => {
    if (i === 0) group.classList.add('open');
    const header = group.querySelector('.filter-group-header');
    header?.addEventListener('click', () => {
      group.classList.toggle('open');
    });
  });

  /* ------------------------------------------------------------
     CATEGORY FILTERS
     ------------------------------------------------------------ */
  document.querySelectorAll('input[data-filter="category"]').forEach((cb) => {
    cb.addEventListener('change', () => {
      const value = cb.value;
      if (cb.checked) state.categories.add(value);
      else state.categories.delete(value);
      renderGrid();
    });
  });

  /* ------------------------------------------------------------
     PRICE RANGE
     ------------------------------------------------------------ */
  const priceRange = document.getElementById('priceRange');
  const priceMaxLabel = document.getElementById('priceMaxLabel');

  if (priceRange) {
    priceRange.min = 0;
    priceRange.max = maxPriceInCategory;
    priceRange.value = maxPriceInCategory;
    priceRange.step = 1;
    if (priceMaxLabel) priceMaxLabel.textContent = `$${maxPriceInCategory}`;
  }

  priceRange?.addEventListener('input', () => {
    state.maxPrice = Number(priceRange.value);
    if (priceMaxLabel) priceMaxLabel.textContent = `$${state.maxPrice}`;
    renderGrid();
  });

  /* ------------------------------------------------------------
     RATING
     ------------------------------------------------------------ */
  document.querySelectorAll('input[data-filter="rating"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      state.minRating = Number(radio.value) || 0;
      renderGrid();
    });
  });

  /* ------------------------------------------------------------
     AVAILABILITY
     ------------------------------------------------------------ */
  document.querySelectorAll('input[data-filter="stock"]').forEach((cb) => {
    cb.addEventListener('change', () => {
      state.stock[cb.value] = cb.checked;
      renderGrid();
    });
  });

  /* ------------------------------------------------------------
     CLEAR ALL
     ------------------------------------------------------------ */
  function clearAllFilters() {
    state.categories = new Set(category === 'all' ? [] : [category]);
    state.maxPrice = maxPriceInCategory;
    state.minRating = 0;
    state.stock = { instock: false, sale: false };

    /* Reset UI */
    document.querySelectorAll('input[data-filter="category"]').forEach((cb) => {
      cb.checked = (cb.value === category);
    });
    document.querySelectorAll('input[data-filter="rating"]').forEach((r) => {
      r.checked = r.value === '0';
    });
    document.querySelectorAll('input[data-filter="stock"]').forEach((cb) => {
      cb.checked = false;
    });
    if (priceRange) priceRange.value = maxPriceInCategory;
    if (priceMaxLabel) priceMaxLabel.textContent = `$${maxPriceInCategory}`;

    renderGrid();
  }

  document.getElementById('clearFilters')?.addEventListener('click', clearAllFilters);

  /* ------------------------------------------------------------
     MOBILE FILTER DRAWER
     ------------------------------------------------------------ */
  const filtersToggle = document.getElementById('filtersToggle');
  const filterSidebar = document.getElementById('filterSidebar');

  /* Build overlay + mobile apply button dynamically */
  let filterOverlay = document.getElementById('filterOverlay');
  if (!filterOverlay) {
    filterOverlay = document.createElement('div');
    filterOverlay.className = 'filter-overlay';
    filterOverlay.id = 'filterOverlay';
    document.body.appendChild(filterOverlay);
  }

  let filterApplyBtn = document.getElementById('filterApply');
  if (!filterApplyBtn && filterSidebar) {
    filterApplyBtn = document.createElement('button');
    filterApplyBtn.className = 'filter-apply';
    filterApplyBtn.id = 'filterApply';
    filterApplyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Apply Filters';
    filterSidebar.appendChild(filterApplyBtn);
  }

  function openFilterDrawer() {
    filterSidebar?.classList.add('active');
    filterOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeFilterDrawer() {
    filterSidebar?.classList.remove('active');
    filterOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  filtersToggle?.addEventListener('click', openFilterDrawer);
  filterOverlay?.addEventListener('click', closeFilterDrawer);
  filterApplyBtn?.addEventListener('click', closeFilterDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && filterSidebar?.classList.contains('active')) {
      closeFilterDrawer();
    }
  });

    /* ------------------------------------------------------------
     VIEW TOGGLE (grid / list)
     ------------------------------------------------------------ */
  document.querySelectorAll('.view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyViewMode(btn.dataset.view);
    });
  });

  /* ------------------------------------------------------------
     QUICK VIEW MODAL
     ------------------------------------------------------------ */
  const qvModal = document.getElementById('quickViewModal');
  const qvContent = document.getElementById('qvContent');
  const qvCloseBtn = document.getElementById('qvClose');

  let qvState = { product: null, qty: 1 };

  function openQuickView(name) {
    const p = findProductByName(name);
    if (!p) return;

    qvState = { product: p, qty: 1 };
    qvContent.innerHTML = qvHTML(p, 1);

    /* Wishlist state */
    const wishBtn = qvContent.querySelector('.qv-wishlist');
    if (wishBtn && typeof getCurrentUser === 'function') {
      const user = getCurrentUser();
      if (user) {
        try {
          const list = JSON.parse(localStorage.getItem(`bigmart_wishlist_${user.email}`) || '[]');
          if (list.includes(p.name)) {
            wishBtn.classList.add('active');
            const icon = wishBtn.querySelector('i');
            if (icon) { icon.classList.remove('fa-regular'); icon.classList.add('fa-solid'); }
          }
        } catch (err) { /* ignore */ }
      }
    }

    wireQuickViewActions();

    qvModal.classList.add('active');
    qvModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    qvModal?.classList.remove('active');
    qvModal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    qvState = { product: null, qty: 1 };
  }

  function qvHTML(p, qty) {
    return `
      <div class="qv-media">
        ${p.badge ? `<span class="qv-badge">${p.badge}</span>` : ''}
        <img src="${IMAGE_BASE}${p.image}${p.ext || IMAGE_EXTENSION}" alt="${p.name}" />
      </div>
      <div class="qv-info">
        <span class="qv-tag">${p.tag}</span>
        <h2 class="qv-name">${p.name}</h2>
        <div class="qv-rating">
          <i class="fa-solid fa-star"></i> ${p.rating} <span>(${p.reviews} reviews)</span>
        </div>
        <p class="qv-description">${p.description}</p>
        <div class="qv-price-row">
          <span class="qv-price">$${p.price.toFixed(2)}</span>
          ${p.oldPrice ? `<span class="qv-old-price">$${p.oldPrice.toFixed(2)}</span>` : ''}
        </div>
        <div class="qv-actions">
          <div class="qv-qty">
            <button class="qv-qty-btn" data-action="dec" aria-label="Decrease">−</button>
            <span class="qv-qty-value">${qty}</span>
            <button class="qv-qty-btn" data-action="inc" aria-label="Increase">+</button>
          </div>
          <button class="qv-add-cart" data-product="${p.name}">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
          </button>
          <button class="qv-wishlist" data-product="${p.name}" aria-label="Add to wishlist">
            <i class="fa-regular fa-heart"></i>
          </button>
          <a href="product.html?id=${p.id}" class="qv-details-link">
            View Full Details <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
    `;
  }

  function updateQvQty() {
    const el = qvContent.querySelector('.qv-qty-value');
    if (el) el.textContent = qvState.qty;
  }

  function wireQuickViewActions() {
    /* Qty stepper */
    qvContent.querySelectorAll('.qv-qty-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const delta = btn.dataset.action === 'inc' ? 1 : -1;
        qvState.qty = Math.max(1, qvState.qty + delta);
        updateQvQty();
      });
    });

    /* Add to cart */
    const addBtn = qvContent.querySelector('.qv-add-cart');
    addBtn?.addEventListener('click', () => {
      const p = qvState.product;
      if (!p) return;

      if (typeof isLoggedIn !== 'function' || !isLoggedIn()) {
        if (typeof openLoginModal === 'function') {
          openLoginModal(`Log in to add <strong>${p.name}</strong> to your cart.`);
        }
        return;
      }

      /* Call showToast once per unit so the cart counter increments correctly */
      for (let i = 0; i < qvState.qty; i++) {
        if (typeof showToast === 'function') {
          showToast(`Added "${p.name}" to cart`, 'success');
        }
      }
      closeQuickView();
    });

    /* Wishlist */
    const wishBtn = qvContent.querySelector('.qv-wishlist');
    wishBtn?.addEventListener('click', () => {
      const p = qvState.product;
      if (!p) return;

      if (typeof isLoggedIn !== 'function' || !isLoggedIn()) {
        if (typeof openLoginModal === 'function') {
          openLoginModal(`Log in to save <strong>${p.name}</strong> to your wishlist.`);
        }
        return;
      }

      const isActive = wishBtn.classList.contains('active');
      const icon = wishBtn.querySelector('i');

      if (isActive) {
        wishBtn.classList.remove('active');
        if (icon) { icon.classList.remove('fa-solid'); icon.classList.add('fa-regular'); }
        if (typeof showToast === 'function') showToast(`Removed "${p.name}" from wishlist`, 'info');
      } else {
        wishBtn.classList.add('active');
        if (icon) { icon.classList.remove('fa-regular'); icon.classList.add('fa-solid'); }
        if (typeof showToast === 'function') showToast(`Added "${p.name}" to wishlist`, 'success');
      }
    });
  }

  /* Wire card clicks to open Quick View (excluding buttons) */
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    /* Ignore clicks on buttons inside the card */
    if (e.target.closest('button')) return;

    const name = card.querySelector('.product-name')?.textContent?.trim();
    if (name) openQuickView(name);
  });

  qvCloseBtn?.addEventListener('click', closeQuickView);
  qvModal?.addEventListener('click', (e) => {
    if (e.target === qvModal) closeQuickView();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qvModal?.classList.contains('active')) closeQuickView();
  });

  /* ------------------------------------------------------------
     INIT
     ------------------------------------------------------------ */
  renderGrid();
});