const getApiBase = () => {
  if (typeof window !== "undefined") {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
    return `${baseUrl}/api`;
  }
  return (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080") + "/api";
};

async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("gw_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${getApiBase()}${path}`, { ...options, headers });
  if (res.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem("gw_token");
    localStorage.removeItem("gw_user");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }));
    throw { response: { status: res.status, data: err } };
  }
  return res.json();
}

const api = {
  get: (path: string, opts?: { params?: Record<string, any> }) => {
    let url = path;
    if (opts?.params) {
      const p = new URLSearchParams();
      Object.entries(opts.params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
      });
      const qs = p.toString();
      if (qs) url += "?" + qs;
    }
    return request(url);
  },
  post: (path: string, body?: any) =>
    request(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: (path: string, body?: any) =>
    request(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: (path: string) =>
    request(path, { method: "DELETE" }),
};

export default api;
