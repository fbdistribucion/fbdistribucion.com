document.getElementById("year").textContent = new Date().getFullYear();

// Menú de servicios: en pantallas táctiles se abre y se cierra al tocar.
const dropdown = document.querySelector(".dropdown");
const dropdownButton = document.querySelector(".nav-button");

if (dropdown && dropdownButton) {
  dropdownButton.addEventListener("click", () => {
    const isOpen = dropdown.classList.toggle("open");
    dropdownButton.setAttribute("aria-expanded", String(isOpen));
  });
}

// Sistema de consulta por Webhook usando los elementos que YA existen
// en index.html. No modifica la interfaz ni los estilos.
const guidanceButton = document.getElementById("show-guidance");
const accountEmail = document.getElementById("account-email");
const guidance = document.getElementById("guidance");

// Pegá aquí la URL real de tu Webhook (Make, n8n, Zapier, etc.).
const WEBHOOK_URL = "https://hook.us2.make.com/nobeigo5hmwfksvx1bvajs556h6tndr6";

if (guidanceButton && accountEmail && guidance) {
  guidanceButton.addEventListener("click", async () => {
    if (!accountEmail.checkValidity() || !accountEmail.value.trim()) {
      accountEmail.reportValidity();
      return;
    }

    // Evita envíos hasta configurar una URL real.
    if (!WEBHOOK_URL || WEBHOOK_URL.includes("PEGAR_AQUI")) {
      guidance.hidden = false;
      guidance.innerHTML =
        "<b>Configuración pendiente</b><p>Falta colocar la URL del Webhook en script.js.</p>";
      return;
    }

    const originalText = guidanceButton.innerHTML;
    guidanceButton.disabled = true;
    guidanceButton.textContent = "Enviando...";
    guidance.hidden = false;
    guidance.textContent = "Enviando consulta...";

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: accountEmail.value.trim()
        })
      });

      const responseText = await response.text();
      let data;

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("El Webhook no devolvió una respuesta JSON válida.");
      }

      if (!response.ok) {
        throw new Error(
          data.message || `El servidor respondió con el error ${response.status}.`
        );
      }

      // Muestra la respuesta JSON dentro del recuadro que ya tenía la página.
      const heading = document.createElement("b");
      heading.textContent = "Respuesta del servidor";
      const output = document.createElement("pre");
      output.textContent = JSON.stringify(data, null, 2);
      output.style.whiteSpace = "pre-wrap";
      output.style.overflowWrap = "anywhere";
      guidance.replaceChildren(heading, output);
    } catch (error) {
      guidance.textContent =
        "No se pudo enviar la consulta: " + error.message +
        " Revisá la URL del Webhook y la configuración CORS del servidor.";
    } finally {
      guidanceButton.disabled = false;
      guidanceButton.innerHTML = originalText;
    }
  });
}
