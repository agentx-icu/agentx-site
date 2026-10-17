(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-lang-toggle]');
  const supported = ['en', 'zh'];
  const meta = {
    en: {
      title: 'agentx.icu — Open tools for private communication',
      description: 'agentx.icu creates open-source, privacy-first communication tools: toxee, MorseCQ, and DitMesh.'
    },
    zh: {
      title: 'agentx.icu — 开源、隐私优先的通讯工具',
      description: 'agentx.icu 打造开源、隐私优先的通讯工具：toxee、MorseCQ 与 DitMesh。'
    }
  };

  // Storage can be missing or throw (private windows, blocked site data); the
  // page must still work without it.
  function load() {
    try { return localStorage.getItem('agentx-lang'); } catch (e) { return null; }
  }
  function save(lang) {
    try { localStorage.setItem('agentx-lang', lang); } catch (e) { /* ignore */ }
  }

  const queryLang = new URLSearchParams(window.location.search).get('lang');
  const browserLang = (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
  const savedLang = load();
  const initial = supported.includes(queryLang) ? queryLang : (supported.includes(savedLang) ? savedLang : browserLang);

  function setLanguage(lang, updateUrl = true) {
    const next = supported.includes(lang) ? lang : 'en';
    root.dataset.lang = next;
    root.lang = next === 'zh' ? 'zh-Hans' : 'en';
    document.title = meta[next].title;
    document.querySelector('meta[name="description"]').setAttribute('content', meta[next].description);
    // Each project site has /en/ and /zh/ pages; send visitors to the one in
    // the language they are reading.
    document.querySelectorAll('a[data-site]').forEach((a) => {
      a.href = new URL(next + '/', a.href.replace(/(en|zh)\/$/, '')).href;
    });
    if (toggle) {
      toggle.textContent = next === 'zh' ? 'EN' : '中文';
      toggle.setAttribute('aria-label', next === 'zh' ? 'Switch to English' : '切换到简体中文');
      toggle.setAttribute('lang', next === 'zh' ? 'en' : 'zh-Hans');
    }
    if (updateUrl) {
      save(next);
      if (history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', next);
        history.replaceState(history.state, '', url);
      }
    }
  }

  setLanguage(initial, false);
  if (supported.includes(queryLang)) save(queryLang);
  if (toggle) toggle.addEventListener('click', () => setLanguage(root.dataset.lang === 'zh' ? 'en' : 'zh'));
  document.getElementById('year').textContent = new Date().getFullYear();
})();
