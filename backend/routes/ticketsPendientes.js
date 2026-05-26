//La pantalla de esta funcion es pendientesTecnico.jsx
// routes/ticketsPendientes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener la lista de tickets pendientes del técnico logueado
router.get('/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    // Validar ID
    if (!id_usuario || id_usuario === 'undefined' || id_usuario === 'null' || isNaN(Number(id_usuario))) {
        return res.status(400).json({ error: "ID de usuario inválido o no proporcionado" });
    }

    try {
        // 🔥 SOLUCIÓN: Agregamos b_usr.nombre para el usuario que reportó y filtramos por el id_tecnico real del usuario logueado
        const query = `
            SELECT 
                t.id_ticket,
                b_usr.nombre AS nombre_usuario,
                t.titulo_falla AS titulo,
                t.descripcion_falla AS descripcion,
                TO_CHAR(t.fecha_creacion, 'DD/MM/YYYY') AS fecha,
                t.estado,
                COALESCE(bt.nombre, 'Sin técnico') AS tecnico
            FROM ticket t
            JOIN base b_usr ON t.id_base = b_usr.id_base -- Trae el nombre de quien reportó
            LEFT JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN base bt ON tec.id_base = bt.id_base -- Trae el nombre del técnico
            WHERE tec.id_base = $1 
              AND LOWER(t.estado) NOT IN ('resuelto', 'cerrado')
            ORDER BY t.id_ticket DESC
        `;

        console.log(`🔍 [Backend] Buscando tickets asignados al id_base técnico: ${id_usuario}`);
        const resultado = await pool.query(query, [parseInt(id_usuario, 10)]);

        console.log(`✅ [Backend] Tickets pendientes enviados: ${resultado.rows.length}`);
        return res.json(resultado.rows);

    } catch (error) {
        console.error("❌ [Backend] ERROR CRÍTICO EN TICKETS PENDIENTES:", error.message);
        return res.status(500).json({ 
            error: "Error interno del servidor al procesar los tickets pendientes",
            detalle: error.message 
        });
    }
});

module.exports = router;