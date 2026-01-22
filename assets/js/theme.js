// 主题切换脚本，自动跟随系统，支持手动切换和本地记忆
(function() {
  const THEME_KEY = 'kopsdoc-theme';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const body = document.body;

  function updateThemeIcon() {
    var icon = document.getElementById('theme-toggle-icon');
    if (!icon) return;
    if (body.classList.contains('theme-dark')) {
      icon.className = 'ti ti-sun-high';
    } else {
      icon.className = 'ti ti-moon-stars';
    }
  }

  // 修改 setTheme 以便每次切换主题时更新图标
  function setTheme(theme) {
    body.classList.remove('theme-dark', 'theme-light');
    if (theme === 'dark') {
      body.classList.add('theme-dark');
    } else if (theme === 'light') {
      body.classList.add('theme-light');
    }
    updateThemeIcon();
  }

  function getSystemTheme() {
    return prefersDark.matches ? 'dark' : 'light';
  }

  function getSavedTheme() {
    return localStorage.getItem(THEME_KEY);
  }

  function applyTheme() {
    const saved = getSavedTheme();
    setTheme(saved || getSystemTheme());
  }

  // 监听系统主题变化
  prefersDark.addEventListener('change', function() {
    if (!getSavedTheme()) applyTheme();
  });

  // 切换按钮逻辑
  window.toggleTheme = function() {
    const current = body.classList.contains('theme-dark') ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    
    // 动画反馈
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.style.transform = 'scale(0.95)';
      setTimeout(function() {
        btn.style.transform = '';
      }, 150);
    }
  };

  // 初始化
  applyTheme();
  updateThemeIcon();
})();