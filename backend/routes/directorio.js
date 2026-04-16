//Funcion para el directorio de los usuarios
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los usuarios para el directorio
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
        
        const usuariosFormateados = resultado.rows.map(u => ({
            ...u,
            id: u.id.toString().padStart(3, '0')
        }));

        res.json(usuariosFormateados);
        
    // Muestra si hay un error
    } catch (error) {
        console.error("❌ ERROR EN DIRECTORIO:", error.message);
        res.status(500).json({ error: "No se pudo cargar el directorio" });
    }
});

module.exports = router;