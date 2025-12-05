document.addEventListener("DOMContentLoaded", async () => {
    console.log("🟢 perfil.js cargado correctamente");

    // Verificar sesión
    const sesionActiva = localStorage.getItem("sesionActiva");
    if (!sesionActiva) {
        console.log("❌ No hay sesión activa");
        window.location.href = "login.html";
        return;
    }

    const perfil = JSON.parse(localStorage.getItem("usuario"));
    if (!perfil || !perfil.email) {
        console.log("❌ No hay datos de usuario");
        window.location.href = "login.html";
        return;
    }

    console.log("✅ Usuario encontrado:", perfil);

    let usuario = null;
    let telefonoOriginal = null; // Para restaurar si cancela

    // Obtener datos del perfil desde el backend
    try {
        console.log("📡 Consultando perfil al backend...");
        
        const res = await fetch("https://ecommer-f99c.onrender.com/api/perfil/obtener", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: perfil.email })
        });

        const data = await res.json();
        console.log("📥 Respuesta del backend:", data);

        if (!res.ok) throw new Error("No se pudo obtener perfil");
        usuario = data.usuario;

    } catch (err) {
        console.error("❌ Error al obtener el perfil:", err);
        alert("Error al cargar el perfil: " + err.message);
        return;
    }

    


    // Llenar los campos del formulario
    document.getElementById("usuario").value = usuario.usuario || "";
    document.getElementById("email").value = usuario.email || "";
    document.getElementById("telefono").value = usuario.telefono || "";
    
    telefonoOriginal = usuario.telefono; // Guardar valor original

    // Actualizar el header
    document.getElementById("nombre-completo").textContent = usuario.usuario || "Usuario";
    document.getElementById("email-header").textContent = usuario.email;

    // Avatar con iniciales
    const iniciales = usuario.usuario?.slice(0, 2).toUpperCase() || "US";
    document.getElementById("avatar-perfil").textContent = iniciales;

    console.log("✅ Perfil cargado exitosamente");

    // Referencias a elementos
    const btnEditar = document.getElementById("btn-editar");
    const botonesAccion = document.getElementById("botones-accion");
    const btnCancelar = document.getElementById("btn-cancelar");
    const inputTelefono = document.getElementById("telefono");
    const form = document.getElementById("form-editar-perfil");

    // Botón "Editar Perfil" - Habilita el campo
    btnEditar.addEventListener("click", () => {
        console.log("✏️ Modo edición activado");
        
        // Habilitar campo de teléfono
        inputTelefono.disabled = false;
        inputTelefono.focus();
        
        // Cambiar apariencia del campo
        inputTelefono.classList.remove("bg-gray-100");
        inputTelefono.classList.add("bg-white", "border-blue-500");
        
        // Ocultar botón "Editar Perfil" y mostrar "Guardar/Cancelar"
        btnEditar.classList.add("hidden");
        botonesAccion.classList.remove("hidden");
    });

    // Botón "Cancelar" - Restaura el valor original
    btnCancelar.addEventListener("click", () => {
        console.log("❌ Edición cancelada");
        
        // Restaurar valor original
        inputTelefono.value = telefonoOriginal;
        
        // Deshabilitar campo
        inputTelefono.disabled = true;
        inputTelefono.classList.remove("bg-white", "border-blue-500");
        inputTelefono.classList.add("bg-gray-100");
        
        // Volver a mostrar botón "Editar Perfil"
        btnEditar.classList.remove("hidden");
        botonesAccion.classList.add("hidden");
    });

    // Formulario - Guardar cambios
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("📝 Guardando cambios...");

        const datosActualizados = {
            email: usuario.email,
            telefono: parseInt(document.getElementById("telefono").value)
        };

        console.log("📤 Datos a enviar:", datosActualizados);

        try {
            const res = await fetch("http://localhost:8081/api/perfil/actualizar", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datosActualizados)
            });

            const data = await res.json();
            console.log("📥 Respuesta actualización:", data);

            if (!res.ok) {
                throw new Error(data.message || "Error al actualizar");
            }

            // Actualizar el valor original
            telefonoOriginal = datosActualizados.telefono;

            // Deshabilitar campo
            inputTelefono.disabled = true;
            inputTelefono.classList.remove("bg-white", "border-blue-500");
            inputTelefono.classList.add("bg-gray-100");
            
            // Volver a mostrar botón "Editar Perfil"
            btnEditar.classList.remove("hidden");
            botonesAccion.classList.add("hidden");

            // Mostrar toast de éxito
            const toast = document.getElementById("toast-exito");
            toast.classList.remove("hidden");
            setTimeout(() => toast.classList.add("opacity-100"), 20);

            console.log("✅ Perfil actualizado exitosamente");

            // Ocultar toast después de 3 segundos
            setTimeout(() => {
                toast.classList.remove("opacity-100");
                setTimeout(() => toast.classList.add("hidden"), 300);
            }, 3000);

        } catch (err) {
            console.error("❌ Error al actualizar:", err);
            alert("Error al actualizar el perfil: " + err.message);
        }
    });
});