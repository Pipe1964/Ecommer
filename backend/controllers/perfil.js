
//importamos el modelo de la base de datos
import user from "../models/user.js";

//obtener perfil de tal usuario de la base de datos

export const obtenerperfil = async(req,res)=>{
    try {
        const {email}=req.body;
        if(!email){
            return res.status(400).json({message:"email es requerido"});
        }
        //traer correo de la base datos
        const usuario = await user.findOne({email:email}).select('-password');
        if(!usuario){
            return res.status(400).json({message:"usuario no encontrado"});
        }
        res. status(200).json({
            usuario:{
                id: usuario._id,
            email:usuario.email,
            telefono:usuario.telefono
            }
        })
    } catch (error) {
        res.status(500).json({
            message:"error al obtener el perfil", error:error.message
        })
            
    }
}