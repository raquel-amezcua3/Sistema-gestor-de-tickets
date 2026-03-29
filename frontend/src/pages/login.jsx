import React from 'react';
import '../styles/login.css';

function Login() {
  return (
   <div className='container-login'>
    <div className='seccion-logo-login'>
      <h1 className='titulo-tarelix-login'>Tarelix</h1>
      <img className='logo-tarelix-login' alt='logo' src='/img/logoTarelix.png' />
    </div>

      <div className='cuadro-login'>
        <h2 className='titulo-login'>¡Bienvenido, comencemos!</h2>

        <form className='formulario-login'>
          {/* NOMBRE */}
          <div className='campo-formulario-login'>
            <label htmlFor='nombre'>Nombre de usuario</label>
            <input type='text' id='nombre' name='nombre' required minLength="3" maxLength="20" />
          </div>

          {/* CONTRASEÑA 1 */}
          <div className='campo-formulario-login'>
            <label htmlFor='pass1'>Contraseña</label>
            <input 
              type='password' 
              id='pass1'
              name='pass1'
              required
              pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}'
              title="Mínimo 8 caracteres, una mayúscula, un número y un carácter especial"
            />
          </div>


          <button  type='submit'  className='boton-login'>Iniciar sesión</button>
          
          <div className='cuenta-login'>
            <a href='/principalUsuario'>¿Aún no tienes cuenta?</a>
          </div>
          
        </form>
      </div>
    </div>
  );
}

export default Login;