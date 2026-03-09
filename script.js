/* ══════════════════════════════════
   ADRSP — Advanced Digital Retail Shopping Platform
   script.js
══════════════════════════════════ */

const API = 'https://dummyjson.com';
const USD_TO_INR = 83.5;

function inr(usd) {
  return (usd * USD_TO_INR).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

const CATEGORIES_LIST = [
  { slug:'smartphones',        label:'Smartphones',      eyebrow:'Phones & mobiles',    emoji:'📱', file:'smartphones.html'        },
  { slug:'laptops',            label:'Laptops',          eyebrow:'Computing',            emoji:'💻', file:'laptops.html'            },
  { slug:'tablets',            label:'Tablets',          eyebrow:'Portable screens',     emoji:'📟', file:'tablets.html'            },
  { slug:'womens-clothing',    label:"Women's Clothing", eyebrow:'Fashion for her',      emoji:'👗', file:'womens-clothing.html'    },
  { slug:'mens-clothing',      label:"Men's Clothing",   eyebrow:'Fashion for him',      emoji:'👔', file:'mens-clothing.html'      },
  { slug:'womens-shoes',       label:"Women's Shoes",    eyebrow:'Footwear',             emoji:'👠', file:'womens-shoes.html'       },
  { slug:'mens-shoes',         label:"Men's Shoes",      eyebrow:'Footwear',             emoji:'👟', file:'mens-shoes.html'         },
  { slug:'beauty',             label:'Beauty',           eyebrow:'Skincare & cosmetics', emoji:'✨', file:'beauty.html'             },
  { slug:'fragrances',         label:'Fragrances',       eyebrow:'Perfumes & scents',    emoji:'🌸', file:'fragrances.html'         },
  { slug:'furniture',          label:'Furniture',        eyebrow:'For the home',         emoji:'🛋', file:'furniture.html'          },
  { slug:'home-decoration',    label:'Home Decoration',  eyebrow:'Interiors & décor',    emoji:'🏠', file:'home-decoration.html'    },
  { slug:'groceries',          label:'Groceries',        eyebrow:'Food & essentials',    emoji:'🛒', file:'groceries.html'          },
  { slug:'sports-accessories', label:'Sports',           eyebrow:'Fitness & outdoors',   emoji:'⚽', file:'sports-accessories.html' },
  { slug:'sunglasses',         label:'Sunglasses',       eyebrow:'Eyewear',              emoji:'🕶', file:'sunglasses.html'         },
  { slug:'tops',               label:'Tops',             eyebrow:'Shirts & blouses',     emoji:'👕', file:'tops.html'               },
  { slug:'bags',               label:'Bags',             eyebrow:'Handbags & backpacks', emoji:'👜', file:'bags.html'               },
  { slug:'vehicle',            label:'Vehicle',          eyebrow:'Auto & accessories',   emoji:'🚗', file:'vehicle.html'            },
  { slug:'motorcycle',         label:'Motorcycles',      eyebrow:'Two-wheelers',         emoji:'🏍', file:'motorcycle.html'         },
];

/* ── THEME ── */
function getTheme() { try { return localStorage.getItem('theme') || 'light'; } catch(e) { return 'light'; } }
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('theme', t); } catch(e) {}
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = t === 'dark' ? '☀' : '☾';
}
setTheme(getTheme());
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.textContent = getTheme() === 'dark' ? '☀' : '☾';
    btn.addEventListener('click', () => setTheme(getTheme() === 'dark' ? 'light' : 'dark'));
  }
});

/* ── CART ── */
function getCart() { try { return JSON.parse(localStorage.getItem('cart')) || []; } catch(e) { return []; } }
function saveCart(c) { try { localStorage.setItem('cart', JSON.stringify(c)); } catch(e) {} }
function updateBadge(cart) {
  const b = document.getElementById('cart-count');
  if (!b) return;
  b.textContent = cart.length;
  b.style.display = cart.length ? 'inline-block' : 'none';
}
let cart = getCart();
updateBadge(cart);

/* ── PRODUCT CARD ── */
function buildProductCard(p) {
  const discount = p.discountPercentage ? Math.round(p.discountPercentage) : 0;
  const rating   = p.rating ? p.rating.toFixed(1) : '—';
  const a = document.createElement('a');
  a.className = 'product-card';
  a.href = `product.html?id=${p.id}`;
  a.innerHTML = `
    ${discount > 0 ? `<span class="card-discount">−${discount}%</span>` : ''}
    <div class="card-img-wrap"><img src="${p.thumbnail}" alt="${p.title}" loading="lazy"></div>
    <p class="card-category">${p.brand || p.category}</p>
    <p class="card-title">${p.title}</p>
    <p class="card-rating-row">★ ${rating}</p>
    <div class="card-footer">
      <span class="card-price">₹${inr(p.price)}</span>
      <span class="card-arrow">↗</span>
    </div>`;
  return a;
}

/* ── SORT ── */
function sortProducts(products, mode) {
  const arr = [...products];
  if (mode === 'price-asc')  return arr.sort((a,b) => a.price - b.price);
  if (mode === 'price-desc') return arr.sort((a,b) => b.price - a.price);
  if (mode === 'rating')     return arr.sort((a,b) => (b.rating||0) - (a.rating||0));
  if (mode === 'discount')   return arr.sort((a,b) => (b.discountPercentage||0) - (a.discountPercentage||0));
  return arr;
}

const page = window.location.pathname.split('/').pop() || 'index.html';

/* ══════════════════════════════════
   INDEX PAGE
══════════════════════════════════ */
if (page === 'index.html' || page === '' || page === '/') {
  fetch(`${API}/products?limit=12&select=id,title,price,thumbnail,category,brand,rating,discountPercentage`)
    .then(r => r.json())
    .then(data => {
      document.getElementById('loading-grid').style.display = 'none';
      const grid = document.getElementById('products-grid');
      grid.style.display = 'grid';
      data.products.forEach(p => grid.appendChild(buildProductCard(p)));
    })
    .catch(() => {
      document.getElementById('loading-grid').innerHTML =
        '<p style="color:var(--text-2);padding:40px 0;grid-column:1/-1">Failed to load products.</p>';
    });
}

/* ══════════════════════════════════
   CATEGORY PAGES
══════════════════════════════════ */
window.initCategoryPage = function(slug) {
  fetch(`${API}/products/category/${slug}?limit=100&select=id,title,price,thumbnail,category,brand,rating,discountPercentage`)
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(data => {
      const products = data.products || [];
      document.getElementById('loading-grid').style.display = 'none';
      if (products.length === 0) {
        const e = document.getElementById('cat-error');
        if (e) { e.style.display = 'block'; e.querySelector('p').textContent = 'No products found.'; }
        return;
      }
      const toolbar = document.getElementById('cat-toolbar');
      const countEl = document.getElementById('cat-count');
      const sortEl  = document.getElementById('sort-select');
      if (toolbar) toolbar.style.display = 'flex';
      if (countEl) countEl.textContent = `${products.length} product${products.length !== 1 ? 's' : ''}`;
      const grid = document.getElementById('products-grid');
      grid.style.display = 'grid';
      function render(mode) { grid.innerHTML = ''; sortProducts(products, mode).forEach(p => grid.appendChild(buildProductCard(p))); }
      render('default');
      if (sortEl) sortEl.addEventListener('change', () => render(sortEl.value));
    })
    .catch(() => {
      document.getElementById('loading-grid').style.display = 'none';
      const e = document.getElementById('cat-error');
      if (e) e.style.display = 'block';
    });
};

/* ══════════════════════════════════
   PRODUCT PAGE
══════════════════════════════════ */
if (page === 'product.html') {
  const id = new URLSearchParams(window.location.search).get('id');
  fetch(`${API}/products/${id}`)
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(p => {
      document.title = p.title + ' — ADRSP';
      const discount    = p.discountPercentage ? Math.round(p.discountPercentage) : 0;
      const origPrice   = discount > 0 ? inr(p.price / (1 - discount / 100)) : null;
      const rating      = p.rating ? p.rating.toFixed(1) : '—';
      const reviewCount = p.reviews ? p.reviews.length : Math.floor(Math.random() * 180 + 20);

      document.getElementById('page-content').innerHTML = `
        <div class="product-wrap">
          <div class="product-img-side">
            <div class="product-img-box">
              <img src="${p.thumbnail}" alt="${p.title}" id="main-product-img">
            </div>
            ${p.images && p.images.length > 1 ? `
              <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
                ${p.images.slice(0,4).map(img => `
                  <div onclick="document.getElementById('main-product-img').src='${img}'"
                    style="width:64px;height:64px;background:var(--bg-2);border-radius:10px;padding:8px;
                    display:flex;align-items:center;justify-content:center;cursor:pointer;border:1px solid var(--border)">
                    <img src="${img}" style="width:100%;height:100%;object-fit:contain" loading="lazy">
                  </div>`).join('')}
              </div>` : ''}
          </div>
          <div class="product-info-side">
            <span class="product-category">${p.category}${p.brand ? ' · ' + p.brand : ''}</span>
            <h1 class="product-title">${p.title}</h1>
            <div class="product-rating">★ ${rating} &nbsp;·&nbsp; ${reviewCount} reviews</div>
            <div class="product-price" style="display:flex;align-items:baseline;gap:14px;flex-wrap:wrap">
              ₹${inr(p.price)}
              ${origPrice ? `
                <span style="font-size:0.9rem;font-family:'DM Sans',sans-serif;color:var(--text-2);text-decoration:line-through">₹${origPrice}</span>
                <span style="font-size:0.78rem;font-family:'DM Sans',sans-serif;color:var(--text-2)">−${discount}%</span>` : ''}
            </div>
            <div class="divider"></div>
            <p class="product-desc">${p.description}</p>
            ${p.stock !== undefined ? `
              <p style="font-size:0.78rem;color:var(--text-2);margin-bottom:24px">
                ${p.stock > 10 ? '✓ In stock' : p.stock > 0 ? `⚠ Only ${p.stock} left` : '✕ Out of stock'}
              </p>` : ''}
            <div class="ai-panel" id="ai-price-prediction">
              <p class="ai-panel-label"><span class="ai-dot"></span> AI price insight</p>
              <p class="ai-panel-text">Loading…</p>
            </div>
            <div class="ai-panel" id="ai-price-comparison">
              <p class="ai-panel-label"><span class="ai-dot"></span> Price comparison</p>
              <div class="compare-grid">
                <div class="compare-cell" data-store="our-store">
                  <p class="compare-store-name">Our Store</p>
                  <p class="compare-price-val">₹${inr(p.price)}</p>
                  <span class="compare-best-tag"></span>
                  <span class="compare-fulfil-note">Direct</span>
                </div>
                <div class="compare-cell" data-store="flipkart">
                  <p class="compare-store-name">Flipkart</p>
                  <p class="compare-price-val"><span style="opacity:0.3">—</span></p>
                  <span class="compare-best-tag"></span>
                </div>
                <div class="compare-cell" data-store="amazon">
                  <p class="compare-store-name">Amazon</p>
                  <p class="compare-price-val"><span style="opacity:0.3">—</span></p>
                  <span class="compare-best-tag"></span>
                </div>
              </div>
            </div>
            <div class="deal-finder-banner" id="ai-deal-finder">
              <span class="deal-icon">◈</span>
              <div class="deal-text">
                <p class="deal-title-text">Finding best deal…</p>
                <p class="deal-sub-text"></p>
              </div>
            </div>
            <button class="add-btn" id="add-btn"${p.stock === 0 ? ' disabled style="opacity:0.4;cursor:not-allowed"' : ''}>
              ${p.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>
          </div>
        </div>
        <section class="reviews-section" id="reviews-section">
          <div class="reviews-divider"></div>
          <p class="reviews-eyebrow">Customer reviews</p>
          <h2 class="reviews-heading">What people say</h2>
          <div class="reviews-summary">
            <div class="avg-score-block">
              <span class="avg-score-num">—</span>
              <span class="avg-score-stars">☆☆☆☆☆</span>
              <span class="avg-score-total">0 reviews</span>
            </div>
            <div class="rating-bars">
              ${[5,4,3,2,1].map(n => `
                <div class="rating-bar-row">
                  <span class="rating-bar-label">${n} ★</span>
                  <div class="rating-bar-track"><div class="rating-bar-fill" style="width:0%"></div></div>
                  <span class="rating-bar-count">0</span>
                </div>`).join('')}
            </div>
          </div>
          <div class="reviews-list" id="reviews-list"></div>
          <div class="write-review-block">
            <p class="reviews-eyebrow">Share your experience</p>
            <h2 class="reviews-heading">Write a review</h2>
            <div class="star-picker">
              ${[1,2,3,4,5].map(n => `<span class="star-pick" data-val="${n}">★</span>`).join('')}
            </div>
            <div class="review-form-grid">
              <input class="review-form-input" id="r-name" placeholder="Your name" autocomplete="off">
              <input class="review-form-input" id="r-title" placeholder="Summary (e.g. Great quality)" autocomplete="off">
            </div>
            <textarea class="review-form-input" id="r-body" placeholder="Tell others what you think…"></textarea>
            <div class="review-form-actions">
              <button class="ai-polish-btn">✦ Polish with AI</button>
              <button class="submit-review-btn">Submit review</button>
            </div>
          </div>
        </section>`;

      // Seed reviews
      if (p.reviews && p.reviews.length > 0 && !localStorage.getItem('reviews_' + p.id)) {
        const seeded = p.reviews.map((r, i) => ({
          id: Date.now() - (p.reviews.length - i) * 1000,
          name: r.reviewerName || 'Verified Buyer',
          rating: r.rating || 4,
          title: r.comment ? r.comment.split(' ').slice(0,5).join(' ') + '…' : 'Great product',
          body: r.comment || 'Really happy with this purchase.',
          date: r.date ? new Date(r.date).toLocaleDateString('en-IN', {month:'short', year:'numeric'}) : 'Recent',
          helpful: Math.floor(Math.random() * 20)
        }));
        try { localStorage.setItem('reviews_' + p.id, JSON.stringify(seeded)); } catch(e) {}
      }

      // Add to bag
      if (p.stock !== 0) {
        document.getElementById('add-btn').addEventListener('click', () => {
          cart.push({ id: p.id, title: p.title, price: p.price, image: p.thumbnail });
          saveCart(cart); updateBadge(cart);
          const t = document.getElementById('toast');
          if (t) { t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2200); }
        });
      }

      if (typeof window.initReviews === 'function') window.initReviews(p.id, p.title);
      setTimeout(() => {
        if (typeof window.initAIFeatures === 'function') window.initAIFeatures(p);
      }, 50);
    })
    .catch(() => {
      document.getElementById('page-content').innerHTML =
        '<p style="padding:80px 48px;color:var(--text-2)">Product not found. <a href="index.html" style="color:var(--text)">Go back</a></p>';
    });
}

/* ══════════════════════════════════
   CART PAGE
══════════════════════════════════ */
if (page === 'cart.html') {
  function renderCart() {
    cart = getCart(); updateBadge(cart);
    const pg = document.getElementById('page');
    pg.innerHTML = '';
    if (cart.length === 0) {
      pg.innerHTML = `<div class="empty"><div class="empty-icon">◻</div><h2>Your bag is empty</h2><p>Looks like you haven't added anything yet.</p><a href="index.html" class="btn">Browse the shop</a></div>`;
      return;
    }
    const left = document.createElement('div');
    left.innerHTML = `<div class="cart-header"><h1 class="cart-title">Your Bag</h1><span class="cart-count-label">${cart.length} item${cart.length !== 1 ? 's' : ''}</span></div>`;
    let total = 0;
    cart.forEach((item, i) => {
      total += item.price;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="item-img"><img src="${item.image}" alt="${item.title}"></div>
        <div class="item-info">
          <p class="item-title">${item.title}</p>
          <p class="item-price">₹${inr(item.price)}</p>
        </div>
        <button class="remove-btn" data-i="${i}" title="Remove">✕</button>`;
      left.appendChild(div);
    });
    left.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', e => { cart.splice(parseInt(e.currentTarget.dataset.i), 1); saveCart(cart); renderCart(); });
    });
    const freeShip = total * USD_TO_INR > 4000;
    const finalTotal = freeShip ? total : total + (399 / USD_TO_INR);
    const summary = document.createElement('div');
    summary.className = 'summary';
    summary.innerHTML = `
      <h3>Order Summary</h3>
      <div class="summary-row"><span>Subtotal</span><span>₹${inr(total)}</span></div>
      <div class="summary-row"><span>Shipping</span><span>${freeShip ? 'Free' : '₹399'}</span></div>
      <div class="summary-divider"></div>
      <div class="summary-total"><span>Total</span><span class="total-price">₹${inr(finalTotal)}</span></div>
      <button class="checkout-btn" id="checkout-btn">Proceed to Checkout</button>
      <a href="index.html" class="continue-link">← Continue shopping</a>`;
    pg.appendChild(left);
    pg.appendChild(summary);
    document.getElementById('checkout-btn').addEventListener('click', () => { window.location.href = 'checkout.html'; });
  }
  renderCart();
}

/* ══════════════════════════════════
   CHECKOUT PAGE
══════════════════════════════════ */
if (page === 'checkout.html') {
  cart = getCart(); updateBadge(cart);
  if (cart.length === 0) window.location.href = 'cart.html';
  let currentStep = 1;

  function calcTotals() {
    const sub  = cart.reduce((s,i) => s + i.price, 0);
    const ship = sub * USD_TO_INR > 4000 ? 0 : 399 / USD_TO_INR;
    return { sub, ship, total: sub + ship };
  }

  function buildSummary() {
    const { sub, ship, total } = calcTotals();
    return `<div class="checkout-summary">
      <h3>Order summary</h3>
      ${cart.map(i => `<div class="co-item"><div class="co-img"><img src="${i.image}" alt="${i.title}"></div><div class="co-info"><p class="co-title">${i.title}</p><p class="co-price">₹${inr(i.price)}</p></div></div>`).join('')}
      <div class="co-totals">
        <div class="co-row"><span>Subtotal</span><span>₹${inr(sub)}</span></div>
        <div class="co-row"><span>Shipping</span><span>${ship === 0 ? 'Free' : '₹399'}</span></div>
        <div class="co-divider"></div>
        <div class="co-total"><span>Total</span><span class="co-total-price">₹${inr(total)}</span></div>
      </div>
    </div>`;
  }

  function buildSteps(active) {
    return `<div class="steps">${['Shipping','Payment','Review'].map((s,idx) => {
      const n = idx+1, cls = n===active?'active':n<active?'done':'';
      return `${n>1?'<div class="step-line"></div>':''}<div class="step ${cls}"><div class="step-num">${n<active?'✓':n}</div><span>${s}</span></div>`;
    }).join('')}</div>`;
  }

  function showToast(msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  function renderStep1() {
    document.getElementById('checkout-left').innerHTML = `
      <h1 class="checkout-title">Checkout</h1>${buildSteps(1)}
      <div class="form-section">
        <p class="form-section-title">Contact</p>
        <div class="form-grid full"><div class="form-group"><label>Email</label><input type="email" id="email" placeholder="you@example.com"></div></div>
      </div>
      <div class="form-section">
        <p class="form-section-title">Shipping address</p>
        <div class="form-grid">
          <div class="form-group"><label>First name</label><input type="text" id="fname" placeholder="Aniketh"></div>
          <div class="form-group"><label>Last name</label><input type="text" id="lname" placeholder="Kakanur"></div>
        </div>
        <div class="form-grid full" style="margin-top:16px"><div class="form-group"><label>Address</label><input type="text" id="address" placeholder="123, MG Road"></div></div>
        <div class="form-grid" style="margin-top:16px">
          <div class="form-group"><label>City</label><input type="text" id="city" placeholder="Hyderabad"></div>
          <div class="form-group"><label>PIN code</label><input type="text" id="zip" placeholder="500001"></div>
        </div>
        <div class="form-grid full" style="margin-top:16px"><div class="form-group"><label>State</label>
          <select id="country"><option value="">Select state</option><option>Telangana</option><option>Andhra Pradesh</option><option>Karnataka</option><option>Tamil Nadu</option><option>Maharashtra</option><option>Delhi</option><option>Gujarat</option><option>Rajasthan</option><option>West Bengal</option><option>Uttar Pradesh</option></select>
        </div></div>
      </div>
      <button class="place-order-btn" id="next-btn">Continue to Payment →</button>`;
    document.getElementById('next-btn').addEventListener('click', () => {
      if (!document.getElementById('email').value.trim() || !document.getElementById('fname').value.trim() || !document.getElementById('address').value.trim()) {
        showToast('Please fill in all required fields'); return;
      }
      currentStep = 2; renderStep2();
    });
  }

  function renderStep2() {
    document.getElementById('checkout-left').innerHTML = `
      <h1 class="checkout-title">Checkout</h1>${buildSteps(2)}
      <div class="form-section">
        <p class="form-section-title">Payment method</p>
        <div class="payment-methods">
          <div class="pay-icon active" data-method="card">💳 Card</div>
          <div class="pay-icon" data-method="upi">📱 UPI</div>
          <div class="pay-icon" data-method="netbanking">🏦 Net Banking</div>
        </div>
        <div id="card-fields">
          <div class="form-grid full"><div class="form-group"><label>Card number</label><input type="text" id="card-num" placeholder="1234 5678 9012 3456" maxlength="19"></div></div>
          <div class="form-grid" style="margin-top:16px">
            <div class="form-group"><label>Expiry</label><input type="text" id="expiry" placeholder="MM / YY" maxlength="7"></div>
            <div class="form-group"><label>CVV</label><input type="text" id="cvv" placeholder="123" maxlength="4"></div>
          </div>
          <div class="form-grid full" style="margin-top:16px"><div class="form-group"><label>Name on card</label><input type="text" id="card-name" placeholder="Your Name"></div></div>
        </div>
        <div id="upi-fields" style="display:none">
          <div class="form-grid full"><div class="form-group"><label>UPI ID</label><input type="text" id="upi-id" placeholder="yourname@upi"></div></div>
        </div>
      </div>
      <button class="place-order-btn" id="next-btn">Review Order →</button>`;
    document.querySelectorAll('.pay-icon').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.pay-icon').forEach(e => e.classList.remove('active'));
        el.classList.add('active');
        document.getElementById('card-fields').style.display = el.dataset.method === 'card' ? 'block' : 'none';
        const upi = document.getElementById('upi-fields');
        if (upi) upi.style.display = el.dataset.method === 'upi' ? 'block' : 'none';
      });
    });
    const cn = document.getElementById('card-num');
    if (cn) cn.addEventListener('input', e => { let v = e.target.value.replace(/\D/g,'').substring(0,16); e.target.value = v.replace(/(.{4})/g,'$1 ').trim(); });
    const ex = document.getElementById('expiry');
    if (ex) ex.addEventListener('input', e => { let v = e.target.value.replace(/\D/g,'').substring(0,4); if(v.length>=2) v=v.substring(0,2)+' / '+v.substring(2); e.target.value=v; });
    document.getElementById('next-btn').addEventListener('click', () => { currentStep = 3; renderStep3(); });
  }

  function renderStep3() {
    const { total } = calcTotals();
    document.getElementById('checkout-left').innerHTML = `
      <h1 class="checkout-title">Checkout</h1>${buildSteps(3)}
      <div class="form-section">
        <p class="form-section-title">Review your order</p>
        <div style="background:var(--bg-2);border-radius:16px;padding:24px;margin-bottom:24px">
          ${cart.map(i => `<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)"><span style="font-size:0.88rem">${i.title}</span><span style="font-size:0.88rem;font-weight:500">₹${inr(i.price)}</span></div>`).join('')}
          <div style="display:flex;justify-content:space-between;padding:16px 0 0"><span style="font-size:0.9rem;font-weight:500">Total</span><span style="font-family:'DM Serif Display',serif;font-size:1.3rem">₹${inr(total)}</span></div>
        </div>
      </div>
      <button class="place-order-btn" id="place-btn">Place Order ✓</button>`;
    document.getElementById('place-btn').addEventListener('click', () => {
      saveCart([]); updateBadge([]);
      document.getElementById('checkout-left').innerHTML = `<div class="order-success"><div class="success-icon">✓</div><h2>Order placed!</h2><p>Thank you! You'll receive a confirmation shortly.</p><a href="index.html" class="btn">Back to shop</a></div>`;
      document.getElementById('checkout-right').innerHTML = '';
    });
  }

  document.getElementById('checkout-right').innerHTML = buildSummary();
  renderStep1();
}
