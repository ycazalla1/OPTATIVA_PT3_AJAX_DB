// --- VARIABLES GLOBALS ---
let usuarisRegistrats = [];

const openBtn = document.getElementById('afegir');
const closeBtn = document.getElementById('closeForm');
const dialog = document.getElementById('userForm');
const form = document.getElementById('addUserForm');
const taulaBody = document.querySelector("table tbody");

async function carregarUsuaris() {

  const res = await fetch("/api/usuaris");
  const usuaris = await res.json();

  taulaBody.innerHTML = "";

  if (usuaris.length === 0) {
    taulaBody.innerHTML =
      `<tr><td colspan="7" class="nota">Encara no hi han usuaris registrats.</td></tr>`;
    return;
  }

  console.log(usuaris);
  usuaris.forEach(u => mostrarUsuari(u));
}

function mostrarUsuari(u) {
  console.log(u.contrasenya);
  console.log(u.rol);
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${u.id}</td>
    <td>${u.nom}</td>
    <td>${u.cognoms}</td>
    <td>${u.email}</td>
    <td>${"•".repeat(u.contrasenya.length)}</td>
    <td>${u.rol}</td>
    <td>
      <button onclick="obrirFormulari(${u.id})">✏️</button>
      <button onclick="eliminarUsuari(${u.id})">🗑️</button>
    </td>
  `;
  taulaBody.appendChild(tr);
}

function mostrarMissatgeCapUsuaris() {
  taulaBody.innerHTML =
    '<tr><td colspan="7" style="text-align:center;">Encara no hi han usuaris registrats.</td></tr>';
}

// --- ELIMINAR ---
async function eliminarUsuari(id) {
  if (!confirm("Eliminar plat?")) return;

  try {
    const res = await fetch(`/api/usuaris/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No s'ha pogut eliminar l'usuari.");
    carregarUsuaris(); // recarregar la taula
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// --- OBRIR FORMULARI ---
async function obrirFormulari(id = null) {
  if (id) {
    // Edició
    const res = await fetch(`/api/usuaris/${id}`, { method: "GET" });
    const u = await res.json();
    console.log("cognoms: " + u.cognoms);

    form.dataset.editId = u.id;
    form.nom.value = u.nom;
    form.cognom.value = u.cognoms;
    form.email.value = u.email;
    form.contrasenya.value = u.contrasenya;
    form.rol.value = u.rol;
  } else {
    // Nou usuari
    delete form.dataset.editId;
    form.reset();
  }
  dialog.showModal();
}

// --- SUBMIT FORMULARI ---
async function submitForm(e) {
  e.preventDefault();
  const editId = form.dataset.editId;

  const nom = form.nom.value.trim();
  const cognom = form.cognom.value.trim();
  const email = form.email.value.trim();
  const contrasenya = form.contrasenya.value.trim();
  const rol = form.rol.value;

  if (!nom || !cognom || !email || !contrasenya || !rol) {
    alert("Si us plau, omple tots els camps correctament.");
    return;
  }

  if (editId) {
    // --- ACTUALITZAR ---
    const resId = await fetch(`/api/usuaris/${editId}`, { method: "GET" });
    const usuari = await resId.json();

    console.log("cognoms: " + usuari.cognoms);

    const resUpdate = await fetch(`/api/usuaris/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: `${usuari.nom.trim()}`,
        cognoms: `${usuari.cognoms.trim()}`,
        email: `${usuari.email.trim()}`,
        contrasenya: `${usuari.contrasenya.trim()}`,
        rol: `${usuari.rol}`
      })
    });

    if (!resUpdate.ok) throw new Error("No s'ha pogut actualitzar l'usuari.");
    e.target.reset();

    carregarUsuaris();
  } else {
    // --- AFEGIR ---
    // if (usuarisRegistrats.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    //   alert("Ja existeix un usuari amb aquest correu electrònic.");
    //   return;
    // }

    const resEmail = await fetch(`/api/usuaris/comprovar/${encodeURIComponent(email.trim())}`);
    const data = await resEmail.json();
    if (data.existeix) {
      alert("Ja existeix un usuari amb aquest correu electrònic.");
      return;
    }

    const resInserir = await fetch("/api/usuaris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: `${nom.trim()}`,
        cognoms: `${cognom.trim()}`,
        email: `${email.trim()}`,
        contrasenya: `${contrasenya.trim()}`,
        rol: `${rol}`
      })
    });

    if (!resInserir.ok) throw new Error("No s'ha pogut inserir l'usuari.");
    e.target.reset();

    carregarUsuaris();
  }

  form.reset();
  dialog.close();
}

// --- LISTENERS ---
openBtn.addEventListener('click', () => obrirFormulari());
closeBtn.addEventListener('click', () => dialog.close());
form.addEventListener('submit', submitForm);

// --- CÀRREGA INICIAL ---
window.addEventListener("DOMContentLoaded", carregarUsuaris);
