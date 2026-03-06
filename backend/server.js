import express  from "express";
import cors     from "cors";
import dotenv   from "dotenv";
import "./db/db.js";

import userRoutes      from "./routes/user.js";
import loginRoutes     from "./routes/login.js";
import recuperarRoutes from "./routes/recuperar.js";
import productosRoutes from "./routes/Productos.js";
import perfilRoutes    from "./routes/perfil.js";
import pedidosRoutes   from "./routes/pedidos.js";
import adminRoutes     from "./routes/admin.js";
import contactoRoutes from "./routes/contacto.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 8081;

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10mb" }));   // limite alto para imágenes Base64
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/users",     userRoutes);
app.use("/api/login",     loginRoutes);
app.use("/api/recuperar", recuperarRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/perfil",    perfilRoutes);
app.use("/api/pedidos",   pedidosRoutes);
app.use("/api/admin",     adminRoutes);
app.use("/api/contacto", contactoRoutes);

// Health check
app.get("/", (req, res) => res.json({ message: "🚀 TechStore API funcionando" }));

app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));