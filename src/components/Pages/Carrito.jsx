import { useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { useCart } from "../../context/cartcontext";
import { useAuth } from "../../context/authcontext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Layout/Navbar.jsx";
import Footer from "../Layout/Footer.jsx";

export default function Carrito() {
  const { carrito, quitarDelCarrito, cambiarCantidad, vaciarCarrito, total } = useCart();
  const { usuario } = useAuth();
  const navigate    = useNavigate();
  const [loading, setLoading]   = useState(false);
  const [mensaje, setMensaje]   = useState({ tipo: "", texto: "" });
  const [form, setForm]         = useState({ nombreCliente: usuario?.usuario || "", telefono: usuario?.telefono || "" });

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);

  const handlePedido = async () => {
    if (!usuario) { navigate("/login"); return; }
    if (carrito.length === 0) return;

    setLoading(true);
    setMensaje({ tipo: "", texto: "" });

    try {
      await axios.post("http://localhost:8081/api/pedidos", {
        userId:        usuario.id,
        nombreCliente: form.nombreCliente,
        telefono:      String(form.telefono),
        productos:     carrito.map((p) => ({
          productID: p.productID,
          nombre:    p.nombre,
          precio:    p.precio,
          cantidad:  p.cantidad,
        })),
        total,
      }, {
        headers: { Authorization: `Bearer ${usuario.token}` },
      });

      setMensaje({ tipo: "success", texto: "Pedido realizado con exito! Revisa tu correo." });
      vaciarCarrito();
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setMensaje({ tipo: "error", texto: err.response?.data?.message || "Error al realizar el pedido" });
    } finally {
      setLoading(false);
    }
  };

  if (carrito.length === 0 && !mensaje.texto) return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Tu carrito esta vacio</h2>
          <p className="text-gray-500 mb-8">Agrega productos desde la tienda para comenzar</p>
          <Link to="/productos" className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
            Ver Productos
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/productos" className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
              <ArrowLeft size={18} /> Seguir comprando
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

          {mensaje.texto && (
            <div className={`mb-6 p-4 rounded-xl font-medium text-center ${mensaje.tipo === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {mensaje.texto}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              {carrito.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {item.image
                      ? <img src={item.image} alt={item.nombre} className="w-full h-full object-cover" />
                      : <span className="text-3xl flex items-center justify-center h-full">📦</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">{item.nombre}</h3>
                    <p className="text-blue-600 font-semibold">{formatPrice(item.precio)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => cambiarCantidad(item._id, item.cantidad - 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.cantidad}</span>
                    <button onClick={() => cambiarCantidad(item._id, item.cantidad + 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-bold text-gray-800 w-28 text-right">{formatPrice(item.precio * item.cantidad)}</p>
                  <button onClick={() => quitarDelCarrito(item._id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input type="text" value={form.nombreCliente}
                    onChange={(e) => setForm({ ...form, nombreCliente: e.target.value })}
                    placeholder="Tu nombre completo"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
                  <input type="tel" value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    placeholder="Tu numero de telefono"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm" />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6 space-y-2">
                {carrito.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate mr-2">{item.nombre} x{item.cantidad}</span>
                    <span className="shrink-0 font-medium">{formatPrice(item.precio * item.cantidad)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {!usuario && (
                <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg mb-4 text-center">
                  Debes <Link to="/login" className="font-bold underline">iniciar sesion</Link> para hacer un pedido
                </p>
              )}

              <button
                onClick={handlePedido}
                disabled={loading || !usuario || !form.nombreCliente || !form.telefono}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {loading ? <><Loader2 className="animate-spin" size={20} /> Procesando...</> : "Realizar Pedido"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
