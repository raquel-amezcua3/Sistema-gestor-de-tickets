const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const query = `
            SELECT 
                id_ticket, 
                titulo, 
                descripcion, 
                estado, 
                TO_CHAR(fecha_creacion, 'DD/MM/YYYY') as fecha
            FROM tickets 
            WHERE id_usuario = $1 
            AND (LOWER(estado) = 'abierto' OR LOWER(estado) = 'en espera')
            ORDER BY fecha_creacion DESC
        `;
        
        const resultado = await pool.query(query, [id_usuario]);
        
        // Agregamos manualmente la propiedad tecnico para que el front no de error
        const filas = resultado.rows.map(ticket => ({
            ...ticket,
            tecnico: 'Pendiente' 
        }));

        res.json(filas);
    } catch (error) {
        // MIRA ESTE ERROR EN TU TERMINAL DE VS CODE
        console.error("❌ ERROR DETALLADO EN PENDIENTES:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;