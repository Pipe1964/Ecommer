import express from "express";
import { verificarToken, soloAdmin } from "../middlewares/authMiddleware.js";
import {
  crearPedido,
  obtenerTodosPedidos,
  obtenerpedidousuarioId,
  obtenerpedido,
  actualizarEstadopedido,
} from "../controllers/pedidos.js";

const router = express.Router();

// Crear pedido (usuario autenticado)
router.post("/", verificarToken, crearPedido);

// Obtener TODOS los pedidos (solo admin)
router.get("/todos", verificarToken, soloAdmin, obtenerTodosPedidos);

// Obtener pedidos de un usuario
router.get("/usuario/:userId", verificarToken, obtenerpedidousuarioId);

// Obtener un pedido por id
router.get("/:id", verificarToken, obtenerpedido);

// Actualizar estado (solo admin)
router.put("/:id/estado", verificarToken, soloAdmin, actualizarEstadopedido);

export default router;