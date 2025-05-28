document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('dashboard-link').addEventListener('click', () => {
    window.location.href = '../Dashboard/Dashboard.html';
  });

  document.getElementById('roles-link').addEventListener('click', () => {
    window.location.href = '../Gestion_de_roles/Roles.html';
  });

  document.getElementById('agenda-link').addEventListener('click', () => {
    window.location.href = '../Agenda_Global/Agenda.html';
  });

  document.getElementById('hce-link').addEventListener('click', () => {
    window.location.href = '../HCE/HCE.html';
  });

  document.getElementById('reportes-link').addEventListener('click', () => {
    window.location.href = '../Reportes/Reportes.html';
  });

  document.getElementById('configuracion-link').addEventListener('click', () => {
    window.location.href = '../Configuracion/configuracion.html';
  });

  document.getElementById('logout-link').addEventListener('click', function() {
    window.location.href = '../../Login/index.html';
  });
    const form = document.getElementById('config-form');
  const discardBtn = document.getElementById('discard-btn');
  const notification = document.getElementById('notification');
    discardBtn.addEventListener('click', () => {
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    inputs.forEach(input => input.value = '');
  });
    form.addEventListener('submit', function (e) {
    e.preventDefault();

    const userId = form.dataset.userId;
    const data = {};
      const nombre = form.querySelector('input[name="nombre"]').value.trim();
    if (nombre) data.nombre = nombre;

    const apellido = form.querySelector('input[name="apellido"]').value.trim();
    if (apellido) data.apellido = apellido;

    const email = form.querySelector('input[name="email"]').value.trim();
    if (email) data.email = email;

    const codigo_pais = form.querySelector('input[name="codigo_pais"]').value.trim();
    if (codigo_pais) data.codigo_pais = codigo_pais;

    const telefono = form.querySelector('input[name="telefono"]').value.trim();
    if (telefono) data.telefono = telefono;

    if (Object.keys(data).length === 0) {
      notification.textContent = 'No se realizaron cambios.';
      notification.classList.add('show');
      setTimeout(() => notification.classList.remove('show'), 3000);
      return;
    }

    fetch(`http://localhost:3000/api/usuarios/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error actualizando usuario');
        return res.json();
      })
      .then(() => {
        notification.textContent = 'Cambios guardados correctamente';
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
      })
      .catch(err => {
        notification.textContent = err.message || 'Error al actualizar';
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
      });
  });

  document.getElementById('configuracion-link').classList.add('active');
});
