import React, { useState } from 'react';
import '../styles/buscarTicketU.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function BuscarTicketU() {
  const navigate_buscarTicketU = useNavigate();
  
  // 1. Datos de ejemplo (idénticos a la tabla anterior)
  const [tickets_buscarTicketU] = useState([
    { id: '101', nombre: 'Juan Pérez', titulo: 'Error de Login', descripcion: 'No reconoce la contraseña', fecha: '2026-03-10', fechaCierre: '2026-03-11', estado: 'Cerrado', tecnico: 'Carlos M.' },
    { id: '102', nombre: 'Ana García', titulo: 'Impresora', descripcion: 'Atasco de papel en bandeja 2', fecha: '2026-03-12', fechaCierre: '—', estado: 'Abierto', tecnico: 'Pendiente' },
    { id: '103', nombre: 'Luis Lopez', titulo: 'Software', descripcion: 'Instalacion de Office', fecha: '2026-03-15', fechaCierre: '2026-03-16', estado: 'Cerrado', tecnico: 'Ricardo H.' },
  ]);

  // 2. Estado para el buscador
  const [busqueda_buscarTicketU, setBusqueda_buscarTicketU] = useState('');

  // 3. Lógica de filtrado (Busca por ID principalmente como dice la imagen)
  const filtrados_buscarTicketU = tickets_buscarTicketU.filter((ticket) => {
    return ticket.id.toLowerCase().includes(busqueda_buscarTicketU.toLowerCase()) ||
           ticket.nombre.toLowerCase().includes(busqueda_buscarTicketU.toLowerCase());
  });

  return (
    <div className="container-buscarTicketU">
      <HeaderPU />

      <main className="contenido-buscarTicketU">
        {/* Sección del Buscador Centrado */}
        <div className="seccion-busqueda-buscarTicketU">
          <div className="info-busqueda-buscarTicketU">
            <span className="lupa-grande-buscarTicketU">🔍</span>
            <h2>Buscar ticket por numero de ID</h2>
          </div>
          <input 
            type="text" 
            className="input-redondeado-buscarTicketU"
            value={busqueda_buscarTicketU}
            onChange={(e) => setBusqueda_buscarTicketU(e.target.value)}
            placeholder="Introduce el ID..."
          />
        </div>

        {/* Tabla un poco más abajo */}
        <div className="tabla-wrapper-buscarTicketU">
          <table className="tabla-tickets-buscarTicketU">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Titulo</th>
                <th>Descripción</th>
                <th className="col-fecha-buscarTicketU">Fecha de creación</th>
                <th className="col-fecha-buscarTicketU">Fecha de cierre</th>
                <th>Estado</th>
                <th className="col-tecnico-buscarTicketU">Tecnico</th>
              </tr>
            </thead>
            <tbody>
              {filtrados_buscarTicketU.length > 0 ? (
                filtrados_buscarTicketU.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="fila-ticket-buscarTicketU"
                    onDoubleClick={() => navigate_buscarTicketU(`/detalle-ticket/${ticket.id}`)} 
                  >
                    <td>{ticket.id}</td>
                    <td>{ticket.nombre}</td>
                    <td>{ticket.titulo}</td>
                    <td>{ticket.descripcion}</td>
                    <td>{ticket.fecha}</td>
                    <td>{ticket.fechaCierre}</td>
                    <td>{ticket.estado}</td>
                    <td>{ticket.tecnico}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{textAlign: 'center'}}>No se encontraron tickets con ese ID</td>
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