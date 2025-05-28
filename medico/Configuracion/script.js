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
    const form = document.getElementById('config-form');
  const discardBtn = document.getElementById('discard-btn');
  const notification = document.getElementById('notification');
    discardBtn.addEventListener('click', function() {
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    inputs.forEach(input => {
      input.value = '';
    });
  });
    form.addEventListener('submit', function(e) {
    e.preventDefault();
      notification.classList.add('show');
      setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  });
    document.getElementById('configuracion-link').classList.add('active');
});