import { useState } from "react";
import { Eye, EyeOff, UserPlus, Shield, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [message, setMessage]           = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    usuario:         "",
    email:           "",
    password:        "",
    confirmPassword: "",
    telefono:        "",
    acceptTerms:     false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (formData.password !== formData.confirmPassword) {
      return setMessage({ type: "error", text: "Las contraseñas no coinciden" });
    }
    if (formData.password.length < 6) {
      return setMessage({ type: "error", text: "La contrasena debe tener al menos 6 caracteres" });
    }
    if (!formData.acceptTerms) {
      return setMessage({ type: "error", text: "Debes aceptar los terminos y condiciones" });
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8081/api/users/register", {
        usuario:  formData.usuario,
        email:    formData.email,
        password: formData.password,
        telefono: formData.telefono,
      });
      setMessage({ type: "success", text: "Registro exitoso! Redirigiendo..." });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Error al registrar el usuario",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Unete a TechStore Pro!</h2>
            <p className="text-gray-600">Crea tu cuenta y disfruta de ofertas exclusivas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de usuario *</label>
              <input type="text" name="usuario" value={formData.usuario} onChange={handleChange}
                placeholder="Tu nombre de usuario" required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electronico *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="tu@email.com" required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefono *</label>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange}
                placeholder="Ej: 3001234567" required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contrasena *</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password}
                  onChange={handleChange} placeholder="Minimo 6 caracteres" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contrasena *</label>
              <div className="relative">
                <input type={showConfirm ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange} placeholder="Repite tu contrasena" required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-blue-500 transition-all" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded" />
              <span className="text-sm text-gray-700">Acepto los terminos y condiciones</span>
            </label>

            {message.text && (
              <div className={`p-4 rounded-lg text-sm font-medium ${
                message.type === "error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"
              }`}>{message.text}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50">
              {loading ? <><Loader2 className="animate-spin" size={20} /> Creando cuenta...</> : "Crear Cuenta"}
            </button>

            <p className="text-center text-gray-600 text-sm">
              Ya tienes cuenta?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:underline">Inicia sesion aqui</Link>
            </p>
          </form>
        </div>
        <div className="mt-6 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" /> Tu informacion esta protegida
        </div>
      </div>
    </main>
  );
}
