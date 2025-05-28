document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('dashboard-link').addEventListener('click', function() {
    window.location.href = '../Dashboard/Dashboard.html';
  });

  document.getElementById('roles-link').addEventListener('click', function() {
    window.location.href = '../Gestion_de_roles/Roles.html';
  });

  document.getElementById('agenda-link').addEventListener('click', function() {
    window.location.href = '../Agenda_Global/Agenda.html';
  });

  document.getElementById('hce-link').addEventListener('click', function() {
    window.location.href = '../HCE/HCE.html';
  });

  document.getElementById('reportes-link').addEventListener('click', function() {
    window.location.href = '../Reportes/Reportes.html';
  });

  document.getElementById('configuracion-link').addEventListener('click', function() {
    window.location.href = '../Configuracion/configuracion.html';
  });
  document.getElementById('logout-link').addEventListener('click', function() {
    window.location.href = '../../Login/index.html';
  });
    const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      menuItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
    const specialtyBarCtx = document.getElementById('specialtyBarChart').getContext('2d');
  const specialtyBarChart = new Chart(specialtyBarCtx, {
    type: 'bar',
    data: {
      labels: ['Cardiología', 'Pediatría', 'Ginecología'],
      datasets: [{
        label: 'Citas',
        data: [45, 30, 25],
        backgroundColor: '#1a73e8',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
    const satisfactionPieCtx = document.getElementById('satisfactionPieChart').getContext('2d');
  const satisfactionPieChart = new Chart(satisfactionPieCtx, {
    type: 'pie',
    data: {
      labels: ['Satisfechos', 'Insatisfechos'],
      datasets: [{
        data: [85, 15],
        backgroundColor: [
          '#388e3c',
          '#e53935'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
});