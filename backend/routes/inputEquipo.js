// routes/inputEquipo.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// @route   GET /api/equipo/usuario/:id_base
// @desc    Obtiene los equipos filtrando por la columna id_base de la tabla equipo
router.get('/usuario/:id_base', async (req, res) => {
    const { id_base } = req.params;

    if (isNaN(id_base)) {
        return res.status(400).json({ error: "El ID de base debe ser un número válido." });
    }

    try {
        // CORRECCIÓN CRUCIAL: Filtramos por la columna id_base en la tabla equipo
        const query = `
            SELECT 
                id_equipo, 
                tipo_equipo, 
                marca, 
                COALESCE(numero_serie, 'S/S') AS numero_serie,
                id_base,
                contador_fallas
            FROM equipo 
            WHERE id_base = $1
            ORDER BY id_equipo DESC;
        `;
        
        const resultado = await pool.query(query, [id_base]);
        
        // Enviamos las filas encontradas al Frontend
        res.status(200).json(resultado.rows);

    } catch (error) {
        console.error("❌ Error en inputEquipo.js:", error.message);
        res.status(500).json({ error: "Error interno del servidor", detalle: error.message });
    }
});

module.exports = router;