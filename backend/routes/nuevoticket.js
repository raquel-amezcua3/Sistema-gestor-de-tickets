// Funcion para crear un nuevo ticket, esta funcion la usa el usuario con rol 0
const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// --- RUTA: CREAR TICKET (POST /tickets) ---
// Define el endpoint principal para la creación de reportes
router.post('/', async (req, res) => {
  const { id_usuario, titulo, descripcion } = req.body;

  // Validación de seguridad: Asegura que la base de datos no reciba valores nulos
  if (!id_usuario || !titulo || !descripcion) {
    return res.status(400).json({ 
      error: "Faltan campos obligatorios (id_usuario, titulo o descripcion)" 
    });
  }

  try {
    // Consulta SQL 
    // Se asigna por defecto el estado 'abierto' y la fecha actual del servidor
    const query = `
    INSERT INTO tickets (id_usuario, titulo, descripcion, estado, fecha_creacion)
    VALUES ($1, $2, $3, 'abierto', CURRENT_TIMESTAMP) 
    RETURNING *
    `;
    
    // Arreglo de valores para sustituir los marcadores $1, $2, $3 (Previene Inyección SQL)
    const values = [id_usuario, titulo, descripcion];

    // Ejecución de la consulta 
    const resultado = await pool.query(query, values);
    
    // Respuesta exitosa
    res.status(201).json({ 
      mensaje: "Ticket creado con éxito", 
      ticket: resultado.rows[0] 
    });

  } catch (error) {
    // Captura de errores en el proceso de inserción o conexión
    console.error("❌ Error al insertar ticket:", error.message);
    res.status(500).json({ 
      error: "Error interno del servidor", 
      detalle: error.message 
    });
  }
});

module.exports = router;