// --- GESTIÓ DE MENÚS ---
window.addEventListener("DOMContentLoaded", () => {
  const usuariLoguejat = JSON.parse(localStorage.getItem("usuariLoguejat"));
  console.log(usuariLoguejat);

  const menu = document.querySelector(".nav-menu");
  if (!menu) return;

  const menuItems = menu.querySelectorAll("li");

  const adminOnly = [
    "alergies.html",
    "gestio_begudes.html",
    "magatzem.html",
    "menuSetmanal.html",
    "plats_combinats.html",
    "usuaris.html"
  ];

  menuItems.forEach(li => {
    const a = li.querySelector("a");
    if (!a) return;

    const link = a.getAttribute("href");
    if (!link) return;

    // Si NO hi ha usuari o NO és admin → ocultar opcions admin
    if (!usuariLoguejat || usuariLoguejat.rol?.toLowerCase() !== "admin") {
      if (adminOnly.includes(link)) {
        li.style.display = "none";
      }
    }
  });
});