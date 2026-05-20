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
      
      // 🕵️‍♂️ Obtenemos directamente el id_base que tu Login guarda al 100%
      const idBase = localStorage.getItem('id_base');

      console.log("🔍 id_base enviado a la consulta:", idBase); 

      if (!idBase || idBase === 'undefined' || idBase === 'null') {
        console.error("❌ ERROR: No se encontró id_base en el LocalStorage.");
        return;
      }

      try {
        const urlBase = window.location.hostname === 'localhost' 
          ? 'http://localhost:3000' 
          : 'https://sistema-tarelix.onrender.com';

        const url = `${urlBase}/api/tecnico/tickets/resueltos/${idBase}`;
        console.log("📡 Enviando petición a:", url);

        const response = await fetch(url);
        const data = await response.json();
        
        console.log("📦 Datos inyectados en la tabla:", data); 

        if (response.ok) {
          setTickets_resuelto_tecnico(data);
        } else {
          console.error("Error en respuesta del servidor:", data.error);
        }
      } catch (error) {
        console.error("Error crítico en el FETCH de resueltos:", error);
      }
    };

    cargarTicketsResueltos();
  }, []);

  // 2. Lógica de filtrado para la barra de búsqueda superior
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