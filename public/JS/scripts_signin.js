// --- REGISTRE CLIENT ---
const form = document.getElementById('registre_client');
const missatge = document.getElementById('missatge');

form.addEventListener('submit', async function(e) {
  e.preventDefault(); // Evita recargar la página

  const nom = document.getElementById('nom').value;
  const cognom = document.getElementById('cognom').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('contrasena').value;
  const confirmPassword = document.getElementById('confirmar_contrasena').value;
  const rol = document.getElementById('rol').value;

  // Validació de contrasenyes
  if (password !== confirmPassword) {
    missatge.textContent = "Les contrasenyes no coincideixen";
    missatge.style.color = "red";
    return;
  }

  // Validació de camps buits
  if (!email || !password) {
    missatge.textContent = "Has d'introduir un email i una contrasenya.";
    missatge.style.color = "red";
    return;
  }

  // Crear objete usuari i guardar en localStorage
  // const nouUsuari = {
  //   id: Date.now(),
  //   nom,
  //   cognom,
  //   email,
  //   contrasenya: password,
  //   rol
  // };

  const resEmail = await fetch(`/api/usuaris/comprovar/${encodeURIComponent(email.trim())}`);
  const data = await resEmail.json();
  if (data.existeix) {
    missatge.textContent = "Ja existeix un usuari amb aquest correu electrònic.";
    missatge.style.color = "red";
    return;
  }

  const resInserir = await fetch("/api/usuaris", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nom: `${nom.trim()}`,
      cognoms: `${cognom.trim()}`,
      email: `${email.trim()}`,
      contrasenya: `${password.trim()}`,
      rol: `${rol}`
    })
  });

  if (!resInserir.ok) throw new Error("No s'ha pogut inserir l'usuari.");
  e.target.reset();

  // --- Guardar en localStorage en el mateix array que utilitza usuaris.html ---
  // let usuarisGuardats = JSON.parse(localStorage.getItem("usuarisCantina")) || [];

  // // Evitar correus duplicats
  // const existeix = usuarisGuardats.some(u => u.email.toLowerCase() === email.toLowerCase());
  // if (existeix) {
  //   missatge.textContent = "Ja existeix un usuari amb aquest correu electrònic.";
  //   missatge.style.color = "red";
  //   return;
  // }

  // usuarisGuardats.push(nouUsuari);
  // localStorage.setItem("usuarisCantina", JSON.stringify(usuarisGuardats));

  missatge.textContent = "Usuari registrat correctament!";
  missatge.style.color = "green";

  form.reset(); // Netejar formulari
});