const doctoresPorEspecialidad = {
  cardiologia: ["Kofi"],
  pediatria: ["Dra. Sofía Ramírez"],
  ginecologia: ["Dra. Valeria Castro"],
  dermatologia: ["Dr. Javier Rojas"],
  ortopedia: ["Dr. Carlos Herrera"],
  neurologia: ["Dra. Ana Fernández"],
  psiquiatria: ["Dr. Roberto Díaz"],
  oftalmologia: ["Dra. Patricia López"],
  otorrinolaringologia: ["Dr. Miguel Sánchez"]
};

let currentStep = 1;
let selectedSpecialty = '';
let selectedDoctor = '';
let selectedDate = '';
let selectedTime = '';
let formSubmitted = false; // Bandera para controlar envío duplicado

const horasDisponibles = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];
const horasOcupadas = ['09:00', '11:30', '14:30', '16:00'];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('next-btn').addEventListener('click', nextStep);
  document.getElementById('prev-btn').addEventListener('click', prevStep);
    document.getElementById('especialidad').addEventListener('change', e => {
    selectedSpecialty = e.target.value;
    populateDoctors();
  });

  document.getElementById('doctor').addEventListener('change', e => {
    selectedDoctor = e.target.value;
  });
    generateCalendar();
    updateNavigationButtons();
    const form = document.getElementById('agendar-form');
  if (form) {
      form.removeEventListener('submit', handleFormSubmit);
      form.addEventListener('submit', handleFormSubmit);
  }
    document.getElementById('logout-link')?.addEventListener('click', () => {
    window.location.href = '../../Login/index.html';
  });
  document.getElementById('configuracion-link')?.addEventListener('click', () => {
    window.location.href = '../Configuracion/configuracion.html';
  });
});
  function handleFormSubmit(e) {
  e.preventDefault();
  
  if (formSubmitted) {
    console.log('El formulario ya fue enviado, evitando envío duplicado');
    return;
  }
  
  formSubmitted = true;
  submitForm();
}

const getStepName = stepNumber => ['especialidad', 'doctor', 'fecha', 'hora', 'motivo'][stepNumber - 1];

const showStep = step => {
  for (let i = 1; i <= 5; i++) {
    document.getElementById(`step-${getStepName(i)}`).classList.add('hidden');
  }
  document.getElementById(`step-${getStepName(step)}`).classList.remove('hidden');
};

const updateNavigationButtons = () => {
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const submitBtn = document.getElementById('submit-btn');

  prevBtn.classList.toggle('hidden', currentStep === 1);
  nextBtn.classList.toggle('hidden', currentStep === 5);
  submitBtn.classList.toggle('hidden', currentStep !== 5);
};

function nextStep() {
  if (!validateCurrentStep()) return;
  currentStep++;
  if (currentStep > 5) currentStep = 5;

  showStep(currentStep);
  updateNavigationButtons();

  if (currentStep === 4) generateTimeSlots();
}

function prevStep() {
  currentStep--;
  if (currentStep < 1) currentStep = 1;

  showStep(currentStep);
  updateNavigationButtons();
}

function validateCurrentStep() {
  switch (currentStep) {
    case 1:
      if (!selectedSpecialty) {
        alert('Por favor seleccione una especialidad');
        return false;
      }
      return true;
    case 2:
      if (!selectedDoctor) {
        alert('Por favor seleccione un doctor');
        return false;
      }
      return true;
    case 3:
      if (!selectedDate) {
        alert('Por favor seleccione una fecha');
        return false;
      }
      return true;
    case 4:
      if (!selectedTime) {
        alert('Por favor seleccione una hora');
        return false;
      }
      return true;
    case 5:
      const motivo = document.getElementById('motivo').value.trim();
      if (!motivo) {
        alert('Por favor describa el motivo de su cita');
        return false;
      }
      return true;
    default:
      return false;
  }
}

function populateDoctors() {
  const doctorSelect = document.getElementById('doctor');
  doctorSelect.innerHTML = '<option value="" disabled selected>Seleccione un doctor</option>';
  const doctors = doctoresPorEspecialidad[selectedSpecialty] || [];
  doctors.forEach(doc => {
    const option = document.createElement('option');
    option.value = doc;
    option.textContent = doc;
    doctorSelect.appendChild(option);
  });
  selectedDoctor = '';
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

  ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].forEach(day => {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendario-dia-nombre';
    dayElement.textContent = day;
    daysContainer.appendChild(dayElement);
  });
  calendar.appendChild(daysContainer);

  const daysGrid = document.createElement('div');
  daysGrid.className = 'calendario-grid';

  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let i = 1; i <= lastDay; i++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendario-dia';
    dayElement.textContent = i;

    const dateObj = new Date(currentYear, currentMonth, i);

    if (dateObj < today.setHours(0, 0, 0, 0)) {
      dayElement.classList.add('disabled');
    } else {
      dayElement.addEventListener('click', () => {
        document.querySelector('.calendario-dia.selected')?.classList.remove('selected');
        dayElement.classList.add('selected');
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
      timeSlot.addEventListener('click', () => {
        document.querySelector('.hora-slot.selected')?.classList.remove('selected');
        timeSlot.classList.add('selected');
        selectedTime = hora;
      });
    }
    container.appendChild(timeSlot);
  });
}

function submitForm() {
  if (!validateCurrentStep()) {
    formSubmitted = false; // Restablece la bandera si la validación falla
    return;
  }

  const motivo = document.getElementById('motivo').value.trim();

  const cita = {
    fecha: selectedDate,
    hora: selectedTime,
    doctor: selectedDoctor,
    especialidad: selectedSpecialty,
    motivo
  };
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
  const citaExistente = citas.some(existente => 
    existente.fecha === cita.fecha && 
    existente.hora === cita.hora && 
    existente.doctor === cita.doctor
  );

  if (citaExistente) {
    alert('Ya existe una cita agendada con este médico en la misma fecha y hora');
    formSubmitted = false; // Restablece la bandera
    return;
  }

  citas.push(cita);
  localStorage.setItem('citas', JSON.stringify(citas));
    const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Guardando...';
  }
    setTimeout(() => {
    window.location.href = '../../paciente/Citas/citas.html';
  }, 500);
}