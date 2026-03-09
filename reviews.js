/* ══════════════════════════════════
   REVIEWS MODULE
   Handles: render, submit, avg calc,
   star picker, helpful votes
══════════════════════════════════ */

(function () {

  /* ── Storage helpers ── */
  function loadReviews(productId) {
    try {
      return JSON.parse(localStorage.getItem('reviews_' + productId)) || [];
    } catch (e) { return []; }
  }

  function saveReviews(productId, reviews) {
    try {
      localStorage.setItem('reviews_' + productId, JSON.stringify(reviews));
    } catch (e) {}
  }

  /* ── Seed reviews (first-time only) ── */
  function seedReviews(productId, productTitle) {
    if (loadReviews(productId).length > 0) return;
    const seeds = [
      {
        name: 'Alex M.',
        rating: 5,
        title: 'Exactly what I needed',
        body: 'Really impressed with the quality. It arrived quickly and matches the description perfectly. Would absolutely buy again.',
        date: 'Jan 2025',
        helpful: 14,
        id: Date.now() - 3000
      },
      {
        name: 'Jordan K.',
        rating: 4,
        title: 'Great value for money',
        body: 'Solid product overall. Minor packaging issue on arrival but the item itself is in perfect condition. Happy with the purchase.',
        date: 'Dec 2024',
        helpful: 9,
        id: Date.now() - 2000
      },
      {
        name: 'Sam R.',
        rating: 5,
        title: 'Highly recommend',
        body: 'Bought this as a gift and the recipient loved it. Good build quality and looks exactly like the photos.',
        date: 'Nov 2024',
        helpful: 7,
        id: Date.now() - 1000
      }
    ];
    saveReviews(productId, seeds);
  }

  /* ── Stars renderer ── */
  function starsHtml(rating) {
    let s = '';
    for (let i = 1; i <= 5; i++) {
      s += i <= Math.round(rating) ? '★' : '☆';
    }
    return s;
  }

  /* ── Average ── */
  function calcAvg(reviews) {
    if (!reviews.length) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }

  /* ── Rating bar widths ── */
  function calcBarWidths(reviews) {
    const counts = [0, 0, 0, 0, 0]; // index 0 = 1★ ... 4 = 5★
    reviews.forEach(r => {
      const i = Math.min(Math.max(Math.round(r.rating), 1), 5) - 1;
      counts[i]++;
    });
    return counts.map(c => reviews.length ? Math.round((c / reviews.length) * 100) : 0);
  }

  /* ── Render summary ── */
  function renderSummary(reviews, container) {
    const avg = calcAvg(reviews).toFixed(1);
    const widths = calcBarWidths(reviews);
    container.querySelector('.avg-score-num').textContent = avg;
    container.querySelector('.avg-score-stars').textContent = starsHtml(avg);
    container.querySelector('.avg-score-total').textContent =
      reviews.length + ' review' + (reviews.length !== 1 ? 's' : '');

    const rows = container.querySelectorAll('.rating-bar-row');
    rows.forEach((row, i) => {
      const starNum = 5 - i; // rows go 5→1
      const w = widths[starNum - 1];
      row.querySelector('.rating-bar-fill').style.width = w + '%';
      row.querySelector('.rating-bar-count').textContent = widths[starNum - 1]
        ? reviews.filter(r => Math.round(r.rating) === starNum).length
        : 0;
    });
  }

  /* ── Render review cards ── */
  function renderList(reviews, listEl) {
    if (reviews.length === 0) {
      listEl.innerHTML = '<p style="font-size:0.9rem;color:var(--text-2);padding:24px 0">No reviews yet. Be the first to share your thoughts.</p>';
      return;
    }
    listEl.innerHTML = reviews.slice().reverse().map((r, idx) => `
      <div class="review-item" data-idx="${idx}">
        <div class="review-top">
          <div class="reviewer-left">
            <span class="reviewer-name">${esc(r.name)}${r.isNew ? '<span class="new-badge">New</span>' : ''}</span>
            <span class="reviewer-date">${r.date}</span>
          </div>
          <span class="review-stars-row">${starsHtml(r.rating)}</span>
        </div>
        <p class="review-title">${esc(r.title)}</p>
        <p class="review-body">${esc(r.body)}</p>
        <div class="review-helpful">
          <span>Helpful?</span>
          <button class="helpful-btn" data-id="${r.id}" ${r.votedHelpful ? 'disabled' : ''}>
            Yes (${r.helpful})
          </button>
        </div>
      </div>
    `).join('');
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Main init ── */
  window.initReviews = function (productId, productTitle) {
    seedReviews(productId, productTitle);
    let reviews = loadReviews(productId);

    const section = document.getElementById('reviews-section');
    if (!section) return;

    const summaryEl  = section.querySelector('.reviews-summary');
    const listEl     = section.querySelector('.reviews-list');
    const starPicker = section.querySelector('.star-picker');
    const nameInput  = section.querySelector('#r-name');
    const titleInput = section.querySelector('#r-title');
    const bodyInput  = section.querySelector('#r-body');
    const submitBtn  = section.querySelector('.submit-review-btn');
    const polishBtn  = section.querySelector('.ai-polish-btn');

    let selectedRating = 0;

    // Init render
    renderSummary(reviews, summaryEl);
    renderList(reviews, listEl);

    /* ── Star picker ── */
    const stars = starPicker.querySelectorAll('.star-pick');
    stars.forEach(s => {
      s.addEventListener('click', () => {
        selectedRating = parseInt(s.dataset.val);
        stars.forEach((st, i) => st.classList.toggle('lit', i < selectedRating));
      });
      s.addEventListener('mouseenter', () => {
        const hov = parseInt(s.dataset.val);
        stars.forEach((st, i) => st.classList.toggle('lit', i < hov));
      });
      s.addEventListener('mouseleave', () => {
        stars.forEach((st, i) => st.classList.toggle('lit', i < selectedRating));
      });
    });

    /* ── Helpful votes (event delegation) ── */
    listEl.addEventListener('click', e => {
      const btn = e.target.closest('.helpful-btn');
      if (!btn || btn.disabled) return;
      const id = parseInt(btn.dataset.id);
      const r = reviews.find(r => r.id === id);
      if (!r) return;
      r.helpful++;
      r.votedHelpful = true;
      saveReviews(productId, reviews);
      renderList(reviews, listEl);
    });

    /* ── Submit ── */
    submitBtn.addEventListener('click', () => {
      const name  = nameInput.value.trim();
      const title = titleInput.value.trim();
      const body  = bodyInput.value.trim();
      if (!name || !body || !selectedRating) {
        showToast('Please add your name, a rating, and write something.');
        return;
      }
      const review = {
        id: Date.now(),
        name,
        rating: selectedRating,
        title: title || 'My Review',
        body,
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        helpful: 0,
        isNew: true
      };
      reviews.push(review);
      saveReviews(productId, reviews);
      renderSummary(reviews, summaryEl);
      renderList(reviews, listEl);

      // Reset form
      nameInput.value = '';
      titleInput.value = '';
      bodyInput.value = '';
      selectedRating = 0;
      stars.forEach(s => s.classList.remove('lit'));

      showToast('Review submitted — thank you!');

      // Scroll to reviews
      listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    /* ── AI Polish (called by ai-features.js if key exists) ── */
    if (polishBtn) {
      polishBtn.addEventListener('click', async () => {
        const body = bodyInput.value.trim();
        if (!body) { showToast('Write something first, then polish it.'); return; }
        if (typeof window.geminiPolishReview === 'function') {
          polishBtn.disabled = true;
          polishBtn.textContent = 'Polishing…';
          const improved = await window.geminiPolishReview(body);
          if (improved) bodyInput.value = improved;
          polishBtn.textContent = '✦ Polish with AI';
          polishBtn.disabled = false;
          showToast('Review polished.');
        } else {
          showToast('Add a Gemini API key to use AI polish.');
        }
      });
    }
  };

  /* ── Toast (reuse existing if present) ── */
  function showToast(msg) {
    let t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast'; t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
  }

})();
