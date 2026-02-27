//src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // <-- IMPORTAR AXIOS

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    const login = async (Gmail, Paswords) => {
        try {
            const response= await axios.post("http://localhost:8081/api/login", {
                Gmail: Gmail,
                Paswords: Paswords,
            });

            const data = response.data; // axios ya parsea el JSON automaticamente 

            // Guardamos y token en memoria
            setUsuario({
                ...data.usuario,
                token: data.token,
            });

            // Redirigimos segun el rol
            if (data.usuario.rol === "admin") {
                navigate("/admin");
            } else {
                navigate("/productos");
            }

        } catch (error) {
            // Manejo de errores con axios 
            if (error.response) {
                throw new Error(error.response.data.message || 'Error al iniciar sesión');
            } else if (error.request) {
                throw new Error('No se pudo conectar con el servidor');
            } else {
                throw new Error('Error al procesar la solicitud');
            }
        }
    };

    const logout = () => {
        setUsuario(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ usuario, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};