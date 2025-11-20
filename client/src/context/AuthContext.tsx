import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await api.get("/auth/me");
      setUser(res.data.data);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setUser(userData);
    toast.success("Logged in successfully");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    api.get("/auth/logout");
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
