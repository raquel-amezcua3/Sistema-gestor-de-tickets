import React, { useState } from 'react';
import '../styles/listaAdmin.css';
import { useNavigate } from 'react-router-dom';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function ListaAdmin() {
  const navigate_lista_admin = useNavigate();

  // 1. Datos de ejemplo para los técnicos
  const [tecnicos_lista_admin] = useState([
    { id: '01', nombre: 'Juan Pérez', correo: 'juan.p@bodesa.com', telefono: '3121234567', extension: '101' },
    { id: '02', nombre: 'Ana García', correo: 'ana.g@bodesa.com', telefono: '3129876543', extension: '102' },
    { id: '03', nombre: 'Roberto Sánchez', correo: 'roberto.s@bodesa.com', telefono: '3124567890', extension: '103' },
    { id: '04', nombre: 'Lucía Méndez', correo: 'lucia.m@bodesa.com', telefono: '3120001122', extension: '104' },
  ]);

  // 2. Estado para el buscador
  const [busqueda_lista_admin, setBusqueda_lista_admin] = useState('');

  // 3. Lógica de filtrado
  const filtrados_lista_admin = tecnicos_lista_admin.filter((tecnico) => {
    return Object.values(tecnico).some((valor) =>
      valor.toString().toLowerCase().includes(busqueda_lista_admin.toLowerCase())
    );
  });

  return (
    <div className="container-lista-admin">
      <EncabezadoAdmin />

      <main className="contenido-lista-admin">
        <div className="encabezado-seccion-lista-admin">
          <h2 className='titulo-lista-admin'>Lista de tecnicos</h2>
          
          {/* Buscador similar a la imagen f81fd5 */}
          <div className="buscador-lista-admin">
            <input 
              type="text" 
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
                  <td colSpan="5" style={{textAlign: 'center'}}>No se encontraron técnicos</td>
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