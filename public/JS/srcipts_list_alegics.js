const form = document.getElementById('formAlergen');
const input = document.getElementById('inputAlergen');
const tbody = document.querySelector('#taulaAlergens tbody');

// Llista inicial (pot carregar-se de localStorage)
let alergens = JSON.parse(localStorage.getItem('alergens')) || [
  "Gluten", "Làctics", "Ou", "Soia", "Fruits Secs"
];

// Funció per renderitzar la taula
function renderTaula() {
  tbody.innerHTML = '';
  alergens.forEach((alergen, i) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${alergen}</td>
      <td><button class="delete" data-index="${i}">🗑️</button></td>
    `;
    tbody.appendChild(fila);
  });

  // Afegir event listeners als botons
  document.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', eliminarAlergen);
  });
}

// Afegir al·lèrgogen
form.addEventListener('submit', e => {
  e.preventDefault();
  const nouAlergen = input.value.trim();
  if(nouAlergen && !alergens.includes(nouAlergen)){
    alergens.push(nouAlergen);
    guardarLocalStorage();
    renderTaula();
    form.reset();
  }
});

// Eliminar al·lèrgogen
function eliminarAlergen(e) {
  const index = parseInt(e.currentTarget.dataset.index);
  alergens.splice(index, 1);
  guardarLocalStorage();
  renderTaula();
}

// Guardar al·lèrgens a localStorage
function guardarLocalStorage() {
  localStorage.setItem('alergens', JSON.stringify(alergens));
}

// Inicialitzar
renderTaula();
