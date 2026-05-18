import React, { useState, useEffect } from 'react';
import '../styles/perfilTecnico.css';
import { useNavigate } from 'react-router-dom';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function PerfilTecnico() {
  const navigate_perfil_tecnico = useNavigate();
  const [mostrarModal_perfil_tecnico, setMostrarModal_perfil_tecnico] = useState(false);

  const [datos_perfil_tecnico, setDatos_perfil_tecnico] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    extension: '',
    especialidad: '',
    carga_actual: '', 
    contrasena: ''
  });

  useEffect(() => {
    const cargarDatosPerfil = async () => {
      const idBaseUsuario = localStorage.getItem('id_base'); 
      
      if (!idBaseUsuario) {
        console.error("No se encontró el id_base de sesión en el localStorage.");
        return;
      }

      try {
        const response = await fetch(`/api/tecnico/perfil/${idBaseUsuario}`);
        const data = await response.json();
        if (response.ok) {
          setDatos_perfil_tecnico({
            nombre: data.nombre || '',
            correo: data.correo || '',
            telefono: data.telefono || '',
            extension: data.extension || '',
            especialidad: data.especialidad || '', 
            carga_actual: data.carga_actual, 
            contrasena: ''
          });
        } else {
          console.error("Error al obtener perfil:", data.error);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };
    cargarDatosPerfil();
  }, []);

  const handleActualizar_perfil_tecnico = async (e) => {
    if (e) e.preventDefault();
    const idBaseUsuario = localStorage.getItem('id_base');

    try {
      const response = await fetch(`/api/tecnico/perfil/${idBaseUsuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos_perfil_tecnico),
      });

      if (response.ok) {
        setMostrarModal_perfil_tecnico(true);
        localStorage.setItem('usuarioNombre', datos_perfil_tecnico.nombre);
      } else {
        const errorData = await response.json();
        alert("Error al actualizar: " + errorData.error);
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className='container-perfil-tecnico'>
      <EncabezadoTecnico />

      <main className='contenido-perfil-tecnico'>
        <h2 className='titulo-perfil-tecnico'>Mis datos</h2>

        <div className='cuadro-perfil-tecnico'>
          <div className='encabezado-perfil-tecnico'>
            <img className='icono-datos-perfil-tecnico' alt='icono' src='/img/informacion-personal.png' />
            <h3>Datos técnico</h3>
            <span className="aviso-rojo-perfil">*Solo se puede cambiar el correo, teléfono, extensión y contraseña.</span>
          </div>

          <div className='cuerpo-perfil-tecnico'>
            <form className='formulario-perfil-tecnico' onSubmit={handleActualizar_perfil_tecnico}>
              
              <div className='grupo-input-perfil-tecnico'>
                <label>Nombre de usuario</label>
                <input type="text" value={datos_perfil_tecnico.nombre} readOnly className="input-solo-lectura" />
              </div>

              <div className='grupo-input-perfil-tecnico'>
                <label><span className="asterisco-rojo">*</span>Correo electrónico</label>
                <input 
                  type="email" 
                  value={datos_perfil_tecnico.correo}
                  onChange={(e) => setDatos_perfil_tecnico({...datos_perfil_tecnico, correo: e.target.value})}
                />
              </div>

              <div className='grupo-input-perfil-tecnico'>
                <label><span className="asterisco-rojo">*</span>Teléfono</label>
                <input 
                  type="text" 
                  value={datos_perfil_tecnico.telefono}
                  onChange={(e) => setDatos_perfil_tecnico({...datos_perfil_tecnico, telefono: e.target.value})}
                />
              </div>

              <div className='grupo-input-perfil-tecnico'>
                <label><span className="asterisco-rojo">*</span>Extensión</label>
                <input 
                  type="text" 
                  value={datos_perfil_tecnico.extension}
                  onChange={(e) => setDatos_perfil_tecnico({...datos_perfil_tecnico, extension: e.target.value})}
                />
              </div>

              <div className='grupo-input-perfil-tecnico'>
                <label>Especialidad</label>
                <input type="text" value={datos_perfil_tecnico.especialidad} readOnly className="input-solo-lectura" />
              </div>

              <div className='grupo-input-perfil-tecnico'>
                <label>Carga actual</label>
                <input type="text" value={datos_perfil_tecnico.carga_actual} readOnly className="input-solo-lectura" />
              </div>

              <div className='grupo-input-perfil-tecnico'>
                <label><span className="asterisco-rojo">*</span>Contraseña</label>
                <input 
                  type="password" 
                  value={datos_perfil_tecnico.contrasena}
                  onChange={(e) => setDatos_perfil_tecnico({...datos_perfil_tecnico, contrasena: e.target.value})}
                  placeholder="Escribe una nueva contraseña para cambiarla"
                />
              </div>
            </form>

            <div className='contenedor-imagen-perfil-tecnico'>
              <img className='imagen-logo-perfil-tecnico' src='/img/Tarelix.png' alt='Tarelix' />
            </div>
          </div>

          <div className='contenedor-botones-perfil-tecnico'>
            <button className='btn-ok-perfil-tecnico' type="button" onClick={() => navigate_perfil_tecnico('/principalTecnico')}>Ok</button>
            <button className='btn-actualizar-perfil-tecnico' type="button" onClick={handleActualizar_perfil_tecnico}>Actualizar datos</button>
          </div>
        </div>
      </main>

      {mostrarModal_perfil_tecnico && (
        <div className='overlay-modal-perfil-tecnico'>
          <div className='modal-exito-perfil-tecnico'>
            <div className='contenedor-check-perfil-tecnico'>
              <span className='check-animado-perfil-tecnico'>L</span> 
            </div>
            <h2>Datos actualizados correctamente</h2>
            <button className='btn-aceptar-perfil-tecnico' onClick={() => setMostrarModal_perfil_tecnico(false)}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerfilTecnico;