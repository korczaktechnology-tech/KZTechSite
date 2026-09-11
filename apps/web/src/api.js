const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '');

export async function apiRequest(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${API_BASE}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, signal: controller.signal });
    const payload = await response.json().catch(() => ({ success: false, error: { code: 'INVALID_RESPONSE', message: 'Resposta inválida da API.' } }));
    if (!response.ok || payload.success === false) throw new Error(payload.error?.message || 'Não foi possível concluir a operação.');
    return payload;
  } finally { clearTimeout(timeout); }
}

export const sendContact = (data) => apiRequest('/api/v1/contacts', { method: 'POST', body: JSON.stringify(data) });
export const requestQuote = (data) => apiRequest('/api/v1/quotes', { method: 'POST', body: JSON.stringify(data) });
