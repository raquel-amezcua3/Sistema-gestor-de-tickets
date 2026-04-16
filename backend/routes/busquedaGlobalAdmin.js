/* Esta funcion es para buscar un ticket en todo el sistema, esta funcion la pueden usar los 3 roles.  */
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ruta para obtener TODOS los tickets del sistema
router.get('/todos-los-tickets', async (req, res) => {
    try {
        /* Consulta SQL   */
        const query = `
            SELECT 
                t.id_ticket AS id, 
                u.nombre AS nombre_usuario, 
                t.titulo, 
                t.descripcion, 
                TO_CHAR(t.fecha_creacion, 'DD/MM/YYYY') AS fecha,
                CASE 
                    WHEN t.fecha_cierre IS NULL THEN '—' 
                    ELSE TO_CHAR(t.fecha_cierre, 'DD/MM/YYYY') 
                END AS fecha_cierre,
                t.estado, 
                COALESCE(tec.nombre, 'Pendiente') AS nombre_tecnico
            FROM tickets t
            JOIN usuarios u ON t.id_usuario = u.id_usuario
            LEFT JOIN usuarios tec ON t.id_tecnico = tec.id_usuario
            ORDER BY t.id_ticket DESC
        `;
        
        // Muestra los resultados que coninciden con la busqueda del ticket
        const resultado = await pool.query(query);
        res.json(resultado.rows);

     // Manejo de errores del servidor o de conexión a la base de datos
    } catch (error) {
        console.error("❌ Error en busqueda global:", error.message);
        res.status(500).json({ error: "Error al obtener los tickets" });
    }
});

module.exports = router;