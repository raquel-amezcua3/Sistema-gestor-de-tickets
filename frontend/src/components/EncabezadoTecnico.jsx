// Este es el componente del encabezado del tecnico
import React, { useEffect } from 'react';
import '../components/EncabezadoTecnico.css';
import { useNavigate, Link } from 'react-router-dom';

function EncabezadoTecnico() {
  const navigate_header_tecnico = useNavigate();

  // Esto es un candando de seguridad para administradores
  useEffect(() => {
    const idUsuario = localStorage.getItem('id_usuario'); 
    const rol = localStorage.getItem('usuarioRol');

    // 1. Verificamos si existe sesión
    if (!idUsuario || rol === null) {
      console.log("Acceso denegado: No se encontró sesión activa");
      navigate_header_tecnico('/');
      return;
    }

    // 2. Verificamos si es técnico (Rol 2)
    // Convertimos a Number para asegurar una comparación limpia
    if (Number(rol) !== 2) {
      console.error("Permisos insuficientes: Se requiere rol de técnico.");
      // Solo alertar si el usuario intenta entrar a la mala
      navigate_header_tecnico('/'); 
    }
  }, [navigate_header_tecnico]);


  const cerrarSesion_header_tecnico = (e) => {
    e.preventDefault();
    
    const confirmar = window.confirm("¿Deseas cerrar tu sesión técnica?");
    
    if (confirmar) {
      console.log("Limpiando datos y cerrando sesión...");
      localStorage.clear();
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