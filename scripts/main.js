const state = {
  selectedCategory: null,
  isLoading: true,
  errorMessage: '',
  favoriteCount: 268,
  favoriteTimerId: null,
  itemsPerPage: 12,
  visibleCount: 12,
  audioSupported: true,
  audioSupportWarned: false,
  imageObserver: null,
  caseSearchQuery: '',
};

const IMAGE_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"%3E%3Crect width="20" height="20" fill="%23f3f4f6"/%3E%3C/svg%3E';

const CASES_STORAGE_KEY = 'flashcard-admin-cases-v1';
const CATEGORY_STORAGE_KEY = 'flashcard-admin-categories-v1';
const API_BASE_URL = (() => {
  if (window.__FLASHCARD_API_BASE__) return window.__FLASHCARD_API_BASE__;
  if (window.location.port === '4000') return '/api';

  const { protocol, hostname, origin } = window.location;
  const isFileProtocol = protocol === 'file:';
  const isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0'].includes(hostname);

  if (isFileProtocol || isLocalHost) {
    const host = hostname && hostname !== '' ? hostname : '127.0.0.1';
    return `${isFileProtocol ? 'http:' : protocol}//${host}:4000/api`;
  }

  return `${origin}/api`;
})();

const elements = {
  favoriteCount: document.getElementById('favorite-count'),
  themeToggle: document.getElementById('theme-toggle'),
  themeToggleIcon: document.getElementById('theme-toggle-icon'),
  totalCases: document.getElementById('total-cases'),
  totalCategories: document.getElementById('total-categories'),
  categorySearch: null,
  categoryGrid: document.getElementById('category-grid'),
  selectedCategory: document.getElementById('selected-category'),
  casesContainer: document.getElementById('cases-container'),
  caseSearch: document.getElementById('case-search'),
  currentYear: document.getElementById('current-year'),
  loadMoreButton: document.getElementById('load-more-button'),
};

let appCases = [];
let appCategories = [];
let activeSpeech = null;
const AUDIO_REPEAT_COUNT = 3;

async function init() {
  appCases = [];
  appCategories = [];

  state.audioSupported = checkAudioSupport();
  state.audioSupportWarned = false;

  showLoadingSkeleton();

  await hydrateFromApi();

  applyLocalOverrides();

  if (elements.currentYear) {
    elements.currentYear.textContent = new Date().getFullYear();
  }

  state.favoriteCount = initializeFavoriteCount();
  updateFavoriteCountDisplay();
  startFavoriteCountTimer();

  updateTotals();
  renderCategories();
  renderSelectedCategory();

  state.isLoading = false;
  renderCases();

  elements.themeToggle?.addEventListener('click', handleThemeToggle);
  elements.caseSearch?.addEventListener('input', handleCaseSearch);
  elements.categoryGrid?.addEventListener('click', handleCategoryGridClick);
  elements.selectedCategory?.addEventListener('click', handleSelectedCategoryClick);
  elements.casesContainer?.addEventListener('click', handleCasesContainerClick);
  elements.loadMoreButton?.addEventListener('click', handleLoadMoreClick);

  syncThemeToggleIcon();
}

async function hydrateFromApi() {
  try {
    state.errorMessage = '';
    const [categoryResponse, cardResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/categories`, { headers: { Accept: 'application/json' } }),
      fetch(`${API_BASE_URL}/cards`, { headers: { Accept: 'application/json' } }),
    ]);

    if (!categoryResponse.ok || !cardResponse.ok) {
      throw new Error('API 请求失败');
    }

    const categoryPayload = await categoryResponse.json();
    const cardPayload = await cardResponse.json();

    if (Array.isArray(categoryPayload?.categories)) {
      const names = categoryPayload.categories
        .map(item => String(item?.name ?? '').trim())
        .filter(value => value.length > 0);
      appCategories = Array.from(new Set(names));
    }

    if (Array.isArray(cardPayload?.cards)) {
      appCases = cardPayload.cards
        .map(item => ({ ...item }))
        .filter(item => item && item.imageUrl)
        .map(item => ({
          ...item,
          category: item.category || '',
        }));
      appCases.sort((a, b) => {
        const left = Number.parseInt(a.id, 10);
        const right = Number.parseInt(b.id, 10);
        if (Number.isNaN(left) || Number.isNaN(right)) {
          return String(a.title || '').localeCompare(String(b.title || ''), 'zh-Hans-CN');
        }
        return left - right;
      });
      console.info('[main] Fetched cards from API', {
        cardCount: appCases.length,
        categoryCount: appCategories.length,
      });
    }
  } catch (error) {
    console.warn('加载远程学习卡片数据失败，将尝试使用本地缓存。', error);
    state.errorMessage = error?.message
      ? `无法加载最新数据：${error.message}`
      : '无法加载最新数据，请检查网络后重试。';
  }
}

function initializeFavoriteCount() {
  const storedCount = localStorage.getItem('favoriteCount');
  if (storedCount) {
    const parsed = parseInt(storedCount, 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  localStorage.setItem('favoriteCount', '268');
  return 268;
}

function updateFavoriteCountDisplay() {
  if (elements.favoriteCount) {
    elements.favoriteCount.textContent = Number(state.favoriteCount).toLocaleString();
  }
}

function startFavoriteCountTimer() {
  if (state.favoriteTimerId) {
    clearInterval(state.favoriteTimerId);
  }

  state.favoriteTimerId = setInterval(() => {
    state.favoriteCount += 1;
    localStorage.setItem('favoriteCount', String(state.favoriteCount));
    updateFavoriteCountDisplay();
  }, 30000);
}

function applyLocalOverrides() {
  const storedCases = loadCasesFromStorage();
  if ((!appCases || !appCases.length) && storedCases && storedCases.length) {
    const caseMap = new Map();
    storedCases.forEach(item => {
      if (!item) return;
      caseMap.set(String(item.id ?? generateFallbackId(caseMap)), { ...item });
    });
    appCases = Array.from(caseMap.values());
  }

  const storedCategories = loadCategoriesFromStorage();
  if ((!appCategories || !appCategories.length) && storedCategories && storedCategories.length) {
    appCategories = storedCategories;
  }

  if (!appCategories || !appCategories.length) {
    const derivedCategories = Array.from(
      new Set(appCases.map(item => item.category).filter(Boolean))
    );
    if (derivedCategories.length) {
      appCategories = derivedCategories;
    }
  }

  updateTotals();
}

function generateFallbackId(map) {
  let id = map.size + 1000;
  while (map.has(String(id))) {
    id += 1;
  }
  return id;
}

function loadCasesFromStorage() {
  try {
    const raw = localStorage.getItem(CASES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch (error) {
    console.warn('读取本地学习卡片数据失败，将使用默认数据。', error);
    return null;
  }
}

function loadCategoriesFromStorage() {
  try {
    const raw = localStorage.getItem(CATEGORY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map(item => String(item).trim()).filter(Boolean);
  } catch (error) {
    console.warn('读取本地分类数据失败，将使用默认分类。', error);
    return null;
  }
}

function updateTotals() {
  if (elements.totalCases) {
    elements.totalCases.textContent = appCases.length || '0';
  }
  if (elements.totalCategories) {
    elements.totalCategories.textContent = appCategories.length || '0';
  }
}

function handleThemeToggle() {
  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
}

function applyTheme(theme) {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  localStorage.setItem('theme', theme);
  syncThemeToggleIcon();
}

function syncThemeToggleIcon() {
  if (!elements.themeToggle || !elements.themeToggleIcon) return;

  const isDark = document.documentElement.classList.contains('dark');
  elements.themeToggleIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  elements.themeToggle.setAttribute('aria-label', isDark ? '切换到亮色模式' : '切换到暗色模式');
}

function handleCaseSearch(event) {
  state.caseSearchQuery = event.target.value.trim();
  resetVisibleCount();
  renderCases();
}

function handleCategoryGridClick(event) {
  const button = event.target.closest('button[data-category]');
  if (!button) return;

  const category = button.getAttribute('data-category');
  toggleCategory(category);
}

function handleSelectedCategoryClick(event) {
  const clearButton = event.target.closest('button[data-action]');
  if (!clearButton) return;

  const action = clearButton.getAttribute('data-action');
  if (action === 'remove-selected') {
    toggleCategory(state.selectedCategory);
  }
  if (action === 'clear-all') {
    state.selectedCategory = null;
    resetVisibleCount();
    renderSelectedCategory();
    renderCategories();
    renderCases();
  }
}

function toggleCategory(category) {
  if (!category) return;
  state.selectedCategory = state.selectedCategory === category ? null : category;
  resetVisibleCount();
  renderSelectedCategory();
  renderCategories();
  renderCases();
}

function renderCategories() {
  if (!elements.categoryGrid) return;

  const filtered = appCategories;

  if (!filtered.length) {
    elements.categoryGrid.innerHTML = `
      <div class="col-span-full flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
        <div class="text-center">
          <i class="fa-solid fa-search-slash mb-2 text-2xl"></i>
          <p>未找到匹配的分类</p>
        </div>
      </div>
    `;
    return;
  }

  const buttons = filtered
    .map(category => {
      const isSelected = state.selectedCategory === category;
      const baseClasses = 'px-3 py-2 text-sm rounded-lg text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400';
      const activeClasses = 'bg-blue-500 text-white font-medium shadow-sm';
      const inactiveClasses = 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600';

      return `
        <button type="button" data-category="${escapeAttribute(category)}" class="${baseClasses} ${
          isSelected ? activeClasses : inactiveClasses
        }">
          ${escapeHTML(category)}
        </button>
      `;
    })
    .join('');

  elements.categoryGrid.innerHTML = buttons;
}

function renderSelectedCategory() {
  if (!elements.selectedCategory) return;

  if (!state.selectedCategory) {
    elements.selectedCategory.classList.add('hidden');
    elements.selectedCategory.innerHTML = '';
    return;
  }

  elements.selectedCategory.classList.remove('hidden');
  elements.selectedCategory.innerHTML = `
    <span class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
      ${escapeHTML(state.selectedCategory)}
      <button
        type="button"
        data-action="remove-selected"
        class="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors duration-200 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700"
        aria-label="移除选中分类"
      >
        <i class="fa-solid fa-times text-[10px]"></i>
      </button>
    </span>
    <button
      type="button"
      data-action="clear-all"
      class="ml-4 inline-flex items-center text-xs text-gray-500 transition-colors duration-200 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
    >
      <i class="fa-solid fa-xmark mr-1"></i>
      清除选择
    </button>
  `;
}


// Render placeholder cards while we fetch real data from the API.
function showLoadingSkeleton() {
  if (!elements.casesContainer) return;

  const skeleton = `
    <div class="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md animate-pulse dark:bg-gray-800">
      <div class="h-64 w-full bg-gray-200 dark:bg-gray-700"></div>
      <div class="flex flex-col p-5">
        <div class="mt-auto flex flex-wrap items-center justify-center gap-3">
          <div class="h-9 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-9 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div class="h-9 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  `;

  elements.casesContainer.innerHTML = Array.from({ length: state.itemsPerPage }).map(() => skeleton).join('');
  updateLoadMoreButton(0);
}

// Render the grid of visible cards with optional banners.
function renderCases() {
  if (!elements.casesContainer || state.isLoading) return;

  let filteredCases = state.selectedCategory
    ? appCases.filter(caseItem => caseItem.category === state.selectedCategory)
    : appCases;

  const keyword = normalizeSearchText(state.caseSearchQuery);
  const isSearchActive = Boolean(keyword);
  if (isSearchActive) {
    const tokens = keyword.split(/\s+/).filter(Boolean);
    filteredCases = filteredCases.filter(caseItem => {
      const haystack = normalizeSearchText(
        `${caseItem.title || ''} ${caseItem.prompt || ''} ${caseItem.audioText || ''}`
      );
      return tokens.every(token => haystack.includes(token));
    });
  }

  const errorBanner = state.errorMessage
    ? `
      <div class="col-span-full mb-4 flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-600/60 dark:bg-red-900/40 dark:text-red-200 md:flex-row md:items-center md:justify-between">
        <span class="flex items-center gap-2">
          <i class="fa-solid fa-circle-exclamation"></i>
          ${escapeHTML(state.errorMessage)}
        </span>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded bg-red-500 px-3 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          data-action="retry-fetch"
        >
          重新加载
        </button>
      </div>
    `
    : '';

  const audioBanner = renderAudioSupportBanner();
  const noticeHtml = `${errorBanner}${audioBanner}`;

  if (!filteredCases.length) {
    elements.casesContainer.innerHTML = `
      ${noticeHtml}
      <div class="col-span-full rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/20 dark:text-blue-400">
          <i class="fa-solid fa-folder-open text-2xl"></i>
        </div>
        <h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">未找到匹配的学习卡片</h3>
        <p class="mx-auto mb-6 max-w-md text-gray-500 dark:text-gray-400">
          ${isSearchActive ? '请尝试更换搜索关键词，或清除筛选条件' : '当前选择的分类没有匹配的学习卡片，请尝试选择其他分类或清除筛选条件'}
        </p>
        <button
          type="button"
          class="inline-flex items-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          data-action="clear-filters"
        >
          <i class="fa-solid fa-filter-circle-xmark mr-2"></i>
          清除所有筛选
        </button>
      </div>
    `;
    updateLoadMoreButton(0);
    return;
  }

  const visibleCases = filteredCases.slice(0, state.visibleCount);
  const cards = visibleCases.map((caseItem, index) => createCaseCard(caseItem, index)).join('');
  elements.casesContainer.innerHTML = `${noticeHtml}${cards}`;
  watchLazyImages();
  updateLoadMoreButton(filteredCases.length);
}

function createCaseCard(caseItem, index) {
  const displayImageUrl = caseItem.previewImageUrl || caseItem.imageUrl;
  const imageClasses = state.audioSupported
    ? 'js-play-trigger block w-full cursor-pointer object-contain transition-transform duration-500 hover:scale-105'
    : 'js-play-trigger block w-full cursor-not-allowed object-contain opacity-80';
  const badgeText = state.audioSupported ? '轻触图片播放' : '当前浏览器不支持语音播报';
  const fetchPriority = index < 2 ? 'high' : 'auto';

  return `
    <div class="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800">
      <div class="relative overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src="${IMAGE_PLACEHOLDER}"
          data-lazy-src="${escapeAttribute(displayImageUrl)}"
          alt="${escapeAttribute(caseItem.title)}"
          class="${imageClasses}"
          loading="lazy"
          decoding="async"
          fetchpriority="${fetchPriority}"
          data-case-id="${caseItem.id}"
        />
        <div class="pointer-events-none absolute right-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-lg dark:bg-emerald-600">
          ${escapeHTML(badgeText)}
        </div>
      </div>
      <div class="flex flex-col p-5">
        <div class="mt-auto flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            class="copy-button inline-flex items-center rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
            data-action="copy"
            data-case-id="${caseItem.id}"
            data-copied="false"
          >
            复制 <i class="fa-regular fa-clipboard ml-1.5"></i>
          </button>
          <button
            type="button"
            class="download-button inline-flex items-center rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            data-action="download"
            data-case-id="${caseItem.id}"
          >
            下载 <i class="fa-solid fa-download ml-1.5"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderAudioSupportBanner() {
  if (state.audioSupported) return '';
  return `
    <div class="col-span-full mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700 dark:border-amber-600/60 dark:bg-amber-900/40 dark:text-amber-200">
      <i class="fa-solid fa-headphones-simple mt-0.5"></i>
      <div>
        当前浏览器暂不支持语音播报功能，可在最新版 Chrome 或 Edge 浏览器中体验完整读音。
      </div>
    </div>
  `;
}

function checkAudioSupport() {
  return typeof window !== 'undefined'
    && 'speechSynthesis' in window
    && typeof window.SpeechSynthesisUtterance === 'function';
}

// Lazy-load preview images once they enter the viewport.
function watchLazyImages() {
  if (!elements.casesContainer) return;
  const lazyImages = elements.casesContainer.querySelectorAll('img[data-lazy-src]');
  if (!lazyImages.length) return;

  if ('IntersectionObserver' in window) {
    ensureImageObserver();
    if (!state.imageObserver) {
      lazyImages.forEach(img => {
        const actualSrc = img.getAttribute('data-lazy-src');
        if (actualSrc) {
          img.src = actualSrc;
          img.removeAttribute('data-lazy-src');
        }
      });
      return;
    }

    lazyImages.forEach(img => {
      if (img.dataset.lazyBound === 'true') return;
      state.imageObserver.observe(img);
      img.dataset.lazyBound = 'true';
    });
  } else {
    lazyImages.forEach(img => {
      const actualSrc = img.getAttribute('data-lazy-src');
      if (actualSrc) {
        img.src = actualSrc;
        img.removeAttribute('data-lazy-src');
      }
    });
  }
}

function ensureImageObserver() {
  if (state.imageObserver) return;
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    state.imageObserver = null;
    return;
  }

  state.imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      const actualSrc = img.getAttribute('data-lazy-src');
      if (actualSrc) {
        img.src = actualSrc;
        img.removeAttribute('data-lazy-src');
      }
      state.imageObserver.unobserve(img);
    });
  }, { rootMargin: '200px 0px', threshold: 0.1 });
}

// Display a temporary, non-blocking toast on the page.
function showToast(message) {
  if (typeof document === 'undefined') return;
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = [
    'position:fixed',
    'top:24px',
    'left:50%',
    'transform:translate(-50%,0)',
    'background:rgba(15,23,42,0.95)',
    'color:#fff',
    'padding:10px 16px',
    'border-radius:999px',
    'font-size:13px',
    'line-height:1.4',
    'z-index:9999',
    'box-shadow:0 12px 30px rgba(15,23,42,0.25)',
    'transition:opacity 0.4s ease, transform 0.4s ease',
    'pointer-events:none',
  ].join(';');

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translate(-50%,-12px)';
    toast.addEventListener('transitionend', () => {
      toast.remove();
    }, { once: true });
  }, 2400);
}

function handleCasesContainerClick(event) {
  const actionButton = event.target.closest('button[data-action]');
  const imageTrigger = event.target.closest('.js-play-trigger');

  if (imageTrigger) {
    const caseId = imageTrigger.getAttribute('data-case-id');
    if (caseId) {
      playPronunciation(caseId, imageTrigger);
    }
    return;
  }

  if (!actionButton) return;

  const action = actionButton.getAttribute('data-action');

  if (action === 'retry-fetch') {
    retryFetchData();
    return;
  }

  if (action === 'copy') {
    const caseId = actionButton.getAttribute('data-case-id');
    copyPrompt(caseId, actionButton);
    return;
  }

  if (action === 'download') {
    const caseId = actionButton.getAttribute('data-case-id');
    downloadImage(caseId, actionButton);
    return;
  }

  if (action === 'speak') {
    const caseId = actionButton.getAttribute('data-case-id');
    playPronunciation(caseId, actionButton);
    return;
  }

  if (action === 'clear-filters') {
    state.selectedCategory = null;
    state.caseSearchQuery = '';
    if (elements.caseSearch) {
      elements.caseSearch.value = '';
    }
    resetVisibleCount();
    renderSelectedCategory();
    renderCategories();
    renderCases();
  }
}

async function retryFetchData() {
  state.isLoading = true;
  showLoadingSkeleton();
  try {
    await hydrateFromApi();
    applyLocalOverrides();
    state.visibleCount = state.itemsPerPage;
    updateTotals();
    renderCategories();
    renderSelectedCategory();
  } finally {
    state.isLoading = false;
    renderCases();
  }
}

function copyPrompt(caseId, button) {
  if (!caseId) return;

  const caseItem = appCases.find(item => String(item.id) === String(caseId));
  if (!caseItem) return;

  const textToCopy = caseItem.prompt || caseItem.imageUrl || '';
  if (!textToCopy) return;

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      button.dataset.copied = 'true';
      button.innerHTML = '已复制 <i class="fa-solid fa-check ml-1.5"></i>';
      button.classList.remove('bg-blue-50', 'text-blue-600', 'hover:bg-blue-100', 'dark:bg-blue-900/20', 'dark:text-blue-300', 'dark:hover:bg-blue-900/40');
      button.classList.add('bg-green-500', 'text-white');

      setTimeout(() => {
        button.dataset.copied = 'false';
        button.innerHTML = '复制 <i class="fa-regular fa-clipboard ml-1.5"></i>';
        button.classList.remove('bg-green-500', 'text-white');
        button.classList.add('bg-blue-50', 'text-blue-600', 'hover:bg-blue-100', 'dark:bg-blue-900/20', 'dark:text-blue-300', 'dark:hover:bg-blue-900/40');
      }, 2000);
    })
    .catch(() => {
      console.error('复制失败，请检查浏览器权限。');
    });
}

function downloadImage(caseId, button) {
  if (!caseId || !button) return;

  const caseItem = appCases.find(item => String(item.id) === String(caseId));
  if (!caseItem) return;

  const downloadSource = caseItem.originalImageUrl || caseItem.imageUrl;
  if (!downloadSource) return;

  const defaultContent = '下载 <i class="fa-solid fa-download ml-1.5"></i>';
  button.disabled = true;
  button.innerHTML = '下载中...';

  fetch(downloadSource)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response.blob();
    })
    .then(blob => {
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = buildImageFileName(caseItem, blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);

      button.innerHTML = '已下载 <i class="fa-solid fa-check ml-1.5"></i>';
      button.disabled = false;

      setTimeout(() => {
        button.innerHTML = defaultContent;
      }, 2000);
    })
    .catch(error => {
      console.error('下载失败，请稍后重试。', error);
      button.innerHTML = '下载失败 <i class="fa-solid fa-triangle-exclamation ml-1.5"></i>';
      button.disabled = false;

      setTimeout(() => {
        button.innerHTML = defaultContent;
      }, 2000);
    });
}

function buildImageFileName(caseItem, blob) {
  const baseNameSource = caseItem.title || `card-${caseItem.id || 'image'}`;
  const baseName = sanitizeFileName(baseNameSource) || `card-${caseItem.id || 'image'}`;

  const sourceForExtension = caseItem.originalImageUrl || caseItem.imageUrl;
  const urlExtension = getExtensionFromUrl(sourceForExtension);
  const mimeExtension = getExtensionFromMime((blob && blob.type) || '');
  const extension = urlExtension || mimeExtension || 'png';

  return `${baseName}.${extension}`;
}

function sanitizeFileName(value) {
  if (!value) return '';
  return String(value).replace(/[\\/:*?"<>|]/g, '_').trim();
}

function getExtensionFromUrl(url) {
  if (!url) return '';
  try {
    const pathname = new URL(url, window.location.href).pathname;
    const lastSegment = pathname.split('/').pop() || '';
    const parts = lastSegment.split('.');
    const ext = parts.length > 1 ? parts.pop() : '';
    if (ext && ext.length <= 5) {
      return ext.toLowerCase();
    }
  } catch (error) {
    return '';
  }
  return '';
}

function getExtensionFromMime(mime) {
  if (!mime) return '';
  const parts = mime.split('/');
  if (parts.length !== 2) return '';
  const subtype = parts[1];
  if (!subtype) return '';
  return subtype.split(';')[0].toLowerCase();
}

function normalizeSearchText(value) {
  if (!value) return '';
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function playPronunciation(caseId, button) {
  if (!caseId || !button) return;

  if (!state.audioSupported) {
    notifyAudioUnsupported();
    return;
  }

  if (!checkAudioSupport()) {
    console.warn('当前浏览器不支持语音播报');
    markAudioUnsupported();
    notifyAudioUnsupported();
    return;
  }

  const caseItem = appCases.find(item => String(item.id) === String(caseId));
  if (!caseItem) return;

  const text = extractPronunciationText(caseItem);
  if (!text) {
    console.warn('未找到可播报的单词');
    showTemporaryButtonState(button, '暂无语音', 'fa-solid fa-circle-info');
    return;
  }

  resetActiveSpeech(button);

  const session = {
    button,
    text,
    remaining: AUDIO_REPEAT_COUNT,
  };

  activeSpeech = session;
  updateAudioButtonState(button, true);
  speakSession(session);
}

// Switch UI messaging when the browser lacks speech synthesis.
function markAudioUnsupported() {
  if (!state.audioSupported) return;
  state.audioSupported = false;
  state.audioSupportWarned = false;
  console.info('[main] Speech synthesis unavailable, enabling silent mode');
  renderCases();
}

function notifyAudioUnsupported() {
  if (state.audioSupportWarned) return;
  state.audioSupportWarned = true;
  showToast('当前浏览器不支持语音播报，可尝试使用最新版 Chrome 或 Edge。');
}

function resetActiveSpeech(newButton) {
  if (!activeSpeech) return;
  const { utterance, button } = activeSpeech;
  try {
    window.speechSynthesis.cancel();
  } catch (error) {
    console.warn('无法停止当前语音', error);
  }
  if (button && button !== newButton) {
    restoreAudioButton(button);
  }
  activeSpeech = null;
}

function restoreAudioButton(button) {
  if (!button) return;
  button.disabled = false;
  button.dataset.speaking = 'false';
  if (button.classList.contains('js-play-trigger')) return;
  button.innerHTML = '播放 <i class="fa-solid fa-volume-high ml-1.5"></i>';
  if (activeSpeech && activeSpeech.button === button) {
    activeSpeech = null;
  }
}

function updateAudioButtonState(button, isPlaying) {
  if (!button) return;
  button.disabled = isPlaying;
  button.dataset.speaking = isPlaying ? 'true' : 'false';
  if (button.classList.contains('js-play-trigger')) return;
  button.innerHTML = isPlaying ? '播放中 <i class="fa-solid fa-volume-high ml-1.5"></i>' : '播放 <i class="fa-solid fa-volume-high ml-1.5"></i>';
}

function showTemporaryButtonState(button, label, iconClass) {
  if (!button) return;
  const originalHtml = '播放 <i class="fa-solid fa-volume-high ml-1.5"></i>';
  if (button.classList.contains('js-play-trigger')) {
    button.classList.add('animate-pulse');
    setTimeout(() => {
      button.classList.remove('animate-pulse');
    }, 1200);
    return;
  }

  button.innerHTML = `${label} <i class="${iconClass} ml-1.5"></i>`;
  button.disabled = true;
  setTimeout(() => {
    restoreAudioButton(button);
    if (!button.classList.contains('js-play-trigger')) {
      button.innerHTML = originalHtml;
    }
  }, 1800);
}

function handleLoadMoreClick() {
  state.visibleCount += state.itemsPerPage;
  renderCases();
  scrollToLoadMoreAnchor();
}

function updateLoadMoreButton(totalCount) {
  if (!elements.loadMoreButton) return;
  if (!totalCount || state.visibleCount >= totalCount) {
    elements.loadMoreButton.classList.add('hidden');
    elements.loadMoreButton.disabled = true;
  } else {
    elements.loadMoreButton.classList.remove('hidden');
    elements.loadMoreButton.disabled = false;
  }
}

function scrollToLoadMoreAnchor() {
  if (!elements.loadMoreButton) return;
  elements.loadMoreButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetVisibleCount() {
  state.visibleCount = state.itemsPerPage;
}

function extractPronunciationText(caseItem) {
  if (!caseItem) return '';
  if (caseItem.audioText) return String(caseItem.audioText).trim();
  if (caseItem.word) return String(caseItem.word).trim();

  if (caseItem.category && caseItem.category.includes('字母')) {
    const fromPrompt = extractLetterFromPrompt(caseItem.prompt);
    if (fromPrompt) return fromPrompt;
    const fromTitle = extractLetterFromTitle(caseItem.title);
    if (fromTitle) return fromTitle;
  }

  if (caseItem.prompt) {
    const promptText = String(caseItem.prompt).trim();
    const separatorIndex = Math.max(promptText.lastIndexOf('：'), promptText.lastIndexOf(':'));
    if (separatorIndex !== -1) {
      const candidate = promptText.slice(separatorIndex + 1).trim();
      if (candidate) {
        return candidate;
      }
    }
  }

  if (caseItem.title) {
    const match = caseItem.title.match(/([A-Za-z][A-Za-z\s'-]*)$/);
    if (match) {
      const candidate = match[1].trim();
      return candidate.replace(/\bFlashcard\b/i, '').trim();
    }
  }

  return '';
}

function containsChinese(value) {
  if (!value) return false;
  return /[\u4e00-\u9fa5]/.test(value);
}

function extractLetterFromPrompt(prompt) {
  if (!prompt) return '';
  const promptText = String(prompt).trim();
  const separatorIndex = Math.max(promptText.lastIndexOf('：'), promptText.lastIndexOf(':'));
  const candidate = separatorIndex !== -1 ? promptText.slice(separatorIndex + 1).trim() : promptText;
  const match = candidate.match(/[A-Za-z]/);
  return match ? match[0].toUpperCase() : '';
}

function extractLetterFromTitle(title) {
  if (!title) return '';
  const match = String(title).match(/[A-Za-z]/);
  return match ? match[0].toUpperCase() : '';
}

function speakSession(session) {
  if (!session) return;
  const { text, button } = session;
  const utterance = new SpeechSynthesisUtterance(text);
  session.utterance = utterance;
  utterance.lang = containsChinese(text) ? 'zh-CN' : 'en-US';
  utterance.rate = 0.95;
  utterance.onend = () => handleSpeechCompletion(session, false);
  utterance.onerror = () => {
    handleSpeechCompletion(session, true);
    markAudioUnsupported();
    notifyAudioUnsupported();
  };

  try {
    window.speechSynthesis.cancel();
  } catch (error) {
    console.warn('停止已有语音失败', error);
  }

  try {
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('语音播报失败', error);
    markAudioUnsupported();
    notifyAudioUnsupported();
    handleSpeechCompletion(session, true);
  }
}

function handleSpeechCompletion(session, hasError) {
  if (!session || activeSpeech !== session) return;

  if (hasError) {
    restoreAudioButton(session.button);
    activeSpeech = null;
    return;
  }

  session.remaining -= 1;

  if (session.remaining > 0) {
    updateAudioButtonState(session.button, true);
    // 重新创建 utterance 进行下一次播放
    setTimeout(() => {
      if (activeSpeech !== session) return;
      speakSession(session);
    }, 200);
  } else {
    restoreAudioButton(session.button);
    activeSpeech = null;
  }
}

function escapeHTML(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  return escapeHTML(value).replace(/`/g, '&#96;');
}

document.addEventListener('DOMContentLoaded', init);
