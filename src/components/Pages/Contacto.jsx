import { useState } from "react";
import Navbar from "../Layout/Navbar.jsx";
import Footer from "../Layout/Footer.jsx";
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle } from "lucide-react";

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    asunto: "",
    mensaje: "",
  });
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8081/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al enviar el mensaje");

      setEnviado(true);
      setForm({ nombre: "", apellido: "", email: "", telefono: "", direccion: "", asunto: "", mensaje: "" });
    } catch (err) {
      setError("No se pudo enviar el mensaje. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">

        {/* Hero */}
        <section className="bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
            <p className="text-lg opacity-90">Estamos aquí para ayudarte. Escríbenos y te respondemos a la brevedad.</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Info de contacto */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Información de contacto</h2>

            {[
              { icon: <Mail className="w-5 h-5 text-blue-600" />, titulo: "Correo", valor: "soporte@techstorepro.com" },
              { icon: <Phone className="w-5 h-5 text-blue-600" />, titulo: "Teléfono", valor: "+57 300 123 4567" },
              { icon: <MapPin className="w-5 h-5 text-blue-600" />, titulo: "Dirección", valor: "Calle 80 #45-12, Bogotá, Colombia" },
              { icon: <Clock className="w-5 h-5 text-blue-600" />, titulo: "Horario", valor: "Lun – Vie: 8:00 am – 6:00 pm" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-sm">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase">{item.titulo}</p>
                  <p className="text-gray-700 font-medium mt-0.5">{item.valor}</p>
                </div>
              </div>
            ))}

            {/* Redes sociales */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Síguenos</p>
              <div className="flex gap-3">
                {["Facebook", "Instagram", "Twitter"].map((red) => (
                  <span key={red}
                    className="px-3 py-1.5 bg-linear-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-lg cursor-pointer hover:opacity-80 transition">
                    {red}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Envíanos un mensaje</h2>

            {enviado ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
                <h3 className="text-xl font-bold text-gray-800">¡Mensaje enviado!</h3>
                <p className="text-gray-500">Gracias por contactarnos. Te responderemos pronto.</p>
                <button
                  onClick={() => setEnviado(false)}
                  className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Nombre y apellido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Nombre *</label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Juan"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Apellido *</label>
                    <input
                      name="apellido"
                      value={form.apellido}
                      onChange={handleChange}
                      required
                      placeholder="Pérez"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                {/* Email y Teléfono */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Correo electrónico *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="juan@correo.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="+57 300 000 0000"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                {/* Dirección */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Dirección</label>
                  <input
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    placeholder="Calle, ciudad, país"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Asunto */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Asunto *</label>
                  <select
                    name="asunto"
                    value={form.asunto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-gray-700"
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="soporte">Soporte técnico</option>
                    <option value="pedido">Consulta sobre pedido</option>
                    <option value="devolucion">Devolución / garantía</option>
                    <option value="envio">Información de envío</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                {/* Mensaje */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Mensaje *</label>
                  <textarea
                    name="mensaje"
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Escribe tu mensaje aquí..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                {/* Botón */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60">
                  {loading ? (
                    <><Loader2 className="animate-spin w-5 h-5" /> Enviando...</>
                  ) : (
                    <><Send className="w-5 h-5" /> Enviar mensaje</>
                  )}
                </button>

              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}