import React from 'react';
import '../styles/principalUsuario.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

const opciones = [
  { id: 1, titulo: 'Mis tickets pendientes', src: '/img/tareas-pendientes.png', ruta: '/pendientesTicketU' },
  { id: 2, titulo: 'Reportar falla', src: '/img/reportar-falla.png', ruta: '/nuevoTicketU' },
  { id: 3, titulo: 'Buscar ticket', src: '/img/buscar.png', ruta: '/buscarTicketU' },
  { id: 4, titulo: 'Todos mis tickets', src: '/img/mis-tickets.png', ruta: '/todosTicketU' },
  { id: 5, titulo: 'Mi perfil', src: '/img/datos.png', ruta: '/perfilU' },
  { id: 6, titulo: 'Mis equipos', src: '/img/computadora.png', ruta: '/equiposU' },
];

function PrincipalUsuario() {
  const navigate = useNavigate();

  return (
    <div className="container-principal">
      {/* Componente del encabezado  */}
      <HeaderPU />

      <main className="content-area">
        <h2 className="titulo-bienvenida">
          ¿En qué podemos ayudarte hoy?
        </h2>

        <div className="grid-menu">
          {opciones.map((opcion) => (
            <div
              key={opcion.id}
              className="card-opcion"
              onClick={() => navigate(opcion.ruta)}
            >
              <div className="icon-container">
                <img
                  src={opcion.src}
                  alt={opcion.titulo}
                  className="card-image-icon"
                />
              </div>

              <p className="card-text">
                {opcion.titulo}
              </p>
            </div>
          ))}

        </div>
      </main>
    </div>
  );
}

export default PrincipalUsuario;