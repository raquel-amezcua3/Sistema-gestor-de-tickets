//Esta pantalla es asignarAdmin.jsx y la de asignarAdmin.js
//Esta pantalla es para asignar tickets abiertos a los tecnicos
// ADMIN

import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import '../styles/asignarAdmin.css';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function AsignarAdmin() {
  const navigate_asignar_admin = useNavigate();

  const [tickets_asignar_admin, setTickets_asignar_admin] = useState([]);
  const [busqueda_asignar_admin, setBusqueda_asignar_admin] = useState('');
  const [soloAbiertos_asignar_admin, setSoloAbiertos_asignar_admin] = useState(false);

  const obtenerTickets = async () => {
    try {
      const response = await fetch('/api/asignar-admin/tickets-por-asignar');
      if (response.ok) {
        const data = await response.json();
        setTickets_asignar_admin(data);
      }
    } catch (error) {
      console.error("Error conectando al servidor:", error);
    }
  };

  useEffect(() => {
    obtenerTickets();
  }, []);

  const filtrados_asignar_admin = tickets_asignar_admin
    .filter((ticket) => {
      const coincide = 
        ticket.id.toString().includes(busqueda_asignar_admin) ||
        (ticket.nombre_usuario && ticket.nombre_usuario.toLowerCase().includes(busqueda_asignar_admin.toLowerCase())) ||
        (ticket.titulo_falla && ticket.titulo_falla.toLowerCase().includes(busqueda_asignar_admin.toLowerCase()));
      
      return soloAbiertos_asignar_admin ? (coincide && ticket.estado.toLowerCase() === 'abierto') : coincide;
    })
    .sort((a, b) => {
      if (a.estado.toLowerCase() === 'abierto' && b.estado.toLowerCase() !== 'abierto') return -1;
      if (a.estado.toLowerCase() !== 'abierto' && b.estado.toLowerCase() === 'abierto') return 1;
      return 0;
    });

  return (
    <div className="container-asignar-admin">
      <EncabezadoAdmin />

      <main className="contenido-asignar-admin">
        <div className="seccion-cabecera-asignar-admin">
          <h2 className="titulo-tabla-asignar-admin">Tabla de tickets pendientes a asignar</h2>
          
          <div className="controles-derecha-asignar-admin">
            <button 
              className={`btn-filtro-abiertos-admin ${soloAbiertos_asignar_admin ? 'activo' : ''}`}
              onClick={() => setSoloAbiertos_asignar_admin(!soloAbiertos_asignar_admin)}
            >
              {soloAbiertos_asignar_admin ? 'Ver todos' : 'Priorizar Abiertos'}
            </button>

            <div className="buscador-wrapper-asignar-admin">
              <input 
                type="text" 
                className="input-busqueda-asignar-admin"
                placeholder="Buscar ticket..."
                value={busqueda_asignar_admin}
                onChange={(e) => setBusqueda_asignar_admin(e.target.value)}
              />
              <span className="icono-lupa-asignar-admin">🔍</span>
            </div>
          </div>
        </div>

        <div className="tabla-wrapper-asignar-admin">
          <table className="tabla-tickets-asignar-admin">
            <thead>
              <tr>
                <th className="col-id-asignar-admin">ID</th>
                <th className="col-nombre-asignar-admin">Nombre</th>
                <th className="col-titulo-asignar-admin">Titulo</th>
                <th className="col-desc-asignar-admin">Descripción</th>
                <th className="col-fecha-asignar-admin">Fecha de creación</th>
                <th className="col-estado-asignar-admin">Estado</th>
                <th className="col-tecnico-asignar-admin">Tecnico</th>
              </tr>
            </thead>
            <tbody>
              {filtrados_asignar_admin.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  className="fila-ticket-asignar-admin"
                  onDoubleClick={() => navigate_asignar_admin(`/datosTicketAdmin/${ticket.id}`)}
                  title="Doble clic para ver detalles"
                >
                  <td>{ticket.id}</td>
                  <td>{ticket.nombre_usuario}</td>
                  <td>{ticket.titulo_falla}</td>
                  <td>{ticket.descripcion_falla}</td>
                  <td>{ticket.fecha}</td>
                  <td className={`estado-${ticket.estado.toLowerCase().replace(/\s+/g, '-')}-asignar-admin`}>
                    {ticket.estado}
                  </td>
                  <td>
                    {ticket.tecnico_nombre === 'Pendiente' || !ticket.tecnico_nombre ? (
                      <button 
                        className="btn-accion-asignar-admin"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate_asignar_admin(`/datosTicketAdmin/${ticket.id}`);
                        }}
                      >
                        Asignar
                      </button>
                    ) : (
                      <span className="nombre-tecnico-listo-admin">{ticket.tecnico_nombre}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtrados_asignar_admin.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    No hay tickets disponibles por ahora.
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

export default AsignarAdmin;