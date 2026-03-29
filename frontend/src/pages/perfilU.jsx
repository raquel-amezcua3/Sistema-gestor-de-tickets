import React, { useState } from 'react';
import '../styles/perfilU.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function PerfilU() {
  const navigate_perfil_usuario = useNavigate();

  // Estado para controlar la visibilidad de la ventana emergente
  const [mostrarModal_perfil_usuario, setMostrarModal_perfil_usuario] = useState(false);

  // Estado para los datos del perfil
  const [datos_perfil_usuario, setDatos_perfil_usuario] = useState({
    nombre: 'Usuario Ejemplo',
    correo: 'usuario@bodesa.com',
    telefono: '3121234567',
    extension: '101',
    contrasena: '********'
  });

  const handleActualizar_perfil_usuario = (e) => {
    e.preventDefault();
    console.log("Datos actualizados", datos_perfil_usuario);
    // Activa el modal de éxito
    setMostrarModal_perfil_usuario(true);
  };

  return (
    <div className='container-perfil-usuario'>
      <HeaderPU />

      <main className='contenido-perfil-usuario'>
        <h2 className='titulo-perfil-usuario'>Mis datos</h2>

        <div className='cuadro-perfil-usuario'>
          <div className='encabezado-perfil-usuario'>
            <img className='icono-datos-perfil-usuario' alt='icono' src='/img/informacion-personal.png' />
            <h3>Datos</h3>
          </div>

          <div className='cuerpo-perfil-usuario'>
            {/* Columna Izquierda: Formulario */}
            <form className='formulario-perfil-usuario' onSubmit={handleActualizar_perfil_usuario}>
              <div className='grupo-input-perfil-usuario'>
                <label>Nombre de usuario</label>
                <input 
                  type="text" 
                  value={datos_perfil_usuario.nombre}
                  onChange={(e) => setDatos_perfil_usuario({...datos_perfil_usuario, nombre: e.target.value})}
                />
              </div>

              <div className='grupo-input-perfil-usuario'>
                <label>Correo electronico</label>
                <input 
                  type="email" 
                  value={datos_perfil_usuario.correo}
                  onChange={(e) => setDatos_perfil_usuario({...datos_perfil_usuario, correo: e.target.value})}
                />
              </div>

              <div className='grupo-input-perfil-usuario'>
                <label>Telefono</label>
                <input 
                  type="text" 
                  value={datos_perfil_usuario.telefono}
                  onChange={(e) => setDatos_perfil_usuario({...datos_perfil_usuario, telefono: e.target.value})}
                />
              </div>

              <div className='grupo-input-perfil-usuario'>
                <label>Extensión</label>
                <input 
                  type="text" 
                  value={datos_perfil_usuario.extension}
                  onChange={(e) => setDatos_perfil_usuario({...datos_perfil_usuario, extension: e.target.value})}
                />
              </div>

              <div className='grupo-input-perfil-usuario'>
                <label>Contraseña</label>
                <input 
                  type="password" 
                  value={datos_perfil_usuario.contrasena}
                  onChange={(e) => setDatos_perfil_usuario({...datos_perfil_usuario, contrasena: e.target.value})}
                />
              </div>
            </form>

            {/* Columna Derecha: Imagen Tarelix */}
            <div className='contenedor-imagen-perfil-usuario'>
              <img className='imagen-logo-perfil-usuario' src='/img/Tarelix.png' alt='Tarelix' />
            </div>
          </div>

          {/* Botones inferiores */}
          <div className='contenedor-botones-perfil-usuario'>
            <button 
                className='btn-ok-perfil-usuario' 
                onClick={() => navigate_perfil_usuario('/principalUsuario')}
            >
                Ok
            </button>
            <button 
                className='btn-actualizar-perfil-usuario' 
                onClick={handleActualizar_perfil_usuario}
            >
                Actualizar datos
            </button>
          </div>
        </div>
      </main>

      {/* Ventana emergente de datos actualizados correctamente */}
      {mostrarModal_perfil_usuario && (
        <div className='overlay-modal-perfil-usuario'>
          <div className='modal-exito-perfil-usuario'>
            <div className='contenedor-check-perfil-usuario'>
              <span className='check-animado-perfil-usuario'>L</span> 
            </div>
            <h2>Datos actualizados correctamente</h2>
            <button 
              className='btn-aceptar-perfil-usuario' 
              onClick={() => setMostrarModal_perfil_usuario(false)}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerfilU;