//Los archivos son resueltoTecnico.jsx y el .js es ticketsTecnico.js
//Lo que hace este codigo es, mostrar la tabla de tickets resueltos que tiene el tecnico
// TECNICO

// ==========================================
// ARCHIVO: routes/ticketsTecnico.js
// RUTA GENERAL EN INDEX.JS: app.use('/api/tecnico/tickets', require('./routes/ticketsTecnico'));
// ==========================================

const express = require('express');
const router = express.Router();
const pool = require('../db'); // Conexión a la base de datos

// ==========================================
// 1. OBTENER TICKETS PENDIENTES ("en proceso")
// URL: GET http://localhost:3000/api/tecnico/tickets/pendientes/:id_tecnico
// ==========================================
router.get('/pendientes/:id_tecnico', async (req, res) => {
    const { id_tecnico } = req.params;
    
    if (!id_tecnico || id_tecnico === 'undefined' || id_tecnico === 'null' || isNaN(Number(id_tecnico))) {
        return res.status(200).json([]);
    }

    try {
        const query = `
            SELECT 
                t.id_ticket AS id, 
                COALESCE(bu.nombre, 'Sin Base') AS nombre_usuario, 
                t.titulo_falla AS titulo, 
                t.descripcion_falla AS descripcion, 
                TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD') AS fecha, 
                t.estado, 
                COALESCE(bt.nombre, 'Técnico Externo') AS nombre_tecnico
            FROM ticket t
            INNER JOIN usuario u ON t.id_usuario = u.id_usuario
            LEFT JOIN base bu ON u.id_base = bu.id_base
            INNER JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN base bt ON tec.id_base = bt.id_base
            WHERE tec.id_tecnico = $1 AND LOWER(t.estado) = 'en proceso'
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
// URL: PUT http://localhost:3000/api/tecnico/tickets/resolver/:id
// ==========================================
router.put('/resolver/:id', async (req, res) => {
    const { id } = req.params; 
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
// 3. AUXILIAR: OBTENER EL ID_TECNICO USANDO EL ID_USUARIO
// URL: GET http://localhost:3000/api/tecnico/tickets/obtener-id/:id_usuario
// ==========================================
router.get('/obtener-id/:id_usuario', async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const query = `
            SELECT tec.id_tecnico 
            FROM tecnico tec
            INNER JOIN usuario u ON tec.id_base = u.id_base
            WHERE u.id_usuario = $1 
            LIMIT 1
        `;
        const resultado = await pool.query(query, [parseInt(id_usuario, 10)]);
        
        if (resultado.rows.length > 0) {
            res.json({ id_tecnico: resultado.rows[0].id_tecnico });
        } else {
            res.status(404).json({ error: "El usuario no está registrado como técnico" });
        }
    } catch (error) {
        console.error("❌ Error al obtener id_tecnico:", error.message);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// ==========================================
// 4. OBTENER TICKETS RESUELTOS (POR ID_BASE DINÁMICO DE LA SESIÓN)
// URL: GET http://localhost:3000/api/tecnico/tickets/resueltos/:id_base_sesion
// ==========================================
router.get('/resueltos/:id_base_sesion', async (req, res) => {
    const { id_base_sesion } = req.params;

    // Validación preventiva de parámetros vacíos o corruptos
    if (!id_base_sesion || id_base_sesion === 'undefined' || id_base_sesion === 'null' || isNaN(Number(id_base_sesion))) {
        return res.status(200).json([]);
    }

    try {
        const idBaseNumerico = parseInt(id_base_sesion, 10);

        // Usamos LEFT JOINs para evitar que registros se oculten si falta algún dato opcional
        // Usamos ILIKE '%resuelto%' para tolerar variaciones de texto en la base de datos
        const query = `
            SELECT 
                t.id_ticket AS id, 
                COALESCE(bu.nombre, 'Sin Nombre') AS nombre, 
                t.titulo_falla AS titulo, 
                t.descripcion_falla AS descripcion, 
                TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD') AS fecha, 
                TO_CHAR(
                    COALESCE(
                        t.fecha_cierre, 
                        (SELECT fecha_registro FROM historial_trazabilidad WHERE id_ticket = t.id_ticket ORDER BY fecha_registro DESC LIMIT 1)
                    ), 
                    'YYYY-MM-DD'
                ) AS fecha_cierre, 
                t.estado, 
                COALESCE(bt.nombre, 'Técnico Asignado') AS tecnico 
            FROM ticket t
            INNER JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN usuario u ON t.id_usuario = u.id_usuario
            LEFT JOIN base bu ON u.id_base = bu.id_base
            LEFT JOIN base bt ON tec.id_base = bt.id_base
            WHERE tec.id_base = $1 
              AND t.estado ILIKE '%resuelto%'
            ORDER BY t.fecha_cierre DESC NULLS LAST
        `;
        
        const resultado = await pool.query(query, [idBaseNumerico]);
        
        // Log de depuración en la consola de Node.js
        console.log(`📡 [GET /resueltos/${idBaseNumerico}] Encontrados: ${resultado.rows.length} tickets.`);
        
        res.json(resultado.rows);
    } catch (error) {
        console.error("❌ ERROR EN ENDPOINT RESUELTOS:", error.message);
        res.status(500).json({ error: "Error al obtener la lista de resueltos", detalle: error.message });
    }
});

// ==========================================
// 4. OBTENER TICKETS RESUELTOS (POR ID_BASE DINÁMICO DE LA SESIÓN)
// URL: GET http://localhost:3000/api/tecnico/tickets/resueltos/:id_base_sesion
// ==========================================
router.get('/resueltos/:id_base_sesion', async (req, res) => {
    const { id_base_sesion } = req.params;

    if (!id_base_sesion || id_base_sesion === 'undefined' || id_base_sesion === 'null' || isNaN(Number(id_base_sesion))) {
        return res.status(200).json([]);
    }

    try {
        const idBaseNumerico = parseInt(id_base_sesion, 10);

        // 🚀 CAMBIO CLAVE: Usamos LEFT JOIN en las tablas de usuario y base.
        // Si un ticket no tiene un usuario asignado válido, se mostrará como 'Usuario General'.
        const query = `
            SELECT 
                t.id_ticket AS id, 
                COALESCE(bu.nombre, 'Usuario General') AS nombre, 
                t.titulo_falla AS titulo, 
                t.descripcion_falla AS descripcion, 
                TO_CHAR(t.fecha_creacion, 'YYYY-MM-DD') AS fecha, 
                TO_CHAR(
                    COALESCE(
                        t.fecha_cierre, 
                        (SELECT fecha_registro FROM historial_trazabilidad WHERE id_ticket = t.id_ticket ORDER BY fecha_registro DESC LIMIT 1)
                    ), 
                    'YYYY-MM-DD'
                ) AS fecha_cierre, 
                t.estado, 
                COALESCE(bt.nombre, 'Técnico Asignado') AS tecnico 
            FROM ticket t
            INNER JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN usuario u ON t.id_usuario = u.id_usuario
            LEFT JOIN base bu ON u.id_base = bu.id_base
            LEFT JOIN base bt ON tec.id_base = bt.id_base
            WHERE tec.id_base = $1 
              AND t.estado ILIKE '%resuelto%'
            ORDER BY t.fecha_cierre DESC NULLS LAST
        `;
        
        const resultado = await pool.query(query, [idBaseNumerico]);
        
        console.log(`📡 [GET /resueltos/${idBaseNumerico}] ¡Éxito! Enviando ${resultado.rows.length} tickets a Postman/React.`);
        
        res.json(resultado.rows);
    } catch (error) {
        console.error("❌ ERROR EN ENDPOINT RESUELTOS:", error.message);
        res.status(500).json({ error: "Error al obtener la lista de resueltos", detalle: error.message });
    }
});

module.exports = router;