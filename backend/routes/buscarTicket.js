/* Esta funcion es para buscar un ticket  */
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Importa la conexión a la base de datos PostgreSQL

// Ruta GET para obtener los detalles de un ticket específico mediante su ID
router.get('/:id', async (req, res) => {
    // 1. Extraemos el ID de los parámetros de la URL (ej: /tickets/101)
    const { id } = req.params;

    // 2. Validación de seguridad: Verificamos que el ID sea realmente un número
    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID debe ser un número" });
    }

    try {
        // 3. Consulta SQL  
        const query = `
            SELECT 
                id_ticket, 
                id_usuario, 
                titulo, 
                descripcion, 
                /* TO_CHAR formatea la fecha del servidor a un formato legible (Día/Mes/Año) */
                TO_CHAR(fecha_creacion, 'DD/MM/YYYY') as fecha,
                /* COALESCE verifica si la fecha de cierre es nula; si lo es, pone una rayita '—' */
                COALESCE(TO_CHAR(fecha_cierre, 'DD/MM/YYYY'), '—') as fechacierre,
                estado
            FROM tickets 
            WHERE id_ticket = $1
        `;
        
        // 4. Ejecutamos la consulta usando parámetros ($1) para evitar inyecciones SQL
        const resultado = await pool.query(query, [id]);

        // 5. Si la base de datos no devuelve filas, significa que el ticket no existe
        if (resultado.rows.length === 0) {
            return res.status(404).json({ error: "Ticket no encontrado" });
        }

        // 6. Procesamiento de la información antes de enviarla al frontend
        const ticket = resultado.rows[0];
        
        /* Agregamos la propiedad 'tecnico' manualmente. 
           Esto asegura que el Frontend encuentre este campo aunque no venga de la base de datos,
           evitando que la tabla o los detalles se vean vacíos o den error.
        */
        ticket.tecnico = "Pendiente"; 

        // 7. Enviamos el objeto final al frontend con un estatus de éxito (200 OK implícito)
        res.json(ticket); 
        
    } catch (error) {
        // 8. Manejo de errores del servidor o de conexión a la base de datos
        console.error("❌ Error real:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Exportamos el router para que index.js pueda usarlo
module.exports = router;