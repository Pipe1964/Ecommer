import express from 'express';
import { solicitarcodigo, cambiarpassword } from '../controllers/recuperar.js';

const router = express.Router();

router.post('/solicitar-codigo', solicitarcodigo);
router.post('/cambiar-password', cambiarpassword);

export default router;