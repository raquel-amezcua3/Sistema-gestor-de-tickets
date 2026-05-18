//Esta funcion/peticion es para crear un nuevo Administrador.
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db');

router.post('/', async (req, res) => {
    const { nombre, correo, contrasena, telefono, extension } = req.body;

    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ error: "Nombre, correo y contraseña son obligatorios." });
    }

    try {
        const saltRounds = 10;
        const passEncriptada = await bcrypt.hash(contrasena, saltRounds);

        await pool.query('BEGIN');

        // 1. Insertar en la tabla Base
        const queryBase = `
            INSERT INTO Base (nombre, correo, contrasena, telefono, extension)
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id_base
        `;
        const resBase = await pool.query(queryBase, [nombre, correo, passEncriptada, telefono, extension || null]);
        const idBaseGenerado = resBase.rows[0].id_base;

        // 2. Insertar en la tabla Administrador (Relación 1 a 1)
        await pool.query('INSERT INTO Administrador (id_base) VALUES ($1)', [idBaseGenerado]);

        await pool.query('COMMIT');
        
        res.status(201).json({ 
            mensaje: "Administrador creado con éxito", 
            id_base: idBaseGenerado 
        });

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("❌ Error en registro Admin:", error.message);
        res.status(500).json({ error: "Error al crear administrador", detalle: error.message });
    }
});

module.exports = router;