import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, KeyRound, Lock, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";

const API = "http://localhost:8081/api/recuperar";

export default function RecuperarContrasena() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPass, setConfirmarPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const showMsg = (type, text) => setMessage({ type, text });

  const handleSolicitarCodigo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await axios.post(`${API}/solicitar-codigo`, { email });
      showMsg("success", "Codigo enviado. Revisa tu correo.");
      setPaso(2);
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Error al enviar el codigo");
    } finally { setLoading(false); }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (nuevaPassword !== confirmarPass) return showMsg("error", "Las contrasenas no coinciden");
    if (nuevaPassword.length < 6) return showMsg("error", "Minimo 6 caracteres");
    setLoading(true);
    try {
      await axios.post(`${API}/cambiar-password`, { email, codigo, nuevaPassword });
      setPaso(3);
    } catch (err) {
      showMsg("error", err.response?.data?.message || "Error al cambiar la contrasena");
    } finally { setLoading(false); }
  };

  if (paso === 3) return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 text-center border border-gray-100">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contrasena cambiada!</h2>
        <p className="text-gray-600 mb-8">Ya puedes iniciar sesion con tu nueva contrasena.</p>
        <button onClick={() => navigate("/login")}
          className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
          Ir al inicio de sesion
        </button>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              {paso === 1 ? <Mail className="w-8 h-8 text-white" /> : <KeyRound className="w-8 h-8 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {paso === 1 ? "Recuperar contrasena" : "Nueva contrasena"}
            </h2>
            <p className="text-gray-500 text-sm">
              {paso === 1 ? "Te enviaremos un codigo a tu correo" : `Codigo enviado a ${email}`}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2].map((n) => (
              <div key={n} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${paso >= n ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>{n}</div>
                {n < 2 && <div className={`w-16 h-1 rounded-full transition-all ${paso > n ? "bg-blue-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {paso === 1 && (
            <form onSubmit={handleSolicitarCodigo} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correo electronico</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              {message.text && (
                <div className={`p-3 rounded-lg text-sm ${message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
                  {message.text}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <><Loader2 className="animate-spin" size={18} /> Enviando...</> : "Enviar codigo"}
              </button>
            </form>
          )}

          {paso === 2 && (
            <form onSubmit={handleCambiarPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Codigo de 6 digitos</label>
                <input type="text" value={codigo}
                  onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000" maxLength={6} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nueva contrasena</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)} placeholder="Minimo 6 caracteres" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-gray-400">
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contrasena</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={confirmarPass}
                    onChange={(e) => setConfirmarPass(e.target.value)} placeholder="Repite la contrasena" required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 transition-all" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3.5 text-gray-400">
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              {message.text && (
                <div className={`p-3 rounded-lg text-sm ${message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}>
                  {message.text}
                </div>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => { setPaso(1); setMessage({ type: "", text: "" }); }}
                  className="flex items-center gap-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50">
                  <ArrowLeft size={16} /> Volver
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <><Loader2 className="animate-spin" size={18} /> Cambiando...</> : "Cambiar contrasena"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-gray-400 hover:text-blue-600 flex items-center justify-center gap-1">
              <ArrowLeft size={14} /> Volver al inicio de sesion
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
