import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pendientesTecnico.css';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function PendientesTecnico() {
  const navigate_pendientes_tecnico = useNavigate();
  
  const [tickets_pendientes_tecnico, setTickets_pendientes_tecnico] = useState([]);
  const [busqueda_pendientes_tecnico, setBusqueda_pendientes_tecnico] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerTicketsPendientes = async () => {
      try {
        const idTecnico = localStorage.getItem('id_usuario');
        
        if (!idTecnico) {
          console.error("No se encontró el ID del técnico en el localStorage");
          return;
        }

        // Usamos la variable idTecnico en la URL
        const response = await fetch(`/api/tecnico/tickets/pendientes/${idTecnico}`);
        const data = await response.json();

        if (response.ok) {
          const dataFormateada = data.map(t => ({
            id: t.id.toString(),
            nombre: t.nombre_usuario,
            titulo: t.titulo,
            descripcion: t.descripcion,
            fecha: t.fecha,
            estado: t.estado,
            tecnico: t.nombre_tecnico
          }));
          setTickets_pendientes_tecnico(dataFormateada);
        }
      } catch (error) {
        console.error("Error al conectar con el servidor:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerTicketsPendientes();
  }, []);

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
              {cargando ? (
                <tr><td colSpan="7" className="sin-resultados-pendientes-tecnico">Cargando tickets...</td></tr>
              ) : filtrados_pendientes_tecnico.length > 0 ? (
                filtrados_pendientes_tecnico.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="fila-ticket-pendientes-tecnico"
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
                    No tienes tickets en proceso actualmente.
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