// Login que utilizan los 3 roles de usuarios
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

function Login() {
  const navigate = useNavigate();
  
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
        // 1. Convertimos el rol a número inmediatamente para evitar errores de comparación
        const rolNumerico = Number(data.usuario.rol);

        // 2. Mantenemos tus nombres y agregamos el objeto 'usuario' para compatibilidad
        localStorage.setItem('id_usuario', data.usuario.id); 
        localStorage.setItem('usuarioNombre', data.usuario.nombre);
        localStorage.setItem('usuarioRol', rolNumerico);

        localStorage.setItem('usuario', JSON.stringify({ id: data.usuario.id, nombre: data.usuario.nombre, rol: rolNumerico }));

        // 3. Pequeña pausa de seguridad (50ms) para asegurar que el navegador guardó los datos antes de que el Header intente leerlos y me expulse.
        setTimeout(() => {
          if (rolNumerico === 1) {
            navigate('/principalAdmin'); 
          } else if (rolNumerico === 2) {
            navigate('/principalTecnico');
          } else {
            navigate('/principalUsuario'); 
          }
        }, 50);

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
        </form>
      </div>
    </div>
  );
}

export default Login;