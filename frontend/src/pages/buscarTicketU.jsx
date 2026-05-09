import React, { useState, useEffect } from 'react';
import '../styles/buscarTicketU.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function BuscarTicketU() {
  const navigate_buscarTicketU = useNavigate();
  
  // 1. Estados al buscar un ticket en el usuario de rol 0
  const [tickets, setTickets] = useState([]); 
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  // 2. Cargar TODOS los tickets del sistema al iniciar
  useEffect(() => {
    const obtenerTodosLosTickets = async () => {
      try {
        // Use la nueva ruta global que configure en el back
        const response = await fetch(`/api/todos-los-tickets`);
        const data = await response.json();
        
        if (response.ok) {
          setTickets(data);
        } else {
          console.error("Error al obtener todos los tickets:", data.error);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerTodosLosTickets();
  }, []);

  // 3. Lógica de filtrado por ID, Título o Nombre de Usuario
  const filtrados = tickets.filter((ticket) => {
    const idStr = ticket.id_ticket?.toString() || "";
    const tituloStr = ticket.titulo?.toLowerCase() || "";
    const usuarioStr = ticket.nombre_usuario?.toLowerCase() || "";
    const termino = busqueda.toLowerCase();

    return idStr.includes(termino) || tituloStr.includes(termino) || usuarioStr.includes(termino);
  });

  return (
    <div className="container-buscarTicketU">
      <HeaderPU />

      <main className="contenido-buscarTicketU">
        <div className="seccion-busqueda-buscarTicketU">
          <div className="info-busqueda-buscarTicketU">
            <span className="lupa-grande-buscarTicketU">🔍</span>
            <h2>Buscador Global de Tickets</h2>
          </div>
          <input 
            type="text" 
            className="input-redondeado-buscarTicketU"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Escribe aquí para buscar..."
          />
        </div>

        <div className="tabla-wrapper-buscarTicketU">
          <table className="tabla-tickets-buscarTicketU">
            <thead>
              <tr>
                <th>ID</th>
                <th>Reportado por</th>
                <th>Título</th>
                <th>Descripción</th>
                <th className="col-fecha-buscarTicketU">Creación</th>
                <th className="col-fecha-buscarTicketU">Cierre</th>
                <th>Estado</th>
                <th className="col-tecnico-buscarTicketU">Técnico</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>Cargando tickets del sistema...</td></tr>
              ) : filtrados.length > 0 ? (
                filtrados.map((ticket) => (
                  <tr 
                    key={ticket.id_ticket} 
                    className="fila-ticket-buscarTicketU"
                    onDoubleClick={() => navigate_buscarTicketU(`/detalle-ticket/${ticket.id_ticket}`)} 
                  >
                    <td><strong>{ticket.id_ticket}</strong></td>
                    {/* Muestra el nombre del dueño del ticket */}
                    <td>{ticket.nombre_usuario}</td>
                    <td>{ticket.titulo}</td>
                    <td className="celda-descripcion">{ticket.descripcion}</td>
                    <td>{ticket.fecha}</td>
                    <td>{ticket.fechacierre}</td>
                    <td>
                      <span className={`estado-${ticket.estado}`}>
                        {ticket.estado}
                      </span>
                    </td>
                    <td>{ticket.tecnico || 'Sin asignar'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>
                    No se encontraron tickets que coincidan con "{busqueda}"
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

export default BuscarTicketU;