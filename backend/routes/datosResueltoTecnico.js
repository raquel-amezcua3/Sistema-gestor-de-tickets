//La pantalla datosResueltoTecnico.jsx su .js es datosResueltoTecnico.js
//En esta pantalla se muestra la tabla de tickets resueltos por el tecnico
// TECNICO

const express = require('express');
const router = express.Router();
const pool = require('../db');

// @route   GET /api/datosResueltoTecnico/:id_ticket
router.get('/:id_ticket', async (req, res) => {
    const { id_ticket } = req.params;

    // Validación del ID
    if (!id_ticket || id_ticket === 'undefined' || id_ticket === 'null' || isNaN(Number(id_ticket))) {
        return res.status(400).json({ error: "ID de ticket inválido o no proporcionado" });
    }

    try {
        // 🔥 Consulta SQL corregida usando los nombres exactos de tus capturas
        const query = `
            SELECT 
                t.id_ticket AS id,
                COALESCE(bu.nombre, 'Usuario Sistema') AS nombre,
                COALESCE(bu.correo, 'Sin correo electrónico') AS correo,
                COALESCE(bu.telefono, 'Sin teléfono') AS telefono,
                t.categoria_servicio AS categoria,
                t.subcategoria_falla AS subcategoria,
                t.titulo_falla AS titulo,
                t.descripcion_falla AS descripcion,
                TO_CHAR(t.fecha_creacion, 'DD/MM/YYYY') AS fecha,
                t.estado AS estado_crudo,
                COALESCE(bt.nombre, 'Sin asignar') AS tecnico,
                TO_CHAR(
                    COALESCE(
                        t.fecha_cierre, 
                        (SELECT fecha_registro FROM historial_trazabilidad WHERE id_ticket = t.id_ticket ORDER BY fecha_registro DESC LIMIT 1),
                        t.fecha_creacion
                    ), 
                    'DD/MM/YYYY'
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

        const ticket = resultado.rows[0];

        // Formatear el estado de manera idéntica a tu módulo de pendientes para que React lo entienda
        let estadoFormateado = 'Resuelto';
        const estadoBD = ticket.estado_crudo ? ticket.estado_crudo.toLowerCase().trim() : '';
        if (estadoBD === 'cerrado' || estadoBD === 'resuelto') {
            estadoFormateado = 'Resuelto';
        } else {
            // Por si acaso llega otro estado, capitalizar la primera letra
            estadoFormateado = ticket.estado_crudo.charAt(0).toUpperCase() + ticket.estado_crudo.slice(1);
        }

        // Construcción del JSON de respuesta con propiedades limpias para el Frontend
        const respuestaFormateada = {
            id: ticket.id,
            nombre: ticket.nombre,
            correo: ticket.correo,
            telefono: ticket.telefono,
            categoria: ticket.categoria || 'N/A',
            subcategoria: ticket.subcategoria || 'N/A',
            titulo: ticket.titulo || 'Sin título',
            descripcion: ticket.descripcion || 'Sin descripción',
            fecha: ticket.fecha,
            estado: estadoFormateado,
            tecnico: ticket.tecnico,
            fechaCierre: ticket.fecha_cierre || ticket.fecha
        };

        res.status(200).json(respuestaFormateada);
    } catch (error) {
        console.error("❌ ERROR AL OBTENER DETALLES DEL TICKET RESUELTO:", error.message);
        res.status(500).json({ 
            error: "Error en el servidor al obtener los datos del ticket", 
            detalle: error.message 
        });
    }
});

module.exports = router;