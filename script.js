
document.getElementById("year").textContent = new Date().getFullYear();

// Menú de servicios
const dropdown = document.querySelector(".dropdown");
const dropdownButton = document.querySelector(".nav-button");

dropdownButton.addEventListener("click", () => {
  const isOpen = dropdown.classList.toggle("open");
  dropdownButton.setAttribute("aria-expanded", String(isOpen));
});

// Orientación sobre códigos de verificación
const guidanceButton = document.getElementById("show-guidance");
const accountEmail = document.getElementById("account-email");
const guidance = document.getElementById("guidance");

guidanceButton.addEventListener("click", () => {
  if (!accountEmail.checkValidity() || !accountEmail.value.trim()) {
    accountEmail.reportValidity();
    return;
  }

  guidance.hidden = false;
});

// Formulario de asistencia
const form = document.getElementById("help-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);

  const subject = encodeURIComponent(
    "Consulta de atención al cliente - FB DISTRIBUCION"
  );

  const body = encodeURIComponent(
    `Nombre: ${data.get("name")}
Correo: ${data.get("email")}
Servicio: ${data.get("service")}

Consulta:
${data.get("message")}`
  );

  window.location.href =
    `mailto:ffbdistribuciones@gmail.com?subject=${subject}&body=${body}`;
});
