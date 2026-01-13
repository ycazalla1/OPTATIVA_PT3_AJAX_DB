// --- GESTIÓ DE MAGATZEM ---

async function carregarStock() {
  const res = await fetch("/api/magatzem");
  const items = await res.json();

  const taulaBody = document.querySelector("table tbody");
  taulaBody.innerHTML = ""; // Neteja la taula abans d'afegir

  if (items.length === 0) {
    taulaBody.innerHTML =
      '<tr><td colspan="6" style="text-align:center;">Encara no hi ha stock registrat.</td></tr>';
    return;
  }

  console.log(items);
  items.forEach(i => mostrarItem(i));
}

function mostrarItem(i) {
  const tbody = document.querySelector("table tbody");

  console.log(i);
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${convertirDataAOutput(i.data)}</td>
    <td>${i.producte}</td>
    <td>${i.stock}</td>
    <td>${i.comentari ?? "—"}</td>
    <td>
      <button onclick="editarItem(${i.id})">✏️</button>
      <button onclick="eliminarItem(${i.id})">🗑️</button>
    </td>
  `;
  tbody.appendChild(tr);
}

// Torna la data al format original
function convertirDataAInput(data) {
  const [dd, mm, yyyy] = data.split("-");
  return `${yyyy}-${mm}-${dd}`;
}

function convertirDataAOutput(data) {
  const newData = new Date(data);

  const dd = String(newData.getDate()).padStart(2, "0");
  const mm = String(newData.getMonth() + 1).padStart(2, "0");
  const yyyy = newData.getFullYear();

  const resultat = `${yyyy}-${mm}-${dd}`;
  return(resultat);
}

async function eliminarItem(id) {
  if (!confirm("Eliminar ítem?")) return;

  try {
    const res = await fetch(`/api/magatzem/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No s'ha pogut eliminar l'ítem.");
    carregarStock(); // recarregar la taula
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

async function editarItem(id) {
  const res = await fetch(`/api/magatzem/${id}`);
  const item = await res.json();

  if (!item) return;

  // Omplir formulari amb les dades existents
  document.querySelector('input[name="Data"]').value = convertirDataAOutput(item.data);
  document.querySelector('select[name="Producte"]').value = item.producte;
  document.querySelector('input[name="Quantitat"]').value = item.stock;
  document.querySelector('textarea[name="Comentari"]').value = item.comentari;

  // Canviar l'event del submit per actualitzar
  const form = document.querySelector("form");
  form.removeEventListener("submit", afegirItem);
  form.addEventListener("submit", async function actualitzarStock(ev) {
    ev.preventDefault();

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

    try {
      const res = await fetch(`/api/magatzem/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: convertirDataAInput(data),
          producte: producte,
          stock: stock,
          comentari: comentari
        })
      });

      if (!res.ok) throw new Error("No s'ha pogut actualitzar l'ítem.");

      carregarStock();

    } catch (err) {
      console.error(err);
      alert(err.message);
    }

    form.reset();
    form.removeEventListener("submit", actualitzarStock);
    form.addEventListener("submit", afegirItem);
  });
}

// --- FUNCIONALITAT FORMULARI ---
// Funció separada per poder-la reaprofitar en editar
async function afegirItem(e) {
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

  try {
    const res = await fetch("/api/magatzem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: convertirDataAInput(data),
        producte: producte,
        stock: stock,
        comentari: comentari
      })
    });

    if (!res.ok) throw new Error("No s'ha pogut guardar la beguda");

    e.target.reset();   // netejar formulari
    carregarStock();    // recarregar taula
  } catch (err) {
    console.error(err);
    alert(err.message);
  }

}

document.querySelector("form").addEventListener("submit", afegirItem);

// --- CÀRREGA INICIAL ---
window.addEventListener("DOMContentLoaded", carregarStock);
