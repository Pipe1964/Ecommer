import express from "express";
import { loginusuario } from "../controllers/login.js";

const router=express.Router();

// la ruta

router.post("/",loginusuario);

export default router;