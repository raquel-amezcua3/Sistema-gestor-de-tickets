import React, { useState, useEffect } from 'react'; 
import '../styles/todosTicketU.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function TodosTicketU() {
  const navigate_todosTickettU = useNavigate();
  
  // 1. Ahora empezamos con un array vacío
  const [tickets_todosTickettU, setTickets_todosTickettU] = useState([]);
  const [busqueda_todosTickettU, setBusqueda_todosTickettU] = useState('');

  // 2. Lógica para traer los datos del Backend
  useEffect(() => {
    const obtenerTickets = async () => {
      const id_usuario = localStorage.getItem('id_usuario'); // Recuperamos el ID del que inició sesión
      
      if (!id_usuario) {
        console.error("No se encontró el ID del usuario");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/mis-tickets/${id_usuario}`);
        const data = await response.json();
        
        if (response.ok) {
          setTickets_todosTickettU(data); // Guardamos los tickets reales en el estado
        } else {
          console.error("Error al obtener tickets:", data.error);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };

    obtenerTickets();
  }, []); // Se ejecuta solo una vez al cargar el componente

  // 3. Lógica de filtrado (se mantiene igual, pero adaptada a los nombres de tu BD)
  const filtrados_todosTickettU = tickets_todosTickettU.filter((ticket) => {
    return (
      ticket.id_ticket?.toString().toLowerCase().includes(busqueda_todosTickettU.toLowerCase()) ||
      ticket.titulo?.toLowerCase().includes(busqueda_todosTickettU.toLowerCase()) ||
      ticket.estado?.toLowerCase().includes(busqueda_todosTickettU.toLowerCase())
    );
  });

  return (
    <div className="container-todosTickettU">
      <HeaderPU />

      <main className="contenido-tabla-todosTickettU">
        <div className="encabezado-flex-todosTickettU">
          <h2 className='titulo-todosTickettU'>Mis Tickets Reportados</h2>
          
          <div className="buscador-contenedor-todosTickettU">
            <input 
              type="text" 
              placeholder="Buscar por título o estado..." 
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
                <th>Título</th>
                <th>Descripción</th>
                <th className="col-fecha-todosTickettU">Fecha Creación</th>
                <th className="col-fecha-todosTickettU">Fecha Cierre</th>
                <th>Estado</th>
                <th className="col-tecnico-todosTickettU">Técnico</th>
              </tr>
            </thead>
            <tbody>
              {filtrados_todosTickettU.length > 0 ? (
                filtrados_todosTickettU.map((ticket) => (
                  <tr 
                    key={ticket.id_ticket} 
                    className="fila-ticket-todosTickettU"
                    onDoubleClick={() => navigate_todosTickettU(`/detalle-ticket/${ticket.id_ticket}`)} 
                  >
                    <td>{ticket.id_ticket}</td>
                    {/* El nombre lo tomamos del localStorage ya que son sus propios tickets */}
                    <td>{localStorage.getItem('usuarioNombre')}</td>
                    <td>{ticket.titulo}</td>
                    <td className="celda-descripcion">{ticket.descripcion}</td>
                    <td>{ticket.fecha}</td>
                    <td>{ticket.fechacierre}</td> 
                    <td>
                      <span className={`estado-${ticket.estado}`}>
                        {ticket.estado}
                      </span>
                    </td>
                    <td>{ticket.tecnico || 'Pendiente'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>
                    No tienes tickets registrados aún.
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

export default TodosTicketU;