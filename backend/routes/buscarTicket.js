//Archivo buscarTicketU.jsx y buscarTicket.js
// Es el buscador de ticket para el usuario
// USUARIO

// routes/buscarTicket.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// 1. ENDPOINT GLOBAL: Trae absolutamente todos los tickets del sistema
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                t.id_ticket, 
                t.id_usuario, 
                t.id_base,
                -- CORRECCIÓN CRUCIAL: Buscamos el nombre real usando la relación correcta de tablas,
                -- y usamos COALESCE con t.id_base por si el ticket se creó sin un id_usuario válido.
                COALESCE(b_usr.nombre, b_directa.nombre, 'Desconocido') AS nombre_usuario,
                t.titulo_falla AS titulo,            -- Alias exacto para React
                t.descripcion_falla AS descripcion,  -- Alias exacto para React
                t.categoria_servicio,
                t.nivel_prioridad,
                t.grado_impacto,
                t.estado,
                TO_CHAR(t.fecha_creacion, 'DD/MM/YYYY') as fecha,
                COALESCE(TO_CHAR(t.fecha_cierre, 'DD/MM/YYYY'), '—') as fechacierre,
                COALESCE(bt.nombre, 'Sin asignar') as tecnico, -- Alias para React
                e.marca as equipo_marca
            FROM ticket t
            -- Camino correcto: ticket -> usuario (id_usuario) -> base (id_base)
            LEFT JOIN usuario u ON t.id_usuario = u.id_usuario
            LEFT JOIN base b_usr ON u.id_base = b_usr.id_base
            -- Camino de respaldo directo por si id_usuario es nulo/inválido en tickets viejos
            LEFT JOIN base b_directa ON t.id_base = b_directa.id_base
            
            LEFT JOIN equipo e ON t.id_equipo = e.id_equipo
            LEFT JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN base bt ON tec.id_base = bt.id_base  
            ORDER BY t.id_ticket DESC;
        `;
        
        const resultado = await pool.query(query);
        res.json(resultado.rows); 
        
    } catch (error) {
        console.error("❌ Error al obtener todos los tickets:", error.message);
        res.status(500).json({ error: "Error al consultar los tickets", detalle: error.message });
    }
});

// 2. ENDPOINT ESPECÍFICO: Buscar un único ticket por ID numérico
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número" });
    }

    try {
        const query = `
            SELECT 
                t.id_ticket, 
                t.id_usuario, 
                t.id_base,
                COALESCE(b_usr.nombre, b_directa.nombre, 'Desconocido') AS nombre_usuario,
                t.titulo_falla AS titulo, 
                t.descripcion_falla AS descripcion, 
                t.categoria_servicio,
                t.nivel_prioridad,
                t.grado_impacto,
                t.estado,
                TO_CHAR(t.fecha_creacion, 'DD/MM/YYYY HH24:MI') as fecha,
                COALESCE(TO_CHAR(t.fecha_cierre, 'DD/MM/YYYY'), '—') as fechacierre,
                COALESCE(bt.nombre, 'Sin asignar') as tecnico,
                e.marca as equipo_marca,
                e.tipo_equipo
            FROM ticket t
            -- Mismo puente de corrección para el detalle individual
            LEFT JOIN usuario u ON t.id_usuario = u.id_usuario
            LEFT JOIN base b_usr ON u.id_base = b_usr.id_base
            LEFT JOIN base b_directa ON t.id_base = b_directa.id_base
            
            LEFT JOIN equipo e ON t.id_equipo = e.id_equipo
            LEFT JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN base bt ON tec.id_base = bt.id_base
            WHERE t.id_ticket = $1;
        `;
        
        const resultado = await pool.query(query, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "Ticket no encontrado" });
        }

        res.json(resultado.rows[0]); 
        
    } catch (error) {
        console.error("❌ Error en buscarTicket por ID:", error.message);
        res.status(500).json({ error: "Error al consultar el ticket", detalle: error.message });
    }
});

module.exports = router;