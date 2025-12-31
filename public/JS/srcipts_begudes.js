// --- GESTIÓ DE BEGUDES ---

//let begudesRegistrades = [];

// --- FUNCIONS LOCALSTORAGE ---
// function guardarItemsALocalStorage() {
//   localStorage.setItem("begudesCantina", JSON.stringify(itemsRegistrats));
// }

async function carregarBegudes() {
  //const dadesGuardades = localStorage.getItem("begudesCantina");
  const res = await fetch("/api/begudes");
  const begudes = await res.json();

  const taulaBody = document.querySelector("table tbody");
  taulaBody.innerHTML = ""; // Neteja la taula abans d'afegir

  if (begudes.length === 0) {
    taulaBody.innerHTML =
      `<tr><td colspan="6" style="text-align:center;">Encara no hi han begudes.</td></tr>`;
    return;
  }

  begudes.forEach(b => mostrarBeguda(b));
}

function mostrarBeguda(b) {
  const tbody = document.querySelector("table tbody");

  console.log(b);
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${b.id}</td>
    <td>${b.nom}</td>
    <td>${tipusBeguda(b.tipus)}</td>
    <td>${Number(b.preu).toFixed(2)} €</td>
    <td>${b.stock}</td>
    <td>
      <button onclick="editarBeguda(${b.id})">✏️</button>
      <button onclick="eliminarBeguda(${b.id})">🗑️</button>
    </td>
  `;
  tbody.appendChild(tr);
}

function tipusBeguda(t) {

  if (t === "aigua") {
    return "💧 Aigua";
  } else if (t === "suc") {
    return "🧃 Suc";
  } else if (t === "begudaCalent") {
    return "☕🧉 Beguda calent";
  } else if (t === "refresc") {
    return "🥤 Refresc";
  } else {
    return "Sense tipus";
  }
}

async function eliminarBeguda(id) {
  if (!confirm("Eliminar beguda?")) return;

  try {
    const res = await fetch(`/api/begudes/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No s'ha pogut eliminar la beguda.");
    carregarBegudes(); // recarrega la taula
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function editarBeguda(id) {
  const res = await fetch(`/api/begudes/${id}`);
  const beguda = await res.json();

  if (!beguda) return;

  // Omplir formulari amb les dades existents
  document.querySelector('input[name="nombre"]').value = beguda.nom;
  const radio = document.querySelector(`input[name="tipusBeguda"][value="${beguda.tipus}"]`);
  radio.checked = true;
  document.querySelector('input[name="precio"]').value = beguda.preu;
  document.querySelector('input[name="stock"]').value = beguda.stock;

  // Canviar l'event del submit per actualitzar
  const form = document.querySelector("form");
  form.removeEventListener("submit", afegirBeguda);
  form.addEventListener("submit", async function actualitzarBeguda(ev) {
    ev.preventDefault();

    const nom = document.querySelector('input[name="nombre"]').value.trim();
    const tipus = document.querySelector('input[name="tipusBeguda"]:checked');
    const preu = parseFloat(document.querySelector('input[name="precio"]').value);
    const stock = parseInt(document.querySelector('input[name="stock"]').value);

    if (!nom || !tipus || isNaN(preu) || isNaN(stock)) {
      alert("Si us plau, omple tots els camps correctament.");
      return;
    }

    // Actualitzar dades
    try {
      const res = await fetch(`/api/begudes/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom,
          tipus: tipus.value,
          preu: preu,
          stock: stock
        })
      });

      if (!res.ok) throw new Error("No s'ha pogut actualitzar la beguda");

      ev.target.reset();   // netejar formulari
      carregarBegudes();   // recarregar taula
    } catch (err) {
      console.error(err);
      alert(err.message);
    }

    form.reset();
    form.removeEventListener("submit", actualitzarBeguda);
    form.addEventListener("submit", afegirBeguda);
  });
}

// --- FUNCIONALITAT FORMULARI ---
// Funció separada per poder-la reaprofitar en editar
async function afegirBeguda(e) {
  e.preventDefault();

  const nom = document.querySelector('input[name="nombre"]').value.trim();
  const tipus = document.querySelector('input[name="tipusBeguda"]:checked');
  const preu = parseFloat(document.querySelector('input[name="precio"]').value);
  const stock = parseInt(document.querySelector('input[name="stock"]').value);

  if (!nom || !tipus || isNaN(preu) || isNaN(stock)) {
    alert("Si us plau, omple tots els camps correctament.");
    return;
  }

  try {
    const res = await fetch("/api/begudes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom: nom,
        tipus: tipus.value,
        preu: preu,
        stock: stock
      })
    });

    if (!res.ok) throw new Error("No s'ha pogut guardar la beguda");

    e.target.reset();   // netejar formulari
    carregarBegudes();    // recarregar taula
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

document.querySelector("form").addEventListener("submit", afegirBeguda);

// --- CÀRREGA INICIAL ---
window.addEventListener("DOMContentLoaded", carregarBegudes);
