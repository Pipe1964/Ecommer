import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/authcontext";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [message, setMessage]           = useState({ type: "", text: "" });

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const data = await login(email, password);
      setMessage({ type: "success", text: "Inicio de sesion correcto! Redirigiendo..." });

      setTimeout(() => {
        if (data?.usuario?.rol === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1000);

    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Error al iniciar sesion";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido de vuelta!</h2>
            <p className="text-gray-600">Inicia sesion en tu cuenta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1 text-gray-400" /> Correo electronico
              </label>
              <input type="email" placeholder="tu@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="w-4 h-4 inline mr-1 text-gray-400" /> Contrasena
              </label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-gray-900" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="text-right mt-1">
                <Link to="/recuperar-contrasena" className="text-sm text-blue-600 hover:underline">
                  Olvidaste tu contrasena?
                </Link>
              </div>
            </div>

            {message.text && (
              <div className={`p-3 rounded-lg text-sm font-medium ${
                message.type === "error"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><Loader2 className="animate-spin" size={20} /> Ingresando...</> : "Iniciar sesion"}
            </button>

            <p className="text-center text-gray-600 text-sm">
              No tienes cuenta?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Registrate aqui
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
