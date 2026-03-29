import React, { useState } from 'react'; 
import '../styles/nuevoTicketU.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function NuevoTicketU() {
   const navigate = useNavigate();
   
   
   const [mostrarModal, setMostrarModal] = useState(false);

   // Función para manejar el envío
   const handleSubmit = (e) => {
     e.preventDefault(); // Evita que la página se recargue
     setMostrarModal(true); // Muestra la ventana emergente
   };

   return (
     <div className='container-nuevoTicketU'>
       <HeaderPU/>

       <main className='contenido-ticket'>
          <h2 className='titulo-seccion'>Nuevo ticket</h2>

          <div className='cuadro-formulario'>
            <div className='encabezado-formulario'>
               <img className='icono-editar' alt='logo' src='/img/nuevo-ticket.png' />
               <h3>¿Que falla presentas hoy?</h3>
            </div>

            {/* Paso 3: Agregar onSubmit al formulario */}
            <form onSubmit={handleSubmit}>
              <div className='grid-formulario'>
                {/* Columna Izquierda */}
                <div className='grupo-input'>
                  <label><span className='requerido'>*</span>Nombre de usuario</label>
                  <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      required
                      minLength="3"
                      maxLength="20"
                      /* Esto sirve para que si no se pone de 3 a 20 caracteres en este input, va a salir este mensaje */
                      onInvalid={(e) =>
                        e.target.setCustomValidity("El nombre de usuario debe tener mínimo 3 caracteres y máximo 20")
                      }
                      onInput={(e) => e.target.setCustomValidity("")}
                    />
                </div>

                {/* Columna Derecha */}
                <div className='grupo-input'>
                  <label><span className='requerido'>*</span>Telefono</label>
                  <input
                      type="text"
                      id='number'
                      name='telefono'
                      required
                      pattern='\d{10}'
                      maxLength="10"
                      title='Debe tener exactamente 10 numeros'
                   />
                </div>

                 {/* Fila 2 */}
                <div className='grupo-input'>
                  <label><span className='requerido'>*</span>Titulo</label>
                  <input 
                      type="text" 
                      id='titulo-NT'
                      name='titulo-NT'
                      required
                      minLength="5"
                      maxLength="50"
                      onInvalid={(e) => e.target.setCustomValidity("El titulo debe tener mínimo 5 caracteres y máximo 50")}
                      onInput={(e) => e.target.setCustomValidity("")}
                   />
                </div>
                
                 {/* Para el cuadro de descripcion, y algunos requerimientos para que no inserten codigo desde ahi */}
                <div className='grupo-input area-texto'>
                  <label><span className='requerido'>*</span>Descripción</label>
                  <textarea
                    rows="5"
                    required
                    minLength="10"
                    maxLength="513"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[()<>]/g, "");
                      e.target.setCustomValidity("");
                    }}
                    onInvalid={(e) => e.target.setCustomValidity("La descripción debe tener mínimo 10 caracteres")}
                  ></textarea>
                </div>              

                {/* Fila 3 */}
                {/* Aqui la fecha se pone de manera automatica (solo se pone la del dia de hoy, no ayer, ni futuro)*/}
                <div className='grupo-input'>
                  <label><span className='requerido'>*</span>Fecha de creación</label>
                  <input 
                    type="date"
                    value={new Date().toLocaleDateString('en-CA')}
                    readOnly
                  />
                </div>

                {/* Fila 4 */}
                <div className='grupo-input'>
                  <label><span className='requerido'>*</span>Estado del ticket</label>
                  <input
                    className="estado-ticket-abierto"
                    type="text"
                    value="Abierto"
                    readOnly
                  />
                </div>

                {/* Fila 5 */}
                {/* Solo se puede poner el correo y es necesario poner el @ */}
                <div className='grupo-input'>
                  <label><span className='requerido'>*</span>Correo</label>
                  <input 
                    type="email" 
                    id="correo"
                    name="correo"
                    required
                    onInvalid={(e) => e.target.setCustomValidity("Ingrese un correo válido (debe contener @)")}
                    onInput={(e) => e.target.setCustomValidity("")}
                  />
                </div>
              </div>

              <div className='contenedor-boton'>
                <button type='submit' className='btn-enviar'>Enviar ticket</button>
              </div>
            </form>
          </div>
       </main>

       {/* Ventana emergente de cuando todos los campos estan llenos y listo para enviar el ticket */}
       {mostrarModal && (
         <div className='overlay-modal'>
           <div className='modal-exito'>
             <div className='contenedor-check'>
               <span className='check-animado'>L</span> 
             </div>
             <h2>Falla reportada correctamente</h2>
             <button 
               className='btn-aceptar' 
               onClick={() => setMostrarModal(false)}
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