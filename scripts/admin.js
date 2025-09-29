(function () {
  // Admin dashboard powered by Supabase APIs.
  const THEME_KEY = 'admin-theme';
  const API_BASE_URL = (() => {
    if (window.__FLASHCARD_API_BASE__) return window.__FLASHCARD_API_BASE__;
    if (window.location.port === '4000') return '/api';
    const isFileProtocol = window.location.protocol === 'file:';
    const hostFallback = isFileProtocol ? 'localhost' : window.location.hostname || 'localhost';
    return `${isFileProtocol ? 'http:' : window.location.protocol}//${hostFallback}:4000/api`;
  })();
  const ADMIN_TOKEN_STORAGE_KEY = 'flashcard-admin-token';

  // Reactive state that drives all admin interactions.
  const state = {
    cases: [],
    categories: [],
    selectedCategory: null,
    searchQuery: '',
    cardSearchQuery: '',
    isUploading: false,
    selectedCardIds: new Set(),
    invites: [],
  };

  const elements = {
    themeToggle: document.getElementById('admin-theme-toggle'),
    themeIcon: document.getElementById('admin-theme-icon'),
    uploadCategory: document.getElementById('upload-category'),
    uploadForm: document.getElementById('upload-form'),
    uploadInput: document.getElementById('upload-input'),
    uploadSubmit: document.getElementById('upload-submit'),
    uploadStatus: document.getElementById('upload-status'),
    cardsContainer: document.getElementById('cards-container'),
    categoryGrid: document.getElementById('category-grid'),
    selectedCategory: document.getElementById('selected-category'),
    categorySearch: document.getElementById('category-search'),
    cardSearch: document.getElementById('card-search'),
    addCategoryForm: document.getElementById('add-category-form'),
    addCategoryInput: document.getElementById('add-category-input'),
    categoryList: document.getElementById('category-list'),
    adminTokenInput: document.getElementById('admin-token-input'),
    saveAdminTokenButton: document.getElementById('save-admin-token'),
    clearAdminTokenButton: document.getElementById('clear-admin-token'),
    adminTokenStatus: document.getElementById('admin-token-status'),
    selectionToolbar: document.getElementById('card-selection-toolbar'),
    selectionSummary: document.getElementById('selection-summary'),
    selectionClear: document.getElementById('selection-clear'),
    selectionDelete: document.getElementById('selection-delete'),
    inviteList: document.getElementById('invite-list'),
    inviteForm: document.getElementById('invite-form'),
    inviteCount: document.getElementById('invite-count'),
    invitePrefix: document.getElementById('invite-prefix'),
    inviteExpires: document.getElementById('invite-expires'),
    inviteNotes: document.getElementById('invite-notes'),
  };

  let adminToken = loadAdminToken();

  init();

  async function init() {
    await hydrateFromApi();
    refreshCategoryViews();
    renderCards();
    updateSelectionToolbar();
    syncThemeIcon();
    syncAdminTokenUI();

    elements.themeToggle?.addEventListener('click', toggleTheme);
    elements.categorySearch?.addEventListener('input', handleCategorySearch);
    elements.categoryGrid?.addEventListener('click', handleCategoryClick);
    elements.selectedCategory?.addEventListener('click', handleSelectedCategoryClick);
    elements.cardSearch?.addEventListener('input', handleCardSearch);
    elements.uploadForm?.addEventListener('submit', handleUploadForm);
    elements.cardsContainer?.addEventListener('click', handleCardActions);
    elements.cardsContainer?.addEventListener('change', handleCardSelectionChange);
    elements.addCategoryForm?.addEventListener('submit', handleAddCategory);
    elements.categoryList?.addEventListener('click', handleCategoryManageActions);
    elements.saveAdminTokenButton?.addEventListener('click', handleSaveAdminToken);
    elements.clearAdminTokenButton?.addEventListener('click', handleClearAdminToken);
    elements.selectionClear?.addEventListener('click', handleSelectionClear);
    elements.selectionDelete?.addEventListener('click', handleSelectionDelete);
    elements.inviteForm?.addEventListener('submit', handleInviteCreate);
    elements.inviteList?.addEventListener('click', handleInviteListActions);
  }

  // Fetch the latest categories and cards from the backend service.
  async function hydrateFromApi() {
    try {
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
        state.categories = categoryPayload.categories
          .filter(item => item && item.id != null && item.name)
          .map(item => ({ id: item.id, name: String(item.name).trim() }))
          .sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
      }

      if (Array.isArray(cardPayload?.cards)) {
        state.cases = cardPayload.cards
          .map(item => ({ ...item }))
          .filter(item => item && item.imageUrl)
          .map(item => ({
            ...item,
            category: item.category || '',
            categoryId: item.categoryId ?? null,
          }));
        state.cases.sort((a, b) => {
          const left = Number.parseInt(a.id, 10);
          const right = Number.parseInt(b.id, 10);
          if (Number.isNaN(left) || Number.isNaN(right)) {
            return String(a.title || '').localeCompare(String(b.title || ''), 'zh-Hans-CN');
          }
          return left - right;
        });
        syncSelectionWithCases();
      }

      console.info('[admin] 数据已同步', {
        categories: state.categories.length,
        cards: state.cases.length,
      });
      await loadInvites();
    } catch (error) {
      console.warn('加载远程数据失败，将保留当前页面上的临时数据。', error);
    }
    updateSelectionToolbar();
  }

  function loadAdminToken() {
    try {
      return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || '';
    } catch (error) {
      console.warn('读取管理员令牌失败', error);
      return '';
    }
  }

  function saveAdminToken(value) {
    adminToken = value || '';
    try {
      if (adminToken) {
        localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, adminToken);
      } else {
        localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
      }
    } catch (error) {
      console.warn('保存管理员令牌失败', error);
    }
    syncAdminTokenUI();
    loadInvites();
  }

  function syncAdminTokenUI() {
    if (elements.adminTokenInput) {
      elements.adminTokenInput.value = adminToken;
    }
    if (elements.adminTokenStatus) {
      elements.adminTokenStatus.textContent = adminToken ? '已保存' : '未设置';
      elements.adminTokenStatus.className = adminToken
        ? 'text-xs text-emerald-600 dark:text-emerald-400'
        : 'text-xs text-slate-400 dark:text-slate-500';
    }
  }

  function handleSaveAdminToken() {
    const value = elements.adminTokenInput?.value.trim();
    saveAdminToken(value);
    alert('管理员令牌已更新');
  }

  function handleClearAdminToken() {
    if (!confirm('确定清除管理员令牌吗？清除后无法执行删除操作。')) return;
    saveAdminToken('');
  }

  function buildAuthorizedHeaders(extra = {}) {
    const headers = { Accept: 'application/json', ...extra };
    if (adminToken) {
      headers['x-admin-token'] = adminToken;
    }
    return headers;
  }

  function populateCategoryOptions() {
    if (!elements.uploadCategory) return;
    const options = state.categories
      .map(category => `<option value="${escapeHtmlAttr(category.name)}">${escapeHtml(category.name)}</option>`)
      .join('');
    elements.uploadCategory.innerHTML = `<option value="" disabled selected>请选择分类</option>${options}`;
  }

  function renderCategoryGrid() {
    if (!elements.categoryGrid) return;
    const query = state.searchQuery;
    const filtered = !query
      ? state.categories
      : state.categories.filter(c => c.name.toLowerCase().includes(query));

    if (!filtered.length) {
      elements.categoryGrid.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-8 text-slate-500 dark:text-slate-400">
          <i class="fa-solid fa-search mb-2 text-2xl"></i>
          <p>未找到分类</p>
        </div>
      `;
      return;
    }

    const buttons = filtered
      .map(category => {
        const isSelected = state.selectedCategory === category.name;
        const base = 'px-3 py-2 text-sm rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400';
        const active = 'bg-blue-500 text-white shadow-sm';
        const inactive = 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600';
        return `<button type="button" data-category="${escapeHtmlAttr(category.name)}" class="${base} ${
          isSelected ? active : inactive
        }">${escapeHtml(category.name)}</button>`;
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
        ${escapeHtml(state.selectedCategory)}
        <button
          type="button"
          data-action="remove-category"
          class="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors duration-200 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700"
        >
          <i class="fa-solid fa-times text-[10px]"></i>
        </button>
      </span>
      <button
        type="button"
        data-action="clear-category"
        class="ml-4 inline-flex items-center text-xs text-slate-500 transition-colors duration-200 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <i class="fa-solid fa-xmark mr-1"></i>
        清除选择
      </button>
    `;
  }

  // Render card tiles inside the admin grid view.
  function renderCards() {
    if (!elements.cardsContainer) return;
    const list = getVisibleCases();

    if (!list.length) {
      elements.cardsContainer.innerHTML = `
        <div class="col-span-full rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <i class="fa-solid fa-box-open text-2xl"></i>
          </div>
          <h3 class="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">暂无学习卡片</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400">尝试调整搜索词或切换分类。</p>
        </div>
      `;
      return;
    }

    const cards = list
      .map(caseItem => {
        const cover = caseItem.__previewUrl || caseItem.previewImageUrl || caseItem.imageUrl || '';
        const isSelected = state.selectedCardIds.has(String(caseItem.id));
        return `
          <div class="flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
            <div class="relative h-48 bg-slate-100 dark:bg-slate-900">
              <img src="${escapeHtmlAttr(cover)}" alt="${escapeHtmlAttr(caseItem.title)}" class="h-full w-full object-contain" loading="lazy" />
              <span class="absolute left-3 top-3 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                ${escapeHtml(caseItem.category || '未分类')}
              </span>
              <label class="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-2 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/80 dark:text-slate-200">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-slate-300 text-blue-500 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-800"
                  data-card-select="true"
                  data-id="${escapeHtmlAttr(caseItem.id)}"
                  ${isSelected ? 'checked' : ''}
                />
                选择
              </label>
            </div>
            <div class="flex flex-1 flex-col p-4 text-sm">
              <h3 class="mb-2 line-clamp-1 text-base font-semibold text-slate-800 dark:text-slate-100">${escapeHtml(caseItem.title)}</h3>
              <p class="mb-3 line-clamp-2 whitespace-pre-wrap text-slate-600 dark:text-slate-300">${escapeHtml(caseItem.prompt || '')}</p>
              <div class="mt-auto flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  class="inline-flex items-center rounded-lg bg-amber-500 px-3 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  data-action="edit-card"
                  data-id="${escapeHtmlAttr(caseItem.id)}"
                >
                  编辑
                  <i class="fa-solid fa-pen ml-1"></i>
                </button>
                <button
                  type="button"
                  class="inline-flex items-center text-xs text-slate-500 transition-colors duration-200 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  data-action="copy-data"
                  data-id="${escapeHtmlAttr(caseItem.id)}"
                >
                  复制数据
                  <i class="fa-solid fa-copy ml-1"></i>
                </button>
                <button
                  type="button"
                  class="inline-flex items-center rounded-lg bg-red-500 px-3 py-1 text-xs font-semibold text-white transition-colors duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                  data-action="delete"
                  data-id="${escapeHtmlAttr(caseItem.id)}"
                >
                  删除
                  <i class="fa-solid fa-trash ml-1"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    elements.cardsContainer.innerHTML = cards;
    updateSelectionToolbar();
  }

  function getVisibleCases() {
    const query = state.cardSearchQuery;
    let list = state.cases;

    if (state.selectedCategory) {
      list = list.filter(item => item.category === state.selectedCategory);
    }

    if (query) {
      const keywords = query.split(/\s+/).filter(Boolean);
      if (keywords.length) {
        list = list.filter(item => {
          const haystack = `${item.title || ''} ${item.prompt || ''}`.toLowerCase();
          return keywords.every(keyword => haystack.includes(keyword));
        });
      }
    }

    return list;
  }

  function handleCategorySearch(event) {
    state.searchQuery = event.target.value.trim().toLowerCase();
    renderCategoryGrid();
  }

  function handleCategoryClick(event) {
    const button = event.target.closest('button[data-category]');
    if (!button) return;
    const category = button.getAttribute('data-category');
    state.selectedCategory = state.selectedCategory === category ? null : category;
    clearCardSelection();
    renderCategoryGrid();
    renderSelectedCategory();
    renderCards();
  }

  function handleSelectedCategoryClick(event) {
    const actionButton = event.target.closest('button[data-action]');
    if (!actionButton) return;
    const action = actionButton.getAttribute('data-action');
    if (action === 'remove-category' || action === 'clear-category') {
      state.selectedCategory = null;
      clearCardSelection();
      renderCategoryGrid();
      renderSelectedCategory();
      renderCards();
    }
  }

  function handleCardSearch(event) {
    state.cardSearchQuery = event.target.value.trim().toLowerCase();
    renderCards();
  }

  // Upload selected files to Supabase Storage + cards table.
  async function handleUploadForm(event) {
    event.preventDefault();

    if (state.isUploading) return;

    const category = elements.uploadCategory?.value;
    const files = elements.uploadInput?.files;

    if (!category) {
      alert('请先选择分类');
      return;
    }

    if (!files || !files.length) {
      alert('请选择要上传的图片');
      return;
    }

    if (!adminToken) {
      alert('请先在系统设置中填写管理员令牌。');
      elements.adminTokenInput?.focus();
      return;
    }

    const total = files.length;
    setUploadState(true, `正在上传 ${total} 张图片，请稍候…`);

    const metadata = Array.from(files).map(file => buildCardMetadata(file, category));
    const formData = new FormData();
    formData.append('category', category);
    formData.append('metadata', JSON.stringify(metadata));
    Array.from(files).forEach(file => formData.append('files', file));

    try {
      console.info('[admin] 开始上传', { category, fileCount: total });
      const response = await fetch(`${API_BASE_URL}/cards/upload`, {
        method: 'POST',
        headers: buildAuthorizedHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const payload = await safeParseJson(response);
        const detail = payload?.details ? `（${payload.details}）` : '';
        const message = payload?.message || '上传失败，请稍后再试。';
        throw new Error(`${message}${detail}`);
      }

      await hydrateFromApi();
      refreshCategoryViews();
      renderCards();
      console.info('[admin] 上传完成', { category, fileCount: total });
      alert('上传成功，已同步到数据库。');
    } catch (error) {
      console.error('上传学习卡片失败', error);
      alert(`上传失败：${error.message}`);
    } finally {
      setUploadState(false);
      if (elements.uploadForm) {
        elements.uploadForm.reset();
        if (elements.uploadCategory) {
          elements.uploadCategory.selectedIndex = 0;
        }
      }
    }
  }

  function handleCardActions(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = button.getAttribute('data-id');
    if (!id) return;

    const action = button.getAttribute('data-action');
    if (action === 'delete') {
      handleDelete(id);
    }
    if (action === 'edit-card') {
      handleEditCard(id);
    }
    if (action === 'copy-data') {
      copyCardData(id, button);
    }
  }

  function handleCardSelectionChange(event) {
    const checkbox = event.target.closest('input[data-card-select]');
    if (!checkbox) return;
    const id = checkbox.getAttribute('data-id');
    if (!id) return;

    if (checkbox.checked) {
      state.selectedCardIds.add(String(id));
    } else {
      state.selectedCardIds.delete(String(id));
    }
    updateSelectionToolbar();
  }

  function handleSelectionClear() {
    if (!state.selectedCardIds.size) return;
    clearCardSelection();
    renderCards();
  }

  async function handleSelectionDelete() {
    if (!state.selectedCardIds.size) {
      alert('请先选择需要删除的学习卡片');
      return;
    }

    if (!adminToken) {
      alert('请先在系统设置中填写管理员令牌。');
      elements.adminTokenInput?.focus();
      return;
    }

    const ids = Array.from(state.selectedCardIds);
    if (!confirm(`确定删除选中的 ${ids.length} 张学习卡片吗？删除后将立即同步到数据库。`)) return;

    const originalLabel = elements.selectionDelete?.innerHTML;
    if (elements.selectionDelete) {
      elements.selectionDelete.disabled = true;
      elements.selectionDelete.dataset.busy = 'true';
      elements.selectionDelete.innerHTML = '删除中… <i class="fa-solid fa-spinner fa-spin ml-1"></i>';
    }

    const failed = [];

    try {
      console.info('[admin] 开始批量删除学习卡片', { count: ids.length });
      for (const id of ids) {
        try {
          const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
            method: 'DELETE',
            headers: buildAuthorizedHeaders(),
          });

          if (!response.ok) {
            const payload = await safeParseJson(response);
            const message = payload?.message || '删除失败';
            failed.push({ id, message });
          }
        } catch (error) {
          failed.push({ id, message: error.message });
        }
      }

      await hydrateFromApi();
      refreshCategoryViews();
      renderCards();
      clearCardSelection();

      if (failed.length) {
        const info = failed
          .map(item => `#${item.id}: ${item.message}`)
          .slice(0, 5)
          .join('\n');
        alert(`部分学习卡片删除失败，共 ${failed.length} 条：\n${info}`);
        console.warn('[admin] 批量删除部分失败', failed);
      } else {
        console.info('[admin] 批量删除完成');
        alert('选中的学习卡片已全部删除');
      }
    } finally {
      if (elements.selectionDelete) {
        elements.selectionDelete.disabled = false;
        elements.selectionDelete.innerHTML = originalLabel || '批量删除';
        delete elements.selectionDelete.dataset.busy;
      }
      updateSelectionToolbar();
    }
  }

  async function handleEditCard(id) {
    if (!adminToken) {
      alert('请先在系统设置中填写管理员令牌。');
      elements.adminTokenInput?.focus();
      return;
    }

    const card = state.cases.find(item => String(item.id) === String(id));
    if (!card) {
      alert('未找到对应学习卡片');
      return;
    }

    const nextTitle = prompt('请输入学习卡片标题', card.title || '');
    if (nextTitle === null) return;
    const titleTrimmed = nextTitle.trim();
    if (!titleTrimmed) {
      alert('标题不能为空');
      return;
    }

    const nextPrompt = prompt('请输入提示文案（可留空）', card.prompt || '');
    if (nextPrompt === null) return;
    const promptTrimmed = nextPrompt.trim();

    const nextAudio = prompt('请输入播报文本（留空可清除）', card.audioText || '');
    if (nextAudio === null) return;
    const audioTrimmed = nextAudio.trim();

    const categoryInput = prompt('请输入分类名称（留空表示未分类）', card.category || '');
    if (categoryInput === null) return;
    const categoryTrimmed = categoryInput.trim();

    const payload = {};
    if (titleTrimmed !== (card.title || '')) {
      payload.title = titleTrimmed;
    }
    if (promptTrimmed !== (card.prompt || '')) {
      payload.prompt = promptTrimmed;
    }
    const normalizedAudio = audioTrimmed || null;
    if ((normalizedAudio || '') !== (card.audioText || '')) {
      payload.audioText = normalizedAudio;
    }

    if (categoryTrimmed) {
      const targetCategory = state.categories.find(item => item.name === categoryTrimmed);
      if (!targetCategory) {
        alert('分类不存在，请先在右侧新增分类后再尝试。');
        return;
      }
      if (card.categoryId !== targetCategory.id) {
        payload.categoryId = targetCategory.id;
      }
    } else if (card.categoryId !== null) {
      payload.categoryId = null;
    }

    if (!Object.keys(payload).length) {
      alert('未检测到任何修改');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: 'PATCH',
        headers: buildAuthorizedHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await safeParseJson(response);
        const message = result?.message || '更新学习卡片失败';
        throw new Error(message);
      }

      await hydrateFromApi();
      refreshCategoryViews();
      renderCards();
      alert('学习卡片已更新');
    } catch (error) {
      console.error('更新学习卡片失败', error);
      alert(`更新失败：${error.message}`);
    }
  }

  async function handleDelete(id) {
    if (!adminToken) {
      alert('请先在系统设置中填写管理员令牌。');
      elements.adminTokenInput?.focus();
      return;
    }

    if (!confirm('确定删除该学习卡片吗？删除后将立即同步到数据库。')) return;

    const target = state.cases.find(item => String(item.id) === String(id));
    const previewUrl = target?.__previewUrl;

    try {
      const response = await fetch(`${API_BASE_URL}/cards/${id}`, {
        method: 'DELETE',
        headers: buildAuthorizedHeaders(),
      });

      if (!response.ok) {
        const payload = await safeParseJson(response);
        const message = payload?.message || '删除失败，请稍后重试。';
        throw new Error(message);
      }

      await hydrateFromApi();
      renderCards();
      renderCategoryList();
      renderCategoryGrid();
      renderSelectedCategory();
      state.selectedCardIds.delete(String(id));
      updateSelectionToolbar();
      alert('已删除学习卡片');
    } catch (error) {
      console.error('删除学习卡片失败', error);
      alert(`删除失败：${error.message}`);
    } finally {
      if (previewUrl) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch (error) {
          console.warn('释放预览资源失败', error);
        }
      }
    }
  }

  async function safeParseJson(response) {
    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  function buildCardMetadata(file, category) {
    const fileName = file.name;
    const baseTitle = removeExtension(fileName);

    return {
      title: generateTitleFromFile(baseTitle, category),
      prompt: generatePromptFromFile(baseTitle, category),
      audioText: generateAudioTextFromFile(baseTitle, category),
    };
  }

  function removeExtension(filename) {
    return filename.replace(/\.[^/.]+$/, '');
  }

  function generateTitleFromFile(base, category) {
    if (category.includes('英文')) {
      return `${toTitleCase(base)} Flashcard`;
    }
    return `${base}`;
  }

  function generatePromptFromFile(base, category) {
    if (category.includes('英文动物卡')) {
      return `英文动物学习卡：${toTitleCase(base)}`;
    }
    if (category.includes('英文水果卡')) {
      return `英文水果学习卡：${toTitleCase(base)}`;
    }
    if (category.includes('英文人物卡')) {
      return `英文人物学习卡：${toTitleCase(base)}`;
    }
    if (category.includes('英文交通工具卡')) {
      return `英文交通工具学习卡：${toTitleCase(base)}`;
    }
    if (category.includes('字母卡')) {
      return `英文字母学习卡：${extractLetter(base)}`;
    }
    if (category.includes('汉字')) {
      return `汉字学习卡：${base}`;
    }
    return base;
  }

  function generateAudioTextFromFile(base, category) {
    if (!category.includes('字母卡')) {
      return null;
    }
    const upper = base.trim().toUpperCase();
    if (/^[A-Z]$/.test(upper)) {
      return upper;
    }
    return null;
  }

  function toTitleCase(value) {
    if (!value) return '';
    return value
      .replace(/[-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase()
      .replace(/(^|\s)([a-z])/g, (_, space, char) => space + char.toUpperCase());
  }

  function extractLetter(value) {
    if (!value) return '';
    const match = String(value).match(/[a-zA-Z]/);
    return match ? match[0].toUpperCase() : String(value).slice(0, 1).toUpperCase();
  }

  function copyCardData(id, button) {
    const card = state.cases.find(item => String(item.id) === String(id));
    if (!card) return;
    const text = JSON.stringify(card, null, 2);
    navigator.clipboard
      .writeText(text)
      .then(() => {
        button.innerHTML = '已复制 <i class="fa-solid fa-check ml-1"></i>';
        setTimeout(() => {
          button.innerHTML = '复制数据 <i class="fa-solid fa-copy ml-1"></i>';
        }, 1600);
      })
      .catch(() => alert('复制失败，请检查浏览器权限'));
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    const nextTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(nextTheme);
    localStorage.setItem(THEME_KEY, nextTheme);
    syncThemeIcon();
  }

  function syncThemeIcon() {
    if (!elements.themeIcon) return;
    const isDark = document.documentElement.classList.contains('dark');
    elements.themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  async function handleAddCategory(event) {
    event.preventDefault();
    const value = elements.addCategoryInput?.value.trim();
    if (!value) return;

    if (!adminToken) {
      alert('请先在系统设置中填写管理员令牌。');
      elements.adminTokenInput?.focus();
      return;
    }

    if (state.categories.some(item => item.name === value)) {
      alert('分类已存在，无需重复添加');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: buildAuthorizedHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ name: value }),
      });

      if (!response.ok) {
        const payload = await safeParseJson(response);
        const message = payload?.message || '创建分类失败';
        throw new Error(message);
      }

      const payload = await response.json();
      if (payload?.category) {
        state.categories.push({ id: payload.category.id, name: payload.category.name });
        state.categories.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));
        refreshCategoryViews();
      }

      if (elements.addCategoryInput) {
        elements.addCategoryInput.value = '';
      }

      alert('分类已添加');
    } catch (error) {
      console.error('创建分类失败', error);
      alert(`创建分类失败：${error.message}`);
    }
  }

  async function loadInvites() {
    if (!adminToken) {
      state.invites = [];
      renderInviteList();
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/invites`, {
        headers: buildAuthorizedHeaders(),
      });

      if (!response.ok) {
        throw new Error('加载邀请码失败');
      }

      const payload = await response.json();
      state.invites = Array.isArray(payload?.invites) ? payload.invites : [];
      renderInviteList();
    } catch (error) {
      console.warn('无法加载邀请码', error);
      state.invites = [];
      renderInviteList();
    }
  }

  function renderInviteList() {
    if (!elements.inviteList) return;
    if (!state.invites.length) {
      elements.inviteList.innerHTML = '<p class="text-sm text-slate-400">暂无邀请码，点击下方按钮生成。</p>';
      return;
    }

    const rows = state.invites.map(invite => {
      const statusLabel = invite.status === 'active' ? 'bg-emerald-100 text-emerald-700' : invite.status === 'used' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600';
      const expires = invite.expires_at ? new Date(invite.expires_at).toLocaleString() : '永久有效';
      const usage = `${invite.used_count || 0} / ${invite.max_uses || 1}`;
      const disabled = invite.status !== 'active' ? 'disabled:opacity-60 disabled:cursor-not-allowed' : '';
      return `
        <div class="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center justify-between">
            <span class="font-semibold tracking-widest text-slate-800 dark:text-slate-100">${escapeHtml(invite.code)}</span>
            <span class="rounded-full px-2 py-0.5 text-xs font-semibold ${statusLabel}">${invite.status === 'active' ? '可用' : invite.status === 'used' ? '已使用' : '已失效'}</span>
          </div>
          <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span>有效期：${expires}</span>
            <span>使用次数：${usage}</span>
            ${invite.used_by_phone ? `<span>绑定手机号：${escapeHtml(invite.used_by_phone)}</span>` : ''}
          </div>
          ${invite.notes ? `<p class="text-xs text-slate-500 dark:text-slate-300">备注：${escapeHtml(invite.notes)}</p>` : ''}
          <div class="flex items-center justify-end gap-3">
            <button
              type="button"
              class="copy-invite rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-200"
              data-code="${escapeHtmlAttr(invite.code)}"
            >复制</button>
            <button
              type="button"
              class="expire-invite rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-500 transition-colors duration-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 ${disabled}"
              data-code="${escapeHtmlAttr(invite.code)}"
              ${invite.status !== 'active' ? 'disabled' : ''}
            >设为失效</button>
          </div>
        </div>
      `;
    });

    elements.inviteList.innerHTML = rows.join('');
  }

  async function handleInviteCreate(event) {
    event.preventDefault();
    if (!adminToken) {
      alert('请先配置管理员令牌');
      return;
    }

    const count = Number.parseInt(elements.inviteCount?.value || '1', 10) || 1;
    const prefix = (elements.invitePrefix?.value || '').trim();
    const expiresAt = elements.inviteExpires?.value ? new Date(elements.inviteExpires.value).toISOString() : null;
    const notes = (elements.inviteNotes?.value || '').trim() || null;

    try {
      const response = await fetch(`${API_BASE_URL}/invites`, {
        method: 'POST',
        headers: buildAuthorizedHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ count, prefix, expiresAt, notes, maxUses: 1 }),
      });

      if (!response.ok) {
        const payload = await safeParseJson(response);
        const message = payload?.message || '创建邀请码失败';
        throw new Error(message);
      }

      elements.inviteForm?.reset();
      await loadInvites();
      alert('邀请码已生成');
    } catch (error) {
      console.error('创建邀请码失败', error);
      alert(`创建邀请码失败：${error.message}`);
    }
  }

  async function handleInviteListActions(event) {
    const copyButton = event.target.closest('.copy-invite');
    if (copyButton) {
      const code = copyButton.getAttribute('data-code');
      navigator.clipboard
        .writeText(code)
        .then(() => {
          copyButton.textContent = '已复制';
          setTimeout(() => {
            copyButton.textContent = '复制';
          }, 1500);
        })
        .catch(() => alert('复制失败，请检查浏览器权限'));
      return;
    }

    const expireButton = event.target.closest('.expire-invite');
    if (expireButton) {
      const code = expireButton.getAttribute('data-code');
      if (!code) return;
      if (!confirm(`确定将邀请码 ${code} 标记为失效吗？`)) return;
      try {
        const response = await fetch(`${API_BASE_URL}/invites/${code}`, {
          method: 'PATCH',
          headers: buildAuthorizedHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ status: 'expired' }),
        });
        if (!response.ok) {
          const payload = await safeParseJson(response);
          const message = payload?.message || '更新失败';
          throw new Error(message);
        }
        await loadInvites();
        alert('已设为失效');
      } catch (error) {
        console.error('更新邀请码失败', error);
        alert(`更新失败：${error.message}`);
      }
    }
  }

  function handleCategoryManageActions(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const action = button.getAttribute('data-action');
    const categoryId = button.getAttribute('data-category-id');
    if (!categoryId) return;

    const category = state.categories.find(item => String(item.id) === categoryId);
    if (!category) return;

    if (action === 'rename-category') {
      if (!adminToken) {
        alert('请先在系统设置中填写管理员令牌。');
        elements.adminTokenInput?.focus();
        return;
      }

      const nextName = prompt('请输入新的分类名称', category.name);
      if (!nextName || !nextName.trim()) return;
      renameCategory(category.id, nextName.trim(), category.name);
      return;
    }

    if (action === 'delete-category') {
      if (!adminToken) {
        alert('请先在系统设置中填写管理员令牌。');
        elements.adminTokenInput?.focus();
        return;
      }

      if (!confirm(`确定删除分类「${category.name}」吗？分类下的学习卡片将移动到“未分类”。`)) return;
      deleteCategory(category.id, category.name);
    }
  }

  function renderCategoryList() {
    if (!elements.categoryList) return;
    if (!state.categories.length) {
      elements.categoryList.innerHTML = '<span class="text-slate-400">暂无分类</span>';
      return;
    }

    const chips = state.categories
      .map(category => `
        <span class="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
          ${escapeHtml(category.name)}
          <button
            type="button"
            data-action="rename-category"
            data-category-id="${escapeHtmlAttr(category.id)}"
            class="text-slate-400 transition-colors duration-200 hover:text-blue-500"
          >
            <i class="fa-solid fa-pen"></i>
          </button>
          <button
            type="button"
            data-action="delete-category"
            data-category-id="${escapeHtmlAttr(category.id)}"
            class="text-slate-400 transition-colors duration-200 hover:text-red-500"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </span>
      `)
      .join('');

    elements.categoryList.innerHTML = chips;
  }

  async function renameCategory(id, name, previousName) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PATCH',
        headers: buildAuthorizedHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const payload = await safeParseJson(response);
        const message = payload?.message || '更新分类失败';
        throw new Error(message);
      }

      await hydrateFromApi();
      if (previousName && state.selectedCategory === previousName) {
        state.selectedCategory = name;
      }
      refreshCategoryViews();
      renderCards();
      alert('分类已更新');
    } catch (error) {
      console.error('更新分类失败', error);
      alert(`更新分类失败：${error.message}`);
    }
  }

  async function deleteCategory(id, name) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: buildAuthorizedHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const payload = await safeParseJson(response);
        const message = payload?.message || '删除分类失败';
        throw new Error(message);
      }

      await hydrateFromApi();
      if (name && state.selectedCategory === name) {
        state.selectedCategory = null;
      }
      refreshCategoryViews();
      renderCards();
      alert('分类已删除');
    } catch (error) {
      console.error('删除分类失败', error);
      alert(`删除分类失败：${error.message}`);
    }
  }

  function refreshCategoryViews() {
    populateCategoryOptions();
    renderCategoryGrid();
    renderCategoryList();
    renderSelectedCategory();
    updateSelectionToolbar();
  }

  function clearCardSelection() {
    if (!state.selectedCardIds.size) return;
    state.selectedCardIds.clear();
    if (elements.cardsContainer) {
      elements.cardsContainer
        .querySelectorAll('input[data-card-select]')
        .forEach(input => {
          input.checked = false;
        });
    }
    updateSelectionToolbar();
  }

  function updateSelectionToolbar() {
    if (!elements.selectionToolbar) return;
    const count = state.selectedCardIds.size;
    if (count <= 0) {
      elements.selectionToolbar.classList.add('hidden');
      if (elements.selectionSummary) {
        elements.selectionSummary.textContent = '已选择 0 张学习卡片';
      }
      if (elements.selectionDelete) {
        elements.selectionDelete.disabled = true;
        delete elements.selectionDelete.dataset.busy;
      }
      if (elements.selectionClear) {
        elements.selectionClear.disabled = true;
      }
      return;
    }

    elements.selectionToolbar.classList.remove('hidden');
    if (elements.selectionSummary) {
      elements.selectionSummary.textContent = `已选择 ${count} 张学习卡片`;
    }
    if (elements.selectionDelete && elements.selectionDelete.dataset.busy !== 'true') {
      elements.selectionDelete.disabled = false;
    }
    if (elements.selectionClear) {
      elements.selectionClear.disabled = false;
    }
  }

  function syncSelectionWithCases() {
    if (!state.selectedCardIds.size) return;
    const validIds = new Set(state.cases.map(item => String(item.id)));
    let changed = false;
    [...state.selectedCardIds].forEach(id => {
      if (!validIds.has(id)) {
        state.selectedCardIds.delete(id);
        changed = true;
      }
    });
    if (changed) {
      updateSelectionToolbar();
    }
  }

  // Toggle upload button/notice state while async work is running.
  function setUploadState(isUploading, message = '') {
    state.isUploading = isUploading;

    if (elements.uploadSubmit) {
      if (!elements.uploadSubmit.dataset.defaultLabel) {
        elements.uploadSubmit.dataset.defaultLabel = elements.uploadSubmit.innerHTML;
      }
      elements.uploadSubmit.disabled = isUploading;
      if (isUploading) {
        elements.uploadSubmit.innerHTML = '上传中… <i class="fa-solid fa-spinner fa-spin ml-2"></i>';
      } else {
        elements.uploadSubmit.innerHTML = elements.uploadSubmit.dataset.defaultLabel;
      }
    }

    if (elements.uploadStatus) {
      if (isUploading) {
        elements.uploadStatus.textContent = message || '正在上传，请稍候…';
        elements.uploadStatus.classList.remove('hidden');
      } else {
        elements.uploadStatus.textContent = '';
        elements.uploadStatus.classList.add('hidden');
      }
    }
  }

  function escapeHtml(value) {
    if (value == null) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeHtmlAttr(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }
})();
