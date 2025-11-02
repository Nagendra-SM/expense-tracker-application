import { createContext, useEffect, useState } from 'react';
import { useAuth as useAuthHook } from '../hooks/useAuth';

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { 
    user, 
    loading, 
    error, 
    signIn: signInHook, 
    signUp: signUpHook, 
    signOut: signOutHook 
  } = useAuthHook();
  const [initialLoading, setInitialLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    console.log('AuthProvider mounted, user:', user);
    setInitialLoading(false);
  }, [user]);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: signIn called');
    try {
      const user = await signInHook(email, password);
      console.log('AuthContext: signIn successful, user:', user);
      return user;
    } catch (error) {
      console.error('AuthContext: signIn error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('AuthContext: signUp called');
    try {
      const user = await signUpHook(email, password);
      console.log('AuthContext: signUp successful, user:', user);
      return user;
    } catch (error) {
      console.error('AuthContext: signUp error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('AuthContext: signOut called');
    try {
      await signOutHook();
      console.log('AuthContext: signOut successful');
    } catch (error) {
      console.error('AuthContext: signOut error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading: loading || initialLoading,
    error,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
}
