import React, {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  loading: boolean;
}

interface UserData {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<UserData>({} as UserData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber:token',
        '@GoBarber:user',
      ]);
      if (token[1] && user[1])
        setData({ token: token[1], user: JSON.parse(user[1]) });
      setLoading(false);
    }
    loadData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post<UserData>('sessions', {
      email,
      password,
    });
    const { token, user } = response.data;
    await AsyncStorage.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)],
    ]);
    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber:token', '@GoBarber:user']);
    setData({} as UserData);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider!');
  else return context;
}