//Pantalla buscarAdmin.jsx su .js es todosLosTickets.js
// Sirve para buscar tikckets 
// ADMIN

import React, { useState, useEffect } from 'react';
import '../styles/buscarAdmin.css';
import { useNavigate } from 'react-router-dom';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function BuscarAdmin() {
  const navigate_buscar_admin = useNavigate();
  
  const [tickets_buscar_admin, setTickets_buscar_admin] = useState([]);
  const [busqueda_buscar_admin, setBusqueda_buscar_admin] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarTickets = async () => {
      try {
        const response = await fetch('/api/admin/busqueda/todos-los-tickets');
        const data = await response.json();
        
        if (response.ok) {
          const dataAdaptada = data.map(t => ({
            id: t.id.toString(),
            nombre: t.nombre_usuario || 'N/A',
            titulo: t.titulo || 'Sin título',
            descripcion: t.descripcion || 'Sin descripción',
            fecha: t.fecha,
            fechaCierre: t.fecha_cierre,
            estado: t.estado || 'Abierto',
            tecnico: t.nombre_tecnico
          }));
          setTickets_buscar_admin(dataAdaptada);
        }
      } catch (error) {
        console.error("Error al conectar con la API:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarTickets();
  }, []);

  // Lógica de filtrado global mejorada por cualquier campo visible en la tabla
  const filtrados_buscar_admin = tickets_buscar_admin.filter((ticket) => {
    const busqueda = busqueda_buscar_admin.toLowerCase();
    return (
      ticket.id.toLowerCase().includes(busqueda) ||
      ticket.nombre.toLowerCase().includes(busqueda) ||
      ticket.titulo.toLowerCase().includes(busqueda) ||
      ticket.descripcion.toLowerCase().includes(busqueda) ||
      ticket.estado.toLowerCase().includes(busqueda) ||
      ticket.tecnico.toLowerCase().includes(busqueda)
    );
  });

  return (
    <div className="container-buscar-admin">
      <EncabezadoAdmin />

      <main className="contenido-buscar-admin">
        <div className="seccion-busqueda-buscar-admin">
          <div className="info-busqueda-buscar-admin">
            <span className="lupa-icono-buscar-admin">🔍</span>
            <h2>Busqueda Global de Tickets</h2>
          </div>
          <input 
            type="text" 
            className="input-redondeado-buscar-admin"
            value={busqueda_buscar_admin}
            onChange={(e) => setBusqueda_buscar_admin(e.target.value)}
            placeholder="Buscar por ID, Usuario, Titulo, Técnico o Estado..."
          />
        </div>

        <div className="tabla-wrapper-buscar-admin">
          <table className="tabla-tickets-buscar-admin">
            <thead>
              <tr>
                <th className="col-id-buscar-admin">ID</th>
                <th className="col-nombre-buscar-admin">Usuario</th>
                <th className="col-titulo-buscar-admin">Titulo</th>
                <th className="col-desc-buscar-admin">Descripción</th>
                <th className="col-fecha-buscar-admin">Creado</th>
                {/* <th className="col-fecha-buscar-admin">Cerrado</th> */}
                <th className="col-estado-buscar-admin">Estado</th>
                <th className="col-tecnico-buscar-admin">Tecnico</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>Cargando tickets...</td></tr>
              ) : filtrados_buscar_admin.length > 0 ? (
                filtrados_buscar_admin.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="fila-ticket-buscar-admin"
                    onDoubleClick={() => navigate_buscar_admin(`/datosTicketAdmin/${ticket.id}`)} 
                    style={{ cursor: 'pointer' }}
                    title="Doble clic para ver detalles"
                  >
                    <td>{ticket.id}</td>
                    <td>{ticket.nombre}</td>
                    <td>{ticket.titulo}</td>
                    <td>{ticket.descripcion}</td>
                    <td>{ticket.fecha}</td>
                   {/*  <td>{ticket.fechaCierre}</td> */}
                    <td>
                      <span className={`badge-estado ${ticket.estado.toLowerCase().replace(/\s+/g, '-')}`}>
                        {ticket.estado}
                      </span>
                    </td>
                    <td>{ticket.tecnico}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="sin-resultados-buscar-admin" style={{textAlign: 'center', padding: '20px'}}>
                    No se encontraron coincidencias
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default BuscarAdmin;
