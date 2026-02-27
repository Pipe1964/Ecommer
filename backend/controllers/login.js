import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../models/user.js";

export const loginusuario=async (req,res)=> {
    try {
        const {email,password}=req.body;

        //  Validamos loc campos esten presentes
        if(!email || !password ){
            return res.status(400).json({message: "correo y contraseña obligatorios"});
        }
        // Buscar el usuario en la base de datos

        const usuario = await user.findOne ({email});
        if (!usuario){
            return res.status(404).json({message:"usuario no encontrado"});
        }
        // Comparar contraseña encriptada en la BD
        
        const passwordvalida= await bcrypt.compare(password,usuario.password);
        if (!passwordvalida){
            return res.status(401).json({message:"contraseña incorrecta"});
        }

        //generamos el token JWT con el rol incluido
        const token = jwt.sign(
            {
                id: usuario._id,
                rol: usuario.rol,

            },
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
        );

        // Validacion de inicio de sesio exitoso

      res.status(200).json({
    message: "Inicio de sesión correcto",
    usuario: {
        id: usuario._id,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
    },
    token // <-- aquí envías el token
});


    } catch (error) {
        res.status(500).json({message:"error al iniciar sesion",error:error.message});
    }
}