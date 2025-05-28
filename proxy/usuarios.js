const express = require('express');
const crypto = require('crypto');
const session = require('express-session');

module.exports = (db, adminLeader) => {
  const router = express.Router();

  router.use(session({
    secret: process.env.SESSION_SECRET || 'secreto_desarrollo_123',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    }
  }));

  const encryptPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
  };

  const verifyPassword = (stored, passwordAttempt) => {
    const [salt, hash] = stored.split(':');
    const hashAttempt = crypto.pbkdf2Sync(passwordAttempt, salt, 1000, 64, 'sha512').toString('hex');
    return hashAttempt === hash;
  };

  const getDisplayRole = (dbRole) => ({
    'admin_general': 'Admin General',
    'admin_area': 'Admin Área',
    'medico_especialista': 'Médico Especialista',
    'medico_general': 'Médico General',
    'paciente': 'Paciente'
  }[dbRole] || dbRole);
    router.post('/', (req, res) => {
    const { nombre, email, codigo_pais, telefono, password, rol, rol_tipo, especialidad } = req.body;

    if (!nombre || !email || !codigo_pais || !telefono || !password || !rol) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    db.get("SELECT 1 FROM roles_permitidos WHERE nombre = ?", [rol], (err, row) => {
      if (err || !row) return res.status(400).json({ error: "Rol no válido" });

      if (rol.startsWith('admin') && !rol_tipo) return res.status(400).json({ error: "Falta tipo de administrador" });
      if (rol.startsWith('medico') && !especialidad) return res.status(400).json({ error: "Falta especialidad médica" });

      const passwordHash = encryptPassword(password);
      const telefono_completo = `${codigo_pais} ${telefono}`;

      db.run(`INSERT INTO usuarios (
        nombre, email, codigo_pais, telefono, telefono_completo,
        password_hash, rol, rol_tipo, especialidad
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nombre, email, codigo_pais, telefono, telefono_completo, passwordHash, rol, rol_tipo || null, especialidad || null],
        function (err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              return res.status(409).json({ error: "El email ya está registrado" });
            }
            return res.status(500).json({ error: "Error al guardar el usuario" });
          }

          db.get(`SELECT id, nombre, email, rol, rol_tipo, especialidad,
            strftime('%Y-%m-%d %H:%M:%S', fecha_creacion) as fecha_creacion 
            FROM usuarios WHERE id = ?`, [this.lastID], (err, user) => {
            if (err || !user) {
              return res.status(201).json({ id: this.lastID, warning: "Usuario creado pero no se pudo verificar" });
            }

            res.status(201).json({ ...user, displayRole: getDisplayRole(user.rol) });
          });
        });
    });
  });
    router.get('/', (req, res) => {
    db.all(`SELECT id, nombre, email, telefono_completo, rol, rol_tipo, especialidad,
      strftime('%Y-%m-%d %H:%M:%S', fecha_creacion) as fecha_creacion
      FROM usuarios ORDER BY fecha_creacion DESC`, (err, rows) => {
      if (err) return res.status(500).json({ error: "Error al obtener usuarios" });

      if (adminLeader) {
        rows.unshift({
          id: 0,
          nombre: adminLeader.nombre,
          email: adminLeader.email,
          telefono_completo: null,
          rol: 'admin_general',
          rol_tipo: null,
          especialidad: null,
          fecha_creacion: null,
          displayRole: 'Admin Líder'
        });
      }

      const usersWithDisplayRole = rows.map(user => ({
        ...user,
        displayRole: user.id === 0 ? user.displayRole : getDisplayRole(user.rol)
      }));

      res.json(usersWithDisplayRole);
    });
  });
    router.get('/:id', (req, res) => {
    const userId = req.params.id;

    db.get(`SELECT id, nombre, email, telefono_completo, rol, rol_tipo, especialidad,
            strftime('%Y-%m-%d %H:%M:%S', fecha_creacion) as fecha_creacion
            FROM usuarios WHERE id = ?`, [userId], (err, user) => {
      if (err) return res.status(500).json({ error: "Error al obtener el usuario" });
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      res.json({
        ...user,
        displayRole: getDisplayRole(user.rol)
      });
    });
  });
    router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, email, codigo_pais, telefono, rol, rol_tipo, especialidad } = req.body;

    db.get("SELECT * FROM usuarios WHERE id = ?", [id], (err, currentUser) => {
      if (err || !currentUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const updated = {
        nombre: nombre?.trim() || currentUser.nombre,
        email: email?.trim() || currentUser.email,
        codigo_pais: codigo_pais?.trim() || currentUser.codigo_pais,
        telefono: telefono?.trim() || currentUser.telefono,
        rol: rol?.trim() || currentUser.rol,
        rol_tipo: rol_tipo?.trim() || currentUser.rol_tipo,
        especialidad: especialidad?.trim() || currentUser.especialidad
      };

      db.get("SELECT 1 FROM roles_permitidos WHERE nombre = ?", [updated.rol], (err, row) => {
        if (err || !row) return res.status(400).json({ error: "Rol no válido" });

        if (updated.rol.startsWith('admin') && !updated.rol_tipo) return res.status(400).json({ error: "Falta tipo de administrador" });
        if (updated.rol.startsWith('medico') && !updated.especialidad) return res.status(400).json({ error: "Falta especialidad médica" });

        updated.telefono_completo = `${updated.codigo_pais} ${updated.telefono}`;

        db.run(`UPDATE usuarios SET 
          nombre = ?, email = ?, codigo_pais = ?, telefono = ?, 
          telefono_completo = ?, rol = ?, rol_tipo = ?, especialidad = ? 
          WHERE id = ?`,
          [
            updated.nombre, updated.email, updated.codigo_pais, updated.telefono,
            updated.telefono_completo, updated.rol, updated.rol_tipo, updated.especialidad, id
          ],
          function (err) {
            if (err) {
              if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ error: "El email ya está registrado" });
              }
              return res.status(500).json({ error: "Error al actualizar el usuario" });
            }

            if (this.changes === 0) {
              return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.json({ message: "Usuario actualizado correctamente" });
          });
      });
    });
  });
    router.delete('/:id', (req, res) => {
    const userId = req.params.id;

    if (adminLeader && userId === '0') {
      return res.status(403).json({ error: "No se puede eliminar al admin líder" });
    }

    db.run("DELETE FROM usuarios WHERE id = ?", [userId], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Usuario no encontrado" });

      res.json({ success: true, message: `Usuario ${userId} eliminado correctamente` });
    });
  });
    router.post('/login', (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ error: 'Faltan credenciales o rol' });

    if (adminLeader && email === adminLeader.email) {
      if (verifyPassword(adminLeader.password_hash, password)) {
        if (role !== 'admin_general') {
          return res.status(401).json({ error: 'Credenciales incorrectas para este rol' });
        }

        req.session.userId = 0;
        req.session.rol = 'admin_general';
        req.session.nombre = adminLeader.nombre;

        console.log(`Admin líder autenticado - ID: 0, Email: ${email}, Rol: admin_general`);

        return res.json({
          id: 0,
          nombre: adminLeader.nombre,
          email: adminLeader.email,
          rol: 'admin_general',
          displayRole: 'Admin Líder',
          message: 'Login exitoso (Admin Líder)'
        });
      }
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    db.get("SELECT id, nombre, email, password_hash, rol, rol_tipo, especialidad FROM usuarios WHERE email = ?", [email], (err, user) => {
      if (err || !user || !verifyPassword(user.password_hash, password)) {
        return res.status(401).json({ error: "Credenciales incorrectas" });
      }

      if (user.rol !== role) {
        return res.status(401).json({ error: "Credenciales incorrectas para este rol" });
      }

      req.session.userId = user.id;
      req.session.rol = user.rol;
      req.session.nombre = user.nombre;

      console.log(`Usuario autenticado - ID: ${user.id}, Email: ${user.email}, Rol: ${user.rol}`);

      res.json({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        rol_tipo: user.rol_tipo,
        especialidad: user.especialidad,
        displayRole: getDisplayRole(user.rol),
        message: "Login exitoso"
      });
    });
  });

  return router;
};