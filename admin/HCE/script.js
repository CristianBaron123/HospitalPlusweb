document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const rows = Array.from(document.querySelectorAll('.hce-table tbody tr'));
  const nuevaHceBtn = document.getElementById('nueva-hce');
  const exportarHceBtn = document.getElementById('exportar-hce');
  const modal = document.getElementById('hce-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const cancelModalBtn = document.querySelector('.modal-footer .cancel-btn');
  const saveModalBtn = document.querySelector('.modal-footer .save-btn');
  const addAttachmentBtn = document.getElementById('add-attachment');
  const fileInput = document.getElementById('file-input');
    const hceData = {
    'P-5820': {
      paciente: 'María González',
      fecha: '2024-05-15',
      medico: 'Dr. López',
      diagnostico: 'Hipertensión arterial',
      medicamentos: 'Losartán 50mg 1x día\nHidroclorotiazida 25mg 1x día',
      alergias: 'Ninguna conocida',
      antecedentes: 'Padre con hipertensión, madre con diabetes',
      estado: 'nuevo',
      adjuntos: [],
      historial: [
        { fecha: '2024-05-15 10:30', usuario: 'Dr. López', accion: 'Creación de HCE' }
      ]
    },
    'P-7812': {
      paciente: 'Juan Pérez',
      fecha: '2024-05-14',
      medico: 'Dra. Martínez',
      diagnostico: 'Diabetes tipo 2',
      medicamentos: 'Metformina 850mg 2x día\nGlibenclamida 5mg 1x día',
      alergias: 'Sulfas',
      antecedentes: 'Madre con diabetes tipo 2',
      estado: 'firmado',
      adjuntos: [
        { nombre: 'analisis_sangre.pdf', tipo: 'pdf', fecha: '2024-05-14' },
        { nombre: 'radiografia_torax.jpg', tipo: 'imagen', fecha: '2024-05-14' }
      ],
      historial: [
        { fecha: '2024-05-14 16:15', usuario: 'Dra. Martínez', accion: 'Firma de HCE' },
        { fecha: '2024-05-14 15:30', usuario: 'Dra. Martínez', accion: 'Actualización de medicamentos' },
        { fecha: '2024-05-14 14:00', usuario: 'Enf. Carlos', accion: 'Registro inicial' }
      ]
    },
    'P-3401': {
      paciente: 'Sofía Rojas',
      fecha: '2024-05-14',
      medico: 'Dr. Rodríguez',
      diagnostico: 'Artritis reumatoide',
      medicamentos: 'Metotrexato 15mg semanal\nÁcido fólico 5mg 1x semana',
      alergias: 'Penicilina',
      antecedentes: 'Abuela con artritis reumatoide',
      estado: 'firmado',
      adjuntos: [
        { nombre: 'analisis_sangre.pdf', tipo: 'pdf', fecha: '2024-05-14' }
      ],
      historial: [
        { fecha: '2024-05-14 09:45', usuario: 'Dr. Rodríguez', accion: 'Firma de HCE' },
        { fecha: '2024-05-14 09:30', usuario: 'Enf. Laura', accion: 'Registro inicial' }
      ]
    }
  };
    function filterTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeStatus = document.querySelector('.filter-btn.active').dataset.status;
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFin = document.getElementById('fecha-fin').value;
    const medicoFilter = document.getElementById('medico-filter').value;
    
    rows.forEach(row => {
      const id = row.dataset.id.toLowerCase();
      const name = row.cells[1].textContent.toLowerCase();
      const diagnostico = row.dataset.diagnostico.toLowerCase();
      const fecha = row.dataset.fecha;
      const medico = row.cells[3].textContent;
      const statusElement = row.querySelector('.status-badge');
      const statusClass = statusElement ? statusElement.className : '';
      const isNuevo = statusClass.includes('nuevo');
      const isFirmado = statusClass.includes('firmado');
        const matchesSearch = id.includes(searchTerm) || 
                          name.includes(searchTerm) || 
                          diagnostico.includes(searchTerm);
      
      let matchesFilter = false;
      if (activeStatus === 'todos') {
        matchesFilter = true;
      } else if (activeStatus === 'nuevo' && isNuevo) {
        matchesFilter = true;
      } else if (activeStatus === 'firmado' && isFirmado) {
        matchesFilter = true;
      }
      
      const matchesFecha = (!fechaInicio || fecha >= fechaInicio) && 
                         (!fechaFin || fecha <= fechaFin);
      
      const matchesMedico = !medicoFilter || medico === medicoFilter;
      
      row.style.display = (matchesSearch && matchesFilter && matchesFecha && matchesMedico) ? '' : 'none';
    });
  }
    function openHceModal(hceId) {
    const hce = hceData[hceId];
    if (!hce) return;
    
    document.getElementById('modal-paciente').textContent = hce.paciente;
    document.getElementById('hce-fecha').value = hce.fecha;
    document.getElementById('hce-medico').value = hce.medico;
    document.getElementById('hce-diagnostico').value = hce.diagnostico;
    document.getElementById('hce-medicamentos').value = hce.medicamentos;
    document.getElementById('hce-alergias').value = hce.alergias;
    document.getElementById('hce-antecedentes').value = hce.antecedentes;
      const attachmentsList = document.getElementById('attachments-list');
    attachmentsList.innerHTML = '';
    hce.adjuntos.forEach(adjunto => {
      const attachmentItem = document.createElement('div');
      attachmentItem.className = 'attachment-item';
      attachmentItem.innerHTML = `
        <span class="material-symbols-outlined">${adjunto.tipo === 'pdf' ? 'picture_as_pdf' : 'image'}</span>
        <span>${adjunto.nombre}</span>
        <button class="view-attachment" data-file="${adjunto.nombre}">
          <span class="material-symbols-outlined">visibility</span>
        </button>
      `;
      attachmentsList.appendChild(attachmentItem);
    });
      const changesHistory = document.getElementById('changes-history');
    changesHistory.innerHTML = '';
    hce.historial.forEach(cambio => {
      const changeItem = document.createElement('div');
      changeItem.className = 'change-item';
      changeItem.innerHTML = `
        <div class="change-header">
          <span class="change-user">${cambio.usuario}</span>
          <span class="change-date">${cambio.fecha}</span>
        </div>
        <div class="change-action">${cambio.accion}</div>
      `;
      changesHistory.appendChild(changeItem);
    });
    
    modal.style.display = 'block';
  }
    filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterTable();
    });
  });

  searchInput.addEventListener('input', filterTable);
  document.getElementById('fecha-inicio').addEventListener('change', filterTable);
  document.getElementById('fecha-fin').addEventListener('change', filterTable);
  document.getElementById('medico-filter').addEventListener('change', filterTable);
    rows.forEach(row => {
    row.addEventListener('click', function() {
      openHceModal(this.dataset.id);
    });
  });
    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
  cancelModalBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });
    addAttachmentBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', function() {
    if (this.files.length > 0) {
      const attachmentsList = document.getElementById('attachments-list');
      
      Array.from(this.files).forEach(file => {
        const fileType = file.type.includes('pdf') ? 'pdf' : 'imagen';
        const attachmentItem = document.createElement('div');
        attachmentItem.className = 'attachment-item';
        attachmentItem.innerHTML = `
          <span class="material-symbols-outlined">${fileType === 'pdf' ? 'picture_as_pdf' : 'image'}</span>
          <span>${file.name}</span>
          <button class="view-attachment" data-file="${file.name}">
            <span class="material-symbols-outlined">visibility</span>
          </button>
        `;
        attachmentsList.appendChild(attachmentItem);
      });
        this.value = '';
    }
  });
    nuevaHceBtn.addEventListener('click', function() {
      alert('Redirigiendo a formulario para nueva HCE');
  });
    exportarHceBtn.addEventListener('click', function() {
    alert('Iniciando proceso de exportación de todas las HCE...');
  });
    document.getElementById('dashboard-link').addEventListener('click', function() {
    window.location.href = '../Dashboard/Dashboard.html';
  });

  document.getElementById('roles-link').addEventListener('click', function() {
    window.location.href = '../Gestion_de_Roles/Roles.html';
  });

  document.getElementById('agenda-link').addEventListener('click', function() {
    window.location.href = '../Agenda_Global/Agenda.html';
  });

  document.getElementById('reportes-link').addEventListener('click', function() {
    window.location.href = '../Reportes/Reportes.html';
  });

  document.getElementById('configuracion-link').addEventListener('click', function() {
    window.location.href = '../Configuracion/configuracion.html';
  });

  document.getElementById('logout-link').addEventListener('click', function() {
    window.location.href = '../../Login/index.html';
  });
    filterTable();
});