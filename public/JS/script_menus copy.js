// Versión 1
window.addEventListener("DOMContentLoaded", () => {
  const usuariLoguejat = JSON.parse(localStorage.getItem("usuariLoguejat"));

  if (!usuariLoguejat) {
    // No hi ha usuari loguejat: ocultar tot el menú
    const menu = document.querySelector(".nav-menu");
    if (menu) menu.style.display = "none";
  } else {
    const menuItems = document.querySelectorAll(".nav-menu li");

    menuItems.forEach(li => {
        const link = li.querySelector("a").getAttribute("href");

        // Solo admin puede ver estas páginas
        const adminOnly = [
        "usuaris.html",
        "registre_admin.html",
        "gestio_begudes.html",
        "Plats_Combinats.html",
        "plats_combinats2.html",
        "alergies.html",
        "magatzem.html",
        "menuSetmanal.html"
        ];

        // Solo admin puede ver estas páginas
        if (adminOnly.includes(link) && usuariLoguejat.rol !== "admin") {
        li.style.display = "none";
        }
    });
  }

  // Ejemplo: ocultar botón de añadir usuario si no es admin
//   const afegirBtn = document.getElementById("afegir");
//   if (afegirBtn && usuariLoguejat.rol !== "admin") {
//     afegirBtn.style.display = "none";
//   }
});

// Versión 2
window.addEventListener("DOMContentLoaded", () => {
  const usuariLoguejat = JSON.parse(localStorage.getItem("usuariLoguejat"));

  const menu = document.querySelector(".nav-menu");
  if (!menu) return;

//   if (!usuariLoguejat) {
//     // Si no hay usuario logueado: ocultamos todo excepto registre_client.html
//     menuItems.forEach(li => {
//       const link = li.querySelector("a").getAttribute("href");
//       if (link !== "registre_client.html") {
//         li.style.display = "none";
//       } else {
//         li.style.display = "block"; // Aseguramos que se vea el enlace
//       }
//     });
//     return; // Salimos del script
//   }

  const menuItems = menu.querySelectorAll("li");
  const adminOnly = [
    "usuaris.html",
    "registre_admin.html",
    "gestio_begudes.html",
    "Plats_Combinats.html",
    "plats_combinats2.html",
    "alergies.html",
    "magatzem.html",
    "menuSetmanal.html"
  ];

  menuItems.forEach(li => {
    const link = li.querySelector("a").getAttribute("href").toLowerCase();
    if (adminOnly.includes(link) && usuariLoguejat.rol.toLowerCase() !== "admin") {
        li.style.display = "none";
    }
    });
});

