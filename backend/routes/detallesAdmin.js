//Archivos detallesAdmin.jsx y detallesAdmin.js
//Sirve para ver los detalles de los tecnicos registrados en el sistema
// ADMIN

// routes/detallesAdmin.js
const express = require('express');
const router = express.Router();
const pool = require('../db');


// 1. ENDPOINT PUT: Actualiza los datos combinados del técnico (base + tecnico)
router.put('/usuarios/tecnicos/:id', async (req, res) => {
    const { id } = req.params; // id_tecnico recibido desde la URL
    let { nombre, correo, telefono, extension, especialidad, contrasena } = req.body;

    console.log(`\n=== 🛠️ INTENTO DE ACTUALIZACIÓN ===`);
    console.log(`> Recibido id_tecnico: ${id}`);
    console.log(`> Datos body:`, { nombre, correo, especialidad });

    if (!especialidad || especialidad.trim() === '' || especialidad.trim().toLowerCase() === 'sin asignar') {
        especialidad = null; 
    } else {
        especialidad = especialidad.trim(); 
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Obtener id_base asociado al id_tecnico
        const buscarBaseQuery = `SELECT id_base FROM tecnico WHERE id_tecnico = $1;`;
        const buscarBaseRes = await client.query(buscarBaseQuery, [id]);

        if (buscarBaseRes.rows.length === 0) {
            console.log(`❌ Error: No se encontró ningún técnico con id_tecnico = ${id} en la tabla 'tecnico'`);
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Técnico no encontrado en el sistema" });
        }

        const id_base = buscarBaseRes.rows[0].id_base;
        console.log(`> Vinculado correctamente con id_base: ${id_base}`);

        // 2. Actualizar la tabla 'base'
        let updateBaseQuery;
        let baseParams;

        if (contrasena && contrasena !== '********') {
            updateBaseQuery = `
                UPDATE base 
                SET nombre = $1, correo = $2, telefono = $3, extension = $4, contrasena = $5
                WHERE id_base = $6;
            `;
            baseParams = [nombre, correo, telefono, extension, contrasena, id_base];
        } else {
            updateBaseQuery = `
                UPDATE base 
                SET nombre = $1, correo = $2, telefono = $3, extension = $4
                WHERE id_base = $5;
            `;
            baseParams = [nombre, correo, telefono, extension, id_base];
        }

        await client.query(updateBaseQuery, baseParams);
        console.log(`✅ Tabla 'base' (id_base: ${id_base}) actualizada.`);

        // 3. Actualizar la tabla 'tecnico' (Especialidad)
        const updateTecnicoQuery = `
            UPDATE tecnico 
            SET especialidad = $1 
            WHERE id_tecnico = $2;
        `;
        const resultadoTecnico = await client.query(updateTecnicoQuery, [especialidad, id]);
        console.log(`✅ Tabla 'tecnico' (id_tecnico: ${id}) actualizada con especialidad: "${especialidad}". Filas afectadas: ${resultadoTecnico.rowCount}`);

        await client.query('COMMIT');
        res.status(200).json({ mensaje: "¡Datos y especialidad actualizados correctamente!" });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("❌ Error grave al actualizar técnico:", error.message);
        res.status(500).json({ error: "Error interno al actualizar datos", detalle: error.message });
    } finally {
        client.release();
    }
});

// 2. ENDPOINT DELETE: Dar de baja/eliminar técnico
router.delete('/usuarios/tecnicos/:id', async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const infoQuery = `SELECT id_base FROM tecnico WHERE id_tecnico = $1;`;
        const infoRes = await client.query(infoQuery, [id]);

        if (infoRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "El técnico ya no existe" });
        }

        const id_base = infoRes.rows[0].id_base;
        await client.query(`DELETE FROM tecnico WHERE id_tecnico = $1;`, [id]);
        await client.query(`DELETE FROM base WHERE id_base = $1;`, [id_base]);

        await client.query('COMMIT');
        res.status(200).json({ mensaje: "Técnico eliminado correctamente" });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("❌ Error al eliminar técnico:", error.message);
        res.status(400).json({ error: "No se puede eliminar el técnico." });
    } finally {
        client.release();
    }
});

module.exports = router;