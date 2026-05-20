//La pantalla de nuevoTicketU.jsx y nuevoTicket.js
//Esta pantalla es para que el usuario levante un ticket en el sistema.
// USUARIO

import React, { useState, useEffect } from 'react'; 
import '../styles/nuevoTicketU.css';
import { useNavigate, Link } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

// 1. Mapeo de subcategorías por categoría
const SUBCATEGORIAS_MAP = {
   Hardware: [
      "Fallo de encendido", 
      "Lentitud en equipo", 
      "Equipo congelado", 
      "Problemas de Periféricos", 
      "Problemas de Impresión", 
      "Daño físico",
      "Añadir mas RAM a mi laptop"
   ],
   Software: [
      "Instalación de software", 
      "Actualización de software", 
      "Error en el Sistema Operativo", 
      "Fallo de Correo Electrónico", 
      "Problema con Software de Empresa", 
      "Sospecha de virus"
   ],
   Redes: [
      "Sin acceso a Internet en mi computadora", 
      "Problemas con el Wi-Fi", 
      "Fallo de conexión VPN", 
      "Carpetas compartidas",
      "Cambiar nombre en telefono fijo"
   ],
   Accesos: [
      "Restablecer contraseña", 
      "Alta de nuevo ingreso", 
      "Baja de usuario", 
      "Permisos especiales"
   ],
   Mantenimiento: [
      "Mantenimiento preventivo", 
      "Respaldo de información", 
      "Mudanza / Reubicación de equipo",
      "Mantenimiento de impresora",
      "Instalacion de tóner",
      "Cambio de tóner"
   ],
   Prestamo: [
      "Cable Ethernet", 
      "Proyector", 
      "Bocina portatil mini", 
      "Laptop (disponible en soporte)",
      "Telefono fijo",
      "Monitor",
      "Teclado",
      "Mouse",
      "Regulador de voltaje",
      "Multicontacto",
      "Escaner",
      "Cable VGA", 
      "Cable HDMI", 
      "Cargador de computadora HP", 
      "Cargador de computadora Lenovo", 
      "Cargador de computadora Dell", 
      "Cargador de computadora Thinkpad"
   ],
   Otra: [] 
};

function NuevoTicketU() {
   const navigate = useNavigate();
   const [mostrarModal, setMostrarModal] = useState(false);
   const [misEquipos, setMisEquipos] = useState([]); 

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
      const { name, value } = e.target;

      if (name === "categoria") {
         setTicket({
            ...ticket,
            categoria: value,
            otra_categoria: '',
            subcategoria: '',
            otra_subcategoria: '',
            equipo_id: '' // Reiniciamos el equipo al cambiar categoría
         });
      } else if (name === "subcategoria") {
         setTicket({
            ...ticket,
            subcategoria: value,
            otra_subcategoria: ''
         });
      } else {
         setTicket({ 
            ...ticket, 
            [name]: value 
         });
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!idUsuarioLogueado || !idBaseLogueado) {
         alert("No se detectó una sesión activa (faltan id_usuario o id_base en el localStorage).");
         return;
      }

      // Validación Condicional: Si NO es préstamo, obligar a seleccionar un equipo
      if (ticket.categoria !== 'Prestamo' && !ticket.equipo_id) {
         alert("Por favor, selecciona el equipo afectado.");
         return;
      }

      // Definimos qué ID numérico enviar al backend
      // Si es préstamo, enviamos un ID comodín existente (ej. 1). Si tienes otro ID asignado para "General", cámbialo aquí.
      const idEquipoFinal = ticket.categoria === 'Prestamo' ? 1 : parseInt(ticket.equipo_id, 10);

      const bodyData = {
         id_base: parseInt(idBaseLogueado, 10),
         id_usuario: parseInt(idUsuarioLogueado, 10),
         id_equipo: idEquipoFinal,
         categoria_servicio: ticket.categoria === 'Otra' ? ticket.otra_categoria : ticket.categoria,
         subcategoria_falla: ticket.subcategoria === 'Otra' ? ticket.otra_subcategoria : ticket.subcategoria,
         titulo_falla: ticket.titulo,
         descripcion_falla: ticket.descripcion,
         nivel_prioridad: ticket.prioridad,
         grado_impacto: ticket.impacto
      };

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
            alert("Error en el servidor: " + (data.error || data.detalle));
         }
      } catch (error) {
         console.error("Error de conexión:", error);
         alert("No se pudo conectar con el servidor.");
      }
   };

   const opcionesSubcategorias = ticket.categoria ? SUBCATEGORIAS_MAP[ticket.categoria] || [] : [];

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
                              <option value="Hardware">Hardware (Equipo y Componentes fisicos)</option>
                              <option value="Software">Software (Sistemas y Aplicaciones)</option>
                              <option value="Redes">Redes</option>
                              <option value="Accesos">Cuenta, Accesos y Contraseñas</option>
                              <option value="Mantenimiento">Mantenimiento y Servicios preventivos</option>
                              <option value="Prestamo">Préstamo de Equipamiento</option>
                              <option value="Otra">Otra</option>
                           </select>
                        </div>

                        {ticket.categoria === 'Otra' && (
                           <div className='grupo-input campo-extra'>
                              <label><span className='requerido'>*</span>Especifique Categoría</label>
                              <input type="text" name="otra_categoria" value={ticket.otra_categoria} onChange={handleChange} required placeholder="¿Qué tipo de servicio es?" />
                           </div>
                        )}

                        <div className='grupo-input'>
                           <label><span className='requerido'>*</span>Subcategoría de falla</label>
                           <select name="subcategoria" value={ticket.subcategoria} onChange={handleChange} required>
                              <option value="">Seleccione...</option>
                              {opcionesSubcategorias.map((sub, index) => (
                                 <option key={index} value={sub}>{sub}</option>
                              ))}
                              {ticket.categoria && <option value="Otra">Otra</option>}
                           </select>
                        </div>

                        {ticket.subcategoria === 'Otra' && (
                           <div className='grupo-input campo-extra'>
                              <label><span className='requerido'>*</span>Especifique subcategoría</label>
                              <input type="text" name="otra_subcategoria" value={ticket.otra_subcategoria} onChange={handleChange} required placeholder="Escribe el fallo aquí" />
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
                           <label><span className='requerido'>*</span>Descripción ¿qué sucede?</label>
                           <textarea name='descripcion' value={ticket.descripcion} onChange={handleChange} required placeholder="Detalla el problema..."/>
                        </div>

                        {/* El campo Equipo afectado cambia dinámicamente si es un préstamo */}
                        <div className='grupo-input'>
                           <label>
                              {ticket.categoria !== 'Prestamo' && <span className='requerido'>*</span>}
                              Equipo afectado
                           </label>
                           <select 
                              name="equipo_id" 
                              value={ticket.categoria === 'Prestamo' ? "" : ticket.equipo_id} 
                              onChange={handleChange} 
                              required={ticket.categoria !== 'Prestamo'}
                              disabled={ticket.categoria === 'Prestamo'}
                              className={ticket.categoria === 'Prestamo' ? "input-readonly" : ""}
                           >
                              {ticket.categoria === 'Prestamo' ? (
                                 <option value="">Solicito préstamo (No aplica equipo)</option>
                              ) : (
                                 <>
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
                                 </>
                              )}
                           </select>
                        </div>
                        {ticket.categoria !== 'Prestamo' && (
                           <Link to="/equipoRegistro" className="link-registrar-equipo">+ Registrar nuevo equipo</Link>
                        )}
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