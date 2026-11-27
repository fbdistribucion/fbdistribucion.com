
document.getElementById("year").textContent = new Date().getFullYear();

// Menú de servicios: en pantallas táctiles se abre y se cierra al tocar.
const dropdown = document.querySelector(".dropdown");
const dropdownButton = document.querySelector(".nav-button");

dropdownButton.addEventListener("click", () => {
  const isOpen = dropdown.classList.toggle("open");
  dropdownButton.setAttribute("aria-expanded", String(isOpen));
});

// Mostrar orientación general.
// No se consultan buzones ni se recuperan códigos.
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
