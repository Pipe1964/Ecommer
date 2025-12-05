document.addEventListener("DOMContentLoaded", () => {
    console.log("🟢 verificar.js cargado correctamente");

    // Obtener el email del localStorage
    const email = localStorage.getItem("emailRecuperacion");
    
    if (!email) {
        console.log("❌ No hay email de recuperación");
        alert("No se encontró el email. Por favor inicia el proceso de nuevo.");
        window.location.href = "recuperar.html";
        return;
    }

    // Mostrar el email en la interfaz
    document.getElementById("email-mostrar").textContent = email;
    console.log("✅ Email cargado:", email);

    const form = document.getElementById("form-verificar");
    const codigoInput = document.getElementById("codigo");
    const nuevaPasswordInput = document.getElementById("nueva-password");
    const confirmarPasswordInput = document.getElementById("confirmar-password");
    const btnCambiar = document.getElementById("btn-cambiar");

    // Solo permitir números en el código
    codigoInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("📝 Formulario enviado");

        const codigo = codigoInput.value.trim();
        const nuevaPassword = nuevaPasswordInput.value;
        const confirmarPassword = confirmarPasswordInput.value;

        // Validaciones
        if (!codigo || codigo.length !== 6) {
            mostrarError("El código debe tener 6 dígitos");
            return;
        }

        if (!nuevaPassword || nuevaPassword.length < 6) {
            mostrarError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (nuevaPassword !== confirmarPassword) {
            mostrarError("Las contraseñas no coinciden");
            return;
        }

        // Deshabilitar botón
        btnCambiar.disabled = true;
        btnCambiar.textContent = "Cambiando contraseña...";
        btnCambiar.classList.add("opacity-50", "cursor-not-allowed");

        try {
            console.log("📤 Enviando datos al backend...");

            const res = await fetch("http://localhost:8081/api/recuperar/cambiar-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    codigo: codigo,
                    nuevaPassword: nuevaPassword
                })
            });

            const data = await res.json();
            console.log("📥 Respuesta del backend:", data);

            if (!res.ok) {
                throw new Error(data.message || "Error al cambiar la contraseña");
            }

            // Limpiar el localStorage
            localStorage.removeItem("emailRecuperacion");

            // Mostrar mensaje de éxito
            mostrarExito("✓ Contraseña cambiada exitosamente");

            // Redirigir al login después de 2 segundos
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);

        } catch (err) {
            console.error("❌ Error:", err);
            mostrarError(err.message);
            
            // Re-habilitar botón
            btnCambiar.disabled = false;
            btnCambiar.textContent = "Cambiar Contraseña";
            btnCambiar.classList.remove("opacity-50", "cursor-not-allowed");
        }
    });

    // Función para mostrar errores
    function mostrarError(mensaje) {
        let toast = document.getElementById("toast-error");
        
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast-error";
            toast.className = "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300 opacity-0 z-50";
            document.body.appendChild(toast);
        }

        toast.textContent = "❌ " + mensaje;
        toast.classList.remove("hidden", "opacity-0");
        
        setTimeout(() => toast.classList.add("opacity-100"), 20);

        setTimeout(() => {
            toast.classList.remove("opacity-100");
            toast.classList.add("opacity-0");
            setTimeout(() => toast.classList.add("hidden"), 300);
        }, 4000);
    }

    // Función para mostrar éxito
    function mostrarExito(mensaje) {
        let toast = document.getElementById("toast-exito");
        
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast-exito";
            toast.className = "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300 opacity-0 z-50";
            document.body.appendChild(toast);
        }

        toast.textContent = mensaje;
        toast.classList.remove("hidden", "opacity-0");
        
        setTimeout(() => toast.classList.add("opacity-100"), 20);
    }
});