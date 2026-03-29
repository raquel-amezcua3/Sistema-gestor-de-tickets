import React, { useState } from 'react';
import '../styles/directorioU.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function DirectorioU() {
  const navigate_directorioU = useNavigate();
  
  // 1. Datos de ejemplo para el directorio
  const [usuarios_directorioU] = useState([
    { id: '001', nombre: 'Juan Pérez', correo: 'juan.perez@bodesa.com', telefono: '3121234567', extension: '101' },
    { id: '002', nombre: 'Ana García', correo: 'ana.garcia@bodesa.com', telefono: '3129876543', extension: '102' },
    { id: '003', nombre: 'Luis Lopez', correo: 'luis.lopez@bodesa.com', telefono: '3124567890', extension: '103' },
    { id: '004', nombre: 'Carlos Martínez', correo: 'carlos.m@bodesa.com', telefono: '3121112233', extension: '104' },
  ]);

  // 2. Estado para el buscador
  const [busqueda_directorioU, setBusqueda_directorioU] = useState('');

  // 3. Lógica de filtrado MULTICAMPO
  // Esta función revisa todos los valores de cada objeto de usuario
  const filtrados_directorioU = usuarios_directorioU.filter((usuario) => {
    return Object.values(usuario).some((valor) =>
      valor.toString().toLowerCase().includes(busqueda_directorioU.toLowerCase())
    );
  });

  return (
    <div className="container-directorioU">
      <HeaderPU />

      <main className="contenido-directorioU">
        {/* Sección del Buscador Estilo image_3229d8.png */}
        <div className="seccion-busqueda-directorioU">
          <div className="info-busqueda-directorioU">
            <span className="lupa-grande-directorioU">🔍</span>
            {/* Actualicé el título para que el usuario sepa que puede buscar cualquier cosa */}
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

        {/* Tabla con encabezados negros como en la imagen */}
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
              {filtrados_directorioU.length > 0 ? (
                filtrados_directorioU.map((usuario) => (
                  <tr key={usuario.id} className="fila-usuario-directorioU">
                    <td>{usuario.id}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.telefono}</td>
                    <td>{usuario.extension}</td>
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