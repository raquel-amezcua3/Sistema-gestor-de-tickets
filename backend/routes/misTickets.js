//Esta funcion trae todos los tickets que ha registrado un usuario. 
//Esta funcion es del archivo todosTicketsU.jsx (de la pantalla de usuario).

// routes/misTickets.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// Obtener tickets de un usuario específico usando su id_base global
router.get('/:id_identificador', async (req, res) => {
    const { id_identificador } = req.params;

    // Control de seguridad contra nulos o textos corruptos en la URL
    if (!id_identificador || id_identificador === 'undefined' || id_identificador === 'null' || isNaN(Number(id_identificador))) {
        console.warn("⚠️ Consulta omitida: identificador inválido enviado por el cliente:", id_identificador);
        return res.status(200).json([]); 
    }

    try {
        // 🔥 CONSULTA MODIFICADA: Agregamos el CASE para formatear estéticamente el texto del estado
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
                COALESCE(TO_CHAR(t.fecha_cierre, 'DD/MM/YYYY'), '—') as fechacierre,
                b.nombre as usuario_nombre
            FROM ticket t
            LEFT JOIN equipo e ON t.id_equipo = e.id_equipo 
            LEFT JOIN Usuario u ON t.id_usuario = u.id_usuario
            LEFT JOIN Base b ON u.id_base = b.id_base
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