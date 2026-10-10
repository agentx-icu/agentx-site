(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-lang-toggle]');
  const supported = ['en', 'zh'];
  const queryLang = new URLSearchParams(window.location.search).get('lang');
  const browserLang = (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
  const savedLang = localStorage.getItem('agentx-lang');
  const initial = supported.includes(queryLang) ? queryLang : (supported.includes(savedLang) ? savedLang : browserLang);

  function setLanguage(lang, updateUrl = true) {
    const next = supported.includes(lang) ? lang : 'en';
    root.dataset.lang = next;
    root.lang = next === 'zh' ? 'zh-Hans' : 'en';
    localStorage.setItem('agentx-lang', next);
    if (toggle) {
      toggle.textContent = next === 'zh' ? 'EN' : '中文';
      toggle.setAttribute('aria-label', next === 'zh' ? '切换到英文' : 'Switch to Simplified Chinese');
    }
    if (updateUrl && history.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', next);
      history.replaceState({}, '', url);
    }
  }

  setLanguage(initial, false);
  toggle?.addEventListener('click', () => setLanguage(root.dataset.lang === 'zh' ? 'en' : 'zh'));
  document.getElementById('year').textContent = new Date().getFullYear();
})();
