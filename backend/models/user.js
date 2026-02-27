import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 10 },
  email: { type: String, required: true, unique: true },
  telefono: { type: Number, required: true, minlength: 10 },
 rol: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
},
  // Campos para recuperación de contraseña
  codigoRecuperacion: String,
  expiracionCodigo:  Date 
});

const users = mongoose.model('users', userSchema, "users");

export default users;

