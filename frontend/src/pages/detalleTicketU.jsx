import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/detalleTicketU.css';
import HeaderPU from '../components/HeaderPU';

function DetalleTicketU() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Estados para el formulario y el Modal
  const [titulo, setTitulo] = useState('Error de Login');
  const [descripcion, setDescripcion] = useState('No reconoce la contraseña al intentar ingresar');
  const [mostrarModal, setMostrarModal] = useState(false);

  // 2. Función para mostrar el modal de guardado
  const handleGuardar = () => {
    setMostrarModal(true);
  };

  // 3. Función para ir a la pantalla de seguimiento
  const handleSeguimiento = () => {
    navigate(`/seguimientoTicketU/${id}`);
  };

  // 4. Función para cerrar y redirigir
  const cerrarModalYNavegar = () => {
    setMostrarModal(false);
    navigate('/pendientesTicketU'); 
  };

  return (
    <div className='container-detalle-TU'>
      <HeaderPU />
      
      <main className='content-detalle-TU'>
        <h2 className='titulo-pagina-detalle-TU'>Detalles del ticket</h2>

        <div className='card-detalle-TU'>
          <div className='header-card-detalle-TU'>
            <div className='ticket-info-detalle-TU'>
              <img src="/img/mis-tickets.png" alt="Icono Ticket" className='icon-ticket-detalle-TU' />
              <span className='label-ticket-detalle-TU'>Ticket</span>
            </div>
            <p className='aviso-edicion-detalle-TU'>
              *Solo se puede cambiar el título y la descripción
            </p>
          </div>

          <div className='grid-form-detalle-TU'>
            {/* Columna Izquierda */}
            <div className='columna-detalle-TU'>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>ID</label>
                <input type="text" value={id} readOnly className='input-readonly-detalle-TU' />
              </div>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Nombre de usuario</label>
                <input type="text" value="Juan Pérez" readOnly className='input-readonly-detalle-TU' />
              </div>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Fecha de creación</label>
                <input type="text" value="2026-03-10" readOnly className='input-readonly-detalle-TU' />
              </div>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Tecnico encargado</label>
                <input type="text" value="Carlos M." readOnly className='input-readonly-detalle-TU' />
              </div>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Estado del ticket</label>
                <input type="text" value="Abierto" readOnly className='input-readonly-detalle-TU' />
              </div>
            </div>

            {/* Columna Derecha */}
            <div className='columna-detalle-TU'>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Correo</label>
                <input type="text" value="juan.perez@bodesa.com" readOnly className='input-readonly-detalle-TU' />
              </div>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Telefono</label>
                <input type="text" value="312 123 4567" readOnly className='input-readonly-detalle-TU' />
              </div>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Titulo del ticket</label>
                <input 
                  type="text" 
                  value={titulo} 
                  onChange={(e) => setTitulo(e.target.value)} 
                  className='input-editable-detalle-TU' 
                />
              </div>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Descripción</label>
                <textarea 
                  value={descripcion} 
                  onChange={(e) => setDescripcion(e.target.value)} 
                  className='textarea-detalle-TU'
                />
              </div>
            </div>
          </div>

          {/* Contenedor de Botones Actualizado */}
          <div className='container-boton-detalle-TU'>
            <button onClick={handleSeguimiento} className='boton-seguimiento-detalle-TU'>
              Seguimiento de ticket
            </button>
            <button onClick={handleGuardar} className='boton-guardar-detalle-TU'>
              Guardar cambios
            </button>
          </div>
        </div>
      </main>

      {/* Ventana emergente (Modal) */}
      {mostrarModal && (
        <div className='overlay-modal-detalle-TU'>
          <div className='modal-exito-detalle-TU'>
            <div className='contenedor-check-detalle-TU'>
              <span className='check-animado-detalle-TU'>L</span> 
            </div>
            <h2 className='titulo-DTU'>Cambios guardados correctamente</h2>
            <button 
              className='btn-aceptar-detalle-TU' 
              onClick={cerrarModalYNavegar}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetalleTicketU;