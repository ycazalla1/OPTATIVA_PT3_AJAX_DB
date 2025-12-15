const MAPA_ALLERGENS = {
  patates_base: [],
  ou_fregit: ["Ou"],
  amanida_base: [],
  arros_industrial: [],
  carn: [],
  amanida_guarnisio_alegics: ["Lactosa", "Ou"]
};



async function carregarPlats() {
  const res = await fetch("/api/plats_combinats");
  const plats = await res.json();

  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";

  if (plats.length === 0) {
    tbody.innerHTML =
      `<tr><td colspan="6" class="nota">Encara no hi ha plats</td></tr>`;
    return;
  }

  plats.forEach(p => mostrarPlat(p));
}

function mostrarPlat(p) {
  const tbody = document.querySelector("table tbody");

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${p.id}</td>
    <td>${p.nom}</td>
    <td>${p.acompanamient1 ?? "—"}</td>
    <td>${p.acompanamient2 ?? "—"}</td>
    <td>${p.alergies ?? "Cap al·lèrgen"}</td>
    <td>${Number(p.preu).toFixed(2)} €</td>
    <td>
      <button onclick="eliminarPlat(${p.id})">🗑️</button>
    </td>
  `;
  tbody.appendChild(tr);
}

async function eliminarPlat(id) {
  if (!confirm("Eliminar plat?")) return;

  await fetch(`/api/plats_combinats/${id}`, { method: "DELETE" });
  carregarPlats();
}

// FORM
document.querySelector("form").addEventListener("submit", async e => {
  e.preventDefault();

  const nom = document.getElementById("nom").value.trim();
  const acomp1 = document.querySelector('input[name="acomp1"]:checked');
  const acomp2 = document.querySelector('input[name="acomp2"]:checked');
  const preu = parseFloat(document.querySelector('input[name="precio"]').value);

  if (!nom || !acomp1 || !acomp2 || isNaN(preu)) {
    alert("Omple tots els camps correctament.");
    return;
  }

  const alergies = [
    ...(MAPA_ALLERGENS[acomp1.value] || []),
    ...(MAPA_ALLERGENS[acomp2.value] || [])
  ];

  e.target.reset();
  carregarPlats(); // recarga la tabla
});



document.addEventListener("DOMContentLoaded", carregarPlats);
