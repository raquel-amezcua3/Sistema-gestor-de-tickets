const express = require('express');
const router = express.Router();
const pool = require('../db');

// OBTENER TODOS LOS USUARIOS PARA EL DIRECTORIO
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                id_usuario AS id, 
                nombre, 
                correo, 
                telefono, 
                extension 
            FROM usuarios 
            ORDER BY id_usuario ASC
        `;
        const resultado = await pool.query(query);
        
        // Formateamos el ID para que siempre tenga 3 dígitos (ej: 001) como en tu diseño
        const usuariosFormateados = resultado.rows.map(u => ({
            ...u,
            id: u.id.toString().padStart(3, '0')
        }));

        res.json(usuariosFormateados);
    } catch (error) {
        console.error("❌ ERROR EN DIRECTORIO:", error.message);
        res.status(500).json({ error: "No se pudo cargar el directorio" });
    }
});

module.exports = router;