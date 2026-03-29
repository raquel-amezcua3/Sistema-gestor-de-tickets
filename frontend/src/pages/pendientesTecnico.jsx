import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pendientesTecnico.css';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function PendientesTecnico() {
  const navigate_pendientes_tecnico = useNavigate();
  
  // 1. Datos de ejemplo para el técnico (simulando tickets asignados a ti)
  const [tickets_pendientes_tecnico] = useState([
    { id: '101', nombre: 'Juan Pérez', titulo: 'Error de Login', descripcion: 'No reconoce la contraseña', fecha: '2026-03-10', estado: 'Abierto', tecnico: 'Fernando Contreras' },
    { id: '102', nombre: 'Ana García', titulo: 'Impresora', descripcion: 'Atasco de papel en bandeja 2', fecha: '2026-03-12', estado: 'Abierto', tecnico: 'Fernando Contreras' },
    { id: '104', nombre: 'Maria Sol', titulo: 'Red', descripcion: 'Sin internet en oficina 4', fecha: '2026-03-18', estado: 'Abierto', tecnico: 'Fernando Contreras' },
  ]);

  // 2. Estado para el buscador
  const [busqueda_pendientes_tecnico, setBusqueda_pendientes_tecnico] = useState('');

  // 3. Lógica de filtrado por cualquier campo
  const filtrados_pendientes_tecnico = tickets_pendientes_tecnico.filter((ticket) => {
    return Object.values(ticket).some((valor) =>
      valor.toString().toLowerCase().includes(busqueda_pendientes_tecnico.toLowerCase())
    );
  });

  return (
    <div className="container-pendientes-tecnico">
      <EncabezadoTecnico />

      <main className="contenido-tabla-pendientes-tecnico">
        <div className="encabezado-flex-pendientes-tecnico">
          <h2 className="titulo-pendientes-tecnico">Mis tickets pendientes de resolver</h2>
          
          <div className="buscador-contenedor-pendientes-tecnico">
            <input 
              type="text" 
              placeholder="Buscar ticket..." 
              value={busqueda_pendientes_tecnico}
              onChange={(e) => setBusqueda_pendientes_tecnico(e.target.value)}
            />
            <span className="icono-lupa-pendientes-tecnico">🔍</span>
          </div>
        </div>

        <div className="tabla-wrapper-pendientes-tecnico">
          <table className="tabla-tickets-pendientes-tecnico">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Titulo</th>
                <th>Descripción</th>
                <th className="col-fecha-pendientes-tecnico">Fecha de creación</th>
                <th>Estado</th>
                <th className="col-tecnico-pendientes-tecnico">Tecnico</th>
              </tr>
            </thead>
            <tbody>
              {filtrados_pendientes_tecnico.length > 0 ? (
                filtrados_pendientes_tecnico.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="fila-ticket-pendientes-tecnico"
                    // Al hacer doble clic, navega a la pantalla de gestión del técnico usando el ID
                    onDoubleClick={() => navigate_pendientes_tecnico(`/datosTicketTecnico/${ticket.id}`)} 
                    title="Doble clic para gestionar este ticket"
                  >
                    <td>{ticket.id}</td>
                    <td>{ticket.nombre}</td>
                    <td>{ticket.titulo}</td>
                    <td>{ticket.descripcion}</td>
                    <td>{ticket.fecha}</td>
                    <td className="estado-abierto-pendientes-tecnico">{ticket.estado}</td>
                    <td>{ticket.tecnico}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="sin-resultados-pendientes-tecnico">
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

export default PendientesTecnico;