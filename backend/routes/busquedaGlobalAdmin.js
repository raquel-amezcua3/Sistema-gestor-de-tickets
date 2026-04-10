const express = require('express');
const router = express.Router();
const pool = require('../db');

// Ruta para obtener TODOS los tickets del sistema
router.get('/todos-los-tickets', async (req, res) => {
    try {
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
        
        const resultado = await pool.query(query);
        res.json(resultado.rows);
    } catch (error) {
        console.error("❌ Error en busqueda global:", error.message);
        res.status(500).json({ error: "Error al obtener los tickets" });
    }
});

module.exports = router;