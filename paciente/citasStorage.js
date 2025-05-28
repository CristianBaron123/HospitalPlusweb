const citasStorage = {
  citas: [],
  
  getCitas: function() {
    return this.citas;
  },
  
  addCita: function(nuevaCita) {
    this.citas.push(nuevaCita);
    this.actualizarVistas();
  },
    actualizarVistas: function() {
      const event = new CustomEvent('citasActualizadas', {
      detail: { citas: this.citas }
    });
    document.dispatchEvent(event);
  }
};

export default citasStorage;