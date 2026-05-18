//Funcion para ver todos los tickets que hay en el sistema, pantalla buscarAdmin.jsx
// routes/todosLosTickets.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener el historial completo de todos los tickets de un usuario específico
router.get('/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const query = `
            SELECT 
                t.id_ticket, 
                t.titulo_falla,                                      -- Para compatibilidad Postman
                t.titulo_falla AS titulo,                            -- Para compatibilidad React
                t.descripcion_falla,                                 -- Para compatibilidad Postman
                t.descripcion_falla AS descripcion,                  -- Para compatibilidad React
                TO_CHAR(t.fecha_creacion, 'DD/MM/YYYY') AS fecha,
                COALESCE(TO_CHAR(t.fecha_cierre, 'DD/MM/YYYY'), '—') AS fechacierre,
                t.estado,
                COALESCE(bt.nombre, 'Pendiente') AS tecnico          
            FROM ticket t                                            
            LEFT JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN base bt ON tec.id_base = bt.id_base
            WHERE t.id_usuario = $1                                  
            ORDER BY t.id_ticket DESC
        `;
        
        const resultado = await pool.query(query, [id_usuario]);
        
        console.log(`Enviando historial de tickets para usuario ${id_usuario}:`, resultado.rows.length); 
        res.json(resultado.rows);
    } catch (error) {
        console.error("❌ Error en todosLosTickets:", error.message);
        res.status(500).json({ error: "Error al obtener el historial de tickets", detalle: error.message });
    }
});

module.exports = router;