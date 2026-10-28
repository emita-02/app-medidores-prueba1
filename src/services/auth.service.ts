import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'medidores_session';

export const DEMO_CREDENTIALS = {
  employeeCode: 'EMP-001',
  password: 'clave123',
};

export type SessionData = {
  employeeCode: string;
  authenticatedAt: number;
};

export const authService = {
  async saveSession(employeeCode: string): Promise<void> {
    const session: SessionData = {
      employeeCode,
      authenticatedAt: Date.now(),
    };
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
  },

  async getSession(): Promise<SessionData | null> {
    const value = await SecureStore.getItemAsync(SESSION_KEY);
    if (!value) return null;
    try {
      return JSON.parse(value) as SessionData;
    } catch {
      return null;
    }
  },

  async clearSession(): Promise<void> {
    await SecureStore.deleteItemAsync(SESSION_KEY);
  },

  async validateCredentials(
    employeeCode: string,
    password: string,
  ): Promise<boolean> {
    return (
      employeeCode === DEMO_CREDENTIALS.employeeCode &&
      password === DEMO_CREDENTIALS.password
    );
  },
};
