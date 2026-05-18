import React, { useState, useEffect } from 'react'; 
import '../styles/listaAdmin.css';
import { useNavigate } from 'react-router-dom';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function ListaAdmin() {
  const navigate_lista_admin = useNavigate();
  const [tecnicos_lista_admin, setTecnicos_lista_admin] = useState([]);
  const [busqueda_lista_admin, setBusqueda_lista_admin] = useState('');

  useEffect(() => {
    const obtenerDatosCompletos = async () => {
      try {
        const [resTecnicos, resCargas] = await Promise.all([
          fetch('/api/admin/lista-tecnicos'),
          fetch('/api/admin/carga-tickets')
        ]);

        if (resTecnicos.ok && resCargas.ok) {
          const tecnicos = await resTecnicos.json();
          const cargas = await resCargas.json();

          // Unificamos usando id_tecnico de forma explícita
          const dataFormateada = tecnicos.map(tec => {
            const infoCarga = cargas.find(c => c.id_tecnico === tec.id_tecnico);
            return {
              id: tec.id_tecnico, // ID asignado directamente de id_tecnico para render en tabla
              nombre: tec.nombre,
              correo: tec.correo || 'N/A',
              telefono: tec.telefono || 'N/A',
              especialidad: tec.especialidad,
              carga: infoCarga ? infoCarga.carga_actual : 0
            };
          });

          setTecnicos_lista_admin(dataFormateada);
        }
      } catch (error) {
        console.error("❌ Error cargando los datos de los técnicos:", error);
      }
    };

    obtenerDatosCompletos();
  }, []);

  const filtrados_lista_admin = tecnicos_lista_admin.filter((tecnico) => {
    return Object.values(tecnico).some((valor) =>
      valor !== null && valor !== undefined && valor.toString().toLowerCase().includes(busqueda_lista_admin.toLowerCase())
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
            <img src="/img/lupa.png" alt="buscar" className="icono-lupa-lista-admin" />
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
                <th>Especialidad</th>
                <th>Carga actual</th>
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
                    <td>{tecnico.especialidad}</td>
                    <td>
                      <span className={tecnico.carga > 3 ? "carga-alta" : "carga-normal"}>
                        {tecnico.carga} {tecnico.carga === 1 ? 'ticket' : 'tickets'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
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