//Sirve para mostrar el diretorio de los usuario 
// USUARIO, TECNICO Y ADMIN

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los contactos del sistema para el directorio
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                id_base, 
                nombre, 
                correo, 
                telefono, 
                extension
            FROM base
            ORDER BY id_base ASC
        `;
        const resultado = await pool.query(query);
        
        // Formateamos el ID para mantener la estética '001', '002', etc.
        const usuariosFormateados = resultado.rows.map(u => ({
            id: u.id_base.toString().padStart(3, '0'),
            nombre: u.nombre,
            correo: u.correo,
            telefono: u.telefono,
            extension: u.extension || 'N/A'
        }));

        res.json(usuariosFormateados);
        
    } catch (error) {
        console.error("❌ ERROR EN DIRECTORIO:", error.message);
        res.status(500).json({ 
            error: "No se pudo cargar el directorio",
            detalle: error.message 
        });
    }
});

module.exports = router;