import React, { useEffect } from 'react'; // Importamos useEffect
import '../components/EncabezadoTecnico.css';
import { useNavigate, Link } from 'react-router-dom';

function EncabezadoTecnico() {
  const navigate_header_tecnico = useNavigate();

  // --- CANDADO DE SEGURIDAD PARA TÉCNICOS ---
  useEffect(() => {
    const idUsuario = localStorage.getItem('usuarioId');
    const rol = localStorage.getItem('usuarioRol');

    // 1. Verificamos si existe sesión
    if (!idUsuario || rol === null) {
      navigate_header_tecnico('/');
      return;
    }

    // 2. Verificamos si es técnico (Rol 2)
    // Nota: El rol viene del localStorage como String, por eso usamos != 2 o lo convertimos
    if (Number(rol) !== 2) {
      alert("Acceso denegado: No tienes permisos de técnico.");
      navigate_header_tecnico('/'); // Lo sacamos si no es técnico
    }
  }, [navigate_header_tecnico]);
  // ------------------------------------------

  const cerrarSesion_header_tecnico = (e) => {
    e.preventDefault();
    
    const confirmar = window.confirm("¿Deseas cerrar tu sesión técnica?");
    
    if (confirmar) {
      console.log("Limpiando datos y cerrando sesión...");
      // Limpiamos el localStorage para que el candado lo detecte
      localStorage.clear();
      
      // Redirigir al Login
      navigate_header_tecnico('/'); 
    }
  };

  return (
    <nav className='encabezado-principal-tecnico'>
      <div className='logo-Tecnico'>
        <Link to='/principalTecnico'>
          <img src='/img/Bodesa.png' alt='Logo encabezado' />
        </Link>
      </div>

      <ul className='nav-Tecnico'>
        <li><Link to='/pendientesTecnico'>Tickets pendientes</Link></li>
        <li><Link to='/directorioTecnico'>Directorio</Link></li>
        <li>
          <button 
            onClick={cerrarSesion_header_tecnico} 
            className="btn-invisible-cerrar-tecnico"
            title="Cerrar sesión"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <img src="/img/cerrarS.png" alt="Cerrar sesion" className="logo-cerrarS-Tecnico" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default EncabezadoTecnico;