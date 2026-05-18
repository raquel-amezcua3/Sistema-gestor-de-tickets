const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt'); // Añadido por seguridad si actualizan clave

// 1. OBTENER DATOS (GET)
router.get('/:id_base', async (req, res) => {
    const { id_base } = req.params;
    try {
        const query = `
            SELECT nombre, correo, telefono, extension, contrasena 
            FROM base 
            WHERE id_base = $1
        `;
        const resultado = await pool.query(query, [id_base]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "Perfil no encontrado" });
        }

        res.json(resultado.rows[0]);

    } catch (error) {
        console.error("❌ Error al obtener perfil:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 2. ACTUALIZAR DATOS (PUT)
router.put('/:id_base', async (req, res) => {
    const { id_base } = req.params;
    const { nombre, correo, telefono, extension, contrasena } = req.body;

    try {
        let query;
        let valores;

        // Si el usuario envió una contraseña nueva, la encriptamos antes de guardar
        if (contrasena && contrasena.trim() !== "") {
            const saltRounds = 10;
            const passEncriptada = await bcrypt.hash(contrasena, saltRounds);
            
            query = `
                UPDATE base 
                SET nombre = $1, correo = $2, telefono = $3, extension = $4, contrasena = $5 
                WHERE id_base = $6 
                RETURNING id_base, nombre, correo, telefono, extension;
            `;
            valores = [nombre, correo, telefono, extension, passEncriptada, id_base];
        } else {
            // Si vino vacía, actualizamos todo excepto la contraseña existente
            query = `
                UPDATE base 
                SET nombre = $1, correo = $2, telefono = $3, extension = $4
                WHERE id_base = $5 
                RETURNING id_base, nombre, correo, telefono, extension;
            `;
            valores = [nombre, correo, telefono, extension, id_base];
        }
        
        const resultado = await pool.query(query, valores);
        
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "No se pudo actualizar, el perfil no existe." });
        }

        res.json({ 
            mensaje: "Perfil actualizado correctamente", 
            usuario: resultado.rows[0] 
        });
    } catch (error) {
        console.error("❌ Error al actualizar perfil:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;