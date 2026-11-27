
document.getElementById("year").textContent = new Date().getFullYear();

// Reemplazaremos esta dirección cuando creemos el servidor.
const API_BASE_URL = "https://REEMPLAZAR-CON-TU-SERVICIO.onrender.com";

// Menú de servicios.
const dropdown = document.querySelector(".dropdown");
const dropdownButton = document.querySelector(".nav-button");

dropdownButton.addEventListener("click", () => {
  const isOpen = dropdown.classList.toggle("open");
  dropdownButton.setAttribute("aria-expanded", String(isOpen));
});

// Verificación del correo.
const verificationForm = document.getElementById("verification-form");
const accountEmail = document.getElementById("account-email");
const sendCodeButton = document.getElementById("send-code");
const verifyStep = document.getElementById("verify-step");
const verificationCode = document.getElementById("verification-code");
const verifyCodeButton = document.getElementById("verify-code");
const verificationStatus = document.getElementById("verification-status");
const verificationResult = document.getElementById("verification-result");

function setStatus(message) {
  verificationStatus.textContent = message;
}

verificationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!accountEmail.checkValidity()) {
    accountEmail.reportValidity();
    return;
  }

  if (API_BASE_URL.includes("REEMPLAZAR-CON-TU-SERVICIO")) {
    setStatus("Falta conectar el servidor de Render.");
    return;
  }

  sendCodeButton.disabled = true;
  sendCodeButton.textContent = "Enviando...";
  setStatus("Enviando el código...");
  verificationResult.hidden = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: accountEmail.value.trim()
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "No se pudo enviar el código.");
    }

    verifyStep.hidden = false;
    verificationCode.focus();

    setStatus(result.message || "Revisá tu correo y la carpeta de spam.");

  } catch (error) {
    setStatus(error.message || "Error de conexión.");
  } finally {
    sendCodeButton.disabled = false;
    sendCodeButton.innerHTML = 'Enviar código <b>→</b>';
  }
});

// Verificar código.
verifyCodeButton.addEventListener("click", async () => {
  const code = verificationCode.value.trim();

  if (!/^[0-9]{6}$/.test(code)) {
    verificationCode.setCustomValidity("Ingresá los 6 dígitos del código.");
    verificationCode.reportValidity();
    verificationCode.setCustomValidity("");
    return;
  }

  verifyCodeButton.disabled = true;
  verifyCodeButton.textContent = "Verificando...";

  try {
    const response = await fetch(`${API_BASE_URL}/api/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: accountEmail.value.trim(),
        code: code
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Código incorrecto.");
    }

    verificationResult.hidden = false;
    setStatus("Verificación completada.");
    verificationCode.disabled = true;
    verifyCodeButton.hidden = true;

  } catch (error) {
    setStatus(error.message || "No se pudo verificar el código.");
  } finally {
    verifyCodeButton.disabled = false;

    if (!verificationResult.hidden) {
      verifyCodeButton.textContent = "Verificado";
    } else {
      verifyCodeButton.innerHTML = 'Verificar código <b>→</b>';
    }
  }
});

// Formulario de consultas original.
const form = document.getElementById("help-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);

  const subject = encodeURIComponent(
    "Consulta de atención al cliente - FB DISTRIBUCION"
  );

  const body = encodeURIComponent(
    `Nombre: ${data.get("name")}\nCorreo: ${data.get("email")}\nServicio: ${data.get("service")}\n\nConsulta:\n${data.get("message")}`
  );

  window.location.href =
    `mailto:ffbdistribuciones@gmail.com?subject=${subject}&body=${body}`;
});
