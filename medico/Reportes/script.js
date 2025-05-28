document.addEventListener('DOMContentLoaded', function() {
    const addNavigationEvent = (id, path) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener('click', () => {
        window.location.href = path;
      });
    }
  };
    addNavigationEvent('dashboard-link', '../Dashboard/Dashboard.html');
  addNavigationEvent('roles-link', '../Gestion_de_roles/Roles.html');
  addNavigationEvent('agenda-link', '../Agenda_Global/Agenda.html');
  addNavigationEvent('hce-link', '../HCE/HCE.html');
  addNavigationEvent('reportes-link', '../Reportes/Reportes.html');
  addNavigationEvent('configuracion-link', '../Configuracion/configuracion.html');
    const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      menuItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
    const specialtyBarCtx = document.getElementById('specialtyBarChart');
  if (specialtyBarCtx) {
    new Chart(specialtyBarCtx.getContext('2d'), {
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
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: false } }
      }
    });
  }
    const satisfactionPieCtx = document.getElementById('satisfactionPieChart');
  if (satisfactionPieCtx) {
    new Chart(satisfactionPieCtx.getContext('2d'), {
      type: 'pie',
      data: {
        labels: ['Satisfechos', 'Insatisfechos'],
        datasets: [{
          data: [85, 15],
          backgroundColor: ['#388e3c', '#e53935'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }
});