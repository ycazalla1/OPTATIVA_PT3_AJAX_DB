// *** MAPA D'AL·LÈRGENS ACTUALITZAT ***
        const MAPA_ALLERGENS = {
            "frankfurt_base": ["Gluten", "Soia"],
            "brioixeria_base": ["Gluten", "Làctics", "Ou", "Soia"], 
            "brioixeria_industrial": ["Gluten", "Làctics", "Ou", "Soia", "Fruits Secs"], 
            "beguda_sucre": [],
            "beguda_aigua": [],
            "cafe_sol": [],
            "add_llet": ["Làctics"] 
        };

        let platsRegistrats = [];
        
        // --- FUNCIONS DE LOCAL STORAGE I RENDER ---

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
                    <button class="btn-eliminar" data-id="${plato.id}">🗑️</button>
                </div>
            `;

            const notaInicial = salidaDiv.querySelector('.nota');
            if (notaInicial) notaInicial.remove();

            salidaDiv.insertAdjacentHTML('afterbegin', nouPlatHTML);
            
            // Afegim l'event listener al nou botó
            const newButton = salidaDiv.querySelector(`button[data-id="${plato.id}"]`);
            if (newButton) {
                newButton.addEventListener('click', eliminarPlat);
            }
        }

        function eliminarPlat(e) {
            const idAEsborrar = parseInt(e.currentTarget.dataset.id); 

            // 1. Eliminar del DOM (Visualment)
            const elementDOM = document.querySelector(`.plato-item[data-id="${idAEsborrar}"]`);
            if (elementDOM) {
                elementDOM.remove();
            }

            // 2. Eliminar de l'Array de JavaScript
            platsRegistrats = platsRegistrats.filter(plato => plato.id !== idAEsborrar);

            // 3. Actualitzar localStorage
            guardarPlatsALocalStorage();
            
            // 4. Si l'array queda buit, tornem a posar la nota
            if (platsRegistrats.length === 0) {
                const salidaDiv = document.getElementById('salidaPlatos');
                salidaDiv.innerHTML = '<p class="nota">Encara no hi ha plats registrats en aquesta sessió.</p>';
            }
        }


        function carregarPlats() {
            const salidaDiv = document.getElementById('salidaPlatos');
            const datosGuardados = localStorage.getItem('platosCantina');
            
            salidaDiv.innerHTML = ''; 

            if (datosGuardados) {
                platsRegistrats = JSON.parse(datosGuardados);
                
                if (platsRegistrats.length > 0) {
                    platsRegistrats.forEach(plato => mostrarPlatEnDOM(plato));
                } else {
                    salidaDiv.innerHTML = '<p class="nota">Encara no hi ha plats registrats en aquesta sessió.</p>';
                }
            } else {
                platsRegistrats = [];
                salidaDiv.innerHTML = '<p class="nota">Encara no hi ha plats registrats en aquesta sessió.</p>';
            }
        }

        // --- LÒGICA PRINCIPAL (SUBMISSION) ---

        document.getElementById('formularioPlato').addEventListener('submit', function(e) {
            e.preventDefault();

            const nombrePlato = document.getElementById('nombrePlato').value.trim();
            const producteBase = document.querySelector('input[name="producteBase"]:checked');
            const begudaOpcional = document.getElementById('begudaOpcional').value;
            const lletAfegida = document.getElementById('add_llet').checked;
            
            if (!producteBase) {
                alert("Si us plau, tria un producte base.");
                return;
            }

            let alergenosTotals = [];
            
            // 1. Al·lèrgens Base
            const baseKey = producteBase.value;
            alergenosTotals.push(...MAPA_ALLERGENS[baseKey]);

            // 2. Al·lèrgens Beguda
            if (begudaOpcional) {
                alergenosTotals.push(...MAPA_ALLERGENS[begudaOpcional]);
            }
            
            // 3. Al·lèrgens Llet Afegida
            if (lletAfegida) {
                alergenosTotals.push(...MAPA_ALLERGENS['add_llet']);
            }
            
            // 4. Eliminació de duplicats i ordenació
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

        // Càrrega inicial de dades
        carregarPlats();