const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. Obtener tickets "en proceso" para la tabla del técnico
router.get('/pendientes/:id_tecnico', async (req, res) => {
    const { id_tecnico } = req.params;
    try {
        const query = `
            SELECT t.id_ticket AS id, u.nombre AS nombre_usuario, t.titulo, t.descripcion, 
                   TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD') AS fecha, t.estado, tec.nombre AS nombre_tecnico
            FROM tickets t
            JOIN usuarios u ON t.id_usuario = u.id_usuario
            JOIN usuarios tec ON t.id_tecnico = tec.id_usuario
            WHERE t.id_tecnico = $1 AND LOWER(t.estado) = 'en proceso'
            ORDER BY t.fecha_creacion DESC
        `;
        const resultado = await pool.query(query, [id_tecnico]);
        res.json(resultado.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener tickets" });
    }
});

// 2. Obtener el detalle de un ticket específico (Para DatosTicketTecnico.jsx)
router.get('/detalle/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT t.id_ticket AS id, u.nombre, u.correo, u.telefono, t.titulo, t.descripcion, 
                   TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD') AS fecha, t.estado, tec.nombre AS tecnico
            FROM tickets t
            JOIN usuarios u ON t.id_usuario = u.id_usuario
            LEFT JOIN usuarios tec ON t.id_tecnico = tec.id_usuario
            WHERE t.id_ticket = $1
        `;
        const resultado = await pool.query(query, [id]);
        res.json(resultado.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener detalle" });
    }
});

// 3. Actualizar ticket a "resuelto"
router.put('/resolver/:id', async (req, res) => {
    const { id } = req.params;
    const { fechaCierre } = req.body; 

    try {
        // Forzamos el estado a "resuelto" tal cual está en tu base de datos
        const estadoDb = "resuelto"; 

        const query = `
            UPDATE tickets 
            SET estado = $1, fecha_cierre = $2 
            WHERE id_ticket = $3
        `;
        
        const resultado = await pool.query(query, [estadoDb, fechaCierre, id]);

        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: "No se encontró el ticket con ese ID" });
        }

        res.json({ mensaje: "Ticket marcado como resuelto correctamente" });

    } catch (error) {
        res.status(500).json({ 
            error: "Error de base de datos", 
            detalle: error.message 
        });
    }
});

// 4. Obtener tickets con estado "resuelto" (NUEVA RUTA)
router.get('/resueltos/:id_tecnico', async (req, res) => {
    const { id_tecnico } = req.params;
    try {
        const query = `
            SELECT 
                t.id_ticket AS id, 
                u.nombre AS nombre, 
                t.titulo, 
                t.descripcion, 
                TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD') AS fecha,
                TO_CHAR(t.fecha_cierre, 'YYYY-MM-DD') AS fechacierre,
                t.estado, 
                tec.nombre AS tecnico
            FROM tickets t
            JOIN usuarios u ON t.id_usuario = u.id_usuario
            JOIN usuarios tec ON t.id_tecnico = tec.id_usuario
            WHERE t.id_tecnico = $1 
            AND t.estado = 'resuelto'
            ORDER BY t.fecha_cierre DESC
        `;
        const resultado = await pool.query(query, [id_tecnico]);
        res.json(resultado.rows);
    } catch (error) {
        console.error("❌ Error al obtener tickets resueltos:", error.message);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

module.exports = router;