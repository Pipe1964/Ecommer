import express from "express";
import { obtenerperfil } from "../controllers/perfil.js";

const router=express.Router();

router.post('/obtener',obtenerperfil);

export default router;