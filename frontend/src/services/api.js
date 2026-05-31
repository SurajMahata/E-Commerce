import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const http = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
  try {
    const response = await http({
      url: path,
      method: options.method || "GET",
      data: options.body ? JSON.parse(options.body) : options.data,
      headers: options.headers
    });
    return response.data || null;
  } catch (error) {
    const data = error.response?.data;
    const message = data?.message || (data && Object.values(data).join(", ")) || error.message || "Something went wrong";
    throw new Error(message);
  }
}

export const authApi = {
  register: (payload) => api("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  login: (payload) => api("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  updatePassword: (payload) => api("/users/password", { method: "PUT", body: JSON.stringify(payload) })
};

export const userApi = {
  me: () => api("/users/me"),
  updateProfile: (payload) => api("/users/me", { method: "PUT", body: JSON.stringify(payload) })
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

export const addressApi = {
  all: () => api("/addresses"),
  create: (payload) => api("/addresses", { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => api(`/addresses/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (id) => api(`/addresses/${id}`, { method: "DELETE" }),
  setDefault: (id) => api(`/addresses/${id}/default`, { method: "PATCH" })
};

export const wishlistApi = {
  all: () => api("/wishlist"),
  add: (productId) => api("/wishlist", { method: "POST", body: JSON.stringify({ productId }) }),
  remove: (id) => api(`/wishlist/${id}`, { method: "DELETE" })
};
