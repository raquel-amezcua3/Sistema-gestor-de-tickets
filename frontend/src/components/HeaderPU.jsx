import React from 'react';
import '../components/HeaderPU.css';

function HeaderPU() {
  return (
    <nav className='encabezado-principal-usuario'>
     <div className='logo-PU'>
       <a href='/principalUsuario'><img src='/img/Bodesa.png' alt='Logo encabezado'></img></a>
     </div>

     <ul className='nav-PU'>
       <li><a href='/pendientesTicketU' >Mis tickets</a></li>
       <li><a href='/nuevoTicketU' >Nuevo ticket</a></li>
       <a href='/registro'><img src="/img/cerrarS.png" alt="Cerrar sesion" className="logo-cerrarS" /></a>
      </ul>
    </nav>
  );
}
export default HeaderPU;