document.addEventListener("DOMContentLoaded", function () {
    console.log("Página de registro lista.");

    const API_URL = "https://ecommer-f99c.onrender.com/api/user/register";

    document.getElementById("register-form").addEventListener("submit", async function (e) {
        e.preventDefault();

        const errorDiv = document.getElementById("register-error");
        const errorMsg = document.getElementById("register-error-message");
        const btn = document.getElementById("register-btn");

        errorDiv.classList.add("hidden");

        const datos = {
            usuario: document.getElementById("nombre").value.trim() + " " + document.getElementById("apellido").value.trim(),
            email: document.getElementById("correo").value.trim(),
            telefono: document.getElementById("telefono").value.trim(),
            password: document.getElementById("password").value
        };

        if (!datos.usuario || !datos.email || !datos.telefono || !datos.password) {
            errorMsg.textContent = "❌ Todos los campos son obligatorios";
            errorDiv.classList.remove("hidden");
            return;
        }

        btn.disabled = true;
        btn.textContent = "Procesando...";

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            const resultado = await response.json();

            if (response.ok) {
                errorDiv.className = "bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4";
                errorMsg.textContent = "✔ Usuario registrado con éxito. Redirigiendo...";
                errorDiv.classList.remove("hidden");

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 3000);
            } else {
                errorMsg.textContent = resultado.message || "Error al registrar";
                errorDiv.classList.remove("hidden");
            }

        } catch (err) {
            console.error("❌ Error conexión servidor", err);
            errorMsg.textContent = "Error de conexión con el servidor";
            errorDiv.classList.remove("hidden");
        }

        btn.disabled = false;
        btn.textContent = "Crear Cuenta";
    });
});
