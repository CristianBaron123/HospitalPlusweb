  document.addEventListener('DOMContentLoaded', function() {
      const dashboardLink = document.getElementById('dashboard-link');
    const agendaLink = document.getElementById('agenda-link');
    const hceLink = document.getElementById('hce-link');
    const reportesLink = document.getElementById('reportes-link');
    const configuracionLink = document.getElementById('configuracion-link');
    const rolesLink = document.querySelector('.menu-item[id="roles-link"]'); // Para gestión de roles si existe
      function navigateTo(path) {
        window.location.href = path;
    }
      if (dashboardLink) {
        dashboardLink.addEventListener('click', function() {
            navigateTo('../Dashboard/Dashboard.html');
        });
    }

    if (agendaLink) {
        agendaLink.addEventListener('click', function() {
            navigateTo('../Agenda_Global/Agenda.html');
        });
    }

    if (hceLink) {
        hceLink.addEventListener('click', function() {
            navigateTo('../HCE/hce.html');
        });
    }

    if (reportesLink) {
        reportesLink.addEventListener('click', function() {
            navigateTo('../Reportes/reportes.html');
        });
    }

    if (configuracionLink) {
        configuracionLink.addEventListener('click', function() {
            navigateTo('../Configuracion/configuracion.html');
        });
    }

    if (rolesLink) {
        rolesLink.addEventListener('click', function() {
            navigateTo('../Gestion_de_roles/Roles.html');
        });
    }
      const menuList = document.querySelector('.menu');
    if (menuList) {
          let logoutMenuItem = menuList.querySelector('.menu-item.logout-item');
        
        if (!logoutMenuItem) {
              logoutMenuItem = document.createElement('li');
            logoutMenuItem.className = 'menu-item logout-item';
            logoutMenuItem.innerHTML = `
                <span class="material-symbols-outlined menu-icon">logout</span>
                Cerrar sesión
            `;
              menuList.appendChild(logoutMenuItem);
              logoutMenuItem.addEventListener('click', function() {
                  window.location.href = '../../Login/index.html';
            });
        }
    }

});