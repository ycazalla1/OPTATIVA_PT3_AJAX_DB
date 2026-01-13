// --- INICI DE SESSIÓ ---
const formLogin = document.getElementById("loginForm");

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("usuari").value;
  const password = document.getElementById("contrasena").value;
  const missatge = document.getElementById("missatge");

  // Cercar usuari
  const resInciarSessio = await fetch("/api/usuaris/iniciSessio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `${email.trim()}`,
      contrasenya: `${password.trim()}`
    })
  });

  const data = await resInciarSessio.json();

  if (!resInciarSessio.ok) {
    missatge.textContent = data.error;
    missatge.style.color = "red";
    return;
  }
  e.target.reset();

  // Guardem l'usuari loguejat
  localStorage.setItem("usuariLoguejat", JSON.stringify({
    email: data.usuari.email,
    rol: data.usuari.rol,
    nom: data.usuari.nom,
    cognom: data.usuari.cognom
  }));

  missatge.textContent = "Sessió iniciada correctament!";
  missatge.style.color = "green";

  setTimeout(() => {
    const DURACIO_SESSIO = 3600000;

    localStorage.setItem("usuariLoguejat", JSON.stringify({
      email: data.usuari.email,
      rol: data.usuari.rol,
      nom: data.usuari.nom,
      cognom: data.usuari.cognom,
      expira: Date.now() + DURACIO_SESSIO
    }));

    window.location.href = "index.html";
  }, 1000);
});