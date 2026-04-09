import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Usamos Link para mejor rendimiento
import '../components/EncabezadoAdmin.css';

function EncabezadoAdmin() {
  const navigate = useNavigate();

  // --- CANDADO DE SEGURIDAD PARA ADMINISTRADORES ---
  useEffect(() => {
    const idUsuario = localStorage.getItem('usuarioId');
    const rol = localStorage.getItem('usuarioRol');

    // 1. Verificamos si existe sesión
    if (!idUsuario || rol === null) {
      navigate('/');
      return;
    }

    // 2. Verificamos si es Administrador (Rol 1)
    if (Number(rol) !== 1) {
      alert("Acceso denegado: Esta zona es exclusiva para administradores.");
      // Si es un usuario normal (0) o técnico (2), lo mandamos al inicio
      navigate('/'); 
    }
  }, [navigate]);
  // -------------------------------------------------

  const handleLogout = (e) => {
    e.preventDefault();

    const confirmar = window.confirm("¿Estás seguro de que deseas cerrar la sesión de administrador?");
    
    if (confirmar) {
      // Limpiamos los datos del administrador
      localStorage.clear();
      // Redirigimos al Login
      navigate('/');
    }
  };

  return (
    <nav className='encabezado-principal-admin'>
      <div className='logo-Admin'>
        <Link to='/principalAdmin'>
          <img src='/img/Bodesa.png' alt='Logo encabezado' />
        </Link>
      </div>

      <ul className='nav-Admin'>
        <li><Link to='/asignarAdmin'>Asignar</Link></li>
        <li><Link to='/nuevoTAdmin'>Nuevo tecnico</Link></li>
        <li>
          <button 
            onClick={handleLogout} 
            title="Cerrar sesión"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img src="/img/cerrarS.png" alt="Cerrar sesion" className="logo-cerrarS-Admin" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default EncabezadoAdmin;