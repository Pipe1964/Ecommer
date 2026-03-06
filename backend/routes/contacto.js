import express from "express";
import { enviarContacto } from "../controllers/contacto.js";

const router = express.Router();

router.post("/", enviarContacto);

export default router;