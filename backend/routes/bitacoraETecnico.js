//El archivo es bitacoraETecnico.jsx y bitacoraETecnico.js
//Esta pantalla sirve para que el tecnico vea la bitacora de los equipos y pueda poner comentarios.
// TECNICO

const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// 1. GET: Obtener el historial completo y cruzar nombres de la tabla Base
router.get('/:id_equipo', async (req, res) => {
    const { id_equipo } = req.params;

    if (isNaN(id_equipo)) {
        return res.status(400).json({ error: "El ID del equipo debe ser un número válido." });
    }

    try {
        const query = `
            SELECT 
                b.id_comentario,
                b.id_equipo,
                b.id_tecnico,
                b.id_base,
                b.fecha_comentario,
                b.componente_afectado,
                b.tipo_modificacion,
                b.referencia_pieza,
                b.estado_actual,
                u.nombre AS nombre_tecnico
            FROM bitacora_equipo b
            LEFT JOIN Base u ON b.id_base = u.id_base
            WHERE b.id_equipo = $1
            ORDER BY b.fecha_comentario DESC;
        `;
        
        const resultado = await pool.query(query, [parseInt(id_equipo, 10)]);
        res.status(200).json(resultado.rows);

    } catch (error) {
        console.error("❌ Error al obtener la bitácora del equipo:", error.message);
        res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
    }
});


// 2. POST: Insertar un nuevo comentario en la bitácora de manera dinámica
router.post('/', async (req, res) => {
    const { 
        id_equipo, 
        id_tecnico, 
        id_base, 
        componente_afectado, 
        tipo_modificacion, 
        referencia_pieza, 
        estado_actual 
    } = req.body;

    if (!id_equipo || !id_tecnico || !id_base || !componente_afectado || !tipo_modificacion || !estado_actual) {
        return res.status(400).json({ error: "Faltan campos obligatorios en el cuerpo de la solicitud." });
    }

    try {
        const query = `
            INSERT INTO bitacora_equipo (
                id_equipo, 
                id_tecnico, 
                id_base, 
                fecha_comentario, 
                componente_afectado, 
                tipo_modificacion, 
                referencia_pieza, 
                estado_actual
            ) 
            VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7)
            RETURNING *;
        `;

        const valores = [
            parseInt(id_equipo, 10), 
            parseInt(id_tecnico, 10), 
            parseInt(id_base, 10), 
            componente_afectado.trim(), 
            tipo_modificacion.trim(), 
            referencia_pieza || 'N/A', 
            estado_actual
        ];

        const resultado = await pool.query(query, valores);
        res.status(201).json({ mensaje: "Registro guardado con éxito", registro: resultado.rows[0] });

    } catch (error) {
        console.error("❌ Error al insertar en bitacora_equipo:", error.message);
        res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
    }
});

module.exports = router;