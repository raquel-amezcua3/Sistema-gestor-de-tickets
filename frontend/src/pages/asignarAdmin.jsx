import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/asignarAdmin.css';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function AsignarAdmin() {
  const navigate_asignar_admin = useNavigate();

  // Datos de ejemplo basados en las vistas de administrador
  const [tickets_asignar_admin] = useState([
    { id: '101', nombre: 'Juan Pérez', titulo: 'Error de Login', descripcion: 'No reconoce la contraseña', fecha: '2026-03-10', fechaCierre: '2026-03-11', estado: 'Cerrado', tecnico: 'Carlos M.' },
    { id: '102', nombre: 'Ana García', titulo: 'Impresora', descripcion: 'Atasco de papel en bandeja 2', fecha: '2026-03-12', fechaCierre: '—', estado: 'Abierto', tecnico: 'Pendiente' },
    { id: '103', nombre: 'Luis Lopez', titulo: 'Software', descripcion: 'Instalacion de Office', fecha: '2026-03-15', fechaCierre: '2026-03-16', estado: 'Cerrado', tecnico: 'Ricardo H.' },
    { id: '104', nombre: 'Maria Sol', titulo: 'Red', descripcion: 'Sin internet en oficina 4', fecha: '2026-03-18', fechaCierre: '—', estado: 'Abierto', tecnico: 'Pendiente' },
  ]);

  const [busqueda_asignar_admin, setBusqueda_asignar_admin] = useState('');
  const [soloAbiertos_asignar_admin, setSoloAbiertos_asignar_admin] = useState(false);

  // Lógica de filtrado y ordenamiento (Abiertos arriba)
  const filtrados_asignar_admin = tickets_asignar_admin
    .filter((ticket) => {
      const coincide = ticket.id.toLowerCase().includes(busqueda_asignar_admin.toLowerCase()) ||
                       ticket.nombre.toLowerCase().includes(busqueda_asignar_admin.toLowerCase());
      return soloAbiertos_asignar_admin ? (coincide && ticket.estado === 'Abierto') : coincide;
    })
    .sort((a, b) => {
      if (a.estado === 'Abierto' && b.estado !== 'Abierto') return -1;
      if (a.estado !== 'Abierto' && b.estado === 'Abierto') return 1;
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
                    {ticket.tecnico === 'Pendiente' ? (
                      <button 
                        className="btn-accion-asignar-admin"
                        onClick={(e) => {
                          e.stopPropagation(); // Evita que el click simple interfiera con el double click
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
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AsignarAdmin;