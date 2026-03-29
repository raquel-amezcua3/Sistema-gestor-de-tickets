import React, { useState } from 'react';
import '../styles/buscarAdmin.css';
import { useNavigate } from 'react-router-dom';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function BuscarAdmin() {
  const navigate_buscar_admin = useNavigate();
  
  // 1. Datos de ejemplo para el Administrador (pueden ser muchos más usuarios)
  const [tickets_buscar_admin] = useState([
    { id: '101', nombre: 'Juan Pérez', titulo: 'Error de Login', descripcion: 'No reconoce la contraseña', fecha: '2026-03-10', fechaCierre: '2026-03-11', estado: 'Cerrado', tecnico: 'Carlos M.' },
    { id: '102', nombre: 'Ana García', titulo: 'Impresora', descripcion: 'Atasco de papel en bandeja 2', fecha: '2026-03-12', fechaCierre: '—', estado: 'Abierto', tecnico: 'Pendiente' },
    { id: '103', nombre: 'Luis Lopez', titulo: 'Software', descripcion: 'Instalacion de Office', fecha: '2026-03-15', fechaCierre: '2026-03-16', estado: 'Cerrado', tecnico: 'Ricardo H.' },
    { id: '104', nombre: 'Maria Sol', titulo: 'Red', descripcion: 'Sin internet en oficina 4', fecha: '2026-03-18', fechaCierre: '—', estado: 'Abierto', tecnico: 'Pendiente' },
  ]);

  // 2. Estado para el buscador
  const [busqueda_buscar_admin, setBusqueda_buscar_admin] = useState('');

  // 3. Lógica de filtrado por ID o Nombre
  const filtrados_buscar_admin = tickets_buscar_admin.filter((ticket) => {
    return ticket.id.toLowerCase().includes(busqueda_buscar_admin.toLowerCase()) ||
           ticket.nombre.toLowerCase().includes(busqueda_buscar_admin.toLowerCase());
  });

  return (
    <div className="container-buscar-admin">
      <EncabezadoAdmin />

      <main className="contenido-buscar-admin">
        {/* Sección del Buscador (Imagen image_130749.png) */}
        <div className="seccion-busqueda-buscar-admin">
          <div className="info-busqueda-buscar-admin">
            <span className="lupa-icono-buscar-admin">🔍</span>
            <h2>Buscar ticket por numero de ID</h2>
          </div>
          <input 
            type="text" 
            className="input-redondeado-buscar-admin"
            value={busqueda_buscar_admin}
            onChange={(e) => setBusqueda_buscar_admin(e.target.value)}
            placeholder="Introduce el ID..."
          />
        </div>

        {/* Tabla de Tickets (Estilo image_130749.png) */}
        <div className="tabla-wrapper-buscar-admin">
          <table className="tabla-tickets-buscar-admin">
            <thead>
              <tr>
                <th className="col-id-buscar-admin">ID</th>
                <th className="col-nombre-buscar-admin">Nombre</th>
                <th className="col-titulo-buscar-admin">Titulo</th>
                <th className="col-desc-buscar-admin">Descripción</th>
                <th className="col-fecha-buscar-admin">Fecha de creación</th>
                <th className="col-fecha-buscar-admin">Fecha de cierre</th>
                <th className="col-estado-buscar-admin">Estado</th>
                <th className="col-tecnico-buscar-admin">Tecnico</th>
              </tr>
            </thead>
            <tbody>
              {filtrados_buscar_admin.length > 0 ? (
                filtrados_buscar_admin.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="fila-ticket-buscar-admin"
                    onDoubleClick={() => navigate_buscar_admin(`/datosTicketAdmin/${ticket.id}`)} 
                  >

                    <td>{ticket.id}</td>
                    <td>{ticket.nombre}</td>
                    <td>{ticket.titulo}</td>
                    <td>{ticket.descripcion}</td>
                    <td>{ticket.fecha}</td>
                    <td>{ticket.fechaCierre}</td>
                    <td>{ticket.estado}</td>
                    <td>{ticket.tecnico}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="sin-resultados-buscar-admin">
                    No se encontraron tickets con ese ID o Nombre
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

export default BuscarAdmin;