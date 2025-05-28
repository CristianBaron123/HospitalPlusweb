module.exports = function(db) {
  const express = require('express');
  const router = express.Router();
    router.post('/agendar', (req, res) => {
    console.log('🔍 req.session:', req.session);
      if (!req.session.userId || req.session.rol !== 'paciente') {
      return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión como paciente.' });
    }

    const { fecha, hora, doctor, especialidad, motivo } = req.body;
    const paciente_id = req.session.userId; 
      if (!fecha) return res.status(400).json({ error: 'La fecha es requerida' });
    if (!hora) return res.status(400).json({ error: 'La hora es requerida' });
    if (!doctor) return res.status(400).json({ error: 'El doctor es requerido' });
    if (!especialidad) return res.status(400).json({ error: 'La especialidad es requerida' });
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return res.status(400).json({ error: 'Formato de fecha inválido. Use YYYY-MM-DD' });
    }
      if (!/^\d{2}:\d{2}$/.test(hora)) {
      return res.status(400).json({ error: 'Formato de hora inválido. Use HH:MM' });
    }
      console.log('📥 Datos recibidos para agendar cita:', {
      fecha,
      hora,
      doctor,
      especialidad,
      motivo: motivo || '(sin motivo)',
      paciente_id
    });
      db.get(
      `SELECT id FROM citas 
       WHERE doctor = ? AND fecha = ? AND hora = ?`,
      [doctor, fecha, hora],
      (err, citaExistente) => {
        if (err) {
          console.error('❌ Error al verificar disponibilidad:', err.message);
          return res.status(500).json({ 
            error: 'Error al verificar disponibilidad del doctor',
            details: err.message
          });
        }

        if (citaExistente) {
          return res.status(409).json({ 
            error: 'El doctor ya tiene una cita programada en esa fecha y hora',
            doctor,
            fecha,
            hora
          });
        }
          db.run(
          `INSERT INTO citas (fecha, hora, doctor, especialidad, motivo, paciente_id, estado)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [fecha, hora, doctor, especialidad, motivo || '', paciente_id, 'pendiente'],
          function(err) {
            if (err) {
              console.error('❌ Error al agendar cita:', {
                message: err.message,
                stack: err.stack,
                params: [fecha, hora, doctor, especialidad, motivo || '', paciente_id]
              });
              return res.status(500).json({ 
                error: 'Error interno al agendar la cita',
                details: err.message
              });
            }

            console.log('✅ Cita agendada exitosamente:', {
              id: this.lastID,
              fecha,
              hora,
              doctor,
              especialidad,
              paciente_id
            });
            
            res.status(201).json({ 
              id: this.lastID,
              message: 'Cita agendada exitosamente',
              cita: {
                id: this.lastID,
                fecha,
                hora,
                doctor,
                especialidad,
                motivo: motivo || '',
                paciente_id,
                estado: 'pendiente'
              }
            });
          }
        );
      }
    );
  });
    router.get('/paciente/:id', (req, res) => {
    const { id } = req.params;
    const { filtro = 'todos' } = req.query;
      if (!req.session.userId) {
      return res.status(401).json({ error: 'No autorizado. Debe iniciar sesión.' });
    }
      if (req.session.rol === 'paciente' && parseInt(id) !== req.session.userId) {
      return res.status(403).json({ error: 'No tiene permiso para ver estas citas.' });
    }
      if (isNaN(id)) {
      return res.status(400).json({ error: 'ID de paciente inválido' });
    }

    let query = `SELECT 
                  id, 
                  fecha, 
                  hora, 
                  doctor, 
                  especialidad, 
                  motivo, 
                  estado,
                  strftime('%Y-%m-%d', fecha) as fecha_formateada
                FROM citas 
                WHERE paciente_id = ?`;
    const params = [id];
      if (filtro === 'hoy') {
      query += ` AND fecha = date('now')`;
    } else if (filtro === 'semana') {
      query += ` AND fecha BETWEEN date('now') AND date('now', '+7 days')`;
    } else if (filtro === 'mes') {
      query += ` AND strftime('%m', fecha) = strftime('%m', 'now')`;
    }
      query += ` ORDER BY fecha ASC, hora ASC`;

    console.log(`📋 Consultando citas para paciente ${id} con filtro ${filtro}`);
    
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('❌ Error al obtener citas:', {
          error: err.message,
          query,
          params
        });
        return res.status(500).json({ 
          error: 'Error al obtener citas',
          details: err.message
        });
      }
        const citasFormateadas = rows.map(cita => ({
        ...cita,
        fecha: cita.fecha_formateada,
        fecha_legible: new Date(cita.fecha_formateada).toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }));

      console.log(`✅ Encontradas ${citasFormateadas.length} citas para paciente ${id}`);
      res.json(citasFormateadas);
    });
  });

  return router;
};