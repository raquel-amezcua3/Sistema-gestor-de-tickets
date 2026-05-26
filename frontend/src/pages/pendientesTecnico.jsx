// El .js de esta pantalla es el de ticketsPendientes.js
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
        // Obtenemos los posibles identificadores del storage para máxima compatibilidad
        const idTecnico = localStorage.getItem('id_tecnico');
        const idBase = localStorage.getItem('id_base');
        const idUsuario = localStorage.getItem('id_usuario');
        const idGenerico = localStorage.getItem('id');
        
        const idIdentificador = idBase || idTecnico || idUsuario || idGenerico;
        
        if (!idIdentificador || idIdentificador === 'undefined' || idIdentificador === 'null') {
          console.error("❌ No se encontró un ID válido para el técnico en el localStorage");
          setCargando(false);
          return;
        }

        console.log("Consultando tickets pendientes para el ID:", idIdentificador);

        // 🔥 SOLUCIÓN PRODUCCIÓN: Detecta la URL del Backend dinámicamente
        const API_URL = import.meta.env?.VITE_API_URL || process.env?.REACT_APP_API_URL || '';
        
        // Si estás en producción, usará la URL de Render; si estás en local, usará la ruta relativa con el proxy
        const response = await fetch(`${API_URL}/api/tickets-pendientes/${idIdentificador}`);
        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          const dataFormateada = data.map(t => ({
            id: t.id_ticket ? t.id_ticket.toString() : '',
            nombre: t.nombre_usuario || 'Usuario Sistema', 
            titulo: t.titulo || 'Sin título',
            descripcion: t.descripcion || 'Sin descripción',
            fecha: t.fecha || '—',
            estado: t.estado || 'Abierto',
            tecnico: t.tecnico || 'Sin asignar'
          }));
          setTickets_pendientes_tecnico(dataFormateada);
        } else {
          setTickets_pendientes_tecnico([]);
        }
      } catch (error) {
        console.error("❌ Error al conectar con el servidor:", error);
        setTickets_pendientes_tecnico([]);
      } finally {
        setCargando(false);
      }
    };

    obtenerTicketsPendientes();
  }, []);

  const filtrados_pendientes_tecnico = tickets_pendientes_tecnico.filter((ticket) => {
    return Object.values(ticket).some((valor) =>
      valor ? valor.toString().toLowerCase().includes(busqueda_pendientes_tecnico.toLowerCase()) : false
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
                <th>Usuario</th>
                <th>Título</th>
                <th>Descripción</th>
                <th className="col-fecha-pendientes-tecnico">Fecha de creación</th>
                <th>Estado</th>
                <th className="col-tecnico-pendientes-tecnico">Técnico</th>
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
                    style={{ cursor: 'pointer' }}
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
                    No tienes tickets pendientes actualmente.
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