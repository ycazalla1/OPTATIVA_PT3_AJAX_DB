const MAPA_ALLERGENS = {
  patates_base: [],
  ou_fregit: ["Ou"],
  amanida_base: [],
  arros_industrial: [],
  carn: [],
  amanida_guarnisio_alegics: ["Lactosa", "Ou"]
};

async function carregarMenu() {
  const res = await fetch("/api/plats_combinats");
  const plats = await res.json();

  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";

  
  if (plats.length === 0) {
    tbody.innerHTML =
      `<tr><td colspan="6" class="nota">Encara no hi ha plats</td></tr>`;
    return;
  }

  plats.forEach(p => mostrarMenu(p));
}

function mostrarMenu(p) {
  const tbody = document.querySelector("table tbody");

  console.log(p);
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

  try {
    const res = await fetch(`/api/plats_combinats/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No s'ha pogut eliminar el plat");
    carregarMenu(); // recarga la tabla
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
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

  // 🔹 Enviar datos al backend
  try {
    const res = await fetch("/api/plats_combinats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom,
        acompanamient1: acomp1.nextElementSibling.textContent.trim(),
        acompanamient2: acomp2.nextElementSibling.textContent.trim(),
        alergies: [...new Set(alergies)].join(", "),
        preu
      })
    });

    if (!res.ok) throw new Error("No s'ha pogut guardar el plat");

    e.target.reset();   // limpiar formulario
    carregarMenu();    // recargar tabla
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});

document.addEventListener("DOMContentLoaded", carregarMenu);