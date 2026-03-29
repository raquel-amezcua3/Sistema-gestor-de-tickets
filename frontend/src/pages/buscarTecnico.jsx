import React, { useState } from 'react';
import '../styles/buscarTecnico.css';
import { useNavigate } from 'react-router-dom';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function BuscarTecnico() {
  const navigate_buscar_ticket_tecnico = useNavigate();
  
  // 1. Datos de ejemplo globales para la búsqueda
  const [tickets_buscar_ticket_tecnico] = useState([
    { id: '101', nombre: 'Juan Pérez', titulo: 'Error de Login', descripcion: 'No reconoce la contraseña', fecha: '2026-03-10', fechaCierre: '2026-03-11', estado: 'Cerrado', tecnico: 'Fernando Contreras' },
    { id: '102', nombre: 'Ana García', titulo: 'Impresora', descripcion: 'Atasco de papel en bandeja 2', fecha: '2026-03-12', fechaCierre: '—', estado: 'En proceso', tecnico: 'Raquel Amezcua' },
    { id: '103', nombre: 'Luis Lopez', titulo: 'Software', descripcion: 'Instalacion de Office', fecha: '2026-03-15', fechaCierre: '2026-03-16', estado: 'Cerrado', tecnico: 'Fernando Contreras' },
    { id: '104', nombre: 'Maria Sol', titulo: 'Red', descripcion: 'Sin internet en oficina 4', fecha: '2026-03-18', fechaCierre: '—', estado: 'Abierto', tecnico: 'Pendiente' },
  ]);

  // 2. Estado para el buscador
  const [busqueda_buscar_ticket_tecnico, setBusqueda_buscar_ticket_tecnico] = useState('');

  // 3. Lógica de filtrado por ID o Nombre
  const filtrados_buscar_ticket_tecnico = tickets_buscar_ticket_tecnico.filter((ticket) => {
    return ticket.id.toLowerCase().includes(busqueda_buscar_ticket_tecnico.toLowerCase()) ||
           ticket.nombre.toLowerCase().includes(busqueda_buscar_ticket_tecnico.toLowerCase());
  });

  // Función para decidir a qué pantalla navegar según el estado del ticket
  const manejarNavegacion = (ticket) => {
    if (ticket.estado === 'Cerrado') {
      navigate_buscar_ticket_tecnico(`/datosResueltoTecnico/${ticket.id}`);
    } else {
      navigate_buscar_ticket_tecnico(`/datosTicketTecnico/${ticket.id}`);
    }
  };

  return (
    <div className="container-buscar-ticket-tecnico">
      <EncabezadoTecnico />

      <main className="contenido-buscar-ticket-tecnico">
        {/* Sección del Buscador */}
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

        {/* Tabla de Tickets */}
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
                    <td>{ticket.nombre}</td>
                    <td>{ticket.titulo}</td>
                    <td>{ticket.descripcion}</td>
                    <td>{ticket.fecha}</td>
                    <td>{ticket.fechaCierre}</td>
                    <td className={ticket.estado === 'Cerrado' ? 'texto-verde-buscar' : 'texto-rojo-buscar'}>
                      {ticket.estado}
                    </td>
                    <td>{ticket.tecnico}</td>
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