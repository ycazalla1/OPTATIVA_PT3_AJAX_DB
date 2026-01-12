const MAPA_ALLERGENS = {
  // ACOMPANYAMENT 1
  patates_base: [],               
  ou_fregit: ["Ou"],
  carn: [],
  gambes: ["Crustacis"],
  truita_francesa: ["Ou"],
  truita_patates: ["Ou"],
  ous_verdures: ["Ou"],            

  // ACOMPANYAMENT 2
  amanida: [],                
  arros_blanc: [],            
  amanida_pasta: ["Lactosa", "Ou"],  
  verdures: [],                    
  pure_patata: ["Lactosa"],       
  cuscus: ["Gluten"],              
  fideus: ["Gluten"]                
};


const MAPA_VALORES_VISUALES = {
  // ACOMPANYAMENT 1
  patates_base: "Patates fregides",
  ou_fregit: "Ou fregit",
  carn: "Bacon",
  gambes: "Gambes saltejades",
  truita_francesa: "Truita francesa",
  truita_patates: "Truita de patates",
  ous_verdures: "Ous remenats amb verdures",
  // ACOMPANYAMENT 2
  amanida: "Amanida",
  arros_blanc: "Arròs Blanc",
  amanida_pasta: "Amanida de pasta",
  verdures: "Verdures a la planxa",
  pure_patata: "Puré de patata",
  cuscus: "Cuscús",
  fideus: "Fideus"
};


async function carregarMenu() {
  const res = await fetch("/api/plats_combinats");
platsActuals = await res.json();
  const tbody = document.querySelector("table tbody");
  tbody.innerHTML = "";


  if (platsActuals.length === 0) {
    tbody.innerHTML =
      `<tr><td colspan="7" class="nota">Encara no hi ha plats</td></tr>`;
    return;
  }

  platsActuals.forEach(p => mostrarPlats(p));
}


function mostrarPlats(p) {
  const tbody = document.querySelector("table tbody");

  console.log(p);
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${p.nom}</td>
    <td>${p.acompanyament1 ?? "—"}</td>
    <td>${p.acompanyament2 ?? "—"}</td>
    <td>${p.alergies ?? "Cap al·lèrgen"}</td>
    <td>${Number(p.preu).toFixed(2)} €</td>
    <td>
      <button onclick="editarPlat(${p.id})">✏️</button>
    </td>
    <td>
      <button onclick="eliminarPlat(${p.id})">🗑️</button>
    </td>
  `;
  tbody.appendChild(tr);
}

let platEditantId = null;

let platsActuals = [];


function editarPlat(id) {
  // Assegurarse de que id sigui un número
  const numId = Number(id);


  const plat = platsActuals.find(p => p.id === numId);
  if (!plat) {
    mostrarPopup("Plat no trobat!", "error");
    return;
  }

  // POSAR VALORS AL FORMULARI
  document.getElementById("nom").value = plat.nom;
  const acomp1Id = Object.keys(MAPA_VALORES_VISUALES).find(
  key => MAPA_VALORES_VISUALES[key] === plat.acompanyament1
  );
  const acomp2Id = Object.keys(MAPA_VALORES_VISUALES).find(
    key => MAPA_VALORES_VISUALES[key] === plat.acompanyament2
  );

  const acomp1Input = document.getElementById(acomp1Id);
  if (acomp1Input) acomp1Input.checked = true;

  const acomp2Input = document.getElementById(acomp2Id);
  if (acomp2Input) acomp2Input.checked = true;

  document.querySelector('input[name="precio"]').value = plat.preu;

  platEditantId = numId;

  document.querySelector("form h2").textContent = "Editar Plat Combinat";
  document.querySelector("form button").textContent = "Guardar Canvis";

  document.getElementById("formulariPlat").scrollIntoView({ behavior: "smooth" });


    

}



/**
 * Funció per eliminar un plat
 * @param {*} id 
 * @returns 
 */
async function eliminarPlat(id) {
  if (!confirm("Eliminar plat?")) return;

  try {
    const res = await fetch(`/api/plats_combinats/${id}`, { method: "DELETE" });
    carregarMenu(); // recarga la tabla
    mostrarPopup("Plat eliminat correctament!", "info"); // popup de éxito
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}


/**
 * Funció per mostrar popup
 * @param {*} mensaje 
 * @param {*} tipo 
 */
function mostrarPopup(mensaje, tipo = "info") {
  const popup = document.createElement("div");
  popup.textContent = mensaje;
  popup.className = `popup ${tipo}`; 
  document.body.appendChild(popup);


  setTimeout(() => {
    popup.classList.add("visible");
  }, 10);

  setTimeout(() => {
    popup.classList.remove("visible");
    setTimeout(() => document.body.removeChild(popup), 300);
  }, 3000);
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
    ...(MAPA_ALLERGENS[acomp1.id] || []),
    ...(MAPA_ALLERGENS[acomp2.id] || [])
  ];
  
  // const alergies = [
  //   ...(MAPA_ALLERGENS[acomp1.value] || []),
  //   ...(MAPA_ALLERGENS[acomp2.value] || [])
  // ];


  try {
    let url = "/api/plats_combinats";
    let method = "POST";

    if (platEditantId) {
      platEditantId = Number(platEditantId); // 🔹 assegurar que és un número
      console.log("Editant plat id:", platEditantId); // 🔹 depuració
      url = `/api/plats_combinats/${platEditantId}`;
      method = "PUT";
    }



    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom,
        acompanyament1: MAPA_VALORES_VISUALES[acomp1.id], 
        acompanyament2: MAPA_VALORES_VISUALES[acomp2.id],
        alergies: [...new Set(alergies)].join(", "),
        preu
      })
    });


    if (!res.ok) throw new Error("No s'ha pogut guardar el plat");

    mostrarPopup(
      platEditantId ? "Plat actualitzat correctament!" : "Plat afegit correctament!",
      "info"
    );
    // Limpiar formulario y resetear estado
    e.target.reset();
    platEditantId = null;  // 🔹 reset del estado de edición
    document.querySelector("form h2").textContent = "Afegir Plat Combinat";
    document.querySelector("form button").textContent = "Afegir Plat";

    carregarMenu(); // recargar tabla
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});


document.addEventListener("DOMContentLoaded", async () => {
  await carregarMenu(); }
);