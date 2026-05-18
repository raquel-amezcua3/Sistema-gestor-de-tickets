//FALTA
const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// =========================================================================
// 1. GET: Obtener comentarios por equipo
// =========================================================================
// @route   GET /api/tecnico/tickets/detalle/:id
router.get('/detalle/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID del ticket debe ser un número válido." });
    }

    try {
        // 🔥 AGREGAMOS t.id_equipo para poder mandarlo a la bitácora
        const query = `
            SELECT 
                t.id_ticket AS id,
                t.id_equipo AS id_equipo, -- <--- ¡AQUÍ ESTÁ LA CLAVE!
                bu.nombre AS nombre,
                t.categoria_servicio AS categoria,
                t.subcategoria_falla AS subcategoria,
                t.nivel_prioridad AS prioridad,
                t.grado_impacto AS impacto,
                TO_CHAR(t.fecha_creacion, 'DD/MM/YYYY') AS fecha,
                t.estado AS estado_crudo,
                t.titulo_falla AS titulo,
                t.descripcion_falla AS descripcion,
                COALESCE(e.tipo_equipo || ' - ' || e.marca, 'N/A') AS equipo_nombre,
                COALESCE(bt.nombre, 'Sin asignar') AS tecnico,
                (SELECT h.diagnostico_tecnico FROM historial_trazabilidad h WHERE h.id_ticket = t.id_ticket AND h.diagnostico_tecnico IS NOT NULL ORDER BY h.id_historial DESC LIMIT 1) AS ultimo_diagnostico,
                (SELECT h.falla_real FROM historial_trazabilidad h WHERE h.id_ticket = t.id_ticket AND h.falla_real IS NOT NULL ORDER BY h.id_historial DESC LIMIT 1) AS ultima_falla_real
            FROM ticket t
            JOIN base bu ON t.id_base = bu.id_base
            LEFT JOIN equipo e ON t.id_equipo = e.id_equipo
            LEFT JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN base bt ON tec.id_base = bt.id_base
            WHERE t.id_ticket = $1;
        `;

        const resultado = await pool.query(query, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "Ticket no encontrado" });
        }

        const ticket = resultado.rows[0];

        // --- NORMALIZACIÓN DEL ESTADO ---
        let estadoFormateado = 'en proceso'; 
        const estadoBD = ticket.estado_crudo ? ticket.estado_crudo.toLowerCase().trim() : '';

        if (estadoBD === 'resuelto' || estadoBD === 'cerrado') {
            estadoFormateado = 'Cerrado';
        } else if (estadoBD === 'en espera de compra') {
            estadoFormateado = 'en espera de compra';
        } else if (estadoBD === 'abierto') {
            estadoFormateado = 'en proceso';
        }

        // Construimos la respuesta mapeada perfectamente para tu DatosTicketTecnico.jsx
        const respuestaFormateada = {
            id: ticket.id,
            id_equipo: ticket.id_equipo, // 🔥 Enviamos el id numérico real al frontend
            nombre: ticket.nombre || 'Usuario del Sistema',
            categoria: ticket.categoria || 'Sin categoría',
            subcategoria: ticket.subcategoria || 'General',
            prioridad: ticket.prioridad || 'Baja',
            impacto: ticket.impacto || 'Bajo',
            titulo: ticket.titulo || 'Sin título',
            descripcion: ticket.descripcion || 'Sin descripción',
            equipo: ticket.equipo_nombre, 
            fecha: ticket.fecha || '',
            estado: estadoFormateado,
            tecnico: ticket.tecnico,
            diagnosticoHistorico: ticket.ultimo_diagnostico || '',
            fallaRealHistorica: ticket.ultima_falla_real || ''
        };

        res.status(200).json(respuestaFormateada);

    } catch (error) {
        console.error("❌ Error al obtener detalle del ticket para técnico:", error.message);
        res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
    }
});
module.exports = router;