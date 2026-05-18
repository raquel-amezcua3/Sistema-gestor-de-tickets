const express = require('express');
const router = express.Router();
const pool = require('../db'); // Conexión centralizada

// @route   GET /api/admin/lista-tecnicos
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        t.id_tecnico,
        b.nombre,
        b.correo,
        b.telefono,
        COALESCE(t.especialidad, 'Sin asignar') AS especialidad
      FROM Base b
      INNER JOIN Tecnico t ON b.id_base = t.id_base
      ORDER BY t.id_tecnico ASC;
    `;
    const resultado = await pool.query(query);
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("❌ Error en ListaAdmin:", error.message);
    res.status(500).json({ error: "Error interno obteniendo técnicos" });
  }
});

module.exports = router;