(function () {
  const GROUPS = [
    {
      label: 'Electronics', emoji: '📱',
      items: [
        { label: 'Smartphones',  file: 'smartphones.html'  },
        { label: 'Laptops',      file: 'laptops.html'      },
        { label: 'Tablets',      file: 'tablets.html'      },
      ]
    },
    {
      label: 'Clothing', emoji: '👗',
      items: [
        { label: "Women's Clothing", file: 'womens-clothing.html' },
        { label: "Men's Clothing",   file: 'mens-clothing.html'   },
        { label: 'Tops',             file: 'tops.html'            },
        { label: "Women's Shoes",    file: 'womens-shoes.html'    },
        { label: "Men's Shoes",      file: 'mens-shoes.html'      },
        { label: 'Bags',             file: 'bags.html'            },
      ]
    },
    {
      label: 'Beauty', emoji: '✨',
      items: [
        { label: 'Beauty',      file: 'beauty.html'      },
        { label: 'Fragrances',  file: 'fragrances.html'  },
        { label: 'Sunglasses',  file: 'sunglasses.html'  },
      ]
    },
    {
      label: 'Home', emoji: '🏠',
      items: [
        { label: 'Furniture',        file: 'furniture.html'       },
        { label: 'Home Decoration',  file: 'home-decoration.html' },
      ]
    },
    {
      label: 'Other', emoji: '🛒',
      items: [
        { label: 'Groceries',   file: 'groceries.html'          },
        { label: 'Sports',      file: 'sports-accessories.html' },
        { label: 'Vehicle',     file: 'vehicle.html'            },
        { label: 'Motorcycles', file: 'motorcycle.html'         },
      ]
    },
    {
      label: 'Account', emoji: '👤',
      items: [
        { label: 'Sign In',        file: 'login.html'  },
        { label: 'Create Account', file: 'signup.html' },
      ]
    },
  ];

  function buildSidebar() {
    const overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    overlay.className = 'sidebar-overlay';
    overlay.addEventListener('click', closeSidebar);

    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    sidebar.className = 'sidebar';

    let user = null;
    try { user = JSON.parse(localStorage.getItem('lsms_user')); } catch(e) {}

    sidebar.innerHTML = `
      <div class="sidebar-header">
        <span class="sidebar-title">Categories</span>
        <button class="sidebar-close" id="sidebar-close">✕</button>
      </div>
      ${user ? `
        <div style="padding:16px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px">
          <div style="width:32px;height:32px;background:var(--btn-bg);color:var(--btn-text);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:500">${user.avatar || user.name[0]}</div>
          <div>
            <p style="font-size:0.82rem;color:var(--text);font-weight:400">${user.name}</p>
            <p style="font-size:0.7rem;color:var(--text-2)">${user.email}</p>
          </div>
        </div>` : ''}
      <nav class="sidebar-nav">
        ${GROUPS.map(group => `
          <div class="sidebar-group">
            <div class="sidebar-group-label">
              <span class="sidebar-group-emoji">${group.emoji}</span>
              ${group.label}
            </div>
            <ul class="sidebar-group-items">
              ${group.items.map(item => `
                <li><a class="sidebar-link" href="${item.file}">${item.label}</a></li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
        ${user ? `
          <div class="sidebar-group" style="border-top:1px solid var(--border)">
            <ul class="sidebar-group-items" style="padding-left:0">
              <li><a class="sidebar-link" href="#" id="logout-link" style="color:var(--text-2)">Sign out</a></li>
            </ul>
          </div>` : ''}
      </nav>
      <div class="sidebar-footer">
        <a class="sidebar-footer-link" href="index.html">← Back to shop</a>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(sidebar);

    document.getElementById('sidebar-close').addEventListener('click', closeSidebar);

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', e => {
        e.preventDefault();
        try { localStorage.removeItem('lsms_user'); } catch(e) {}
        window.location.href = 'login.html';
      });
    }

    const current = window.location.pathname.split('/').pop();
    sidebar.querySelectorAll('.sidebar-link').forEach(a => {
      if (a.getAttribute('href') === current) a.classList.add('sidebar-link-active');
    });
  }

  function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebar-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  function injectNavButton() {
    const navRight = document.querySelector('.nav-right');
    if (!navRight) return;

    let user = null;
    try { user = JSON.parse(localStorage.getItem('lsms_user')); } catch(e) {}

    const userLi = document.createElement('li');
    if (user) {
      userLi.innerHTML = `<a href="#" id="nav-user-btn" style="gap:6px">
        <span style="width:24px;height:24px;background:var(--btn-bg);color:var(--btn-text);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:500">${user.avatar || user.name[0]}</span>
        ${user.name.split(' ')[0]}
      </a>`;
    } else {
      userLi.innerHTML = `<a href="login.html">Sign in</a>`;
    }
    navRight.insertBefore(userLi, navRight.firstChild);

    const catLi = document.createElement('li');
    catLi.innerHTML = `<button class="nav-categories-btn" id="nav-categories-btn">Categories</button>`;
    navRight.insertBefore(catLi, navRight.firstChild);

    document.getElementById('nav-categories-btn').addEventListener('click', openSidebar);

    const userBtn = document.getElementById('nav-user-btn');
    if (userBtn) userBtn.addEventListener('click', e => { e.preventDefault(); openSidebar(); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildSidebar();
    injectNavButton();
  });

  window.openSidebar  = openSidebar;
  window.closeSidebar = closeSidebar;
})();
