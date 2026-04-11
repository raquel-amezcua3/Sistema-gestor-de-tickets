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

  const requisitosCompletos = ticket_datosT_Tecnico.estado === 'Cerrado' && ticket_datosT_Tecnico.fechaCierre !== '';

  // CARGAR DATOS REALES DESDE EL BACKEND
  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const response = await fetch(`http://localhost:3000/tecnico/tickets/detalle/${id}`);
        const data = await response.json();
        if (response.ok) {
          setTicket_datosT_Tecnico({ ...data, fechaCierre: '' });
        }
      } catch (err) {
        console.error("Error al cargar detalle:", err);
      }
    };
    cargarDetalle();
  }, [id]);

  // FUNCIÓN PARA GUARDAR EN LA DB
  const confirmarResolucion = async () => {
    try {
      const response = await fetch(`http://localhost:3000/tecnico/tickets/resolver/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: ticket_datosT_Tecnico.estado,
          fechaCierre: ticket_datosT_Tecnico.fechaCierre
        })
      });

      if (response.ok) {
        setModalConfirmar_DT(false);
        setModalExito_datosT_Tecnico(true);
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div className="container-datosT-Tecnico">
      <EncabezadoTecnico />
      <main className="contenido-datosT-Tecnico">
        <h2 className="titulo-pagina-datosT-Tecnico">Detalles del ticket #{id}</h2>
        <div className="card-datosT-Tecnico">
          <div className="seccion-info-datosT-Tecnico">
            <div className="header-card-datosT-Tecnico">
              <img src="/img/ticket.png" alt="icono" className="icono-datosT-Tecnico" />
              <span className="ticket-label-datosT-Tecnico">Datos del Ticket</span>
            </div>
            
            <p className="aviso-rojo-datosT-Tecnico">*Solo se puede cambiar el estado y la fecha de cierre</p>

            <div className="grid-formulario-datosT-Tecnico">
              <div className="columna-datosT-Tecnico">
                <div className="grupo-input-datosT-Tecnico"><label>Nombre de usuario</label>
                  <input type="text" value={ticket_datosT_Tecnico.nombre} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico"><label>Fecha de creación</label>
                  <input type="text" value={ticket_datosT_Tecnico.fecha} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico"><label>Tecnico encargado</label>
                  <input type="text" value={ticket_datosT_Tecnico.tecnico} readOnly className="tecnico-bold-datosT-Tecnico" />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label><span className="rojo-datosT-Tecnico">*</span>Estado del ticket</label>
                  <select 
                    className={`select-estado-datosT-Tecnico ${ticket_datosT_Tecnico.estado === 'Cerrado' ? 'estado-verde' : 'estado-amarillo'}`}
                    value={ticket_datosT_Tecnico.estado}
                    onChange={(e) => setTicket_datosT_Tecnico({...ticket_datosT_Tecnico, estado: e.target.value})}
                  >
                    <option value="en proceso">En proceso</option>
                    <option value="Cerrado">Resuelto</option>
                  </select>
                </div>
              </div>

              <div className="columna-datosT-Tecnico">
                <div className="grupo-input-datosT-Tecnico"><label>Título</label>
                  <input type="text" value={ticket_datosT_Tecnico.titulo} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico"><label>Descripción</label>
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
              <button className="btn-azul-datosT-Tecnico" onClick={() => navigate_datosT_Tecnico('/pendientesTecnico')}>Volver</button>
              <button className="btn-azul-datosT-Tecnico" onClick={() => setModalConfirmar_DT(true)}>Ticket resuelto</button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Confirmar */}
      {modalConfirmar_DT && (
        <div className="overlay-modal-datosT-Tecnico">
          <div className="modal-confirmar-DT">
            <h2 className="titulo-pregunta-DT">¿El ticket está resuelto?</h2>
            {!requisitosCompletos && (
              <p className="mensaje-error-modal">Debes seleccionar el estado <b>Resuelto</b> y elegir una <b>Fecha de cierre</b>.</p>
            )}
            <div className="flex-botones-DT">
              <button className="btn-cancelar-DT" onClick={() => setModalConfirmar_DT(false)}>Cancelar</button>
              <button className="btn-aceptar-pregunta-DT" onClick={confirmarResolucion} disabled={!requisitosCompletos}>Aceptar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Éxito */}
      {modalExito_datosT_Tecnico && (
        <div className="overlay-modal-datosT-Tecnico">
          <div className="modal-exito-datosT-Tecnico">
            <h2 className="ventana-texto">¡Ticket resuelto correctamente!</h2>
            <button className="btn-aceptar-datosT-Tecnico" onClick={() => navigate_datosT_Tecnico('/pendientesTecnico')}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatosTicketTecnico;