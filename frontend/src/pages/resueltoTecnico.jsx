import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/resueltoTecnico.css';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function ResueltoTecnico() {
  const navigate_resuelto_tecnico = useNavigate();
  const [tickets_resuelto_tecnico, setTickets_resuelto_tecnico] = useState([]);
  const [busqueda_resuelto_tecnico, setBusqueda_resuelto_tecnico] = useState('');

  // 1. Cargar datos reales del backend
useEffect(() => {
    const cargarTicketsResueltos = async () => {
      const idTecnico = localStorage.getItem('id_usuario'); 
      console.log("1. ID del técnico recuperado:", idTecnico); 

      if (!idTecnico) {
        console.error("ERROR: No hay id_usuario en el almacenamiento");
        return;
      }

      try {
        const url = `http://localhost:3000/tecnico/tickets/resueltos/${idTecnico}`;
        console.log("2. Llamando a la URL:", url);

        const response = await fetch(url);
        const data = await response.json();
        
        console.log("3. Respuesta completa del servidor:", data); // DEBE APARECER TU LISTA DE TICKETS

        if (response.ok) {
          setTickets_resuelto_tecnico(data);
        }
      } catch (error) {
        console.error("4. Error en el FETCH:", error);
      }
    };

    cargarTicketsResueltos();
  }, []);

  // 2. Lógica de filtrado para el buscador
  const filtrados_resuelto_tecnico = tickets_resuelto_tecnico.filter((ticket) => {
    return (
      ticket.id.toString().includes(busqueda_resuelto_tecnico.toLowerCase()) ||
      ticket.nombre.toLowerCase().includes(busqueda_resuelto_tecnico.toLowerCase()) ||
      ticket.titulo.toLowerCase().includes(busqueda_resuelto_tecnico.toLowerCase())
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
                    <td>{ticket.fechacierre}</td>
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