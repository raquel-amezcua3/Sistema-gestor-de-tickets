//Esta funcion es para tener detalles del ticket que se selecciona
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener los detalles de un ticket específico por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params; // Captura el ID desde la URL
    try {
        const query = `
            SELECT 
                t.id_ticket, 
                u.nombre AS nombre_usuario, 
                u.correo, 
                u.telefono, 
                u.extension, 
                t.titulo, 
                t.descripcion, 
                t.estado, 
                t.id_tecnico,
                /* Formatea la fecha de creación a formato legible día/mes/año */
                TO_CHAR(t.fecha_creacion, 'DD/MM/YYYY') as fecha,
                t.fecha_cierre,
                /* Compara la fecha actual con la de cierre para determinar si han pasado más de 24 horas */
                (NOW() > t.fecha_cierre + INTERVAL '24 hours') as superar_limite
            FROM tickets t
            JOIN usuarios u ON t.id_usuario = u.id_usuario
            WHERE t.id_ticket = $1
        `;
        // Ejecuta la consulta de forma segura usando el ID como parámetro
        const resultado = await pool.query(query, [id]);

        // Valida si el ticket existe en la base de datos
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "Ticket no encontrado" });
        }

        let ticket = resultado.rows[0];

        // LÓGICA DE 24 HORAS: 
        // Si el estado es 'Resuelto' y ya pasó más de un día, lo forzamos a 'Cerrado'
        if (ticket.estado === 'Resuelto' && ticket.superar_limite) {
            ticket.estado = 'Cerrado';
            // Actualizamos en la base de datos para que el cambio sea permanente
            await pool.query(
                "UPDATE tickets SET estado = 'Cerrado' WHERE id_ticket = $1", 
                [id]
            );
        }

        // Agregamos el campo tecnico manualmente para que el frontend no falle
        ticket.tecnico = "Pendiente"; 

        res.json(ticket);
    } catch (error) {
        console.error("❌ ERROR EN DETALLE:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Actualizar información (título y descripción) de un ticket
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion } = req.body; // Recibe los nuevos datos del cuerpo de la petición
    try {
        // Verificamos si el ticket ya está cerrado para no permitir edición
        const check = await pool.query("SELECT estado FROM tickets WHERE id_ticket = $1", [id]);
        
        // Bloquea la edición si el estado es 'Cerrado' para mantener integridad de datos
        if (check.rows[0]?.estado === 'Cerrado') {
            return res.status(403).json({ error: "No se puede editar un ticket cerrado." });
        }

        // Ejecuta la actualización y retorna el registro modificado (RETURNING *)
        const resultado = await pool.query(
            "UPDATE tickets SET titulo = $1, descripcion = $2 WHERE id_ticket = $3 RETURNING *",
            [titulo, descripcion, id]
        );
        res.json({ mensaje: "Actualizado", ticket: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
