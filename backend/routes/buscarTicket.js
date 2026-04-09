const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número" });
    }

    try {
        const query = `
            SELECT 
                id_ticket, 
                id_usuario, 
                titulo, 
                descripcion, 
                TO_CHAR(fecha_creacion, 'DD/MM/YYYY') as fecha,
                COALESCE(TO_CHAR(fecha_cierre, 'DD/MM/YYYY'), '—') as fechacierre,
                estado
            FROM tickets 
            WHERE id_ticket = $1
        `;
        
        const resultado = await pool.query(query, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "Ticket no encontrado" });
        }

        // Enviamos el resultado y, como no hay columna técnico en la BD,
        // le agregamos un valor manual para que el frontend no se rompa.
        const ticket = resultado.rows[0];
        ticket.tecnico = "Pendiente"; 

        res.json(ticket); 
    } catch (error) {
        console.error("❌ Error real:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;