async function cargarProductos() {
    try {
        const response = await fetch('https://ecommer-f99c.onrender.com/api/Productos');
        const productos = await response.json();

        const grid = document.getElementById('products-grid');

        if (!grid) {
            console.error("❌ ERROR: No existe un elemento con id='products-grid' en el HTML");
            return;
        }

        grid.innerHTML = productos.map(producto => `
            <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 product-card"
                data-price="${producto.precio}"
                data-product-id="${producto.productID}">

                <div class="bg-linear-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center overflow-hidden relative">
                    <img src="${producto.image}" 
                         alt="${producto.nombre}"
                         class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                         loading="lazy">

                    <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -15%
                    </div>
                </div>

                <div class="p-6">
                    <h3 class="text-lg font-bold text-gray-800">
                        ${producto.nombre}
                    </h3>

                    <p class="text-sm text-gray-800 mb-4">
                        ${producto.descripcion}
                    </p>

                    <div class="flex items-center justify-between mb-4">
                        <span class="text-2xl font-bold text-blue-600">
                            ${producto.precio.toLocaleString('es-CO')}
                        </span>

                        <div class="flex text-yellow-600">⭐️⭐️⭐️⭐️⭐️</div>
                    </div>

                    <div class="flex space-x-2">
                        <button class="ver-detalles-btn bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex-1 text-sm">
                            Ver Detalles
                        </button>

                        <button class="add-to-cart-btn bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex-1 text-sm">
                            Comprar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        console.log("✔️ Productos cargados correctamente");
    } catch (error) {
        console.error("❌ Error al cargar los productos:", error);
    }
}

cargarProductos();

// Recargar productos automáticamente cada 5 segundos
setInterval(() => {
    cargarProductos();
}, 5000);
