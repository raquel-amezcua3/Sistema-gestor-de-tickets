import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/resueltoTecnico.css';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function ResueltoTecnico() {
  const navigate_resuelto_tecnico = useNavigate();
  
  // 1. Datos de ejemplo para tickets ya finalizados
  const [tickets_resuelto_tecnico] = useState([
    { id: '101', nombre: 'Juan Pérez', titulo: 'Error de Login', descripcion: 'No reconoce la contraseña', fecha: '2026-03-10', fechaCierre: '2026-03-11', estado: 'Cerrado', tecnico: 'Fernando Contreras' },
    { id: '103', nombre: 'Carlos Ruiz', titulo: 'Software', descripcion: 'Instalación de Office', fecha: '2026-03-15', fechaCierre: '2026-03-16', estado: 'Cerrado', tecnico: 'Fernando Contreras' },
  ]);

  // 2. Estado para el buscador
  const [busqueda_resuelto_tecnico, setBusqueda_resuelto_tecnico] = useState('');

  // 3. Lógica de filtrado
  const filtrados_resuelto_tecnico = tickets_resuelto_tecnico.filter((ticket) => {
    return Object.values(ticket).some((valor) =>
      valor.toString().toLowerCase().includes(busqueda_resuelto_tecnico.toLowerCase())
    );
  });

  return (
    <div className="container-resuelto-tecnico">
      <EncabezadoTecnico />

      <main className="contenido-tabla-resuelto-tecnico">
        <div className="encabezado-flex-resuelto-tecnico">
          <h2 className="titulo-resuelto-tecnico">Mis tickets resueltos</h2>
          
          <div className="buscador-contenedor-resuelto-tecnico">
            <input 
              type="text" 
              placeholder="Buscar ticket resuelto..." 
              value={busqueda_resuelto_tecnico}
              onChange={(e) => setBusqueda_resuelto_tecnico(e.target.value)}
            />
            <span className="icono-lupa-resuelto-tecnico">🔍</span>
          </div>
        </div>

        <div className="tabla-wrapper-resuelto-tecnico">
          <table className="tabla-tickets-resuelto-tecnico">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Titulo</th>
                <th>Descripción</th>
                <th className="col-fecha-resuelto-tecnico">Fecha de creación</th>
                <th className="col-fecha-resuelto-tecnico">Fecha de cierre</th>
                <th>Estado</th>
                <th className="col-tecnico-resuelto-tecnico">Tecnico</th>
              </tr>
            </thead>
            <tbody>
              {filtrados_resuelto_tecnico.length > 0 ? (
                filtrados_resuelto_tecnico.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="fila-ticket-resuelto-tecnico"
                    onDoubleClick={() => navigate_resuelto_tecnico(`/datosResueltoTecnico/${ticket.id}`)} 
                  >
                    <td>{ticket.id}</td>
                    <td>{ticket.nombre}</td>
                    <td>{ticket.titulo}</td>
                    <td>{ticket.descripcion}</td>
                    <td>{ticket.fecha}</td>
                    <td>{ticket.fechaCierre}</td>
                    <td className="estado-cerrado-resuelto-tecnico">{ticket.estado}</td>
                    <td>{ticket.tecnico}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="sin-resultados-resuelto-tecnico">
                    No se encontraron tickets resueltos.
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

export default ResueltoTecnico;