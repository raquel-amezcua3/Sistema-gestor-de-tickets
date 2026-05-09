import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/datosTicketTecnico.css';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function DatosTicketTecnico() {
  const navigate_datosT_Tecnico = useNavigate();
  // Obtención del ID del ticket directamente desde los parámetros de la URL configurada en el Router
  const { id } = useParams();

  // Estados para controlar la visibilidad de los modales de confirmación y éxito
  const [modalExito_datosT_Tecnico, setModalExito_datosT_Tecnico] = useState(false);
  const [modalConfirmar_DT, setModalConfirmar_DT] = useState(false);

  // Estado que almacena la información detallada del ticket
  const [ticket_datosT_Tecnico, setTicket_datosT_Tecnico] = useState({
    id: '', nombre: '', correo: '', telefono: '', titulo: '', descripcion: '', fecha: '', estado: '', tecnico: '', fechaCierre: ''
  });

  // Lógica de validación: Se requiere que el estado sea 'Cerrado' y exista una fecha seleccionada para habilitar el guardado
  const requisitosCompletos = ticket_datosT_Tecnico.estado === 'Cerrado' && ticket_datosT_Tecnico.fechaCierre !== '';

  // Cargar datos desde el backend
  // Se ejecuta cada vez que el ID en la URL cambia para traer la información actualizada del ticket
  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        const response = await fetch(`/api/tecnico/tickets/detalle/${id}`);
        const data = await response.json();
        if (response.ok) {
          // Se inicializa el estado con los datos del backend, manteniendo la fecha de cierre vacía para que el técnico la asigne
          setTicket_datosT_Tecnico({ ...data, fechaCierre: '' });
        }
      } catch (err) {
        console.error("Error al cargar detalle:", err);
      }
    };
    cargarDetalle();
  }, [id]);

  // Funcion para guardar en la base de datos
  // Envía una petición PUT al servidor para actualizar el estado del ticket y registrar su conclusión
  const confirmarResolucion = async () => {
    try {
      const response = await fetch(`/api/tecnico/tickets/resolver/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estado: ticket_datosT_Tecnico.estado,
          fechaCierre: ticket_datosT_Tecnico.fechaCierre
        })
      });

      if (response.ok) {
        setModalConfirmar_DT(false); // Cierra modal de pregunta
        setModalExito_datosT_Tecnico(true); // Muestra modal de confirmación final
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
                {/* Campos de solo lectura (readOnly) para evitar la edición de datos de origen */}
                <div className="grupo-input-datosT-Tecnico"><label>Nombre de usuario</label>
                  <input type="text" value={ticket_datosT_Tecnico.nombre} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico"><label>Fecha de creación</label>
                  <input type="text" value={ticket_datosT_Tecnico.fecha} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico"><label>Tecnico encargado</label>
                  <input type="text" value={ticket_datosT_Tecnico.tecnico} readOnly className="tecnico-bold-datosT-Tecnico" />
                </div>
                {/* Control de edición de estado: Cambia dinámicamente la clase CSS según la selección */}
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
                {/* Campo editable de fecha: Crucial para la resolución del ticket */}
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

      {/* Modal Confirmar: Realiza una validación visual antes de permitir el guardado definitivo */}
      {modalConfirmar_DT && (
        <div className="overlay-modal-datosT-Tecnico">
          <div className="modal-confirmar-DT">
            <h2 className="titulo-pregunta-DT">¿El ticket está resuelto?</h2>
            {/* Mensaje de error condicional si el técnico no ha cumplido los requisitos de cierre */}
            {!requisitosCompletos && (
              <p className="mensaje-error-modal">Debes seleccionar el estado <b>Resuelto</b> y elegir una <b>Fecha de cierre</b>.</p>
            )}
            <div className="flex-botones-DT">
              <button className="btn-cancelar-DT" onClick={() => setModalConfirmar_DT(false)}>Cancelar</button>
              {/* El botón de Aceptar se bloquea automáticamente mediante la propiedad disabled si no se validan los requisitos */}
              <button className="btn-aceptar-pregunta-DT" onClick={confirmarResolucion} disabled={!requisitosCompletos}>Aceptar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Éxito: Feedback visual al usuario tras la actualización exitosa en la DB */}
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