const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const session = require('express-session');  // <--- Importar express-session

const app = express();

app.use(cors());
app.use(bodyParser.json());
  app.use(session({
  secret: 'unaClaveSecretaMuySeguraCambiala!', // Cambia este secreto por uno fuerte
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 día
  }
}));
  
const DB_PATH = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error("❌ Error conectando a la base de datos:", err.message);
    process.exit(1);
  }
  console.log("✅ Conectado a SQLite correctamente");
});
  db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");

  const createTables = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      telefono_completo TEXT NOT NULL,
      codigo_pais TEXT NOT NULL,
      telefono TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      rol TEXT NOT NULL,
      rol_tipo TEXT,
      especialidad TEXT,
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS roles_permitidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL UNIQUE,
      descripcion TEXT
    );

    CREATE TABLE IF NOT EXISTS citas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fecha TEXT NOT NULL,
      hora TEXT NOT NULL,
      doctor TEXT NOT NULL,
      especialidad TEXT NOT NULL,
      motivo TEXT,
      paciente_id INTEGER,
      estado TEXT DEFAULT 'pendiente',
      fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (paciente_id) REFERENCES usuarios(id)
    );
  `;

  db.exec(createTables, (err) => {
    if (!err) {
      const roles = [
        { nombre: 'admin_general', descripcion: 'Administrador General' },
        { nombre: 'admin_area', descripcion: 'Administrador de Área' },
        { nombre: 'medico_especialista', descripcion: 'Médico Especialista' },
        { nombre: 'medico_general', descripcion: 'Médico General' },
        { nombre: 'paciente', descripcion: 'Paciente' }
      ];
      roles.forEach(role => {
        db.run(
          "INSERT OR IGNORE INTO roles_permitidos (nombre, descripcion) VALUES (?, ?)",
          [role.nombre, role.descripcion]
        );
      });
    } else {
      console.error("❌ Error creando tablas:", err.message);
    }
  });
});
  const adminLeaderPath = path.join(__dirname, 'admin_leader.json');
let adminLeader = null;
try {
  const rawData = fs.readFileSync(adminLeaderPath, 'utf-8');
  adminLeader = JSON.parse(rawData);
  console.log('✅ Admin líder cargado desde admin_leader.json');
} catch {
  console.warn('⚠️ No se pudo cargar admin_leader.json o no existe.');
}
  function getDisplayRole(dbRole) {
  const roles = {
    'admin_general': 'Admin General',
    'admin_area': 'Admin Área',
    'medico_especialista': 'Médico Especialista',
    'medico_general': 'Médico General',
    'paciente': 'Paciente'
  };
  return roles[dbRole] || dbRole;
}
  const verifyPassword = (stored, passwordAttempt) => {
  const [salt, hash] = stored.split(':');
  const hashAttempt = crypto.pbkdf2Sync(passwordAttempt, salt, 1000, 64, 'sha512').toString('hex');
  return hashAttempt === hash;
};
  const usuariosRouter = require('./usuarios')(db, adminLeader);
app.use('/api/usuarios', usuariosRouter);

const medicosRouter = require('./medicos')(db);
app.use('/api/medicos', medicosRouter);

const citasRouter = require('./citas')(db);
app.use('/api/citas', citasRouter);
  app.get('/api/diagnostico', (req, res) => {
  const diagnostico = {
    dbExists: fs.existsSync(DB_PATH),
    dbSize: fs.existsSync(DB_PATH) ? `${(fs.statSync(DB_PATH).size / 1024).toFixed(2)} KB` : 'No existe',
    tables: [],
    users: 0,
    roles: []
  };

  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (tables) diagnostico.tables = tables.map(t => t.name);

    db.get("SELECT count(*) as count FROM usuarios", (err, row) => {
      diagnostico.users = row ? row.count : 0;

      db.all("SELECT * FROM roles_permitidos", (err, roles) => {
        diagnostico.roles = roles || [];

        fs.access(DB_PATH, fs.constants.R_OK | fs.constants.W_OK, (err) => {
          diagnostico.dbWritable = !err;
          res.json(diagnostico);
        });
      });
    });
  });
});
  const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor proxy en http://localhost:${PORT}`);
});
