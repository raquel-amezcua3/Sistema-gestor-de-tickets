//Archivos detallesAdmin.jsx y detallesAdmin.js
//Sirve para ver los detalles de los tecnicos registrados en el sistema
// ADMIN

import React, { useState, useEffect } from 'react';
import '../styles/detallesAdmin.css';
import { useNavigate, useParams } from 'react-router-dom';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function DetallesAdmin() {
  const navigate_lista_admin = useNavigate();
  const { id } = useParams(); // id_tecnico de la URL

  const [editando, setEditando] = useState(false);
  const [modalExito, setModalExito] = useState(false);
  const [modalConfirmarBaja, setModalConfirmarBaja] = useState(false);
  const [modalEliminado, setModalEliminado] = useState(false);

  const [tecnico_lista_admin, setTecnico_lista_admin] = useState({
    nombre: '', 
    correo: '', 
    telefono: '', 
    extension: '', 
    especialidad: '',
    contrasena: '********'
  });

  useEffect(() => {
    const cargarTecnico = async () => {
      try {
        const res = await fetch(`/api/admin/detalle-tecnico-perfil/${id}`);
        const data = await res.json();
        if (res.ok) {
          setTecnico_lista_admin({
            nombre: data.nombre || '',
            correo: data.correo || '',
            telefono: data.telefono || '',
            extension: data.extension || '',
            // Si es null o dice 'sin asignar', lo dejamos vacío o limpio para editar con facilidad
            especialidad: (data.especialidad && data.especialidad.toLowerCase() !== 'sin asignar') ? data.especialidad : '',
            contrasena: '********' 
          });
        }
      } catch (err) {
        console.error("Error cargando técnico:", err);
      }
    };
    cargarTecnico();
  }, [id]);

  const handleGuardarActualizacion = async () => {
    try {
      const res = await fetch(`/api/admin/usuarios/tecnicos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tecnico_lista_admin)
      });
      if (res.ok) {
        setModalExito(true);
        setEditando(false);
      } else {
        alert("Ocurrió un problema en el servidor al intentar actualizar.");
      }
    } catch (err) {
      alert("Error al actualizar");
    }
  };

  const confirmarBaja = async () => {
    try {
      const res = await fetch(`/api/admin/usuarios/tecnicos/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setModalConfirmarBaja(false);
        setModalEliminado(true);
      } else {
        alert("No se puede eliminar el técnico (puede tener tickets asignados)");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-detalles-admin">
      <EncabezadoAdmin />
      
      <main className="content-detalles-admin">
        <h2 className="titulo-pagina-detalles-admin">Detalles del tecnico</h2>

        <div className="card-detalles-admin">
          <div className="seccion-formulario-detalles-admin">
            <div className="header-seccion-detalles-admin">
              <img src="/img/tecnico.png" alt="icono" className="icon-detalles-admin" />
              <span className="label-header-detalles-admin">Datos del tecnico</span>
            </div>

            <div className="inputs-detalles-admin">
              <div className="grupo-input-detalles-admin">
                <label><span className="rojo-detalles-admin">*</span>Nombre</label>
                <input 
                  type="text" 
                  value={tecnico_lista_admin.nombre} 
                  onChange={(e) => setTecnico_lista_admin({...tecnico_lista_admin, nombre: e.target.value})}
                  readOnly={!editando} 
                  className={editando ? "input-editable" : ""} 
                />
              </div>

              <div className="grupo-input-detalles-admin">
                <label><span className="rojo-detalles-admin">*</span>Correo electronico</label>
                <input 
                  type="text" 
                  value={tecnico_lista_admin.correo} 
                  onChange={(e) => setTecnico_lista_admin({...tecnico_lista_admin, correo: e.target.value})}
                  readOnly={!editando} 
                  className={editando ? "input-editable" : ""} 
                />
              </div>

              <div className="grupo-input-detalles-admin">
                <label><span className="rojo-detalles-admin">*</span>Telefono</label>
                <input 
                  type="text" 
                  value={tecnico_lista_admin.telefono} 
                  onChange={(e) => setTecnico_lista_admin({...tecnico_lista_admin, telefono: e.target.value})}
                  readOnly={!editando} 
                  className={editando ? "input-editable" : ""} 
                />
              </div>

              <div className="grupo-input-detalles-admin">
                <label>Extension</label>
                <input 
                  type="text" 
                  value={tecnico_lista_admin.extension} 
                  onChange={(e) => setTecnico_lista_admin({...tecnico_lista_admin, extension: e.target.value})}
                  readOnly={!editando} 
                  className={editando ? "input-editable" : ""} 
                />
              </div>

              <div className="grupo-input-detalles-admin">
                <label><span className="rojo-detalles-admin">*</span>Especialidad</label>
                <input 
                  type="text" 
                  placeholder="Sin asignar (Escribe una especialidad)"
                  value={tecnico_lista_admin.especialidad} 
                  onChange={(e) => setTecnico_lista_admin({...tecnico_lista_admin, especialidad: e.target.value})}
                  readOnly={!editando} 
                  className={editando ? "input-editable" : ""} 
                />
              </div>

              <div className="grupo-input-detalles-admin">
                <label><span className="rojo-detalles-admin">*</span>Contraseña</label>
                <input 
                  type="password" 
                  value={tecnico_lista_admin.contrasena} 
                  onChange={(e) => setTecnico_lista_admin({...tecnico_lista_admin, contrasena: e.target.value})}
                  readOnly={!editando} 
                  className={editando ? "input-editable" : ""} 
                />
              </div>
            </div>

            <div className="container-boton-detalles-admin">
              {!editando ? (
                <>
                  <button className="btn-ok-detalles-admin" onClick={() => navigate_lista_admin('/listaAdmin')}>Ok</button>
                  <button className="btn-actualizar-detalles-admin" onClick={() => setEditando(true)}>Actualizar datos</button>
                </>
              ) : (
                <>
                  <button className="btn-baja-detalles-admin" onClick={() => setModalConfirmarBaja(true)}>Dar de baja</button>
                  <button className="btn-ok-detalles-admin" onClick={handleGuardarActualizacion}>Actualizar datos</button>
                </>
              )}
            </div>
          </div>

          <div className="seccion-imagen-detalles-admin">
            <img src="/img/servicios.webp" alt="Decoración" className="img-right-detalles-admin" />
          </div>
        </div>
      </main>

      {/* Ventana emergente de actualización exitosa */}
      {modalExito && (
        <div className='overlay-modal-detalle-TU'>
          <div className='modal-exito-detalle-TU'>
            <div className='contenedor-check-detalle-TU'>
              <img src="/img/informacion-personal.png" alt="check" className="img-modal-icon-actualizar" /> 
            </div>
            <h2 className='titulo-DTU-actu'>¡Datos actualizados!</h2>
            <button className='btn-aceptar-detalle-TU' onClick={() => setModalExito(false)}>Aceptar</button>
          </div>
        </div>
      )}

      {/* Confirmación antes de eliminar permanentemente */}
      {modalConfirmarBaja && (
        <div className='overlay-modal-detalle-TU'>
          <div className='modal-exito-detalle-TU'>
            <div className='contenedor-check-detalle-TU'>
              <img src="/img/tecnico.png" alt="check" className="img-modal-icon-actualizar" /> 
            </div>
            <h2 className='titulo-DTU-baja'>¿Quieres dar de baja a este tecnico?</h2>
            <div className="container-botones-modal">
              <button className='btn-aceptar-detalle-TU' onClick={confirmarBaja}>Aceptar</button>
              <button className='btn-cancelar-modal' onClick={() => setModalConfirmarBaja(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Ventana emergente de técnico eliminado y redirección */}
      {modalEliminado && (
        <div className='overlay-modal-detalle-TU'>
          <div className='modal-exito-detalle-TU'>
            <div className='contenedor-check'>
               <span className='check-animado'>L</span> 
             </div>
            <h2 className='titulo-tecnico-Admin'>¡Tecnico eliminado correctamente!</h2>
            <button className='btn-aceptar-tecnico-detalle-TU-baja' onClick={() => navigate_lista_admin('/listaAdmin')}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetallesAdmin;