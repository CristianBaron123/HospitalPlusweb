  document.querySelector('.schedule-btn').addEventListener('click', function() {
  window.location.href = '../Agendar/agendar.html';
});
  function cargarCitas() {
  const citas = JSON.parse(localStorage.getItem('citas')) || [];
  const tbody = document.getElementById('citas-body');
  tbody.innerHTML = '';
    let totalCitas = 0;
  let totalUrgencias = 0;
    const filtroActivo = document.querySelector('.agenda-filter-btn.active')?.dataset.filter;

  citas.forEach(cita => {
        if (filtroActivo === 'urgencias' && !cita.urgente) return;

      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${formatearFecha(cita.fecha)}</td>
          <td>${cita.hora}</td>
          <td>${cita.paciente || 'Nombre no disponible'}</td>
          <td class="${cita.urgente ? 'urgente' : 'normal'}">
              ${cita.urgente ? 'Urgente' : 'Normal'}
          </td>
      `;
      tbody.appendChild(tr);

      totalCitas++;
      if (cita.urgente) totalUrgencias++;
  });
    document.getElementById('total-citas').textContent = totalCitas;
  document.getElementById('total-urgencias').textContent = totalUrgencias;
}
  function formatearFecha(fechaStr) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  }
    const fecha = new Date(fechaStr);
    if (isNaN(fecha.getTime())) {
      return fechaStr; // Return original string if date is invalid
  }
  
  return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
}
  function actualizarFechaActual() {
  const ahora = new Date();
  const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
  document.getElementById('fecha-actual').textContent = 
      ahora.toLocaleDateString('es-ES', opciones);
}
  document.querySelectorAll('.agenda-filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
        document.querySelectorAll('.agenda-filter-btn').forEach(b => 
          b.classList.remove('active'));
        this.classList.add('active');
          cargarCitas();
  });
});
  window.addEventListener('storage', function(e) {
  if (e.key === 'citas') {
      cargarCitas();
  }
});
  document.addEventListener('DOMContentLoaded', function() {
  cargarCitas();
  actualizarFechaActual();
});