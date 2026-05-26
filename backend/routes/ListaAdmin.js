// Archivos listaAdmin.jsx y ListaAdmin.js
// Es para que aparazca en una tabla todos los tecnicos registrados en el lista
// ADMIN

const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// @route   GET /api/admin/lista-tecnicos
router.get('/', async (req, res) => {
  try {
    // 1. FILTRADO ESTRICTO DE CARGA: 
    // Contamos ÚNICAMENTE los tickets que estén en "En proceso" o "En espera de compra"
    // Recuerda que el texto debe coincidir exactamente en mayúsculas/minúsculas con tu DB.
    const querySincronizar = `
      UPDATE tecnico t
      SET carga_actual = COALESCE((
        SELECT COUNT(*)::INT 
        FROM ticket tk 
        WHERE tk.id_tecnico = t.id_tecnico 
          AND tk.estado IN ('en proceso', 'en espera de compra')
      ), 0);
    `;
    
    // Ejecutamos la actualización física en la base de datos
    await pool.query(querySincronizar);

    // 2. CONSULTA DE RETORNO PARA EL FRONTEND:
    const queryLista = `
      SELECT 
        t.id_tecnico,
        b.nombre,
        b.correo,
        b.telefono,
        COALESCE(t.especialidad, 'Sin asignar') AS especialidad,
        t.carga_actual
      FROM Base b
      INNER JOIN Tecnico t ON b.id_base = t.id_base
      ORDER BY t.id_tecnico ASC;
    `;
    
    const resultado = await pool.query(queryLista);
    
    console.log("🎯 Cargas filtradas y sincronizadas en la DB (Solo 'en proceso' y 'en espera de compra').");
    res.status(200).json(resultado.rows);
    
  } catch (error) {
    console.error("❌ Error en ListaAdmin al filtrar y sincronizar cargas:", error.message);
    res.status(500).json({ error: "Error interno obteniendo técnicos" });
  }
});

module.exports = router;