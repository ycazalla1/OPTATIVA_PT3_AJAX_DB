async function cargarPlats() {
  const res = await fetch("/api/plats_combinats");
  const plats = await res.json();

  const tbody = document.getElementById("tabla-combinats");
  tbody.innerHTML = "";

  plats.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nom}</td>
      <td>${p.acompanamient1 ?? "—"}</td>
      <td>${p.acompanamient2 ?? "—"}</td>
      <td>${p.alergies ?? "—"}</td>
      <td>${p.preu} €</td>
    `;
    tbody.appendChild(tr);
  });
}

cargarPlats();