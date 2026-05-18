//Esta funcion de la tabla de tickets resuelto es la pantalla de resueltoTecnico.jsx

// routes/ticketsTecnico.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// ==========================================
// 1. OBTENER TICKETS PENDIENTES ("en proceso")
// ==========================================
router.get('/pendientes/:id_tecnico', async (req, res) => {
    const { id_tecnico } = req.params;
    
    if (!id_tecnico || id_tecnico === 'undefined' || id_tecnico === 'null' || isNaN(Number(id_tecnico))) {
        return res.status(200).json([]);
    }

    try {
        // 🔥 CORREGIDO EL WHERE: Ahora busca por tec.id_base para evitar perder datos al reiniciar
        const query = `
            SELECT 
                t.id_ticket AS id, 
                bu.nombre AS nombre_usuario, 
                t.titulo_falla AS titulo, 
                t.descripcion_falla AS descripcion, 
                TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD') AS fecha, 
                t.estado, 
                bt.nombre AS nombre_tecnico
            FROM ticket t
            INNER JOIN usuario u ON t.id_usuario = u.id_usuario
            INNER JOIN base bu ON u.id_base = bu.id_base
            INNER JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            INNER JOIN base bt ON tec.id_base = bt.id_base
            WHERE tec.id_base = $1 AND LOWER(t.estado) = 'en proceso'
            ORDER BY t.fecha_creacion DESC
        `;
        const resultado = await pool.query(query, [parseInt(id_tecnico, 10)]);
        res.json(resultado.rows);
    } catch (error) {
        console.error("❌ ERROR EN PENDIENTES:", error.message);
        res.status(500).json({ error: "Error al obtener tickets pendientes", detalle: error.message });
    }
});

// ==========================================
// 2. ACCIÓN: MARCAR UN TICKET COMO RESUELTO
// ==========================================
router.put('/resolver/:id', async (req, res) => {
    const { id } = req.params; // id_ticket
    try {
        const fechaCierre = new Date().toISOString().split('T')[0];

        const query = `
            UPDATE ticket 
            SET estado = 'resuelto', fecha_cierre = $1 
            WHERE id_ticket = $2
        `;
        const resultado = await pool.query(query, [fechaCierre, id]);

        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: "No se encontró el ticket con ese ID" });
        }

        res.json({ mensaje: "Ticket marcado como resuelto correctamente", fecha_cierre: fechaCierre });
    } catch (error) {
        console.error("❌ ERROR AL RESOLVER TICKET:", error.message);
        res.status(500).json({ error: "Error en la base de datos al resolver", detalle: error.message });
    }
});

// ==========================================
// 3. OBTENER TICKETS RESUELTOS (Para tu tabla de la interfaz)
// ==========================================
router.get('/resueltos/:id_tecnico', async (req, res) => {
    const { id_tecnico } = req.params;

    if (!id_tecnico || id_tecnico === 'undefined' || id_tecnico === 'null' || isNaN(Number(id_tecnico))) {
        return res.status(200).json([]);
    }

    try {
        const query = `
            SELECT 
                t.id_ticket AS id, 
                bu.nombre AS nombre, 
                t.titulo_falla AS titulo, 
                t.descripcion_falla AS descripcion, 
                TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD') AS fecha, 
                -- 🔥 COALESCE: Si t.fecha_cierre es null, extrae la fecha del último historial de trazabilidad registrado
                TO_CHAR(
                    COALESCE(
                        t.fecha_cierre, 
                        (SELECT fecha_registro FROM historial_trazabilidad WHERE id_ticket = t.id_ticket ORDER BY fecha_registro DESC LIMIT 1)
                    ), 
                    'YYYY-MM-DD'
                ) AS fecha_cierre, 
                t.estado, 
                bt.nombre AS tecnico 
            FROM ticket t
            INNER JOIN usuario u ON t.id_usuario = u.id_usuario
            INNER JOIN base bu ON u.id_base = bu.id_base
            INNER JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            INNER JOIN base bt ON tec.id_base = bt.id_base
            WHERE tec.id_base = $1 AND LOWER(t.estado) = 'resuelto'
            ORDER BY t.fecha_cierre DESC NULLS LAST
        `;
        const resultado = await pool.query(query, [parseInt(id_tecnico, 10)]);
        res.json(resultado.rows);
    } catch (error) {
        console.error("❌ ERROR EN RESUELTOS:", error.message);
        res.status(500).json({ error: "Error al obtener la lista de resueltos", detalle: error.message });
    }
});

module.exports = router;