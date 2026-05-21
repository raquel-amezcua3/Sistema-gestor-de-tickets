//El archivo es bitacoraEUsuario.jsx y bitacoraEUsuario.js
//Esta pantalla sirve para que el usuario vea la bitacora de sus equipos registrados
// USUARIO

const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// =========================================================================
// 1. GET: Obtener el historial de la bitácora de un equipo para la Vista de Usuario
// =========================================================================
// @route   GET /api/bitacora-usuario/:id_equipo
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
        console.error("❌ Error al obtener la bitácora para el usuario:", error.message);
        res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
    }
});

module.exports = router;