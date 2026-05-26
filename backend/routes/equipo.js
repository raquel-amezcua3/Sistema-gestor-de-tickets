//Esta funcion hace que aparezcan los datos de la tabla equipoU.jsx
//Tambien esta funcion registra los nuevos equipos de la pantalla equipoRegistro.jsx
// USUARIO

// app.use('/api/equipo', equipoRouter);
// routes/equipo.js

const express = require('express');
const router = express.Router();
const pool = require('../db');

// RUTA 1: Registrar un nuevo equipo (POST) -> URI: /api/equipo/registrar
router.post('/registrar', async (req, res) => {
    let { id_usuario, id_base, tipo_equipo, marca, numero_serie } = req.body;

    if (!id_base || isNaN(Number(id_base)) || !marca || !tipo_equipo) {
        return res.status(400).json({ 
            error: "Faltan datos obligatorios para el registro (Base, Marca o Tipo)." 
        });
    }

    try {
        if (!id_usuario || id_usuario === 'null' || id_usuario === 'undefined' || isNaN(Number(id_usuario))) {
            console.log(`⚠️ id_usuario no recibido en registro de equipo. Buscando para id_base: ${id_base}`);
            
            const buscarUsuarioQuery = `SELECT id_usuario FROM usuario WHERE id_base = $1 LIMIT 1;`;
            const usuarioEncontrado = await pool.query(buscarUsuarioQuery, [id_base]);

            if (usuarioEncontrado.rows.length > 0) {
                id_usuario = usuarioEncontrado.rows[0].id_usuario;
                console.log(`✅ id_usuario recuperado con éxito de la DB: ${id_usuario}`);
            } else {
                id_usuario = null; 
                console.log(`ℹ️ No se encontró perfil en la tabla 'usuario'. Se registrará con id_usuario como NULL.`);
            }
        }

        const query = `
            INSERT INTO equipo (id_usuario, id_base, tipo_equipo, marca, numero_serie)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_equipo;
        `;
        
        const values = [
            id_usuario, 
            parseInt(id_base, 10), 
            tipo_equipo, 
            marca, 
            numero_serie ? numero_serie.trim() : null
        ];
        
        const resultado = await pool.query(query, values);

        res.status(201).json({
            mensaje: "Equipo registrado correctamente",
            id_equipo: resultado.rows[0].id_equipo
        });
    } catch (error) {
        console.error("❌ Error en DB al registrar equipo:", error.message);
        res.status(500).json({ 
            error: "Error en el servidor al procesar el registro del equipo", 
            detalle: error.message 
        });
    }
});

// RUTA 2: Obtener todos los equipos de un usuario específico (GET) -> URI: /api/equipo/usuario/:id_identificador
// RUTA 2: Obtener todos los equipos de un usuario específico (GET) -> URI: /api/equipo/usuario/:id_identificador
router.get('/usuario/:id_identificador', async (req, res) => {
    const { id_identificador } = req.params;

    // Filtro protector contra nulos o strings "undefined" / "null" en la URL
    if (!id_identificador || id_identificador === 'undefined' || id_identificador === 'null' || isNaN(Number(id_identificador))) {
        console.warn("⚠️ Consulta omitida en Equipos: identificador inválido enviado:", id_identificador);
        return res.status(200).json([]); 
    }

    try {
        const idNumerico = parseInt(id_identificador, 10);

        // Esta consulta busca si el ID coincide con id_base o id_usuario directamente en la tabla equipo,
        // O si coincide con el id_base de la tabla usuario para traer sus equipos correspondientes.
        const query = `
            SELECT 
                e.id_equipo, 
                e.tipo_equipo, 
                e.marca, 
                e.numero_serie,
                COUNT(t.id_ticket)::INT AS contador_fallas
            FROM equipo e
            LEFT JOIN ticket t ON e.id_equipo = t.id_equipo
            WHERE 
                e.id_base = $1 
                OR e.id_usuario = $1 
                OR e.id_usuario = (SELECT id_usuario FROM usuario WHERE id_base = $1 LIMIT 1)
            GROUP BY e.id_equipo
            ORDER BY e.id_equipo DESC;
        `;
        
        const resultado = await pool.query(query, [idNumerico]);
        res.json(resultado.rows);
    } catch (error) {
        console.error("❌ Error al obtener equipos:", error.message);
        res.status(500).json({ 
            error: "Error en el servidor al obtener equipos", 
            detalle: error.message 
        });
    }
});

// RUTA 3: Obtener un equipo específico por su ID -> URI: /api/equipo/individual/:id_equipo
router.get('/individual/:id_equipo', async (req, res) => {
    const { id_equipo } = req.params;

    if (!id_equipo || isNaN(Number(id_equipo))) {
        return res.status(400).json({ error: "El ID del equipo proporcionado no es válido." });
    }

    try {
        const query = `
            SELECT id_equipo, id_base, tipo_equipo, marca, numero_serie 
            FROM equipo 
            WHERE id_equipo = $1;
        `;
        const resultado = await pool.query(query, [parseInt(id_equipo, 10)]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "Equipo no encontrado." });
        }

        res.json(resultado.rows[0]); // Devolvemos solo el equipo encontrado
    } catch (error) {
        console.error("❌ Error al obtener el equipo individual:", error.message);
        res.status(500).json({ error: "Error en el servidor al obtener el equipo" });
    }
});

module.exports = router;