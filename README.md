# Proyecto de Gestión Médica - SaludPlus

## 📋 Descripción del Proyecto

**SaludPlus** es un sistema de gestión médica integral que permite administrar usuarios, roles, citas médicas y historias clínicas electrónicas (HCE). El sistema está diseñado para facilitar la gestión de clínicas y centros médicos a través de:

- Dashboard administrativo
- Gestión de roles y usuarios
- Agenda de citas médicas
- Reportes y estadísticas
- Configuración del sistema

---

## 📁 Estructura del Proyecto

```
PROYECTO/
├── admin/
│   ├── Gestion_de_roles/
│   │   ├── Crear/
│   │   │   ├── crear.html
│   │   │   ├── JS/
│   │   │   │   └── script.js
│   │   │   └── styles.css
│   │   ├── Roles.html
│   │   ├── JS/
│   │   │   └── script.js
│   │   └── styles.css
│   ├── HCE/
│   ├── Reportes/
│   ├── base.css
│   ├── navigation.js
│   └── Login/
├── vscode/
├── images/
├── app.js
├── index.html
├── style.css
├── medico/
├── paciente/
│   ├── Agendar/
│   │   ├── agendar.html
│   │   ├── JS/
│   │   │   └── script.js
│   │   └── styles.css
│   ├── Citas/
│   │   ├── citas.html
│   │   ├── JS/
│   │   │   └── script.js
│   │   └── styles.css
│   └── Configuration/
├── citasStorage.js
├── proxy/
├── db/
├── node_modules/
├── env/
├── admin_leader.json
├── citas.js
├── database.db
├── medicos.js
└── package_lock.json
```

---

## 🚀 Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3 (responsive design)
- JavaScript (ES6+)
- Chart.js (para estadísticas)
- Google Material Icons

### Backend
- Node.js
- Express.js
- SQLite (base de datos)
- Bcrypt (hash de contraseñas)
- express-session (manejo de sesiones)

---

## ✅ Funcionalidades Principales

### 🔧 Dashboard Administrativo
- Estadísticas clave en tiempo real
- Gráficos de citas por especialidad
- Últimas HCE modificadas
- Accesos rápidos (agregar médico, generar reportes)

### 👥 Gestión de Usuarios
- Crear, editar y eliminar usuarios
- Asignar roles (admin, médico, paciente)
- Autenticación segura
- Perfiles personalizados

### 📅 Agenda de Citas
- Visualización diaria/semanal/mensual
- Filtros por estado y especialidad
- Agendamiento, confirmación y cancelación de citas

---

## ⚙️ Configuración del Proyecto

### Requisitos previos

- Node.js (v14 o superior)
- npm (v6 o superior)

### Instalación

```bash
npm install
```

### Configuración inicial

Crear archivo `admin_leader.json` en la raíz del proyecto con las credenciales del administrador principal:

```json
{
  "nombre": "Admin Líder",
  "email": "admin@saludplus.com",
  "password_hash": "salt:hash_generado"
}
```

### Ejecutar el servidor

```bash
node app.js
```

---

## 🌐 Acceso

- Servidor backend: [http://localhost:3000](http://localhost:3000)
- Dashboard administrativo: `/admin`
- Área de pacientes: `/paciente`

---

## 📡 API Endpoints

### Usuarios

- `POST /api/usuarios` - Crear nuevo usuario  
- `GET /api/usuarios` - Listar todos los usuarios  
- `GET /api/usuarios/:id` - Obtener usuario específico  
- `PUT /api/usuarios/:id` - Actualizar usuario  
- `DELETE /api/usuarios/:id` - Eliminar usuario  
- `POST /api/usuarios/login` - Autenticación de usuario  

### Médicos

- Endpoints específicos para la gestión de médicos

### Citas

- Endpoints para creación, edición y consulta de citas médicas

---
