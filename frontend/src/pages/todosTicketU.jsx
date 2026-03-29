import React, { useState } from 'react';
import '../styles/todosTicketU.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function TodosTicketU() {
  const navigate_todosTickettU = useNavigate();
  
  // 1. Datos de ejemplo con la nueva columna "fechaCierre"
  const [tickets_todosTickettU] = useState([
    { id: '101', nombre: 'Juan Pérez', titulo: 'Error de Login', descripcion: 'No reconoce la contraseña', fecha: '2026-03-10', fechaCierre: '2026-03-11', estado: 'Cerrado', tecnico: 'Carlos M.' },
    { id: '102', nombre: 'Ana García', titulo: 'Impresora', descripcion: 'Atasco de papel en bandeja 2', fecha: '2026-03-12', fechaCierre: '—', estado: 'Abierto', tecnico: 'Pendiente' },
    { id: '103', nombre: 'Luis Lopez', titulo: 'Software', descripcion: 'Instalacion de Office', fecha: '2026-03-15', fechaCierre: '2026-03-16', estado: 'Cerrado', tecnico: 'Ricardo H.' },
  ]);

  // 2. Estado para el buscador
  const [busqueda_todosTickettU, setBusqueda_todosTickettU] = useState('');

  // 3. Lógica de filtrado
  const filtrados_todosTickettU = tickets_todosTickettU.filter((ticket) => {
    return Object.values(ticket).some((valor) =>
      valor.toString().toLowerCase().includes(busqueda_todosTickettU.toLowerCase())
    );
  });

  return (
    <div className="container-todosTickettU">
      <HeaderPU />

      <main className="contenido-tabla-todosTickettU">
        <div className="encabezado-flex-todosTickettU">
          <h2 className='titulo-todosTickettU'>Tabla de todos los tickets</h2>
          
          <div className="buscador-contenedor-todosTickettU">
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={busqueda_todosTickettU}
              onChange={(e) => setBusqueda_todosTickettU(e.target.value)}
            />
            <span className="icono-lupa-todosTickettU">🔍</span>
          </div>
        </div>

        <div className="tabla-wrapper-todosTickettU">
          <table className="tabla-tickets-todosTickettU">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Titulo</th>
                <th>Descripción</th>
                <th className="col-fecha-todosTickettU">Fecha de creación</th>
                <th className="col-fecha-todosTickettU">Fecha de cierre</th> {/* Nueva Columna */}
                <th>Estado</th>
                <th className="col-tecnico-todosTickettU">Tecnico</th>
              </tr>
            </thead>
            <tbody>
              {filtrados_todosTickettU.length > 0 ? (
                filtrados_todosTickettU.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="fila-ticket-todosTickettU"
                    onDoubleClick={() => navigate_todosTickettU(`/detalle-ticket/${ticket.id}`)} 
                  >
                    <td>{ticket.id}</td>
                    <td>{ticket.nombre}</td>
                    <td>{ticket.titulo}</td>
                    <td>{ticket.descripcion}</td>
                    <td>{ticket.fecha}</td>
                    <td>{ticket.fechaCierre}</td> {/* Dato Nueva Columna */}
                    <td>{ticket.estado}</td>
                    <td>{ticket.tecnico}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{textAlign: 'center'}}>No se encontraron resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default TodosTicketU;