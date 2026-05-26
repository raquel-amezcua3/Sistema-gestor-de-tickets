// Archivos detalleTicketU.jsx y detalleTicket.js
//Esta pantalla es para ver los detalles del ticket del usaurio, el .js es detalleTicket.js
// USUARIO

const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. OBTENER DETALLES DEL TICKET Y SU HISTORIAL (GET)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número" });
    }

    try {
        // 1. Obtener la información principal del ticket
        const queryTicket = `
            SELECT 
                t.id_ticket, 
                b.nombre AS nombre_usuario, 
                b.correo, 
                b.telefono, 
                b.extension, 
                t.titulo_falla, 
                t.descripcion_falla, 
                t.categoria_servicio,
                t.subcategoria_falla,
                t.nivel_prioridad,
                t.grado_impacto,
                t.estado, 
                t.id_tecnico,
                -- 🔥 OBTENEMOS EL NOMBRE DEL TÉCNICO ENCARGADO
                COALESCE(b_tec.nombre, 'Pendiente de asignar') AS tecnico_encargado,
                CASE 
                    WHEN e.id_equipo IS NOT NULL THEN 
                        e.tipo_equipo || ' ' || e.marca || ' - S/N: ' || COALESCE(e.numero_serie, 'S/S')
                    ELSE 'Ninguno'
                END AS equipo_afectado, 
                TO_CHAR(t.fecha_creacion, 'DD/MM/YYYY') as fecha_creacion,
                
                -- 🔥 LOGICA DE FECHA DE CIERRE CONTROLADA
                CASE 
                    WHEN LOWER(t.estado) IN ('resuelto', 'cerrado') THEN
                        TO_CHAR(
                            COALESCE(
                                t.fecha_cierre, 
                                (SELECT fecha_registro FROM historial_trazabilidad WHERE id_ticket = t.id_ticket ORDER BY fecha_registro DESC LIMIT 1)
                            ), 
                            'DD/MM/YYYY'
                        )
                    ELSE '—'
                END AS fecha_cierre,
                
                (NOW() > t.fecha_cierre + INTERVAL '24 hours') as superar_limite
            FROM ticket t
            JOIN base b ON t.id_base = b.id_base
            LEFT JOIN equipo e ON t.id_equipo = e.id_equipo
            -- 🔥 JOIN ADICIONAL PARA EXTRAER EL NOMBRE DEL TÉCNICO ENCARGADO
            LEFT JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN base b_tec ON tec.id_base = b_tec.id_base
            WHERE t.id_ticket = $1
        `;
        
        const resultadoTicket = await pool.query(queryTicket, [id]);

        if (resultadoTicket.rows.length === 0) {
            return res.status(404).json({ error: "Ticket no encontrado" });
        }

        let ticket = resultadoTicket.rows[0];

        // Lógica de 24 horas para cierre automático
        if (ticket.estado === 'Resuelto' && ticket.superar_limite) {
            ticket.estado = 'Cerrado';
            await pool.query("UPDATE ticket SET estado = 'Cerrado' WHERE id_ticket = $1", [id]);
        }

        ticket.tecnico_status = ticket.id_tecnico ? "Asignado" : "Pendiente de asignar"; 

        // 2. Obtener el historial de trazabilidad del ticket
        const queryHistorial = `
            SELECT 
                h.id_historial,
                TO_CHAR(h.fecha_registro, 'DD/MM/YYYY, HH:MI p.m.') as fecha,
                COALESCE(b_tec.nombre, 'Técnico Asignado') as usuario_nombre,
                h.diagnostico_tecnico,
                h.falla_real,
                h.accion_tomada,
                h.piezas_reemplazadas,
                h.tiempo_laborado,
                h.estado
            FROM historial_trazabilidad h
            LEFT JOIN base b_tec ON h.id_tecnico = b_tec.id_base
            WHERE h.id_ticket = $1
            ORDER BY h.fecha_registro ASC
        `;

        const resultadoHistorial = await pool.query(queryHistorial, [id]);
        ticket.historial = resultadoHistorial.rows;

        // Enviamos la respuesta completa al cliente con las nuevas propiedades fijadas
        res.json(ticket);

    } catch (error) {
        console.error("❌ ERROR EN GET DETALLE:", error.message);
        res.status(500).json({ error: error.message });
    }
});

//  2. ACTUALIZAR TÍTULO Y DESCRIPCIÓN (PUT)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo_falla, descripcion_falla } = req.body;

    if (!titulo_falla || !descripcion_falla) {
        return res.status(400).json({ error: "Título y descripción son obligatorios para actualizar." });
    }

    try {
        const check = await pool.query("SELECT estado FROM ticket WHERE id_ticket = $1", [id]);
        
        if (check.rows.length === 0) {
            return res.status(404).json({ error: "Ticket no encontrado." });
        }

        if (check.rows[0].estado === 'Cerrado') {
            return res.status(403).json({ error: "No se puede editar un ticket que ya está cerrado." });
        }

        const queryUpdate = `
            UPDATE ticket 
            SET titulo_falla = $1, 
                descripcion_falla = $2
            WHERE id_ticket = $3 
            RETURNING *
        `;
        
        const resultado = await pool.query(queryUpdate, [titulo_falla, descripcion_falla, id]);

        res.json({ 
            mensaje: "Ticket actualizado con éxito", 
            ticket: resultado.rows[0] 
        });

    } catch (error) {
        console.error("❌ ERROR EN PUT DETALLE:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;