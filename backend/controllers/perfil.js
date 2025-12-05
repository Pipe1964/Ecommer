import user from "../models/user.js";
export const obtenerperfil = async(req,res)=>{
    try {
        const {email} = req.body;
        
        if(!email){
            return res.status(400).json({message:"Email es requerido"});
        }

        const usuario = await user.findOne({email: email}).select('-password');
        
        if(!usuario){
            return res.status(404).json({message:"Usuario no encontrado"});
        }

        res.status(200).json({
            usuario:{
                id: usuario._id,
                usuario: usuario.usuario,
                email: usuario.email,
                telefono: usuario.telefono
            }
        });

    } catch (error) {
        res.status(500).json({
            message:"Error al obtener el perfil", 
            error: error.message
        });
    }
}

// Actualizar perfil de usuario
export const actualizarperfil = async(req,res)=>{
    try {
        const {email,telefono}=req.body;

        // validar campos
        if(!email){
            return res.status(400).json({message:"email es requerido"});
        }
            
            if(!telefono ){
                return res.status(400).json({message:"todos lo campos son obligatorios"});
            }   
        
        // buscar y actualizar el usuario
        const usuarioactualizado = await user.findOneAndUpdate(
            {email:email},
            {telefono:telefono},
            
            {new:true}
            //no va seleccionar el campo password
        ).select('-password');

        if(!usuarioactualizado){
            return res.status(404).json({message:"usuario no encontrado"});
        }
        res.status(200).json({
            message:"perfil actualizado correctamente",
            usuario:{
               
                email:usuarioactualizado.email,
                telefono: usuarioactualizado.telefono
            }
        })
    } catch (error) {
        res.status(500).json({
            message:"error al actualizar el perfil", error:error.message
        })
    }
}

export const eliminarperfil = async(req,res)=>{
    try {
        const {email}=req.body;

        // validar campos
        if(!email){
            return res.status(400).json({message:"email es obligatorio"});
        }
        // buscar y eliminar el usuario
        const usuarioeliminado = await user.findOneAndDelete({
            email:email
        });
        if(!usuarioeliminado){
            return res.status(404).json({message:"usuario no encontrado"});
        }
        res.status(200).json({
            message:"usuario eliminado correctamente",
            usuario:{
                id: usuarioeliminado._id,
                email:usuarioeliminado.email,
                
            }
        });
    } catch (error) {
        res.status(500).json({
            message:"error al eliminar el perfil", error:error.message      
        });
    }
};