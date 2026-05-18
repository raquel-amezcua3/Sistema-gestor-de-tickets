//Esta funcion sirve para mostrar la cantidad de tickets en estado de "En Proceso" que tiene cada tecnico.
//Y asi el administrador puede asignar conforme a quien tenga menos tickets.
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Conexión centralizada

// @route   GET /api/admin/carga-tickets
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        id_tecnico,
        COUNT(*)::int AS carga_actual
      FROM ticket
      WHERE estado = 'En Proceso'
      GROUP BY id_tecnico;
    `;
    const resultado = await pool.query(query);
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("❌ Error en cargaticketsAdmin:", error.message);
    res.status(500).json({ error: "Error interno obteniendo carga" });
  }
});

module.exports = router;