  let currentStep = 1;
let selectedPatient = '';
let selectedDate = '';
let selectedTime = '';
let isUrgent = false;
  const horasDisponibles = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];
  const horasOcupadas = ['09:00', '11:30', '14:30', '16:00'];
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('next-btn').addEventListener('click', nextStep);
  document.getElementById('prev-btn').addEventListener('click', prevStep);
    document.getElementById('paciente').addEventListener('change', function() {
    selectedPatient = this.value;
  });
    generateCalendar();
});
  function nextStep() {
    if (!validateCurrentStep()) return;
    document.getElementById(`step-${getStepName(currentStep)}`).classList.add('hidden');
    currentStep++;
    document.getElementById(`step-${getStepName(currentStep)}`).classList.remove('hidden');
    updateNavigationButtons();
    switch(currentStep) {
    case 3: // Generar horas
      generateTimeSlots();
      break;
    case 4: // Mostrar resumen
      showSummary();
      break;
  }
}
  function prevStep() {
    document.getElementById(`step-${getStepName(currentStep)}`).classList.add('hidden');
    currentStep--;
    document.getElementById(`step-${getStepName(currentStep)}`).classList.remove('hidden');
    updateNavigationButtons();
}
  function validateCurrentStep() {
  switch(currentStep) {
    case 1: // Paciente
      if (!selectedPatient) {
        alert('Por favor seleccione un paciente');
        return false;
      }
      break;
    case 2: // Fecha
      if (!selectedDate) {
        alert('Por favor seleccione una fecha');
        return false;
      }
      break;
    case 3: // Hora
      if (!selectedTime) {
        alert('Por favor seleccione una hora');
        return false;
      }
      break;
  }
  return true;
}
  function getStepName(stepNumber) {
  const steps = ['paciente', 'fecha', 'hora', 'confirmacion'];
  return steps[stepNumber - 1];
}
  function updateNavigationButtons() {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');
    if (currentStep > 1) {
    prevBtn.classList.remove('hidden');
  } else {
    prevBtn.classList.add('hidden');
  }
    if (currentStep < 4) {
    nextBtn.classList.remove('hidden');
    submitBtn.classList.add('hidden');
  } else {
    nextBtn.classList.add('hidden');
    submitBtn.classList.remove('hidden');
  }
}
  function showSummary() {
  document.getElementById('resumen-paciente').textContent = selectedPatient;
  document.getElementById('resumen-fecha').textContent = selectedDate;
  document.getElementById('resumen-hora').textContent = selectedTime;
    document.getElementById('urgente').addEventListener('change', function() {
    isUrgent = this.checked;
  });
}
  function generateCalendar() {
  const calendar = document.getElementById('calendario');
  calendar.innerHTML = '';
    const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
    const header = document.createElement('div');
  header.className = 'calendario-header';
  header.innerHTML = `<h3>${today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</h3>`;
  calendar.appendChild(header);
    const daysContainer = document.createElement('div');
  daysContainer.className = 'calendario-grid';
  
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  days.forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendario-dia-nombre';
    dayElement.textContent = day;
    daysContainer.appendChild(dayElement);
  });
  
  calendar.appendChild(daysContainer);
    const daysGrid = document.createElement('div');
  daysGrid.className = 'calendario-grid';
    const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
    for (let i = 1; i <= lastDay.getDate(); i++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendario-dia';
    dayElement.textContent = i;
      const currentDate = new Date(currentYear, currentMonth, i);
    if (currentDate < today) {
      dayElement.classList.add('disabled');
    } else {
      dayElement.addEventListener('click', function() {
          const prevSelected = document.querySelector('.calendario-dia.selected');
        if (prevSelected) prevSelected.classList.remove('selected');
          this.classList.add('selected');
        selectedDate = `${i.toString().padStart(2, '0')}/${(currentMonth + 1).toString().padStart(2, '0')}/${currentYear}`;
      });
    }
    
    daysGrid.appendChild(dayElement);
  }
  
  calendar.appendChild(daysGrid);
}
  function generateTimeSlots() {
  const container = document.getElementById('horas-container');
  container.innerHTML = '';
  
  horasDisponibles.forEach(hora => {
    const timeSlot = document.createElement('div');
    timeSlot.className = 'hora-slot';
    timeSlot.textContent = hora;
      if (horasOcupadas.includes(hora)) {
      timeSlot.classList.add('disabled');
    } else {
      timeSlot.addEventListener('click', function() {
          const prevSelected = document.querySelector('.hora-slot.selected');
        if (prevSelected) prevSelected.classList.remove('selected');
          this.classList.add('selected');
        selectedTime = hora;
      });
    }
    
    container.appendChild(timeSlot);
  });
}
  function submitForm() {
  if (!validateCurrentStep()) return;
    const [day, month, year] = selectedDate.split('/');
    const fechaISO = `${year}-${month}-${day}`;
    const cita = {
    fecha: fechaISO,
    hora: selectedTime,
    paciente: selectedPatient,
    urgente: document.getElementById('urgente').checked
  };
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
  citas.push(cita);
  localStorage.setItem('citas', JSON.stringify(citas));
    window.location.href = '../Agenda_Global/Agenda.html';
}

document.getElementById('agendar-form').addEventListener('submit', function(e) {
  e.preventDefault();
  submitForm();
});
