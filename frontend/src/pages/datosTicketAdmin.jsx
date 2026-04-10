import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/datosTicketAdmin.css';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function DatosTicketAdmin() {
  const { id } = useParams();
  const navigate_datos_admin = useNavigate();
  const [mostrarModal_datos_admin, setMostrarModal_datos_admin] = useState(false);
  const [tecnicos, setTecnicos] = useState([]); // Estado para la lista de técnicos reales

  const [ticket_datos_admin, setTicket_datos_admin] = useState({
    id: id || '101',
    nombre_usuario: '',
    correo: '',
    telefono: '',
    extension: '',
    titulo: '',
    descripcion: '',
    tecnico_asignado: '' // Aquí guardaremos el ID del técnico seleccionado
  });

  // 1. Cargar la lista de técnicos (Rol 2) y los datos del ticket al montar el componente
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        // Obtener técnicos
        const resTec = await fetch('http://localhost:3000/admin/usuarios/tecnicos');
        const dataTec = await resTec.json();
        setTecnicos(dataTec);

        // Obtener datos del ticket actual
        const resTick = await fetch(`http://localhost:3000/detalle-ticket/${id}`);
        const dataTick = await resTick.json();
        
        if (resTick.ok) {
          setTicket_datos_admin({
            id: dataTick.id_ticket,
            nombre_usuario: dataTick.nombre_usuario,
            correo: dataTick.correo,
            telefono: dataTick.telefono,
            extension: dataTick.extension,
            titulo: dataTick.titulo,
            descripcion: dataTick.descripcion,
            tecnico_asignado: dataTick.id_tecnico || ''
          });
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    cargarDatosIniciales();
  }, [id]);

  // 2. Función para actualizar el técnico y cambiar estado a 'en proceso'
  const handleActualizar_datos_admin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/admin/asignar-tecnico', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_ticket: ticket_datos_admin.id,
          id_tecnico: ticket_datos_admin.tecnico_asignado
        })
      });

      if (response.ok) {
        setMostrarModal_datos_admin(true);
      } else {
        alert("Error al actualizar los datos en el servidor");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  const cerrarModal_datos_admin = () => {
    setMostrarModal_datos_admin(false);
    navigate_datos_admin('/asignarAdmin'); // Te regresa a la tabla de asignación
  };

  return (
    <div className="container-datos-ticket-admin">
      <EncabezadoAdmin />

      <main className="contenido-datos-ticket-admin">
        <h2 className="titulo-pagina-datos-admin">Datos del ticket</h2>

        <div className="card-datos-ticket-admin">
          <div className="header-card-datos-admin">
            <img src="/img/nuevo-ticket.png" alt="icono" className="icono-datos-admin" />
            <h3>Datos del ticket #{ticket_datos_admin.id}</h3>
          </div>

          <form onSubmit={handleActualizar_datos_admin} className="form-datos-ticket-admin">
            
            <div className="grid-formulario-datos-admin">
              
              {/* COLUMNA 1: DATOS USUARIO */}
              <div className="columna-datos-admin">
                <div className="grupo-input-datos-admin">
                  <label>Nombre de usuario</label>
                  <input type="text" value={ticket_datos_admin.nombre_usuario} readOnly />
                </div>

                <div className="grupo-input-datos-admin">
                  <label>Correo electrónico</label>
                  <input type="email" value={ticket_datos_admin.correo} readOnly />
                </div>

                <div className="grupo-input-datos-admin">
                  <label>Teléfono</label>
                  <input type="text" value={ticket_datos_admin.telefono} readOnly />
                </div>

                <div className="grupo-input-datos-admin">
                  <label>Extensión</label>
                  <input type="text" value={ticket_datos_admin.extension} readOnly />
                </div>

                <div className="grupo-input-datos-admin">
                  <label>Título del problema</label>
                  <input type="text" value={ticket_datos_admin.titulo} readOnly />
                </div>
              </div>

              {/* COLUMNA 2: TÉCNICO Y DESCRIPCIÓN */}
              <div className="columna-datos-admin">
                <div className="grupo-input-datos-admin">
                  <label className='tecnico-label-admin' >Técnico Asignado</label>
                  <select 
                    className='tecnico-select-admin'
                    required
                    value={ticket_datos_admin.tecnico_asignado} 
                    onChange={(e) => setTicket_datos_admin({...ticket_datos_admin, tecnico_asignado: e.target.value})}
                  >
                    <option value="">-- Seleccione un técnico --</option>
                    {tecnicos.map((tec) => (
                      <option key={tec.id_usuario} value={tec.id_usuario}>
                        {tec.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grupo-input-datos-admin" style={{ alignItems: 'flex-start' }}>
                  <label className='descripcion-label-admin' style={{ marginTop: '10px' }}>Descripción</label>
                  <textarea 
                    className="textarea-datos-admin"
                    value={ticket_datos_admin.descripcion}
                    readOnly
                  />
                </div>
              </div>

            </div>

            <div className="contenedor-botones-datos-admin">
              <button type="submit" className="btn-actualizar-datos-admin">Actualizar datos</button>
            </div>
          </form>
        </div>
      </main>

      {mostrarModal_datos_admin && (
        <div className="overlay-modal-datos-admin">
          <div className="modal-exito-datos-admin">
            <div className='contenedor-check-datos-admin'>
              <span className='check-animado-detalle-TU'>L</span> 
            </div>
            <h2 className='ventana-texto' >¡Datos actualizados!</h2>
            <button className="btn-aceptar-datos-admin" onClick={cerrarModal_datos_admin}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatosTicketAdmin;