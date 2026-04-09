import React, { useEffect } from 'react'; // Agregamos useEffect
import { useNavigate } from 'react-router-dom';
import '../components/HeaderPU.css';

function HeaderPU() {
  const navigate = useNavigate();

  // --- EL CANDADO DE SEGURIDAD ---
  useEffect(() => {
    const idUsuario = localStorage.getItem('usuarioId');
    const rol = localStorage.getItem('usuarioRol');

    // Si no hay ID o si el rol no existe, significa que no ha pasado por el login
    if (!idUsuario || rol === null) {
      console.log("Acceso denegado: No hay sesión activa");
      navigate('/'); // Te manda al login
    }
  }, [navigate]);
  // -------------------------------

  const handleLogout = (e) => {
    e.preventDefault();

    const confirmar = window.confirm("¿Estás seguro de que quieres cerrar sesión?");
    
    if (confirmar) {
      localStorage.clear(); 
      navigate('/'); 
    }
  };

  return (
    <nav className='encabezado-principal-usuario'>
      <div className='logo-PU'>
        <a href='/principalUsuario'>
          <img src='/img/Bodesa.png' alt='Logo encabezado' />
        </a>
      </div>

      <ul className='nav-PU'>
        <li><a href='/pendientesTicketU'>Mis tickets</a></li>
        <li><a href='/nuevoTicketU'>Nuevo ticket</a></li>
        <li className="item-cerrar">
          <button 
            onClick={handleLogout} 
            title="Cerrar sesión"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <img src="/img/cerrarS.png" alt="Cerrar sesion" className="logo-cerrarS" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default HeaderPU;