document.addEventListener('DOMContentLoaded', function() {
  const roleCards = document.querySelectorAll('.role-card');
  const forms = document.querySelectorAll('.login-form');

  const formsContainer = document.querySelector('.forms-container');
  let errorBox = document.createElement('div');
  errorBox.style.position = 'absolute';
  errorBox.style.bottom = '10px';
  errorBox.style.left = '50%';
  errorBox.style.transform = 'translateX(-50%)';
  errorBox.style.backgroundColor = '#D4232C';
  errorBox.style.color = 'white';
  errorBox.style.padding = '10px 20px';
  errorBox.style.borderRadius = '8px';
  errorBox.style.fontWeight = '600';
  errorBox.style.opacity = '0';
  errorBox.style.transition = 'opacity 0.5s ease';
  errorBox.style.pointerEvents = 'none';
  formsContainer.appendChild(errorBox);

  function showError(message) {
    errorBox.textContent = message;
    errorBox.style.opacity = '1';
    setTimeout(() => errorBox.style.opacity = '0', 3000);
  }

  forms.forEach(form => form.classList.remove('active'));

  roleCards.forEach(card => {
    card.addEventListener('click', function() {
      const role = this.dataset.role;
      forms.forEach(form => {
        if (form.classList.contains('active')) {
          form.style.animation = 'slideUp 0.5s forwards';
          setTimeout(() => form.classList.remove('active'), 500);
        }
      });
      setTimeout(() => {
        const formToShow = document.getElementById(`${role}-form`);
        formToShow.classList.add('active');
        formToShow.style.animation = 'slideDown 0.5s forwards';
        errorBox.style.opacity = '0';
        roleCards.forEach(c => {
          c.style.opacity = '1';
          c.style.transform = 'translateY(0)';
        });
        this.style.opacity = '0.7';
        this.style.transform = 'translateY(-5px)';
      }, 500);
    });
  });
    async function validarCredenciales(email, password, role) {
    try {
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password, role })
      });

      if (!response.ok) {
        const errorData = await response.json();
        showError(errorData.error || 'Credenciales incorrectas');
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error validando credenciales:', error);
      showError('Error de conexión al servidor');
      return null;
    }
  }

  document.getElementById('admin-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="text"]').value.trim();
    const password = this.querySelector('input[type="password"]').value.trim();
    if (!email || !password) return showError('Por favor complete todos los campos');
    const data = await validarCredenciales(email, password, 'admin_general');
    if (data) {
        localStorage.setItem('usuarioActual', JSON.stringify(data));
      console.log('Usuario logueado, ID:', data.id);

      if (data.id === 0) {  // Admin líder
        window.location.href = '../admin/Dashboard/Dashboard.html';
      } else {
        window.location.href = '../admin/Dashboard/Dashboard.html';
      }
    }
  });

  document.getElementById('medic-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="text"]').value.trim();
    const password = this.querySelector('input[type="password"]').value.trim();
    if (!email || !password) return showError('Por favor complete todos los campos');
    const data = await validarCredenciales(email, password, 'medico_especialista');
    if (data) {
      localStorage.setItem('usuarioActual', JSON.stringify(data));
      localStorage.setItem('authToken', data.token);
      console.log('Usuario logueado, ID:', data.id);

      window.location.href = '../medico/Agenda_Global/Agenda.html';
    }
  });

  document.getElementById('patient-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="text"]').value.trim();
    const password = this.querySelector('input[type="password"]').value.trim();
    if (!email || !password) return showError('Por favor complete todos los campos');
    const data = await validarCredenciales(email, password, 'paciente');
    if (data) {
        localStorage.setItem('usuarioActual', JSON.stringify(data));
      localStorage.setItem('authToken', data.token);
      console.log('Usuario logueado, ID:', data.id);

      window.location.href = '../paciente/Citas/citas.html';
    }
  });
});
