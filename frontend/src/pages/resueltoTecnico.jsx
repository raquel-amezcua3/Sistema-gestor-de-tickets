//El .js de esta pantalla es ticketsTecnico.js
// ResueltoTecnico.jsx
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
      const idTecnico = localStorage.getItem('id_base') || localStorage.getItem('id_usuario') || localStorage.getItem('id'); 
      console.log("1. ID del técnico recuperado con éxito:", idTecnico); 

      if (!idTecnico || idTecnico === 'undefined' || idTecnico === 'null') {
        console.error("ERROR: No hay una sesión o ID técnico válido en el almacenamiento");
        return;
      }

      try {
        const url = `http://localhost:3000/api/tecnico/tickets/resueltos/${idTecnico}`;
        console.log("2. Llamando a la URL:", url);

        const response = await fetch(url);
        const data = await response.json();
        
        console.log("3. Respuesta completa del servidor:", data); 

        if (response.ok) {
          setTickets_resuelto_tecnico(data);
        }
      } catch (error) {
        console.error("4. Error en el FETCH de resueltos:", error);
      }
    };

    cargarTicketsResueltos();
  }, []);

  // 2. Lógica de filtrado
  const filtrados_resuelto_tecnico = tickets_resuelto_tecnico.filter((ticket) => {
    const idStr = ticket.id ? ticket.id.toString().toLowerCase() : '';
    const nombreStr = ticket.nombre ? ticket.nombre.toLowerCase() : '';
    const tituloStr = ticket.titulo ? ticket.titulo.toLowerCase() : '';
    const query = busqueda_resuelto_tecnico.toLowerCase();

    return idStr.includes(query) || nombreStr.includes(query) || tituloStr.includes(query);
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
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{ticket.id}</td>
                    <td>{ticket.nombre}</td>
                    <td>{ticket.titulo}</td>
                    <td>{ticket.descripcion}</td>
                    <td>{ticket.fecha}</td>
                    {/* 🔑 CORREGIDO: Mapeo seguro para capturar la fecha sin importar el formato del alias */}
                    <td>{ticket.fecha_cierre || ticket.fechacierre || 'Sin registrar'}</td>
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