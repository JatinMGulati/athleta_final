export function getOrCreateDeviceToken(): string {
  if (typeof window === 'undefined') return '';
  try {
    let t = localStorage.getItem('athleta_device_token');
    if (t && t.trim()) return t;
    // Use the browser-provided UUID generator when available
    t = typeof crypto?.randomUUID === 'function'
      ? crypto.randomUUID()
      : 'dev-' + Date.now().toString(36) + Math.random().toString(36).slice(2);
    try { localStorage.setItem('athleta_device_token', t); } catch {}
    return t;
  } catch {
    // If localStorage throws, return a generated fallback token (not persisted)
    return typeof crypto?.randomUUID === 'function'
      ? crypto.randomUUID()
      : 'dev-' + Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
}

export function createAndStoreNonce(kind: 'success' | 'error'): string {
  if (typeof window === 'undefined') return '';
  const key = kind === 'success' ? 'athleta_last_success' : 'athleta_last_error';
  const n = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
  try { sessionStorage.setItem(key, n); } catch {}
  return n;
}

export function validateRVUEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return /@rvu\.edu\.in$/i.test(email);
}
