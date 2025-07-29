import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null) // ✅ Named export


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store the logged-in user

  const login = (userData) => {
    setUser(userData); // Save user details after login
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
