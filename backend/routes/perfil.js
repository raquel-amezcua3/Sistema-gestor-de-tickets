const express = require('express');
const router = express.Router();
const pool = require('../db');

// OBTENER DATOS
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // AHORA SÍ INCLUIMOS extension
        const query = 'SELECT nombre, correo, telefono, extension, "contraseña" FROM usuarios WHERE id_usuario = $1';
        const resultado = await pool.query(query, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const usuario = resultado.rows[0];
        res.json({
            nombre: usuario.nombre,
            correo: usuario.correo,
            telefono: usuario.telefono,
            extension: usuario.extension || "", // Si es nulo, mandamos vacío
            contrasena: usuario.contraseña
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ACTUALIZAR DATOS
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, telefono, extension, contrasena } = req.body;

    try {
        // AHORA SÍ ACTUALIZAMOS extension
        const query = `
            UPDATE usuarios 
            SET nombre = $1, correo = $2, telefono = $3, extension = $4, "contraseña" = $5 
            WHERE id_usuario = $6 
            RETURNING *`;
        
        const valores = [nombre, correo, telefono, extension, contrasena, id];
        const resultado = await pool.query(query, valores);
        
        res.json({ mensaje: "Perfil actualizado", usuario: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;