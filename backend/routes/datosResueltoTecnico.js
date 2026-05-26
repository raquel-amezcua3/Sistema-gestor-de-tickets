//La pantalla datosResueltoTecnico.jsx su .js es datosResueltoTecnico.js
//En esta pantalla se muestra la tabla de tickets resueltos por el tecnico
// TECNICO

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener detalles completos de un ticket específico por su ID
router.get('/:id_ticket', async (req, res) => {
    const { id_ticket } = req.params;

    if (!id_ticket || id_ticket === 'undefined' || id_ticket === 'null' || isNaN(Number(id_ticket))) {
        return res.status(400).json({ error: "ID de ticket inválido o no proporcionado" });
    }

    try {
        // 🔥 CORREGIDO: bu.telefono::TEXT convierte el número a texto para que sea compatible con 'Sin teléfono'
        // Reemplaza tu bloque de consulta query dentro de datosResueltoTecnico.js por este:
        const query = `
            SELECT 
                t.id_ticket AS id,
                COALESCE(bu.nombre, 'Usuario del Sistema') AS nombre,
                COALESCE(bu.correo, 'Sin correo registrado') AS correo,
                COALESCE(bu.telefono::TEXT, 'Sin teléfono') AS telefono,
                t.titulo_falla AS titulo,
                t.descripcion_falla AS descripcion,
                TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD') AS fecha,
                t.estado AS estado,
                COALESCE(bt.nombre, 'Sin técnico asignado') AS tecnico,
                -- 🔥 CORREGIDO: Si es resuelto y fecha_cierre es NULL, muestra la fecha de HOY en la pantalla
                TO_CHAR(
                    CASE 
                        WHEN t.fecha_cierre IS NOT NULL THEN t.fecha_cierre
                        WHEN LOWER(t.estado) = 'resuelto' THEN CURRENT_DATE
                        ELSE t.fecha_creacion
                    END, 
                    'YYYY-MM-DD'
                ) AS fecha_cierre
            FROM ticket t
            LEFT JOIN base bu ON t.id_base = bu.id_base
            LEFT JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN base bt ON tec.id_base = bt.id_base
            WHERE t.id_ticket = $1
        `;

        console.log(`🔍 [Backend] Buscando ticket número: ${id_ticket}`);
        const resultado = await pool.query(query, [parseInt(id_ticket, 10)]);

        if (resultado.rows.length === 0) {
            console.log(`⚠️ [Backend] El ticket #${id_ticket} no existe en la BD.`);
            return res.status(404).json({ error: "No se encontró el ticket" });
        }

        console.log("✅ [Backend] Datos encontrados y enviados con éxito.");
        return res.json(resultado.rows[0]);

    } catch (error) {
        console.error("❌ [Backend] ERROR CRÍTICO EN LA CONSULTA SQL:", error.message);
        return res.status(500).json({ 
            error: "Error interno en la consulta SQL del servidor", 
            detalle: error.message 
        });
    }
});

module.exports = router;