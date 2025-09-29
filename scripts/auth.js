(function () {
  const STORAGE_KEY = 'flashcard-user-token';

  const state = {
    mode: 'login',
    token: null,
    profile: null,
  };

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
    trigger: document.getElementById('login-button'),
    modal: document.getElementById('auth-modal'),
    close: document.getElementById('auth-close'),
    tabLogin: document.getElementById('auth-tab-login'),
    tabRegister: document.getElementById('auth-tab-register'),
    form: document.getElementById('auth-form'),
    phone: document.getElementById('auth-phone'),
    invite: document.getElementById('auth-invite'),
    age: document.getElementById('auth-age'),
    registerFields: document.getElementById('auth-register-fields'),
    passwordRegister: document.getElementById('auth-password'),
    passwordConfirm: document.getElementById('auth-password-confirm'),
    passwordLogin: document.getElementById('auth-password-login'),
    message: document.getElementById('auth-message'),
    submit: document.getElementById('auth-submit'),
    badge: document.getElementById('auth-user-badge'),
    phoneLabel: document.getElementById('auth-user-phone'),
    logout: document.getElementById('logout-button'),
  };

  function normalizePhone(value) {
    return String(value || '')
      .replace(/\D/g, '')
      .replace(/^86/, '')
      .trim();
  }

  function setMode(mode) {
    state.mode = mode;
    const isRegister = mode === 'register';
    const activeClasses = 'rounded-md bg-white py-2 text-gray-800 shadow-sm transition-all dark:bg-gray-900 dark:text-gray-100';
    const inactiveClasses = 'rounded-md py-2 text-gray-500 transition-all hover:text-gray-800 dark:text-gray-300';
    if (elements.tabLogin) {
      elements.tabLogin.className = isRegister ? inactiveClasses : activeClasses;
    }
    if (elements.tabRegister) {
      elements.tabRegister.className = isRegister ? activeClasses : inactiveClasses;
    }
    elements.registerFields?.classList.toggle('hidden', !isRegister);
    document.getElementById('auth-login-password')?.classList.toggle('hidden', isRegister);
    elements.submit.textContent = isRegister ? '完成注册' : '完成登录';
  }

  function showModal(initialMode = 'login') {
    if (!elements.modal) return;
    setMode(initialMode);
    resetForm();
    elements.modal.classList.remove('hidden');
  }

  function hideModal() {
    if (!elements.modal) return;
    elements.modal.classList.add('hidden');
  }

  function resetForm() {
    elements.form?.reset();
    showMessage('');
  }

  function showMessage(text, tone = 'info') {
    if (!elements.message) return;
    const colors = {
      info: 'text-blue-600 dark:text-blue-300',
      error: 'text-red-600 dark:text-red-300',
      success: 'text-emerald-600 dark:text-emerald-300',
    };
    elements.message.className = `min-h-[1.5rem] text-sm ${colors[tone] || colors.info}`;
    elements.message.textContent = text || '';
  }

  function saveToken(token) {
    state.token = token;
    if (token) {
      localStorage.setItem(STORAGE_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function getAuthHeaders(extra = {}) {
    const headers = { 'Content-Type': 'application/json', ...extra };
    if (state.token) {
      headers.Authorization = `Bearer ${state.token}`;
    }
    return headers;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const phone = normalizePhone(elements.phone?.value);
    if (!phone) {
      showMessage('请填写手机号', 'error');
      return;
    }

    if (state.mode === 'register') {
      await handleRegister(phone);
    } else {
      await handleLogin(phone);
    }
  }

  async function handleRegister(phone) {
    const invite = (elements.invite?.value || '').trim().toUpperCase();
    const ageValue = elements.age?.value ? Number.parseInt(elements.age.value, 10) : null;
    const password = elements.passwordRegister?.value || '';
    const confirm = elements.passwordConfirm?.value || '';

    if (!invite) {
      showMessage('注册需要填写邀请码', 'error');
      return;
    }
    if (!password || password.length < 6) {
      showMessage('密码至少需要 6 位', 'error');
      return;
    }
    if (password !== confirm) {
      showMessage('两次输入的密码不一致', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, inviteCode: invite, childAge: ageValue }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || '注册失败');
      }

      const payload = await response.json();
      onAuthSuccess(payload);
      showMessage('注册成功', 'success');
      hideModal();
    } catch (error) {
      console.error('[auth] register failed', error);
      showMessage(error.message || '注册失败，请稍后再试', 'error');
    }
  }

  async function handleLogin(phone) {
    const password = elements.passwordLogin?.value || '';
    if (!password) {
      showMessage('请输入密码', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || '登录失败');
      }

      const payload = await response.json();
      onAuthSuccess(payload);
      showMessage('登录成功', 'success');
      hideModal();
    } catch (error) {
      console.error('[auth] login failed', error);
      showMessage(error.message || '登录失败，请稍后再试', 'error');
    }
  }

  function onAuthSuccess(payload) {
    if (!payload?.token) return;
    saveToken(payload.token);
    state.profile = payload.profile || null;
    updateUserBadge();
  }

  async function updateUserBadge() {
    if (!state.token) {
      elements.badge?.classList.add('hidden');
      elements.trigger?.classList.remove('hidden');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });

      if (!response.ok) {
        throw new Error('未登录');
      }

      const payload = await response.json();
      const profile = payload?.profile;
      state.profile = profile;
      const displayPhone = profile?.phone
        ? profile.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
        : '已登录';
      if (elements.phoneLabel) elements.phoneLabel.textContent = displayPhone;
      elements.badge?.classList.remove('hidden');
      elements.trigger?.classList.add('hidden');
    } catch (error) {
      console.warn('[auth] 获取用户信息失败', error);
      saveToken(null);
      elements.badge?.classList.add('hidden');
      elements.trigger?.classList.remove('hidden');
    }
  }

  function handleLogout() {
    saveToken(null);
    state.profile = null;
    elements.badge?.classList.add('hidden');
    elements.trigger?.classList.remove('hidden');
    showMessage('已退出登录', 'info');
  }

  function hydrateFromStorage() {
    const token = localStorage.getItem(STORAGE_KEY);
    if (token) {
      state.token = token;
      updateUserBadge();
    }
  }

  function bindEvents() {
    elements.trigger?.addEventListener('click', () => showModal('login'));
    elements.close?.addEventListener('click', hideModal);
    elements.modal?.addEventListener('click', event => {
      if (event.target === elements.modal) hideModal();
    });
    elements.tabLogin?.addEventListener('click', () => setMode('login'));
    elements.tabRegister?.addEventListener('click', () => setMode('register'));
    elements.form?.addEventListener('submit', handleSubmit);
    elements.logout?.addEventListener('click', handleLogout);
  }

  bindEvents();
  setMode('login');
  hydrateFromStorage();
})();
