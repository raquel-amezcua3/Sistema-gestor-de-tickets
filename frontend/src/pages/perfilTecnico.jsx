import React, { useState } from 'react';
import '../styles/perfilTecnico.css';
import { useNavigate } from 'react-router-dom';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function PerfilTecnico() {
  const navigate_perfil_tecnico = useNavigate();

  // Estado para controlar la visibilidad de la ventana emergente
  const [mostrarModal_perfil_tecnico, setMostrarModal_perfil_tecnico] = useState(false);

  // Estado para los datos del perfil del técnico
  const [datos_perfil_tecnico, setDatos_perfil_tecnico] = useState({
    nombre: 'Raquel Amezcua',
    correo: 'raquel.amezcua@bodesa.com',
    telefono: '3129876543',
    extension: '205',
    contrasena: '********'
  });

  const handleActualizar_perfil_tecnico = (e) => {
    e.preventDefault();
    console.log("Datos del técnico actualizados", datos_perfil_tecnico);
    // Activa el modal de éxito
    setMostrarModal_perfil_tecnico(true);
  };

  return (
    <div className='container-perfil-tecnico'>
      <EncabezadoTecnico />

      <main className='contenido-perfil-tecnico'>
        <h2 className='titulo-perfil-tecnico'>Mis datos de técnico</h2>

        <div className='cuadro-perfil-tecnico'>
          <div className='encabezado-perfil-tecnico'>
            <img className='icono-datos-perfil-tecnico' alt='icono' src='/img/informacion-personal.png' />
            <h3>Información Personal</h3>
          </div>

          <div className='cuerpo-perfil-tecnico'>
            {/* Columna Izquierda: Formulario */}
            <form className='formulario-perfil-tecnico' onSubmit={handleActualizar_perfil_tecnico}>
              <div className='grupo-input-perfil-tecnico'>
                <label>Nombre completo</label>
                <input 
                  type="text" 
                  value={datos_perfil_tecnico.nombre}
                  onChange={(e) => setDatos_perfil_tecnico({...datos_perfil_tecnico, nombre: e.target.value})}
                />
              </div>

              <div className='grupo-input-perfil-tecnico'>
                <label>Correo electrónico</label>
                <input 
                  type="email" 
                  value={datos_perfil_tecnico.correo}
                  onChange={(e) => setDatos_perfil_tecnico({...datos_perfil_tecnico, correo: e.target.value})}
                />
              </div>

              <div className='grupo-input-perfil-tecnico'>
                <label>Teléfono</label>
                <input 
                  type="text" 
                  value={datos_perfil_tecnico.telefono}
                  onChange={(e) => setDatos_perfil_tecnico({...datos_perfil_tecnico, telefono: e.target.value})}
                />
              </div>

              <div className='grupo-input-perfil-tecnico'>
                <label>Extensión</label>
                <input 
                  type="text" 
                  value={datos_perfil_tecnico.extension}
                  onChange={(e) => setDatos_perfil_tecnico({...datos_perfil_tecnico, extension: e.target.value})}
                />
              </div>

              <div className='grupo-input-perfil-tecnico'>
                <label>Contraseña</label>
                <input 
                  type="password" 
                  value={datos_perfil_tecnico.contrasena}
                  onChange={(e) => setDatos_perfil_tecnico({...datos_perfil_tecnico, contrasena: e.target.value})}
                />
              </div>
            </form>

            {/* Columna Derecha: Imagen Tarelix */}
            <div className='contenedor-imagen-perfil-tecnico'>
              <img className='imagen-logo-perfil-tecnico' src='/img/Tarelix.png' alt='Tarelix' />
            </div>
          </div>

          {/* Botones inferiores */}
          <div className='contenedor-botones-perfil-tecnico'>
            <button 
                className='btn-ok-perfil-tecnico' 
                onClick={() => navigate_perfil_tecnico('/pendientesTecnico')}
            >
                Ok
            </button>
            <button 
                className='btn-actualizar-perfil-tecnico' 
                onClick={handleActualizar_perfil_tecnico}
            >
                Actualizar datos
            </button>
          </div>
        </div>
      </main>

      {/* Ventana emergente de datos actualizados correctamente */}
      {mostrarModal_perfil_tecnico && (
        <div className='overlay-modal-perfil-tecnico'>
          <div className='modal-exito-perfil-tecnico'>
            <div className='contenedor-check-perfil-tecnico'>
              <span className='check-animado-perfil-tecnico'>L</span> 
            </div>
            <h2>Datos actualizados correctamente</h2>
            <button 
              className='btn-aceptar-perfil-tecnico' 
              onClick={() => setMostrarModal_perfil_tecnico(false)}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PerfilTecnico;