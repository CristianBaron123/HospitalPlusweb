document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('create-user-form');
  const generateBtn = document.getElementById('generate-password');
  const generatedPassword = document.getElementById('generated-password');
  const passwordValue = document.getElementById('password-value');
  const passwordInput = document.getElementById('password');
  const copyBtn = document.querySelector('.copy-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const notification = document.getElementById('notification');
  const notificationIcon = document.querySelector('.notification-icon');
  const notificationText = document.querySelector('.notification-text');
  const roleSelect = document.getElementById('user-role');
  const phoneInput = document.getElementById('telefono');
  const especialidadContainer = document.getElementById('especialidad-container');
  const especialidadSelect = document.getElementById('especialidad');
  const adminTypeContainer = document.getElementById('admin-type-container');
  const adminTypeSelect = document.getElementById('admin-type');
  const codigoPaisSelect = document.getElementById('codigo-pais');
    roleSelect.addEventListener('change', function() {
    const role = this.value;
      especialidadContainer.style.display = 'none';
    especialidadSelect.required = false;
    adminTypeContainer.style.display = 'none';
    adminTypeSelect.required = false;
      if (role.startsWith('medico')) {
      especialidadContainer.style.display = 'block';
      especialidadSelect.required = true;
    } else if (role.startsWith('admin')) {
      adminTypeContainer.style.display = 'block';
      adminTypeSelect.required = true;
    }
      generatedPassword.style.display = 'none';
    passwordInput.value = '';
    document.querySelector('.patient-instructions')?.remove();
  });
    generateBtn.addEventListener('click', function() {
    const role = roleSelect.value;
    
    if (!role) {
      showNotification('Por favor seleccione un rol primero', 'error');
      roleSelect.focus();
      return;
    }
      if (role.startsWith('medico') && !especialidadSelect.value) {
      showNotification('Por favor seleccione una especialidad', 'error');
      especialidadSelect.focus();
      return;
    }
    
    if (role.startsWith('admin') && !adminTypeSelect.value) {
      showNotification('Por favor seleccione el tipo de administrador', 'error');
      adminTypeSelect.focus();
      return;
    }
      const password = role === 'paciente' ? generateSimplePassword() : generateComplexPassword();
      passwordValue.textContent = password;
    passwordInput.value = password;
    generatedPassword.style.display = 'flex';
      if (role === 'paciente') {
      showPatientInstructions(password);
    } else {
      document.querySelector('.patient-instructions')?.remove();
    }
  });
    function generateSimplePassword() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }
    function generateComplexPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
    function showPatientInstructions(password) {
    const instructions = `
      <div class="patient-instructions">
        <h4>Instrucciones para el paciente:</h4>
        <p>Clave temporal: <strong>${password}</strong></p>
        <ul>
          <li>Se enviará por SMS al número registrado</li>
          <li>Válida por 24 horas</li>
          <li>Debe cambiarla en su primer ingreso</li>
        </ul>
      </div>
    `;
    
    document.querySelector('.patient-instructions')?.remove();
    generatedPassword.insertAdjacentHTML('afterend', instructions);
  }
    copyBtn.addEventListener('click', function() {
    navigator.clipboard.writeText(passwordValue.textContent)
      .then(() => showNotification('Contraseña copiada al portapapeles', 'check_circle'))
      .catch(() => showNotification('Error al copiar la contraseña', 'error'));
  });
    cancelBtn.addEventListener('click', function() {
    if (confirm('¿Está seguro de cancelar? Los datos no guardados se perderán.')) {
      window.location.href = '../Roles.html';
    }
  });
    form.addEventListener('submit', async function(e) {
    e.preventDefault();
      const nombre = document.getElementById('nombre-completo').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = phoneInput.value.trim();
    const role = roleSelect.value;
    const password = passwordInput.value;
    const especialidad = role.startsWith('medico') ? especialidadSelect.value : '';
    const adminType = role.startsWith('admin') ? adminTypeSelect.value : '';
    const codigoPais = codigoPaisSelect.value;
      if (!nombre || !email || !telefono || !role || !password) {
      return showNotification('Por favor complete todos los campos', 'error');
    }

    if (role.startsWith('medico') && !especialidad) {
      return showNotification('Por favor seleccione una especialidad médica', 'error');
    }

    if (role.startsWith('admin') && !adminType) {
      return showNotification('Por favor seleccione el tipo de administrador', 'error');
    }

    if (role === 'paciente' && !/^\d{7,15}$/.test(telefono)) {
      return showNotification('Número telefónico inválido para envío de SMS', 'error');
    }

    try {
      showLoading(true);
        await emailjs.send('service_xavw9wd', 'template_zybxqal', {
        to_email: email,
        to_name: nombre,
        password: password,
        role: getRoleName(role),
        especialidad: especialidad,
        admin_type: adminType
      });
        const userData = {
        nombre,
        email,
        codigo_pais: codigoPais,
        telefono,
        password,
        rol: role,
        rol_tipo: role.startsWith('admin') ? adminType : (role.startsWith('medico') ? especialidad : ''),
        especialidad: role.startsWith('medico') ? especialidad : ''
      };

      const response = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) throw new Error('Error al guardar en el servidor');

      const data = await response.json();
      console.log('Usuario creado:', data);
        showNotification('Usuario creado exitosamente', 'check_circle');
      setTimeout(() => window.location.href = '../../Gestion_de_roles/Roles.html', 1500);

    } catch (error) {
      console.error('Error:', error);
      showNotification(error.message || 'Error al crear el usuario', 'error');
    } finally {
      showLoading(false);
    }
  });
    function showNotification(message, icon) {
    notificationText.textContent = message;
    notificationIcon.textContent = icon;
    notification.classList.toggle('error', icon === 'error');
    notification.classList.add('show');

    setTimeout(() => notification.classList.remove('show'), 3000);
  }
    function showLoading(show) {
    const loader = document.querySelector('.loader');
    if (show && !loader) {
      const loaderDiv = document.createElement('div');
      loaderDiv.className = 'loader';
      loaderDiv.innerHTML = `
        <div class="spinner"></div>
        <span>Cargando...</span>
      `;
      document.querySelector('.content-container').appendChild(loaderDiv);
    } else if (!show && loader) {
      loader.remove();
    }
  }
    function getRoleName(roleValue) {
    const roles = {
      'admin_general': 'Administrador General',
      'admin_area': 'Administrador de Área',
      'medico_especialista': 'Médico Especialista',
      'medico_general': 'Médico General',
      'paciente': 'Paciente'
    };
    return roles[roleValue] || '';
  }
    document.getElementById('dashboard-link').addEventListener('click', () => {
    window.location.href = '../../Dashboard/Dashboard.html';
  });

  document.getElementById('roles-link').addEventListener('click', () => {
    window.location.href = '../Roles.html';
  });

  document.getElementById('agenda-link').addEventListener('click', () => {
    window.location.href = '../../Agenda_Global/Agenda.html';
  });

  document.getElementById('hce-link').addEventListener('click', () => {
    window.location.href = '../../HCE/HCE.html';
  });

  document.getElementById('reportes-link').addEventListener('click', () => {
    window.location.href = '../../Reportes/Reportes.html';
  });

  document.getElementById('configuracion-link').addEventListener('click', () => {
    window.location.href = '../../Configuracion/configuracion.html';
  });
});