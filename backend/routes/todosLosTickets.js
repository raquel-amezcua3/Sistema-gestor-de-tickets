// Funcion de todos los tickets
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ruta principal para obtener el historial completo de tickets
router.get('/', async (req, res) => {
    try {
        // Consulta SQL detallada para traer información de tickets y usuarios
        const query = `
            SELECT 
                t.id_ticket, 
                u.nombre AS nombre_usuario, 
                t.titulo, 
                t.descripcion, 
                /* Formatea la fecha de creación a Día/Mes/Año */
                TO_CHAR(t.fecha_creacion, 'DD/MM/YYYY') AS fecha,
                /* COALESCE: Si la fecha de cierre es NULL, devuelve una raya '—' para no dejar el campo vacío */
                COALESCE(TO_CHAR(t.fecha_cierre, 'DD/MM/YYYY'), '—') AS fechacierre,
                t.estado
            FROM tickets t
            /* JOIN: Cruza la tabla de tickets con la de usuarios para obtener el nombre del creador */
            JOIN usuarios u ON t.id_usuario = u.id_usuario
            /* Ordena los tickets de forma descendente (del más nuevo al más viejo) */
            ORDER BY t.id_ticket DESC
        `;
        
        // Ejecución de la consulta 
        const resultado = await pool.query(query);
        
        // Registro en los logs del servidor para verificar cuántos registros se están mandando
        console.log("Enviando tickets:", resultado.rows.length); 
        
        // Envía el arreglo de filas encontradas directamente al frontend
        res.json(resultado.rows);
    } catch (error) {
        // Captura de mensajes de error
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;