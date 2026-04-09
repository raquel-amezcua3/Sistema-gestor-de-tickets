const express = require('express');
const router = express.Router();
const pool = require('../db'); // Importas el que YA existe

// Obtener tickets de un usuario específico
router.get('/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const query = `
            SELECT 
                id_ticket, 
                titulo, 
                descripcion, 
                estado, 
                TO_CHAR(fecha_creacion, 'DD/MM/YYYY') as fecha,
                COALESCE(TO_CHAR(fecha_cierre, 'DD/MM/YYYY'), '—') as fechacierre
            FROM tickets 
            WHERE id_usuario = $1
            ORDER BY fecha_creacion DESC
        `;
        
        const resultado = await pool.query(query, [id_usuario]);
        res.json(resultado.rows);
    } catch (error) {
        console.error("❌ Error en misTickets:", error.message);
        res.status(500).json({ error: "No se pudieron obtener los tickets" });
    }
});

module.exports = router;