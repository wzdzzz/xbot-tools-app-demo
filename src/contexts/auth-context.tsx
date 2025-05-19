import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider= ({ children }: {children: React.ReactNode}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    // 检查是否已登录
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [])

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  }

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) throw new Error("useAuth must be used within a AuthProvider");

  return ctx;
}
