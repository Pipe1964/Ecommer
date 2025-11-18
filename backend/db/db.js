import mongoose from "mongoose";
const uri ="mongodb+srv://pipe1964:Martin1964*@ecommer.xnod9vd.mongodb.net/Tienda?retryWrites=true&w=majority";
mongoose.connect(uri)
.then(()=> console.log("✅ conectado a la base de datos"))
.catch(err => console.log("❌ error al conectar a la base de datos",err));