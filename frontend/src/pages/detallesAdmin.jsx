import React, { useState, useEffect } from 'react';
import '../styles/detallesAdmin.css';
import { useNavigate, useParams } from 'react-router-dom';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function DetallesAdmin() {
  const navigate_lista_admin = useNavigate();
  const { id } = useParams();

  const [editando, setEditando] = useState(false);
  
  // Estados para controlar los diferentes modales
  const [modalExito, setModalExito] = useState(false);
  const [modalConfirmarBaja, setModalConfirmarBaja] = useState(false);
  const [modalEliminado, setModalEliminado] = useState(false);

  const tecnicos_datos = [
    { id: '01', nombre: 'Juan Pérez', correo: 'juan.p@bodesa.com', telefono: '3121234567', extension: '101' },
    { id: '02', nombre: 'Ana García', correo: 'ana.g@bodesa.com', telefono: '3129876543', extension: '102' },
  ];

  const [tecnico_lista_admin, setTecnico_lista_admin] = useState({
    nombre: '', correo: '', telefono: '', extension: '', contrasena: ''
  });

  useEffect(() => {
    const encontrado = tecnicos_datos.find(t => t.id === id);
    if (encontrado) {
      setTecnico_lista_admin({ ...encontrado, contrasena: '********' });
    }
  }, [id]);

  // Handlers para los botones
  const handleGuardarActualizacion = () => {
    setModalExito(true);
    setEditando(false);
  };

  const confirmarBaja = () => {
    setModalConfirmarBaja(false);
    setModalEliminado(true);
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
                <label><span className="rojo-detalles-admin">*</span>Nombre de usuario</label>
                <input type="text" value={tecnico_lista_admin.nombre} readOnly={!editando} className={editando ? "input-editable" : ""} />
              </div>
              <div className="grupo-input-detalles-admin">
                <label><span className="rojo-detalles-admin">*</span>Correo electronico</label>
                <input type="text" value={tecnico_lista_admin.correo} readOnly={!editando} className={editando ? "input-editable" : ""} />
              </div>
              <div className="grupo-input-detalles-admin">
                <label><span className="rojo-detalles-admin">*</span>Telefono</label>
                <input type="text" value={tecnico_lista_admin.telefono} readOnly={!editando} className={editando ? "input-editable" : ""} />
              </div>
              <div className="grupo-input-detalles-admin">
                <label>Extension</label>
                <input type="text" value={tecnico_lista_admin.extension} readOnly={!editando} className={editando ? "input-editable" : ""} />
              </div>
              <div className="grupo-input-detalles-admin">
                <label><span className="rojo-detalles-admin">*</span>Contraseña</label>
                <input type="password" value={tecnico_lista_admin.contrasena} readOnly={!editando} className={editando ? "input-editable" : ""} />
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

      {/* MODAL 1: DATOS ACTUALIZADOS (ÉXITO) */}
      {modalExito && (
        <div className='overlay-modal-detalle-TU'>
          <div className='modal-exito-detalle-TU'>
            <div className='contenedor-check-detalle-TU'>
              <img src="/img/informacion-personal.png" alt="check" className="img-modal-icon-actualizar" /> 
            </div>
            <h2 className='titulo-DTU'>¡Datos actualizados!</h2>
            <button className='btn-aceptar-detalle-TU' onClick={() => setModalExito(false)}>Aceptar</button>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMAR BAJA */}
      {modalConfirmarBaja && (
        <div className='overlay-modal-detalle-TU'>
          <div className='modal-exito-detalle-TU'>
            <div className='contenedor-check-detalle-TU'>
              <img src="/img/tecnico.png" alt="check" className="img-modal-icon-actualizar" /> 
            </div>
            <h2 className='titulo-DTU'>¿Quieres dar de baja a este tecnico?</h2>
            <div className="container-botones-modal">
              <button className='btn-aceptar-detalle-TU' onClick={confirmarBaja}>Aceptar</button>
              <button className='btn-cancelar-modal' onClick={() => setModalConfirmarBaja(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ELIMINADO CORRECTAMENTE */}
      {modalEliminado && (
        <div className='overlay-modal-detalle-TU'>
          <div className='modal-exito-detalle-TU'>
            <div className='contenedor-check'>
               <span className='check-animado'>L</span> 
             </div>
            <h2 className='titulo-tecnico-Admin'>¡Tecnico eliminado correctamente!</h2>
            <button className='btn-aceptar-tecnico-detalle-TU' onClick={() => navigate_lista_admin('/listaAdmin')}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetallesAdmin;