import user from "../models/user.js";
import bcrypt from "bcrypt";

// Creacion de los usuarios

export const registraruser= async(req,res)=>{
    try {
        const {usuario,password,email,telefono}=req.body;

        if (!usuario || !password || !email || !telefono){
            return res.status(400).json({message: "Todos los campos son obligatorios"});
        }

        //validar si el usuario ya existe
        const existeuser=await user.findOne({email});
        if(existeuser){
            return res.status(400).json({message: "Usuario ya esta registrado"});
        }
        // Encriptar la contraseña
        const saltRounds=10;
        const hashedPassword= await bcrypt.hash(password,saltRounds);
        // Crear el usuario en la base de datos
        const nuevousuario= new user({usuario,password:hashedPassword,email,telefono});
        await nuevousuario.save();
        res.status(201).json({message:"Usuario registrado con exito"});
    } catch (error) {
        res.status(500).json({message: "Error al registrar usuario", error:error.message});
    }
};

