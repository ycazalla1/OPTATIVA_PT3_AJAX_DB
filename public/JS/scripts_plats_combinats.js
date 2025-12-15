// --- MAPA D'AL·LÈRGENS ---
const MAPA_ALLERGENS = {
  "patates_base": [],
  "ou_fregit": ["Ou"],
  "amanida_base": [],
  "arros_industrial": [],
  "carn": [],
  "amanida_guarnisio_alegics": ["Lactosa", "Ou"],
};

let platsRegistrats = [];
let platActual = null; // Para el plato que se está editando

// --- GUARDAR Y CARGAR LOCALSTORAGE ---
function guardarPlatsALocalStorage() {
  localStorage.setItem("platsCombinats", JSON.stringify(platsRegistrats));
}

function carregarPlats() {

  const tbody = document.querySelector("table tbody");
  const datosGuardados = localStorage.getItem("platsCombinats");
  tbody.innerHTML = "";

  platsRegistrats = datosGuardados ? JSON.parse(datosGuardados) : [];

  if (platsRegistrats.length > 0) {
    platsRegistrats.forEach(plato => mostrarPlatEnTaula(plato));
  } else {
    tbody.innerHTML = `<tr><td colspan="6" class="nota">Encara no hi ha plats registrats.</td></tr>`;
  }
}

// --- MOSTRAR EN TAULA ---
function mostrarPlatEnTaula(plato) {
  const tbody = document.querySelector("table tbody");

  const alergenosHTML = plato.alergens.length
    ? plato.alergens.join(", ")
    : "Cap al·lèrgen";

  const novaFila = `
    <tr data-id="${plato.id}">
      <td>${plato.nom}</td>
      <td>${plato.acomp1}</td>
      <td>${plato.acomp2}</td>
      <td>${alergenosHTML}</td>
      <td>${plato.preu.toFixed(2)} €</td>
      <td>
        <button class="btn-editar" data-id="${plato.id}">✏️</button>
        <button class="btn-eliminar" data-id="${plato.id}">🗑️</button>
      </td>
    </tr>
  `;

  const nota = tbody.querySelector(".nota");
  if (nota) nota.remove();

  tbody.insertAdjacentHTML("beforeend", novaFila);

  // Botón eliminar
  const btnEliminar = tbody.querySelector(`.btn-eliminar[data-id="${plato.id}"]`);
  btnEliminar.addEventListener("click", eliminarPlat);

  // Botón editar
  const btnEditar = tbody.querySelector(`.btn-editar[data-id="${plato.id}"]`);
  btnEditar.addEventListener("click", editarPlat);
}

// --- ELIMINAR PLAT ---
function eliminarPlat(e) {
  const id = e.currentTarget.dataset.id;

  const confirmar = confirm("¿Segur que vols eliminar aquest plat?");
  if (!confirmar) return;

  platsRegistrats = platsRegistrats.filter(p => p.id != id);
  guardarPlatsALocalStorage();

  const fila = e.currentTarget.closest("tr");
  fila.remove();

  const tbody = document.querySelector("table tbody");
  if (platsRegistrats.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="nota">Encara no hi ha plats registrats.</td></tr>`;
  }
}

// --- EDITAR PLAT ---
function editarPlat(e) {
  const id = e.currentTarget.dataset.id;
  platActual = platsRegistrats.find(p => p.id == id);

  if (!platActual) return;

  // Cargar datos en el formulario
  document.getElementById("nom").value = platActual.nom;
  document.querySelector(`input[name="acomp1"][value="${platActual.acomp1Key}"]`).checked = true;
  document.querySelector(`input[name="acomp2"][value="${platActual.acomp2Key}"]`).checked = true;
  document.querySelector('input[name="precio"]').value = platActual.preu;

  // Cambiar texto del botón para indicar edición
  document.querySelector("form button[type='submit']").textContent = "Actualizar Plat";
}

// --- GESTIÓN DEL FORMULARIO ---
document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("form");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const nom = document.getElementById("nom").value.trim();
    const acomp1Sel = document.querySelector('input[name="acomp1"]:checked');
    const acomp2Sel = document.querySelector('input[name="acomp2"]:checked');
    const preu = parseFloat(form.querySelector('input[name="precio"]').value);

    if (!nom || !acomp1Sel || !acomp2Sel || isNaN(preu)) {
      alert("Omple tots els camps correctament.");
      return;
    }

    const acomp1Key = acomp1Sel.value;
    const acomp2Key = acomp2Sel.value;
    const acomp1Nom = acomp1Sel.nextElementSibling.textContent.trim();
    const acomp2Nom = acomp2Sel.nextElementSibling.textContent.trim();

    // Calcular alérgenos
    const alergenosTotals = [
      ...(MAPA_ALLERGENS[acomp1Key] || []),
      ...(MAPA_ALLERGENS[acomp2Key] || [])
    ];
    const alergenosUnics = [...new Set(alergenosTotals)].sort();

    if (platActual) {
      // Actualizar plato existente
      platActual.nom = nom;
      platActual.acomp1 = acomp1Nom;
      platActual.acomp2 = acomp2Nom;
      platActual.acomp1Key = acomp1Key;
      platActual.acomp2Key = acomp2Key;
      platActual.preu = preu;
      platActual.alergens = alergenosUnics;
      platActual = null;

      guardarPlatsALocalStorage();
      carregarPlats();

      document.querySelector("form button[type='submit']").textContent = "Afegir/Actualitzar Plat";
    } else {
      // Crear nuevo plato
      const nouPlat = {
        id: Date.now().toString(),
        nom: nom,
        acomp1: acomp1Nom,
        acomp2: acomp2Nom,
        acomp1Key: acomp1Key,
        acomp2Key: acomp2Key,
        preu: preu,
        alergens: alergenosUnics
      };

      platsRegistrats.push(nouPlat);
      guardarPlatsALocalStorage();
      mostrarPlatEnTaula(nouPlat);
    }

    form.reset();
  });

  carregarPlats();
});
