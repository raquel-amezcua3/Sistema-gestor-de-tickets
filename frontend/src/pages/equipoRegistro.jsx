// Archivos equipoRegistro.jsx y equipo.js
// Sirve para que el usuario pueda registrar su equipo o mas equipos, y una vez regisrado
// pueda levantar un ticket
// USUARIO

import React, { useState } from 'react';
import '../styles/equipoRegistro.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function EquipoRegistro() {
  const navigate_equipo_formularioR = useNavigate();
  const [mostrarModal_equipo_formularioR, setMostrarModal_equipo_formularioR] = useState(false);
  const [datos_equipo_formularioR, setDatos_equipo_formularioR] = useState({
    tipo: '',
    marca: '',
    serie: ''
  });

  const manejarRegistroEquipo = async (e) => {
    if (e) e.preventDefault(); 

    // Validación visual antes de enviar
    if (!datos_equipo_formularioR.tipo || !datos_equipo_formularioR.marca) {
      alert("Por favor, llena los campos obligatorios (Tipo y Marca).");
      return;
    }

    // Búsqueda en cascada inteligente para evitar nulos
    const idBaseActiva = localStorage.getItem('id_base');
    const idUsuarioActivo = localStorage.getItem('id_usuario') || localStorage.getItem('id'); 

    // Validamos sesión activa
    if (!idBaseActiva || idBaseActiva === 'null' || idBaseActiva === 'undefined') {
      alert("No se detectó una sesión activa. Por favor, vuelve a iniciar sesión para registrar tu equipo.");
      navigate_equipo_formularioR('/login'); 
      return;
    }

    // Armamos el paquete de datos limpio
    const payload = {
      id_usuario: (idUsuarioActivo && idUsuarioActivo !== 'null' && idUsuarioActivo !== 'undefined') ? parseInt(idUsuarioActivo, 10) : null,
      id_base: parseInt(idBaseActiva, 10),
      tipo_equipo: datos_equipo_formularioR.tipo,
      marca: datos_equipo_formularioR.marca,
      numero_serie: datos_equipo_formularioR.serie.trim() === "" ? null : datos_equipo_formularioR.serie
    };

    try {
      // CORRECCIÓN: Al estar en el mismo Render, usamos solo la ruta relativa '/api/...'
      const respuesta = await fetch('/api/equipo/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (respuesta.ok) {
        setMostrarModal_equipo_formularioR(true);
      } else {
        const errorDatos = await respuesta.json();
        alert(`Error al registrar: ${errorDatos.error} \nDetalle: ${errorDatos.detalle || 'Revisa las restricciones de la base de datos'}`);
      }
    } catch (error) {
      console.error("❌ Error de red o conexión:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className='container-equipo-formularioR'>
      <HeaderPU />
      <main className='contenido-equipo-formularioR'>
        <h2 className='titulo-equipo-formularioR'>Registrar un nuevo equipo</h2>

        <div className='cuadro-equipo-formularioR'>
          <div className='encabezado-equipo-formularioR'>
            <img className='icono-equipo-formularioR' alt='icono' src='/img/computadora.png' />
            <h3>Datos del equipo</h3>
          </div>

          <div className='cuerpo-equipo-formularioR'>
            <form className='formulario-equipo-formularioR' onSubmit={manejarRegistroEquipo}>
              <div className='grupo-input-equipo-formularioR'>
                <label>Tipo de equipo *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Laptop, Impresora..."
                  value={datos_equipo_formularioR.tipo}
                  onChange={(e) => setDatos_equipo_formularioR({...datos_equipo_formularioR, tipo: e.target.value})}
                />
              </div>

              <div className='grupo-input-equipo-formularioR'>
                <label>Marca del equipo *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: HP, Dell, Epson..."
                  value={datos_equipo_formularioR.marca}
                  onChange={(e) => setDatos_equipo_formularioR({...datos_equipo_formularioR, marca: e.target.value})}
                />
              </div>

              <div className='grupo-input-equipo-formularioR'>
                <label>Número de serie</label>
                <input 
                  type="text" 
                  placeholder="Opcional"
                  value={datos_equipo_formularioR.serie || ''} 
                  onChange={(e) => setDatos_equipo_formularioR({...datos_equipo_formularioR, serie: e.target.value})}
                />
              </div>
            </form>

            <div className='contenedor-imagen-equipo-formularioR'>
              <img className='imagen-equipo-formularioR' src='/img/RegistroEquipo.webp' alt='Tarelix' />
            </div>
          </div>

          <div className='contenedor-botones-equipo-formularioR'>
            <button className='btn-ok-equipo-formularioR' onClick={() => navigate_equipo_formularioR('/principalUsuario')}>Ok</button>
            <button className='btn-registrar-equipo-formularioR' onClick={manejarRegistroEquipo}>Registrar equipo</button>
          </div>
        </div>
      </main>

      {/* VENTANA EMERGENTE */}
      {mostrarModal_equipo_formularioR && (
        <div className='overlay-modal'>
          <div className='modal-exito'>
            <div className='contenedor-check'>
              <img className='icono-exito' alt='exito' src='/img/comprobado.png' style={{ width: '80px', height: 'auto' }} />
            </div>
            <h2>Equipo registrado correctamente</h2>
            <button className='btn-aceptar' onClick={() => { setMostrarModal_equipo_formularioR(false); navigate_equipo_formularioR('/equiposU'); }}>
              Aceptar
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}

export default EquipoRegistro;