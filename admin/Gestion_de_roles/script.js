document.addEventListener('DOMContentLoaded', function() {
  const tableBody = document.querySelector('.roles-table tbody');
  const searchInput = document.querySelector('.search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const addRoleBtn = document.querySelector('.add-role-btn');

  let currentFilter = 'Todos';
  let currentSearch = '';
    loadUsers();
    async function loadUsers() {
    try {
      showLoading(true);
      const response = await fetch('http://localhost:3000/api/usuarios', {
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const users = await response.json();
      console.log('Usuarios recibidos:', users); // Debug
      renderUsers(users);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      showNotification('Error al cargar usuarios: ' + error.message, 'error');
        const localUser = localStorage.getItem('newUser');
      if (localUser) {
        console.log('Mostrando usuario de localStorage:', JSON.parse(localUser));
        renderUsers([JSON.parse(localUser)]);
      }
    } finally {
      showLoading(false);
    }
  }
    function renderUsers(users) {
    tableBody.innerHTML = '';

    if (users.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.innerHTML = `
        <td colspan="5" class="empty-message">No hay usuarios registrados</td>
      `;
      tableBody.appendChild(emptyRow);
      return;
    }

    users.forEach(user => {
      const row = document.createElement('tr');
        let displayedRole = '';
      switch (user.rol) {
        case 'admin_general':
          displayedRole = 'Administrador General';
          break;
        case 'admin_area':
          displayedRole = 'Administrador de Área';
          break;
        case 'medico_especialista':
          displayedRole = 'Médico Especialista';
          break;
        case 'medico_general':
          displayedRole = 'Médico General';
          break;
        case 'paciente':
          displayedRole = 'Paciente';
          break;
        default:
          displayedRole = user.rol; // Por si hay otros roles inesperados
      }

      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.nombre}</td>
        <td>${user.email}</td>
        <td>${displayedRole}</td>
        <td class="actions-cell">
          <button class="action-btn delete-btn" data-id="${user.id}">
            <span class="material-symbols-outlined action-icon">delete</span>
            <span>Eliminar</span>
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    setupDeleteButtons();
    applyFilters(); // Aplicar filtros tras cargar
  }
    function setupDeleteButtons() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        const userId = this.dataset.id;
        const userName = this.closest('tr').querySelector('td:nth-child(2)').textContent;

        if (!confirm(`¿Estás seguro de eliminar permanentemente a ${userName}?`)) {
          return;
        }

        try {
          showLoading(true);
          const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
          }

          await loadUsers();
          showNotification('Usuario eliminado correctamente', 'check_circle');
        } catch (error) {
          console.error('Error al eliminar:', error);
          showNotification('Error al eliminar usuario: ' + error.message, 'error');
        } finally {
          showLoading(false);
        }
      });
    });
  }
    function applyFilters() {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    let visibleCount = 0;
      const roleMap = {
      'Admin': ['Administrador General', 'Administrador de Área'],
      'Médico': ['Médico Especialista', 'Médico General'],
      'Paciente': ['Paciente']
    };

    rows.forEach(row => {
      if (row.classList.contains('empty-message') || row.classList.contains('no-results')) {
        row.style.display = 'none';
        return;
      }

      const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
      const roleText = row.querySelector('td:nth-child(4)').textContent.trim();
      const matchesSearch = name.includes(currentSearch.toLowerCase());

      let matchesFilter = true;
      if (currentFilter !== 'Todos') {
          matchesFilter = roleMap[currentFilter]
          ? roleMap[currentFilter].includes(roleText)
          : false;
      }

      if (matchesSearch && matchesFilter) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });
      const noResults = document.querySelector('.no-results');
    if (visibleCount === 0 && rows.length > 0) {
      if (!noResults) {
        const noResultsRow = document.createElement('tr');
        noResultsRow.classList.add('no-results');
        noResultsRow.innerHTML = `<td colspan="5">No se encontraron usuarios con los filtros aplicados</td>`;
        tableBody.appendChild(noResultsRow);
      }
    } else if (noResults) {
      noResults.remove();
    }
  }
    document.getElementById('dashboard-link').addEventListener('click', () => {
    window.location.href = '../Dashboard/Dashboard.html';
  });
  document.getElementById('agenda-link').addEventListener('click', () => {
    window.location.href = '../Agenda_Global/Agenda.html';
  });
  document.getElementById('hce-link').addEventListener('click', () => {
    window.location.href = '../HCE/hce.html';
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
    searchInput.addEventListener('input', function() {
    currentSearch = this.value.trim();
    applyFilters();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.textContent;
      applyFilters();
    });
  });

  addRoleBtn.addEventListener('click', () => {
    window.location.href = 'crear/crear.html';
  });
    function showNotification(message, icon) {
    const notification = document.createElement('div');
    notification.className = `notification ${icon === 'error' ? 'error' : ''}`;
    notification.innerHTML = `
      <span class="material-symbols-outlined">${icon}</span>
      <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
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
});
