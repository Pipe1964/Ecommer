import { useState, useRef, useEffect } from "react";
import { ShoppingCart, Menu, X, LogOut, User, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import { useCart } from "../../context/cartcontext";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen]     = useState(false);
  const { usuario, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const menuRef = useRef();

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  // Obtener iniciales del usuario
  const getIniciales = (nombre) => {
    if (!nombre) return "U";
    return nombre.slice(0, 2).toUpperCase();
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg mr-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TechStore Pro
              </h1>
            </Link>

            {/* Links desktop */}
            <div className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Inicio</Link>
              <Link to="/productos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Productos</Link>
              <Link to="/categorias" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Categorias</Link>
              <Link to="/contacto" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contacto</Link>
            </div>
          </div>

          {/* Derecha */}
          <div className="flex items-center space-x-2">

            {/* Carrito - solo para usuarios normales */}
            {(!usuario || usuario.rol !== "admin") && (
              <Link to="/carrito" className="relative group p-2.5 hover:bg-blue-50 rounded-xl transition-all">
                <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-all" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Si hay usuario */}
            {usuario ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all"
                >
                  {/* Avatar con iniciales */}
                  <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {getIniciales(usuario.usuario)}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-gray-700">
                    {usuario.usuario}
                  </span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown menú */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    {/* Info usuario */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-800">{usuario.usuario}</p>
                      <p className="text-xs text-gray-400 truncate">{usuario.email}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold ${usuario.rol === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {usuario.rol === "admin" ? "Administrador" : "Usuario"}
                      </span>
                    </div>

                    {/* Opciones según rol */}
                    {usuario.rol === "admin" ? (
                      <button
                        onClick={() => { setUserMenuOpen(false); navigate("/admin"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings size={16} className="text-purple-500" />
                        Panel Administrativo
                      </button>
                    ) : (
                      <button
                        onClick={() => { setUserMenuOpen(false); navigate("/perfil"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User size={16} className="text-blue-500" />
                        Editar Perfil
                      </button>
                    )}

                    <div className="border-t border-gray-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
                <User size={16} />
                Iniciar Sesión
              </Link>
            )}

            {/* Menú mobile */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2.5 hover:bg-blue-50 rounded-xl">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">Inicio</Link>
              <Link to="/productos" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">Productos</Link>
              <Link to="/categorias" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">Categorias</Link>
              <Link to="/contacto" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">Contacto</Link>
              {(!usuario || usuario.rol !== "admin") && (
                <Link to="/carrito" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium py-2">
                  Carrito {totalItems > 0 && `(${totalItems})`}
                </Link>
              )}
              {usuario ? (
                <>
                  {usuario.rol === "admin" && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-purple-600 font-medium py-2">Panel Admin</Link>
                  )}
                  {usuario.rol !== "admin" && (
                    <Link to="/perfil" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 font-medium py-2">Editar Perfil</Link>
                  )}
                  <button onClick={handleLogout} className="text-left text-red-500 font-medium py-2">Cerrar Sesión</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-blue-600 font-medium py-2">Iniciar Sesión</Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;