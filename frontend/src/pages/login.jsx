import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

function Login() {
  const navigate = useNavigate();
  
  // 1. Estado para capturar credenciales
  const [credenciales, setCredenciales] = useState({
    correo: '',
    contraseña: ''
  });

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 2. Petición al Backend
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: credenciales.correo,
          contraseña: credenciales.contraseña
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. ¡Login exitoso! Guardamos datos importantes en el navegador
        alert(data.mensaje);
        
        // Guardamos el nombre y rol para saber quién entró
        localStorage.setItem('id_usuario', data.usuario.id);
        localStorage.setItem('usuarioNombre', data.usuario.nombre);
        localStorage.setItem('usuarioRol', data.usuario.rol);

        // 4. Redirección inteligente según el ROL
        // 0 = Cliente, 1 = Jefe, 2 = Técnico
        if (data.usuario.rol === 1) {
          navigate('/principalAdmin'); 
        } else if (data.usuario.rol === 2) {
          navigate('/principalTecnico');
        } else {
          navigate('/principalUsuario'); // Ruta para el cliente normal
        }

      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className='container-login'>
      <div className='seccion-logo-login'>
        <h1 className='titulo-tarelix-login'>Tarelix</h1>
        <img className='logo-tarelix-login' alt='logo' src='/img/logoTarelix.png' />
      </div>

      <div className='cuadro-login'>
        <h2 className='titulo-login'>¡Bienvenido, comencemos!</h2>

        <form className='formulario-login' onSubmit={handleSubmit}>
          {/* CORREO (Antes decía nombre, lo cambiamos para que funcione con tu backend) */}
          <div className='campo-formulario-login'>
            <label htmlFor='correo'>Correo electrónico</label>
            <input 
              type='email' 
              id='correo' 
              name='correo' 
              required 
              value={credenciales.correo}
              onChange={handleChange}
            />
          </div>

          {/* CONTRASEÑA */}
          <div className='campo-formulario-login'>
            <label htmlFor='contraseña'>Contraseña</label>
            <input 
              type='password' 
              id='contraseña'
              name='contraseña'
              required
              value={credenciales.contraseña}
              onChange={handleChange}
            />
          </div>

          <button type='submit' className='boton-login'>Iniciar sesión</button>
          
          <div className='cuenta-login'>
            <a href='/principalUsuario'>¿Aún no tienes cuenta?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;