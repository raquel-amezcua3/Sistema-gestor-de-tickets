//El .js de esta pantalla es nuevoTicket.js
// NuevoTicketU.jsx
import React, { useState, useEffect } from 'react'; 
import '../styles/nuevoTicketU.css';
import { useNavigate, Link } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function NuevoTicketU() {
   const navigate = useNavigate();
   const [mostrarModal, setMostrarModal] = useState(false);
   const [misEquipos, setMisEquipos] = useState([]); 

   // Extraemos los IDs desde el localStorage
   const idUsuarioLogueado = localStorage.getItem('id_usuario'); 
   const idBaseLogueado = localStorage.getItem('id_base');       

   const [ticket, setTicket] = useState({
      categoria: '',
      otra_categoria: '',
      subcategoria: '',
      otra_subcategoria: '',
      prioridad: '',
      impacto: '',
      titulo: '',
      descripcion: '',
      equipo_id: ''
   });

   useEffect(() => {
      const obtenerEquipos = async () => {
         if (!idBaseLogueado) return; 
         try {
            const response = await fetch(`http://localhost:3000/api/equipo/usuario/${idBaseLogueado}`);
            if (response.ok) {
               const datos = await response.json();
               setMisEquipos(datos);
            } else {
               console.error("Error al consultar el endpoint de equipos");
            }
         } catch (error) {
            console.error("Error de red al obtener equipos:", error);
         }
      };

      obtenerEquipos();
   }, [idBaseLogueado]);

   const handleChange = (e) => {
      setTicket({ 
         ...ticket, 
         [e.target.name]: e.target.value 
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      // Validación preventiva en el cliente
      if (!idUsuarioLogueado || !idBaseLogueado) {
         alert("No se detectó una sesión activa (faltan id_usuario o id_base en el localStorage).");
         return;
      }

      if (!ticket.equipo_id) {
         alert("Por favor, selecciona el equipo afectado.");
         return;
      }

      // Estructuramos el cuerpo asegurando conversiones limpias a números enteros
      const bodyData = {
         id_base: parseInt(idBaseLogueado, 10),
         id_usuario: parseInt(idUsuarioLogueado, 10),
         id_equipo: parseInt(ticket.equipo_id, 10),
         categoria_servicio: ticket.categoria === 'Otra' ? ticket.otra_categoria : ticket.categoria,
         subcategoria_falla: ticket.subcategoria === 'Otra' ? ticket.otra_subcategoria : ticket.subcategoria,
         titulo_falla: ticket.titulo,
         descripcion_falla: ticket.descripcion,
         nivel_prioridad: ticket.prioridad,
         grado_impacto: ticket.impacto
      };

      // 🔥 HIKING DE CONTROL: Abre tu consola del navegador (F12) para validar qué datos se envían
      console.log("Datos enviados al servidor en bodyData:", bodyData);

      try {
         const response = await fetch('http://localhost:3000/api/tickets/crear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
         });

         const data = await response.json();

         if (response.ok) {
            setMostrarModal(true); 
            setTicket({
               categoria: '', otra_categoria: '', subcategoria: '', otra_subcategoria: '',
               prioridad: '', impacto: '', titulo: '', descripcion: '', equipo_id: ''
            });
         } else {
            // Te mostrará detalladamente si es un error de validación o base de datos
            alert("Error en el servidor: " + (data.error || data.detalle));
         }
      } catch (error) {
         console.error("Error de conexión:", error);
         alert("No se pudo conectar con el servidor.");
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
                     
                     {/* COLUMNA IZQUIERDA */}
                     <div className='columna-formulario'>
                        <div className='grupo-input'>
                           <label><span className='requerido'>*</span>Nombre de usuario</label>
                           <input
                              type="text"
                              value={localStorage.getItem('usuarioNombre') || 'Usuario'}
                              readOnly
                              className="input-readonly"
                           />
                        </div>

                        <div className='grupo-input'>
                           <label><span className='requerido'>*</span>Categoría de servicios</label>
                           <select name="categoria" value={ticket.categoria} onChange={handleChange} required>
                              <option value="">Seleccione...</option>
                              <option value="Hardware">Hardware</option>
                              <option value="Software">Software</option>
                              <option value="Redes">Redes</option>
                           </select>
                        </div>

                        <div className='grupo-input'>
                           <label><span className='requerido'>*</span>Subcategoría de falla</label>
                           <select name="subcategoria" value={ticket.subcategoria} onChange={handleChange} required>
                              <option value="">Seleccione...</option>
                              <option value="Fallo de encendido">Fallo de encendido</option>
                              <option value="Lentitud">Lentitud</option>
                              <option value="Virus">Virus</option>
                              <option value="Otra">Otra</option>
                           </select>
                        </div>
                        {ticket.subcategoria === 'Otra' && (
                           <div className='grupo-input campo-extra'>
                              <label>Especifique subcategoría</label>
                              <input type="text" name="otra_subcategoria" value={ticket.otra_subcategoria} onChange={handleChange} required />
                           </div>
                        )}

                        <div className='grupo-input'>
                           <label><span className='requerido'>*</span>Nivel de prioridad</label>
                           <select name="prioridad" value={ticket.prioridad} onChange={handleChange} required>
                              <option value="">Seleccione...</option>
                              <option value="Baja">Baja</option>
                              <option value="Media">Media</option>
                              <option value="Alta">Alta</option>
                           </select>
                        </div>

                        <div className='grupo-input'>
                           <label><span className='requerido'>*</span>Grado de impacto</label>
                           <select name="impacto" value={ticket.impacto} onChange={handleChange} required>
                              <option value="">Seleccione...</option>
                              <option value="Individual">Individual</option>
                              <option value="Departamento">Departamento</option>
                              <option value="Empresa">Empresa</option>
                           </select>
                        </div>

                        <div className='grupo-input'>
                           <label><span className='requerido'>*</span>Fecha de creación</label>
                           <input type="text" value={new Date().toLocaleDateString('es-MX')} readOnly className="input-readonly"/>
                        </div>
                     </div>

                     {/* COLUMNA DERECHA */}
                     <div className='columna-formulario'>
                        <div className='grupo-input'>
                           <label><span className='requerido'>*</span>Estado del ticket</label>
                           <input type="text" value="Abierto" readOnly className="input-readonly"/>
                        </div>

                        <div className='grupo-input'>
                           <label><span className='requerido'>*</span>Título de la falla</label>
                           <input type="text" name='titulo' value={ticket.titulo} onChange={handleChange} required placeholder="Resumen corto"/>
                        </div>

                        <div className='grupo-input area-texto'>
                           <label>
                              <span className='requerido'>*</span>Descripción ¿qué sucede?
                           </label>
                           <textarea 
                              name='descripcion' 
                              value={ticket.descripcion} 
                              onChange={handleChange} 
                              required 
                              placeholder="Detalla el problema..."
                           />
                        </div>

                        <div className='grupo-input'>
                           <label><span className='requerido'>*</span>Equipo afectado</label>
                           <select name="equipo_id" value={ticket.equipo_id} onChange={handleChange} required>
                              <option value="">Seleccione un equipo...</option>
                              {misEquipos.length > 0 ? (
                                 misEquipos.map((eq) => (
                                    <option key={eq.id_equipo} value={eq.id_equipo}>
                                       {eq.tipo_equipo} {eq.marca} - S/N: {eq.numero_serie}
                                    </option>
                                 ))
                              ) : (
                                 <option value="" disabled>No tienes equipos registrados</option>
                              )}
                           </select>
                        </div>
                        <Link to="/equipoRegistro" className="link-registrar-equipo">+ Registrar nuevo equipo</Link>
                     </div>
                  </div>

                  <div className='contenedor-boton'>
                     <button type='submit' className='btn-enviar'>Enviar</button>
                  </div>
               </form>
            </div>
         </main>

         {mostrarModal && (
            <div className='overlay-modal'>
               <div className='modal-exito'>
                  <div className='contenedor-check'>
                     <img className='icono-exito' alt='exito' src='/img/comprobado.png' style={{ width: '80px', height: 'auto' }} />
                  </div>
                  <h2>¡El ticket se ha enviado con éxito!</h2>
                  <p style={{ color: '#333', marginBottom: '20px' }}>Pronto se te asignará un técnico para resolver tu problema.</p>
                  <button className='btn-aceptar' onClick={() => { setMostrarModal(false); navigate('/principalUsuario'); }}>
                     Aceptar
                  </button>
               </div>
            </div>
         )}
      </div>
   );
}
export default NuevoTicketU;