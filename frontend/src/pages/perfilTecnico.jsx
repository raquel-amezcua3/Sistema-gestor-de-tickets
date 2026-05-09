import React, { useState, useEffect } from 'react';
import '../styles/perfilTecnico.css';
import { useNavigate } from 'react-router-dom';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function PerfilTecnico() {
  const navigate_perfil_tecnico = useNavigate();

  // Estado para controlar la visibilidad de la ventana emergente
  const [mostrarModal_perfil_tecnico, setMostrarModal_perfil_tecnico] = useState(false);

  // 1. Estado para los datos del perfil 
  const [datos_perfil_tecnico, setDatos_perfil_tecnico] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    extension: '',
    contrasena: ''
  });

  // 2. Cargar datos reales al montar el componente
  useEffect(() => {
    const cargarDatosPerfil = async () => {
      // Obtenemos el ID del técnico desde el localStorage
      const idUsuario = localStorage.getItem('id_usuario');
      
      if (!idUsuario) return;

      try {
        const response = await fetch(`/api/perfil/${idUsuario}`);
        const data = await response.json();
        
        if (response.ok) {
          setDatos_perfil_tecnico(data);
        } else {
          console.error("Error al obtener perfil:", data.error);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };

    cargarDatosPerfil();
  }, []);

  // 3. Función para enviar los datos actualizados a la base de datos
  const handleActualizar_perfil_tecnico = async (e) => {
    e.preventDefault();
    const idUsuario = localStorage.getItem('id_usuario');

    try {
      const response = await fetch(`/api/perfil/${idUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos_perfil_tecnico),
      });

      if (response.ok) {
        // Si se actualiza bien, mostramos el modal de éxito
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
                onClick={() => navigate_perfil_tecnico('/principalTecnico')}
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