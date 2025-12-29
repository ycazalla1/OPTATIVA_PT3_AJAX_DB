async function mostrarPlats() {
    const res = await fetch("/api/plats_combinats");
    const plats = await res.json();
    console.log(plats);

    const div = document.getElementById("plats_combinats");

    if (plats.length === 0) {
        div.innerHTML =
        `<p class="nota">Encara no hi han plats combinats.</p>`;
        return;
    }

    plats.forEach(p => seleccioMenu(p));
}

function seleccioMenu(p) {
    const div = document.getElementById("plats_combinats");

    const idPlat = `plat_principal_${p.nom.replace(/\s+/g, "_")}`;

    const seleccio = document.createElement("input");
    seleccio.type = "radio";
    seleccio.name = "menuCantina";
    seleccio.required = true;
    seleccio.id = idPlat;
    seleccio.value = p.nom;
    seleccio.dataset.preu = p.preu;
    seleccio.dataset.alergies = p.alergies;

    const label = document.createElement("label");
    label.htmlFor = idPlat;
    label.innerHTML = `
        <span class="nomMenu">
            ${p.nom}<br>
            ${p.acompanamient1 ?? "—"}<br>
            ${p.acompanamient2 ?? "—"}
        </span><br>
        <span class="alergiesMenu">
            ${p.alergies ?? "Cap al·lèrgen"}
        </span><br>
        <span class="preuMenu">
            ${Number(p.preu).toFixed(2)} €
        </span>
    `;

    div.appendChild(seleccio);
    div.appendChild(label);
    div.appendChild(document.createElement("br"));
}

document.addEventListener("DOMContentLoaded", mostrarPlats);