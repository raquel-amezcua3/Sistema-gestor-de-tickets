import React, { useState } from 'react';
import '../styles/pendientesTicketU.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';
import DetalleTicketU from './detalleTicketU';

function PendientesTicketU() {
  const navigate = useNavigate();
  
  // 1. Datos de ejemplo (Estado siempre "Abierto")
  const [tickets] = useState([
    { id: '101', nombre: 'Juan Pérez', titulo: 'Error de Login', descripcion: 'No reconoce la contraseña', fecha: '2026-03-10', estado: 'Abierto', tecnico: 'Carlos M.' },
    { id: '102', nombre: 'Ana García', titulo: 'Impresora', descripcion: 'Atasco de papel en bandeja 2', fecha: '2026-03-12', estado: 'Abierto', tecnico: 'Pendiente' },
    { id: '103', nombre: 'Luis Lopez', titulo: 'Software', descripcion: 'Instalacion de Office', fecha: '2026-03-15', estado: 'Abierto', tecnico: 'Ricardo H.' },
  ]);

  // 2. Estado para el buscador
  const [busqueda, setBusqueda] = useState('');

  // 3. Lógica de filtrado por todos los campos
  const ticketsFiltrados = tickets.filter((ticket) => {
    return Object.values(ticket).some((valor) =>
      valor.toString().toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  return (
    <div className="container-pendientesTU">
      <HeaderPU />

      <main className="contenido-tabla">
        <div className="encabezado-tabla-flex">
          <h2 className='titulo-pendientesTU'>Tabla de tickets pendientes</h2>
          
          {/* Contenedor del Buscador */}
          <div className="buscador-contenedor">
            <input 
              type="text" 
              placeholder="Buscar..." 
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
                <th>Titulo</th>
                <th>Descripción</th>
                <th className="col-fecha">Fecha de creación</th> {/* Columna pequeña */}
                <th>Estado</th>
                <th className="col-tecnico">Tecnico</th>        {/* Columna larga */}
              </tr>
            </thead>
            <tbody>
              {ticketsFiltrados.length > 0 ? (
                ticketsFiltrados.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="fila-ticket"
                    onDoubleClick={() => navigate(`/detalle-ticket/${ticket.id}`)} 
                  >
                    <td>{ticket.id}</td>
                    <td>{ticket.nombre}</td>
                    <td>{ticket.titulo}</td>
                    <td>{ticket.descripcion}</td>
                    <td>{ticket.fecha}</td>
                    <td>{ticket.estado}</td>
                    <td>{ticket.tecnico}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center'}}>No se encontraron resultados</td>
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