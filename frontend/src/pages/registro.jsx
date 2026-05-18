import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/registro.css';

function Registro() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    extension: '',
    pass1: '',
    pass2: ''
  });
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.pass1 !== formData.pass2) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // Ajustamos el body para que coincida EXACTAMENTE con tu backend
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          contrasena: formData.pass1, // Cambiado 'contraseña' por 'contrasena'
          telefono: formData.telefono,
          extension: parseInt(formData.extension)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        navigate('/login'); 
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      alert("No se pudo conectar con el servidor. ¿Está encendido el backend?");
    }
  };
  

  return (
    <div className='container-registro'>
      <div className='seccion-logo-tarelix'>
        <h1 className='titulo-tarelix-registro'>Tarelix</h1>
        <img className='logo-tarelix-registro' alt='logo' src='/img/logoTarelix.png' />
      </div>

      <div className='cuadro-registro'>
        <h2 className='titulo-registro'>¡Registrate y obten soporte cuando lo necesites!</h2>
        
        <form className='formulario-registro' onSubmit={handleSubmit}>
          <div className='campo-formulario-registro'>
            <label htmlFor='nombre'>Nombre completo</label>
            <input 
              type='text' id='nombre' name='nombre' required 
              value={formData.nombre} onChange={handleChange} 
            />
          </div>

          <div className='campo-formulario-registro'>
            <label htmlFor='correo'>Correo electrónico</label>
            <input 
              type='email' id='correo' name='correo' required 
              value={formData.correo} onChange={handleChange} 
            />
          </div>
          
          <div className='campo-formulario-registro'>
            <label htmlFor='telefono'>Teléfono</label>
            <input 
              type='text' id='telefono' name='telefono' required 
              maxLength="10" value={formData.telefono} onChange={handleChange}
            />
          </div>

          <div className='campo-formulario-registro'>
            <label htmlFor='extension'>Extensión</label>
            <input 
              type='text' id='extension' name='extension' required 
              value={formData.extension} onChange={handleChange}
            />
          </div>

          <div className='campo-formulario-registro'>
            <label htmlFor='pass1'>Contraseña</label>
            <input 
              type='password' id='pass1' name='pass1' required
              value={formData.pass1} onChange={handleChange}
            />
          </div>

          <div className='campo-formulario-registro'>
            <label htmlFor='pass2'>Repetir Contraseña</label>
            <input 
              type='password' id='pass2' name='pass2' required
              value={formData.pass2} onChange={handleChange}
            />
          </div>

          <button type='submit' className='boton-registrar'>Registrarse</button>
          
          <div className='cuenta'>
            <a href='/login'>¿Ya tienes cuenta? Inicia sesión</a>
          </div> 
        </form>
      </div>
    </div>
  );
}

// ESTA LÍNEA ES LA QUE TE DABA EL ERROR DE "MISSING EXPORT" EN EL BUILD
export default Registro;