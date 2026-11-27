document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("help-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);

  const subject = encodeURIComponent(
    "Consulta desde FB DISTRIBUCION"
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
