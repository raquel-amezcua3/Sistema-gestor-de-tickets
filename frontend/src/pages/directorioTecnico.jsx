import React, { useState, useEffect } from 'react';
import '../styles/directorioTecnico.css';
import { useNavigate } from 'react-router-dom';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function DirectorioTecnico() {
  const navigate_directorio_tecnico = useNavigate();
  
  // 1. Estado para los datos (Empezamos con un arreglo vacío para llenar con la DB)
  const [usuarios_directorio_tecnico, setUsuarios_directorio_tecnico] = useState([]);
  const [busqueda_directorio_tecnico, setBusqueda_directorio_tecnico] = useState('');

  // 2. EFECTO PARA CARGAR LOS DATOS REALES
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await fetch('http://localhost:3000/directorio');
        const data = await response.json();
        
        if (response.ok) {
          setUsuarios_directorio_tecnico(data);
        } else {
          console.error("Error al obtener datos:", data.error);
        }
      } catch (error) {
        console.error("Error de conexión con el servidor:", error);
      }
    };

    cargarDatos();
  }, []);

  // 3. Lógica de filtrado MULTICAMPO
  const filtrados_directorio_tecnico = usuarios_directorio_tecnico.filter((usuario) => {
    return Object.values(usuario).some((valor) =>
      valor ? valor.toString().toLowerCase().includes(busqueda_directorio_tecnico.toLowerCase()) : false
    );
  });

  return (
    <div className="container-directorio-tecnico">
      <EncabezadoTecnico />

      <main className="contenido-directorio-tecnico">
        {/* Sección del Buscador */}
        <div className="seccion-busqueda-directorio-tecnico">
          <div className="info-busqueda-directorio-tecnico">
            <span className="lupa-contenedor-directorio-tecnico">
              <img src="/img/lupa.png" alt="Buscar" className="lupa-img-directorio-tecnico" />
            </span>
            <h2>Directorio de Contactos</h2>
          </div>
          <input 
            type="text" 
            className="input-redondeado-directorio-tecnico"
            value={busqueda_directorio_tecnico}
            onChange={(e) => setBusqueda_directorio_tecnico(e.target.value)}
            placeholder="Buscar por nombre, extensión, ID..."
          />
        </div>

        {/* Tabla Principal */}
        <div className="tabla-wrapper-directorio-tecnico">
          <table className="tabla-usuarios-directorio-tecnico">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de usuario</th>
                <th>Correo electrónico</th>
                <th>Teléfono</th>
                <th>Extensión</th>
              </tr>
            </thead>
            <tbody>
              {filtrados_directorio_tecnico.length > 0 ? (
                filtrados_directorio_tecnico.map((usuario) => (
                  <tr key={usuario.id} className="fila-usuario-directorio-tecnico">
                    <td>{usuario.id}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.telefono || '—'}</td>
                    <td>{usuario.extension || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="sin-coincidencias-directorio-tecnico">
                    No se encontraron coincidencias en el directorio
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default DirectorioTecnico;