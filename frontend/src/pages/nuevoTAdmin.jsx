import React, { useState } from 'react'; 
import '../styles/nuevoTAdmin.css';
import { useNavigate } from 'react-router-dom';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function NuevoTAdmin() {
   const navigate = useNavigate();
   const [mostrarModal, setMostrarModal] = useState(false);

   // Estado inicial actualizado con especialidad
   const [nuevo_tecnico, setNuevo_tecnico] = useState({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      extension: '',
      puesto: '',
      ubicacion: '',
      especialidad: '', // <- Agregado
      contrasena: '',
      confirmarContrasena: '' 
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      
      if (name === 'confirmarContrasena') {
         if (value !== nuevo_tecnico.contrasena) {
            e.target.setCustomValidity("Las contraseñas no coinciden");
         } else {
            e.target.setCustomValidity("");
         }
      }

      if (name === 'contrasena') {
         const inputConfirmar = document.getElementsByName('confirmarContrasena')[0];
         if (inputConfirmar && value !== nuevo_tecnico.confirmarContrasena) {
            inputConfirmar.setCustomValidity("Las contraseñas no coinciden");
         } else if (inputConfirmar) {
            inputConfirmar.setCustomValidity("");
         }
      }

      setNuevo_tecnico({ ...nuevo_tecnico, [name]: value });
   };

   const handleSubmit = async (e) => {
     e.preventDefault();

     try {
       const response = await fetch('/api/admin/registrar-tecnico/registrar', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(nuevo_tecnico),
       });

       if (response.ok) {
         setMostrarModal(true); 
       } else {
         const errorData = await response.json();
         alert(errorData.error || "Error al registrar");
       }
     } catch (error) {
       console.error("Error de red:", error);
       alert("No hay conexión con el servidor");
     }
   };

   const cerrarModalYNavegar = () => {
      setMostrarModal(false);
      navigate('/listaAdmin'); 
   };

   return (
     <div className='container-nuevo-T-admin'>
        <EncabezadoAdmin/>

        <main className='contenido-nuevo-T-admin'>
            <h2 className='titulo-pagina-nuevo-T-admin'>Registro para nuevo tecnico</h2>

            <div className='card-nuevo-T-admin'>
               <div className='seccion-formulario-nuevo-T-admin'>
                 <div className='header-formulario-nuevo-T-admin'>
                    <img className='icono-nuevo-T-admin' alt='icono' src='/img/nuevo-ticket.png' />
                    <h3>Nuevo tecnico</h3>
                 </div>

                 <form onSubmit={handleSubmit} className='form-nuevo-T-admin'>
                   <div className='inputs-nuevo-T-admin'>
                     
                     <div className='grupo-input-nuevo-T-admin'>
                       <label><span className='rojo-nuevo-T-admin'>*</span>Nombre</label>
                       <input type="text" name="nombre" required value={nuevo_tecnico.nombre} onChange={handleChange} />
                     </div>

                     <div className='grupo-input-nuevo-T-admin'>
                       <label><span className='rojo-nuevo-T-admin'>*</span>Correo electronico</label>
                       <input type="email" name="correo" required value={nuevo_tecnico.correo} onChange={handleChange} />
                     </div>

                     <div className='grupo-input-nuevo-T-admin'>
                       <label><span className='rojo-nuevo-T-admin'>*</span>Telefono</label>
                       <input type="text" name="telefono" required value={nuevo_tecnico.telefono} onChange={handleChange} maxLength="10" />
                     </div>

                     <div className='grupo-input-nuevo-T-admin'>
                       <label>Extension</label>
                       <input type="text" name="extension" value={nuevo_tecnico.extension} onChange={handleChange} />
                     </div>

                     <div className='grupo-input-nuevo-T-admin'>
                       <label><span className='rojo-nuevo-T-admin'>*</span>Especialidad</label>
                       <input type="text" name="especialidad" required value={nuevo_tecnico.especialidad} onChange={handleChange} />
                     </div>

                     <div className='grupo-input-nuevo-T-admin'>
                       <label><span className='rojo-nuevo-T-admin'>*</span>Contraseña</label>
                       <input type="password" name="contrasena" required value={nuevo_tecnico.contrasena} onChange={handleChange} />
                     </div>

                     <div className='grupo-input-nuevo-T-admin'>
                       <label><span className='rojo-nuevo-T-admin'>*</span>Repetir Contraseña</label>
                       <input type="password" name="confirmarContrasena" required value={nuevo_tecnico.confirmarContrasena} onChange={handleChange} />
                     </div>
                   </div>

                   <div className='contenedor-boton-nuevo-T-admin'>
                     <button type='submit' className='btn-agregar-nuevo-T-admin'>Registrar</button>
                   </div>
                 </form>
               </div>

               <div className='seccion-imagen-nuevo-T-admin'>
                  <img src='/img/servicios.webp' alt='decoracion' className='img-decorativa-nuevo-T-admin' />
               </div>
            </div>
        </main>

        {mostrarModal && (
          <div className='overlay-modal-nuevo-T-admin'>
            <div className='modal-exito-nuevo-T-admin'>
              <div className='contenedor-check-nuevo-T-admin'>
                 <img src="/img/tecnico.png" alt="check" className="img-check-modal-T" />
              </div>
              <h2 className='titulo-modal-T'>¡Técnico registrado correctamente!</h2>
              <button className='btn-aceptar-nuevo-T-admin' onClick={cerrarModalYNavegar}>
                Aceptar
              </button>
            </div>
          </div>
        )}
     </div>
   );
}

export default NuevoTAdmin;