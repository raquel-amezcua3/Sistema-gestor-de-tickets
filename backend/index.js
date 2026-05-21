require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const pool = require('./db'); 

// Enrutadores modularizados
const nuevoticketRoutes = require('./routes/nuevoticket');
const asignarAdminRoutes = require('./routes/asignarAdmin');
const usuariosAdminRoutes = require('./routes/usuariosAdmin'); 
const registroTecnicoAdmin = require('./routes/registroTecnicoAdmin');
const ticketsTecnico = require('./routes/ticketsTecnico');
const equipoRouter = require('./routes/equipo');
const registroAdmin = require('./routes/registroAdmin');
const datosTicketAdminRouter = require('./routes/datosTicketAdmin'); 
const todosLosTicketsRouter = require('./routes/todosLosTickets');
const detallesAdminRouter = require('./routes/detallesAdmin');
const bitacoraEquipoRouter = require('./routes/bitacoraETecnico');
const bitacoraUsuarioRouter = require('./routes/bitacoraEUsuario');

// Enrutadores adicionales
const listaAdminRouter = require('./routes/ListaAdmin');
const cargaticketsAdminRouter = require('./routes/cargaticketsAdmin');
const datosResueltoRouter = require('./routes/datosResueltoTecnico');
const rutaInputEquipo = require('./routes/inputEquipo');

const app = express();

app.use(express.json());
app.use(cors());

// --- CONEXIÓN INICIAL ---
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err.stack);
  } else {
    console.log('✅ Base de datos conectada con éxito');
  }
});

// =========================================================================
// --- RUTAS DE LA APP ---
// =========================================================================

// 📌 1. Bitácora de equipo (Prioridad Alta)
app.use('/api/bitacora-equipo', bitacoraEquipoRouter);
app.use('/api/bitacora-usuario', bitacoraUsuarioRouter);

// 📌 2. Gestión de Tickets y Flujos Generales
app.use('/api/tickets', nuevoticketRoutes);
app.use('/api/mis-tickets', require('./routes/misTickets'));
app.use('/api/buscar-ticket', require('./routes/buscarTicket'));
app.use('/api/todos-los-tickets', require('./routes/buscarTicket'));
app.use('/api/tickets-pendientes', require('./routes/ticketsPendientes'));
app.use('/api/detalle-ticket', require('./routes/detalleTicket'));
app.use('/api/perfil', require('./routes/perfil'));
app.use('/api/directorio', require('./routes/directorio'));

// 📌 3. Autenticación y Registro Directo
app.post('/api/registro', async (req, res) => {
  const { nombre, correo, contrasena, telefono, extension } = req.body;
  if (!nombre || !correo || !contrasena || !telefono || !extension) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }
  try {
    const saltRounds = 10;
    const passEncriptada = await bcrypt.hash(contrasena, saltRounds);
    await pool.query('BEGIN');
    const queryBase = `
      INSERT INTO Base (nombre, correo, contrasena, telefono, extension)
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id_base, nombre, correo
    `;
    const resBase = await pool.query(queryBase, [nombre, correo, passEncriptada, telefono, extension]);
    const idBaseGenerado = resBase.rows[0].id_base;
    await pool.query('INSERT INTO Usuario (id_base) VALUES ($1)', [idBaseGenerado]);
    await pool.query('COMMIT'); 
    res.status(201).json({ mensaje: "Usuario registrado con éxito en el sistema", usuario: resBase.rows[0] });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("❌ Error en registro:", error.message);
    res.status(500).json({ error: "Error interno", detalle: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { correo, contrasena, contraseña } = req.body;
  const passwordIngresada = contrasena || contraseña;

  if (!correo || !passwordIngresada) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos" });
  }

  try {
    const queryLogin = `
      SELECT 
        b.id_base, b.nombre, b.correo, b.contrasena,
        u.id_usuario,
        CASE 
          WHEN a.id_admin IS NOT NULL THEN 1
          WHEN t.id_tecnico IS NOT NULL THEN 2
          WHEN u.id_usuario IS NOT NULL THEN 3
          ELSE 3
        END AS rol
      FROM Base b
      LEFT JOIN Administrador a ON b.id_base = a.id_base
      LEFT JOIN Tecnico t ON b.id_base = t.id_base
      LEFT JOIN Usuario u ON b.id_base = u.id_base
      WHERE b.correo = $1
    `;
    const result = await pool.query(queryLogin, [correo]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const usuarioEncontrado = result.rows[0];
    const coinciden = await bcrypt.compare(passwordIngresada, usuarioEncontrado.contrasena);

    if (coinciden) {
      res.json({
        mensaje: "¡Bienvenido!",
        usuario: {
          id_base: usuarioEncontrado.id_base,
          id_usuario: usuarioEncontrado.id_usuario,
          nombre: usuarioEncontrado.nombre,
          rol: usuarioEncontrado.rol 
        }
      });
    } else {
      res.status(401).json({ error: "Contraseña incorrecta" });
    }
  } catch (error) {
    console.error("❌ Error en login:", error.message);
    res.status(500).json({ error: "Error en el servidor durante el login" });
  }
});

// 📌 4. Rutas del Administrador
app.use('/api/asignar-admin', asignarAdminRoutes); 
app.use('/api/admin/usuarios', usuariosAdminRoutes); 
app.use('/api/admin/registrar-tecnico', registroTecnicoAdmin);
app.use('/api/admin/registro-Admin', registroAdmin);
app.use('/api/admin/detalle-tecnico-perfil', require('./routes/datosTecnicoDetalle'));
app.use('/api/admin/busqueda', require('./routes/buscarTicketAdmin'));
app.use('/api/admin/lista-tecnicos', listaAdminRouter);
app.use('/api/admin/carga-tickets', cargaticketsAdminRouter);
app.use('/api/datos-ticket-admin', datosTicketAdminRouter); 
app.use('/api/admin/busqueda', todosLosTicketsRouter);
app.use('/api/admin', detallesAdminRouter);

// 📌 5. Rutas del Técnico y Seguimiento Directo
app.use('/api/tecnico/tickets', require('./routes/datosTicketTecnico'));
app.use('/api/tecnico/perfil', require('./routes/perfilTecnico'));
app.use('/api/datos-resuelto', datosResueltoRouter);

app.post('/api/tecnico/tickets/seguimiento/:id', async (req, res) => {
  const id_ticket = req.params.id;
  const { estado, diagnostico, fallaReal, accionTomada, piezas, tiempo, id_tecnico, id_base } = req.body;

  try {
      await pool.query('BEGIN');
      const queryHistorial = `
          INSERT INTO historial_trazabilidad 
          (id_ticket, id_base, id_tecnico, fecha_registro, diagnostico_tecnico, falla_real, accion_tomada, piezas_reemplazadas, tiempo_laborado, estado) 
          VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9)
      `;
      const valoresHistorial = [id_ticket, id_base || 1, id_tecnico || 1, diagnostico, fallaReal, accionTomada, piezas, tiempo || 0, estado];
      await pool.query(queryHistorial, valoresHistorial);

      const queryUpdateTicket = `UPDATE ticket SET estado = $1 WHERE id_ticket = $2`;
      await pool.query(queryUpdateTicket, [estado, id_ticket]);
      await pool.query('COMMIT');

      return res.status(200).json({ mensaje: "Seguimiento añadido y ticket actualizado correctamente" });
  } catch (error) {
      await pool.query('ROLLBACK');
      console.error("❌ Error en historial_trazabilidad:", error.message);
      return res.status(500).json({ error: "Error interno al guardar la trazabilidad", detalle: error.message });
  }
});

// 📌 6. Rutas de Equipos (Se colocan al final del prefijo /api/equipo para no interceptar subrutas)
app.post('/api/registrar-nuevo-equipo', async (req, res) => {
  const { id_usuario, id_base, tipo_equipo, marca, numero_serie } = req.body;
  if (!id_usuario || !id_base || !tipo_equipo || !marca) {
    return res.status(400).json({ error: "Faltan datos obligatorios para registrar el equipo." });
  }
  try {
    const query = `
      INSERT INTO equipo (id_usuario, id_base, tipo_equipo, marca, numero_serie)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_equipo;
    `;
    const resultado = await pool.query(query, [id_usuario, id_base, tipo_equipo, marca, numero_serie]);
    res.status(201).json({ mensaje: "Equipo registrado correctamente", id_equipo: resultado.rows[0].id_equipo });
  } catch (error) {
    console.error("❌ Error directo al insertar equipo:", error.message);
    res.status(500).json({ error: "Error en el servidor al guardar el equipo", detalle: error.message });
  }
});

app.use('/api/equipo', equipoRouter); 

// --- FRONTEND STATIC DELIVERY ---
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor y Front-End listos en el puerto ${PORT}`);
});