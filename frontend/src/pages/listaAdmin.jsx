import React, { useState, useEffect } from 'react'; 
import '../styles/listaAdmin.css';
import { useNavigate } from 'react-router-dom';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function ListaAdmin() {
  const navigate_lista_admin = useNavigate();

  // 1. Estado para los técnicos 
  const [tecnicos_lista_admin, setTecnicos_lista_admin] = useState([]);
  
  // 2. Estado para el buscador
  const [busqueda_lista_admin, setBusqueda_lista_admin] = useState('');

  // Funcion para traer los datos
  useEffect(() => {
    const obtenerTecnicos = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/usuarios/tecnicos');
        const data = await response.json();
        
        if (response.ok) {
          // Aseguramos los nombres para que coinicidan con la tabla
          const dataFormateada = data.map(tec => ({
            id: tec.id_usuario,
            nombre: tec.nombre,
            correo: tec.correo,
            telefono: tec.telefono,
            extension: tec.extension
          }));
          setTecnicos_lista_admin(dataFormateada);
        }
      } catch (error) {
        console.error("❌ Error al cargar técnicos:", error);
      }
    };

    obtenerTecnicos();
  }, []);

  // 3. Lógica de filtrado 
  const filtrados_lista_admin = tecnicos_lista_admin.filter((tecnico) => {
    return Object.values(tecnico).some((valor) =>
      valor && valor.toString().toLowerCase().includes(busqueda_lista_admin.toLowerCase())
    );
  });

  return (
    <div className="container-lista-admin">
      <EncabezadoAdmin />

      <main className="contenido-lista-admin">
        <div className="encabezado-seccion-lista-admin">
          <h2 className='titulo-lista-admin'>Lista de tecnicos</h2>
          
          <div className="buscador-lista-admin">
            <input 
              type="text" 
              placeholder="Buscar por nombre, correo o ID..."
              value={busqueda_lista_admin}
              onChange={(e) => setBusqueda_lista_admin(e.target.value)}
            />
            <img 
              src="/img/lupa.png" 
              alt="buscar" 
              className="icono-lupa-lista-admin" 
            />
          </div>
        </div>

        <div className="tabla-wrapper-lista-admin">
          <table className="tabla-datos-lista-admin">
            <thead>
              <tr>
                <th className="col-id-lista-admin">ID</th>
                <th>Nombre de usuario</th>
                <th>Correo electronico</th>
                <th>Telefono</th>
                <th>Extensión</th>
              </tr>
            </thead>
            <tbody>
              {filtrados_lista_admin.length > 0 ? (
                filtrados_lista_admin.map((tecnico) => (
                  <tr 
                    key={tecnico.id} 
                    className="fila-lista-admin"
                    onDoubleClick={() => navigate_lista_admin(`/detallesAdmin/${tecnico.id}`)} 
                    style={{ cursor: 'pointer' }}
                    title="Doble clic para ver detalles"
                  >
                    <td>{tecnico.id}</td>
                    <td>{tecnico.nombre}</td>
                    <td>{tecnico.correo}</td>
                    <td>{tecnico.telefono}</td>
                    <td>{tecnico.extension}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    No se encontraron técnicos
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

export default ListaAdmin;