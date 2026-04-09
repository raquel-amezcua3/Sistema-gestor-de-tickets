import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/detalleTicketU.css';
import HeaderPU from '../components/HeaderPU';

function DetalleTicketU() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Estados para los datos del ticket (dinámicos)
  const [ticketData, setTicketData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    fecha: '',
    tecnico: '',
    estado: ''
  });
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [cargando, setCargando] = useState(true);

  // 2. Efecto para cargar los datos reales al entrar
  useEffect(() => {
    const obtenerDetalle = async () => {
      try {
        const response = await fetch(`http://localhost:3000/detalle-ticket/${id}`);
        const data = await response.json();

        if (response.ok) {
          setTicketData(data);
          setTitulo(data.titulo); // Cargamos el título de la BD
          setDescripcion(data.descripcion); // Cargamos la descripción de la BD
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

  // 3. Función para guardar los cambios en la BD
  const handleGuardar = async () => {
    try {
      const response = await fetch(`http://localhost:3000/detalle-ticket/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, descripcion })
      });

      if (response.ok) {
        setMostrarModal(true);
      } else {
        alert("No se pudieron guardar los cambios");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleSeguimiento = () => {
    navigate(`/seguimientoTicketU/${id}`);
  };

  const cerrarModalYNavegar = () => {
    setMostrarModal(false);
    navigate('/pendientesTicketU'); 
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
                <input type="text" value={ticketData.nombre} readOnly className='input-readonly-detalle-TU' />
              </div>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Fecha de creación</label>
                <input type="text" value={ticketData.fecha} readOnly className='input-readonly-detalle-TU' />
              </div>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Tecnico encargado</label>
                <input type="text" value={ticketData.tecnico || 'Pendiente'} readOnly className='input-readonly-detalle-TU' />
              </div>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Estado del ticket</label>
                <input type="text" value={ticketData.estado} readOnly className='input-readonly-detalle-TU' />
              </div>
            </div>

            {/* Columna Derecha */}
            <div className='columna-detalle-TU'>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Correo</label>
                <input type="text" value={ticketData.correo} readOnly className='input-readonly-detalle-TU' />
              </div>
              <div className='grupo-input-detalle-TU'>
                <label className='label-campo-detalle-TU'>Telefono</label>
                <input type="text" value={ticketData.telefono} readOnly className='input-readonly-detalle-TU' />
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