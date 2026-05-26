//La pantalla datosTicketTecnico.jsx su .js es datosTicketTecnico.js
//Es la pantalla donde aparecen los datos del ticket para que el tecnico lo pueda ver
// TECNICO  
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/datosTicketTecnico.css';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function DatosTicketTecnico() {
  const navigate_datosT_Tecnico = useNavigate();
  const { id } = useParams();

  // Estados de modales
  const [modalExito_datosT_Tecnico, setModalExito_datosT_Tecnico] = useState(false);
  const [modalConfirmar_DT, setModalConfirmar_DT] = useState(false);
  const [modalSeguimiento, setModalSeguimiento] = useState(false);
  const [modalExitoSeguimiento, setModalExitoSeguimiento] = useState(false);

  // Estado del ticket principal (Vista de lectura de la tarjeta)
  const [ticket_datosT_Tecnico, setTicket_datosT_Tecnico] = useState({
    id: '', nombre: '', categoria: '', subcategoria: '', prioridad: '', impacto: '',
    titulo: '', descripcion: '', equipo: '', fecha: '', estado: 'en proceso', tecnico: '', id_tecnico: 6, fechaCierre: ''
  });

  // Estado del formulario interno del modal de seguimiento
  const [formSeguimiento, setFormSeguimiento] = useState({
    estado: 'en proceso', diagnostico: '', fallaReal: '', accionTomada: '', piezas: '', tiempo: '',
    fechaCierre: '' 
  });

  const [tieneDiagnosticoPrevio, setTieneDiagnosticoPrevio] = useState(false);
  const [tieneFallaPrevia, setTieneFallaPrevia] = useState(false);

  // Carga inicial de datos 
  useEffect(() => {
    if (!id) return; // Guardián si el ID de la URL no está listo inmediatamente

    const cargarDetalle = async () => {
      try {
        const response = await fetch(`https://sistema-tarelix.onrender.com/api/tecnico/detalle-ticket/detalle/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          setTicket_datosT_Tecnico({
            id: data.id ? data.id.toString() : id,
            nombre: data.nombre,
            categoria: data.categoria,
            subcategoria: data.subcategoria,
            prioridad: data.prioridad,
            impacto: data.impacto,
            titulo: data.titulo,
            descripcion: data.descripcion,
            equipo: data.equipo, 
            fecha: data.fecha,
            estado: data.estado,
            tecnico: data.tecnico,
            id_tecnico: data.id_tecnico || 6,
            fechaCierre: data.fechaCierre || '' 
          });

          // Controlar si ya existen textos guardados en la trazabilidad anterior
          setTieneDiagnosticoPrevio(data.diagnosticoHistorico ? data.diagnosticoHistorico.trim() !== '' : false);
          setTieneFallaPrevia(data.fallaRealHistorica ? data.fallaRealHistorica.trim() !== '' : false);

          setFormSeguimiento({ 
            estado: data.estado || 'en proceso',
            diagnostico: data.diagnosticoHistorico || '',
            fallaReal: data.fallaRealHistorica || '',
            accionTomada: '',
            piezas: '',
            tiempo: '',
            fechaCierre: ''
          });
        } else {
          console.error("El servidor devolvió un error al traer el ticket:", data.error);
        }
      } catch (err) {
        console.error("Error al cargar detalle del ticket:", err);
      }
    };

    cargarDetalle();
  }, [id]);

  const handleCambioEstadoModal = (nuevoEstado) => {
    setFormSeguimiento(prev => ({
      ...prev,
      estado: nuevoEstado,
      fechaCierre: nuevoEstado === 'resuelto' ? prev.fechaCierre : ''
    }));
  };

  const confirmarResolucion = async () => {
    try {
      const response = await fetch(`https://sistema-tarelix.onrender.com/api/detalle-ticket/resolver/${id}`, {
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

  // Guardar el seguimiento del modal sincrónico con las variables esperadas por el backend
  const handleAnadirSeguimiento = async () => {
  // Validaciones básicas del frontend
  if (!formSeguimiento.accionTomada.trim() || !formSeguimiento.piezas.trim() || !formSeguimiento.tiempo) {
    alert("Por favor llena todos los campos obligatorios (*)");
    return;
  }

  if (formSeguimiento.estado === 'resuelto' && !formSeguimiento.fechaCierre) {
    alert("Para poner el ticket en estado Resuelto, debes ingresar la Fecha de Cierre obligatoriamente.");
    return;
  }

  try {
    const datosParaBackend = {
      estado: formSeguimiento.estado,
      diagnostico: formSeguimiento.diagnostico || null,
      fallaReal: formSeguimiento.fallaReal || null,
      accionTomada: formSeguimiento.accionTomada,
      piezas: formSeguimiento.piezas,
      tiempo: parseInt(formSeguimiento.tiempo, 10),
      id_tecnico: ticket_datosT_Tecnico.id_tecnico ? parseInt(ticket_datosT_Tecnico.id_tecnico, 10) : 6
    };

    console.log("Enviando datos al backend correcto:", datosParaBackend);

    // Se añade '/tecnico' para que coincida con el backend
    const response = await fetch(`https://sistema-tarelix.onrender.com/api/tecnico/detalle-ticket/seguimiento/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosParaBackend)
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      setModalSeguimiento(false); 
      setModalExitoSeguimiento(true); 
    } else {
      // Si el servidor responde pero con un error (ej. 500)
      alert(`El servidor rechazó el comentario: ${data.detalle || data.error || 'Error de procesamiento'}`);
    }
  } catch (error) {
    console.error("Error de conexión con la API:", error);
    alert("No se pudo conectar con el servidor.");
  }
};
  const manejarAceptarExitoSeguimiento = () => {
    setModalExitoSeguimiento(false);
    navigate_datosT_Tecnico(`/pendientesTecnico`);
  };

  const handleBotonOkPrincipal = () => {
    const est = ticket_datosT_Tecnico.estado ? ticket_datosT_Tecnico.estado.toLowerCase() : '';
    if (est === 'cerrado' || est === 'resuelto') {
      setModalConfirmar_DT(true);
    } else {
      navigate_datosT_Tecnico('/pendientesTecnico');
    }
  };

  const estActual = ticket_datosT_Tecnico.estado ? ticket_datosT_Tecnico.estado.toLowerCase() : '';
  const camposBloqueados = estActual === 'cerrado' || estActual === 'resuelto';

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
                <div className="grupo-input-datosT-Tecnico">
                  <label>Nombre de usuario</label>
                  <input type="text" value={ticket_datosT_Tecnico.nombre || ''} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Categoría</label>
                  <input type="text" value={ticket_datosT_Tecnico.categoria || ''} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Subcategoría</label>
                  <input type="text" value={ticket_datosT_Tecnico.subcategoria || ''} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Nivel de prioridad</label>
                  <input type="text" value={ticket_datosT_Tecnico.prioridad || ''} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Grado de impacto</label>
                  <input type="text" value={ticket_datosT_Tecnico.impacto || ''} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Fecha de creación</label>
                  <input type="text" value={ticket_datosT_Tecnico.fecha || ''} readOnly />
                </div>
              </div>

              <div className="columna-datosT-Tecnico">
                <div className="grupo-input-datosT-Tecnico">
                  <label><span className="rojo-datosT-Tecnico">*</span>Estado del ticket</label>
                  <input 
                    type="text" 
                    className={`select-estado-datosT-Tecnico ${ticket_datosT_Tecnico.estado && (ticket_datosT_Tecnico.estado.toLowerCase() === 'cerrado' || ticket_datosT_Tecnico.estado.toLowerCase() === 'resuelto') ? 'estado-verde' : 'estado-amarillo'}`}
                    value={
                      ticket_datosT_Tecnico.estado === 'en proceso' ? 'En proceso' :
                      ticket_datosT_Tecnico.estado === 'en espera de compra' ? 'En espera de compra' : 
                      ticket_datosT_Tecnico.estado === 'Cerrado' || ticket_datosT_Tecnico.estado === 'resuelto' ? 'Resuelto' : ticket_datosT_Tecnico.estado || ''
                    }
                    readOnly 
                  />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Título de la falla</label>
                  <input type="text" value={ticket_datosT_Tecnico.titulo || ''} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico area-texto-datos">
                  <label>Descripción</label>
                  <textarea className="textarea-datosT-Tecnico" value={ticket_datosT_Tecnico.descripcion || ''} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Equipo afectado</label>
                  <input type="text" value={ticket_datosT_Tecnico.equipo || ''} readOnly />
                </div>
                <div className="grupo-input-datosT-Tecnico">
                  <label>Fecha de cierre (Lectura)</label>
                  <input 
                    type="text" 
                    value={ticket_datosT_Tecnico.fechaCierre || 'No cerrado aún'} 
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="contenedor-botones-datosT-Tecnico">
              <button className="btn-azul-datosT-Tecnico" onClick={handleBotonOkPrincipal}>Ok</button>
              <button className="btn-gris-datosT-Tecnico" onClick={() => setModalSeguimiento(true)}>Seguimiento del ticket</button>
              <button className="btn-gris-datosT-Tecnico" onClick={() => navigate_datosT_Tecnico(`/bitacoraETecnico/${id}`)}>Bitácora del equipo</button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DE SEGUIMIENTO */}
      {modalSeguimiento && (
        <div className="overlay-modal-datosT-Tecnico">
          <div className="modal-seguimiento-container">
            <div className="header-modal-seguimiento">
               <img src="/img/ticket.png" alt="icon" style={{width: '40px'}} />
               <h2>Seguimiento del ticket</h2>
            </div>
            <div className="form-seguimiento">
              <div className="fila-seguimiento">
                <label>Estado del ticket</label>
                <select 
                  className={`select-estado-modal ${
                    formSeguimiento.estado === 'abierto' ? 'estado-azul' : 
                    formSeguimiento.estado === 'en proceso' ? 'estado-amarillo' : 
                    formSeguimiento.estado === 'en espera de compra' ? 'estado-rosa' : 
                    formSeguimiento.estado === 'resuelto' ? 'estado-verde' : ''
                  }`}
                  value={formSeguimiento.estado}
                  onChange={(e) => handleCambioEstadoModal(e.target.value)}
                >
                  <option value="abierto">Abierto</option>
                  <option value="en proceso">En proceso</option>
                  <option value="en espera de compra">En espera de compra</option>
                  <option value="resuelto">Resuelto</option>
                </select>
              </div>

              {formSeguimiento.estado === 'resuelto' && (
                <div className="fila-seguimiento campo-fecha-cierre-modal">
                  <label><span className="rojo-datosT-Tecnico">*</span>Fecha de cierre del Ticket</label>
                  <input 
                    type="date" 
                    value={formSeguimiento.fechaCierre}
                    onChange={(e) => setFormSeguimiento({...formSeguimiento, fechaCierre: e.target.value})}
                    style={{border: '2px solid #28a745', borderRadius: '5px', padding: '5px'}}
                  />
                </div>
              )}
              
              <div className="fila-seguimiento">
                <label>Fecha y hora</label>
                <input type="text" value={new Date().toLocaleString()} readOnly className="input-bloqueado" />
              </div>

              <div className="fila-seguimiento">
                <label>Técnico</label>
                <input type="text" value={ticket_datosT_Tecnico.tecnico} readOnly className="input-bloqueado" />
              </div>

              <div className="fila-seguimiento">
                <label>Diagnóstico técnico</label>
                <textarea 
                  value={formSeguimiento.diagnostico} 
                  onChange={(e) => setFormSeguimiento({...formSeguimiento, diagnostico: e.target.value})} 
                  disabled={camposBloqueados || tieneDiagnosticoPrevio}
                  className={camposBloqueados || tieneDiagnosticoPrevio ? 'input-bloqueado' : ''}
                  placeholder={tieneDiagnosticoPrevio ? "" : "Escribe el diagnóstico..."}
                />
              </div>

              <div className="fila-seguimiento">
                <label>Falla real</label>
                <input 
                  type="text" 
                  value={formSeguimiento.fallaReal} 
                  onChange={(e) => setFormSeguimiento({...formSeguimiento, fallaReal: e.target.value})} 
                  disabled={camposBloqueados || tieneFallaPrevia}
                  className={camposBloqueados || tieneFallaPrevia ? 'input-bloqueado' : ''}
                  placeholder={tieneFallaPrevia ? "" : "Escribe la falla real..."}
                />
              </div>

              <div className="fila-seguimiento">
                <label><span className="rojo-datosT-Tecnico">*</span>Acción tomada</label>
                <textarea 
                  value={formSeguimiento.accionTomada} 
                  onChange={(e) => setFormSeguimiento({...formSeguimiento, accionTomada: e.target.value})} 
                />
              </div>

              <div className="fila-seguimiento">
                <label><span className="rojo-datosT-Tecnico">*</span>Piezas reemplazadas</label>
                <input 
                  type="text" 
                  value={formSeguimiento.piezas} 
                  onChange={(e) => setFormSeguimiento({...formSeguimiento, piezas: e.target.value})} 
                />
              </div>

              <div className="fila-seguimiento">
                <label><span className="rojo-datosT-Tecnico">*</span>Tiempo laborando (minutos)</label>
                <input 
                  type="number" 
                  min="0"
                  placeholder="Ej. 45"
                  className="input-tiempo-seguimiento"
                  value={formSeguimiento.tiempo} 
                  onChange={(e) => setFormSeguimiento({...formSeguimiento, tiempo: e.target.value})} 
                />
              </div>
            </div>

            <div className="footer-modal-seguimiento">
              <button className="btn-cancelar-seguimiento" onClick={() => setModalSeguimiento(false)}>Cerrar</button>
              <button className="btn-anadir-seguimiento" onClick={handleAnadirSeguimiento}>Añadir seguimiento</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL COMENTARIO AGREGADO */}
      {modalExitoSeguimiento && (
        <div className="overlay-modal-datosT-Tecnico">
          <div className="modal-exito-datosT-Tecnico">
            <h2 className="titulo-exito-perfil-tecnico">¡Seguimiento guardado correctamente!</h2>
            <div className="contenedor-botones-perfil-tecnico">
              <button className="btn-aceptar-datosT-Tecnico" onClick={manejarAceptarExitoSeguimiento}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR RESOLUCIÓN DIRECTA */}
      {modalConfirmar_DT && (
        <div className="overlay-modal-datosT-Tecnico">
          <div className="modal-confirmar-DT">
            <h2 className="titulo-pregunta-DT">¿El ticket está resuelto?</h2>
            <p>Para cerrarlo completamente usa el botón de <b>Seguimiento del ticket</b> y cambia el estado a resuelto.</p>
            <div className="flex-botones-DT">
              <button className="btn-cancelar-DT" onClick={() => setModalConfirmar_DT(false)}>Regresar</button>
              <button className="btn-aceptar-pregunta-DT" onClick={confirmarResolucion}>Aceptar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EXITO GENERAL */}
      {modalExito_datosT_Tecnico && (
        <div className="overlay-modal-datosT-Tecnico">
          <div className="modal-exito-datosT-Tecnico">
            <h2 className="ventana-texto">¡Ticket procesado correctamente!</h2>
            <button className="btn-aceptar-datosT-Tecnico" onClick={() => navigate_datosT_Tecnico('/pendientesTecnico')}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatosTicketTecnico;