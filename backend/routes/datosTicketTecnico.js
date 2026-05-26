//La pantalla datosTicketTecnico.jsx su .js es datosTicketTecnico.js
//Es la pantalla donde aparecen los datos del ticket para que el tecnico lo pueda ver
// TECNICO  

const express = require('express');
const router = express.Router();
const pool = require('../db');

// @route   GET /api/tecnico/detalle-ticket/detalle/:id
// Trae toda la información formateada y los ID de enlace al frontend
router.get('/detalle/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID del ticket debe ser un número válido." });
    }

    try {
        const query = `
            SELECT 
                t.id_ticket AS id,
                COALESCE(bu.nombre, 'Usuario del Sistema') AS nombre,
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
                t.id_tecnico AS id_tecnico_encargado,
                (SELECT h.diagnostico_tecnico FROM historial_trazabilidad h WHERE h.id_ticket = t.id_ticket AND h.diagnostico_tecnico IS NOT NULL ORDER BY h.id_historial DESC LIMIT 1) AS ultimo_diagnostico,
                (SELECT h.falla_real FROM historial_trazabilidad h WHERE h.id_ticket = t.id_ticket AND h.falla_real IS NOT NULL ORDER BY h.id_historial DESC LIMIT 1) AS ultima_falla_real
            FROM ticket t
            LEFT JOIN usuario u ON t.id_usuario = u.id_usuario
            LEFT JOIN base bu ON u.id_base = bu.id_base
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

        let estadoFormateado = 'en proceso'; 
        const estadoBD = ticket.estado_crudo ? ticket.estado_crudo.toLowerCase().trim() : '';

        if (estadoBD === 'resuelto' || estadoBD === 'cerrado') {
            estadoFormateado = 'Cerrado';
        } else if (estadoBD === 'en espera de compra') {
            estadoFormateado = 'en espera de compra';
        } else if (estadoBD === 'abierto') {
            estadoFormateado = 'en proceso';
        }

        const respuestaFormateada = {
            id: ticket.id,
            nombre: ticket.nombre,
            categoria: ticket.categoria,
            subcategoria: ticket.subcategoria,
            prioridad: ticket.prioridad,
            impacto: ticket.impacto,
            titulo: ticket.titulo,
            descripcion: ticket.descripcion,
            equipo: ticket.equipo_nombre, 
            fecha: ticket.fecha,
            estado: estadoFormateado,
            tecnico: ticket.tecnico,
            id_tecnico: ticket.id_tecnico_encargado || 6, // Enviamos el ID para evitar el error NaN en cascada
            diagnosticoHistorico: ticket.ultimo_diagnostico || '',
            fallaRealHistorica: ticket.ultima_falla_real || ''
        };

        res.status(200).json(respuestaFormateada);

    } catch (error) {
        console.error("❌ Error al obtener detalle del ticket para técnico:", error.message);
        res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
    }
});


// Inserta en historial_trazabilidad y actualiza el estado general de la falla
// @route   POST /api/tecnico/detalle-ticket/seguimiento/:id
router.post('/seguimiento/:id', async (req, res) => {
    const { id } = req.params;
    const { estado, diagnostico, fallaReal, accionTomada, piezas, tiempo, id_tecnico } = req.body;

    const tecnicoIdLimpio = isNaN(id_tecnico) ? 6 : parseInt(id_tecnico, 10);
    const tiempoLaboradoLimpio = isNaN(tiempo) ? 0 : parseInt(tiempo, 10);

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const insertHistorialQuery = `
            INSERT INTO historial_trazabilidad (
                id_ticket, id_tecnico, estado, diagnostico_tecnico, falla_real, accion_tomada, piezas_reemplazadas, tiempo_laborado, fecha_registro
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
            RETURNING id_historial;
        `;

        await client.query(insertHistorialQuery, [
            parseInt(id, 10),
            tecnicoIdLimpio,
            estado,
            diagnostico || null,
            fallaReal || null,
            accionTomada,
            piezas, 
            tiempoLaboradoLimpio
        ]);

        const updateTicketQuery = `UPDATE ticket SET estado = $1 WHERE id_ticket = $2;`;
        await client.query(updateTicketQuery, [estado, parseInt(id, 10)]);

        await client.query('COMMIT');
        res.status(201).json({ mensaje: "Seguimiento añadido correctamente" });
    } catch (error) {
        await client.query('ROLLBACK');
        
        // Imprime el error completo en la consola del servidor (Render / VS Code)
        console.error("❌ ERROR REAL DE BD:", error); 
        
        // Le regresa al Frontend el detalle exacto del fallo
        res.status(500).json({ 
            error: "Error en la Base de Datos", 
            detalle: error.message,
            columna: error.column,
            tabla: error.table 
        });
    } finally {
        client.release();
    }
});

module.exports = router;