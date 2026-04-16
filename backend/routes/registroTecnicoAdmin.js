// Funcion para que el amdinistrador registre a un nuevo tecnico
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// Registrar un nuevo técnico
router.post('/registrar', async (req, res) => {
    const { nombre, correo, telefono, extension, contrasena } = req.body;

    try {
        // 1. Encriptamos la contraseña antes de guardarla
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

        // 2. Insertamos en la base de datos (Asumiendo que rol 2 = Técnico)
        const query = `
            INSERT INTO usuarios (nombre, correo, contraseña, telefono, extension, rol)
            VALUES ($1, $2, $3, $4, $5, 2)
            RETURNING id_usuario
        `;
        const values = [nombre, correo, hashedPassword, telefono, extension];

        await pool.query(query, values);

        res.status(201).json({ mensaje: "Técnico registrado exitosamente" });
    } catch (error) {
        console.error("Error al registrar técnico:", error.message);
        res.status(500).json({ error: "No se pudo registrar al técnico. Intente de nuevo." });
    }
});

module.exports = router;