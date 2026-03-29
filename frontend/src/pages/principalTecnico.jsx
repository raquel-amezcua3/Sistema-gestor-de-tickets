import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/principalTecnico.css';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

const opciones_principal_tecnico = [
  { id: 1, titulo: 'Mis tickets pendientes', subtitulo: 'Tickets asigandos y pendientes de resolver', src: '/img/tareas-pendientes.png', ruta: '/pendientesTecnico' },
  { id: 2, titulo: 'Mis tickets resueltos', subtitulo: 'Tickets que he resuelto' , src: '/img/comprobado.png', ruta: '/resueltoTecnico' },
  { id: 3, titulo: 'Buscar ticket', src: '/img/buscar.png', subtitulo: 'Buscar ticket por ID' , ruta: '/buscarTecnico' },
  { id: 4, titulo: 'Directorio de usuarios', src: '/img/directorio.png', subtitulo: 'Ver lista de usuario del sistema' , ruta: '/directorioTecnico' },
  { id: 5, titulo: 'Mis datos Tecnico', src: '/img/datos.png', subtitulo: 'Ver y editar mi información' , ruta: '/perfilTecnico' },
];

function PrincipalTecnico() {
  const navigate_principal_tecnico = useNavigate();

  return (
    <div className="container-principal-tecnico">
      {/* Componente del encabezado técnico */}
      <EncabezadoTecnico />

      <main className="content-area-principal-tecnico">
        <h2 className="titulo-bienvenida-principal-tecnico">
          Panel de control del Técnico
        </h2>
        <p className='subtitulo-principal-tecnico' >Gestiona los tickets asigandos</p>

        <div className="grid-menu-principal-tecnico">
          {opciones_principal_tecnico.map((opcion) => (
            <div
              key={opcion.id}
              className="card-opcion-principal-tecnico"
              onClick={() => navigate_principal_tecnico(opcion.ruta)}
            >
              <div className="icon-container-principal-tecnico">
                <img
                  src={opcion.src}
                  alt={opcion.titulo}
                  className="card-image-icon-principal-tecnico"
                />
              </div>

              <p className="card-text-principal-tecnico">
                {opcion.titulo}
              </p>

              <p className="card-subtext-principal-tecnico">
                 {opcion.subtitulo}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default PrincipalTecnico;