// --- GESTIÓ DE PLATS SETMANALS ---

let platsSetmanalsRegistrats = [];

// --- FUNCIONS LOCALSTORAGE ---
function guardarPlatsSetmanalsALocalStorage() {
  localStorage.setItem("platsSetmanals", JSON.stringify(platsSetmanalsRegistrats));
}

function carregarPlatsSetmanals() {
  const dadesGuardades = localStorage.getItem("platsSetmanals");

  // Neteja totes les taules
  document.querySelectorAll("tbody[id^='taula-']").forEach(tbody => tbody.innerHTML = "");

  if (dadesGuardades) {
    platsSetmanalsRegistrats = JSON.parse(dadesGuardades);

    if (platsSetmanalsRegistrats.length > 0) {
      platsSetmanalsRegistrats.forEach((platSetmanal) => mostrarPlatSetmanalEnDOM(platSetmanal));
    } else {
      taulaBody.innerHTML =
        '<tr><td colspan="4" style="text-align:center;">Encara no hi han plats setmanals registrats</td></tr>';
    }
  } else {
    platsSetmanalsRegistrats = [];
    taulaBody.innerHTML =
      '<tr><td colspan="4" style="text-align:center;">Encara no hi han plats setmanals registrats</td></tr>';
  }
}

// --- FUNCIONS DE RENDER, ELIMINAR I EDITAR ---
function mostrarPlatSetmanalEnDOM(platSetmanal) {
  const taulaBody = document.getElementById(`${platSetmanal.dia}`);
  if (!taulaBody) return;

  // Eliminar missatge "Encara no hi ha plats registrats" si existe
  const missatgeFila = taulaBody.querySelector("tr td[colspan]");
  if (missatgeFila) missatgeFila.parentElement.remove();

  const novaFila = document.createElement("tr");
  novaFila.dataset.id = platSetmanal.id;

  novaFila.innerHTML = `
    <td>${platSetmanal.plat}</td>
    <td>${platSetmanal.preu}</td>
    <td>${platSetmanal.alergen}</td>
    <td>
      <button class="btn-editar" data-id="${platSetmanal.id}">✏️</button>
      <button class="btn-eliminar" data-id="${platSetmanal.id}">🗑️</button>
    </td>
  `;

  taulaBody.appendChild(novaFila);

  // Event listeners
  novaFila.querySelector(".btn-eliminar").addEventListener("click", eliminarPlatSetmanal);
  novaFila.querySelector(".btn-editar").addEventListener("click", editarPlatSetmanal);
}

function eliminarPlatSetmanal(e) {
  const idAEsborrar = parseInt(e.currentTarget.dataset.id);
  const plat = platsSetmanalsRegistrats.find((b) => b.id === idAEsborrar);
  if (!plat) return;

  const taulaBody = document.getElementById(`taula-${plat.dia}`);
  const filaDOM = document.querySelector(`tr[data-id="${idAEsborrar}"]`);
  if (filaDOM) filaDOM.remove();

  platsSetmanalsRegistrats = platsSetmanalsRegistrats.filter(b => b.id !== idAEsborrar);
  guardarPlatsSetmanalsALocalStorage();

  if (taulaBody.children.length === 0) {
    taulaBody.innerHTML =
      '<tr><td colspan="4" style="text-align:center;">Encara no hi han plats setmanals registrats.</td></tr>';
  }
}

function editarPlatSetmanal(e) {
  const idAEditar = parseInt(e.currentTarget.dataset.id);
  const platSetmanal = platsSetmanalsRegistrats.find(b => b.id === idAEditar);
  if (!platSetmanal) return;

  // Omplir formulari amb les dades existents
  document.querySelector('select[name="plat"]').value = platSetmanal.plat;
  document.querySelector('select[name="dia"]').value = platSetmanal.dia;

  // Canviar l'event del submit per actualitzar
  const form = document.querySelector("form");
  form.removeEventListener("submit", afegirPlatSeleccionat);
  form.addEventListener("submit", function actualitzarPlatSeleccionat(ev) {
    ev.preventDefault();

    const plat = document.querySelector('select[name="plat"]').value;
    const dia = document.querySelector('select[name="dia"]').value;

    if (!plat || !dia) {
      alert("Si us plau, omple tots els camps correctament.");
      return;
    }

    // Actualitzar dades
    platSetmanal.plat = plat;
    platSetmanal.preu = 3;
    platSetmanal.alergen = "";
    platSetmanal.dia = dia;

    guardarPlatsSetmanalsALocalStorage();

    // Actualitzar DOM
    const filaDOM = document.querySelector(`tr[data-id="${platSetmanal.id}"]`);
    filaDOM.innerHTML = `
      <td>${platSetmanal.plat}</td>
      <td>${platSetmanal.preu}</td>
      <td>${platSetmanal.alergen}</td>
      <td>
        <button class="btn-editar" data-id="${platSetmanal.id}">✏️</button>
        <button class="btn-eliminar" data-id="${platSetmanal.id}">🗑️</button>
      </td>
    `;

    filaDOM.querySelector(".btn-eliminar").addEventListener("click", eliminarPlatSetmanal);
    filaDOM.querySelector(".btn-editar").addEventListener("click", editarPlatSetmanal);

    form.reset();
    form.removeEventListener("submit", actualitzarPlatSeleccionat);
    form.addEventListener("submit", afegirPlatSeleccionat);
  });
}

// --- FUNCIONALITAT FORMULARI ---
// Funció separada per poder-la reaprofitar en editar
function afegirPlatSeleccionat(e) {
  e.preventDefault();

  const plat = document.querySelector('select[name="plat"]').value;
  const dia = document.querySelector('select[name="dia"]').value;

  if (!plat || !dia) {
    alert("Si us plau, omple tots els camps correctament.");
    return;
  }

  const nouItem = {
    id: Date.now(),
    plat: plat,
    preu: 8,
    alergen: "",
    dia: dia
  };

  platsSetmanalsRegistrats.push(nouItem);
  guardarPlatsSetmanalsALocalStorage();
  mostrarPlatSetmanalEnDOM(nouItem);

  e.target.reset();
}

document.querySelector("form").addEventListener("submit", afegirPlatSeleccionat);

// --- CÀRREGA INICIAL ---
window.addEventListener("DOMContentLoaded", carregarPlatsSetmanals);
