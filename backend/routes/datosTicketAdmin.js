const express = require('express');
const router = express.Router();
const pool = require('../db'); // Verifica que la ruta hacia tu conexión 'db' sea correcta

// Obtener el detalle completo de un ticket por su ID

router.get('/detalle-ticket/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        t.id_ticket,
        b_usuario.nombre AS nombre_usuario,
        t.categoria_servicio,
        t.subcategoria_falla,
        t.nivel_prioridad,
        t.grado_impacto,
        to_char(t.fecha_creacion, 'DD/MM/YYYY') AS fecha_creacion_formateada,
        t.estado,
        t.titulo_falla,
        t.descripcion_falla,
        t.id_tecnico,
        COALESCE(e.tipo_equipo || ' - ' || e.marca, 'N/A') AS equipo_nombre
      FROM ticket t
      JOIN base b_usuario ON t.id_base = b_usuario.id_base
      LEFT JOIN equipo e ON t.id_equipo = e.id_equipo
      WHERE t.id_ticket = $1;
    `;
    
    const resultado = await pool.query(query, [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(`❌ Error en GET /api/datos-ticket-admin/detalle-ticket/${id}:`, error.message);
    res.status(500).json({ error: "Error al obtener el detalle del ticket en el servidor" });
  }
});

module.exports = router;