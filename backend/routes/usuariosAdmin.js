const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt'); // Por si decides actualizar la contraseña

// 1. Obtener todos los técnicos (Ya lo tienes, asegúrate que traiga todo)
router.get('/tecnicos', async (req, res) => {
  try {
    const query = 'SELECT id_usuario, nombre, correo, telefono, extension FROM usuarios WHERE rol = 2 ORDER BY nombre ASC';
    const resultado = await pool.query(query);
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Obtener un técnico específico por ID
router.get('/tecnicos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT id_usuario, nombre, correo, telefono, extension FROM usuarios WHERE id_usuario = $1';
    const resultado = await pool.query(query, [id]);
    if (resultado.rows.length === 0) return res.status(404).json({ error: "No encontrado" });
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Actualizar técnico
router.put('/tecnicos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, telefono, extension, contrasena } = req.body;
  try {
    let query;
    let values;

    if (contrasena && contrasena !== '********') {
      const hashed = await bcrypt.hash(contrasena, 10);
      query = 'UPDATE usuarios SET nombre=$1, correo=$2, telefono=$3, extension=$4, contraseña=$5 WHERE id_usuario=$6';
      values = [nombre, correo, telefono, extension, hashed, id];
    } else {
      query = 'UPDATE usuarios SET nombre=$1, correo=$2, telefono=$3, extension=$4 WHERE id_usuario=$5';
      values = [nombre, correo, telefono, extension, id];
    }

    await pool.query(query, values);
    res.json({ mensaje: "Actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Eliminar técnico (Dar de baja)
router.delete('/tecnicos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [id]);
    res.json({ mensaje: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "No se puede eliminar porque tiene tickets asociados." });
  }
});

module.exports = router;