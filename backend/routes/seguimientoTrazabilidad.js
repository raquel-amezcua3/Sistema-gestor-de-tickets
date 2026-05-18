//La pantalla de este .js es seguimientoTicketU.jsx

const express = require('express');
const router = express.Router();
const connection = require('../config/db'); 

// POST para añadir el seguimiento de un ticket
router.post('/api/tecnico/tickets/seguimiento/:id', (req, res) => {
    const id_ticket = req.params.id;
    const { 
        estado, 
        diagnostico, 
        fallaReal, 
        accionTomada, 
        piezas, 
        tiempo,
        id_tecnico,
        fechaCierre // 📅 Recibimos la fecha capturada obligatoriamente en el modal
    } = req.body;

    // 1. Buscar el id_base y el id_usuario reales del ticket original
    const queryBuscarTicket = `SELECT id_base, id_usuario FROM ticket WHERE id_ticket = ?`;

    connection.query(queryBuscarTicket, [id_ticket], (errBuscar, resultados) => {
        if (errBuscar) {
            console.error("Error al buscar el ticket original:", errBuscar);
            return res.status(500).json({ mensaje: "Error interno al verificar el ticket", detalle: errBuscar.message });
        }

        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: "El ticket especificado no existe en la base de datos" });
        }

        const id_base_real = resultados[0].id_base;
        const id_usuario_real = resultados[0].id_usuario;

        // 2. Insertar el registro en historial_trazabilidad (Usa NOW() para el registro del historial)
        const queryHistorial = `
            INSERT INTO historial_trazabilidad 
            (id_ticket, id_base, id_usuario, id_tecnico, fecha_registro, diagnostico_tecnico, falla_real, accion_tomada, piezas_reemplazadas, tiempo_laborado, estado) 
            VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)
        `;

        const valoresHistorial = [
            id_ticket,
            id_base_real,      
            id_usuario_real,   
            id_tecnico || 1,   
            diagnostico,
            fallaReal,
            accionTomada,
            piezas,
            tiempo || 0,
            estado
        ];

        connection.query(queryHistorial, valoresHistorial, (errHistorial) => {
            if (errHistorial) {
                console.error("Error al insertar en historial_trazabilidad:", errHistorial);
                return res.status(500).json({ mensaje: "Error al guardar el historial de trazabilidad", detalle: errHistorial.message });
            }

            // 3. Actualizar la tabla principal 'ticket'
            let queryUpdateTicket = `UPDATE ticket SET estado = ? WHERE id_ticket = ?`;
            let valoresUpdate = [estado, id_ticket];

            // Si pasa a estado resuelto, actualizamos el estado y le planchamos la fecha de cierre manual
            if (estado.toLowerCase() === 'resuelto' || estado.toLowerCase() === 'cerrado') {
                queryUpdateTicket = `UPDATE ticket SET estado = 'Cerrado', fecha_cierre = ? WHERE id_ticket = ?`;
                valoresUpdate = [fechaCierre, id_ticket];
            }

            connection.query(queryUpdateTicket, valoresUpdate, (errUpdate) => {
                if (errUpdate) {
                    console.error("Error al actualizar el estado del ticket:", errUpdate);
                    return res.status(500).json({ mensaje: "Historial guardado, pero no se pudo actualizar el ticket principal" });
                }

                return res.status(200).json({ mensaje: "Seguimiento añadido y ticket actualizado correctamente" });
            });
        });
    });
});

module.exports = router;