const express = require('express');
const router = express.Router();
const pool = require('../db'); // Importamos la conexión compartida

// --- RUTA: CREAR TICKET (POST /tickets) ---
router.post('/', async (req, res) => {
  const { id_usuario, titulo, descripcion } = req.body;

  // Validación de seguridad
  if (!id_usuario || !titulo || !descripcion) {
    return res.status(400).json({ 
      error: "Faltan campos obligatorios (id_usuario, titulo o descripcion)" 
    });
  }

  try {
    const query = `
    INSERT INTO tickets (id_usuario, titulo, descripcion, estado, fecha_creacion)
    VALUES ($1, $2, $3, 'abierto', CURRENT_TIMESTAMP) 
    RETURNING *
    `;
    const values = [id_usuario, titulo, descripcion];

    const resultado = await pool.query(query, values);
    
    res.status(201).json({ 
      mensaje: "Ticket creado con éxito", 
      ticket: resultado.rows[0] 
    });

  } catch (error) {
    console.error("❌ Error al insertar ticket:", error.message);
    res.status(500).json({ 
      error: "Error interno del servidor", 
      detalle: error.message 
    });
  }
});

module.exports = router;