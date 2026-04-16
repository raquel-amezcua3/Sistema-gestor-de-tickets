import React, { useState, useEffect } from 'react'; // Agregamos useEffect
import { useNavigate } from 'react-router-dom';
import '../styles/asignarAdmin.css';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function AsignarAdmin() {
  const navigate_asignar_admin = useNavigate();

  // Ahora el estado inicial es un array vacío que se llenará desde la DB
  const [tickets_asignar_admin, setTickets_asignar_admin] = useState([]);
  const [busqueda_asignar_admin, setBusqueda_asignar_admin] = useState('');
  const [soloAbiertos_asignar_admin, setSoloAbiertos_asignar_admin] = useState(false);

  // Funcion para treaer los tickets
  const obtenerTickets = async () => {
    try {
      const response = await fetch('http://localhost:3000/admin/tickets-por-asignar');
      if (response.ok) {
        const data = await response.json();
        setTickets_asignar_admin(data);
      }
    } catch (error) {
      console.error("Error conectando al servidor:", error);
    }
  };

  // Se ejecuta una sola vez al cargar la pantalla
  useEffect(() => {
    obtenerTickets();
  }, []);

  // Lógica de filtrado
  const filtrados_asignar_admin = tickets_asignar_admin
    .filter((ticket) => {
      const coincide = 
        ticket.id.toString().includes(busqueda_asignar_admin) ||
        ticket.nombre.toLowerCase().includes(busqueda_asignar_admin.toLowerCase());
      
      // Filtramos por 'abierto' 
      return soloAbiertos_asignar_admin ? (coincide && ticket.estado === 'abierto') : coincide;
    })
    .sort((a, b) => {
      if (a.estado === 'abierto' && b.estado !== 'abierto') return -1;
      if (a.estado !== 'abierto' && b.estado === 'abierto') return 1;
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
                <th className="col-fecha-asignar-admin">Fecha de cierre</th>
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
                  <td>{ticket.nombre}</td>
                  <td>{ticket.titulo}</td>
                  <td>{ticket.descripcion}</td>
                  <td>{ticket.fecha}</td>
                  <td>{ticket.fechaCierre}</td>
                  <td className={`estado-${ticket.estado.toLowerCase()}-asignar-admin`}>
                    {ticket.estado}
                  </td>
                  <td>
                    {/* Si el técnico es 'Pendiente' o nulo, mostrare un botón */}
                    {ticket.tecnico === 'Pendiente' || !ticket.tecnico ? (
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
                      <span className="nombre-tecnico-listo-admin">{ticket.tecnico}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtrados_asignar_admin.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
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