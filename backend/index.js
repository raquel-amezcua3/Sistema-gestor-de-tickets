require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db'); // Usamos la conexión centralizada
const nuevoticketRoutes = require('./routes/nuevoticket'); // Importamos la nueva ruta
const asignarAdminRoutes = require('./routes/asignarAdmin');
const usuariosAdminRoutes = require('./routes/usuariosAdmin');
const registroTecnicoAdmin = require('./routes/registroTecnicoAdmin');
const busquedaGlobalRoutes = require('./routes/busquedaGlobalAdmin');





const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// --- CONEXIÓN INICIAL ---
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error conectando a Neon:', err.stack);
  } else {
    console.log('✅ Base de datos conectada (index.js)');
  }
});

// --- RUTAS MODULARIZADAS ---
app.use('/tickets', nuevoticketRoutes); // Todo lo de tickets va a /routes/nuevoticket.js

// --- RUTA DE BIENVENIDA ---
app.get('/', (req, res) => {
  res.send('Servidor Tarelix funcionando 🚀');
});

// --- 4. RUTA DE REGISTRO ---
app.post('/registro', async (req, res) => {
  const { nombre, correo, contraseña, telefono, extension, rol } = req.body;

  if (!nombre || !correo || !contraseña || rol === undefined) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }

  try {
    const saltRounds = 10;
    const contraseñaEncriptada = await bcrypt.hash(contraseña, saltRounds);

    const query = `
      INSERT INTO usuarios (nombre, correo, contraseña, telefono, extension, rol)
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING id_usuario, nombre, correo
    `;
    const values = [nombre, correo, contraseñaEncriptada, telefono, extension, rol];

    const resultado = await pool.query(query, values);
    
    res.status(201).json({ 
      mensaje: "Usuario registrado con éxito", 
      usuario: resultado.rows[0] 
    });

  } catch (error) {
    console.error("❌ Error en registro:", error.message);
    res.status(500).json({ error: "Error interno", detalle: error.message });
  }
});

// --- 5. RUTA DE LOGIN ---
app.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos" });
  }

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = result.rows[0];
    const coinciden = await bcrypt.compare(contraseña, usuario.contraseña);

    if (coinciden) {
      res.json({
        mensaje: "¡Bienvenido!",
        usuario: {
          id: usuario.id_usuario, 
          nombre: usuario.nombre,
          rol: usuario.rol
        }
      });
    } else {
      res.status(401).json({ error: "Contraseña incorrecta" });
    }

  } catch (error) {
    console.error("❌ Error en login:", error.message);
    res.status(500).json({ error: "Error en el proceso de login" });
  }
});

// --- OTRAS RUTAS MODULARIZADAS ---

// Seccion de "mis tickets" del usuario 0 
const misTicketsRoutes = require('./routes/misTickets');
app.use('/mis-tickets', misTicketsRoutes);


// Seccion de "buscar ticket" (todos los del sistema usuario 0)
const buscarTicketRoutes = require('./routes/buscarTicket');
app.use('/buscar-ticket', buscarTicketRoutes);

// Aparecen todos los tickets del sistema usuario 0
const todosLosTicketsRoutes = require('./routes/todosLosTickets');
app.use('/todos-los-tickets', todosLosTicketsRoutes);

// Tickets pendientes del usuario 0 (abierto o en espera)
const ticketsPendientesRoutes = require('./routes/ticketsPendientes');
app.use('/tickets-pendientes', ticketsPendientesRoutes);

// Detalle del ticket 
app.use('/detalle-ticket', require('./routes/detalleTicket'));

// Perfil del usuario
app.use('/perfil', require('./routes/perfil'));

// Directorio de usuarios
app.use('/directorio', require('./routes/directorio'));

// Para asignar tickets 
app.use('/admin', asignarAdminRoutes);
app.use('/admin/usuarios', usuariosAdminRoutes); 

//Para registrar un nuevo tecnico (Administrador rol 1)
app.use('/admin/registrar-tecnico', registroTecnicoAdmin);

//Para hacer una busqueda de un ticket dentro del sistema (Administrador rol 1)
app.use('/admin/busqueda', busquedaGlobalRoutes);

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});