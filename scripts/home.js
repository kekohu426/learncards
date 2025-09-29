document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');

  function applyTheme(theme) {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.warn('[home] 无法保存主题首选项', error);
    }
    syncThemeToggleIcon();
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  }

  function syncThemeToggleIcon() {
    if (!themeToggle || !themeToggleIcon) return;
    const isDark = document.documentElement.classList.contains('dark');
    themeToggleIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    themeToggle.setAttribute('aria-label', isDark ? '切换到亮色模式' : '切换到暗色模式');
  }

  syncThemeToggleIcon();
  themeToggle?.addEventListener('click', toggleTheme);
});
