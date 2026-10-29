import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { authService, type SessionData } from '@/services/auth.service';

type AuthContextType = {
  session: SessionData | null;
  loading: boolean;
  login: (employeeCode: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const sessionData = await authService.getSession();
        setSession(sessionData);
      } catch (error) {
        console.error('Error al recuperar la sesión:', error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  const login = async (employeeCode: string, password: string): Promise<void> => {
    const isValid = await authService.validateCredentials(employeeCode, password);
    if (!isValid) {
      throw new Error('Credenciales inválidas');
    }

    await authService.saveSession(employeeCode);
    const sessionData = await authService.getSession();
    setSession(sessionData);
  };

  const logout = async (): Promise<void> => {
    await authService.clearSession();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
