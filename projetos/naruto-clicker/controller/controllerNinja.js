const API_BASE = 'http://localhost:3000'; // ou onde sua API estiver rodando

window.controllerNinja = {
  getNinjas: function() {
    return $.get(`${API_BASE}/ninjas`);
  },

  getNinjaById: function(id) {
    return $.get(`${API_BASE}/ninjas/${id}`);
  }
};

