const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                t.id_ticket, 
                u.nombre AS nombre_usuario, 
                t.titulo, 
                t.descripcion, 
                TO_CHAR(t.fecha_creacion, 'DD/MM/YYYY') AS fecha,
                COALESCE(TO_CHAR(t.fecha_cierre, 'DD/MM/YYYY'), '—') AS fechacierre,
                t.estado
            FROM tickets t
            JOIN usuarios u ON t.id_usuario = u.id_usuario
            ORDER BY t.id_ticket DESC
        `;
        const resultado = await pool.query(query);
        console.log("Enviando tickets:", resultado.rows.length); // Esto saldrá en tu consola negra
        res.json(resultado.rows);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;