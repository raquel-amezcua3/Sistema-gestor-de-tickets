//La pantalla datosResueltoTecnico.jsx su .js es datosResueltoTecnico.js
//En esta pantalla se muestra la tabla de tickets resueltos por el tecnico
// TECNICO

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/datosResueltoTecnico.css';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function DatosResueltoTecnico() {
  const navigate_datos_resuelto_tecnico = useNavigate();
  const { id } = useParams();

  // Inicialización limpia de los campos del ticket
  const [ticket_datos_resuelto_tecnico, setTicket_datos_resuelto_tecnico] = useState({
    id: '', 
    nombre: 'Cargando...', 
    correo: 'Cargando...', 
    telefono: 'Cargando...', 
    titulo: 'Cargando...', 
    descripcion: 'Cargando...', 
    fecha: '', 
    estado: '', 
    tecnico: '', 
    fechaCierre: ''
  });

  useEffect(() => {
    if (!id) return; // Guardián por si el ID tarda en llegar

    const obtenerDetallesTicket = async () => {
      try {
        // 🔥 CORREGIDO: Apuntando directo al endpoint sin el sub-camino "/detalle"
        const response = await fetch(`https://sistema-tarelix.onrender.com/api/datosResueltoTecnico/${id}`);
        const data = await response.json();

        if (response.ok) {
          setTicket_datos_resuelto_tecnico({
            id: data.id ? data.id.toString() : id,
            nombre: data.nombre,
            correo: data.correo,
            telefono: data.telefono,
            titulo: data.titulo,
            descripcion: data.descripcion,
            fecha: data.fecha, 
            estado: data.estado,
            tecnico: data.tecnico,
            fechaCierre: data.fechaCierre || 'Sin registrar'
          });
        } else {
          console.error("⚠️ El servidor respondió con un error:", data.error);
        }
      } catch (error) {
        console.error("❌ Error de red al conectar con el servidor:", error);
      }
    };

    obtenerDetallesTicket();
  }, [id]);

  return (
    <div className="container-datos-resuelto-tecnico">
      <EncabezadoTecnico />

      <main className="contenido-datos-resuelto-tecnico">
        <h2 className="titulo-pagina-datos-resuelto-tecnico">Detalles del ticket resuelto #{id}</h2>

        <div className="card-datos-resuelto-tecnico">
          <div className="seccion-info-datos-resuelto-tecnico">
            <div className="header-card-datos-resuelto-tecnico">
              <img src="/img/logo-ticket.png" alt="icono" className="icono-datos-resuelto-tecnico" />
              <span className="ticket-label-datos-resuelto-tecnico">Ticket Finalizado</span>
            </div>
            
            <p className="aviso-azul-datos-resuelto-tecnico">Información histórica del ticket (Solo lectura)</p>

            <div className="grid-formulario-datos-resuelto-tecnico">
              <div className="columna-datos-resuelto-tecnico">
                <div className="grupo-input-datos-resuelto-tecnico">
                  <label>ID</label>
                  <input type="text" value={ticket_datos_resuelto_tecnico.id} readOnly />
                </div>
                <div className="grupo-input-datos-resuelto-tecnico">
                  <label>Nombre de usuario</label>
                  <input type="text" value={ticket_datos_resuelto_tecnico.nombre} readOnly />
                </div>
                <div className="grupo-input-datos-resuelto-tecnico">
                  <label>Fecha de creación</label>
                  <input type="text" value={ticket_datos_resuelto_tecnico.fecha} readOnly />
                </div>
                <div className="grupo-input-datos-resuelto-tecnico">
                  <label>Técnico encargado</label>
                  <input type="text" value={ticket_datos_resuelto_tecnico.tecnico} readOnly className="tecnico-bold-datos-resuelto-tecnico" />
                </div>
                <div className="grupo-input-datos-resuelto-tecnico">
                  <label>Estado del ticket</label>
                  <input 
                    type="text" 
                    value={ticket_datos_resuelto_tecnico.estado} 
                    readOnly 
                    className="estado-verde-datos-resuelto-tecnico"
                  />
                </div>
                <div className="grupo-input-datos-resuelto-tecnico">
                  <label>Correo</label>
                  <input type="text" value={ticket_datos_resuelto_tecnico.correo} readOnly />
                </div>
              </div>

              <div className="columna-datos-resuelto-tecnico">
                <div className="grupo-input-datos-resuelto-tecnico">
                  <label>Teléfono</label>
                  <input type="text" value={ticket_datos_resuelto_tecnico.telefono} readOnly />
                </div>
                <div className="grupo-input-datos-resuelto-tecnico">
                  <label>Título del ticket</label>
                  <input type="text" value={ticket_datos_resuelto_tecnico.titulo} readOnly />
                </div>
                <div className="grupo-input-datos-resuelto-tecnico">
                  <label>Descripción</label>
                  <textarea className="textarea-datos-resuelto-tecnico" value={ticket_datos_resuelto_tecnico.descripcion} readOnly />
                </div>
                <div className="grupo-input-datos-resuelto-tecnico">
                  <label>Fecha de cierre</label>
                  <input type="text" value={ticket_datos_resuelto_tecnico.fechaCierre} readOnly />
                </div>
              </div>
            </div>

            <div className="contenedor-botones-datos-resuelto-tecnico">
              <button 
                className="btn-azul-datos-resuelto-tecnico" 
                onClick={() => navigate_datos_resuelto_tecnico('/resueltoTecnico')}
              >
                Regresar
              </button>
              
              <button 
                className="btn-azul-datos-resuelto-tecnico" 
                onClick={() => navigate_datos_resuelto_tecnico(`/seguimientoTicketU/${id}`)}
                style={{
                  backgroundColor: '#848484', 
                  color: '#ffffff',
                  transition: 'background-color 0.2s ease', 
                  marginLeft: '20px'
                }}
              >
                Seguimiento ticket
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DatosResueltoTecnico;