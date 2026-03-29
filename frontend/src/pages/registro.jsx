import React, { useState } from 'react';
import '../styles/registro.css';

function Registro() {
  // Estado para capturar las contraseñas y validar que coincidan
  const [passwords, setPasswords] = useState({ pass1: '', pass2: '' });

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.pass1 !== passwords.pass2) {
      alert("Las contraseñas no coinciden");
      return;
    }
    console.log("Formulario enviado con éxito");
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
          {/* NOMBRE */}
          <div className='campo-formulario-registro'>
            <label htmlFor='nombre'>Nombre de usuario</label>
            <input type='text' id='nombre' name='nombre' required minLength="3" maxLength="20" />
          </div>

          {/* CORREO */}
          <div className='campo-formulario-registro'>
            <label htmlFor='correo'>Correo</label>
            <input type='email' id='correo' name='correo' required />
          </div>

          
          <div className='campo-formulario-registro'>
            <label htmlFor='telefono'>Telefono</label>
            <input 
              type='text' 
              id='telefono' 
              name='telefono' 
              required 
              pattern='\d{10}' 
              maxLength="10"
              title='Debe tener exactamente 10 números' 
            />
          </div>

          <div className='campo-formulario-registro'>
            <label htmlFor='extension'>Extension</label>
            <input 
              type='text' 
              id='extension' 
              name='extension' 
              pattern='\d{1,6}' 
              maxLength="6"
              title='La extensión debe ser de hasta 6 dígitos sino tiene ponga un 0' 
              required
            />
          </div>

          {/* CONTRASEÑA 1 */}
          <div className='campo-formulario-registro'>
            <label htmlFor='pass1'>Contraseña</label>
            <input 
              type='password' 
              id='pass1'
              name='pass1'
              required
              value={passwords.pass1}
              onChange={handlePasswordChange}
              pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}'
              title="Mínimo 8 caracteres, una mayúscula, un número y un carácter especial"
            />
          </div>

          {/* CONTRASEÑA 2: Validación de coincidencia */}
          <div className='campo-formulario-registro'>
            <label htmlFor='pass2'>Repetir Contraseña</label>
            <input 
              type='password' 
              id='pass2' 
              name='pass2' 
              required
              value={passwords.pass2}
              onChange={handlePasswordChange}
            />
          </div>

          <button type='submit' className='boton-registrar'>Registrarse</button>
          
          <div className='cuenta'>
            <a href='/principalTecnico'>¿Ya tienes cuenta?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registro;