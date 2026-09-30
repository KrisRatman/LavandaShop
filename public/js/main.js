(function () {
  'use strict';

  // ---------- Данные каталога ----------
  const PRODUCTS = [
    { id: 1, title: 'Интерьерная новогодняя композиция', desc: 'Искусственные цветы, новогодний декор, стеклянный шар 15см, в шляпной коробке высота 60см', price: 4700, img: 'bouquet-1.jpg', badge: 'hit', tags: ['hit', 'box', 'tall'] },
    { id: 2, title: 'Свадебный букет', desc: 'Свадебный букет из гипсофилл и стабилизированной лаванды', price: 4700, img: 'bouquet-2.jpg', badge: 'new', tags: ['new'] },
    { id: 3, title: 'Коробка с зефиром и живыми цветами', desc: 'Коробочка с наисвежайшим зефиром ручной работы', price: 1800, img: 'bouquet-3.jpg', badge: 'stock', tags: ['box', 'roses'] },
    { id: 4, title: 'Букет полевой с гортензией и ромашками', desc: 'Гортензия, ромашки, эустома, дельфиниум, аллиум, эрингиум.', price: 5000, img: 'bouquet-4.jpg', badge: 'hit', tags: ['hit', 'tall'] },
    { id: 5, title: 'Букет авторский', desc: 'Вишневое сочетание в одном букете с роскошным анемоном и пионовидной розой', price: 6500, img: 'bouquet-5.jpg', badge: 'new', tags: ['new', 'roses', 'peony'] },
    { id: 6, title: 'Композиция', desc: 'Сочная, яркая композиция с пионовидными розами', price: 6500, img: 'bouquet-6.jpg', badge: 'hit', tags: ['hit', 'box', 'roses', 'peony'] },
    { id: 7, title: 'Новогодняя композиция коллекция «Сочная ягода»', desc: 'Новогодняя композиция со свечами на подставке, цвета — зеленый, красный, белый, серебро, золото', price: 5000, img: 'bouquet-7.jpg', badge: 'stock', tags: [] },
    { id: 8, title: 'Композиция', desc: 'Живая композиция с гиацинтами и тюльпанами! С луковицами, которые в будущем можно пересадить', price: 6000, img: 'bouquet-8.jpg', badge: 'new', tags: ['new', 'tall'] },
    { id: 9, title: 'Композиция в малой шляпной коробке', desc: 'Облако нежной гипсофилы в розовой шляпной коробке', price: 2000, img: 'box-gypsophila.jpg', badge: 'hit', tags: ['hit', 'box'] },
    { id: 10, title: 'Композиция в колбе', desc: 'Сухоцветы и хлопок под стеклянным куполом — простоит больше года', price: 3500, img: 'flask.jpg', badge: 'new', tags: ['new'] },
    { id: 11, title: 'Съедобный букет', desc: 'Колбасы, сыры, овощи и зелень в деревянном ящике. Собираем под заказ', price: 3000, img: 'edible.jpg', badge: 'stock', tags: ['box'] },
  ];

  const BADGES = {
    hit: { text: 'Хит', cls: 'bg-rose' },
    new: { text: 'Новинка', cls: 'bg-lav' },
    stock: { text: 'В наличии', cls: 'bg-sage' },
  };

  const PAGE_SIZE = 8;
  const rub = (n) => n.toLocaleString('ru-RU').replace(/ /g, ' ') + ' ₽';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // ---------- Хранилище (корзина, избранное) ----------
  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* приватный режим */ }
    },
  };
  let cart = store.get('lavanda-cart', []);
  let favs = new Set(store.get('lavanda-favs', []));

  // ---------- Уведомления ----------
  const toast = $('#toast');
  let toastTimer;
  function notify(text) {
    toast.textContent = text;
    toast.classList.remove('opacity-0', 'translate-y-4');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('opacity-0', 'translate-y-4'), 2600);
  }

  // ---------- Корзина и избранное ----------
  function renderCounters() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    $('#cartTotal').textContent = rub(total);
    const favCount = $('#favCount');
    favCount.textContent = favs.size;
    favCount.classList.toggle('hidden', favs.size === 0);
    favCount.classList.toggle('grid', favs.size > 0);
  }

  function addToCart(title, price) {
    cart.push({ title, price });
    store.set('lavanda-cart', cart);
    renderCounters();
    notify('«' + title + '» добавлен в корзину');
  }

  function toggleFav(id, btn) {
    favs.has(id) ? favs.delete(id) : favs.add(id);
    store.set('lavanda-favs', Array.from(favs));
    paintFav(btn, favs.has(id));
    renderCounters();
  }

  function paintFav(btn, active) {
    btn.setAttribute('aria-pressed', active);
    btn.querySelector('svg').classList.toggle('fill-current', active);
    btn.querySelector('svg').classList.toggle('fill-none', !active);
  }

  // ---------- Каталог ----------
  const grid = $('#products');
  const moreBtn = $('#moreBtn');
  const state = { filter: 'all', query: '', expanded: false };

  function cardHTML(p) {
    const b = BADGES[p.badge];
    return `
      <article class="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-card">
        <div class="relative aspect-square overflow-hidden bg-lav-50">
          <img src="img/${p.img}" alt="${p.title}" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" width="280" height="280">
          <span class="badge ${b.cls} absolute left-2.5 top-2.5 sm:left-[15px] sm:top-[15px]">${b.text}</span>
          <button type="button" class="absolute right-2.5 top-2.5 grid h-[34px] w-[34px] place-items-center rounded-full bg-white/90 text-lav transition hover:bg-white sm:right-[15px] sm:top-[15px]" aria-label="В избранное" data-fav="${p.id}">
            <svg class="h-[17px] w-[17px] fill-none"><use href="#i-heart"/></svg>
          </button>
        </div>
        <div class="flex flex-1 flex-col p-3 sm:p-[17px]">
          <h3 class="text-[14px] font-medium leading-snug text-ink sm:text-[16px]">${p.title}</h3>
          <p class="mt-2 line-clamp-3 text-[12px] leading-[1.4] text-soft sm:text-[13px]">${p.desc}</p>
          <div class="mt-auto flex items-center justify-between gap-2 pt-4">
            <span class="font-display text-[17px] font-bold text-plum sm:text-[20px]">${rub(p.price)}</span>
            <button type="button" class="btn-cart" aria-label="В корзину" data-add="${p.title}" data-price="${p.price}">
              <svg class="h-[18px] w-[18px]"><use href="#i-bag"/></svg>
            </button>
          </div>
        </div>
      </article>`;
  }

  function renderCatalog() {
    const q = state.query.trim().toLowerCase();
    const list = PRODUCTS.filter((p) =>
      (state.filter === 'all' || p.tags.includes(state.filter)) &&
      (!q || (p.title + ' ' + p.desc).toLowerCase().includes(q))
    );
    const visible = state.expanded ? list : list.slice(0, PAGE_SIZE);
    grid.innerHTML = visible.map(cardHTML).join('');
    $$('[data-fav]', grid).forEach((btn) => paintFav(btn, favs.has(Number(btn.dataset.fav))));
    $('#emptyState').classList.toggle('hidden', list.length > 0);
    moreBtn.classList.toggle('hidden', state.expanded || list.length <= PAGE_SIZE);
  }

  $('#filters').addEventListener('click', (e) => {
    const chip = e.target.closest('[data-filter]');
    if (!chip) return;
    $$('.filter-chip').forEach((c) => {
      c.classList.toggle('is-active', c === chip);
      c.setAttribute('aria-selected', c === chip);
    });
    state.filter = chip.dataset.filter;
    state.expanded = false;
    renderCatalog();
  });

  moreBtn.addEventListener('click', () => {
    state.expanded = true;
    renderCatalog();
  });

  $$('[data-show-all]').forEach((link) => link.addEventListener('click', () => {
    state.filter = 'all';
    state.query = '';
    state.expanded = true;
    $$('.filter-chip').forEach((c) => c.classList.toggle('is-active', c.dataset.filter === 'all'));
    renderCatalog();
  }));

  // Делегирование: корзина и избранное по всей странице
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) return addToCart(add.dataset.add, Number(add.dataset.price));
    const fav = e.target.closest('[data-fav]');
    if (fav) return toggleFav(Number(fav.dataset.fav), fav);
  });

  $('#cartBtn').addEventListener('click', () => {
    if (!cart.length) return notify('Корзина пока пуста — выберите букет в каталоге');
    notify('В корзине ' + cart.length + ' шт. на ' + rub(cart.reduce((s, i) => s + i.price, 0)) + ' — оформите заказ ниже');
    $('#order').scrollIntoView();
  });

  $('#favBtn').addEventListener('click', () => {
    notify(favs.size ? 'В избранном: ' + favs.size + ' шт.' : 'Нажмите ♡ на карточке, чтобы добавить букет в избранное');
  });

  // ---------- Поиск ----------
  const searchBar = $('#searchBar');
  const searchInput = $('#searchInput');
  $('#searchBtn').addEventListener('click', (e) => {
    const open = searchBar.classList.toggle('hidden') === false;
    e.currentTarget.setAttribute('aria-expanded', open);
    if (open) searchInput.focus();
  });
  searchInput.addEventListener('input', () => {
    state.query = searchInput.value;
    state.expanded = true;
    renderCatalog();
  });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') $('#catalog').scrollIntoView();
  });

  // ---------- Мобильное меню ----------
  const menuBtn = $('#menuBtn');
  const menu = $('#mobileMenu');
  function setMenu(open) {
    menu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  menuBtn.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a, button')) setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 1024) setMenu(false); });

  // ---------- Модальное окно ----------
  const modal = $('#modal');
  const callbackForm = $('#callbackForm');
  let lastFocus = null;

  function openModal(title) {
    lastFocus = document.activeElement;
    $('#modalTitle').textContent = title || 'Заказать звонок';
    callbackForm.reset();
    $('#callbackMsg').classList.add('hidden');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#c-name').focus(), 50);
  }
  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  $$('[data-open="callback"]').forEach((btn) =>
    btn.addEventListener('click', () => openModal(btn.dataset.title)));
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('[data-close]')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  function showMsg(el, text, ok) {
    el.textContent = text;
    el.classList.remove('hidden', 'text-rose', 'text-sage');
    el.classList.add(ok ? 'text-sage' : 'text-rose');
  }

  callbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = $('#c-phone');
    const valid = phone.value.replace(/\D/g, '').length >= 10;
    phone.classList.toggle('is-invalid', !valid);
    if (!valid) return showMsg($('#callbackMsg'), 'Укажите номер телефона полностью', false);
    showMsg($('#callbackMsg'), 'Спасибо! Перезвоним в течение 15 минут.', true);
    setTimeout(closeModal, 1800);
  });

  // ---------- Форма заказа ----------
  const orderForm = $('#orderForm');
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = $('#orderMsg');
    let ok = true;
    $$('[required]', orderForm).forEach((field) => {
      const empty = !field.value.trim();
      field.classList.toggle('is-invalid', empty);
      if (empty) ok = false;
    });
    if (!ok) return showMsg(msg, 'Заполните, пожалуйста, отмеченные поля', false);
    if (!orderForm.agree.checked) return showMsg(msg, 'Нужно согласие на обработку персональных данных', false);
    showMsg(msg, 'Заказ принят! Флорист свяжется с вами в течение 15 минут.', true);
    orderForm.reset();
    cart = [];
    store.set('lavanda-cart', cart);
    renderCounters();
  });
  orderForm.addEventListener('input', (e) => e.target.classList.remove('is-invalid'));

  // ---------- Старт ----------
  renderCatalog();
  renderCounters();
})();
