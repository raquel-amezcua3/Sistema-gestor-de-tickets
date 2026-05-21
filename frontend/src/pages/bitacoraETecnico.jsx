//El archivo es bitacoraETecnico.jsx y bitacoraETecnico.js
//Esta pantalla sirve para que el tecnico vea la bitacora de los equipos y pueda poner comentarios.
// TECNICO

import React, { useState, useEffect } from 'react';
import '../styles/bitacoraETecnico.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function BitacoraETecnico() {
    const navigate_bitacora_tecnico = useNavigate();
    const { id_bitacora_tecnico } = useParams(); 
    const location = useLocation();
    
    // --- ESTADOS ---
    const [idEquipoReal, setIdEquipoReal] = useState(location.state?.idEquipoReal || 22);
    const [mostrarModal_bitacora_tecnico, setMostrarModal_bitacora_tecnico] = useState(false);
    const [registros_bitacora_tecnico, setRegistros_bitacora_tecnico] = useState([]); 
    const [cargando_bitacora_tecnico, setCargando_bitacora_tecnico] = useState(false);

    // 📌 OBTENER EL TÉCNICO AUTENTICADO AUTOMÁTICAMENTE DESDE LA SESIÓN
    const [tecnicoAutenticado, setTecnicoAutenticado] = useState(() => {
        try {
            // Intenta leer el usuario que inició sesión guardado por tu Login
            const usuarioLogueado = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
            if (usuarioLogueado) {
                const parsed = JSON.parse(usuarioLogueado);
                return {
                    id_tecnico: parsed.id_tecnico || 6, // Si no se mapeó id_tecnico directo en login, usa 6 por defecto
                    id_base: parsed.id_base || 15,
                    nombre: parsed.nombre || "Itzel Amezcua"
                };
            }
        } catch (error) {
            console.error("Error leyendo la sesión del técnico:", error);
        }
        
        // Retorno de respaldo por defecto (Itzel Amezcua) para desarrollo seguro
        return {
            id_tecnico: 6,
            id_base: 15,
            nombre: "Itzel Amezcua"
        };
    });

    const [formComentario_bitacora_tecnico, setFormComentario_bitacora_tecnico] = useState({
        componente_afectado: '',
        tipo_modificacion: '',
        referencia_pieza: '',
        estado_actual: ''
    });

    // =========================================================================
    // 1. CARGA INICIAL: CONSULTA DE HISTORIAL REAL (GET)
    // =========================================================================
    useEffect(() => {
        const cargarDatosIniciales = async () => {
            if (!idEquipoReal) return;
            
            try {
                setCargando_bitacora_tecnico(true);
                const idNumerico = parseInt(idEquipoReal, 10);

                console.log(`📡 Consultando bitácora para el equipo ID: ${idNumerico}`);
                const response = await fetch(`/api/bitacora-equipo/${idNumerico}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("🎯 Datos recibidos del backend con técnicos:", data);
                    if (Array.isArray(data)) {
                        setRegistros_bitacora_tecnico(data); 
                    }
                } else {
                    const errData = await response.json().catch(() => ({}));
                    console.error("❌ El backend respondió con error:", response.status, errData);
                }

            } catch (error) {
                console.error("❌ Error crítico al conectar con el servidor:", error);
            } finally {
                setCargando_bitacora_tecnico(false);
            }
        };

        cargarDatosIniciales();
    }, [idEquipoReal]);

    const obtenerBitacoraEquipo = async () => {
        try {
            const idNumerico = parseInt(idEquipoReal, 10);
            const response = await fetch(`/api/bitacora-equipo/${idNumerico}`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setRegistros_bitacora_tecnico(data); 
                }
            }
        } catch (error) {
            console.error("Error al refrescar la tabla desde la base de datos:", error);
        }
    };

    // =========================================================================
    // 2. GUARDAR NUEVO COMENTARIO CON USUARIO DINÁMICO (POST)
    // =========================================================================
    const manejarEnvioComentario = async () => {
        const { componente_afectado, tipo_modificacion, referencia_pieza, estado_actual } = formComentario_bitacora_tecnico;

        if (!componente_afectado.trim() || !tipo_modificacion.trim() || !estado_actual.trim()) {
            alert("⚠️ Error: Faltan campos obligatorios para guardar en la bitácora.");
            return;
        }

        // Se estructuran los datos usando la información viva del técnico logueado
        const datosEnviar = {
            id_equipo: parseInt(idEquipoReal, 10),          
            id_tecnico: parseInt(tecnicoAutenticado.id_tecnico, 10), 
            id_base: parseInt(tecnicoAutenticado.id_base, 10),       
            componente_afectado: componente_afectado.trim(),
            tipo_modificacion: tipo_modificacion.trim(),
            referencia_pieza: referencia_pieza.trim() || 'N/A',
            estado_actual: estado_actual.trim()
        };

        try {
            const response = await fetch(`/api/bitacora-equipo`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datosEnviar)
            });

            const data = await response.json();

            if (response.ok) {
                setMostrarModal_bitacora_tecnico(false);
                setFormComentario_bitacora_tecnico({
                    componente_afectado: '',
                    tipo_modificacion: '',
                    referencia_pieza: '',
                    estado_actual: ''
                });
                await obtenerBitacoraEquipo(); 
                alert(`🎉 Registro guardado con éxito por ${tecnicoAutenticado.nombre}.`);
            } else {
                alert(`❌ Error del Servidor: ${data.error || 'Faltan campos obligatorios'}`);
            }
        } catch (error) {
            console.error("❌ Error crítico de conexión:", error);
            alert("Ocurrió un error de conexión con el servidor.");
        }
    };

    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return 'Sin fecha';
        const fecha = new Date(fechaISO);
        if (isNaN(fecha.getTime())) return fechaISO.split('T')[0]; 
        return fecha.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="container-bitacora-tecnico">
            <EncabezadoTecnico />
            <main className="contenido-bitacora-tecnico">
                <div className="seccion-superior-bitacora-tecnico">
                    <h2 className="titulo-bitacora-tecnico">Bitácora del equipo (ID Equipo: {idEquipoReal})</h2>
                    <button onClick={() => setMostrarModal_bitacora_tecnico(true)} className="boton-nuevo-comentario-bitacora-tecnico">
                        + Nuevo comentario
                    </button>
                </div>

                <div className="tabla-wrapper-bitacora-tecnico">
                    <table className="tabla-principal-bitacora-tecnico">
                        <thead>
                            <tr>
                                <th>ID del comentario</th>
                                <th>Fecha del comentario</th>
                                <th>Componente afectado</th>
                                <th>Tipo de modificación</th>
                                <th>Referencia pieza</th>
                                <th>Estado actual</th>
                                <th>Comentario por</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargando_bitacora_tecnico ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                        Consultando bitácora en la base de datos...
                                    </td>
                                </tr>
                            ) : registros_bitacora_tecnico.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
                                        No hay registros en la bitácora de este equipo.
                                    </td>
                                </tr>
                            ) : (
                                registros_bitacora_tecnico.map((reg) => (
                                    <tr key={reg.id_comentario} className="fila-bitacora-tecnico">
                                        <td style={{ fontWeight: 'bold' }}>{String(reg.id_comentario).padStart(3, '0')}</td>
                                        <td>{formatearFecha(reg.fecha_comentario)}</td>
                                        <td>{reg.componente_afectado}</td>
                                        <td>{reg.tipo_modificacion}</td>
                                        <td>{reg.referencia_pieza || 'N/A'}</td>
                                        <td>{reg.estado_actual}</td>
                                        <td style={{ color: '#0056b3', fontWeight: '500' }}>{reg.nombre_tecnico || 'Sistema'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {mostrarModal_bitacora_tecnico && (
                <div className="overlay-bitacora-tecnico">
                    <div className="modal-bitacora-tecnico">
                        <h2 className="titulo-modal-bitacora-tecnico">Nuevo comentario a la Bitácora del equipo</h2>
                        <img src="/img/computadora.png" alt="icon" style={{width: '50px', display:'block', margin:'10px auto'}} />
                        <div className="cuerpo-modal-bitacora-tecnico">
                            <div className="fila-modal-bitacora-tecnico">
                                <label>Fecha y hora</label>
                                <input type="text" value={new Date().toLocaleString('es-MX')} readOnly className="input-auto-bitacora-tecnico" />
                            </div>
                            <div className="fila-modal-bitacora-tecnico">
                                <label>Técnico</label>
                                {/* 📌 Muestra dinámicamente el nombre del técnico de la sesión actual */}
                                <input type="text" value={tecnicoAutenticado.nombre} readOnly className="input-auto-bitacora-tecnico" />
                            </div>
                            <div className="fila-modal-bitacora-tecnico">
                                <label>Componente afectado</label>
                                <input 
                                    type="text" 
                                    value={formComentario_bitacora_tecnico.componente_afectado}
                                    onChange={(e) => setFormComentario_bitacora_tecnico({...formComentario_bitacora_tecnico, componente_afectado: e.target.value})}
                                    placeholder="Ej. Cable ethernet, Memoria RAM..."
                                />
                            </div>
                            <div className="fila-modal-bitacora-tecnico">
                                <label>Tipo de modificación</label>
                                <input 
                                    type="text" 
                                    value={formComentario_bitacora_tecnico.tipo_modificacion}
                                    onChange={(e) => setFormComentario_bitacora_tecnico({...formComentario_bitacora_tecnico, tipo_modificacion: e.target.value})}
                                    placeholder="Ej. Cambie el cable, Mantenimiento..."
                                />
                            </div>
                            <div className="fila-modal-bitacora-tecnico">
                                <label>Referencia de la pieza</label>
                                <input 
                                    type="text" 
                                    value={formComentario_bitacora_tecnico.referencia_pieza}
                                    onChange={(e) => setFormComentario_bitacora_tecnico({...formComentario_bitacora_tecnico, referencia_pieza: e.target.value})}
                                    placeholder="Ej. Cable ethernet o N/A"
                                />
                            </div>
                            <div className="fila-modal-bitacora-tecnico">
                                <label>Estado actual del equipo</label>
                                <input 
                                    type="text" 
                                    value={formComentario_bitacora_tecnico.estado_actual}
                                    onChange={(e) => setFormComentario_bitacora_tecnico({...formComentario_bitacora_tecnico, estado_actual: e.target.value})}
                                    placeholder="Ej. Funcional, Operativo..."
                                />
                            </div>
                        </div>
                        <div className="footer-modal-bitacora-tecnico">
                            <button className="btn-anadir-bitacora-tecnico" onClick={manejarEnvioComentario}>
                                Añadir comentario
                            </button>
                            <button className="btn-cancelar-bitacora-tecnico" onClick={() => setMostrarModal_bitacora_tecnico(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BitacoraETecnico;