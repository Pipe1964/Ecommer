import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import { Package, ShoppingBag, TrendingUp, LogOut, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, Users } from "lucide-react";

const API = "http://localhost:8081/api";
const formatPrice = (p) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p);
const formatDate  = (d) => new Date(d).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });

function ImageUploader({ value, onChange }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const processFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">Imagen *</label>
      {value ? (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-purple-200 group">
          <img src={value} alt="preview" className="w-full h-full object-contain bg-gray-50" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className="px-3 py-1.5 bg-white text-gray-800 rounded-lg text-xs font-semibold">Cambiar</button>
            <button type="button" onClick={() => { onChange(""); if (inputRef.current) inputRef.current.value = ""; }} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold">Quitar</button>
          </div>
        </div>
      ) : (
        <div onClick={() => inputRef.current?.click()}
          onDrop={(e) => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          className={`w-full h-40 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${dragging ? "border-purple-500 bg-purple-50" : "border-gray-200 bg-gray-50 hover:border-purple-400"}`}>
          <p className="text-sm font-semibold text-gray-400">{dragging ? "Suelta aqui!" : "Arrastra o haz clic"}</p>
          <p className="text-xs text-gray-300">PNG, JPG, WEBP - max 5MB</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={(e) => processFile(e.target.files[0])} className="hidden" />
    </div>
  );
}

export default function AdminPanel() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]               = useState("dashboard");
  const [productos, setProductos]   = useState([]);
  const [pedidos, setPedidos]       = useState([]);
  const [usuarios, setUsuarios]     = useState([]);
  const [loadingP, setLoadingP]     = useState(true);
  const [loadingPed, setLoadingPed] = useState(true);
  const [loadingU, setLoadingU]     = useState(true);
  const [mensaje, setMensaje]       = useState({ tipo: "", texto: "" });
  const [editando, setEditando]     = useState(null);
  const [verPedido, setVerPedido]   = useState(null);
  const formInicial = { productID: "", nombre: "", descripcion: "", precio: "", image: "" };
  const [form, setForm] = useState(formInicial);

  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${usuario?.token}` };

  useEffect(() => { if (usuario?.rol !== "admin") navigate("/"); }, [usuario]);
  useEffect(() => { fetchProductos(); fetchPedidos(); fetchUsuarios(); }, []);

  const fetchProductos = async () => {
    setLoadingP(true);
    try { const r = await fetch(`${API}/productos`); setProductos(await r.json()); }
    catch {} finally { setLoadingP(false); }
  };

  const fetchPedidos = async () => {
    setLoadingPed(true);
    try { const r = await fetch(`${API}/pedidos/todos`, { headers }); setPedidos(await r.json()); }
    catch {} finally { setLoadingPed(false); }
  };

  const fetchUsuarios = async () => {
    setLoadingU(true);
    try { const r = await fetch(`${API}/users/todos`, { headers }); setUsuarios(await r.json()); }
    catch {} finally { setLoadingU(false); }
  };

  const mostrarMsg = (tipo, texto) => { setMensaje({ tipo, texto }); setTimeout(() => setMensaje({ tipo: "", texto: "" }), 3500); };

  const handleSubmitProducto = async (e) => {
    e.preventDefault();
    if (!form.image) { mostrarMsg("error", "Agrega una imagen"); return; }
    try {
      const url = editando ? `${API}/productos/${editando._id}` : `${API}/productos`;
      const res = await fetch(url, { method: editando ? "PUT" : "POST", headers, body: JSON.stringify({ ...form, precio: parseFloat(form.precio) }) });
      if (!res.ok) throw new Error((await res.json()).message);
      mostrarMsg("success", editando ? "Producto actualizado" : "Producto creado");
      setForm(formInicial); setEditando(null); setTab("productos"); fetchProductos();
    } catch (err) { mostrarMsg("error", err.message || "Error al guardar"); }
  };

  const handleEliminar = async (id) => {
    if (!confirm("Eliminar este producto?")) return;
    try {
      const res = await fetch(`${API}/productos/${id}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error();
      mostrarMsg("success", "Producto eliminado"); fetchProductos();
    } catch { mostrarMsg("error", "Error al eliminar"); }
  };

  const handleEstadoPedido = async (id, estado) => {
    try {
      const res = await fetch(`${API}/pedidos/${id}/estado`, { method: "PUT", headers, body: JSON.stringify({ estado }) });
      if (!res.ok) throw new Error();
      mostrarMsg("success", `Pedido marcado como ${estado}`);
      fetchPedidos();
      if (verPedido?._id === id) setVerPedido((prev) => ({ ...prev, estado }));
    } catch { mostrarMsg("error", "Error al actualizar estado"); }
  };

  const estadoColor = { pendiente: "bg-yellow-100 text-yellow-700", completado: "bg-green-100 text-green-700", cancelado: "bg-red-100 text-red-700" };
  const estadoIcon  = { pendiente: <Clock size={12} />, completado: <CheckCircle size={12} />, cancelado: <XCircle size={12} /> };
  const totalVentas = pedidos.filter((p) => p.estado === "completado").reduce((acc, p) => acc + p.total, 0);
  const pendientes  = pedidos.filter((p) => p.estado === "pendiente").length;

  const navItems = [
    { id: "dashboard", label: "Dashboard",       icon: <TrendingUp size={18} /> },
    { id: "pedidos",   label: "Pedidos",          icon: <ShoppingBag size={18} /> },
    { id: "productos", label: "Productos",        icon: <Package size={18} /> },
    { id: "usuarios",  label: "Usuarios",         icon: <Users size={18} /> },
    { id: "agregar",   label: "Agregar Producto", icon: <Plus size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-60 bg-white shadow-lg flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-linear-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {usuario?.usuario?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{usuario?.usuario}</p>
              <p className="text-xs text-purple-600 font-medium">Administrador</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button key={item.id}
              onClick={() => { setTab(item.id); if (item.id !== "agregar") { setEditando(null); setForm(formInicial); } }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === item.id ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              {item.icon} {item.label}
              {item.id === "pedidos" && pendientes > 0 && (
                <span className="ml-auto bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{pendientes}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-all">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        {mensaje.texto && (
          <div className={`mb-6 px-5 py-3 rounded-xl text-sm font-medium ${mensaje.tipo === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {mensaje.texto}
          </div>
        )}

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h2>
            <p className="text-gray-400 mb-6">Bienvenido, {usuario?.usuario}</p>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {[
                { label: "Productos", value: productos.length, color: "from-blue-500 to-blue-600", icon: <Package size={24} /> },
                { label: "Pedidos pendientes", value: pendientes, color: "from-orange-500 to-orange-600", icon: <Clock size={24} /> },
                { label: "Pedidos completados", value: pedidos.filter((p) => p.estado === "completado").length, color: "from-green-500 to-green-600", icon: <CheckCircle size={24} /> },
                { label: "Total ventas", value: formatPrice(totalVentas), color: "from-purple-500 to-purple-600", icon: <TrendingUp size={24} /> },
              ].map((card, i) => (
                <div key={i} className={`bg-linear-to-br ${card.color} rounded-2xl p-6 text-white`}>
                  <div className="opacity-70 mb-3">{card.icon}</div>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-sm opacity-80 mt-1">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Ultimos pedidos */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Últimos Pedidos</h3>
                <button onClick={() => setTab("pedidos")} className="text-sm text-purple-600 hover:underline">Ver todos</button>
              </div>
              {pedidos.length === 0 ? <p className="text-gray-400 text-center py-8">No hay pedidos aún</p> : (
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-400 text-xs uppercase border-b border-gray-100">
                    <th className="pb-3">Cliente</th><th className="pb-3">Total</th><th className="pb-3">Estado</th><th className="pb-3">Fecha</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {pedidos.slice(0, 5).map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setVerPedido(p)}>
                        <td className="py-3 font-medium text-gray-800">{p.nombreCliente}</td>
                        <td className="py-3 font-bold">{formatPrice(p.total)}</td>
                        <td className="py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${estadoColor[p.estado]}`}>{estadoIcon[p.estado]} {p.estado}</span></td>
                        <td className="py-3 text-gray-400 text-xs">{formatDate(p.fecha)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Usuarios recientes */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Usuarios Registrados</h3>
                <button onClick={() => setTab("usuarios")} className="text-sm text-purple-600 hover:underline">Ver todos</button>
              </div>
              <p className="text-2xl font-bold text-gray-800">{usuarios.length} <span className="text-sm font-normal text-gray-400">usuarios en total</span></p>
            </div>
          </div>
        )}

        {/* PEDIDOS */}
        {tab === "pedidos" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Pedidos ({pedidos.length})</h2>
            {loadingPed ? <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse" />)}</div>
            : pedidos.length === 0
              ? <div className="bg-white rounded-2xl p-16 text-center text-gray-400"><ShoppingBag size={48} className="mx-auto mb-4 opacity-30" /><p>No hay pedidos</p></div>
              : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-400 text-xs uppercase border-b bg-gray-50">
                      <th className="p-4">Cliente</th><th className="p-4">Productos</th><th className="p-4">Total</th><th className="p-4">Estado</th><th className="p-4">Fecha</th><th className="p-4">Acciones</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {pedidos.map((p) => (
                        <tr key={p._id} className="hover:bg-gray-50">
                          <td className="p-4"><p className="font-semibold">{p.nombreCliente}</p><p className="text-xs text-gray-400">{p.telefono}</p></td>
                          <td className="p-4 text-gray-500">{p.productos.length} item(s)</td>
                          <td className="p-4 font-bold">{formatPrice(p.total)}</td>
                          <td className="p-4"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${estadoColor[p.estado]}`}>{estadoIcon[p.estado]} {p.estado}</span></td>
                          <td className="p-4 text-gray-400 text-xs">{formatDate(p.fecha)}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setVerPedido(p)} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg"><Eye size={14} /></button>
                              {p.estado === "pendiente" && <>
                                <button onClick={() => handleEstadoPedido(p._id, "completado")} className="px-2 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-semibold">Completar</button>
                                <button onClick={() => handleEstadoPedido(p._id, "cancelado")} className="px-2 py-1 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg text-xs font-semibold">Cancelar</button>
                              </>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}

        {/* PRODUCTOS */}
        {tab === "productos" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Productos ({productos.length})</h2>
              <button onClick={() => { setTab("agregar"); setEditando(null); setForm(formInicial); }}
                className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transition-all">
                <Plus size={16} /> Agregar
              </button>
            </div>
            {loadingP ? <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse" />)}</div>
            : productos.length === 0
              ? <div className="bg-white rounded-2xl p-16 text-center text-gray-400"><Package size={48} className="mx-auto mb-4 opacity-30" /><p>No hay productos</p></div>
              : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-400 text-xs uppercase border-b bg-gray-50">
                      <th className="p-4">Producto</th><th className="p-4">Descripcion</th><th className="p-4">Precio</th><th className="p-4 text-right">Acciones</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {productos.map((prod) => (
                        <tr key={prod._id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                                {prod.image ? <img src={prod.image} alt={prod.nombre} className="w-full h-full object-cover" /> : <span>📦</span>}
                              </div>
                              <div><p className="font-semibold">{prod.nombre}</p><p className="text-xs text-gray-400">ID: {prod.productID}</p></div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-500 max-w-xs"><p className="truncate">{prod.descripcion}</p></td>
                          <td className="p-4 font-bold">{formatPrice(prod.precio)}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => { setEditando(prod); setForm({ productID: prod.productID || "", nombre: prod.nombre || "", descripcion: prod.descripcion || "", precio: prod.precio?.toString() || "", image: prod.image || "" }); setTab("agregar"); }}
                                className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg"><Edit size={14} /></button>
                              <button onClick={() => handleEliminar(prod._id)} className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}

        {/* USUARIOS */}
        {tab === "usuarios" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Usuarios ({usuarios.length})</h2>
            {loadingU ? <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white rounded-2xl animate-pulse" />)}</div>
            : usuarios.length === 0
              ? <div className="bg-white rounded-2xl p-16 text-center text-gray-400"><Users size={48} className="mx-auto mb-4 opacity-30" /><p>No hay usuarios</p></div>
              : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-400 text-xs uppercase border-b bg-gray-50">
                      <th className="p-4">Usuario</th><th className="p-4">Email</th><th className="p-4">Telefono</th><th className="p-4">Rol</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {usuarios.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {u.usuario?.slice(0, 2).toUpperCase()}
                              </div>
                              <p className="font-semibold text-gray-800">{u.usuario}</p>
                            </div>
                          </td>
                          <td className="p-4 text-gray-500">{u.email}</td>
                          <td className="p-4 text-gray-500">{u.telefono}</td>
                          <td className="p-4">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${u.rol === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                              {u.rol}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        )}

        {/* AGREGAR / EDITAR PRODUCTO */}
        {tab === "agregar" && (
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{editando ? `Editando: ${editando.nombre}` : "Nuevo Producto"}</h2>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <form onSubmit={handleSubmitProducto} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">ID Producto *</label>
                    <input type="text" value={form.productID} required onChange={(e) => setForm({ ...form, productID: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Precio *</label>
                    <input type="number" min="0" value={form.precio} required onChange={(e) => setForm({ ...form, precio: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Nombre *</label>
                  <input type="text" value={form.nombre} required onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Descripcion *</label>
                  <textarea value={form.descripcion} required rows={3} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-purple-500 outline-none" />
                </div>
                <ImageUploader value={form.image} onChange={(b64) => setForm({ ...form, image: b64 })} />
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold text-sm transition-all">
                    {editando ? "Guardar cambios" : "Crear producto"}
                  </button>
                  <button type="button" onClick={() => { setEditando(null); setForm(formInicial); setTab("productos"); }} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold text-sm hover:bg-gray-50">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Modal detalle pedido */}
      {verPedido && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setVerPedido(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 text-lg">Detalle del Pedido</h3>
              <button onClick={() => setVerPedido(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="space-y-2 mb-4 text-sm">
              <p><span className="font-semibold text-gray-700">Cliente:</span> {verPedido.nombreCliente}</p>
              <p><span className="font-semibold text-gray-700">Teléfono:</span> {verPedido.telefono}</p>
              <p><span className="font-semibold text-gray-700">Fecha:</span> {formatDate(verPedido.fecha)}</p>
              <p className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Estado:</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${estadoColor[verPedido.estado]}`}>{estadoIcon[verPedido.estado]} {verPedido.estado}</span>
              </p>
            </div>
            <div className="border-t border-gray-100 pt-4 mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Productos</p>
              <div className="space-y-2">
                {verPedido.productos.map((p, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700">{p.nombre} x{p.cantidad}</span>
                    <span className="font-semibold">{formatPrice(p.precio * p.cantidad)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-gray-900 mt-3 pt-3 border-t border-gray-100 text-base">
                <span>Total</span><span>{formatPrice(verPedido.total)}</span>
              </div>
            </div>
            {verPedido.estado === "pendiente" && (
              <div className="flex gap-2">
                <button onClick={() => handleEstadoPedido(verPedido._id, "completado")} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all">Completar</button>
                <button onClick={() => handleEstadoPedido(verPedido._id, "cancelado")} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all">Cancelar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}