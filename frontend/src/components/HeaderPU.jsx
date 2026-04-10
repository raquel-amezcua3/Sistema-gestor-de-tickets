import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/HeaderPU.css';

function HeaderPU() {
  const navigate = useNavigate();

  useEffect(() => {
    // IMPORTANTE: Los nombres deben ser IGUALES a como los guardas en Login.jsx
    const idUsuario = localStorage.getItem('id_usuario'); 
    const rol = localStorage.getItem('usuarioRol');

    // Solo validamos si REALMENTE no hay nada en el storage.
    // Si usas componentes de "Rutas Protegidas" en App.js, 
    // podrías incluso quitar este useEffect del Header para evitar conflictos.
    if (!idUsuario) {
      console.warn("Acceso denegado: No se encontró id_usuario");
      navigate('/'); 
    }
  }, [navigate]);

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
        {/* Usamos el rol para saber a dónde mandarlo si hace clic en el logo */}
        <button 
          onClick={() => {
            const rol = localStorage.getItem('usuarioRol');
            if (Number(rol) === 1) navigate('/principalAdmin');
            else if (Number(rol) === 2) navigate('/principalTecnico');
            else navigate('/principalUsuario');
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <img src='/img/Bodesa.png' alt='Logo encabezado' />
        </button>
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