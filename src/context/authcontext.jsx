import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("usuario");
    if (stored) { try { setUsuario(JSON.parse(stored)); } catch { localStorage.removeItem("usuario"); } }
    setCargando(false);
  }, []);
  const login = async (email, password) => {
    const res = await axios.post("http://localhost:8081/api/login", { email, password });
    const data = res.data;
    const u = { id: data.usuario.id, usuario: data.usuario.usuario, email: data.usuario.email, telefono: data.usuario.telefono, rol: data.usuario.rol, token: data.token };
    setUsuario(u);
    localStorage.setItem("usuario", JSON.stringify(u));
    return data;
  };
  const logout = () => { setUsuario(null); localStorage.removeItem("usuario"); };
  return <AuthContext.Provider value={{ usuario, login, logout, cargando }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
