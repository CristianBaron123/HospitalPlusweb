  
class AuthService {
  static async getCurrentUser() {
    try {
      const response = await fetch('http://localhost:3000/api/usuarios/current', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
            window.location.href = '../Login/login.html';
        }
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  }

  static updateUserUI(userData) {
    try {
        const updateElements = (selector, value) => {
        document.querySelectorAll(selector).forEach(el => {
          el.textContent = value || '---';
        });
      };

      updateElements('.user-name', userData?.nombre);
      updateElements('.user-role', userData?.displayRole || userData?.rol);
        document.querySelectorAll('.user-avatar').forEach(el => {
        el.textContent = (userData?.nombre?.charAt(0) || 'U').toUpperCase();
      });

    } catch (error) {
      console.error('Error actualizando UI:', error);
    }
  }

  static async initialize() {
    try {
      const user = await this.getCurrentUser();
      this.updateUserUI(user);
      return user;
    } catch (error) {
      console.error('Error inicializando autenticación:', error);
      return null;
    }
  }
}
  document.addEventListener('DOMContentLoaded', () => {
  AuthService.initialize();
});