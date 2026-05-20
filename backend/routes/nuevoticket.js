//La pantalla de nuevoTicketU.jsx y nuevoTicket.js
//Esta pantalla es para que el usuario levante un ticket en el sistema.
// USUARIO

const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/crear', async (req, res) => {
    let { 
        id_base, 
        id_usuario, 
        id_equipo, 
        categoria_servicio, 
        subcategoria_falla, 
        titulo_falla, 
        descripcion_falla, 
        nivel_prioridad, 
        grado_impacto 
    } = req.body;

    // 1. Validaciones fundamentales obligatorias
    if (!id_base || Number.isNaN(id_base)) {
        return res.status(400).json({ error: "Falta el campo 'id_base' o es inválido." });
    }
    if (!id_equipo || Number.isNaN(id_equipo)) {
        return res.status(400).json({ error: "Por favor, seleccione un equipo afectado válido." });
    }
    if (!titulo_falla || titulo_falla.trim() === "") {
        return res.status(400).json({ error: "El campo 'Título de la falla' es obligatorio." });
    }
    if (!descripcion_falla || descripcion_falla.trim() === "") {
        return res.status(400).json({ error: "El campo 'Descripción' es obligatorio." });
    }

    try {
        // 2. SALVAVIDAS: Si id_usuario es inválido o no llegó, lo buscamos usando el id_base
        if (!id_usuario || Number.isNaN(id_usuario)) {
            console.log(`⚠️ id_usuario no recibido. Buscando en la base de datos para id_base: ${id_base}`);
            
            const buscarUsuarioQuery = `SELECT id_usuario FROM usuario WHERE id_base = $1 LIMIT 1;`;
            const usuarioEncontrado = await pool.query(buscarUsuarioQuery, [id_base]);

            if (usuarioEncontrado.rows.length > 0) {
                id_usuario = usuarioEncontrado.rows[0].id_usuario;
                console.log(`✅ id_usuario recuperado con éxito: ${id_usuario}`);
            } else {
                return res.status(400).json({ 
                    error: "No se encontró un perfil de usuario asociado a esta cuenta en la tabla 'usuario'." 
                });
            }
        }

        // 3. Insertar el ticket con los datos validados y completos
        const query = `
            INSERT INTO ticket (
                id_base, 
                id_usuario, 
                id_equipo, 
                categoria_servicio, 
                subcategoria_falla, 
                titulo_falla, 
                descripcion_falla, 
                nivel_prioridad, 
                grado_impacto, 
                fecha_creacion, 
                estado
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), 'Abierto')
            RETURNING *; 
        `;
        
        const values = [
            id_base, 
            id_usuario, 
            id_equipo, 
            categoria_servicio, 
            subcategoria_falla, 
            titulo_falla, 
            descripcion_falla, 
            nivel_prioridad, 
            grado_impacto
        ];
        
        const resultado = await pool.query(query, values);

        res.status(201).json({
            mensaje: "Ticket creado con éxito",
            ticket: resultado.rows[0]
        });

    } catch (error) {
        console.error("❌ Error al crear ticket:", error.message);
        res.status(500).json({ error: "Error interno en el servidor", detalle: error.message });
    }
});

module.exports = router;