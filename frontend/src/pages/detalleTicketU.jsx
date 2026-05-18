//Esta pantalla es para ver los detalles del ticket del usaurio, el .js es detalleTicket.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/detalleTicketU.css';
import HeaderPU from '../components/HeaderPU';

function DetalleTicketU() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados alineados con las propiedades de la base de datos
  const [ticketData, setTicketData] = useState({
    nombre_usuario: '',
    correo: '',
    telefono: '',
    fecha: '',
    tecnico_status: '',
    estado: '',
    categoria_servicio: '',
    subcategoria_falla: '',
    nivel_prioridad: '',
    grado_impacto: '',
    equipo_afectado: ''
  });

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDetalle = async () => {
      try {
        const response = await fetch(`/api/detalle-ticket/${id}`);
        const data = await response.json();

        if (response.ok) {
          setTicketData(data);
          setTitulo(data.titulo_falla || '');
          setDescripcion(data.descripcion_falla || '');
        } else {
          console.error("Error al obtener detalle:", data.error);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerDetalle();
  }, [id]);

  const handleGuardar = async () => {
    try {
      const response = await fetch(`/api/detalle-ticket/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          titulo_falla: titulo, 
          descripcion_falla: descripcion 
        })
      });

      if (response.ok) {
        setMostrarModal(true);
      } else {
        const errorData = await response.json();
        alert(`No se pudieron guardar los cambios: ${errorData.error || ''}`);
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  if (cargando) return <div style={{textAlign: 'center', padding: '50px'}}>Cargando detalles...</div>;

  return (
    <div className='container-detalle-TU'>
      <HeaderPU />
      
      <main className='content-detalle-TU'>
        <h2 className='titulo-pagina-detalle-TU'>Detalles del ticket</h2>

        <div className='card-detalle-TU'>
          <div className='header-card-detalle-TU'>
            <div className='ticket-info-detalle-TU'>
              <img src="/img/mis-tickets.png" alt="Icono Ticket" className='icon-ticket-detalle-TU' />
              <span className='label-ticket-detalle-TU'>Ticket #{id}</span>
            </div>
            <p className='aviso-edicion-detalle-TU'>
              *Solo se puede cambiar el título y la descripción
            </p>
          </div>

          <div className='grid-form-detalle-TU'>
            {/* Columna Izquierda */}
            <div className='columna-detalle-TU'>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Nombre de usuario</label>
                <input type="text" value={ticketData.nombre_usuario || ''} readOnly className='input-readonly-detalle-TU' />
              </div>

              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Categoría de servicios</label>
                <input type="text" value={ticketData.categoria_servicio || ''} readOnly className='input-readonly-detalle-TU' />
              </div>

              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Subcategoría de falla</label>
                <input type="text" value={ticketData.subcategoria_falla || ''} readOnly className='input-readonly-detalle-TU' />
              </div>

              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Nivel de prioridad</label>
                <input type="text" value={ticketData.nivel_prioridad || ''} readOnly className='input-readonly-detalle-TU' />
              </div>

              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Grado de impacto</label>
                <input type="text" value={ticketData.grado_impacto || ''} readOnly className='input-readonly-detalle-TU' />
              </div>
              
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Fecha de creación</label>
                <input type="text" value={ticketData.fecha || ''} readOnly className='input-readonly-detalle-TU' />
              </div>
            </div>

            {/* Columna Derecha */}
            <div className='columna-detalle-TU'>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Estado del ticket</label>
                <input type="text" value={ticketData.estado || ''} readOnly className='input-readonly-detalle-TU' />
              </div>

              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Título de la falla</label>
                <input 
                  type="text" 
                  value={titulo} 
                  onChange={(e) => setTitulo(e.target.value)} 
                  className='input-editable-detalle-TU' 
                />
              </div>

              <div className='grupo-input-detalle-TU area-texto-detalle'>
                <label className='label-campo-detalle-TU'>Descripción ¿qué sucede?</label>
                <textarea 
                  value={descripcion} 
                  onChange={(e) => setDescripcion(e.target.value)} 
                  className='textarea-detalle-TU'
                />
              </div>

              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Equipo afectado</label>
                <input type="text" value={ticketData.equipo_afectado || 'Ninguno'} readOnly className='input-readonly-detalle-TU' />
              </div>
            </div>
          </div>

          <div className='container-boton-detalle-TU'>
            <button onClick={() => navigate(`/seguimientoTicketU/${id}`)} className='boton-seguimiento-detalle-TU'>
              Seguimiento de ticket
            </button>
            <button onClick={handleGuardar} className='boton-guardar-detalle-TU'>
              Guardar cambios
            </button>
          </div>
        </div>
      </main>

      {/* VENTANA EMERGENTE ORIGINAL CENTRADA (CORREGIDA) */}
      {mostrarModal && (
        <div className='overlay-modal'>
          <div className='modal-exito'>
            <div className='contenedor-check'>
              <img className='icono-exito' alt='exito' src='/img/comprobado.png' style={{ width: '80px', height: 'auto' }} />
            </div>
            <h2>Cambios guardados correctamente</h2>
            <button className='btn-aceptar' onClick={() => { setMostrarModal(false); navigate('/pendientesTicketU'); }}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetalleTicketU;