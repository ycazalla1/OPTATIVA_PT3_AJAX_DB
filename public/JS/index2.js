//import { mostrarPlats } from "./obtenirPlats";

// --- GESTIÓ DE MAGATZEM ---
let platsRegistrats = [];

// --- FUNCIONS LOCALSTORAGE ---
function guardarPlatsALocalStorage() {
  localStorage.setItem("platsCantina", JSON.stringify(platsRegistrats));
}
/*
function carregarMenu() {
  const dadesGuardades = localStorage.getItem("platsCantina");
  const taulaBody = document.querySelector("table tbody");
  taulaBody.innerHTML = ""; // Neteja la taula abans d'afegir

  if (dadesGuardades) {
    platsRegistrats = JSON.parse(dadesGuardades);

    if (platsRegistrats.length > 0) {
      platsRegistrats.forEach((platCantina) => mostrarPlatEnDOM(platCantina));
    } else {
      taulaBody.innerHTML =
        '<tr><td colspan="6" style="text-align:center;">Encara no hi han plats registrats.</td></tr>';
    }
  } else {
    platsRegistrats = [];
    taulaBody.innerHTML =
      '<tr><td colspan="6" style="text-align:center;">Encara no hi han plats registrats.</td></tr>';
  }
}*/

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

  //mostrarPlats();
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

// function editarPlat(e) {
//   const idAEditar = parseInt(e.currentTarget.dataset.id);
//   const platCantina = platsRegistrats.find(b => b.id === idAEditar);
//   if (!platCantina) return;

//   // Omplir formulari amb les dades existents
//   document.querySelector('input[name="Data"]').value = convertirDataAInput(platCantina.data);
//   document.querySelector('select[name="Producte"]').value = platCantina.producte;
//   document.querySelector('input[name="Quantitat"]').value = platCantina.stock;
//   document.querySelector('textarea[name="Comentari"]').value = platCantina.comentari;

//   // Canviar l'event del submit per actualitzar
//   const form = document.querySelector("form");
//   form.removeEventListener("submit", afegirItem);
//   form.addEventListener("submit", function actualitzarStock(ev) {
//     ev.preventDefault();

//     const dataInput = document.querySelector('input[name="Data"]').value.trim();
//     const [yyyy, mm, dd] = dataInput.split("-");
//     const data = `${dd}-${mm}-${yyyy}`;
//     const producte = document.querySelector('select[name="Producte"]').value;
//     const stock = parseFloat(document.querySelector('input[name="Quantitat"]').value);
//     const comentari = document.querySelector('textarea[name="Comentari"]').value.trim();

//     if (!data || !producte || isNaN(stock)) {
//       alert("Si us plau, omple tots els camps correctament.");
//       return;
//     }

//     // Actualitzar dades
//     platCantina.data = data;
//     platCantina.producte = producte;
//     platCantina.stock = stock;
//     platCantina.comentari = comentari;

//     guardarPlatsALocalStorage();

//     // Actualitzar DOM
//     const filaDOM = document.querySelector(`tr[data-id="${platCantina.id}"]`);
//     filaDOM.innerHTML = `
//       <td>${platCantina.data}</td>
//       <td>${platCantina.producte}</td>
//       <td>${platCantina.stock}</td>
//       <td>${platCantina.comentari}</td>
//       <td>
//         <button class="btn-editar" data-id="${platCantina.id}">✏️</button>
//         <button class="btn-eliminar" data-id="${platCantina.id}">🗑️</button>
//       </td>
//     `;

//     filaDOM.querySelector(".btn-eliminar").addEventListener("click", eliminarPlat);
//     filaDOM.querySelector(".btn-editar").addEventListener("click", editarPlat);

//     form.reset();
//     form.removeEventListener("submit", actualitzarStock);
//     form.addEventListener("submit", afegirItem);
//   });
// }

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

  // const alergies = [
  //   ...(MAPA_ALLERGENS[platPrincipal.value] || []),
  //   ...(MAPA_ALLERGENS[beguda.value] || [])
  // ];

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

/*
// Funció separada per poder-la reaprofitar en editar
function afegirItem(e) {
  e.preventDefault();

  const dataInput = document.querySelector('input[name="Data"]').value.trim();
  const [yyyy, mm, dd] = dataInput.split("-");
  const data = `${dd}-${mm}-${yyyy}`;
  const producte = document.querySelector('select[name="Producte"]').value;
  const stock = parseFloat(document.querySelector('input[name="Quantitat"]').value);
  const comentari = document.querySelector('textarea[name="Comentari"]').value.trim();

  if (!data || !producte || isNaN(stock)) {
    alert("Si us plau, omple tots els camps correctament.");
    return;
  }

  const nouItem = {
    id: Date.now(),
    data,
    producte,
    stock,
    comentari
  };

  platsRegistrats.push(nouItem);
  guardarPlatsALocalStorage();
  mostrarPlatEnDOM(nouItem);

  e.target.reset();
}*/

//document.querySelector("form").addEventListener("submit", afegirItem);

// --- CÀRREGA INICIAL ---
window.addEventListener("DOMContentLoaded", carregarMenu);