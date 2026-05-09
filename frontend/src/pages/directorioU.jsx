import React, { useState, useEffect } from 'react';
import '../styles/directorioU.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function DirectorioU() {
  const navigate_directorioU = useNavigate();
  
  // 1. Estado para los usuarios que vienen de la base de datos
  const [usuarios_directorioU, setUsuarios_directorioU] = useState([]);
  const [busqueda_directorioU, setBusqueda_directorioU] = useState('');
  const [cargando, setCargando] = useState(true);

  // 2. Cargar los usuarios 
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('/api/directorio');
        const data = await response.json();
        if (response.ok) {
          setUsuarios_directorioU(data);
        }
      } catch (error) {
        console.error("Error cargando el directorio:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchUsuarios();
  }, []);

  // 3. Lógica de filtrado 
  const filtrados_directorioU = usuarios_directorioU.filter((usuario) => {
    return Object.values(usuario).some((valor) =>
      valor ? valor.toString().toLowerCase().includes(busqueda_directorioU.toLowerCase()) : false
    );
  });

  return (
    <div className="container-directorioU">
      <HeaderPU />

      <main className="contenido-directorioU">
        <div className="seccion-busqueda-directorioU">
          <div className="info-busqueda-directorioU">
            <span className="lupa-grande-directorioU">🔍</span>
            <h2>Buscar en el directorio</h2>
          </div>
          <input 
            type="text" 
            className="input-redondeado-directorioU"
            value={busqueda_directorioU}
            onChange={(e) => setBusqueda_directorioU(e.target.value)}
            placeholder="Busca por nombre, ID, extensión, correo..."
          />
        </div>

        <div className="tabla-wrapper-directorioU">
          <table className="tabla-usuarios-directorioU">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de usuario</th>
                <th>Correo electronico</th>
                <th>Telefono</th>
                <th>Extensión</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr><td colSpan="5" style={{textAlign: 'center'}}>Cargando usuarios...</td></tr>
              ) : filtrados_directorioU.length > 0 ? (
                filtrados_directorioU.map((usuario) => (
                  <tr key={usuario.id} className="fila-usuario-directorioU">
                    <td>{usuario.id}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.telefono}</td>
                    <td>{usuario.extension || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center'}}>No se encontraron coincidencias</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default DirectorioU;