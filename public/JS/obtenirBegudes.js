async function mostrarBeguda() {
    const res = await fetch("/api/begudes");
    const begudes = await res.json();
    console.log(begudes);

    const div = document.getElementById("begudes");

    if (begudes.length === 0) {
        div.innerHTML =
        `<p class="nota">Encara no hi han begudes.</p>`;
        return;
    }

    begudes.forEach(b => seleccioBeguda(b));
}

function seleccioBeguda(b) {
    const div = document.getElementById("begudes");

    const idBeguda = `beguda_${b.nom.replace(/\s+/g, "_")}`;

    const seleccio = document.createElement("input");
    seleccio.type = "radio";
    seleccio.name = "beguda";
    seleccio.required = true;
    seleccio.id = idBeguda;
    seleccio.value = b.nom;
    seleccio.dataset.tipus = b.tipus;
    seleccio.dataset.preu = b.preu;

    const label = document.createElement("label");
    label.htmlFor = idBeguda;
    label.innerHTML = `
        <span class="icona-producte">${tipusBeguda(b.tipus)}</span>
        <span class="nomBeguda">
            ${b.nom}
        </span><br>
        <span class="preuBeguda">
            ${Number(b.preu).toFixed(2)} €
        </span>
    `;

    div.appendChild(seleccio);
    div.appendChild(label);
    div.appendChild(document.createElement("br"));
}

function tipusBeguda(t) {
  if (t === "aigua") {
    return "💧";
  } else if (t === "suc") {
    return "🧃";
  } else if (t === "begudaCalent") {
    return "☕🧉";
  } else if (t === "refresc") {
    return "🥤";
  } else {
    return "";
  }
}

document.addEventListener("DOMContentLoaded", mostrarBeguda);