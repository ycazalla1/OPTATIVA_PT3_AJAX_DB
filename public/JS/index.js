// --- VARIABLES Y MAPAS GLOBALES ---
const CARTA_PRODUCTES = {
    // Definición de precios, complementos y alérgenos por producto
    "frankfurt_base": { nom: "Frankfurt amb pa", preu: 2.50, complements: true, alergenKeys: ["Gluten", "Soia"] },
    "brioixeria_base": { nom: "Brioixeria (Croissant/Donut)", preu: 1.80, complements: true, alergenKeys: ["Gluten", "Làctics", "Ou", "Soia"] },
    "brioixeria_industrial": { nom: "Brioixeria Industrial (Snack/Patates)", preu: 1.50, complements: false, alergenKeys: ["Gluten", "Làctics", "Ou", "Soia", "Fruits Secs"] },
    "beguda_sucre": { nom: "Refresc/Beguda Ensucrada", preu: 1.20, alergenKeys: [] },
    "beguda_aigua": { nom: "Aigua", preu: 1.00, alergenKeys: [] },
    "cafe_sol": { nom: "Cafè Sol/Tallat", preu: 1.10, alergenKeys: [] },
    "add_llet": { nom: "Extres: Llet (Làctics)", preu: 0.20, alergenKeys: ["Làctics"] }
};

let comandaActual = []; // Array para la vista Cliente
let platsRegistrats = []; // Array para la vista Admin (Alérgenos guardados)


// --- FUNCIONES DE NAVEGACIÓN Y VISTAS ---

function mostrarVista(vista) {
    document.getElementById('vista-client').style.display = (vista === 'client') ? 'block' : 'none';
    document.getElementById('vista-admin').style.display = (vista === 'admin') ? 'block' : 'none';
}


// --- LÓGICA DE VISTA CLIENT (COMANDA) ---
function renderComanda() {
    const llistaComandaDiv = document.getElementById('llistaComanda');
    const comandaTotalDiv = document.getElementById('comandaTotal');
    let totalComanda = 0;
    
    llistaComandaDiv.innerHTML = '';
    
    if (comandaActual.length === 0) {
        llistaComandaDiv.innerHTML = '<p class="nota">La comanda està buida.</p>';
    } else {
        comandaActual.forEach((item, index) => {
            const subtotal = item.preu * item.quantitat;
            totalComanda += subtotal;
            
            const itemHTML = `
                <div class="plato-item" data-index="${index}">
                    <div>
                        <strong>${item.nom}</strong> x ${item.quantitat} (${item.preu.toFixed(2)} €/u)<br>
                        <span style="font-size: 0.9em; color: var(--muted);">Total item: ${subtotal.toFixed(2)} €</span>
                    </div>
                    <div style="display: flex; gap: 5px; align-items: center;">
                        <button class="btn-eliminar btn-quantitat" data-index="${index}" data-accio="-">➖</button>
                        <button class="btn-eliminar btn-quantitat" data-index="${index}" data-accio="+">➕</button>
                        <button class="btn-eliminar" data-index="${index}" data-accio="eliminar">🗑️</button>
                    </div>
                </div>
            `;
            llistaComandaDiv.insertAdjacentHTML('beforeend', itemHTML);
        });
        
        // Añadimos los Event Listeners a los botones de cantidad/eliminación
        document.querySelectorAll('.btn-eliminar[data-index]').forEach(button => {
            button.addEventListener('click', gestionarQuantitat);
        });
    }

    comandaTotalDiv.textContent = `Total: ${totalComanda.toFixed(2)} €`;
}

function gestionarQuantitat(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const accio = e.currentTarget.dataset.accio;
    
    if (accio === '+') {
        comandaActual[index].quantitat += 1;
    } else if (accio === '-') {
        comandaActual[index].quantitat -= 1;
    } 
    
    // Si es eliminar o la cantidad llega a 0
    if (accio === 'eliminar' || (comandaActual[index] && comandaActual[index].quantitat <= 0)) {
        comandaActual.splice(index, 1);
    }
    
    renderComanda();
}

// Event de Formulari Client (Afegir a Comanda)
document.getElementById('formularioComanda').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const producteBaseRadio = document.querySelector('input[name="producteBaseClient"]:checked');
    if (!producteBaseRadio) return alert("Si us plau, selecciona un producte base.");

    const baseKey = producteBaseRadio.value;
    const itemBase = CARTA_PRODUCTES[baseKey];
    
    let preuTotalItem = itemBase.preu;
    let nomComplet = itemBase.nom;
    
    const begudaOpcional = document.getElementById('begudaOpcionalClient').value;
    const lletAfegida = document.getElementById('add_llet_client').checked;
    
    // Lógica de precios
    if (begudaOpcional) {
        preuTotalItem += CARTA_PRODUCTES[begudaOpcional].preu;
        nomComplet += ` + ${CARTA_PRODUCTES[begudaOpcional].nom}`;
    }
    if (lletAfegida) {
        preuTotalItem += CARTA_PRODUCTES['add_llet'].preu;
        nomComplet += ` + ${CARTA_PRODUCTES['add_llet'].nom}`;
    }
    
    comandaActual.push({
        nom: nomComplet,
        preu: preuTotalItem,
        quantitat: 1
    });

    document.getElementById('formularioComanda').reset();
    document.getElementById('complements-fieldset').style.display = 'none';
    renderComanda(); 
});


// --- LÓGICA DE VISTA ADMIN (ALÉRGENOS) ---

function guardarPlatsALocalStorage() {
    localStorage.setItem('platosCantina', JSON.stringify(platsRegistrats));
}

function mostrarPlatEnDOM(plato) {
    const salidaDiv = document.getElementById('salidaPlatos');
    
    let listaAlergenos;
    if (plato.alergenos.length === 0) {
        listaAlergenos = '<span style="color: var(--primary);">Cap al·lèrgen rellevant registrat.</span>';
    } else {
        listaAlergenos = plato.alergenos.map(a => `<span class="alergeno-si">${a}</span>`).join(' ');
    }
    
    const nouPlatHTML = `
        <div class="plato-item" data-id="${plato.id}">
            <div>
                <strong>Plat:</strong> ${plato.nombre}<br>
                <strong>Al·lèrgens:</strong> ${listaAlergenos}
            </div>
            <button class="btn-eliminar" data-id="${plato.id}" data-accio="eliminar-admin">🗑️</button>
        </div>
    `;

    const notaInicial = salidaDiv.querySelector('.nota');
    if (notaInicial) notaInicial.remove();

    salidaDiv.insertAdjacentHTML('afterbegin', nouPlatHTML);
    
    const newButton = salidaDiv.querySelector(`button[data-id="${plato.id}"]`);
    if (newButton) {
        newButton.addEventListener('click', eliminarPlatAdmin);
    }
}

function eliminarPlatAdmin(e) {
    const idAEsborrar = parseInt(e.currentTarget.dataset.id); 
    
    const elementDOM = document.querySelector(`.plato-item[data-id="${idAEsborrar}"]`);
    if (elementDOM) elementDOM.remove();

    platsRegistrats = platsRegistrats.filter(plato => plato.id !== idAEsborrar);
    guardarPlatsALocalStorage();
    
    if (platsRegistrats.length === 0) {
        document.getElementById('salidaPlatos').innerHTML = '<p class="nota">Encara no hi ha plats registrats en aquesta sessió.</p>';
    }
}

function carregarPlats() {
    const datosGuardados = localStorage.getItem('platosCantina');
    
    if (datosGuardados) {
        platsRegistrats = JSON.parse(datosGuardados);
        if (platsRegistrats.length > 0) {
            platsRegistrats.forEach(plato => mostrarPlatEnDOM(plato));
        }
    } else {
        platsRegistrats = [];
    }
}

// Event de Formulari Admin (Registro de Alérgenos)
document.getElementById('formularioPlato').addEventListener('submit', function(e) {
    e.preventDefault();

    const nombrePlato = document.getElementById('nombrePlato').value.trim();
    const producteBase = document.querySelector('input[name="producteBaseAdmin"]:checked');
    
    if (!producteBase) return alert("Si us plau, tria un producte base.");

    let alergenosTotals = [];
    const baseKey = producteBase.value;
    alergenosTotals.push(...CARTA_PRODUCTES[baseKey].alergenKeys);

    const begudaOpcional = document.getElementById('begudaOpcionalAdmin').value;
    if (begudaOpcional) alergenosTotals.push(...CARTA_PRODUCTES[begudaOpcional].alergenKeys);
    
    const lletAfegida = document.getElementById('add_llet_admin').checked;
    if (lletAfegida) alergenosTotals.push(...CARTA_PRODUCTES['add_llet'].alergenKeys);
    
    const alergenosUnics = [...new Set(alergenosTotals)].sort();

    const nouPlat = {
        id: Date.now(), 
        nombre: nombrePlato,
        alergenos: alergenosUnics
    };

    platsRegistrats.push(nouPlat); 
    guardarPlatsALocalStorage();
    mostrarPlatEnDOM(nouPlat);

    document.getElementById('formularioPlato').reset();
});


// --- INICIALIZACIÓN GLOBAL ---

function inicialitzarVista(targetDivId, baseRadioName, begudaSelectId, isClient) {
    const baseDiv = document.getElementById(targetDivId);
    baseDiv.innerHTML = '';
    
    const productesBaseKeys = ["frankfurt_base", "brioixeria_base", "brioixeria_industrial"];
    const icones = { "frankfurt_base": "🌭", "brioixeria_base": "🥐🍩", "brioixeria_industrial": "🍟🍫" };
    
    productesBaseKeys.forEach(key => {
        const producte = CARTA_PRODUCTES[key];
        const inputId = key + (isClient ? '_client' : '_admin');
        const complements = producte.complements ? '' : 'disabled';
        const labelPrice = isClient ? `(${producte.preu.toFixed(2)} €)` : '';
        
        baseDiv.insertAdjacentHTML('beforeend', `
            <input type="radio" id="${inputId}" name="${baseRadioName}" value="${key}" ${complements} required>
            <label for="${inputId}">
                <span class="icona-producte">${icones[key]}</span> 
                ${producte.nom}<br>
                ${labelPrice}
            </label>
        `);
    });

    // Lógica de mostrar/ocultar complementos (solo para la vista Cliente)
    if (isClient) {
        document.querySelectorAll('input[name="producteBaseClient"]').forEach(radio => {
            radio.addEventListener('change', function() {
                const complementsFieldset = document.getElementById('complements-fieldset');
                complementsFieldset.style.display = CARTA_PRODUCTES[this.value].complements ? 'block' : 'none';
            });
        });
    }

    // Generar opciones de Bebidas (Select)
    const begudaSelect = document.getElementById(begudaSelectId);
    if (begudaSelect) {
        begudaSelect.innerHTML = '<option value="">-- No triar beguda --</option>';
        const begudesKeys = ["beguda_sucre", "beguda_aigua", "cafe_sol"];
        
        begudesKeys.forEach(key => {
            const beguda = CARTA_PRODUCTES[key];
            const priceText = isClient ? ` (+${beguda.preu.toFixed(2)} €)` : '';
            const option = new Option(`${beguda.nom}${priceText}`, key);
            begudaSelect.add(option);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicialización de las dos vistas con los datos de CARTA_PRODUCTES
    inicialitzarVista('seleccioBaseClient', 'producteBaseClient', 'begudaOpcionalClient', true);
    inicialitzarVista('seleccioBaseAdmin', 'producteBaseAdmin', 'begudaOpcionalAdmin', false);
    
    // Cargar datos de alérgenos del Admin (persistencia)
    carregarPlats();
    
    // Por defecto, mostrar la vista cliente
    mostrarVista('client');
});