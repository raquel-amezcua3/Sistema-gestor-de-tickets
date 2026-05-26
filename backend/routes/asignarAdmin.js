//Esta pantalla es asignarAdmin.jsx y la de asignarAdmin.js
//Esta pantalla es para asignar tickets abiertos a los tecnicos
// ADMIN

const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. Obtener tickets para asignar (Solo estado 'Abierto')
router.get('/tickets-por-asignar', async (req, res) => {
  try {
    const query = `
      SELECT 
        t.id_ticket AS id, 
        b_usuario.nombre AS nombre_usuario, 
        t.titulo_falla, 
        t.descripcion_falla, 
        to_char(t.fecha_creacion, 'DD/MM/YYYY') AS fecha,
        t.nivel_prioridad,
        t.estado,
        COALESCE(b_tecnico.nombre, 'Pendiente') AS tecnico_nombre
      FROM ticket t
      -- Join con base para los datos de quien creó el ticket
      JOIN base b_usuario ON t.id_base = b_usuario.id_base
      -- Left Joins para ver el nombre del técnico si es que ya tiene uno
      LEFT JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
      LEFT JOIN base b_tecnico ON tec.id_base = b_tecnico.id_base
      WHERE TRIM(t.estado) ILIKE 'Abierto'
      ORDER BY t.fecha_creacion DESC
    `;
    const resultado = await pool.query(query);
    res.json(resultado.rows);
  } catch (error) {
    console.error("❌ Error en GET /tickets-por-asignar:", error.message);
    res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
  }
});

// 2. Obtener el detalle completo de UN ticket por su ID (Para la pantalla de asignación)
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
        to_char(t.fecha_creacion, 'DD/MM/YYYY') AS fecha_creacion_formateada, -- Formato de fecha corregido
        t.estado,
        t.titulo_falla,
        t.descripcion_falla,
        t.id_tecnico,
        -- Trae el tipo de equipo combinando marca desde la tabla equipo
        COALESCE(e.tipo_equipo || ' - ' || e.marca, 'N/A') AS equipo_nombre
      FROM ticket t
      JOIN base b_usuario ON t.id_base = b_usuario.id_base
      LEFT JOIN equipo e ON t.id_equipo = e.id_equipo -- Join clave para resolver id_equipo
      WHERE t.id_ticket = $1;
    `;
    
    const resultado = await pool.query(query, [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(`❌ Error en GET /detalle-ticket/${id}:`, error.message);
    res.status(500).json({ error: "Error al obtener el detalle del ticket en el servidor" });
  }
});

// 3. Asignar técnico y cambiar estado a 'En Proceso'
router.put('/asignar-tecnico', async (req, res) => {
  const { id_ticket, id_tecnico } = req.body;

  if (!id_ticket || !id_tecnico) {
    return res.status(400).json({ error: "Faltan datos (id_ticket o id_tecnico)" });
  }

  try {
    const query = `
      UPDATE ticket 
      SET id_tecnico = $1, 
          estado = 'En Proceso' 
      WHERE id_ticket = $2 
      RETURNING * `;
    
    const resultado = await pool.query(query, [id_tecnico, id_ticket]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json({ 
      mensaje: "Técnico asignado exitosamente. El ticket ahora está 'En Proceso'.", 
      ticket: resultado.rows[0] 
    });

  } catch (error) {
    console.error("❌ Error en PUT /asignar-tecnico:", error.message);
    res.status(500).json({ error: "Error en la base de datos al asignar técnico" });
  }
});

module.exports = router;