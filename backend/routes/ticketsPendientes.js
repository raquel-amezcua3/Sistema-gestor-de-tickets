// Funcion para que aparezca en una tabla los tickets pendientes
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Funcion para obtener tickets pendientes de un usuario específico
router.get('/:id_usuario', async (req, res) => {
    // Extrae el ID del usuario desde los parámetros de la URL
    const { id_usuario } = req.params;

    try {
        // Consulta SQL para obtener solo tickets con estados de en pro eso
        const query = `
            SELECT 
                id_ticket, 
                titulo, 
                descripcion, 
                estado, 
                /* Formatea la fecha directamente desde PostgreSQL para facilitar la lectura en el cliente */
                TO_CHAR(fecha_creacion, 'DD/MM/YYYY') as fecha
            FROM tickets 
            WHERE id_usuario = $1 
            /* Filtro de lógica de negocio: Solo estados que requieren atención (se usa LOWER para evitar problemas de mayúsculas) */
            AND (LOWER(estado) = 'abierto' OR LOWER(estado) = 'en espera')
            /* Ordena los resultados por fecha de creación, mostrando primero los más recientes */
            ORDER BY fecha_creacion DESC
        `;
        
        // Ejecución de la consulta utilizando parámetros para prevenir inyecciones SQL
        const resultado = await pool.query(query, [id_usuario]);
        
        // Agregamos manualmente la propiedad tecnico para que el front no de error
        // Mapeamos el arreglo original para inyectar el campo 'tecnico' a cada objeto
        const filas = resultado.rows.map(ticket => ({
            ...ticket,
            tecnico: 'Pendiente' 
        }));

        // Envío de la lista procesada en formato JSON
        res.json(filas);
    } catch (error) {
        
        // Registro de error detallado en el servidor
        console.error("❌ ERROR DETALLADO EN PENDIENTES:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;