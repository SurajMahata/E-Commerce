const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export function getToken() {
  return localStorage.getItem("jwtToken") || localStorage.getItem("shopverse_token");
}

export function setSession(session) {
  if (!session?.token) {
    throw new Error("JWT token was not returned by the server");
  }
  localStorage.setItem("jwtToken", session.token);
  localStorage.setItem("shopverse_token", session.token);
  localStorage.setItem("shopverse_user", JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("shopverse_token");
  localStorage.removeItem("shopverse_user");
}

export function getStoredUser() {
  const raw = localStorage.getItem("shopverse_user");
  return raw ? JSON.parse(raw) : null;
}

export async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    let message = "Something went wrong";
    try {
      const data = await response.json();
      message = data.message || Object.values(data).join(", ");
    } catch {
      message = await response.text();
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const authApi = {
  register: (payload) => api("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => api("/auth/login", { method: "POST", body: JSON.stringify(payload) })
};

export const productApi = {
  all: (params = "") => api(`/products${params}`),
  one: (id) => api(`/products/${id}`),
  create: (payload) => api("/products", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => api(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => api(`/products/${id}`, { method: "DELETE" })
};

export const cartApi = {
  get: () => api("/cart"),
  add: (payload) => api("/cart", { method: "POST", body: JSON.stringify(payload) }),
  update: (itemId, quantity) => api(`/cart/${itemId}?quantity=${quantity}`, { method: "PATCH" }),
  remove: (itemId) => api(`/cart/${itemId}`, { method: "DELETE" })
};

export const orderApi = {
  all: () => api("/orders"),
  checkout: (payload) => api("/orders/checkout", { method: "POST", body: JSON.stringify(payload) }),
  cancel: (id) => api(`/orders/${id}/cancel`, { method: "PATCH" })
};
