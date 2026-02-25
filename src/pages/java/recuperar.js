document.addEventListener("DOMContentLoaded", () => {
    console.log("🟢 recuperar.js cargado correctamente");

    const form = document.getElementById("form-recuperar");
    const emailInput = document.getElementById("email-recuperar");
    const btnEnviar = document.getElementById("btn-enviar");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("📧 Formulario enviado");

        const email = emailInput.value.trim();

        // Validar email
        if (!email) {
            mostrarError("Por favor ingresa tu correo electrónico");
            return;
        }

        if (!validarEmail(email)) {
            mostrarError("Por favor ingresa un correo válido");
            return;
        }

        // Deshabilitar botón mientras se procesa
        btnEnviar.disabled = true;
        btnEnviar.textContent = "Enviando código...";
        btnEnviar.classList.add("opacity-50", "cursor-not-allowed");

        try {
            console.log("📤 Enviando solicitud al backend...");

            const res = await fetch("https://ecommer-f99c.onrender.com/api/recuperar/solicitar-codigo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            console.log("📥 Respuesta del backend:", data);

            if (!res.ok) {
                throw new Error(data.message || "Error al enviar el código");
            }

            // Guardar el email en localStorage para la siguiente página
            localStorage.setItem("emailRecuperacion", email);

            // Mostrar mensaje de éxito
            mostrarExito("✓ Código enviado exitosamente. Revisa tu correo.");

            // Redirigir después de 2 segundos
            setTimeout(() => {
                window.location.href = "verificar.html";
            }, 2000);

        } catch (err) {
            console.error("❌ Error:", err);
            mostrarError(err.message);
            
            // Re-habilitar botón
            btnEnviar.disabled = false;
            btnEnviar.textContent = "Enviar Código";
            btnEnviar.classList.remove("opacity-50", "cursor-not-allowed");
        }
    });

    // Función para validar formato de email
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Función para mostrar errores
    function mostrarError(mensaje) {
        // Crear toast de error si no existe
        let toast = document.getElementById("toast-error");
        
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast-error";
            toast.className = "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300 opacity-0";
            document.body.appendChild(toast);
        }

        toast.textContent = "❌ " + mensaje;
        toast.classList.remove("hidden", "opacity-0");
        
        setTimeout(() => toast.classList.add("opacity-100"), 20);

        // Ocultar después de 4 segundos
        setTimeout(() => {
            toast.classList.remove("opacity-100");
            toast.classList.add("opacity-0");
            setTimeout(() => toast.classList.add("hidden"), 300);
        }, 4000);
    }

    // Función para mostrar éxito
    function mostrarExito(mensaje) {
        // Crear toast de éxito si no existe
        let toast = document.getElementById("toast-exito");
        
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast-exito";
            toast.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300 opacity-0";
            document.body.appendChild(toast);
        }

        toast.textContent = mensaje;
        toast.classList.remove("hidden", "opacity-0");
        
        setTimeout(() => toast.classList.add("opacity-100"), 20);

        // Ocultar después de 2 segundos
        setTimeout(() => {
            toast.classList.remove("opacity-100");
            toast.classList.add("opacity-0");
        }, 2000);
    }
});