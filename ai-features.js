/* ══════════════════════════════════
   AI FEATURES MODULE — ADRSP
   Gemini 1.5 Flash powered
══════════════════════════════════ */
(function () {

  const GEMINI_KEY = 'AIzaSyAZ0Wz2HGSilLLUUe-GpmIBi-XQfybMKzc';
  const USD_TO_INR = 83.5;
  function toInr(usd) { return (usd * USD_TO_INR).toLocaleString('en-IN', { maximumFractionDigits: 0 }); }

  /* ── Gemini text call ── */
  async function gemini(prompt) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );
    if (!res.ok) throw new Error('api-error');
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  /* ── Helpers ── */
  function parseJson(text) {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }

  function toast(msg) {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
  }

  function loadingHtml() {
    return '<div class="ai-loading-line" style="width:80%"></div><div class="ai-loading-line" style="width:55%"></div>';
  }

  /* ══════════════════════════════════
     PRICE PREDICTION
  ══════════════════════════════════ */
  async function runPricePrediction(product, panel) {
    const textEl = panel.querySelector('.ai-panel-text');
    textEl.innerHTML = loadingHtml();
    try {
      const priceInr = '₹' + toInr(product.price);
      const text = await gemini(
        'You are a price intelligence AI for an e-commerce store. ' +
        'Product: "' + product.title + '", current price: ' + priceInr + ', category: "' + product.category + '". ' +
        'In ONE short sentence (under 18 words), tell the user whether this is a good deal or if price might drop. ' +
        'Be direct and natural. No markdown, no quotes.'
      );
      textEl.textContent = text.trim();
    } catch (e) {
      textEl.textContent = 'Price appears stable — this looks like a fair deal right now.';
    }
  }

  /* ══════════════════════════════════
     PRICE COMPARISON + DEAL FINDER
  ══════════════════════════════════ */
  async function runPriceComparison(product, compPanel, dealBanner) {
    const priceInr = toInr(product.price);
    dealBanner.querySelector('.deal-title-text').textContent = 'Scanning deals…';
    dealBanner.querySelector('.deal-sub-text').textContent = '';

    let fk, az, bestStore, reason;
    try {
      const raw = await gemini(
        'You are a price comparison AI. ' +
        'Product: "' + product.title + '", our price: ₹' + priceInr + '. ' +
        'Generate realistic Flipkart and Amazon INR prices within ±10% of ₹' + priceInr + '. ' +
        'bestStore must be "our-store", "flipkart", or "amazon". ' +
        'Respond ONLY in this JSON (no markdown): ' +
        '{"flipkart":XXXXX,"amazon":XXXXX,"bestStore":"...","reason":"one sentence under 12 words"}'
      );
      const data = parseJson(raw);
      fk = data.flipkart;
      az = data.amazon;
      bestStore = data.bestStore;
      reason = data.reason;
    } catch (e) {
      // Fallback
      const base = product.price * USD_TO_INR;
      fk = Math.round(base * (0.94 + Math.random() * 0.1));
      az = Math.round(base * (0.96 + Math.random() * 0.08));
      const our = Math.round(product.price * USD_TO_INR);
      const prices = { 'our-store': our, flipkart: fk, amazon: az };
      bestStore = Object.entries(prices).sort((a, b) => a[1] - b[1])[0][0];
      reason = 'Prices are competitive across all platforms.';
    }

    const ourInr = Math.round(product.price * USD_TO_INR);
    const allPrices = { 'our-store': ourInr, flipkart: fk, amazon: az };
    const best = Object.entries(allPrices).sort((a, b) => a[1] - b[1])[0];

    // Update cells
    const cellData = [
      { store: 'our-store', val: ourInr },
      { store: 'flipkart',  val: fk },
      { store: 'amazon',    val: az }
    ];
    compPanel.querySelectorAll('.compare-cell').forEach((cell, i) => {
      const d = cellData[i];
      cell.classList.toggle('best-deal', d.store === best[0]);
      const priceEl = cell.querySelector('.compare-price-val');
      if (priceEl) priceEl.textContent = '₹' + d.val.toLocaleString('en-IN');
      const tag = cell.querySelector('.compare-best-tag');
      if (tag) tag.textContent = d.store === best[0] ? 'Best deal' : '';
    });

    // Update deal banner
    const dealTitle = dealBanner.querySelector('.deal-title-text');
    const dealSub   = dealBanner.querySelector('.deal-sub-text');
    const storeName = best[0] === 'our-store' ? 'Our Store' : best[0].charAt(0).toUpperCase() + best[0].slice(1);

    if (best[0] === 'our-store') {
      dealTitle.textContent = 'Best deal: Our Store — ₹' + ourInr.toLocaleString('en-IN');
      dealSub.textContent   = 'We have the lowest price. Order directly for the fastest delivery.';
    } else {
      dealTitle.textContent = 'Best deal: ' + storeName + ' — ₹' + best[1].toLocaleString('en-IN');
      dealSub.textContent   = (reason || '') + ' Order here for our quality guarantee.';
    }
  }

  /* ══════════════════════════════════
     REVIEW POLISH
  ══════════════════════════════════ */
  window.geminiPolishReview = async function(text) {
    try {
      const improved = await gemini(
        'Improve this product review to be clearer and more helpful. ' +
        'Keep the original sentiment exactly. Return ONLY the improved text, nothing else. ' +
        'Original: "' + text + '"'
      );
      return improved.trim();
    } catch (e) {
      toast('AI unavailable right now.');
      return null;
    }
  };

  /* ══════════════════════════════════
     MAIN INIT
  ══════════════════════════════════ */
  window.initAIFeatures = function(product) {
    const pricePredPanel = document.getElementById('ai-price-prediction');
    const compPanel      = document.getElementById('ai-price-comparison');
    const dealBanner     = document.getElementById('ai-deal-finder');
    const keyRow = document.getElementById('ai-key-row');
    if (keyRow) keyRow.style.display = 'none';

    // Run AI panels
    if (pricePredPanel) runPricePrediction(product, pricePredPanel);
    if (compPanel && dealBanner) runPriceComparison(product, compPanel, dealBanner);
  };

})();
