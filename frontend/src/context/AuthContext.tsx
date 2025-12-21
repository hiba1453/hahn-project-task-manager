import React, { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client';

export type AuthUser = {
  id?: number;
  email: string;
  fullName?: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('taskflow_token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('taskflow_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  const persist = (t: string, u: AuthUser) => {
    localStorage.setItem('taskflow_token', t);
    localStorage.setItem('taskflow_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    // expected: { token, user?: {id,email,fullName} }
    const t = res.data?.token as string;
    const u = (res.data?.user || { email }) as AuthUser;
    persist(t, u);
  };

  const register = async (email: string, password: string, fullName: string) => {
    const res = await api.post('/auth/register', { email, password, fullName });
    const t = res.data?.token as string;
    const u = (res.data?.user || { email, fullName }) as AuthUser;
    persist(t, u);
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
