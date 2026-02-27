import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // Aquí luego irá tu axios al backend
    if (email === "admin@test.com" && password === "1234") {
      setUser({ email, rol: "admin" });
    } else if (email === "user@test.com" && password === "1234") {
      setUser({ email, rol: "user" });
    } else {
      throw new Error("Credenciales incorrectas");
    }
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

export const useAuth = () => {
  return useContext(AuthContext);
};