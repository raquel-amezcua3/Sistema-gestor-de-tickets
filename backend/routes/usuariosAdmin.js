// Funcion para ver los tecnicos, desde el rol de Admin.
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// 1. Obtener todos los técnicos (JOIN entre Tecnico y Base)
router.get('/tecnicos', async (req, res) => {
  try {
    // IMPORTANTE: Ya no existe la tabla "usuarios". Usamos "tecnico" y "base".
    const query = `
      SELECT 
        t.id_tecnico AS id_usuario, 
        b.nombre, 
        b.correo, 
        b.telefono, 
        b.extension 
      FROM tecnico t
      JOIN base b ON t.id_base = b.id_base
      ORDER BY b.nombre ASC
    `;
    const resultado = await pool.query(query);
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error en GET /tecnicos:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 2. Obtener un técnico específico por ID
router.get('/tecnicos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        t.id_tecnico AS id_usuario, 
        b.nombre, 
        b.correo, 
        b.telefono, 
        b.extension 
      FROM tecnico t
      JOIN base b ON t.id_base = b.id_base
      WHERE t.id_tecnico = $1
    `;
    const resultado = await pool.query(query, [id]);
    if (resultado.rows.length === 0) return res.status(404).json({ error: "Técnico no encontrado" });
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Actualizar técnico (Afecta a la tabla Base)
router.put('/tecnicos/:id', async (req, res) => {
  const { id } = req.params; // Este es id_tecnico
  const { nombre, correo, telefono, extension, contrasena } = req.body;
  
  try {
    // Primero obtenemos el id_base para saber a quién actualizar en la tabla Base
    const findBase = await pool.query('SELECT id_base FROM tecnico WHERE id_tecnico = $1', [id]);
    if (findBase.rows.length === 0) return res.status(404).json({ error: "No existe" });
    const id_base = findBase.rows[0].id_base;

    let query;
    let values;

    if (contrasena && contrasena !== '********') {
      const hashed = await bcrypt.hash(contrasena, 10);
      query = 'UPDATE base SET nombre=$1, correo=$2, telefono=$3, extension=$4, contrasena=$5 WHERE id_base=$6';
      values = [nombre, correo, telefono, extension, hashed, id_base];
    } else {
      query = 'UPDATE base SET nombre=$1, correo=$2, telefono=$3, extension=$4 WHERE id_base=$5';
      values = [nombre, correo, telefono, extension, id_base];
    }

    await pool.query(query, values);
    res.json({ mensaje: "Actualizado correctamente en la tabla Base" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Eliminar técnico (Borra de Tecnico, la info queda en Base)
router.delete('/tecnicos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Al borrar de tecnico, ya no aparecerá en la lista de técnicos
    await pool.query('DELETE FROM tecnico WHERE id_tecnico = $1', [id]);
    res.json({ mensaje: "Técnico eliminado de su rol correctamente" });
  } catch (error) {
    res.status(500).json({ error: "No se puede eliminar porque tiene tickets asociados." });
  }
});

module.exports = router;