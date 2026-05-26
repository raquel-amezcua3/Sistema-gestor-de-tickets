//Pantalla buscarAdmin.jsx su .js es todosLosTickets.js
// Sirve para buscar tikckets 
// ADMIN

const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// @route   GET /api/admin/busqueda/todos-los-tickets
router.get('/todos-los-tickets', async (req, res) => {
    try {
        const query = `
            SELECT 
                t.id_ticket AS id, 
                -- CORRECCIÓN DEL CRUCE: ticket (id_usuario) -> usuario -> base (nombre)
                -- Usamos COALESCE con t.id_base de respaldo para tickets viejos sin id_usuario
                COALESCE(b_usr.nombre, b_directa.nombre, 'Desconocido') AS nombre_usuario,
                t.titulo_falla AS titulo, 
                t.descripcion_falla AS descripcion, 
                TO_CHAR(t.fecha_creacion, 'DD/MM/YYYY') AS fecha,
                COALESCE(TO_CHAR(t.fecha_cierre, 'DD/MM/YYYY'), '—') AS fecha_cierre,
                t.estado,
                COALESCE(bt.nombre, 'Sin asignar') AS nombre_tecnico
            FROM ticket t 
            -- Puente correcto para obtener quién reportó el ticket
            LEFT JOIN usuario u ON t.id_usuario = u.id_usuario
            LEFT JOIN base b_usr ON u.id_base = b_usr.id_base
            -- Respaldo directo en caso de que id_usuario sea NULL o inválido
            LEFT JOIN base b_directa ON t.id_base = b_directa.id_base
            
            -- Relación para obtener el nombre del técnico
            LEFT JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN base bt ON tec.id_base = bt.id_base  
            ORDER BY t.id_ticket DESC;
        `;
        
        const resultado = await pool.query(query);
        res.status(200).json(resultado.rows); 
        
    } catch (error) {
        console.error("❌ Error en buscarTicketAdmin:", error.message);
        res.status(500).json({ error: "Error al consultar los tickets del administrador" });
    }
});

module.exports = router;