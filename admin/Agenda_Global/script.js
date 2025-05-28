  document.addEventListener('DOMContentLoaded', function() {
    const citasBody = document.getElementById('citas-body');
  const rows = Array.from(citasBody.querySelectorAll('tr'));
  const filterBtns = document.querySelectorAll('.agenda-filter-btn');
  const fechaActualElement = document.getElementById('fecha-actual');
  const totalCitasElement = document.getElementById('total-citas');
  const totalUrgenciasElement = document.getElementById('total-urgencias');
  const totalCanceladasElement = document.getElementById('total-canceladas');
    const hoy = new Date();
  const hoyStr = formatDate(hoy);
  const fechaActual = hoy.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
    function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
    function getWeekRange(date) {
    const day = date.getDay(); // 0 (domingo) a 6 (sábado)
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Ajuste para que la semana empiece el lunes
    const start = new Date(date);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
  }
    fechaActualElement.textContent = fechaActual;
    function applyFilters(filter) {
    const { start: inicioSemana, end: finSemana } = getWeekRange(hoy);
    const mesActual = hoy.getMonth() + 1; // Los meses van de 0 a 11
    
    rows.forEach(row => {
      const fechaCita = row.getAttribute('data-fecha');
      const esUrgente = row.getAttribute('data-urgente') === 'true';
      const estaCancelada = row.querySelector('.status-icon').textContent === '❌';
      
      let showRow = false;
      
      switch(filter) {
        case 'hoy':
          showRow = fechaCita === hoyStr;
          break;
        case 'semana':
          const fechaCitaDate = new Date(fechaCita);
          showRow = fechaCitaDate >= inicioSemana && fechaCitaDate <= finSemana;
          break;
        case 'mes':
          const [year, month] = fechaCita.split('-');
          showRow = month === String(mesActual).padStart(2, '0') && year === hoy.getFullYear().toString();
          break;
        case 'urgencias':
          showRow = esUrgente;
          break;
        default:
          showRow = true;
      }
      
      row.style.display = showRow ? '' : 'none';
    });
      updateStats(filter);
  }
    function updateStats(filter) {
    let total = 0;
    let urgencias = 0;
    let canceladas = 0;
    
    rows.forEach(row => {
      if (row.style.display !== 'none') {
        const esUrgente = row.getAttribute('data-urgente') === 'true';
        const estaCancelada = row.querySelector('.status-icon').textContent === '❌';
        
        total++;
        if (esUrgente) urgencias++;
        if (estaCancelada) canceladas++;
      }
    });
    
    totalCitasElement.textContent = total;
    totalUrgenciasElement.textContent = urgencias;
    totalCanceladasElement.textContent = canceladas;
  }
    filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');
      applyFilters(filter);
    });
  });
    applyFilters('hoy');
    document.getElementById('dashboard-link').addEventListener('click', function() {
    window.location.href = '../Dashboard/Dashboard.html';
  });

  document.getElementById('roles-link').addEventListener('click', function() {
    window.location.href = '../Gestion_de_roles/Roles.html';
  });

  document.getElementById('hce-link').addEventListener('click', function() {
    window.location.href = '../HCE/hce.html';

  });

  document.getElementById('reportes-link').addEventListener('click', function() {
        window.location.href = '../Reportes/Reportes.html';
  });

  document.getElementById('configuracion-link').addEventListener('click', function() {
    window.location.href = '../Configuracion/configuracion.html';
  });
    document.querySelector('.export-btn').addEventListener('click', function() {
    alert('Exportando agenda a Excel...');
    });
    const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', function() {
      menuItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
});