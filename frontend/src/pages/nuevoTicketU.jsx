import React, { useState } from 'react'; 
import '../styles/nuevoTicketU.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function NuevoTicketU() {
   const navigate = useNavigate();
   const [mostrarModal, setMostrarModal] = useState(false);

   // 1. Estado para los campos del formulario
   const [ticket, setTicket] = useState({
     titulo: '',
     descripcion: ''
   });

   // Manejar cambios en los inputs (esto actualiza el estado 'ticket')
   const handleChange = (e) => {
     setTicket({ 
       ...ticket, 
       [e.target.name]: e.target.value 
     });
   };

   // 2. Función para enviar a la base de datos
   const handleSubmit = async (e) => {
     e.preventDefault();

     // Obtenemos el ID tal cual lo guardamos en el Login ('id_usuario')
     const idGuardado = localStorage.getItem('id_usuario');

     // Validación previa: si no hay ID, no dejamos que falle el backend
     if (!idGuardado || idGuardado === "undefined") {
       alert("No se detectó una sesión activa. Por favor, vuelve a iniciar sesión.");
       return;
     }

     const bodyData = {
       id_usuario: parseInt(idGuardado), // Lo convertimos a número entero
       titulo: ticket.titulo,
       descripcion: ticket.descripcion
     };

     console.log("Datos que viajan al servidor:", bodyData);

     try {
       const response = await fetch('http://localhost:3000/tickets', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(bodyData),
       });

       const data = await response.json();

       if (response.ok) {
         setMostrarModal(true); 
         // Limpiamos el formulario para el siguiente reporte
         setTicket({ titulo: '', descripcion: '' });
       } else {
         // Si el servidor responde con 400 o 500, mostramos por qué
         alert("Error del servidor: " + (data.error || "No se pudo crear el ticket"));
       }
     } catch (error) {
       console.error("Error de conexión:", error);
       alert("No hay conexión con el servidor. Verifica que el backend esté encendido.");
     }
   };

   return (
     <div className='container-nuevoTicketU'>
       <HeaderPU/>

       <main className='contenido-ticket'>
          <h2 className='titulo-seccion'>Nuevo ticket</h2>

          <div className='cuadro-formulario'>
            <div className='encabezado-formulario'>
                <img className='icono-editar' alt='logo' src='/img/nuevo-ticket.png' />
                <h3>¿Qué falla presentas hoy?</h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className='grid-formulario'>
                
                {/* Nombre de usuario (Solo lectura) */}
                <div className='grupo-input'>
                  <label>Nombre de usuario</label>
                  <input
                      type="text"
                      value={localStorage.getItem('usuarioNombre') || 'Usuario Invitado'}
                      readOnly
                      style={{ backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                    />
                </div>

                {/* Teléfono (Solo informativo) */}
                <div className='grupo-input'>
                  <label>Teléfono</label>
                  <input
                      type="text"
                      id='telefono'
                      name='telefono'
                  />
                </div>

                {/* Título - Campo obligatorio */}
                <div className='grupo-input'>
                  <label><span className='requerido'>*</span>Título</label>
                  <input 
                      type="text" 
                      name='titulo' // El 'name' debe ser idéntico a la clave en el useState
                      value={ticket.titulo}
                      onChange={handleChange}
                      required
                      minLength="5"
                      maxLength="50"
                      placeholder="Ej: Error en impresora"
                   />
                </div>
                
                {/* Descripción - Campo obligatorio */}
                <div className='grupo-input area-texto'>
                  <label><span className='requerido'>*</span>Descripción</label>
                  <textarea
                    name='descripcion' // El 'name' debe ser idéntico a la clave en el useState
                    rows="5"
                    value={ticket.descripcion}
                    onChange={handleChange}
                    required
                    minLength="10"
                    maxLength="513"
                    placeholder="Describe detalladamente el problema..."
                  ></textarea>
                </div>              

                <div className='grupo-input'>
                  <label>Fecha de creación</label>
                  <input 
                    type="date"
                    value={new Date().toLocaleDateString('en-CA')}
                    readOnly
                  />
                </div>

                <div className='grupo-input'>
                  <label>Estado del ticket</label>
                  <input
                    className="estado-ticket-abierto"
                    type="text"
                    value="Abierto"
                    readOnly
                  />
                </div>
              </div>

              <div className='contenedor-boton'>
                <button type='submit' className='btn-enviar'>Enviar ticket</button>
              </div>
            </form>
          </div>
       </main>

       {/* Ventana emergente de éxito */}
       {mostrarModal && (
         <div className='overlay-modal'>
           <div className='modal-exito'>
             <div className='contenedor-check'>
               <span className='check-animado'>L</span> 
             </div>
             <h2>Falla reportada correctamente</h2>
             <button 
               className='btn-aceptar' 
               onClick={() => {
                 setMostrarModal(false);
                 navigate('/pendientesTicketU'); 
               }}
             >
               Aceptar
             </button>
           </div>
         </div>
       )}
     </div>
   );
}

export default NuevoTicketU;