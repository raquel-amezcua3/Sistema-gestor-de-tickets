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
        const query = `
            SELECT 
                t.id_ticket AS id,
                bu.nombre AS nombre,
                bu.correo AS correo,
                bu.telefono AS telefono,
                t.titulo_falla AS titulo,
                t.descripcion_falla AS descripcion,
                TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD') AS fecha,
                CASE 
                    WHEN LOWER(t.estado) = 'resuelto' THEN 'Resuelto'
                    WHEN LOWER(t.estado) = 'cerrado' THEN 'Cerrado'
                    ELSE t.estado 
                END AS estado,
                bt.nombre AS tecnico,
                -- 🔥 COALESCE: Si por alguna razón fecha_cierre es null, intenta usar la fecha del último historial
                TO_CHAR(
                    COALESCE(
                        t.fecha_cierre, 
                        (SELECT fecha_registro FROM historial_trazabilidad WHERE id_ticket = t.id_ticket ORDER BY fecha_registro DESC LIMIT 1)
                    ), 
                    'YYYY-MM-DD'
                ) AS fecha_cierre
            FROM ticket t
            LEFT JOIN usuario u ON t.id_usuario = u.id_usuario
            LEFT JOIN base bu ON u.id_base = bu.id_base
            LEFT JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN base bt ON tec.id_base = bt.id_base
            WHERE t.id_ticket = $1
        `;

        const resultado = await pool.query(query, [parseInt(id_ticket, 10)]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "No se encontró ningún ticket con el ID solicitado" });
        }

        // Enviamos el registro completo
        res.json(resultado.rows[0]);
    } catch (error) {
        console.error("❌ ERROR AL OBTENER DETALLES DEL TICKET:", error.message);
        res.status(500).json({ 
            error: "Error en el servidor al obtener los datos del ticket", 
            detalle: error.message 
        });
    }
});

module.exports = router;