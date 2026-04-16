/* Funcion que sirve para asignar los tickets abiertos a los tecnicos, esto solo lo puede hacer el administrador */
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
        /* to_char: Formatea la fecha de creación para que sea legible en el frontend */
        to_char(t.fecha_creacion, 'YYYY-MM-DD') AS fecha,
        /* COALESCE: Si la fecha de cierre es nula, devuelve un guion '—' en su lugar */
        COALESCE(to_char(t.fecha_cierre, 'YYYY-MM-DD'), '—') AS "fechaCierre",
        t.estado,
        /* LEFT JOIN + COALESCE: Trae el nombre del técnico si existe, sino pone 'Pendiente' */
        COALESCE(ut.nombre, 'Pendiente') AS tecnico
      FROM tickets t
      /* JOIN: Relaciona el ticket con el usuario que lo creó (id_usuario) */
      JOIN usuarios u ON t.id_usuario = u.id_usuario
      /* LEFT JOIN: Permite ver el ticket aunque no tenga un técnico asignado todavía */
      LEFT JOIN usuarios ut ON t.id_tecnico = ut.id_usuario
      /* ILIKE + TRIM: Busca el estado 'abierto' ignorando mayúsculas/minúsculas y espacios extra */
      WHERE TRIM(t.estado) ILIKE 'abierto'
      ORDER BY t.fecha_creacion DESC
    `;
    const resultado = await pool.query(query);
    res.json(resultado.rows); // Envía la lista de tickets abiertos al frontend
  } catch (error) {
    console.error("❌ Error en GET /tickets-por-asignar:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// 2. Asignar técnico y cambiar estado a 'en proceso'
router.put('/asignar-tecnico', async (req, res) => {
  /* Extrae los datos necesarios del cuerpo de la petición (JSON enviado desde el frontend) */
  const { id_ticket, id_tecnico } = req.body;

  /* Validación básica para asegurar que el cliente envió ambos IDs */
  if (!id_ticket || !id_tecnico) {
    return res.status(400).json({ error: "Faltan datos (id_ticket o id_tecnico)" });
  }

  try {
    const query = `
      UPDATE tickets 
      SET id_tecnico = $1, 
          estado = 'en proceso' 
      WHERE id_ticket = $2 
      RETURNING * /* Devuelve el registro modificado para confirmar los cambios */
    `;
    /* Uso de parámetros ($1, $2) para prevenir ataques de Inyección SQL */
    const resultado = await pool.query(query, [id_tecnico, id_ticket]);

    /* Verifica si el ticket existía antes de intentar actualizarlo */
    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    /* Se actualiza el estado del ticket (en proceso) */
    res.json({ 
      mensaje: "Técnico asignado. Estado actualizado a 'en proceso'", 
      ticket: resultado.rows[0] 
    });

  /* Este catch hace que se capture por si hay un error en la base de datos */
  } catch (error) {
    console.error("❌ Error en PUT /asignar-tecnico:", error.message);
    res.status(500).json({ error: "Error en la base de datos al asignar" });
  }
});

// Exportamos el router para que index.js pueda usarlo
module.exports = router;