//Esta funcion sirve para que el Administrador registre un nuevo tecnico
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// Registrar un nuevo técnico (Admin registra a Técnico)
router.post('/registrar', async (req, res) => {
    // Agregada la especialidad a la desestructuración
    const { nombre, correo, telefono, extension, especialidad, contrasena } = req.body;

    // Validación básica de datos
    if (!nombre || !correo || !contrasena || !especialidad) {
        return res.status(400).json({ error: "Nombre, correo, especialidad y contraseña son obligatorios." });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // --- INICIO DE TRANSACCIÓN ---
        await pool.query('BEGIN');

        // 1. Insertar en la tabla "base" (datos personales)
        const queryBase = `
            INSERT INTO base (nombre, correo, contrasena, telefono, extension)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_base
        `;
        const resBase = await pool.query(queryBase, [nombre, correo, hashedPassword, telefono, extension]);
        const idBaseGenerado = resBase.rows[0].id_base;

        // 2. Insertar en la tabla "tecnico" vinculándolo con el id_base e incluyendo su especialidad
        const queryTecnico = `
            INSERT INTO tecnico (id_base, especialidad)
            VALUES ($1, $2)
            RETURNING id_tecnico
        `;
        const resTecnico = await pool.query(queryTecnico, [idBaseGenerado, especialidad]);

        await pool.query('COMMIT');
        // --- FIN DE TRANSACCIÓN ---

        res.status(201).json({ 
            mensaje: "Técnico registrado exitosamente",
            id_tecnico: resTecnico.rows[0].id_tecnico 
        });

    } catch (error) {
        await pool.query('ROLLBACK'); // Si algo falla, deshacemos los cambios
        console.error("❌ Error al registrar técnico:", error.message);

        // Manejo de correos duplicados
        if (error.code === '23505') {
            return res.status(400).json({ error: "El correo electrónico ya está registrado." });
        }

        res.status(500).json({ error: "No se pudo registrar al técnico en el sistema." });
    }
});

module.exports = router;