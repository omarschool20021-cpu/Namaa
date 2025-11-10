import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { IntroAnimation } from '../components/IntroAnimation';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, name: string) => Promise<boolean>;
  signup: (username: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showIntro, setShowIntro] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('namaa-current-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIntroComplete(true);
    } else {
      const hasVisited = localStorage.getItem('namaa-visited');
      if (!hasVisited) {
        setShowIntro(true);
        localStorage.setItem('namaa-visited', 'true');
      } else {
        setIntroComplete(true);
      }
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setIntroComplete(true);
  };

  const signup = async (username: string, password: string, name: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('namaa-users') || '{}');
    
    if (users[username]) {
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      name
    };
    
    users[username] = { ...newUser, password };
    localStorage.setItem('namaa-users', JSON.stringify(users));
    localStorage.setItem('namaa-current-user', JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  const login = async (username: string, password: string, name: string = ''): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('namaa-users') || '{}');
    const userRecord = users[username];
    
    if (!userRecord || userRecord.password !== password) {
      return false;
    }
    
    const loggedInUser: User = {
      id: userRecord.id,
      username: userRecord.username,
      name: userRecord.name
    };
    
    localStorage.setItem('namaa-current-user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('namaa-current-user');
    setUser(null);
  };

  if (showIntro && !introComplete) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
