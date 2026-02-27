// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// verifica el token y consulta el usuario actualizado en BD
export const verificarToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"]; // ← Cambiar a "headers" (plural)

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token requerido"});
        }

        const token = authHeader.split(" ")[1];

        //Decodifica el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // consulta el usuario actualizado en la BD (por si cambio su rol o fue eliminado)
        const usuario = await User.findById(decoded.id).select("-Password");
        if (!usuario) {
            return res.status(401).json({ message: "usuario no encontrado"});
        }

        //Guardamos el usuario completo en req para usarlo en los controladores
        req.usuario = usuario;
        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirado, inicia secion nuevamente"});
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Token invalido"});
        }
        res.status(500).json({ message: "Error en la autenticacion", error: error.message });
    }
};

// solo administradores 
export const soloAdmin = (req, res, next) => {
    if (req.usuario?.rol !== "admin") {
        return res.status(403).json({ message: "Acceso denegado: se requiere rol admin"});
    }
    next();
};

// solo usuarios
export const soloUser = (req, res, next) => {
    if (req.usuario?.rol !== "user") {
        return res.status(403).json({ message: "Acceso denegado: se requiere rol user"});
    }
    next();
};