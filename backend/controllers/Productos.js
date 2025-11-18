import Productos from "../models/Productos.js";

// Crear el producto

export const crearProducto= async(req,res)=>{
        try {
        const { productID, nombre, descripcion, precio, image } = req.body;

        const newProduct = new productos({
            productID,
            nombre,
            descripcion,
            precio,
            image,
        });

        await newProduct.save();

        res.status(201).json({ message: "Producto guardado con éxito" });

    } catch (error) {
        console.error("Error al guardar el producto:", error.message);

        res.status(400).json({ message: "Error al ingresar el producto" });
    }
};

//traer los datos de la base de datos

export const obtenerProductos=async (req,res)=>{
    try {
        const listarproductos =await Productos.find();
    res.json(listarproductos);
    } catch (error) {
     res.status(500).json({message:"Error al obtener los productos"});   
    }
    
}


export default Productos;
