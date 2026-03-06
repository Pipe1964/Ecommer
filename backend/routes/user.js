import express from "express";
import { registraruser, obtenerTodosUsuarios } from "../controllers/user.js";
import { verificarToken, soloAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registraruser);
router.get("/todos", verificarToken, soloAdmin, obtenerTodosUsuarios);

export default router;