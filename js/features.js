/* ============================================================
   BIG MART — FEATURES LOGIC
   Search · Cart drawer · Scroll-to-top · Persistence
   Depends on: main.js (showToast, isLoggedIn, getCurrentUser, openLoginModal)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     PRODUCT DATA (matches the 6 product cards on the page)
     ============================================================ */
 const PRODUCTS = window.BIGMART_PRODUCTS || [];
  const findProduct = (name) => PRODUCTS.find((p) => p.name === name);
  const productImage = (product) => {
  const ext = product.ext || '.jpg';
  return `images/products/${product.image}${ext}`;
};

  /* ============================================================
     STORAGE HELPERS
     ============================================================ */
  const cartKey = (email) => `bigmart_cart_${email}`;
  const wishlistKey = (email) => `bigmart_wishlist_${email}`;
  const WISHED_KEY = 'bigmart_wished_products'; // global

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  }
  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /* ---- Cart (per user) ---- */
  function getCart() {
    const user = getCurrentUser();
    if (!user) return [];
    return readJSON(cartKey(user.email), []);
  }
  function saveCart(cart) {
    const user = getCurrentUser();
    if (!user) return;
    writeJSON(cartKey(user.email), cart);
  }
  function addToCart(name) {
    const product = findProduct(name);
    if (!product) return;
    const cart = getCart();
    const found = cart.find((i) => i.name === name);
    if (found) found.qty += 1;
    else cart.push({ name, price: product.price, qty: 1 });
    saveCart(cart);
    updateCartBadge();
    renderCartDrawer();
  }
  function removeFromCart(name) {
    const cart = getCart().filter((i) => i.name !== name);
    saveCart(cart);
    updateCartBadge();
    renderCartDrawer();
  }
  function changeQty(name, delta) {
    const cart = getCart();
    const item = cart.find((i) => i.name === name);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      saveCart(cart.filter((i) => i.name !== name));
    } else {
      saveCart(cart);
    }
    updateCartBadge();
    renderCartDrawer();
  }

  /* ---- Wishlist (per user) ---- */
  function getWishlist() {
    const user = getCurrentUser();
    if (!user) return [];
    return readJSON(wishlistKey(user.email), []);
  }
  function saveWishlist(list) {
    const user = getCurrentUser();
    if (!user) return;
    writeJSON(wishlistKey(user.email), list);
  }
  function addToWishlist(name) {
    const list = getWishlist();
    if (!list.includes(name)) list.push(name);
    saveWishlist(list);
  }
  function removeFromWishlist(name) {
    saveWishlist(getWishlist().filter((n) => n !== name));
  }

  /* ---- Wished (global) ---- */
  function saveWishedProduct(name) {
    const list = readJSON(WISHED_KEY, []);
    list.push({ product: name, timestamp: Date.now() });
    writeJSON(WISHED_KEY, list);
  }

  /* ============================================================
     HOOK INTO showToast — persist cart / wishlist actions
     ============================================================ */
  const _originalShowToast = window.showToast;
  window.showToast = function (message, type) {
    if (typeof isLoggedIn === 'function' && isLoggedIn() && typeof message === 'string') {
      const wishAdd = message.match(/^Added "(.+)" to wishlist$/);
      const wishRem = message.match(/^Removed "(.+)" from wishlist$/);
      const cartAdd = message.match(/^Added "(.+)" to cart$/);
      if (wishAdd) addToWishlist(wishAdd[1]);
      if (wishRem) removeFromWishlist(wishRem[1]);
      if (cartAdd) addToCart(cartAdd[1]);
    }
    return _originalShowToast.call(this, message, type);
  };

  /* ============================================================
     RESTORE USER STATE ON PAGE LOAD
     ============================================================ */
  function restoreWishlistHearts() {
    const list = getWishlist();
    document.querySelectorAll('.wishlist-btn').forEach((btn) => {
      const name = btn.dataset.product;
      const active = list.includes(name);
      btn.classList.toggle('active', active);
      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-solid', active);
        icon.classList.toggle('fa-regular', !active);
      }
    });
  }

  function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((sum, i) => sum + i.qty, 0);
    document.querySelectorAll('.cart-badge').forEach((badge) => {
      if (badge.textContent !== String(count)) {
        badge.textContent = count;
        badge.classList.remove('pop');
        void badge.offsetWidth;
        badge.classList.add('pop');
      }
    });
  }

  /* ============================================================
     SEARCH
     ============================================================ */
  const searchInput = document.querySelector('.search-bar input');
  const searchResults = document.getElementById('searchResults');
  let searchDebounce = null;

  function renderResults(matches) {
    if (!searchResults) return;
    if (!matches.length) return;

    searchResults.innerHTML = matches.slice(0, 5).map((p) => `
      <a class="search-result-item" data-product-id="${p.id}" data-product="${p.name}">
        <img class="search-result-img" src="${productImage(p.id)}" alt="${p.name}" loading="lazy" />
        <div class="search-result-info">
          <div class="search-result-name">${p.name}</div>
          <div class="search-result-cat">${p.tag || p.category}</div>
        </div>
        <div class="search-result-price">$${p.price.toFixed(2)}</div>
      </a>
    `).join('');

    searchResults.querySelectorAll('.search-result-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetName = item.dataset.product;
        closeSearch();
        scrollToProduct(targetName);
      });
    });

    searchResults.classList.add('active');
  }

  function renderNoResults(query) {
    if (!searchResults) return;
    searchResults.innerHTML = `
      <div class="search-no-result">
        <div class="search-no-result-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
        <div class="search-no-result-title">We don't have "${query}" yet</div>
        <div class="search-no-result-desc">Sign up and we'll notify you the moment it's available.</div>
        <button class="search-notify-btn" id="notifyMeBtn">
          <i class="fa-regular fa-bell"></i> Notify Me
        </button>
      </div>
    `;
    searchResults.classList.add('active');

    const btn = document.getElementById('notifyMeBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        const message = `We don't have <strong>${query}</strong> yet. Sign up and we'll notify you when it arrives.`;

        if (typeof isLoggedIn === 'function' && isLoggedIn()) {
          saveWishedProduct(query);
          showToast(`We'll notify you when "${query}" arrives.`, 'success');
          closeSearch();
        } else {
          // Save the wish immediately so it isn't lost; login just gates UX
          saveWishedProduct(query);
          if (typeof openLoginModal === 'function') {
            openLoginModal(message);
          }
          closeSearch();
        }
      });
    }
  }

  function closeSearch() {
    searchResults?.classList.remove('active');
    if (searchResults) searchResults.innerHTML = '';
    const bar = document.getElementById('searchBar');
    bar?.classList.remove('active');
    if (searchInput) searchInput.value = '';
  }

  function scrollToProduct(name) {
    const cards = document.querySelectorAll('.product-card');
    let target = null;
    cards.forEach((card) => {
      const btn = card.querySelector(`[data-product="${name}"]`);
      if (btn) target = card;
    });
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('search-highlight');
    setTimeout(() => target.classList.remove('search-highlight'), 1800);
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      clearTimeout(searchDebounce);

      if (!query) {
        searchResults?.classList.remove('active');
        if (searchResults) searchResults.innerHTML = '';
        return;
      }

      searchDebounce = setTimeout(() => {
        const q = query.toLowerCase();
        const matches = PRODUCTS.filter(
          (p) => p.name.toLowerCase().includes(q) ||
              (p.tag || '').toLowerCase().includes(q) ||
              (p.category || '').toLowerCase().includes(q)
        );

        if (matches.length) renderResults(matches);
        else renderNoResults(query);
      }, 300);
    });
  }

  /* ============================================================
     CART DRAWER
     ============================================================ */
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartBody = document.getElementById('cartBody');
  const cartFooter = document.getElementById('cartFooter');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartHeaderCount = document.getElementById('cartHeaderCount');
  const cartCloseBtn = document.getElementById('cartClose');
  const cartContinueBtn = document.getElementById('cartContinue');
  const cartCheckoutBtn = document.getElementById('cartCheckout');

  function openCartDrawer() {
    renderCartDrawer();
    cartDrawer?.classList.add('active');
    cartOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCartDrawer() {
    cartDrawer?.classList.remove('active');
    cartOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function renderCartDrawer() {
    if (!cartBody) return;
    const cart = getCart();

    if (!cart.length) {
      cartBody.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon"><i class="fa-solid fa-bag-shopping"></i></div>
          <div class="cart-empty-title">Your cart is empty</div>
          <div class="cart-empty-desc">Add some fresh picks and they'll show up here.</div>
        </div>
      `;
      if (cartFooter) cartFooter.style.display = 'none';
      if (cartHeaderCount) cartHeaderCount.textContent = '0';
      return;
    }

    if (cartFooter) cartFooter.style.display = 'block';

    cartBody.innerHTML = cart.map((item) => {
      const product = findProduct(item.name);
      const img = product ? productImage(product.id) : '';
      return `
        <div class="cart-item">
          <img class="cart-item-img" src="${img}" alt="${item.name}" loading="lazy" />
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-controls">
              <div class="qty-stepper">
                <button class="qty-btn" data-action="dec" data-name="${item.name}">−</button>
                <span class="qty-value">${item.qty}</span>
                <button class="qty-btn" data-action="inc" data-name="${item.name}">+</button>
              </div>
              <button class="cart-item-remove" data-name="${item.name}" aria-label="Remove">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Wire controls
    cartBody.querySelectorAll('.qty-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const delta = btn.dataset.action === 'inc' ? 1 : -1;
        changeQty(btn.dataset.name, delta);
      });
    });
    cartBody.querySelectorAll('.cart-item-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        removeFromCart(btn.dataset.name);
        showToast(`Removed "${btn.dataset.name}" from cart`, 'info');
      });
    });

    // Totals
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const count = cart.reduce((s, i) => s + i.qty, 0);
    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (cartHeaderCount) cartHeaderCount.textContent = count;
  }

  cartCloseBtn?.addEventListener('click', closeCartDrawer);
  cartOverlay?.addEventListener('click', closeCartDrawer);
  cartContinueBtn?.addEventListener('click', closeCartDrawer);
  cartCheckoutBtn?.addEventListener('click', () => {
    closeCartDrawer();
    if (typeof window.openCheckoutModal === 'function') {
      window.openCheckoutModal();
    }
  });

  // Intercept cart-icon clicks (capture phase, before main.js's login-trigger)
  document.addEventListener('click', (e) => {
    const cartBtn = e.target.closest('.cart-btn');
    if (!cartBtn) return;
    if (typeof isLoggedIn === 'function' && isLoggedIn()) {
      e.preventDefault();
      e.stopPropagation();
      openCartDrawer();
    }
    // else: main.js's login-trigger handler opens the modal
  }, true);

  /* ============================================================
     SCROLL TO TOP
     ============================================================ */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) scrollTopBtn?.classList.add('active');
    else scrollTopBtn?.classList.remove('active');
  }, { passive: true });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     WATCH LOGIN MODAL — sync state when user logs in
     ============================================================ */
  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    let wasActive = false;
    new MutationObserver(() => {
      const active = loginModal.classList.contains('active');
      if (wasActive && !active) {
        // Modal just closed
        restoreWishlistHearts();
        updateCartBadge();
        renderCartDrawer();
      }
      wasActive = active;
    }).observe(loginModal, { attributes: true, attributeFilter: ['class'] });
  }

  /* ============================================================
     INIT
     ============================================================ */
  restoreWishlistHearts();
  updateCartBadge();
});

/* ============================================================
   CHECKOUT MODAL
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('checkoutModal');
  if (!modal) return;

  const closeBtn = document.getElementById('checkoutClose');
  const placeOrderBtn = document.getElementById('coPlaceOrder');
  const continueShoppingBtn = document.getElementById('coContinueShopping');
  const cardFields = document.getElementById('cardFields');
  const summaryItems = document.getElementById('coSummaryItems');
  const deliveryRadios = modal.querySelectorAll('input[name="coDelivery"]');
  const paymentRadios = modal.querySelectorAll('input[name="coPayment"]');
  const paymentLabels = modal.querySelectorAll('.checkout-section .option-card');
  const formView = modal.querySelector('.checkout-view[data-view="form"]');
  const successView = modal.querySelector('.checkout-view[data-view="success"]');

  /* ---------- Price helpers ---------- */
  const TAX_RATE = 0.05;

    /* ---------- Order storage (per user) ---------- */
  function orderKey(email) { return `bigmart_orders_${email}`; }

  function saveOrder(order) {
    if (typeof getCurrentUser !== 'function') return;
    const user = getCurrentUser();
    if (!user) return;
    let list = [];
    try { list = JSON.parse(localStorage.getItem(orderKey(user.email)) || '[]'); }
    catch { list = []; }
    list.unshift(order); // newest first
    localStorage.setItem(orderKey(user.email), JSON.stringify(list));
  }

  function getCart() {
    if (typeof getCurrentUser !== 'function') return [];
    const user = getCurrentUser();
    if (!user) return [];
    try { return JSON.parse(localStorage.getItem(`bigmart_cart_${user.email}`) || '[]'); }
    catch { return []; }
  }

  function clearCartForUser() {
    if (typeof getCurrentUser !== 'function') return;
    const user = getCurrentUser();
    if (!user) return;
    localStorage.setItem(`bigmart_cart_${user.email}`, JSON.stringify([]));
    // Let features.js refresh its badge
    window.dispatchEvent(new Event('focus'));
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      badge.textContent = '0';
      badge.classList.remove('pop');
      void badge.offsetWidth;
      badge.classList.add('pop');
    }
  }

  function getDeliveryFee() {
    const selected = modal.querySelector('input[name="coDelivery"]:checked');
    return selected ? parseFloat(selected.dataset.fee) || 0 : 0;
  }

  function updateSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const delivery = getDeliveryFee();
    const tax = subtotal * TAX_RATE;
    const total = subtotal + delivery + tax;

    // Items
    if (summaryItems) {
      summaryItems.innerHTML = cart.map((item) => `
        <div class="summary-item">
          <span class="summary-item-name">
            ${item.name}
            <em>×${item.qty}</em>
          </span>
          <span class="summary-item-price">$${(item.price * item.qty).toFixed(2)}</span>
        </div>
      `).join('');
    }

    const elSub = document.getElementById('coSubtotal');
    const elDel = document.getElementById('coDelivery');
    const elTax = document.getElementById('coTax');
    const elTot = document.getElementById('coTotal');

    if (elSub) elSub.textContent = `$${subtotal.toFixed(2)}`;
    if (elDel) elDel.textContent = delivery === 0 ? 'Free' : `$${delivery.toFixed(2)}`;
    if (elTax) elTax.textContent = `$${tax.toFixed(2)}`;
    if (elTot) elTot.textContent = `$${total.toFixed(2)}`;
  }

  /* ---------- Modal open / close ---------- */
  window.openCheckoutModal = function () {
    const cart = getCart();
    if (!cart.length) {
      if (typeof showToast === 'function') showToast('Your cart is empty.', 'info');
      return;
    }

    // Reset to form view
    formView?.classList.add('active');
    successView?.classList.remove('active');

    // Prefill name/email from logged-in user
    if (typeof getCurrentUser === 'function') {
      const user = getCurrentUser();
      if (user) {
        const nameEl = document.getElementById('coName');
        const emailEl = document.getElementById('coEmail');
        if (nameEl && !nameEl.value) nameEl.value = user.name || '';
        if (emailEl && !emailEl.value) emailEl.value = user.email || '';
      }
    }

    updateSummary();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  function closeCheckoutModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Always reset to form view
    formView?.classList.add('active');
    successView?.classList.remove('active');

    // Clear all input fields
    modal.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach((i) => {
      i.value = '';
    });

    // Hide card fields (payment defaults to 'card', but the fields reset)
    cardFields?.classList.remove('active');
  }

  closeBtn?.addEventListener('click', closeCheckoutModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeCheckoutModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeCheckoutModal();
  });

  /* ---------- Delivery fee updates ---------- */
  deliveryRadios.forEach((r) => r.addEventListener('change', updateSummary));

  /* ---------- Payment method toggles card fields ---------- */
  paymentRadios.forEach((r) => {
    r.addEventListener('change', () => {
      const showCard = r.value === 'card';
      cardFields?.classList.toggle('active', showCard);
    });
  });

  /* ---------- Card input formatting ---------- */
  const cardNumber = document.getElementById('coCardNumber');
  const cardExpiry = document.getElementById('coCardExpiry');
  const cardCvv = document.getElementById('coCardCvv');

  cardNumber?.addEventListener('input', () => {
    let v = cardNumber.value.replace(/\D/g, '').slice(0, 16);
    cardNumber.value = v.replace(/(.{4})/g, '$1 ').trim();
  });

  cardExpiry?.addEventListener('input', () => {
    let v = cardExpiry.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + ' / ' + v.slice(2);
    cardExpiry.value = v;
  });

  cardCvv?.addEventListener('input', () => {
    cardCvv.value = cardCvv.value.replace(/\D/g, '').slice(0, 4);
  });

  /* ---------- Validation ---------- */
  function validateForm() {
    const name = document.getElementById('coName')?.value.trim();
    const email = document.getElementById('coEmail')?.value.trim();
    const phone = document.getElementById('coPhone')?.value.trim();
    const city = document.getElementById('coCity')?.value.trim();
    const address = document.getElementById('coAddress')?.value.trim();

    if (!name || !email || !phone || !city || !address) {
      showToast('Please fill in all delivery details.', 'warning');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      showToast('Please enter a valid email address.', 'warning');
      return false;
    }

    const payment = modal.querySelector('input[name="coPayment"]:checked')?.value;
    if (payment === 'card') {
      const cardName = document.getElementById('coCardName')?.value.trim();
      const cardNum = cardNumber?.value.replace(/\s/g, '');
      const expiry = cardExpiry?.value.replace(/\s/g, '');
      const cvv = cardCvv?.value;

      if (!cardName) { showToast('Please enter the name on your card.', 'warning'); return false; }
      if (!cardNum || cardNum.length < 15) { showToast('Please enter a valid card number.', 'warning'); return false; }
      if (!expiry || expiry.length < 4) { showToast('Please enter the card expiry date.', 'warning'); return false; }
      if (!cvv || cvv.length < 3) { showToast('Please enter the CVV.', 'warning'); return false; }
    }
    return true;
  }

  /* ---------- Place order ---------- */
    placeOrderBtn?.addEventListener('click', () => {
    if (!validateForm()) return;

    const cart = getCart();
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const delivery = getDeliveryFee();
    const tax = subtotal * TAX_RATE;
    const total = subtotal + delivery + tax;

    const paymentLabelsMap = { card: 'Credit / Debit Card', cod: 'Cash on Delivery', paypal: 'PayPal' };
    const payment = modal.querySelector('input[name="coPayment"]:checked')?.value || 'card';
    const deliveryMethod = modal.querySelector('input[name="coDelivery"]:checked')?.value || 'standard';

    // Generate order number + ETA
    const orderNum = 'BM-' + Math.floor(100000 + Math.random() * 900000);
    const eta = deliveryMethod === 'express' ? '25–35 minutes' : '50–70 minutes';

    // Build the order object
    const order = {
      number: orderNum,
      date: new Date().toISOString(),
      items: cart.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
      subtotal,
      delivery: deliveryMethod,
      deliveryFee: delivery,
      tax,
      total,
      payment,
      paymentLabel: paymentLabelsMap[payment],
      eta,
      status: 'Confirmed',
      details: {
        name:     document.getElementById('coName')?.value.trim()     || '',
        email:    document.getElementById('coEmail')?.value.trim()    || '',
        phone:    document.getElementById('coPhone')?.value.trim()    || '',
        city:     document.getElementById('coCity')?.value.trim()     || '',
        address:  document.getElementById('coAddress')?.value.trim()  || '',
        notes:    document.getElementById('coNotes')?.value.trim()    || ''
      }
    };

    // Save the order (per user)
    saveOrder(order);

    // Populate success view
    document.getElementById('successOrderNum').textContent = orderNum;
    document.getElementById('successEta').textContent = eta;
    document.getElementById('successTotal').textContent = `$${total.toFixed(2)}`;
    document.getElementById('successPayment').textContent = paymentLabelsMap[payment];

    // Swap views
    formView?.classList.remove('active');
    successView?.classList.add('active');

    // Clear cart
    clearCartForUser();

    if (typeof showToast === 'function') {
      showToast(`Order ${orderNum} saved to your account`, 'success');
    }
  });

  continueShoppingBtn?.addEventListener('click', () => {
    closeCheckoutModal();
    // Reset form
    modal.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach((i) => {
      i.value = '';
    });
    cardFields?.classList.remove('active');
  });

  /* ---------- Initialize card fields visibility on open ---------- */
  const initialPayment = modal.querySelector('input[name="coPayment"]:checked')?.value;
  cardFields?.classList.toggle('active', initialPayment === 'card');
});


