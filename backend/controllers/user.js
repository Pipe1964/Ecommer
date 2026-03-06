import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../models/user.js";

export const registraruser = async (req, res) => {
  try {
    const { usuario, password, email, telefono } = req.body;

    if (!usuario || !password || !email || !telefono)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    if (password.length < 6)
      return res.status(400).json({ message: "La contrasena debe tener al menos 6 caracteres" });

    const existeUser = await user.findOne({ $or: [{ email }, { usuario }] });
    if (existeUser)
      return res.status(400).json({ message: "El email o usuario ya esta registrado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new user({ usuario, password: hashedPassword, email, telefono, rol: "user" });
    await nuevoUsuario.save();

    const token = jwt.sign(
      { id: nuevoUsuario._id, usuario: nuevoUsuario.usuario, rol: nuevoUsuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Usuario registrado con exito",
      token,
      usuario: {
        id:       nuevoUsuario._id,
        usuario:  nuevoUsuario.usuario,
        email:    nuevoUsuario.email,
        telefono: nuevoUsuario.telefono,
        rol:      nuevoUsuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar usuario", error: error.message });
  }
};

// Obtener todos los usuarios (solo admin)
export const obtenerTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await user.find().select("-password").sort({ _id: -1 });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};