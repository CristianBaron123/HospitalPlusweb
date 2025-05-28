document.addEventListener('DOMContentLoaded', () => {
    cargarCitas();
    actualizarFecha();
    document.querySelector('.agendar-btn').addEventListener('click', () => {
    window.location.href = '../Agendar/agendar.html';
  });
  
  document.getElementById('logout-link').addEventListener('click', () => {
    window.location.href = '../../Login/index.html';
  });
  
  document.getElementById('configuracion-link').addEventListener('click', () => {
    window.location.href = '../Configuracion/configuracion.html';
  });
    window.addEventListener('storage', function(e) {
    if (e.key === 'citas') {
      cargarCitas();
    }
  });
});

function cargarCitas() {
  const citas = JSON.parse(localStorage.getItem('citas')) || [];
  const tbody = document.getElementById('citas-body');
  tbody.innerHTML = '';

  if (citas.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td colspan="5" class="sin-citas">No tienes citas agendadas</td>
    `;
    tbody.appendChild(tr);
    return;
  }

  citas.forEach((cita, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatearFecha(cita.fecha)}</td>
      <td>${cita.hora}</td>
      <td>${cita.doctor}</td>
      <td>${cita.especialidad}</td>
      <td>
        <button class="btn-eliminar" data-index="${index}">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.currentTarget.getAttribute('data-index');
      eliminarCita(index);
    });
  });
}

function eliminarCita(index) {
  if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    citas.splice(index, 1);
    localStorage.setItem('citas', JSON.stringify(citas));
    cargarCitas();
  }
}

function actualizarFecha() {
  const hoy = new Date();
  const fechaActualSpan = document.getElementById('fecha-actual');
  if (fechaActualSpan) {
    fechaActualSpan.textContent = hoy.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }
}

function formatearFecha(fechaStr) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(fechaStr)) {
    const [day, month, year] = fechaStr.split('/');
    const fecha = new Date(`${year}-${month}-${day}`);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
    return fechaStr;
}