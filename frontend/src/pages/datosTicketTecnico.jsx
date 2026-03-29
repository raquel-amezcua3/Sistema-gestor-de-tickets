import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/datosTicketTecnico.css';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function DatosTicketTecnico() {
  const navigate_datosT_Tecnico = useNavigate();
  const { id } = useParams();
  const [modalExito_datosT_Tecnico, setModalExito_datosT_Tecnico] = useState(false);
  const [modalConfirmar_DT, setModalConfirmar_DT] = useState(false);

  const [ticket_datosT_Tecnico, setTicket_datosT_Tecnico] = useState({
    id: '', nombre: '', correo: '', telefono: '', titulo: '', descripcion: '', fecha: '', estado: '', tecnico: '', fechaCierre: ''
  });

  // --- VALIDACIÓN ---
  // Verifica que el estado sea 'Cerrado' Y que la fecha de cierre no esté vacía
  const requisitosCompletos = ticket_datosT_Tecnico.estado === 'Cerrado' && ticket_datosT_Tecnico.fechaCierre !== '';

  useEffect(() => {
    // Simulación de carga de datos
    const encontrado = { 
      id: '101', nombre: 'Juan Pérez', correo: 'juan.p@bodesa.com', telefono: '3121234567', 
      titulo: 'Error de Login', descripcion: 'No reconoce la contraseña...', 
      fecha: '2026-03-10', estado: 'En proceso', tecnico: 'Raquel Amezcua', fechaCierre: '' 
    };
    setTicket_datosT_Tecnico(encontrado);
  }, [id]);

  const confirmarResolucion = () => {
    setModalConfirmar_DT(false);
    setModalExito_datosT_Tecnico(true);
  };

  return (
    <div className="container-datosT-Tecnico">
      <EncabezadoTecnico />

      <main className="contenido-datosT-Tecnico">
        <h2 className="titulo-pagina-datosT-Tecnico">Detalles del ticket</h2>

        <div className="card-datosT-Tecnico">
          <div className="seccion-info-datosT-Tecnico">
            <div className="header-card-datosT-Tecnico">
              <img src="/img/ticket.png" alt="icono" className="icono-datosT-Tecnico" />
              <span className="ticket-label-datosT-Tecnico">Ticket</span>
            </div>
            
            <p className="aviso-rojo-datosT-Tecnico">*Solo se puede cambiar el estado del ticket y poner la fecha de cierre</p>

            <div className="grid-formulario-datosT-Tecnico">
              <div className="columna-datosT-Tecnico">
                <div className="grupo-input-datosT-Tecnico">
                  <label>ID</label>
                  <input type="text" value={ticket_datosT_Tecnico.id} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Nombre de usuario</label>
                  <input type="text" value={ticket_datosT_Tecnico.nombre} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Fecha de creación</label>
                  <input type="text" value={ticket_datosT_Tecnico.fecha} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Tecnico encargado</label>
                  <input type="text" value={ticket_datosT_Tecnico.tecnico} readOnly className="tecnico-bold-datosT-Tecnico" />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label><span className="rojo-datosT-Tecnico">*</span>Estado del ticket</label>
                  <select 
                    className={`select-estado-datosT-Tecnico ${ticket_datosT_Tecnico.estado === 'En proceso' ? 'estado-amarillo' : 'estado-verde'}`}
                    value={ticket_datosT_Tecnico.estado}
                    onChange={(e) => setTicket_datosT_Tecnico({...ticket_datosT_Tecnico, estado: e.target.value})}
                  >
                    <option value="En proceso">En proceso</option>
                    <option value="Cerrado">Cerrado</option>
                  </select>
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Correo</label>
                  <input type="text" value={ticket_datosT_Tecnico.correo} readOnly />
                </div>
              </div>

              <div className="columna-datosT-Tecnico">
                <div className="grupo-input-datosT-Tecnico">
                  <label>Telefono</label>
                  <input type="text" value={ticket_datosT_Tecnico.telefono} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Titulo del ticket</label>
                  <input type="text" value={ticket_datosT_Tecnico.titulo} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Descripción</label>
                  <textarea className="textarea-datosT-Tecnico" value={ticket_datosT_Tecnico.descripcion} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Fecha de cierre</label>
                  <input 
                    type="date" 
                    value={ticket_datosT_Tecnico.fechaCierre} 
                    onChange={(e) => setTicket_datosT_Tecnico({...ticket_datosT_Tecnico, fechaCierre: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="contenedor-botones-datosT-Tecnico">
              <button className="btn-azul-datosT-Tecnico" onClick={() => navigate_datosT_Tecnico('/pendientesTecnico')}>Ok</button>
              <button className="btn-azul-datosT-Tecnico" onClick={() => setModalConfirmar_DT(true)}>Ticket resuelto</button>
            </div>
          </div>
        </div>
      </main>

      {/* VENTANA EMERGENTE DE PREGUNTA CON VALIDACIÓN */}
      {modalConfirmar_DT && (
        <div className="overlay-modal-datosT-Tecnico">
          <div className="modal-confirmar-DT">
            <img src="/img/ticket.png" alt="ticket icon" className="img-pregunta-DT" />
            <h2 className="titulo-pregunta-DT">¿El ticket esta resuelto?</h2>
            
            {/* Mensaje de error si no se cumplen los requisitos */}
            {!requisitosCompletos && (
              <p className="mensaje-error-modal">
                Es obligatorio poner el estado como <strong>cerrado</strong> y la <strong>fecha de cierre</strong> para dar por resuelto el ticket.
              </p>
            )}

            <div className="flex-botones-DT">
              <button className="btn-cancelar-DT" onClick={() => setModalConfirmar_DT(false)}>Cancelar</button>
              <button 
                className={`btn-aceptar-pregunta-DT ${!requisitosCompletos ? 'btn-deshabilitado' : ''}`} 
                onClick={confirmarResolucion}
                disabled={!requisitosCompletos} // Bloquea el botón
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {modalExito_datosT_Tecnico && (
        <div className="overlay-modal-datosT-Tecnico">
          <div className="modal-exito-datosT-Tecnico">
            <img src="/img/logo-ticket.png" alt="ticket icon" className="img-pregunta-DT" />
            <h2 className="ventana-texto">¡Ticket resuelto correctamente!</h2>
            <button className="btn-aceptar-datosT-Tecnico" onClick={() => navigate_datosT_Tecnico('/pendientesTecnico')}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatosTicketTecnico;