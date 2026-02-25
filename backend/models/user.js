import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 10 },
  email: { type: String, required: true, unique: true },
  telefono: { type: Number, required: true, minlength: 10 },
  
  // Campos para recuperación de contraseña
  codigoRecuperacion: { type: String },
  expiracionCodigo: { type: Date }
});

const user = mongoose.model('user', userSchema, "user");

export default user;