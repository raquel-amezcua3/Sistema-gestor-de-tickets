import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/datosResueltoTecnico.css';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function DatosResueltoTecnico() {
  const navigate_datos_resuelto_tecnico = useNavigate();
  const { id } = useParams();

  // Campos de los tickets
  const [ticket_datos_resuelto_tecnico, setTicket_datos_resuelto_tecnico] = useState({
    id: '', nombre: '', correo: '', telefono: '', titulo: '', descripcion: '', fecha: '', estado: '', tecnico: '', fechaCierre: ''
  });

  useEffect(() => {
    // Esto sirve para buscar un ticket en la base de datos
    const encontrado = { 
      id: id || '101', 
      nombre: 'Juan Pérez', 
      correo: 'juan.p@bodesa.com', 
      telefono: '3121234567', 
      titulo: 'Error de Login', 
      descripcion: 'No reconoce la contraseña al intentar ingresar al sistema desde la oficina. Se restablecieron credenciales.', 
      fecha: '2026-03-10', 
      estado: 'Cerrado', 
      tecnico: 'Fernando Contreras', 
      fechaCierre: '2026-03-11' 
    };
    setTicket_datos_resuelto_tecnico(encontrado);
  }, [id]);

  return (
    <div className="container-datos-resuelto-tecnico">
      <EncabezadoTecnico />

      <main className="contenido-datos-resuelto-tecnico">
        <h2 className="titulo-pagina-datos-resuelto-tecnico">Detalles del ticket resuelto</h2>

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
                  <label>Tecnico encargado</label>
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
                  <label>Telefono</label>
                  <input type="text" value={ticket_datos_resuelto_tecnico.telefono} readOnly />
                </div>
                <div className="grupo-input-datos-resuelto-tecnico">
                  <label>Titulo del ticket</label>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DatosResueltoTecnico;