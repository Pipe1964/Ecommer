import express from 'express';
import cors from 'cors';
import "./db/db.js";
import productosroute from "./routes/Productos.js";
import userRouter from "./routes/user.js";
import { loginusuario } from './controllers/login.js';  
import obtenerperfil from './routes/perfil.js';
import recuperarpassword from './routes/recuperar.js';



//habilitar express
const app =express();
//habilitar las rutas
app.use(cors());
app.use(express.json());

//primera ruta
app.get("/",(req,res)=>{
    res.send('Bienvenido al curso de node express');
});

app.use("/api/productos",productosroute)
app.use("/api/user",userRouter);
app.use("/api/login",loginusuario);
app.use("/api/perfil",obtenerperfil );
app.use("/api/recuperar",recuperarpassword );

app.listen(8081,()=> console.log('servidor corriendo en http://localhost:8081'));