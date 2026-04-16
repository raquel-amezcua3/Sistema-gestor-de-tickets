// Pantalla inicial del sistema de Tarelix
import React from 'react';
import '../styles/home.css';

function Home() {
  return (
    <div className='container-inicio'>
       <h1 className='titulo-home'>Tarelix</h1>
       <img className='imagen-logo-home' alt='no aparece' src='/img/logoTarelix.png'></img>

       <h2 className='frase-home'>¡Una tarea, una solución!</h2>
       <div className='botones-home'>
         <a  href='/registro' className='btn-registro'>Registrarse</a>
         <a href='/login' className='btn-inicio'>Iniciar sesión</a>
       </div>
      
    </div>
  );
}

export default Home;