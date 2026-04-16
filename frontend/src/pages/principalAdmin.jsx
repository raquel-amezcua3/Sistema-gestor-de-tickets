import React from 'react';
import '../styles/prinicipalAdmin.css';
import { useNavigate } from 'react-router-dom';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function PrincipalAdmin() {
  // Hook para gestionar la navegación programática entre las diferentes vistas del administrador
  const navigate_principal_admin = useNavigate();

  // Definición de la estructura de datos para el menú principal
  // Permite añadir o quitar funcionalidades al panel de control de forma centralizada
  const opciones_principal_admin = [
    { texto: 'Asignar tickets a tecnicos', icono: '/img/asignar.png', ruta: '/asignarAdmin' },
    { texto: 'Lista de tecnicos', icono: '/img/directorio.png', ruta: '/listaAdmin' },
    { texto: 'Añadir nuevo tecnico', icono: '/img/añadir.png', ruta: '/nuevoTAdmin' },
    { texto: 'Buscar ticket', icono: '/img/buscar.png', ruta: '/buscarAdmin' },
  ];

  return (
    <div className="container-principal-admin">
      {/* Componente reutilizable que contiene la barra superior y datos de sesión */}
      <EncabezadoAdmin />

      <main className="contenido-principal-admin">
        <h2 className="titulo-principal-admin">ADMINISTRADOR</h2>

        <div className="lista-opciones-principal-admin">
          {opciones_principal_admin.map((opcion, index) => (
            <div 
              key={index} 
              className="fila-opcion-principal-admin"
              onClick={() => navigate_principal_admin(opcion.ruta)}
            >
              <div className="contenedor-icono-principal-admin">
                <img 
                  src={opcion.icono} 
                  alt={opcion.texto} 
                  className="imagen-icono-principal-admin" 
                />
              </div>
              <span className="texto-opcion-principal-admin">{opcion.texto}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default PrincipalAdmin;