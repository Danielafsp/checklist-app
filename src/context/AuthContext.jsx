import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : { isAuthenticated: false };
  });

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  const login = (email, role = "client") => {
    setAuth({
      isAuthenticated: true,
      role,
      user: { email },
    });
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth({ isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
