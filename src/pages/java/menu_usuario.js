document.addEventListener("DOMContentLoaded", async () => {
    console.log("🟢 menu-usuario.js cargado correctamente");
    
    const sesionActiva = localStorage.getItem("sesionActiva");
    const contenedor = document.getElementById("user-menu-container");

    if (!contenedor) {
        console.log("⚠️ No se encontró #user-menu-container");
        return;
    }
    
    if (!sesionActiva) {
        console.log("ℹ️ No hay sesión activa");
        return;
    }

    // Traer datos del usuario guardado en localStorage
    const perfil = JSON.parse(localStorage.getItem("usuario"));
    if (!perfil || !perfil.email) {
        console.log("⚠️ No hay datos de usuario");
        return;
    }

    let usuario = null;

    try {
        console.log("📡 Obteniendo perfil del usuario...");
        
        const res = await fetch("https://ecommer-f99c.onrender.com/api/perfil/obtener", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: perfil.email })
        });

        const data = await res.json();
        if (!res.ok) throw new Error("No se pudo obtener perfil");
        usuario = data.usuario;

        console.log("✅ Perfil obtenido:", usuario);

    } catch (err) {
        console.error("❌ Error al obtener el perfil:", err);
        localStorage.clear();
        return;
    }

    // Crear el menú del usuario
    contenedor.innerHTML = `
    <div class="relative">
        <button id="user-menu-btn"
            class="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                   flex items-center justify-center font-bold text-xl shadow-md 
                   hover:scale-105 transition-transform">
            <span id="user-avatar"></span>
        </button>

        <div id="user-dropdown"
            class="hidden absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl 
                   border border-gray-100 py-2 z-50 
                   transition-all duration-200 ease-out overflow-hidden 
                   transform origin-top scale-95 opacity-0">

            <div class="px-4 py-3 border-b border-gray-200">
                <p class="text-sm font-semibold text-gray-900" id="user-name"></p>
                <p class="text-xs text-gray-500" id="user-email"></p>
            </div>

            <a href="perfil.html"
                class="flex items-center px-4 py-3 text-sm text-gray-700 
                       hover:bg-blue-100 hover:text-blue-800 
                       active:bg-blue-200 transition-all duration-150 rounded-md cursor-pointer">
                👤 Mi Perfil
            </a>

            <button id="logout-btn"
                class="flex items-center w-full px-4 py-3 text-sm text-gray-600
                       hover:bg-red-100 hover:text-red-800 
                       active:bg-red-200 transition-all duration-150 rounded-md cursor-pointer">
                🚪 Cerrar sesión
            </button>
        </div>
    </div>
    `;

    // Insertar datos en el menú
    document.getElementById("user-name").textContent = usuario.usuario || usuario.email;
    document.getElementById("user-email").textContent = usuario.email;

    const avatar = (usuario.usuario || usuario.email).slice(0, 2).toUpperCase();
    document.getElementById("user-avatar").textContent = avatar;

    console.log("✅ Menú de usuario creado");

    // Animación abrir/cerrar dropdown
    document.getElementById("user-menu-btn").addEventListener("click", () => {
        const drop = document.getElementById("user-dropdown");
        
        if (drop.classList.contains("hidden")) {
            drop.classList.remove("hidden");
            setTimeout(() => {
                drop.classList.remove("opacity-0", "scale-95");
                drop.classList.add("opacity-100", "scale-100");
            }, 20);
        } else {
            drop.classList.remove("opacity-100", "scale-100");
            drop.classList.add("opacity-0", "scale-95");
            setTimeout(() => drop.classList.add("hidden"), 150);
        }
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener("click", (e) => {
        const menuBtn = document.getElementById("user-menu-btn");
        const dropdown = document.getElementById("user-dropdown");
        
        if (menuBtn && dropdown && !menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove("opacity-100", "scale-100");
            dropdown.classList.add("opacity-0", "scale-95");
            setTimeout(() => dropdown.classList.add("hidden"), 150);
        }
    });
});

// CERRAR SESIÓN + TOAST
document.addEventListener("click", (e) => {
    if (e.target.id === "logout-btn") {
        console.log("🚪 Cerrando sesión...");

        localStorage.clear();

        const toast = document.getElementById("logout-toast");

        if (toast) {
            toast.classList.remove("hidden");
            setTimeout(() => toast.classList.add("opacity-100"), 20);

            setTimeout(() => {
                toast.classList.remove("opacity-100");
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 500);
            }, 1800);
        } else {
            // Si no existe el toast, redirigir directamente
            window.location.href = "login.html";
        }
    }
});