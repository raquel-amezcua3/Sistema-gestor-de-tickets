//Esta funcion es para mostrar los datos del tecnico en la lista de Admin (listaAdmin.jsx)
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Tu conexión a la base de datos

// @route   GET /api/admin/detalle-tecnico-perfil/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        t.id_tecnico,
        b.nombre,
        b.correo,
        b.telefono,
        b.extension,
        COALESCE(t.especialidad, 'Sin asignar') AS especialidad
      FROM Base b
      INNER JOIN Tecnico t ON b.id_base = t.id_base
      WHERE t.id_tecnico = $1;
    `;
    
    const resultado = await pool.query(query, [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Técnico no encontrado" });
    }
    
    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    console.error("❌ Error en datosTecnicoDetalle:", error.message);
    res.status(500).json({ error: "Error interno en el servidor" });
  }
});

module.exports = router;