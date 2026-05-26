//La pantalla de esta funcion es pendientesTecnico.jsx
// routes/ticketsPendientes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener tickets pendientes usando cualquier identificador del técnico enviado por URL
router.get('/:id_identificador', async (req, res) => {
    const { id_identificador } = req.params;

    if (!id_identificador || id_identificador === 'undefined' || id_identificador === 'null' || isNaN(Number(id_identificador))) {
        console.warn("⚠️ Consulta omitida en Pendientes: identificador inválido enviado:", id_identificador);
        return res.status(200).json([]); 
    }

    try {
        const idNumerico = parseInt(id_identificador, 10);

        // CONSULTA DE ALTA COMPATIBILIDAD:
        // Busca si coincide con id_tecnico directo o si corresponde al id_base de ese técnico.
        const query = `
            SELECT 
                t.id_ticket, 
                t.titulo_falla AS titulo, 
                t.descripcion_falla AS descripcion, 
                CASE 
                    WHEN LOWER(t.estado) = 'abierto' THEN 'Abierto'
                    WHEN LOWER(t.estado) = 'en proceso' THEN 'En Proceso'
                    WHEN LOWER(t.estado) = 'en espera de compra' THEN 'En Espera de Compra'
                    WHEN LOWER(t.estado) = 'resuelto' THEN 'Resuelto'
                    WHEN LOWER(t.estado) = 'cerrado' THEN 'Cerrado'
                    ELSE t.estado 
                END AS estado, 
                t.nivel_prioridad,
                TO_CHAR(t.fecha_creacion, 'DD/MM/YYYY') as fecha,
                COALESCE(bu.nombre, 'Usuario Sistema') as nombre_usuario,
                COALESCE(bt.nombre, 'Sin asignar') as tecnico
            FROM ticket t
            LEFT JOIN equipo e ON t.id_equipo = e.id_equipo
            LEFT JOIN tecnico tec ON t.id_tecnico = tec.id_tecnico
            LEFT JOIN base bt ON tec.id_base = bt.id_base
            LEFT JOIN Usuario u ON t.id_usuario = u.id_usuario
            LEFT JOIN base bu ON u.id_base = bu.id_base
            WHERE 
                (
                    t.id_tecnico = $1 
                    OR tec.id_base = $1
                    OR t.id_tecnico = (SELECT id_tecnico FROM tecnico WHERE id_base = $1 LIMIT 1)
                ) 
                AND LOWER(t.estado) IN ('abierto', 'en proceso', 'en espera de compra')
            ORDER BY t.id_ticket DESC
        `;
        
        const resultado = await pool.query(query, [idNumerico]);
        console.log(`📥 Tickets pendientes cargados para el Técnico (ID: ${idNumerico}): ${resultado.rows.length}`);
        res.json(resultado.rows);

    } catch (error) {
        console.error("❌ ERROR DETALLADO EN PENDIENTES:", error.message);
        res.status(500).json({ 
            error: "No se pudieron obtener los tickets pendientes",
            detalle: error.message 
        });
    }
});

module.exports = router;