/* ============================================================
   BIG MART — SHARED LAYOUT
   Injects navbar, mobile menu, footer, login modal,
   cart drawer, toasts, and scroll-to-top into every page.

   Load this BEFORE main.js in every HTML file.
   ============================================================ */

(function () {
  'use strict';

  /* ------------------------------------------------------------
     PATH DETECTION
     Works from both /index.html and /pages/*.html
     ------------------------------------------------------------ */
  const isSubPage = /\/pages\//.test(window.location.pathname);
  const HOME = isSubPage ? '../mart.html' : 'mart.html';
  const CATEGORY_PATH = isSubPage ? '' : 'pages/';

  /* ------------------------------------------------------------
     NAVBAR
     ------------------------------------------------------------ */
  const navbarHTML = `
  <header class="navbar" id="navbar">
    <div class="nav-container">
      <a href="${HOME}" class="logo">
        <i class="fa-solid fa-cart-shopping logo-icon"></i>
        <span class="logo-text">Big<span class="logo-accent">Mart</span></span>
      </a>

      <nav class="nav-links" id="navLinks">
        <ul>
          <li><a href="${HOME}" class="active">Home</a></li>
          <li><a href="#" class="login-trigger" data-message="Log in to start shopping at Big Mart." data-href="${CATEGORY_PATH}shop.html">Shop</a></li>
          <li class="dropdown">
            <a href="#">Categories <i class="fa-solid fa-chevron-down"></i></a>
            <ul class="dropdown-menu">
              <li><a href="#" class="login-trigger" data-message="Log in to browse Fruits." data-href="${CATEGORY_PATH}fruits.html">Fruits</a></li>
              <li><a href="#" class="login-trigger" data-message="Log in to browse Vegetables." data-href="${CATEGORY_PATH}vegetables.html">Vegetables</a></li>
              <li><a href="#" class="login-trigger" data-message="Log in to browse Dairy." data-href="${CATEGORY_PATH}dairy.html">Dairy &amp; Eggs</a></li>
              <li><a href="#" class="login-trigger" data-message="Log in to browse Bakery." data-href="${CATEGORY_PATH}bakery.html">Bakery</a></li>
              <li><a href="#" class="login-trigger" data-message="Log in to browse Beverages." data-href="${CATEGORY_PATH}beverages.html">Beverages</a></li>
              <li><a href="#" class="login-trigger" data-message="Log in to browse Snacks." data-href="${CATEGORY_PATH}snacks.html">Snacks</a></li>
              <li><a href="#" class="login-trigger" data-message="Log in to learn more about Big Mart." data-href="${CATEGORY_PATH}about.html">About</a></li>
              <li><a href="#" class="login-trigger" data-message="Log in to contact Big Mart." data-href="${CATEGORY_PATH}contact.html">Contact</a></li>
            </ul>
          </li>
          <li><a href="#" class="login-trigger" data-message="Log in to learn more about Big Mart." data-href="${CATEGORY_PATH}about.html">About</a></li>
          <li><a href="#" class="login-trigger" data-message="Log in to contact Big Mart." data-href="${CATEGORY_PATH}contact.html">Contact</a></li>
        </ul>
      </nav>

      <div class="nav-actions">
        <button class="icon-btn search-toggle" id="searchToggle" aria-label="Search">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>

        <a href="#" class="icon-btn login-trigger" data-message="Log in to manage your account." data-href="${CATEGORY_PATH}account.html" aria-label="Account">
          <i class="fa-regular fa-user"></i>
        </a>

        <a href="#" class="icon-btn cart-btn" aria-label="Cart">
          <i class="fa-solid fa-bag-shopping"></i>
          <span class="cart-badge">0</span>
        </a>

        <a href="#" class="cta-btn login-trigger" data-message="Log in to start shopping at Big Mart." data-href="${CATEGORY_PATH}shop.html">Shop Now</a>
      </div>

      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <div class="search-bar" id="searchBar">
      <input type="text" placeholder="Search for products..." />
      <button class="search-close" id="searchClose" aria-label="Close search">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="search-results" id="searchResults"></div>
    </div>
  </header>
  `;

  /* ------------------------------------------------------------
     MOBILE SLIDE-IN MENU
     ------------------------------------------------------------ */
  const mobileMenuHTML = `
  <div class="mobile-overlay" id="mobileOverlay"></div>

  <aside class="mobile-menu" id="mobileMenu">
    <div class="mobile-menu-header">
      <a href="${HOME}" class="logo">
        <i class="fa-solid fa-cart-shopping logo-icon"></i>
        <span class="logo-text">Big<span class="logo-accent">Mart</span></span>
      </a>
      <button class="mobile-close" id="mobileClose" aria-label="Close menu">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div class="mobile-search">
      <input type="text" placeholder="Search..." />
      <i class="fa-solid fa-magnifying-glass"></i>
    </div>

    <ul class="mobile-links">
      <li><a href="${HOME}" class="active">Home</a></li>
      <li><a href="#" class="login-trigger" data-message="Log in to start shopping at Big Mart." data-href="${CATEGORY_PATH}shop.html">Shop</a></li>
      <li class="mobile-dropdown">
        <a href="#" class="mobile-dropdown-toggle">Categories <i class="fa-solid fa-chevron-down"></i></a>
        <ul class="mobile-dropdown-menu">
          <li><a href="#" class="login-trigger" data-message="Log in to browse Fruits." data-href="${CATEGORY_PATH}fruits.html">Fruits</a></li>
          <li><a href="#" class="login-trigger" data-message="Log in to browse Vegetables." data-href="${CATEGORY_PATH}vegetables.html">Vegetables</a></li>
          <li><a href="#" class="login-trigger" data-message="Log in to browse Dairy." data-href="${CATEGORY_PATH}dairy.html">Dairy &amp; Eggs</a></li>
          <li><a href="#" class="login-trigger" data-message="Log in to browse Bakery." data-href="${CATEGORY_PATH}bakery.html">Bakery</a></li>
          <li><a href="#" class="login-trigger" data-message="Log in to browse Beverages." data-href="${CATEGORY_PATH}beverages.html">Beverages</a></li>
          <li><a href="#" class="login-trigger" data-message="Log in to browse Snacks." data-href="${CATEGORY_PATH}snacks.html">Snacks</a></li>
        </ul>
      </li>
      <li><a href="#" class="login-trigger" data-message="Log in to learn more about Big Mart.">About</a></li>
      <li><a href="#" class="login-trigger" data-message="Log in to contact Big Mart.">Contact</a></li>
    </ul>

    <div class="mobile-actions">
      <a href="#" class="icon-btn login-trigger" data-message="Log in to manage your account." data-href="${CATEGORY_PATH}account.html">
        <i class="fa-regular fa-user"></i> Account
      </a>
      <a href="#" class="icon-btn cart-btn">
        <i class="fa-solid fa-bag-shopping"></i> Cart <span class="cart-badge">0</span>
      </a>
    </div>

    <a href="#" class="cta-btn mobile-cta login-trigger" data-message="Log in to start shopping at Big Mart." data-href="${CATEGORY_PATH}shop.html">Shop Now</a>
  </aside>
  `;

  /* ------------------------------------------------------------
     FOOTER
     ------------------------------------------------------------ */
  const footerHTML = `
  <footer class="footer" id="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col footer-brand" data-reveal="up">
          <a href="${HOME}" class="footer-logo">
            <i class="fa-solid fa-cart-shopping footer-logo-icon"></i>
            <span class="footer-logo-text">Big<span class="footer-logo-accent">Mart</span></span>
          </a>
          <p class="footer-tagline">Fresh groceries, delivered to your door.</p>
          <div class="footer-socials">
            <a href="#" class="social-icon" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="social-icon" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" class="social-icon" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="#" class="social-icon" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
          </div>
        </div>

        <div class="footer-col" data-reveal="up">
          <h4 class="footer-heading">Quick Links</h4>
          <ul class="footer-links">
            <li><a href="#" class="login-trigger" data-message="Log in to browse Fruits." data-href="${CATEGORY_PATH}fruits.html">Fruits</a></li>
            <li><a href="#" class="login-trigger" data-message="Log in to browse Vegetables." data-href="${CATEGORY_PATH}vegetables.html">Vegetables</a></li>
            <li><a href="#" class="login-trigger" data-message="Log in to browse Dairy." data-href="${CATEGORY_PATH}dairy.html">Dairy &amp; Eggs</a></li>
            <li><a href="#" class="login-trigger" data-message="Log in to browse Bakery." data-href="${CATEGORY_PATH}bakery.html">Bakery</a></li>
            <li><a href="#" class="login-trigger" data-message="Log in to browse Beverages." data-href="${CATEGORY_PATH}beverages.html">Beverages</a></li>
            <li><a href="#" class="login-trigger" data-message="Log in to browse Snacks." data-href="${CATEGORY_PATH}snacks.html">Snacks</a></li>
            <li><a href="#" class="login-trigger" data-message="Log in to learn about us." data-href="${CATEGORY_PATH}about.html">About Us</a></li>
            <li><a href="#" class="login-trigger" data-message="Log in to contact us." data-href="${CATEGORY_PATH}contact.html">Contact</a></li>
            <li><a href="#" class="login-trigger" data-message="Log in to view FAQs." data-href="${CATEGORY_PATH}faq.html">FAQ</a></li>
          </ul>
        </div>

        <div class="footer-col" data-reveal="up">
          <h4 class="footer-heading">Categories</h4>
          <ul class="footer-links">
            <li><a href="#" class="login-trigger" data-message="Log in to browse Fruits." data-href="${CATEGORY_PATH}fruits.html">Fruits</a></li>
            <li><a href="#" class="login-trigger" data-message="Log in to browse Vegetables." data-href="${CATEGORY_PATH}vegetables.html">Vegetables</a></li>
            <li><a href="#" class="login-trigger" data-message="Log in to browse Dairy." data-href="${CATEGORY_PATH}dairy.html">Dairy &amp; Eggs</a></li>
            <li><a href="#" class="login-trigger" data-message="Log in to browse Bakery." data-href="${CATEGORY_PATH}bakery.html">Bakery</a></li>
            <li><a href="#" class="login-trigger" data-message="Log in to browse Beverages." data-href="${CATEGORY_PATH}beverages.html">Beverages</a></li>
            <li><a href="#" class="login-trigger" data-message="Log in to browse Snacks." data-href="${CATEGORY_PATH}snacks.html">Snacks</a></li>
          </ul>
        </div>

        <div class="footer-col" data-reveal="up">
          <h4 class="footer-heading">Get in Touch</h4>
          <ul class="footer-contact">
            <li>
              <span class="contact-icon"><i class="fa-solid fa-location-dot"></i></span>
              <span>123 Market Street, Lagos, Nigeria</span>
            </li>
            <li>
              <span class="contact-icon"><i class="fa-solid fa-phone"></i></span>
              <span>+234 800 000 0000</span>
            </li>
            <li>
              <span class="contact-icon"><i class="fa-solid fa-envelope"></i></span>
              <span>hello@bigmart.com</span>
            </li>
            <li>
              <span class="contact-icon"><i class="fa-solid fa-clock"></i></span>
              <span>Mon–Sun · 7am – 10pm</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-left">
          <p>© <span id="footerYear">2026</span> Big Mart. All rights reserved.</p>
        </div>

        <div class="footer-bottom-middle">
          <i class="fa-brands fa-cc-visa" aria-label="Visa"></i>
          <i class="fa-brands fa-cc-mastercard" aria-label="Mastercard"></i>
          <i class="fa-brands fa-cc-paypal" aria-label="PayPal"></i>
        </div>

        <div class="footer-bottom-right">
          <a href="#">Privacy Policy</a>
          <span class="dot">·</span>
          <a href="#">Terms of Service</a>
          <span class="dot">·</span>
          <a href="#">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
  `;

  /* ------------------------------------------------------------
     LOGIN / SIGNUP MODAL
     ------------------------------------------------------------ */
  const modalHTML = `
  <div class="login-modal-overlay" id="loginModal" aria-hidden="true">
    <div class="login-modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <button class="modal-close" aria-label="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <div class="modal-icon">
        <i class="fa-solid fa-lock"></i>
      </div>

      <h3 class="modal-title" id="modalTitle">Welcome to Big Mart</h3>
      <p class="modal-subtitle" id="modalSubtitle">Create an account to start shopping.</p>

      <div class="modal-tabs" role="tablist">
        <button class="modal-tab active" data-tab="signup" role="tab">Sign Up</button>
        <button class="modal-tab" data-tab="login" role="tab">Log In</button>
      </div>

      <div class="modal-view active" data-view="signup">
        <div class="social-auth">
          <button type="button" class="social-auth-btn" data-provider="google">
            <i class="fa-brands fa-google"></i> Sign up with Google
          </button>
          <button type="button" class="social-auth-btn" data-provider="microsoft">
            <i class="fa-brands fa-microsoft"></i> Sign up with Microsoft
          </button>
          <button type="button" class="social-auth-btn" data-provider="apple">
            <i class="fa-brands fa-apple"></i> Sign up with Apple
          </button>
        </div>

        <div class="modal-divider"><span>or</span></div>

        <form class="modal-form modal-form-signup" novalidate>
          <input type="text" placeholder="Full Name" autocomplete="name" required />
          <input type="email" placeholder="Email address" autocomplete="email" required />
          <input type="password" placeholder="Password (min. 6 characters)" autocomplete="new-password" required />
          <input type="password" placeholder="Confirm Password" autocomplete="new-password" required />
          <button type="submit" class="cta-btn modal-submit">Create Account</button>
        </form>
      </div>

      <div class="modal-view" data-view="login">
        <div class="social-auth">
          <button type="button" class="social-auth-btn" data-provider="google">
            <i class="fa-brands fa-google"></i> Continue with Google
          </button>
          <button type="button" class="social-auth-btn" data-provider="microsoft">
            <i class="fa-brands fa-microsoft"></i> Continue with Microsoft
          </button>
          <button type="button" class="social-auth-btn" data-provider="apple">
            <i class="fa-brands fa-apple"></i> Continue with Apple
          </button>
        </div>

        <div class="modal-divider"><span>or</span></div>

        <form class="modal-form modal-form-login" novalidate>
          <input type="email" placeholder="Email address" autocomplete="email" required />
          <input type="password" placeholder="Password" autocomplete="current-password" required />

          <div class="modal-form-row">
            <label class="remember-me">
              <input type="checkbox" id="rememberMe" />
              <span>Remember me</span>
            </label>
            <button type="button" class="forgot-link" id="forgotPasswordLink">Forgot password?</button>
          </div>

          <button type="submit" class="cta-btn modal-submit">Log In</button>
        </form>
      </div>

      <div class="modal-view" data-view="forgot">
        <button type="button" class="back-link" id="backToLogin">
          <i class="fa-solid fa-arrow-left"></i> Back to Log In
        </button>

        <form class="modal-form modal-form-forgot" novalidate>
          <input type="email" placeholder="Email address" autocomplete="email" required />
          <button type="submit" class="cta-btn modal-submit">Send Reset Link</button>
        </form>
      </div>

      <div class="social-auth-prompt" id="socialAuthPrompt">
        <p>Enter your <strong id="promptProvider">Google</strong> email to continue</p>
        <input type="email" id="socialEmailInput" placeholder="you@example.com" />
        <div class="prompt-actions">
          <button type="button" id="promptCancel">Cancel</button>
          <button type="button" id="promptContinue">Continue</button>
        </div>
      </div>

      <button class="modal-guest" id="modalGuest">Continue as Guest</button>
    </div>
  </div>
  `;

  /* ------------------------------------------------------------
     CART DRAWER + TOASTS + SCROLL-TO-TOP
     ------------------------------------------------------------ */
    const overlaysHTML = `
  <div class="cart-overlay" id="cartOverlay"></div>

  <aside class="cart-drawer" id="cartDrawer">
    <div class="cart-header">
      <h3>Your Cart <span class="cart-header-count" id="cartHeaderCount">0</span></h3>
      <button class="cart-close" id="cartClose" aria-label="Close cart">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div class="cart-body" id="cartBody"></div>

    <div class="cart-footer" id="cartFooter">
      <div class="cart-subtotal">
        <span>Subtotal</span>
        <strong id="cartSubtotal">$0.00</strong>
      </div>
      <button class="cart-checkout" id="cartCheckout">Proceed to Checkout</button>
      <button class="cart-continue" id="cartContinue">Continue Shopping</button>
    </div>
  </aside>

  <div class="toast-container" id="toastContainer"></div>

  <button class="scroll-top" id="scrollTop" aria-label="Scroll to top">
    <i class="fa-solid fa-arrow-up"></i>
  </button>

  <!-- ================= CHECKOUT MODAL ================= -->
  <div class="checkout-modal-overlay" id="checkoutModal" aria-hidden="true">
    <div class="checkout-modal" role="dialog" aria-modal="true">
      <button class="checkout-close" id="checkoutClose" aria-label="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- ===== FORM VIEW ===== -->
      <div class="checkout-view active" data-view="form">
        <div class="checkout-header">
          <h2>Checkout</h2>
          <p>Complete your order in one quick step.</p>
        </div>

        <div class="checkout-layout">

          <!-- LEFT: FORM -->
          <div class="checkout-form-col">

            <!-- Delivery details -->
            <section class="checkout-section">
              <h3><i class="fa-solid fa-location-dot"></i> Delivery Details</h3>
              <div class="form-grid">
                <input type="text" id="coName" placeholder="Full Name" required />
                <input type="email" id="coEmail" placeholder="Email Address" required />
                <input type="tel" id="coPhone" placeholder="Phone Number" required />
                <input type="text" id="coCity" placeholder="City" required />
                <input type="text" id="coAddress" placeholder="Street Address" class="full" required />
                <input type="text" id="coNotes" placeholder="Delivery notes (optional)" class="full" />
              </div>
            </section>

            <!-- Delivery method -->
            <section class="checkout-section">
              <h3><i class="fa-solid fa-truck-fast"></i> Delivery Method</h3>
              <div class="option-list">
                <label class="option-card">
                  <input type="radio" name="coDelivery" value="standard" data-fee="0" checked />
                  <div class="option-body">
                    <div class="option-title">
                      <strong>Standard Delivery</strong>
                      <span class="option-price">Free</span>
                    </div>
                    <p class="option-desc">Arrives in about 60 minutes — free on every order.</p>
                  </div>
                </label>
                <label class="option-card">
                  <input type="radio" name="coDelivery" value="express" data-fee="4.99" />
                  <div class="option-body">
                    <div class="option-title">
                      <strong>Express Delivery</strong>
                      <span class="option-price">$4.99</span>
                    </div>
                    <p class="option-desc">Priority handling — arrives in about 30 minutes.</p>
                  </div>
                </label>
              </div>
            </section>

            <!-- Payment method -->
            <section class="checkout-section">
              <h3><i class="fa-solid fa-credit-card"></i> Payment Method</h3>
              <div class="option-list">
                <label class="option-card">
                  <input type="radio" name="coPayment" value="card" checked />
                  <div class="option-body">
                    <div class="option-title"><strong>Credit / Debit Card</strong></div>
                    <p class="option-desc">Visa, Mastercard, PayPal-branded cards.</p>
                  </div>
                </label>
                <label class="option-card">
                  <input type="radio" name="coPayment" value="cod" />
                  <div class="option-body">
                    <div class="option-title"><strong>Cash on Delivery</strong></div>
                    <p class="option-desc">Pay the delivery rider in cash when your order arrives.</p>
                  </div>
                </label>
                <label class="option-card">
                  <input type="radio" name="coPayment" value="paypal" />
                  <div class="option-body">
                    <div class="option-title"><strong>PayPal</strong></div>
                    <p class="option-desc">You'll be redirected to PayPal after placing the order.</p>
                  </div>
                </label>
              </div>

              <!-- Card fields (shown when Card is selected) -->
              <div class="card-fields" id="cardFields">
                <input type="text" id="coCardName" placeholder="Name on Card" />
                <input type="text" id="coCardNumber" placeholder="Card Number" maxlength="19" inputmode="numeric" />
                <div class="card-fields-row">
                  <input type="text" id="coCardExpiry" placeholder="MM / YY" maxlength="7" inputmode="numeric" />
                  <input type="text" id="coCardCvv" placeholder="CVV" maxlength="4" inputmode="numeric" />
                </div>
              </div>
            </section>

          </div>

          <!-- RIGHT: SUMMARY -->
          <aside class="checkout-summary-col">
            <h3>Order Summary</h3>
            <div class="summary-items" id="coSummaryItems"></div>

            <div class="summary-totals">
              <div class="summary-row">
                <span>Subtotal</span>
                <strong id="coSubtotal">$0.00</strong>
              </div>
              <div class="summary-row">
                <span>Delivery</span>
                <strong id="coDelivery">Free</strong>
              </div>
              <div class="summary-row">
                <span>Tax (5%)</span>
                <strong id="coTax">$0.00</strong>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <strong id="coTotal">$0.00</strong>
              </div>
            </div>

            <button class="place-order-btn" id="coPlaceOrder">
              <i class="fa-solid fa-lock"></i> Place Order
            </button>
            <p class="checkout-secure"><i class="fa-solid fa-shield-halved"></i> Secure checkout</p>
          </aside>

        </div>
      </div>

      <!-- ===== SUCCESS VIEW ===== -->
      <div class="checkout-view" data-view="success">
        <div class="success-wrap">
          <div class="success-icon">
            <i class="fa-solid fa-check"></i>
          </div>
          <h2 class="success-title">Order Confirmed!</h2>
          <p class="success-subtitle">Thank you for shopping with Big Mart.</p>

          <div class="success-details">
            <div class="success-row">
              <span>Order Number</span>
              <strong id="successOrderNum">BM-000000</strong>
            </div>
            <div class="success-row">
              <span>Estimated Delivery</span>
              <strong id="successEta">30–60 minutes</strong>
            </div>
            <div class="success-row">
              <span>Total Paid</span>
              <strong id="successTotal">$0.00</strong>
            </div>
            <div class="success-row">
              <span>Payment Method</span>
              <strong id="successPayment">Card</strong>
            </div>
          </div>

          <button class="continue-shopping-btn" id="coContinueShopping">
            Continue Shopping
          </button>
        </div>
      </div>

    </div>
  </div>
  `;

  /* ------------------------------------------------------------
     INJECT INTO THE DOM
     ------------------------------------------------------------ */
  function inject(selector, html) {
    const el = document.querySelector(selector);
    if (el) {
      el.outerHTML = html;
      return true;
    }
    return false;
  }

  if (!inject('#layout-header', navbarHTML + mobileMenuHTML)) {
    document.body.insertAdjacentHTML('afterbegin', navbarHTML + mobileMenuHTML);
  }

  if (!inject('#layout-footer', footerHTML)) {
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  }

  if (!inject('#layout-modals', modalHTML + overlaysHTML)) {
    document.body.insertAdjacentHTML('beforeend', modalHTML + overlaysHTML);
  }

  /* ------------------------------------------------------------
     NAVBAR VARIANT — solid on sub-pages
     ------------------------------------------------------------ */
  if (isSubPage) {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.add('scrolled');
  }
})();