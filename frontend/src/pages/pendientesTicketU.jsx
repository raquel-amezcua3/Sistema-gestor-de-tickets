//El .js de esta pantalla es el de ticketsPendientes.js
import React, { useState, useEffect } from 'react';
import '../styles/pendientesTicketU.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function PendientesTicketU() {
  const navigate = useNavigate();
  
  // Estados para los datos reales
  const [tickets, setTickets] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  // Cargar tickets pendientes al montar el componente
// Cargar tickets pendientes al montar el componente
  useEffect(() => {
    const obtenerPendientes = async () => {
      // 🔥 CORREGIDO: Búsqueda en cascada inteligente usando id_base
      const id_usuario = localStorage.getItem('id_base') || localStorage.getItem('id_usuario') || localStorage.getItem('id');
      
      // Validamos que el ID exista y no sea una palabra corrupta de texto
      if (!id_usuario || id_usuario === 'undefined' || id_usuario === 'null') {
        console.error("No se encontró un ID válido en el storage");
        setCargando(false);
        return;
      }

      try {
        const response = await fetch(`/api/tickets-pendientes/${id_usuario}`);
        const data = await response.json();
        
        if (response.ok) {
          setTickets(data);
        } else {
          console.error("Error del servidor:", data.error);
        }
      } catch (error) {
        console.error("Error de conexión al backend:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerPendientes();
  }, []);

  // Función auxiliar para recortar texto a lo que quepa visualmente
  const recortarTexto = (texto, maximo = 45) => {
    if (!texto) return "";
    return texto.length > maximo ? texto.substring(0, maximo) + "..." : texto;
  };

  // Lógica de filtrado para el buscador (ID o Título)
  const ticketsFiltrados = tickets.filter((ticket) => {
    const idStr = ticket.id_ticket?.toString() || "";
    const tituloStr = ticket.titulo?.toLowerCase() || "";
    const termino = busqueda.toLowerCase();

    return idStr.includes(termino) || tituloStr.includes(termino);
  });

  return (
    <div className="container-pendientesTU">
      <HeaderPU />

      <main className="contenido-tabla">
        <div className="encabezado-tabla-flex">
          <h2 className='titulo-pendientesTU'>Mis Tickets Pendientes</h2>
          
          <div className="buscador-contenedor">
            <input 
              type="text" 
              placeholder="Buscar por ID o título..." 
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
                <th>Título</th>
                <th>Descripción</th>
                <th className="col-fecha">Fecha de creación</th>
                <th>Estado</th>
                <th className="col-tecnico">Técnico</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    Cargando tickets pendientes...
                  </td>
                </tr>
              ) : ticketsFiltrados.length > 0 ? (
                ticketsFiltrados.map((ticket) => (
                  <tr 
                    key={ticket.id_ticket} 
                    className="fila-ticket"
                    onDoubleClick={() => navigate(`/detalle-ticket/${ticket.id_ticket}`)} 
                  >
                    <td>{ticket.id_ticket}</td>
                    <td>{localStorage.getItem('usuarioNombre') || 'Prueba'}</td>
                    {/* Aplicamos recorte visual preventivo */}
                    <td title={ticket.titulo}>{recortarTexto(ticket.titulo, 30)}</td>
                    <td title={ticket.descripcion}>{recortarTexto(ticket.descripcion, 45)}</td>
                    <td>{ticket.fecha}</td>
                    <td>
                      <span className={`estado-badge ${ticket.estado ? ticket.estado.toLowerCase().replace(" ", "-") : "abierto"}`}>
                        {ticket.estado}
                      </span>
                    </td>
                    <td>{ticket.tecnico}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    {busqueda ? `No hay coincidencias para "${busqueda}"` : "No tienes tickets pendientes actualmente."}
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

export default PendientesTicketU;