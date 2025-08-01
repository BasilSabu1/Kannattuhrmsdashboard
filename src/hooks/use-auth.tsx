import { useState, useEffect, createContext, useContext } from "react";

interface User {
  id: string;
  email: string;
  role: 'admin' | 'hr';
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  showTokenExpiredAlert: boolean;
  setShowTokenExpiredAlert: (show: boolean) => void;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTokenExpiredAlert, setShowTokenExpiredAlert] = useState(false);

  useEffect(() => {
    // Check for existing auth on mount
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    
    console.log("useAuth useEffect - token:", token ? "exists" : "not found");
    console.log("useAuth useEffect - userData:", userData);

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log("useAuth useEffect - parsed user:", parsedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Listen for token expiration events
  useEffect(() => {
    const handleTokenExpired = (event: CustomEvent) => {
      console.log("Token expired event received:", event.detail);
      setUser(null);
      setIsAuthenticated(false);
      setShowTokenExpiredAlert(true);
    };

    window.addEventListener("tokenExpired", handleTokenExpired as EventListener);

    return () => {
      window.removeEventListener("tokenExpired", handleTokenExpired as EventListener);
    };
  }, []);

  const login = (token: string, userData: User) => {
    console.log("useAuth login called with:", { token, userData });
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setShowTokenExpiredAlert(false);
    console.log("useAuth login completed, isAuthenticated set to true");
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin_data");
    localStorage.removeItem("hr_data");
    setUser(null);
    setIsAuthenticated(false);
    setShowTokenExpiredAlert(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        showTokenExpiredAlert,
        setShowTokenExpiredAlert,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 