function Newsletter() {
  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-3">¿Quieres estar al día?</h2>
        <p className="text-gray-400 mb-8 text-lg">Suscríbete y recibe ofertas exclusivas en tu correo</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="tu@correo.com"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
            Suscribirme
          </button>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;