import Productos from "../models/Productos.js";

// Crear el producto

export const crearProducto= async(req,res)=>{
        try {
        const { productID, nombre, descripcion, precio, image } = req.body;

        const newProduct = new Productos({
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

// Actualizar producto
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const productoActualizado = await Productos.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto actualizado", productoActualizado });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const productoEliminado = await Productos.findByIdAndDelete(id);

    if (!productoEliminado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};


