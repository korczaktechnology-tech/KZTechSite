(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const apiBase = () => document.querySelector('meta[name="api-base"]')?.content?.trim() || window.KZ_API_BASE || '';

  const toggle = $('.nav-toggle');
  const nav = $('#main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    nav.addEventListener('click', event => {
      if (event.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Abrir menu');
      }
    });
  }

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  document.querySelectorAll('.media-slot img').forEach(img => {
    const markMissing = () => img.classList.add('is-missing');
    img.addEventListener('error', markMissing, { once: true });
    if (img.complete && img.naturalWidth === 0) markMissing();
  });

  const setStatus = (form, message, type = '') => {
    const status = $('.form-status', form);
    if (!status) return;
    status.className = `form-status ${type}`.trim();
    status.textContent = message;
  };

  document.querySelectorAll('form[data-api]').forEach(form => form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = $('button[type="submit"]', form);
    const originalLabel = button?.textContent || '';
    if (button) { button.disabled = true; button.textContent = 'Enviando…'; }
    setStatus(form, 'Enviando…');
    try {
      const response = await fetch(apiBase() + form.dataset.api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok || !json.success) throw new Error(json?.error?.message || 'Não foi possível concluir a operação.');
      if (json.data?.token) localStorage.setItem('kz_session', json.data.token);
      setStatus(form, form.dataset.success || 'Operação concluída com sucesso.', 'success');
      form.reset();
      form.dispatchEvent(new CustomEvent('kz:success', { detail: json.data }));
    } catch (error) {
      setStatus(form, error.message || 'Ocorreu um erro. Tente novamente.', 'error');
    } finally {
      if (button) { button.disabled = false; button.textContent = originalLabel; }
    }
  }));

  const token = localStorage.getItem('kz_session');
  const accountStatus = $('[data-account-status]');
  if (token && accountStatus) {
    fetch(apiBase() + '/api/v1/me', { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
      .then(async response => {
        const json = await response.json().catch(() => ({}));
        if (!response.ok || !json.success) throw new Error('Sessão expirada.');
        accountStatus.textContent = `Sessão ativa para ${json.data.name}.`;
        accountStatus.classList.add('success');
      })
      .catch(() => {
        localStorage.removeItem('kz_session');
        accountStatus.textContent = 'Nenhuma sessão ativa.';
      });
  }

  document.querySelectorAll('[data-logout]').forEach(button => button.addEventListener('click', () => {
    localStorage.removeItem('kz_session');
    window.location.reload();
  }));
})();
