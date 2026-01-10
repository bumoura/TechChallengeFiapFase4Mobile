import React, { createContext, useContext, useEffect, useState } from 'react';
import storage from '@/lib/storage';
import api from '@/lib/api';

type User = { id: string; name: string; role: 'professor'|'aluno' };

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean; 
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  token: null, 
  isLoading: true, 
  login: async()=>{}, 
  logout: async()=>{} 
});

type Theme = {
  colors: {
    primary: string;
    background: string;
    text: string;
  };
};
const defaultTheme: Theme = {
  colors: {
    primary: '#0B61FF',
    background: '#FFFFFF',
    text: '#000000',
  },
};
const ThemeContext = createContext<Theme>(defaultTheme);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', defaultTheme.colors.primary);
      root.style.setProperty('--color-background', defaultTheme.colors.background);
      root.style.setProperty('--color-text', defaultTheme.colors.text);
    }
  }, []);
  return <ThemeContext.Provider value={defaultTheme}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => useContext(ThemeContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => { 
    (async () => {
      try {
        const t = await storage.getItem('token');
        const u = await storage.getItem('user');
        if (t) setToken(t);
        if (u) setUser(JSON.parse(u));
      } catch (e) {
        console.error('Erro ao restaurar sessão:', e);
      } finally {
        setIsLoading(false);
      }
    })(); 
  }, []);

  const login = async (email: string, password: string) => {

    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    
    await storage.setItem('token', token);
    await storage.setItem('user', JSON.stringify(user));
    
    setToken(token); 
    setUser(user);
  };

  const logout = async () => {
    await storage.deleteItem('token');
    await storage.deleteItem('user');
    setToken(null); 
    setUser(null);
  };

  return (
    <ThemeProvider>
      <AuthContext.Provider value={{user, token, isLoading, login, logout}}>
        {children}
      </AuthContext.Provider>
    </ThemeProvider>
  );
};
export const useAuth = () => useContext(AuthContext);