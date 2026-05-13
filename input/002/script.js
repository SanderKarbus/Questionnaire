const tbody = document.getElementById('table-body');
const errorDiv = document.getElementById('error-message');
const searchInput = document.getElementById('search');

let persons = [];

function renderTable(data) {
  tbody.innerHTML = '';
  data.forEach(person => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${person.nimi}</td><td>${person.vanus}</td><td>${person.linn}</td>`;
    tbody.appendChild(row);
  });
}

function filterData() {
  const query = searchInput.value.toLowerCase();
  const filtered = persons.filter(p => p.nimi.toLowerCase().includes(query));
  renderTable(filtered);
}

fetch('data.json')
  .then(response => {
    if (!response.ok) throw new Error('Andmete laadimine ebaõnnestus');
    return response.json();
  })
  .then(data => {
    persons = data;
    renderTable(persons);
  })
  .catch(error => {
    errorDiv.textContent = 'Viga: ' + error.message;
  });

searchInput.addEventListener('input', filterData);
