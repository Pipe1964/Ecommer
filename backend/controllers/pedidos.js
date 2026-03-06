import pedidos from "../models/pedidos.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const formatPrice = (p) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p);

// Crear pedido + enviar email
export const crearPedido = async (req, res) => {
  try {
    const { userId, productos, nombreCliente, telefono, total } = req.body;

    if (!userId || !productos || productos.length === 0)
      return res.status(400).json({ message: "Faltan datos obligatorios" });

    const nuevoPedido = new pedidos({
      userId, productos, nombreCliente, telefono, total, estado: "pendiente",
    });
    await nuevoPedido.save();

    // Email de confirmacion al cliente (si tiene email en req.usuario)
    const emailCliente = req.usuario?.email;
    if (emailCliente) {
      const itemsHtml = productos
        .map((p) => `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;">${p.nombre}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center;">${p.cantidad}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right;">${formatPrice(p.precio * p.cantidad)}</td>
        </tr>`).join("");

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: emailCliente,
        subject: "Pedido recibido - TechStore Pro",
        html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
          <div style="text-align:center;margin-bottom:24px;">
            <h2 style="color:#4F46E5;margin:0;">TechStore Pro</h2>
          </div>
          <h3 style="color:#333;">Hola <strong>${nombreCliente}</strong>, tu pedido fue recibido! 🎉</h3>
          <p style="color:#666;">Estamos procesando tu pedido. Te notificaremos cuando este listo.</p>

          <table style="width:100%;border-collapse:collapse;margin:20px 0;">
            <thead>
              <tr style="background:#f8f8ff;">
                <th style="padding:10px 12px;text-align:left;color:#666;font-size:13px;">Producto</th>
                <th style="padding:10px 12px;text-align:center;color:#666;font-size:13px;">Cant.</th>
                <th style="padding:10px 12px;text-align:right;color:#666;font-size:13px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:16px 20px;border-radius:10px;text-align:right;margin-top:8px;">
            <span style="color:white;font-size:20px;font-weight:bold;">Total: ${formatPrice(total)}</span>
          </div>

          <p style="color:#999;font-size:13px;margin-top:24px;">
            Si tienes preguntas, contactanos. Gracias por comprar en TechStore Pro.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
          <p style="color:#ccc;font-size:12px;text-align:center;">&copy; 2025 TechStore Pro</p>
        </div>`,
      });
    }

    res.status(201).json({ message: "Pedido creado con exito", pedido: nuevoPedido });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ message: "Error al crear el pedido", error: error.message });
  }
};

// Obtener TODOS los pedidos (admin)
export const obtenerTodosPedidos = async (req, res) => {
  try {
    const todos = await pedidos.find().sort({ fecha: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedidos" });
  }
};

// Obtener pedidos de un usuario
export const obtenerpedidousuarioId = async (req, res) => {
  try {
    const { userId } = req.params;
    const pedidosUsuario = await pedidos.find({ userId }).sort({ fecha: -1 });
    res.json(pedidosUsuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener pedidos del usuario" });
  }
};

// Obtener un pedido por id
export const obtenerpedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await pedidos.findById(id);
    if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el pedido" });
  }
};

// Actualizar estado del pedido (admin)
export const actualizarEstadopedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pedidoActualizado = await pedidos.findByIdAndUpdate(
      id, { estado }, { new: true }
    );
    if (!pedidoActualizado) return res.status(404).json({ message: "Pedido no encontrado" });

    res.json({ message: "Estado actualizado", pedido: pedidoActualizado });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el estado" });
  }
};