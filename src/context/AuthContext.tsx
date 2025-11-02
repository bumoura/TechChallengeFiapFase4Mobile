import React, { createContext, useContext, useEffect, useState } from 'react';
import storage from '@/lib/storage';
import api from '@/lib/api';

type User = { id: string; name: string; role: 'professor'|'aluno' };
type AuthContextType = {
  user: User | null; token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType>({ user: null, token: null, login: async()=>{}, logout: async()=>{} });

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => { (async () => {
    const t = await storage.getItem('token');
    const u = await storage.getItem('user');
    if (t) setToken(t);
    if (u) setUser(JSON.parse(u));
  })(); }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    await storage.setItem('token', token);
    await storage.setItem('user', JSON.stringify(user));
    setToken(token); setUser(user);
  };

  const logout = async () => {
    await storage.deleteItem('token');
    await storage.deleteItem('user');
    setToken(null); setUser(null);
  };

  return <AuthContext.Provider value={{user, token, login, logout}}>{children}</AuthContext.Provider>
};
export const useAuth = () => useContext(AuthContext);
