// Archivos pendientesTecnico.jsx y pendientesTecnico.js
//TECNICO

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener la lista de tickets PENDIENTES asignados al técnico logueado
router.get('/:id_tecnico_or_base', async (req, res) => {
    const { id_tecnico_or_base } = req.params;

    // Validar identificador recibido
    if (!id_tecnico_or_base || id_tecnico_or_base === 'undefined' || id_tecnico_or_base === 'null' || isNaN(Number(id_tecnico_or_base))) {
        return res.status(400).json({ error: "ID de técnico/base inválido o no proporcionado" });
    }

    try {
        // Tu QUERY BASE que sí funciona, con la corrección exacta en el LOWER(t.estado)
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
            JOIN base b_usr ON t.id_base = b_usr.id_base 
            LEFT JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN base bt ON tec.id_base = bt.id_base 
            WHERE (tec.id_base = $1 OR tec.id_tecnico = $1)
              AND LOWER(t.estado) IN ('abierto', 'en proceso', 'en espera de compra') -- ✨ Corrección: 'en espera de compra'
            ORDER BY t.id_ticket DESC
        `;

        console.log(`🔍 [Backend Técnico] Buscando tickets para el ID: ${id_tecnico_or_base}`);
        
        const resultado = await pool.query(query, [parseInt(id_tecnico_or_base, 10)]);

        console.log(`✅ [Backend Técnico] Tickets encontrados y enviados: ${resultado.rows.length}`);
        
        return res.json(resultado.rows);

    } catch (error) {
        console.error("❌ [Backend Técnico] ERROR CRÍTICO EN LA CONSULTA:", error.message);
        return res.status(500).json({ 
            error: "Error interno del servidor",
            detalle: error.message 
        });
    }
});

module.exports = router;