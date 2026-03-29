import React from 'react';
import '../components/EncabezadoTecnico.css';
import { useNavigate, Link } from 'react-router-dom';

function EncabezadoTecnico() {
  const navigate_header_tecnico = useNavigate();

  const cerrarSesion_header_tecnico = (e) => {
    e.preventDefault();
    
    // Aquí puedes limpiar datos de sesión si usas localStorage o Cookies
    // localStorage.removeItem('token'); 
    // localStorage.removeItem('user');

    console.log("Cerrando sesión...");
    
    // Redirigir a la pantalla de Login o Registro
    navigate_header_tecnico('/'); 
  };

  return (
    <nav className='encabezado-principal-tecnico'>
      <div className='logo-Tecnico'>
        {/* Usamos Link en lugar de <a> para que la navegación sea instantánea en React */}
        <Link to='/pendientesTecnico'>
          <img src='/img/Bodesa.png' alt='Logo encabezado' />
        </Link>
      </div>

      <ul className='nav-Tecnico'>
        <li><Link to='/pendientesTecnico'>Tickets pendientes</Link></li>
        <li><Link to='/directorioTecnico'>Directorio</Link></li>
        <li>
          {/* Al hacer clic, disparamos la función de cierre */}
          <button 
            onClick={cerrarSesion_header_tecnico} 
            className="btn-invisible-cerrar-tecnico"
            title="Cerrar sesión"
          >
            <img src="/img/cerrarS.png" alt="Cerrar sesion" className="logo-cerrarS-Tecnico" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default EncabezadoTecnico;