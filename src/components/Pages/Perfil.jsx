import { useState } from "react";
import { useAuth } from "../../context/authcontext";
import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, Save, Trash2, Loader2, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function Perfil() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [telefono, setTelefono] = useState(usuario?.telefono || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleActualizar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await axios.put("http://localhost:8081/api/perfil/actualizar", {
        email: usuario.email, telefono
      });
      setMessage({ type: "success", text: "Perfil actualizado correctamente" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Error al actualizar" });
    } finally { setLoading(false); }
  };

  const handleEliminar = async () => {
    try {
      await axios.delete("http://localhost:8081/api/perfil/eliminar", {
        data: { email: usuario.email }
      });
      logout();
      navigate("/");
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Error al eliminar cuenta" });
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft size={18} /> Volver al inicio
        </button>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
              {usuario?.usuario?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{usuario?.usuario}</h2>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${usuario?.rol === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
              {usuario?.rol}
            </span>
          </div>

          <form onSubmit={handleActualizar} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1 text-gray-400" /> Usuario
              </label>
              <input type="text" value={usuario?.usuario || ""} disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1 text-gray-400" /> Correo electronico
              </label>
              <input type="email" value={usuario?.email || ""} disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1 text-gray-400" /> Telefono
              </label>
              <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: 3001234567" required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>

            {message.text && (
              <div className={`p-3 rounded-lg text-sm font-medium ${message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50">
              {loading ? <><Loader2 className="animate-spin" size={18} /> Guardando...</> : <><Save size={18} /> Guardar cambios</>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-all font-medium">
                <Trash2 size={18} /> Eliminar cuenta
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-center text-gray-600 font-medium">Esta accion es irreversible. Confirmas?</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
                    Cancelar
                  </button>
                  <button onClick={handleEliminar}
                    className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all text-sm font-medium">
                    Si, eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
