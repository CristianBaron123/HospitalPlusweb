document.addEventListener('DOMContentLoaded', function() {
    const hceTable = document.querySelector('.hce-table tbody');
  const hceModal = document.getElementById('hce-modal');
  const closeModal = document.querySelector('.close-modal');
  const cancelBtn = document.querySelector('.cancel-btn');
  const saveBtn = document.querySelector('.save-btn');
  const nuevaHceBtn = document.getElementById('nueva-hce');
  const exportarBtn = document.getElementById('exportar-hce');
  const searchInput = document.querySelector('.search-input');
  const filterBtns = document.querySelectorAll('.filter-btn');
    const fechaInicio = document.getElementById('fecha-inicio');
  const fechaFin = document.getElementById('fecha-fin');
  const medicoFilter = document.getElementById('medico-filter');
    const modalPaciente = document.getElementById('modal-paciente-input'); // Cambiado a input para editar
  const hceFecha = document.getElementById('hce-fecha');
  const hceMedico = document.getElementById('hce-medico'); // Restauramos la referencia al médico
  const hceEditor = document.getElementById('hce-editor'); // Añadimos referencia al último editor
  const hceDiagnostico = document.getElementById('hce-diagnostico');
  const hceMedicamentos = document.getElementById('hce-medicamentos');
  const hceAlergias = document.getElementById('hce-alergias');
  const hceAntecedentes = document.getElementById('hce-antecedentes');
    let currentRow = null;
  let isNewRecord = false;
    hceTable.addEventListener('click', function(e) {
    const row = e.target.closest('tr');
    if (row) {
      openModal(row);
    }
  });
    closeModal.addEventListener('click', closeHceModal);
  cancelBtn.addEventListener('click', closeHceModal);
    saveBtn.addEventListener('click', saveChanges);
    nuevaHceBtn.addEventListener('click', createNewHce);
    function openModal(row) {
    isNewRecord = false;
    currentRow = row;
      const id = row.dataset.id;
    const nombre = row.cells[1].textContent;
    const fecha = row.dataset.fecha;
      const medico = row.dataset.medico || '';
    const editor = row.dataset.editor || medico;
    const diagnostico = row.dataset.diagnostico || '';
      modalPaciente.value = nombre; // Ahora es un input, usamos value
    hceFecha.value = fecha;
    hceMedico.value = medico;
    hceEditor.value = editor;
    hceDiagnostico.value = diagnostico;
      hceMedicamentos.value = row.dataset.medicamentos || '';
    hceAlergias.value = row.dataset.alergias || '';
    hceAntecedentes.value = row.dataset.antecedentes || '';
      hceModal.style.display = 'block';
  }
    function closeHceModal() {
    hceModal.style.display = 'none';
    currentRow = null;
  }
    function saveChanges() {
    if (!currentRow && !isNewRecord) return;
    
    const paciente = modalPaciente.value.trim();
    const fecha = hceFecha.value;
    const medico = hceMedico.value.trim();
    const editor = hceEditor.value.trim();
    const diagnostico = hceDiagnostico.value.trim();
    const medicamentos = hceMedicamentos.value.trim();
    const alergias = hceAlergias.value.trim();
    const antecedentes = hceAntecedentes.value.trim();
      if (!paciente || !fecha || !medico || !editor) {
      alert('Por favor, complete todos los campos obligatorios: Paciente, Fecha, Médico y Último Editor');
      return;
    }
      const allFieldsFilled = diagnostico && medicamentos && alergias && antecedentes;
      const estado = allFieldsFilled ? 'firmado' : 'nuevo';
    
    if (isNewRecord) {
        const newRow = document.createElement('tr');
      const newId = 'P-' + Math.floor(1000 + Math.random() * 9000);
        const selectedDate = new Date(fecha);
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes() < 10 ? '0' + selectedDate.getMinutes() : selectedDate.getMinutes();
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const displayDate = selectedDate.getDate() + '/' + months[selectedDate.getMonth()] + ' ' + hours + ':' + minutes;
        newRow.dataset.id = newId;
      newRow.dataset.fecha = fecha;
      newRow.dataset.medico = medico;
      newRow.dataset.editor = editor;
      newRow.dataset.diagnostico = diagnostico;
      newRow.dataset.medicamentos = medicamentos;
      newRow.dataset.alergias = alergias;
      newRow.dataset.antecedentes = antecedentes;
        newRow.innerHTML = `
        <td>#${newId}</td>
        <td>${paciente}</td>
        <td>${displayDate}</td>
        <td><span class="status-badge ${estado}">${estado === 'firmado' ? 'Firmada' : 'Nueva'}</span></td>
        <td class="actions-cell">
          <button class="delete-btn" title="Eliminar">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </td>
      `;
        hceTable.prepend(newRow);
        const deleteBtn = newRow.querySelector('.delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
          e.stopPropagation(); // Evitar que se abra el modal
          borrarHCE(newRow);
        });
      }
    } else {
        currentRow.dataset.fecha = fecha;
      currentRow.dataset.medico = medico;
      currentRow.dataset.editor = editor;
      currentRow.dataset.diagnostico = diagnostico;
      currentRow.dataset.medicamentos = medicamentos;
      currentRow.dataset.alergias = alergias;
      currentRow.dataset.antecedentes = antecedentes;
        const selectedDate = new Date(fecha);
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes() < 10 ? '0' + selectedDate.getMinutes() : selectedDate.getMinutes();
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const displayDate = selectedDate.getDate() + '/' + months[selectedDate.getMonth()] + ' ' + hours + ':' + minutes;
        currentRow.cells[1].textContent = paciente;
      currentRow.cells[2].textContent = displayDate;
      currentRow.cells[3].innerHTML = `<span class="status-badge ${estado}">${estado === 'firmado' ? 'Firmada' : 'Nueva'}</span>`;
        if (!currentRow.querySelector('.actions-cell')) {
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        actionsCell.innerHTML = `
          <button class="delete-btn" title="Eliminar">
            <span class="material-symbols-outlined">delete</span>
          </button>
        `;
        currentRow.appendChild(actionsCell);
          const deleteBtn = currentRow.querySelector('.delete-btn');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que se abra el modal
            borrarHCE(currentRow);
          });
        }
      }
    }
      closeHceModal();
  }
    function createNewHce() {
    isNewRecord = true;
    currentRow = null;
      modalPaciente.value = ''; // Ahora es un input, usamos value
      const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    hceFecha.value = `${year}-${month}-${day}T${hours}:${minutes}`;
      hceMedico.value = ''; // Dejamos que el usuario seleccione
    hceEditor.value = ''; // También dejamos que el usuario seleccione
    
    hceDiagnostico.value = '';
    hceMedicamentos.value = '';
    hceAlergias.value = '';
    hceAntecedentes.value = '';
      hceModal.style.display = 'block';
  }
    function actualizarEstadoHCE() {
    const rows = hceTable.querySelectorAll('tr');
    
    rows.forEach(row => {
        const diagnostico = row.dataset.diagnostico || '';
      const medicamentos = row.dataset.medicamentos || '';
      const alergias = row.dataset.alergias || '';
      const antecedentes = row.dataset.antecedentes || '';
        const allFieldsFilled = diagnostico && medicamentos && alergias && antecedentes;
      const estado = allFieldsFilled ? 'firmado' : 'nuevo';
        row.cells[4].innerHTML = `<span class="status-badge ${estado}">${estado === 'firmado' ? 'Firmada' : 'Nueva'}</span>`;
    });
  }
    actualizarEstadoHCE();
        searchInput.addEventListener('input', filterTable);
  fechaInicio.addEventListener('change', filterTable);
  fechaFin.addEventListener('change', filterTable);
  medicoFilter.addEventListener('change', filterTable);
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterTable();
    });
  });
    function filterTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const startDate = fechaInicio.value ? new Date(fechaInicio.value) : null;
    const endDate = fechaFin.value ? new Date(fechaFin.value) : null;
    const selectedMedico = medicoFilter.value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.status;
    
    const rows = hceTable.querySelectorAll('tr');
    
    rows.forEach(row => {
        const id = row.cells[0].textContent.toLowerCase();
      const nombre = row.cells[1].textContent.toLowerCase();
      const fechaTexto = row.cells[2].textContent; // Formato: DD/Mes HH:MM
      const estado = row.cells[3].textContent.toLowerCase();
      const medico = row.dataset.medico ? row.dataset.medico.toLowerCase() : '';
        let rowDate = null;
      if (fechaTexto) {
          const parts = fechaTexto.split(' ');
        if (parts.length >= 2) {
          const dateParts = parts[0].split('/');
          const day = parseInt(dateParts[0]);
          const monthText = dateParts[1];
          const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
          const month = months.findIndex(m => monthText.toLowerCase().startsWith(m));
          
          if (month !== -1) {
            const timeParts = parts[1].split(':');
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
              rowDate = new Date();
            rowDate.setMonth(month);
            rowDate.setDate(day);
            rowDate.setHours(hours);
            rowDate.setMinutes(minutes);
          }
        }
      }
        const matchesSearch = id.includes(searchTerm) || 
                           nombre.includes(searchTerm);
      
      const matchesDateRange = (!startDate || !rowDate || rowDate >= startDate) && 
                              (!endDate || !rowDate || rowDate <= endDate);
      
      const matchesMedico = !selectedMedico || medico.includes(selectedMedico);
      
      const matchesStatus = activeFilter === 'todos' || 
                           (activeFilter === 'nuevo' && estado.includes('nueva')) || 
                           (activeFilter === 'firmado' && estado.includes('firmada'));
        row.style.display = matchesSearch && matchesDateRange && matchesMedico && matchesStatus ? '' : 'none';
    });
  }
                              function borrarHCE(row) {
    if (confirm('¿Está seguro de que desea eliminar esta Historia Clínica? Esta acción no se puede deshacer.')) {
      row.remove();
      actualizarMedicosFiltro(); // Actualizar la lista de médicos en el filtro
    }
  }
    function agregarBotonesBorrar() {
    const rows = hceTable.querySelectorAll('tr');
    
    rows.forEach(row => {
        if (!row.querySelector('.delete-btn')) {
          const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        actionsCell.innerHTML = `
          <button class="delete-btn" title="Eliminar">
            <span class="material-symbols-outlined">delete</span>
          </button>
        `;
        row.appendChild(actionsCell);
          const deleteBtn = row.querySelector('.delete-btn');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que se abra el modal
            borrarHCE(row);
          });
        }
      }
    });
  }
    agregarBotonesBorrar();
    closeHceModal();
});