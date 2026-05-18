//Esta funcion es para que el tecnico actualice sus datos en el sistema, 
// esta funcion hace que funcione la pantalla de perfilTecnico.jsx
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// @route   GET /api/tecnico/perfil/:id_base
router.get('/:id_base', async (req, res) => {
    const { id_base } = req.params;

    if (isNaN(id_base)) {
        return res.status(400).json({ error: "El ID debe ser un número válido." });
    }

    try {
        // Buscamos directamente por b.id_base para evitar confusiones de IDs entre tablas
        const query = `
            SELECT 
                t.id_tecnico,
                b.id_base,
                b.nombre AS nombre_usuario,
                b.correo AS correo_electronico,
                b.telefono,
                b.extension,
                t.especialidad,
                (
                    SELECT COUNT(*)::int 
                    FROM ticket tk 
                    WHERE tk.id_tecnico = t.id_tecnico 
                      AND (LOWER(tk.estado) = 'en proceso' OR tk.estado = 'En Proceso')
                ) AS carga_actual
            FROM base b
            LEFT JOIN tecnico t ON b.id_base = t.id_base
            WHERE b.id_base = $1;
        `;
        
        const resultado = await pool.query(query, [id_base]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "Perfil no encontrado en el sistema." });
        }

        const datosUsuario = resultado.rows[0];

        // Si el id_tecnico es NULL, significa que el usuario logueado es Administrador o un Usuario común
        if (!datosUsuario.id_tecnico) {
            return res.status(200).json({
                id_tecnico: datosUsuario.id_base,
                nombre: datosUsuario.nombre_usuario || 'Administrador',
                correo: datosUsuario.correo_electronico || '',
                telefono: datosUsuario.telefono || '',
                extension: datosUsuario.extension || '',
                especialidad: 'Administrador del Sistema',
                carga_actual: '0 tickets'
            });
        }

        // Si es un técnico, responderá con su especialidad o vacío si es NULL en la BD
        res.status(200).json({
            id_tecnico: datosUsuario.id_tecnico,
            nombre: datosUsuario.nombre_usuario || 'Técnico',
            correo: datosUsuario.correo_electronico || '',
            telefono: datosUsuario.telefono || '',
            extension: datosUsuario.extension || '',
            especialidad: datosUsuario.especialidad || '', 
            carga_actual: `${datosUsuario.carga_actual} tickets` 
        });

    } catch (error) {
        console.error(`❌ Error en GET /api/tecnico/perfil/${id_base}:`, error.message);
        res.status(500).json({ error: "Error en el servidor al obtener los datos del perfil" });
    }
});

// @route   PUT /api/tecnico/perfil/:id_base (Para guardar las modificaciones)
router.put('/:id_base', async (req, res) => {
    const { id_base } = req.params;
    const { correo, telefono, extension, contrasena } = req.body;

    try {
        if (contrasena && contrasena.trim() !== '') {
            const saltRounds = 10;
            const passEncriptada = await bcrypt.hash(contrasena, saltRounds);
            
            const queryUpdateConPass = `
                UPDATE Base 
                SET correo = $1, telefono = $2, extension = $3, contrasena = $4
                WHERE id_base = $5
            `;
            await pool.query(queryUpdateConPass, [correo, telefono, extension, passEncriptada, id_base]);
        } else {
            const queryUpdateSinPass = `
                UPDATE Base 
                SET correo = $1, telefono = $2, extension = $3
                WHERE id_base = $4
            `;
            await pool.query(queryUpdateSinPass, [correo, telefono, extension, id_base]);
        }

        res.status(200).json({ mensaje: "Perfil actualizado con éxito" });
    } catch (error) {
        console.error("❌ Error al actualizar perfil:", error.message);
        res.status(500).json({ error: "Error interno al guardar los cambios." });
    }
});

module.exports = router;