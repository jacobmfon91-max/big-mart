// ========== PAGE CONTEXT ==========
const isSubPage = /\/pages\//.test(window.location.pathname);
const GUEST_REDIRECT = isSubPage ? 'shop.html' : 'pages/shop.html';

// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (!navbar) return;
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ========== SEARCH TOGGLE (Desktop) ==========
const searchToggle = document.getElementById('searchToggle');
const searchBar = document.getElementById('searchBar');
const searchClose = document.getElementById('searchClose');

if (searchToggle && searchBar) {
  searchToggle.addEventListener('click', () => {
    searchBar.classList.toggle('active');
  });
}

if (searchClose && searchBar) {
  searchClose.addEventListener('click', () => {
    searchBar.classList.remove('active');
  });
}

// ========== MOBILE MENU ==========
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose = document.getElementById('mobileClose');

function openMobileMenu() {
  hamburger.classList.add('active');
  mobileMenu.classList.add('active');
  mobileOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('active');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', openMobileMenu);
if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

document.querySelectorAll('.mobile-links a:not(.mobile-dropdown-toggle)').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// ========== MOBILE DROPDOWN ==========
const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
const mobileDropdownMenu = document.querySelector('.mobile-dropdown-menu');

if (mobileDropdownToggle && mobileDropdownMenu) {
  mobileDropdownToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    mobileDropdownMenu.classList.toggle('open');
    const icon = mobileDropdownToggle.querySelector('i');
    if (icon) {
      icon.style.transform = mobileDropdownMenu.classList.contains('open')
        ? 'rotate(180deg)'
        : 'rotate(0deg)';
    }
  });
}

// ========== SCROLL REVEAL ==========
document.addEventListener('DOMContentLoaded', () => {
  const revealTargets = document.querySelectorAll(
    '.section-header, .category-card, .product-card, .view-all-link, .feature-item, .video-card, .stat-card, .stats-band, .testimonial-carousel, .newsletter-band, .footer-col, .footer-bottom'
  );

  if (!revealTargets.length) return;

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
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
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('revealed'));
  }
});

// ========== TOAST SYSTEM ==========
const toastContainer = document.getElementById('toastContainer');

function showToast(message, type = 'info') {
  if (!toastContainer) return;

  const icons = {
    info: 'fa-circle-info',
    success: 'fa-circle-check',
    warning: 'fa-triangle-exclamation',
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${message}</span>`;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2600);
}

// ========== USER STORAGE ==========
const USERS_KEY = 'bigmart_users';
const SESSION_KEY = 'bigmart_session';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}
function saveUsers(list) { localStorage.setItem(USERS_KEY, JSON.stringify(list)); }
function findUserByEmail(email) {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}
function addUser(user) { const list = getUsers(); list.push(user); saveUsers(list); }

// ========== SESSION ==========
function getCurrentUser() {
  try {
    const fromLocal = localStorage.getItem(SESSION_KEY);
    const fromSession = sessionStorage.getItem(SESSION_KEY);
    return JSON.parse(fromLocal || fromSession || 'null');
  } catch { return null; }
}
function setCurrentUser(user, remember) {
  const data = JSON.stringify(user);
  if (remember) {
    localStorage.setItem(SESSION_KEY, data);
    sessionStorage.removeItem(SESSION_KEY);
  } else {
    sessionStorage.setItem(SESSION_KEY, data);
    localStorage.removeItem(SESSION_KEY);
  }
}
function clearCurrentUser() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}
function isLoggedIn() { return !!getCurrentUser(); }

// ========== MODAL ELEMENT REFS ==========
const loginModal = document.getElementById('loginModal');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalTabsRow = document.querySelector('.modal-tabs');
const modalTabs = document.querySelectorAll('.modal-tab');
const modalViews = document.querySelectorAll('.modal-view');
const modalCloseBtn = document.querySelector('.modal-close');
const modalGuestBtn = document.getElementById('modalGuest');

const signupForm = document.querySelector('.modal-form-signup');
const loginForm = document.querySelector('.modal-form-login');
const forgotForm = document.querySelector('.modal-form-forgot');
const forgotLink = document.getElementById('forgotPasswordLink');
const backToLogin = document.getElementById('backToLogin');
const rememberMe = document.getElementById('rememberMe');

const socialAuthPrompt = document.getElementById('socialAuthPrompt');
const socialPromptProvider = document.getElementById('promptProvider');
const socialEmailInput = document.getElementById('socialEmailInput');
const socialPromptCancel = document.getElementById('promptCancel');
const socialPromptContinue = document.getElementById('promptContinue');

let pendingAction = null;
let socialProvider = null;
let socialMode = 'signup';

// ========== VIEW SWITCHING ==========
function switchView(view) {
  modalViews.forEach((v) => v.classList.toggle('active', v.dataset.view === view));
  modalTabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === view));

  if (modalTabsRow) modalTabsRow.style.display = view === 'forgot' ? 'none' : 'flex';

  if (modalTitle) {
    modalTitle.textContent =
      view === 'signup' ? 'Create Your Account' :
      view === 'login'  ? 'Welcome Back' :
      'Reset Your Password';
  }

  if (modalSubtitle && !modalSubtitle.dataset.custom) {
    modalSubtitle.innerHTML =
      view === 'signup' ? 'Sign up to start shopping with Big Mart.' :
      view === 'login'  ? 'Log in to continue shopping.' :
      "Enter your email and we'll send you a reset link.";
  }

  socialAuthPrompt?.classList.remove('active');
}

modalTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    modalSubtitle?.removeAttribute('data-custom');
    switchView(tab.dataset.tab);
  });
});

// ========== OPEN / CLOSE ==========
function openLoginModal(message, preferredView = 'signup') {
  if (!loginModal) return;
  if (getUsers().length > 0 && preferredView === 'signup') preferredView = 'login';
  switchView(preferredView);

  if (message) {
    modalSubtitle.innerHTML = message;
    modalSubtitle.dataset.custom = 'true';
  }

  loginModal.classList.add('active');
  loginModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
  if (!loginModal) return;
  loginModal.classList.remove('active');
  loginModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  pendingAction = null;

  signupForm?.reset();
  loginForm?.reset();
  forgotForm?.reset();
  socialAuthPrompt?.classList.remove('active');
  modalSubtitle?.removeAttribute('data-custom');
}

modalCloseBtn?.addEventListener('click', closeLoginModal);
modalGuestBtn?.addEventListener('click', closeLoginModal);
loginModal?.addEventListener('click', (e) => { if (e.target === loginModal) closeLoginModal(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && loginModal?.classList.contains('active')) closeLoginModal();
});

// ========== COMPLETE PENDING ACTION ==========
function completePendingAction() {
  if (!pendingAction) return;

  if (pendingAction.type === 'navigate' && pendingAction.href) {
    const target = pendingAction.href;
    pendingAction = null;
    setTimeout(() => { window.location.href = target; }, 600);
    return;
  }

  if (pendingAction.type === 'wishlist' && pendingAction.element) {
    const btn = pendingAction.element;
    btn.classList.add('active', 'popping');
    setTimeout(() => btn.classList.remove('popping'), 400);
    showToast(`Added "${pendingAction.product}" to wishlist`, 'success');
  }

  if (pendingAction.type === 'cart') {
    showToast(`Added "${pendingAction.product}" to cart`, 'success');
  }

  pendingAction = null;
}

function finishLogin(user, message) {
  const remember = rememberMe?.checked ?? true;
  setCurrentUser({ name: user.name, email: user.email, provider: user.provider }, remember);
  socialAuthPrompt?.classList.remove('active');

  const action = pendingAction;
  closeLoginModal();
  if (action) { pendingAction = action; completePendingAction(); }
  if (message) showToast(message, 'success');
}

// ========== SIGN UP (MANUAL) ==========
signupForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputs = signupForm.querySelectorAll('input');
  const name = inputs[0].value.trim();
  const email = inputs[1].value.trim();
  const password = inputs[2].value;
  const confirm = inputs[3].value;

  if (!name || !email || !password || !confirm) { showToast('Please fill in all fields.', 'warning'); return; }
  if (!email.includes('@') || !email.includes('.')) { showToast('Please enter a valid email address.', 'warning'); return; }
  if (password.length < 6) { showToast('Password must be at least 6 characters.', 'warning'); return; }
  if (password !== confirm) { showToast('Passwords do not match.', 'warning'); return; }

  if (findUserByEmail(email)) {
    showToast('An account with that email already exists. Please log in.', 'warning');
    modalSubtitle?.removeAttribute('data-custom');
    switchView('login');
    const loginEmail = loginForm.querySelector('input[type="email"]');
    if (loginEmail) loginEmail.value = email;
    return;
  }

  addUser({ name, email, password, provider: 'manual' });
  showToast('Account created! Please log in to continue.', 'success');
  modalSubtitle?.removeAttribute('data-custom');
  switchView('login');

  const loginEmail = loginForm.querySelector('input[type="email"]');
  const loginPass = loginForm.querySelector('input[type="password"]');
  if (loginEmail) loginEmail.value = email;
  if (loginPass) loginPass.value = '';
  loginEmail?.focus();
});

// ========== LOG IN (MANUAL) ==========
loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputs = loginForm.querySelectorAll('input');
  const email = inputs[0].value.trim();
  const password = inputs[1].value;

  if (!email || !password) { showToast('Please enter your email and password.', 'warning'); return; }

  const user = findUserByEmail(email);

  if (!user) {
    showToast('No account found. Please sign up first.', 'warning');
    modalSubtitle?.removeAttribute('data-custom');
    switchView('signup');
    const signupEmail = signupForm.querySelector('input[type="email"]');
    if (signupEmail) signupEmail.value = email;
    return;
  }

  if (user.password && user.password !== password) {
    showToast('Incorrect password. Please try again.', 'warning');
    return;
  }

  finishLogin(user, `Welcome back, ${user.name.split(' ')[0]}!`);
});

// ========== FORGOT PASSWORD ==========
forgotLink?.addEventListener('click', () => {
  const loginEmail = loginForm.querySelector('input[type="email"]');
  const forgotEmail = forgotForm.querySelector('input[type="email"]');
  if (loginEmail?.value && forgotEmail) forgotEmail.value = loginEmail.value;
  modalSubtitle?.removeAttribute('data-custom');
  switchView('forgot');
});

backToLogin?.addEventListener('click', () => {
  modalSubtitle?.removeAttribute('data-custom');
  switchView('login');
});

forgotForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = forgotForm.querySelector('input[type="email"]').value.trim();
  if (!email || !email.includes('@')) { showToast('Please enter a valid email address.', 'warning'); return; }
  showToast('If an account exists for that email, a reset link has been sent.', 'success');
  forgotForm.reset();
  modalSubtitle?.removeAttribute('data-custom');
  switchView('login');
});

// ========== SOCIAL AUTH ==========
document.querySelectorAll('.social-auth-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    socialProvider = btn.dataset.provider;
    socialMode = btn.closest('.modal-view').dataset.view;

    const providerNames = { google: 'Google', microsoft: 'Microsoft', apple: 'Apple' };
    if (socialPromptProvider) socialPromptProvider.textContent = providerNames[socialProvider] || socialProvider;

    if (socialEmailInput) socialEmailInput.value = '';
    socialAuthPrompt?.classList.add('active');
    socialEmailInput?.focus();
  });
});

socialPromptCancel?.addEventListener('click', () => {
  socialAuthPrompt?.classList.remove('active');
});

socialPromptContinue?.addEventListener('click', () => {
  const email = (socialEmailInput?.value || '').trim();
  if (!email || !email.includes('@') || !email.includes('.')) {
    showToast('Please enter a valid email address.', 'warning');
    return;
  }

  const providerNames = { google: 'Google', microsoft: 'Microsoft', apple: 'Apple' };
  const providerName = providerNames[socialProvider] || socialProvider;
  const existing = findUserByEmail(email);

  if (socialMode === 'login') {
    if (existing) {
      finishLogin(existing, `Welcome back, ${existing.name.split(' ')[0]}!`);
    } else {
      showToast(`No ${providerName} account found. Please sign up first.`, 'warning');
      socialAuthPrompt?.classList.remove('active');
      modalSubtitle?.removeAttribute('data-custom');
      switchView('signup');
      const signupEmail = signupForm.querySelector('input[type="email"]');
      if (signupEmail) signupEmail.value = email;
    }
    return;
  }

  if (existing) {
    finishLogin(existing, `Welcome back, ${existing.name.split(' ')[0]}!`);
    return;
  }

  const name = email.split('@')[0]
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const newUser = { name, email, password: null, provider: socialProvider };
  addUser(newUser);
  finishLogin(newUser, `Welcome! Your ${providerName} account is ready.`);
});

// ========== WISHLIST BUTTONS ==========
document.querySelectorAll('.wishlist-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const product = btn.dataset.product || 'this item';

    if (!isLoggedIn()) {
      pendingAction = { type: 'wishlist', element: btn, product };
      openLoginModal(`Log in to save <strong>${product}</strong> to your wishlist.`);
      return;
    }

    const isActive = btn.classList.contains('active');
    const icon = btn.querySelector('i');

    if (isActive) {
      btn.classList.remove('active');
      icon.classList.remove('fa-solid');
      icon.classList.add('fa-regular');
      showToast(`Removed "${product}" from wishlist`, 'info');
    } else {
      btn.classList.add('active');
      icon.classList.remove('fa-regular');
      icon.classList.add('fa-solid');
      showToast(`Added "${product}" to wishlist`, 'success');
    }

    btn.classList.add('popping');
    setTimeout(() => btn.classList.remove('popping'), 450);
  });
});

// ========== ADD TO CART BUTTONS ==========
document.querySelectorAll('.add-cart-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const product = btn.dataset.product || 'this item';

    if (!isLoggedIn()) {
      pendingAction = { type: 'cart', product };
      openLoginModal(`Log in to add <strong>${product}</strong> to your cart.`);
      return;
    }

    showToast(`Added "${product}" to cart`, 'success');
  });
});

// ========== GENERIC LOGIN-TRIGGER ELEMENTS (Interpretation B) ==========
document.querySelectorAll('.login-trigger').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();

    const href = el.dataset.href;

    // Guests: always land on shop.html after login
    if (!isLoggedIn()) {
      const message = el.dataset.message || 'Log in to continue shopping at Big Mart.';
      pendingAction = { type: 'navigate', href: GUEST_REDIRECT };
      openLoginModal(message);
      return;
    }

    // Logged in: go to the actual link
    if (href && href !== '#') {
      window.location.href = href;
    } else {
      showToast('Coming soon!', 'info');
    }
  });
});

// ========== TESTIMONIAL CAROUSEL ==========
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('testimonialCarousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.testimonial-slide');
  const dots = carousel.querySelectorAll('.testi-dot');
  const prevBtn = carousel.querySelector('.testi-arrow.prev');
  const nextBtn = carousel.querySelector('.testi-arrow.next');

  if (!slides.length) return;

  let current = 0;
  let autoplay = null;
  const AUTOPLAY_TIME = 8000;

  function goTo(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');

    current = index;

    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplay = setInterval(next, AUTOPLAY_TIME);
  }

  function stopAutoplay() {
    if (autoplay) {
      clearInterval(autoplay);
      autoplay = null;
    }
  }

  nextBtn?.addEventListener('click', () => { next(); startAutoplay(); });
  prevBtn?.addEventListener('click', () => { prev(); startAutoplay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAutoplay();
    });
  });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
      startAutoplay();
    }
  });

  startAutoplay();
});

// ========== NEWSLETTER FORM ==========
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('newsletterEmail');
  const submitBtn = document.getElementById('newsletterBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = (emailInput.value || '').trim();

    if (!email || !email.includes('@') || !email.includes('.')) {
      showToast('Please enter a valid email address.', 'warning');
      emailInput.focus();
      return;
    }

    showToast("You're in! Check your inbox for your 10% code.", 'success');

    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');

    submitBtn.classList.add('success');
    if (btnText) btnText.textContent = 'Subscribed';
    if (btnIcon) {
      btnIcon.classList.remove('fa-arrow-right');
      btnIcon.classList.add('fa-check');
    }

    emailInput.value = '';

    setTimeout(() => {
      submitBtn.classList.remove('success');
      if (btnText) btnText.textContent = 'Subscribe';
      if (btnIcon) {
        btnIcon.classList.remove('fa-check');
        btnIcon.classList.add('fa-arrow-right');
      }
    }, 1600);
  });
});