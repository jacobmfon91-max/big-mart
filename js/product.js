/* ============================================================
   BIG MART — SINGLE PRODUCT PAGE
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const mainEl = document.getElementById('productMain');
  if (!mainEl) return;

  const IMAGE_BASE = '../images/products/';
  const IMAGE_EXTENSION = '.jpg';

  /* ------------------------------------------------------------
     GET PRODUCT FROM URL
     ------------------------------------------------------------ */
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  const all = window.BIGMART_PRODUCTS || [];
  const product = all.find((p) => p.id === productId);

  /* ------------------------------------------------------------
     NOT FOUND
     ------------------------------------------------------------ */
  if (!product) {
    mainEl.innerHTML = `
      <div class="empty-state full-width">
        <div class="empty-state-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <h3>Product not found</h3>
        <p>We couldn't find that product. It may have been removed or the link is incorrect.</p>
        <a href="fruits.html" class="cta-btn empty-state-btn">Back to Shop</a>
      </div>
    `;
    document.title = 'Product Not Found – Big Mart';
    return;
  }

  /* ------------------------------------------------------------
     UPDATE TITLE + BREADCRUMB
     ------------------------------------------------------------ */
  document.title = `${product.name} – Big Mart`;
  document.getElementById('crumbProductName').textContent = product.name;

  const categoryLabels = {
    fruits: 'Fruits', vegetables: 'Vegetables', dairy: 'Dairy & Eggs',
    bakery: 'Bakery', beverages: 'Beverages', snacks: 'Snacks'
  };
  const categoryLabel = categoryLabels[product.category] || product.category;
  const catLink = document.getElementById('crumbCategoryLink');
  catLink.textContent = categoryLabel;
  catLink.href = `${product.category}.html`;

  /* ------------------------------------------------------------
     RENDER MAIN
     ------------------------------------------------------------ */
  const imgSrc = `${IMAGE_BASE}${product.image}${product.ext || IMAGE_EXTENSION}`;

  mainEl.innerHTML = `
    <div class="product-main">

      <!-- LEFT: IMAGE -->
      <div class="product-media-col" data-reveal="left">
        <div class="product-hero">
          ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
          <img src="${imgSrc}" alt="${product.name}" />
        </div>
        <div class="product-thumbs">
          <button class="thumb active"><img src="${imgSrc}" alt="" /></button>
          <button class="thumb"><img src="${imgSrc}" alt="" /></button>
          <button class="thumb"><img src="${imgSrc}" alt="" /></button>
        </div>
      </div>

      <!-- RIGHT: INFO -->
      <div class="product-info-col" data-reveal="right">
        <span class="product-tag">${product.tag}</span>
        <h1 class="product-page-name">${product.name}</h1>

        <div class="product-page-rating">
          <i class="fa-solid fa-star"></i>
          <strong>${product.rating}</strong>
          <span>(${product.reviews} reviews)</span>
        </div>

        <div class="product-page-price">
          <span class="price-current-lg">$${product.price.toFixed(2)}</span>
          ${product.oldPrice ? `<span class="price-old-lg">$${product.oldPrice.toFixed(2)}</span>` : ''}
        </div>

        <p class="product-page-desc">${product.description}</p>

        <div class="product-page-actions">
          <div class="qty-stepper-lg">
            <button class="qty-btn-lg" data-action="dec" aria-label="Decrease">−</button>
            <span class="qty-value-lg" id="productQty">1</span>
            <button class="qty-btn-lg" data-action="inc" aria-label="Increase">+</button>
          </div>
          <button class="add-cart-btn-lg" id="productAddCart" data-product="${product.name}">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
          </button>
          <button class="wishlist-btn-lg" id="productWishlist" data-product="${product.name}" aria-label="Wishlist">
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>

        <div class="product-trust">
          <div class="trust-item">
            <i class="fa-solid fa-lock"></i>
            <span>Secure Payment</span>
          </div>
          <div class="trust-item">
            <i class="fa-solid fa-truck-fast"></i>
            <span>60 min Delivery</span>
          </div>
          <div class="trust-item">
            <i class="fa-solid fa-rotate-left"></i>
            <span>Easy Returns</span>
          </div>
        </div>
      </div>

    </div>
  `;

  /* ------------------------------------------------------------
     TABS
     ------------------------------------------------------------ */
  document.getElementById('productTabs').style.display = 'block';
  document.getElementById('tabDescription').textContent =
    `${product.description} Perfect for everyday meals, quick snacks, and sharing with family. Sourced with care and delivered fresh to your door by Big Mart.`;

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`);
      if (panel) panel.classList.add('active');
    });
  });

  /* ------------------------------------------------------------
     QUANTITY
     ------------------------------------------------------------ */
  let qty = 1;
  const qtyEl = document.getElementById('productQty');

  document.querySelectorAll('.qty-btn-lg').forEach((btn) => {
    btn.addEventListener('click', () => {
      const delta = btn.dataset.action === 'inc' ? 1 : -1;
      qty = Math.max(1, qty + delta);
      qtyEl.textContent = qty;
    });
  });

  /* ------------------------------------------------------------
     ADD TO CART
     ------------------------------------------------------------ */
  document.getElementById('productAddCart')?.addEventListener('click', () => {
    if (typeof isLoggedIn !== 'function' || !isLoggedIn()) {
      if (typeof openLoginModal === 'function') {
        openLoginModal(`Log in to add <strong>${product.name}</strong> to your cart.`);
      }
      return;
    }
    for (let i = 0; i < qty; i++) {
      if (typeof showToast === 'function') {
        showToast(`Added "${product.name}" to cart`, 'success');
      }
    }
  });

  /* ------------------------------------------------------------
     WISHLIST
     ------------------------------------------------------------ */
  const wishBtn = document.getElementById('productWishlist');

  function refreshWishlistState() {
    if (!wishBtn) return;
    if (typeof getCurrentUser !== 'function') return;
    const user = getCurrentUser();
    if (!user) return;

    let list = [];
    try { list = JSON.parse(localStorage.getItem(`bigmart_wishlist_${user.email}`) || '[]'); }
    catch { list = []; }

    const active = list.includes(product.name);
    wishBtn.classList.toggle('active', active);
    const icon = wishBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-solid', active);
      icon.classList.toggle('fa-regular', !active);
    }
  }

  wishBtn?.addEventListener('click', () => {
    if (typeof isLoggedIn !== 'function' || !isLoggedIn()) {
      if (typeof openLoginModal === 'function') {
        openLoginModal(`Log in to save <strong>${product.name}</strong> to your wishlist.`);
      }
      return;
    }

    const active = wishBtn.classList.contains('active');
    const icon = wishBtn.querySelector('i');

    if (active) {
      wishBtn.classList.remove('active');
      if (icon) { icon.classList.remove('fa-solid'); icon.classList.add('fa-regular'); }
      if (typeof showToast === 'function') showToast(`Removed "${product.name}" from wishlist`, 'info');
    } else {
      wishBtn.classList.add('active');
      if (icon) { icon.classList.remove('fa-regular'); icon.classList.add('fa-solid'); }
      if (typeof showToast === 'function') showToast(`Added "${product.name}" to wishlist`, 'success');
    }
  });

  refreshWishlistState();

  /* ------------------------------------------------------------
     RELATED PRODUCTS
     ------------------------------------------------------------ */
  const related = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  if (related.length) {
    document.getElementById('relatedProducts').style.display = 'block';
    const relatedGrid = document.getElementById('relatedGrid');

    relatedGrid.innerHTML = related.map((p, i) => {
      const dir = ['left', 'up', 'right'][i % 3];
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
      `;
    }).join('');

    /* Related card clicks → navigate to that product's page */
    relatedGrid.querySelectorAll('.product-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        const id = card.dataset.productId;
        window.location.href = `product.html?id=${id}`;
      });
    });

    /* Wire wishlist + cart on related */
    relatedGrid.querySelectorAll('.wishlist-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        const name = btn.dataset.product;
        if (typeof isLoggedIn !== 'function' || !isLoggedIn()) {
          if (typeof openLoginModal === 'function') openLoginModal(`Log in to save <strong>${name}</strong> to your wishlist.`);
          return;
        }
        const active = btn.classList.contains('active');
        const icon = btn.querySelector('i');
        if (active) {
          btn.classList.remove('active');
          if (icon) { icon.classList.remove('fa-solid'); icon.classList.add('fa-regular'); }
          if (typeof showToast === 'function') showToast(`Removed "${name}" from wishlist`, 'info');
        } else {
          btn.classList.add('active');
          if (icon) { icon.classList.remove('fa-regular'); icon.classList.add('fa-solid'); }
          if (typeof showToast === 'function') showToast(`Added "${name}" to wishlist`, 'success');
        }
        btn.classList.add('popping');
        setTimeout(() => btn.classList.remove('popping'), 450);
      });
    });

    relatedGrid.querySelectorAll('.add-cart-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation();
        const name = btn.dataset.product;
        if (typeof isLoggedIn === 'function' && isLoggedIn()) {
          if (typeof showToast === 'function') showToast(`Added "${name}" to cart`, 'success');
        } else if (typeof openLoginModal === 'function') {
          openLoginModal(`Log in to add <strong>${name}</strong> to your cart.`);
        }
      });
    });

    /* Reveal observer */
    const targets = relatedGrid.querySelectorAll('.product-card');
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
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
      targets.forEach((el) => obs.observe(el));
    } else {
      targets.forEach((el) => el.classList.add('revealed'));
    }
  }

  /* ------------------------------------------------------------
     REVEAL MAIN COLUMNS
     ------------------------------------------------------------ */
  const mainTargets = mainEl.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
    }, { threshold: 0.15 });
    mainTargets.forEach((el) => obs.observe(el));
  } else {
    mainTargets.forEach((el) => el.classList.add('revealed'));
  }

  /* Thumbs (visual only) */
  document.querySelectorAll('.thumb').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.thumb').forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
});