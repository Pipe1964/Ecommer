import exprees from 'express';
import { crearPedido } from "../controllers/pedidos.js";

const router = exprees.Router();

// crear un nuevo pedido
router.post('/', crearPedido);



export default router;


