//La pantalla de esta funcion es pendientesTecnico.jsx
// routes/ticketsPendientes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener la lista de tickets pendientes del usuario
router.get('/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;

    // Validar ID
    if (!id_usuario || id_usuario === 'undefined' || id_usuario === 'null' || isNaN(Number(id_usuario))) {
        return res.status(400).json({ error: "ID de usuario inválido o no proporcionado" });
    }

    try {
        // Consulta SQL limpia mapeando tus columnas exactas (titulo_falla, descripcion_falla, etc.)
        const query = `
            SELECT 
                t.id_ticket,
                t.titulo_falla AS titulo,
                t.descripcion_falla AS descripcion,
                TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD') AS fecha,
                t.estado,
                COALESCE(bt.nombre, 'Sin técnico') AS tecnico
            FROM ticket t
            LEFT JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN base bt ON tec.id_base = bt.id_base
            WHERE t.id_base = $1 
              AND LOWER(t.estado) NOT IN ('resuelto', 'cerrado')
            ORDER BY t.id_ticket DESC
        `;

        console.log(`🔍 [Backend Local] Buscando tickets pendientes para el id_base: ${id_usuario}`);
        const resultado = await pool.query(query, [parseInt(id_usuario, 10)]);

        console.log(`✅ [Backend Local] Tickets pendientes enviados: ${resultado.rows.length}`);
        return res.json(resultado.rows);

    } catch (error) {
        console.error("❌ [Backend Local] ERROR CRÍTICO EN TICKETS PENDIENTES:", error.message);
        return res.status(500).json({ 
            error: "Error interno del servidor al procesar los tickets pendientes",
            detalle: error.message 
        });
    }
});

module.exports = router;