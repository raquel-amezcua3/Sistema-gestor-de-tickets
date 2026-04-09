import React, { useState, useEffect } from 'react';
import '../styles/pendientesTicketU.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function PendientesTicketU() {
  const navigate = useNavigate();
  
  // 1. Estados para los datos reales
  const [tickets, setTickets] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  // 2. Cargar tickets pendientes al montar el componente
  useEffect(() => {
    const obtenerPendientes = async () => {
      const id_usuario = localStorage.getItem('id_usuario');
      
      if (!id_usuario) {
        console.error("No se encontró el ID del usuario en el storage");
        setCargando(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/tickets-pendientes/${id_usuario}`);
        const data = await response.json();
        
        if (response.ok) {
          setTickets(data);
        } else {
          console.error("Error del servidor:", data.error);
        }
      } catch (error) {
        console.error("Error de conexión al backend:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerPendientes();
  }, []);

  // 3. Lógica de filtrado para el buscador (ID o Título)
  const ticketsFiltrados = tickets.filter((ticket) => {
    const idStr = ticket.id_ticket?.toString() || "";
    const tituloStr = ticket.titulo?.toLowerCase() || "";
    const termino = busqueda.toLowerCase();

    return idStr.includes(termino) || tituloStr.includes(termino);
  });

  return (
    <div className="container-pendientesTU">
      <HeaderPU />

      <main className="contenido-tabla">
        <div className="encabezado-tabla-flex">
          <h2 className='titulo-pendientesTU'>Mis Tickets Pendientes</h2>
          
          <div className="buscador-contenedor">
            <input 
              type="text" 
              placeholder="Buscar por ID o título..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <span className="icono-lupa">🔍</span>
          </div>
        </div>

        <div className="tabla-wrapper">
          <table className="tabla-tickets">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Título</th>
                <th>Descripción</th>
                <th className="col-fecha">Fecha de creación</th>
                <th>Estado</th>
                <th className="col-tecnico">Técnico</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    Cargando tickets pendientes...
                  </td>
                </tr>
              ) : ticketsFiltrados.length > 0 ? (
                ticketsFiltrados.map((ticket) => (
                  <tr 
                    key={ticket.id_ticket} 
                    className="fila-ticket"
                    onDoubleClick={() => navigate(`/detalle-ticket/${ticket.id_ticket}`)} 
                  >
                    <td>{ticket.id_ticket}</td>
                    {/* Usamos el nombre del usuario guardado en el login */}
                    <td>{localStorage.getItem('usuarioNombre')}</td>
                    <td>{ticket.titulo}</td>
                    <td>{ticket.descripcion}</td>
                    <td>{ticket.fecha}</td>
                    <td>
                      <span className={`estado-badge ${ticket.estado.toLowerCase().replace(" ", "-")}`}>
                        {ticket.estado}
                      </span>
                    </td>
                    <td>{ticket.tecnico || 'Sin asignar'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    {busqueda ? `No hay coincidencias para "${busqueda}"` : "No tienes tickets pendientes actualmente."}
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

export default PendientesTicketU;