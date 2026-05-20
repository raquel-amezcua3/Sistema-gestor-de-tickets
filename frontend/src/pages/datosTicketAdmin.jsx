//La pantalla datosTicketAdmin.jsx su .js es datosTicketAdmin.js
//En esta pantalla se muestran los detalles del ticket.
// ADMIN



import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/datosTicketAdmin.css';
import EncabezadoAdmin from '../components/EncabezadoAdmin';

function DatosTicketAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mostrarModal, setMostrarModal] = useState(false);
    const [tecnicos, setTecnicos] = useState([]);

    const [ticket, setTicket] = useState({
        id_ticket: id || '',
        nombre_usuario: '',
        categoria: '',
        subcategoria: '',
        prioridad: '',
        impacto: '',
        fecha_creacion: '',
        estado: '',
        titulo: '',
        descripcion: '',
        equipo_afectado: '',
        tecnico_asignado: ''
    });

    useEffect(() => {
        const cargarDatosTicket = async () => {
            try {
                
                // 1. Cargar Técnicos para el select dropdown
                const resTec = await fetch('/api/admin/usuarios/tecnicos');
                const dataTec = await resTec.json();
                setTecnicos(dataTec);

                // 2. Cargar Detalle del Ticket usando el ID de la URL
                const resTick = await fetch(`/api/datos-ticket-admin/detalle-ticket/${id}`);
                const dataTick = await resTick.json();
                
                if (resTick.ok) {
                    setTicket({
                        id_ticket: dataTick.id_ticket || id,
                        nombre_usuario: dataTick.nombre_usuario || 'N/A',
                        categoria: dataTick.categoria_servicio || '',
                        subcategoria: dataTick.subcategoria_falla || '',
                        prioridad: dataTick.nivel_prioridad || '',
                        impacto: dataTick.grado_impacto || '',
                        fecha_creacion: dataTick.fecha_creacion_formateada || '', // Asigna la fecha limpia desde SQL
                        estado: dataTick.estado || '',
                        titulo: dataTick.titulo_falla || '',
                        descripcion: dataTick.descripcion_falla || '',
                        equipo_afectado: dataTick.equipo_nombre || 'N/A', // Asigna el tipo y marca del equipo resuelto
                        tecnico_asignado: dataTick.id_tecnico || ''
                    });
                }
            } catch (err) {
                console.error("Error cargando datos:", err);
            }
        };
        cargarDatosTicket();
    }, [id]);

    const handleActualizar = async (e) => {
        e.preventDefault();
        try {
            // Se comunica con tu ruta PUT '/asignar-tecnico' mapeada en asignarAdmin.js
            const response = await fetch('/api/asignar-admin/asignar-tecnico', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_ticket: parseInt(ticket.id_ticket),
                    id_tecnico: parseInt(ticket.tecnico_asignado)
                })
            });

            if (response.ok) {
                setMostrarModal(true);
            } else {
                const errData = await response.json();
                alert(`Error: ${errData.error || 'No se pudo asignar el técnico'}`);
            }
        } catch (error) {
            console.error("Error en la petición:", error);
        }
    };

    return (
        <div className="container-datosTicketAdmin">
            <EncabezadoAdmin />

            <main className="contenido-admin">
                <h2 className="titulo-seccion-admin">Detalles del ticket</h2>

                <div className="cuadro-formulario-admin">
                    <div className="encabezado-formulario-admin">
                        <img className="icono-ticket-admin" alt="logo" src="/img/nuevo-ticket.png" />
                        <h3>Ticket #{ticket.id_ticket}</h3>
                        <p className="nota-informativa-admin">
                            * En esta sección solo se puede asignar o cambiar de técnico.
                         </p>
                    </div>

                    <form onSubmit={handleActualizar}>
                        <div className="grid-formulario-admin">
                            
                            {/* COLUMNA IZQUIERDA */}
                            <div className="columna-formulario-admin">
                                <div className="grupo-input-admin">
                                    <label>Nombre de usuario</label>
                                    <input type="text" value={ticket.nombre_usuario} readOnly className="input-readonly" />
                                </div>

                                <div className="grupo-input-admin">
                                    <label>Categoría de servicios</label>
                                    <input type="text" value={ticket.categoria} readOnly className="input-readonly" />
                                </div>

                                <div className="grupo-input-admin">
                                    <label>Subcategoría de falla</label>
                                    <input type="text" value={ticket.subcategoria} readOnly className="input-readonly" />
                                </div>

                                <div className="grupo-input-admin">
                                    <label>Nivel de prioridad</label>
                                    <input type="text" value={ticket.prioridad} readOnly className="input-readonly" />
                                </div>

                                <div className="grupo-input-admin">
                                    <label>Grado de impacto</label>
                                    <input type="text" value={ticket.impacto} readOnly className="input-readonly" />
                                </div>

                                <div className="grupo-input-admin">
                                    <label>Fecha de creación</label>
                                    <input type="text" value={ticket.fecha_creacion} readOnly className="input-readonly" />
                                </div>

                                <div className="grupo-input-admin">
                                    <label>Estado del ticket</label>
                                    <input type="text" value={ticket.estado} readOnly className="input-readonly" />
                                </div>
                            </div>

                            {/* COLUMNA DERECHA */}
                            <div className="columna-formulario-admin">
                                <div className="grupo-input-admin">
                                    <label><span className='requerido'>*</span>Técnico Asignado</label>
                                    <select 
                                        className="select-admin-editable"
                                        value={ticket.tecnico_asignado} 
                                        onChange={(e) => setTicket({...ticket, tecnico_asignado: e.target.value})}
                                        required
                                    >
                                        <option value="">-- Seleccione un técnico --</option>
                                        {tecnicos.map((tec) => (
                                            <option key={tec.id_tecnico || tec.id_usuario} value={tec.id_tecnico || tec.id_usuario}>
                                                {tec.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grupo-input-admin">
                                    <label>Título de la falla</label>
                                    <input type="text" value={ticket.titulo} readOnly className="input-readonly" />
                                </div>

                                <div className="grupo-input-admin area-texto-admin">
                                    <label>Descripción ¿qué sucede?</label>
                                    <textarea value={ticket.descripcion} readOnly className="textarea-readonly" />
                                </div>

                                <div className="grupo-input-admin">
                                    <label>Equipo afectado</label>
                                    <input type="text" value={ticket.equipo_afectado} readOnly className="input-readonly" />
                                </div>
                            </div>
                        </div>

                        <div className="contenedor-botones-admin">
                            <button type="submit" className="btn-actualizar">Actualizar datos</button>
                            <button type="button" className="btn-seguimiento" onClick={() => navigate(`/seguimientoTicketU/${ticket.id_ticket}`)}>
                                Seguimiento del ticket
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* MODAL EXITOSO */}
           {mostrarModal && (
                <div className='overlay-modal'>
                    <div className='modal-exito'>
                        <div className='contenedor-check'>
                            <img 
                                className='icono-exito' 
                                alt='exito' 
                                src='/img/comprobado.png' 
                                style={{ width: '80px', height: 'auto' }} 
                            />
                        </div>
                        <h2>¡Ticket asignado con éxito!</h2>
                        <p style={{ color: '#333', marginBottom: '20px' }}>
                            El técnico comenzará a trabajar en la solicitud a la brevedad.
                        </p>
                        <button className='btn-aceptar' onClick={() => { setMostrarModal(false); navigate('/asignarAdmin'); }}>
                            Aceptar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DatosTicketAdmin;