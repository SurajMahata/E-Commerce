import { createContext, useContext, useMemo, useState } from "react";
import { authApi, clearSession, getStoredUser, setSession } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());

  async function register(payload) {
    const session = await authApi.register(payload);
    setSession(session);
    setUser(session);
    return session;
  }

  async function login(payload) {
    const session = await authApi.login(payload);
    setSession(session);
    setUser(session);
    return session;
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  const value = useMemo(() => ({ user, isAdmin: user?.role === "ADMIN", register, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
