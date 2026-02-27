import express from "express";
import { verificarToken, soloAdmin } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get("/dashboard", verificarToken, soloAdmin, (req, res) => {
    res.json({
        message: "✅ Bienvenido al panel administrador",
        admin: {
            nombre: req.usuario.Nombre,
            email: req.usuario.Gmail,
            rol: req.usuario.rol

        }
    });
});

export default router;