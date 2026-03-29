import React from 'react';
import '../components/EncabezadoAdmin.css';

function HeaderPU() {
  return (
    <nav className='encabezado-principal-admin'>
     <div className='logo-Admin'>
       <a href='/principalAdmin'><img src='/img/Bodesa.png' alt='Logo encabezado'></img></a>
     </div>

     <ul className='nav-Admin'>
       <li><a href='/asignarAdmin' >Asignar</a></li>
       <li><a href='/nuevoTAdmin' >Nuevo tecnico</a></li>
       <a href='/registro'><img src="/img/cerrarS.png" alt="Cerrar sesion" className="logo-cerrarS-Admin" /></a>
      </ul>
    </nav>
  );
}
export default HeaderPU;