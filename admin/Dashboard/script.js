document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('specialtyChart').getContext('2d');
  const specialtyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Cardiología', 'Pediatría', 'Ginecología'],
      datasets: [{
        label: 'Citas por especialidad',
        data: [12, 8, 5],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 2
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
    fetch('http://localhost:3000/api/medicos/cantidad')
    .then(response => response.json())
    .then(data => {
      const medicosElement = document.querySelector('.stat-card:nth-child(3) .value');
      if (medicosElement && data.total !== undefined) {
        medicosElement.textContent = data.total;
      }
    })
    .catch(error => {
      console.error('Error al obtener cantidad de médicos:', error);
    });
    document.querySelector('.btn-primary').addEventListener('click', function () {
    window.location.href = '../Gestion_de_roles/Crear/crear.html';
  });

  document.querySelector('.btn-secondary').addEventListener('click', function () {
    alert('Generando reporte mensual...');
  });

  document.getElementById('dashboard-link').addEventListener('click', function (e) {
    e.preventDefault();
    });

  document.getElementById('roles-link').addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = '../Gestion_de_roles/Roles.html';
  });

  document.getElementById('agenda-link').addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = '../Agenda_Global/Agenda.html';
  });

  document.getElementById('hce-link').addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = '../HCE/hce.html';
  });

  document.getElementById('reportes-link').addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = '../Reportes/Reportes.html';
  });

  document.getElementById('configuracion-link').addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = '../Configuracion/configuracion.html';
  });

  document.getElementById('logout-link').addEventListener('click', function() {
    window.location.href = '../../Login/index.html';
  });
    const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', function () {
      menuItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
    document.getElementById('dashboard-link').classList.add('active');
});
