
import mongoose from "mongoose";

const userSchema= new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  password: { type: String, required: true,minlenght:10 },
  email: {type:String, required:true},
  telefono: { type:Number, required:true,minlenght:12}
});

const user = mongoose.model('user', userSchema,"user");

export default user;