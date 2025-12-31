// --- GESTIÓ DE MAGATZEM ---
let platsRegistrats = [];

// --- FUNCIONS LOCALSTORAGE ---
function guardarPlatsALocalStorage() {
  localStorage.setItem("platsCantina", JSON.stringify(platsRegistrats));
}

async function carregarMenu() {
  const res = await fetch("/api/menu_cantina");
  const plats = await res.json();

  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";

  
  if (plats.length === 0) {
    tbody.innerHTML =
      `<tr><td colspan="6" class="nota">Encara no hi ha plats</td></tr>`;
    return;
  }

  console.log(plats);
  plats.forEach(p => mostrarMenu(p));
}

function mostrarMenu(p) {
  const tbody = document.querySelector("table tbody");

  console.log(p);
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${p.id}</td>
    <td>${p.menu ?? "—"}</td>
    <td>${p.beguda ?? "—"}</td>
    <td>${p.alergens && p.alergens !== "0" ? p.alergens : "Cap al·lèrgen"}</td>
    <td>${p.quantitat}</td>
    <td>${Number(p.preu).toFixed(2)} €</td>
    <td>
      <button onclick="incrementarMenu(${p.id})">➕</button>
      <button onclick="eliminarPlat(${p.id})">🗑️</button>
    </td>
  `;
  tbody.appendChild(tr);
}

// Torna la data al format original
function convertirDataAInput(data) {
  const [dd, mm, yyyy] = data.split("-");
  return `${yyyy}-${mm}-${dd}`;
}

async function incrementarMenu(id) {
  try {
    const res = await fetch(`/api/menu_cantina/${id}/quantitat`, { method: "PATCH" });
    if (!res.ok) throw new Error("No s'ha pogut incrementar el menú.");
    carregarMenu();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function eliminarMenu(id) {
  if (!confirm("Eliminar plat?")) return;

  try {
    const res = await fetch(`/api/menu_cantina/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No s'ha pogut eliminar el menú.");
    carregarMenu(); // recarregar la taula
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// --- FUNCIONALITAT FORMULARI ---
document.querySelector("form").addEventListener("submit", async e => {
  e.preventDefault();

  const menuCantina = document.querySelector('input[name="menuCantina"]:checked');
  const beguda = document.querySelector('input[name="beguda"]:checked');

  if (!menuCantina || !beguda ) {
    alert("Omple tots els camps correctament.");
    return;
  }

  const preuMenu = Number(menuCantina.dataset.preu);
  const preuBeguda = Number(beguda.dataset.preu);

  const preuTotal = preuMenu + preuBeguda;

  const alergensMenu = menuCantina.dataset.alergies;
  console.log(alergensMenu);

  const lblMenu = menuCantina.nextElementSibling;
  const lblBeguda = beguda.nextElementSibling;

  // Enviar dades al backend
  try {
    const res = await fetch("/api/menu_cantina", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menu: `${lblMenu.querySelector(".nomMenu").textContent.trim()}`,
        beguda: `${lblBeguda.querySelector(".nomBeguda").textContent.trim()}`,
        alergens: alergensMenu, //[...new Set(alergies)].join(", "),
        quantitat: 1,
        preu: `${Number(preuTotal).toFixed(2)}`
      })
    });

    if (!res.ok) throw new Error("No s'ha pogut guardar el menú.");

    e.target.reset();   // netejar formulari
    carregarMenu();    // recarregar taula
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

// --- CÀRREGA INICIAL ---
window.addEventListener("DOMContentLoaded", carregarMenu);