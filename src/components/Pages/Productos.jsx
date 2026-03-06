import { useState, useEffect } from "react";
import { ShoppingCart, Search, Loader2 } from "lucide-react";
import { useCart } from "../../context/cartcontext.jsx";
import Navbar from "../Layout/Navbar.jsx";
import Footer from "../Layout/Footer.jsx";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [busqueda, setBusqueda]   = useState("");
  const [notif, setNotif]         = useState("");
  const { agregarAlCarrito }      = useCart();

  useEffect(() => {
    fetch("http://localhost:8081/api/productos")
      .then((r) => r.json())
      .then((data) => setProductos(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAgregar = (producto) => {
    agregarAlCarrito(producto);
    setNotif(`"${producto.nombre}" agregado al carrito`);
    setTimeout(() => setNotif(""), 2500);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(price);

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Nuestros Productos</h1>
            <p className="text-gray-500">Encuentra la mejor tecnologia al mejor precio</p>
          </div>

          {/* Buscador */}
          <div className="relative max-w-md mx-auto mb-10">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Notificacion */}
          {notif && (
            <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg font-medium animate-bounce">
              🛒 {notif}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">📦</p>
              <p className="text-xl font-semibold">No hay productos disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtrados.map((producto) => (
                <div key={producto._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="h-52 overflow-hidden bg-gray-100">
                    {producto.image ? (
                      <img src={producto.image} alt={producto.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{producto.nombre}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{producto.descripcion}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">{formatPrice(producto.precio)}</span>
                      <button
                        onClick={() => handleAgregar(producto)}
                        className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all transform hover:scale-105">
                        <ShoppingCart size={16} /> Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
