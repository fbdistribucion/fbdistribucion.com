document.getElementById("year").textContent = new Date().getFullYear();

const dropdown = document.querySelector(".dropdown");
const dropdownButton = document.querySelector(".nav-button");

if (dropdown && dropdownButton) {
  dropdownButton.addEventListener("click", () => {
    const isOpen = dropdown.classList.toggle("open");
    dropdownButton.setAttribute("aria-expanded", String(isOpen));
  });
}

const guidanceButton = document.getElementById("show-guidance");
const accountEmail = document.getElementById("account-email");
const guidance = document.getElementById("guidance");

const BACKEND_URL = "https://backend-codigos-fb.onrender.com";

let fuenteActiva = null;

function mostrarMensaje(titulo, texto, codigo = null) {
  guidance.hidden = false;
  guidance.replaceChildren();

  const b = document.createElement("b");
  b.textContent = titulo;
  guidance.appendChild(b);

  if (codigo) {
    const digitos = document.createElement("div");
    digitos.textContent = codigo;
    digitos.style.fontSize = "30px";
    digitos.style.fontWeight = "800";
    digitos.style.letterSpacing = "0.2em";
    digitos.style.margin = "10px 0 6px";
    digitos.style.color = "#ffffff";
    guidance.appendChild(digitos);
  }

  if (texto) {
    const p = document.createElement("p");
    p.textContent = texto;
    guidance.appendChild(p);
  }
}

if (guidanceButton && accountEmail && guidance) {
  guidanceButton.addEventListener("click", () => {
    const correo = accountEmail.value.trim();

    if (fuenteActiva) {
      fuenteActiva.close();
      fuenteActiva = null;
    }

    const textoOriginal = guidanceButton.innerHTML;
    guidanceButton.disabled = true;
    guidanceButton.textContent = "Esperando código...";
    mostrarMensaje(
      "Buscando código...",
      "Esperando que llegue el correo a ffbdistribuciones@gmail.com. No recargues la página."
    );

    const url = `${BACKEND_URL}/api/watch-code?email=${encodeURIComponent(correo)}`;
    const es = new EventSource(url);
    fuenteActiva = es;

    const terminar = () => {
      es.close();
      if (fuenteActiva === es) fuenteActiva = null;
      guidanceButton.disabled = false;
      guidanceButton.innerHTML = textoOriginal;
    };

    es.addEventListener("status", (e) => {
      const datos = JSON.parse(e.data);
      mostrarMensaje("Esperando código...", datos.message);
    });

    es.addEventListener("code", (e) => {
      const datos = JSON.parse(e.data);
      mostrarMensaje(
        "Código de 6 dígitos encontrado",
        datos.subject ? `Correo: ${datos.subject}` : "Listo para usar.",
        datos.code
      );
      terminar();
    });

    es.addEventListener("timeout", (e) => {
      const datos = JSON.parse(e.data);
      mostrarMensaje("Tiempo agotado", datos.message);
      terminar();
    });

    es.addEventListener("error", () => {
      mostrarMensaje(
        "No se pudo conectar",
        "Verificá que el servidor esté encendido y que la dirección del backend sea correcta."
      );
      terminar();
    });
  });
}
