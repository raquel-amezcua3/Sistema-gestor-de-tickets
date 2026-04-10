const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. Obtener tickets para asignar (Estado 'abierto')
router.get('/tickets-por-asignar', async (req, res) => {
  try {
    const query = `
      SELECT 
        t.id_ticket AS id, 
        u.nombre AS nombre, 
        t.titulo, 
        t.descripcion, 
        to_char(t.fecha_creacion, 'YYYY-MM-DD') AS fecha,
        COALESCE(to_char(t.fecha_cierre, 'YYYY-MM-DD'), '—') AS "fechaCierre",
        t.estado,
        COALESCE(ut.nombre, 'Pendiente') AS tecnico
      FROM tickets t
      JOIN usuarios u ON t.id_usuario = u.id_usuario
      LEFT JOIN usuarios ut ON t.id_tecnico = ut.id_usuario
      WHERE TRIM(t.estado) ILIKE 'abierto'
      ORDER BY t.fecha_creacion DESC
    `;
    const resultado = await pool.query(query);
    res.json(resultado.rows);
  } catch (error) {
    console.error("❌ Error en GET /tickets-por-asignar:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 2. Asignar técnico y cambiar estado a 'en proceso'
router.put('/asignar-tecnico', async (req, res) => {
  const { id_ticket, id_tecnico } = req.body;

  if (!id_ticket || !id_tecnico) {
    return res.status(400).json({ error: "Faltan datos (id_ticket o id_tecnico)" });
  }

  try {
    const query = `
      UPDATE tickets 
      SET id_tecnico = $1, 
          estado = 'en proceso' 
      WHERE id_ticket = $2 
      RETURNING *
    `;
    const resultado = await pool.query(query, [id_tecnico, id_ticket]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json({ 
      mensaje: "Técnico asignado. Estado actualizado a 'en proceso'", 
      ticket: resultado.rows[0] 
    });
  } catch (error) {
    console.error("❌ Error en PUT /asignar-tecnico:", error.message);
    res.status(500).json({ error: "Error en la base de datos al asignar" });
  }
});

module.exports = router;