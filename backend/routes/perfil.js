import express from "express";
import { obtenerperfil, actualizarperfil, eliminarperfil } from "../controllers/perfil.js";


const router=express.Router();

router.post('/obtener',obtenerperfil);
router.put('/actualizar',actualizarperfil);
router.delete('/eliminar',eliminarperfil);
export default router;



