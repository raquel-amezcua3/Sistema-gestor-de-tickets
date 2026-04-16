// Funcion para ver el perfil del usuario, funcion que utilizan los 3 roles.
const express = require('express');
const router = express.Router();
const pool = require('../db');

// OBTENER DATOS
// Endpoint dinámico que recibe el ID del usuario por parámetro en la URL
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Se incluye la extension
        const query = 'SELECT nombre, correo, telefono, extension, "contraseña" FROM usuarios WHERE id_usuario = $1';
        const resultado = await pool.query(query, [id]);

        // Validación de existencia: Si no hay filas, el usuario no existe en la base de datos
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const usuario = resultado.rows[0];
        // Retornamos un objeto estructurado al frontend
        res.json({
            nombre: usuario.nombre,
            correo: usuario.correo,
            telefono: usuario.telefono,
            extension: usuario.extension || "", 
            contrasena: usuario.contraseña
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar datos
// Funcion para modificar la información del perfil del usuario
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    const { nombre, correo, telefono, extension, contrasena } = req.body;

    try {
        // Actualizar la extension 
        const query = `
            UPDATE usuarios 
            SET nombre = $1, correo = $2, telefono = $3, extension = $4, "contraseña" = $5 
            WHERE id_usuario = $6 
            RETURNING *`; 
        
        // Mapeo de valores para los placeholders ($1, $2, etc.) para prevenir inyecciones SQL
        const valores = [nombre, correo, telefono, extension, contrasena, id];
        const resultado = await pool.query(query, valores);
        
        res.json({ mensaje: "Perfil actualizado", usuario: resultado.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;