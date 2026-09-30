/* ============================================================
   BIG MART — ACCOUNT PAGE
   Profile · Orders · Wishlist · Addresses · Logout
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const layout = document.getElementById('accountLayout');
  if (!layout) return;

  const loggedOut = document.getElementById('accountLoggedOut');
  const loginBtn = document.getElementById('accountLoginBtn');

  const IMAGE_BASE = '../images/products/';
  const IMAGE_EXTENSION = '.jpg';

  /* ------------------------------------------------------------
     LOGIN STATE
     ------------------------------------------------------------ */
  function getUser() {
    try {
      return JSON.parse(
        localStorage.getItem('bigmart_session') ||
        sessionStorage.getItem('bigmart_session') ||
        'null'
      );
    } catch { return null; }
  }

  const user = getUser();

  if (!user) {
    // Show logged-out state, hide everything else
    loggedOut.style.display = 'flex';
    layout.style.display = 'none';

    loginBtn?.addEventListener('click', () => {
      if (typeof openLoginModal === 'function') {
        openLoginModal('Log in to access your account.');
      }
    });

    // Watch for successful login (modal closes + session set)
    const modal = document.getElementById('loginModal');
    if (modal) {
      const check = setInterval(() => {
        if (getUser()) {
          clearInterval(check);
          location.reload();
        }
      }, 600);
    }
    return;
  }

  // Logged in
  loggedOut.style.display = 'none';
  layout.style.display = 'grid';

  /* ------------------------------------------------------------
     LOAD USER DATA
     ------------------------------------------------------------ */
  const firstName = (user.name || 'User').split(' ')[0];

  document.getElementById('accountAvatar').textContent = firstName.charAt(0).toUpperCase();
  document.getElementById('accountName').textContent = user.name || 'User';
  document.getElementById('accountEmail').textContent = user.email || '';
  document.getElementById('profileName').textContent = user.name || '—';
  document.getElementById('profileEmail').textContent = user.email || '—';

  const providerLabels = {
    google: 'Google',
    microsoft: 'Microsoft',
    apple: 'Apple',
    manual: 'Email & Password'
  };
  document.getElementById('profileProvider').textContent = providerLabels[user.provider] || 'Email & Password';

  // Member since — set at first login
  let since = localStorage.getItem('bigmart_since_' + user.email);
  if (!since) {
    since = new Date().toISOString();
    localStorage.setItem('bigmart_since_' + user.email, since);
  }
  document.getElementById('profileSince').textContent = new Date(since).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  /* ------------------------------------------------------------
     TABS
     ------------------------------------------------------------ */
  const tabs = document.querySelectorAll('.account-tab[data-tab]');
  const panels = document.querySelectorAll('.account-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      const target = document.querySelector(`.account-panel[data-panel="${tab.dataset.tab}"]`);
      if (target) target.classList.add('active');
    });
  });

  /* ------------------------------------------------------------
     ORDERS
     ------------------------------------------------------------ */
  const ordersContainer = document.getElementById('ordersContainer');
  const ordersCount = document.getElementById('ordersCount');

  function loadOrders() {
    let orders = [];
    try {
      orders = JSON.parse(localStorage.getItem('bigmart_orders_' + user.email) || '[]');
    } catch { orders = []; }

    ordersCount.textContent = orders.length;

    if (!orders.length) {
      ordersContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-bag-shopping"></i></div>
          <h3>No orders yet</h3>
          <p>Your order history will appear here once you place your first order.</p>
          <a href="fruits.html" class="cta-btn empty-state-btn">Start Shopping</a>
        </div>
      `;
      return;
    }

    ordersContainer.innerHTML = orders.map((o) => orderCard(o)).join('');

    // Wire expand toggles
    ordersContainer.querySelectorAll('.order-header').forEach((h) => {
      h.addEventListener('click', () => {
        h.parentElement.classList.toggle('open');
      });
    });
  }

  function orderCard(o) {
    const date = new Date(o.date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });

    const itemsHTML = (o.items || []).map((i) => `
      <div class="order-item">
        <span class="order-item-name">${i.name} <em>×${i.qty}</em></span>
        <span class="order-item-price">$${(i.price * i.qty).toFixed(2)}</span>
      </div>
    `).join('');

    return `
      <div class="order-card">
        <div class="order-header">
          <div class="order-head-info">
            <div class="order-num">${o.number}</div>
            <div class="order-meta">${date} · ${o.items.length} item${o.items.length === 1 ? '' : 's'}</div>
          </div>
          <div class="order-head-right">
            <span class="order-status">${o.status || 'Confirmed'}</span>
            <span class="order-total">$${o.total.toFixed(2)}</span>
            <i class="fa-solid fa-chevron-down order-chevron"></i>
          </div>
        </div>
        <div class="order-body">
          <div class="order-items">
            ${itemsHTML}
          </div>
          <div class="order-detail-rows">
            <div class="order-detail-row">
              <span>Subtotal</span><strong>$${o.subtotal.toFixed(2)}</strong>
            </div>
            <div class="order-detail-row">
              <span>Delivery (${o.delivery === 'express' ? 'Express' : 'Standard'})</span>
              <strong>${o.deliveryFee === 0 ? 'Free' : '$' + o.deliveryFee.toFixed(2)}</strong>
            </div>
            <div class="order-detail-row">
              <span>Tax</span><strong>$${o.tax.toFixed(2)}</strong>
            </div>
            <div class="order-detail-row total">
              <span>Total</span><strong>$${o.total.toFixed(2)}</strong>
            </div>
          </div>
          <div class="order-footer-info">
            <span><i class="fa-solid fa-truck"></i> ${o.eta || '—'}</span>
            <span><i class="fa-solid fa-credit-card"></i> ${o.paymentLabel || '—'}</span>
          </div>
        </div>
      </div>
    `;
  }

  loadOrders();

  /* ------------------------------------------------------------
     WISHLIST
     ------------------------------------------------------------ */
  const wishlistContainer = document.getElementById('accountWishlist');
  const wishlistCount = document.getElementById('wishlistCount');

  function loadWishlist() {
    let names = [];
    try {
      names = JSON.parse(localStorage.getItem('bigmart_wishlist_' + user.email) || '[]');
    } catch { names = []; }

    wishlistCount.textContent = names.length;

    const all = window.BIGMART_PRODUCTS || [];
    const items = all.filter((p) => names.includes(p.name));

    if (!items.length) {
      wishlistContainer.innerHTML = `
        <div class="empty-state full-width">
          <div class="empty-state-icon"><i class="fa-regular fa-heart"></i></div>
          <h3>Your wishlist is empty</h3>
          <p>Tap the heart on any product to save it here for later.</p>
          <a href="fruits.html" class="cta-btn empty-state-btn">Browse Products</a>
        </div>
      `;
      return;
    }

    wishlistContainer.innerHTML = items.map((p) => `
      <article class="product-card" data-product-id="${p.id}">
        <div class="product-media">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          <button class="wishlist-btn active" data-product="${p.name}" aria-label="Remove ${p.name} from wishlist">
            <i class="fa-solid fa-heart"></i>
          </button>
          <img src="${IMAGE_BASE}${p.image}${p.ext || IMAGE_EXTENSION}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="product-info">
          <span class="product-tag">${p.tag}</span>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-rating"><i class="fa-solid fa-star"></i> ${p.rating} <span>(${p.reviews})</span></div>
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
    `).join('');

    // Wire remove-from-wishlist
    wishlistContainer.querySelectorAll('.wishlist-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const name = btn.dataset.product;
        let list = [];
        try { list = JSON.parse(localStorage.getItem('bigmart_wishlist_' + user.email) || '[]'); }
        catch { list = []; }
        list = list.filter((n) => n !== name);
        localStorage.setItem('bigmart_wishlist_' + user.email, JSON.stringify(list));
        if (typeof showToast === 'function') showToast(`Removed "${name}" from wishlist`, 'info');
        loadWishlist();
      });
    });

    // Wire add-to-cart
    wishlistContainer.querySelectorAll('.add-cart-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const name = btn.dataset.product;
        if (typeof isLoggedIn === 'function' && isLoggedIn()) {
          if (typeof showToast === 'function') showToast(`Added "${name}" to cart`, 'success');
        } else if (typeof openLoginModal === 'function') {
          openLoginModal(`Log in to add <strong>${name}</strong> to your cart.`);
        }
      });
    });
  }

  loadWishlist();

  /* ------------------------------------------------------------
     ADDRESS
     ------------------------------------------------------------ */
  const addressForm = document.getElementById('addressForm');
  const addrPhone = document.getElementById('addrPhone');
  const addrCity = document.getElementById('addrCity');
  const addrLine = document.getElementById('addrLine');
  const addrNotes = document.getElementById('addrNotes');

  // Load existing
  let savedAddress = {};
  try { savedAddress = JSON.parse(localStorage.getItem('bigmart_address_' + user.email) || '{}'); }
  catch { savedAddress = {}; }

  if (savedAddress.phone) addrPhone.value = savedAddress.phone;
  if (savedAddress.city) addrCity.value = savedAddress.city;
  if (savedAddress.line) addrLine.value = savedAddress.line;
  if (savedAddress.notes) addrNotes.value = savedAddress.notes;

  addressForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      phone: addrPhone.value.trim(),
      city: addrCity.value.trim(),
      line: addrLine.value.trim(),
      notes: addrNotes.value.trim()
    };
    if (!data.phone || !data.city || !data.line) {
      if (typeof showToast === 'function') showToast('Please fill in phone, city, and street address.', 'warning');
      return;
    }
    localStorage.setItem('bigmart_address_' + user.email, JSON.stringify(data));
    if (typeof showToast === 'function') showToast('Address saved successfully.', 'success');
  });

  /* ------------------------------------------------------------
     LOGOUT
     ------------------------------------------------------------ */
  document.getElementById('accountLogout')?.addEventListener('click', () => {
    localStorage.removeItem('bigmart_session');
    sessionStorage.removeItem('bigmart_session');
    if (typeof showToast === 'function') showToast('Logged out successfully.', 'info');
    setTimeout(() => { window.location.href = '../mart.html'; }, 700);
  });
});