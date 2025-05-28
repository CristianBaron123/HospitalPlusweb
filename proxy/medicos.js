  const express = require('express');

module.exports = (db) => {
  const router = express.Router();
    router.get('/cantidad', (req, res) => {
    const query = `
      SELECT COUNT(*) as total FROM usuarios 
      WHERE rol LIKE 'medico%'
    `;

    db.get(query, [], (err, row) => {
      if (err) {
        console.error('❌ Error al obtener cantidad de médicos:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      res.json({ total: row.total });
    });
  });

  return router;
};
