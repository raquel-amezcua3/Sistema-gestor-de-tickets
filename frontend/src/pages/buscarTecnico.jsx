import React, { useState, useEffect } from 'react';
import '../styles/buscarTecnico.css';
import { useNavigate } from 'react-router-dom';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function BuscarTecnico() {
  const navigate_buscar_ticket_tecnico = useNavigate();
  
  // 1. Estados para los datos reales
  const [tickets_buscar_ticket_tecnico, setTickets_buscar_ticket_tecnico] = useState([]);
  const [busqueda_buscar_ticket_tecnico, setBusqueda_buscar_ticket_tecnico] = useState('');

  // 2. Cargar todos los tickets al montar el componente
  useEffect(() => {
    const obtenerTicketsGlobales = async () => {
      try {
        // Usamos la ruta que ya definiste en el backend
        const response = await fetch('http://localhost:3000/admin/busqueda/todos-los-tickets');
        const data = await response.json();
        if (response.ok) {
          setTickets_buscar_ticket_tecnico(data);
        }
      } catch (error) {
        console.error("Error al obtener búsqueda global:", error);
      }
    };
    obtenerTicketsGlobales();
  }, []);

  // 3. Lógica de filtrado (Nombre o ID)
  // Nota: Ajustamos los nombres de campos según tu query SQL (nombre_usuario, nombre_tecnico, etc.)
  const filtrados_buscar_ticket_tecnico = tickets_buscar_ticket_tecnico.filter((ticket) => {
    const termino = busqueda_buscar_ticket_tecnico.toLowerCase();
    return (
      ticket.id.toString().includes(termino) ||
      ticket.nombre_usuario.toLowerCase().includes(termino) ||
      ticket.titulo.toLowerCase().includes(termino)
    );
  });

  // 4. Función para decidir navegación
  const manejarNavegacion = (ticket) => {
    // Verificamos si el estado es 'resuelto' (en minúsculas como quedamos)
    if (ticket.estado.toLowerCase() === 'resuelto' || ticket.estado.toLowerCase() === 'cerrado') {
      navigate_buscar_ticket_tecnico(`/datosResueltoTecnico/${ticket.id}`);
    } else {
      navigate_buscar_ticket_tecnico(`/datosTicketTecnico/${ticket.id}`);
    }
  };

  return (
    <div className="container-buscar-ticket-tecnico">
      <EncabezadoTecnico />

      <main className="contenido-buscar-ticket-tecnico">
        <div className="seccion-busqueda-buscar-ticket-tecnico">
          <div className="info-busqueda-buscar-ticket-tecnico">
            <span className="lupa-icono-buscar-ticket-tecnico">
              <img src="/img/lupa.png" alt="Buscar" className="imagen-lupa-estilo" />
            </span>
            <h2>Buscar ticket por número de ID o Nombre</h2>
          </div>
          <input 
            type="text" 
            className="input-redondeado-buscar-ticket-tecnico"
            value={busqueda_buscar_ticket_tecnico}
            onChange={(e) => setBusqueda_buscar_ticket_tecnico(e.target.value)}
            placeholder="Introduce el ID o nombre del usuario..."
          />
        </div>

        <div className="tabla-wrapper-buscar-ticket-tecnico">
          <table className="tabla-tickets-buscar-ticket-tecnico">
            <thead>
              <tr>
                <th className="col-id-buscar-ticket-tecnico">ID</th>
                <th className="col-nombre-buscar-ticket-tecnico">Nombre</th>
                <th className="col-titulo-buscar-ticket-tecnico">Titulo</th>
                <th className="col-desc-buscar-ticket-tecnico">Descripción</th>
                <th className="col-fecha-buscar-ticket-tecnico">Fecha de creación</th>
                <th className="col-fecha-buscar-ticket-tecnico">Fecha de cierre</th>
                <th className="col-estado-buscar-ticket-tecnico">Estado</th>
                <th className="col-tecnico-buscar-ticket-tecnico">Tecnico</th>
              </tr>
            </thead>
            <tbody>
              {filtrados_buscar_ticket_tecnico.length > 0 ? (
                filtrados_buscar_ticket_tecnico.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="fila-ticket-buscar-ticket-tecnico"
                    onDoubleClick={() => manejarNavegacion(ticket)} 
                    title="Doble clic para ver detalles"
                  >
                    <td>{ticket.id}</td>
                    <td>{ticket.nombre_usuario}</td>
                    <td>{ticket.titulo}</td>
                    <td>{ticket.descripcion}</td>
                    <td>{ticket.fecha}</td>
                    <td>{ticket.fecha_cierre}</td>
                    <td className={
                        ticket.estado.toLowerCase() === 'resuelto' || ticket.estado.toLowerCase() === 'cerrado' 
                        ? 'texto-verde-buscar' 
                        : 'texto-rojo-buscar'
                    }>
                      {ticket.estado}
                    </td>
                    <td>{ticket.nombre_tecnico}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="sin-resultados-buscar-ticket-tecnico">
                    No se encontraron tickets con esos criterios.
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

export default BuscarTecnico;