export const api = {
  async get(path, init) {
    const raw = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const base = raw.endsWith('/api') ? raw : `${raw.replace(/\/$/, '')}/api`;
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
    const raw = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const base = raw.endsWith('/api') ? raw : `${raw.replace(/\/$/, '')}/api`;
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
    const raw = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const base = raw.endsWith('/api') ? raw : `${raw.replace(/\/$/, '')}/api`;
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


