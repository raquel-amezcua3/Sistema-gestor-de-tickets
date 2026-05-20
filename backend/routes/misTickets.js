//Los archivos son todosTicketU.jsx y el .js es misTickets.js
//Lo que hace este codigo es, mostrar los datos de "mis tickets" del usuario en una tabla
//USUARIO

const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// Obtener tickets de un usuario específico usando su id_base global
router.get('/:id_identificador', async (req, res) => {
    const { id_identificador } = req.params;

    if (!id_identificador || id_identificador === 'undefined' || id_identificador === 'null' || isNaN(Number(id_identificador))) {
        console.warn("⚠️ Consulta omitida: identificador inválido enviado por el cliente:", id_identificador);
        return res.status(200).json([]); 
    }

    try {
        const query = `
            SELECT 
                t.id_ticket, 
                t.titulo_falla, 
                t.descripcion_falla, 
                CASE 
                    WHEN LOWER(t.estado) = 'abierto' THEN 'Abierto'
                    WHEN LOWER(t.estado) = 'en proceso' THEN 'En Proceso'
                    WHEN LOWER(t.estado) = 'en espera de compra' THEN 'En Espera de Compra'
                    WHEN LOWER(t.estado) = 'resuelto' THEN 'Resuelto'
                    WHEN LOWER(t.estado) = 'cerrado' THEN 'Cerrado'
                    ELSE t.estado 
                END AS estado, 
                t.nivel_prioridad,
                e.marca as equipo, 
                e.tipo_equipo,
                TO_CHAR(t.fecha_creacion, 'DD/MM/YYYY') as fecha,
                
                -- 🔥 CORRECCIÓN CRÍTICA: Solo calcula la fecha de cierre si está Resuelto o Cerrado
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

                b.nombre as usuario_nombre,
                COALESCE(bt.nombre, 'Pendiente') AS tecnico
            FROM ticket t
            LEFT JOIN equipo e ON t.id_equipo = e.id_equipo 
            LEFT JOIN Usuario u ON t.id_usuario = u.id_usuario
            LEFT JOIN Base b ON u.id_base = b.id_base
            LEFT JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN Base bt ON tec.id_base = bt.id_base
            WHERE u.id_base = $1 OR t.id_base = $1
            ORDER BY t.id_ticket DESC
        `;
        
        const resultado = await pool.query(query, [parseInt(id_identificador, 10)]);
        res.json(resultado.rows);
        
    } catch (error) {
        console.error("❌ Error crítico en misTickets:", error.message);
        res.status(500).json({ 
            error: "No se pudieron obtener los tickets del historial",
            detalle: error.message 
        });
    }
});

module.exports = router;