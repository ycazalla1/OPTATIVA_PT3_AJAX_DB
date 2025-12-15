async function cargarPlats() {
  try {
    const response = await fetch("/api/plats_combinats");
    if (!response.ok) throw new Error("Error en la API");
    const plats = await response.json();

    console.log(plats); // 🔹 Depuración: verifica qué llega

    const tbody = document.getElementById("tabla-plats");
    const tbodyCombinats = document.getElementById("tabla-combinats");
    tbody.innerHTML = "";
    tbodyCombinats.innerHTML = "";
    plats.forEach(plat => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${plat.nom}</td>
        <td>${plat.acompanamient1 ?? "—"} </td>
        <td>${plat.acompanamient2 ?? "—"}</td>
        
        <td>${plat.alergies ?? "—"}</td>
        <td>${plat.preu} €</td>
      `;
      tbodyCombinats.appendChild(tr);
    });


  } catch (error) {
    console.error("Error cargando platos:", error);
  }
}



cargarPlats();
