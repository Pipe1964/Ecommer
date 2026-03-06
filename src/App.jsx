import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authcontext";
import { CartProvider } from "./context/cartcontext";
import Home from "./components/Pages/Home.jsx";
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";
import RecuperarContrasena from "./components/Auth/Recuperarcontrasena.jsx";
import AdminPanel from "./components/Pages/admin.jsx";
import Productos from "./components/Pages/Productos.jsx";
import Carrito from "./components/Pages/Carrito.jsx";
import Perfil from "./components/Pages/Perfil.jsx";
import Categorias from "./components/Pages/Categorias.jsx";
import Contacto from "./components/Pages/Contacto.jsx";

function RutaAdmin({ children }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div className="flex items-center justify-center min-h-screen text-gray-400">Cargando...</div>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.rol !== "admin") return <Navigate to="/" replace />;
  return children;
}

function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div className="flex items-center justify-center min-h-screen text-gray-400">Cargando...</div>;
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"                     element={<Home />} />
            <Route path="/login"                element={<Login />} />
            <Route path="/register"             element={<Register />} />
            <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
            <Route path="/productos"            element={<Productos />} />
            <Route path="/carrito"              element={<Carrito />} />
            <Route path="/categorias"           element={<Categorias />} />
            <Route path="/contacto"             element={<Contacto />} />
            <Route path="/perfil"               element={<RutaProtegida><Perfil /></RutaProtegida>} />
            <Route path="/admin"                element={<RutaAdmin><AdminPanel /></RutaAdmin>} />
            <Route path="*"                     element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;