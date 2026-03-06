import { useNavigate } from "react-router-dom";
import Navbar from "../Layout/Navbar.jsx";
import Footer from "../Layout/Footer.jsx";

const categorias = [
  {
    id: "laptops",
    emoji: "💻",
    titulo: "Laptops",
    descripcion: "Las mejores marcas para trabajo, estudio y gaming.",
    color: "from-blue-500 to-blue-600",
    productos: ["MacBook Pro", "Dell XPS", "HP Pavilion", "Lenovo ThinkPad", "Asus ROG"],
  },
  {
    id: "celulares",
    emoji: "📱",
    titulo: "Celulares",
    descripcion: "Última tecnología móvil de todas las marcas.",
    color: "from-purple-500 to-purple-600",
    productos: ["iPhone 15 Pro", "Samsung Galaxy S24", "Xiaomi 14", "Google Pixel 8", "OnePlus 12"],
  },
  {
    id: "componentes",
    emoji: "⚙️",
    titulo: "Componentes PC",
    descripcion: "Arma tu PC ideal con los mejores componentes.",
    color: "from-green-500 to-green-600",
    productos: ["RTX 4070", "Ryzen 7 7800X3D", "RAM DDR5 32GB", "SSD NVMe 1TB", "Fuente 850W"],
  },
  {
    id: "monitores",
    emoji: "🖥️",
    titulo: "Monitores",
    descripcion: "Pantallas de alta resolución para trabajo y entretenimiento.",
    color: "from-orange-500 to-orange-600",
    productos: ["LG UltraWide 34\"", "Samsung 4K 27\"", "ASUS ProArt", "BenQ 144Hz", "Dell U2723D"],
  },
  {
    id: "accesorios",
    emoji: "🖱️",
    titulo: "Accesorios",
    descripcion: "Teclados, ratones, auriculares y más.",
    color: "from-pink-500 to-pink-600",
    productos: ["Logitech MX Keys", "Razer DeathAdder", "Sony WH-1000XM5", "HyperX Alloy", "Elgato Stream Deck"],
  },
  {
    id: "tablets",
    emoji: "📟",
    titulo: "Tablets",
    descripcion: "Versatilidad y potencia en un solo dispositivo.",
    color: "from-teal-500 to-teal-600",
    productos: ["iPad Pro M4", "Samsung Galaxy Tab S9", "Lenovo Tab P12", "Microsoft Surface Pro", "Xiaomi Pad 6"],
  },
];

export default function Categorias() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">

        {/* Hero */}
        <section className="bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestras Categorías</h1>
            <p className="text-lg opacity-90">Encuentra exactamente lo que buscas</p>
          </div>
        </section>

        {/* Grid categorias */}
        <section className="max-w-6xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categorias.map((cat) => (
              <div key={cat.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => navigate("/productos")}>

                {/* Header con color */}
                <div className={`bg-linear-to-r ${cat.color} p-6 text-white`}>
                  <div className="text-5xl mb-3">{cat.emoji}</div>
                  <h2 className="text-2xl font-bold">{cat.titulo}</h2>
                  <p className="text-sm opacity-80 mt-1">{cat.descripcion}</p>
                </div>

                {/* Lista productos */}
                <div className="p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Productos destacados</p>
                  <ul className="space-y-2">
                    {cat.productos.map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate("/productos")}
                    className={`mt-5 w-full bg-linear-to-r ${cat.color} text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all`}>
                    Ver productos →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}