function computeBase() {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const isLocal = /localhost|127\.0\.0\.1/i.test(raw);
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    const originIsLocal = /localhost|127\.0\.0\.1/i.test(origin);
    // On production hosts, prefer same-origin API if env is empty or local
    if ((!raw || isLocal) && !originIsLocal) {
      return `${origin}/api`;
    }
  }
  const base = raw ? (raw.endsWith('/api') ? raw : `${raw.replace(/\/$/, '')}/api`) : '/api';
  return base;
}

export const api = {
  async get(path, init) {
    const base = computeBase();
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const res = await fetch(`${base}${path}`, {
      credentials: "include",
      ...(init || {}),
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(init?.headers || {}) },
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `GET ${path} failed (HTTP ${res.status})`);
    }
    return res.json();
  },
  async post(path, body, init) {
    const base = computeBase();
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const res = await fetch(`${base}${path}`, {
      method: "POST",
      credentials: "include",
      ...(init || {}),
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(init?.headers || {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `POST ${path} failed (HTTP ${res.status})`);
    }
    return res.json();
  },
  async patch(path, body, init) {
    const base = computeBase();
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const res = await fetch(`${base}${path}`, {
      method: "PATCH",
      credentials: "include",
      ...(init || {}),
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(init?.headers || {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `PATCH ${path} failed (HTTP ${res.status})`);
    }
    return res.json();
  },
};


