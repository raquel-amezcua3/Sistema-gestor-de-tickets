//FALTA
import React, { useState, useEffect } from 'react';
import '../styles/bitacoraETecnico.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import EncabezadoTecnico from '../components/EncabezadoTecnico';

function BitacoraETecnico() {
    const navigate_bitacora_tecnico = useNavigate();
    
    // Captura el ID del ticket desde la URL (Ej. 21)
    const { id_bitacora_tecnico } = useParams(); 
    const location = useLocation();
    
    // --- ESTADOS ---
    const [idEquipoReal, setIdEquipoReal] = useState(location.state?.idEquipoReal || 18);
    const [idBaseEquipo, setIdBaseEquipo] = useState(4); // Valor por defecto 4 según DB
    const [mostrarModal_bitacora_tecnico, setMostrarModal_bitacora_tecnico] = useState(false);
    
    // La tabla inicia vacía (id_equipo 18 no tiene registros previos)
    const [registros_bitacora_tecnico, setRegistros_bitacora_tecnico] = useState([]); 
    const [cargando_bitacora_tecnico, setCargando_bitacora_tecnico] = useState(false);

    // Estado del Formulario del Modal sincronizado con las columnas de tu DB
    const [formComentario_bitacora_tecnico, setFormComentario_bitacora_tecnico] = useState({
        componente_afectado: '',
        tipo_modificacion: '',
        referencia_pieza: '',
        estado_actual: ''
    });

    // =========================================================================
    // 1. CARGA INICIAL: CONSULTA DE DATOS DEL EQUIPO Y BITÁCORA REAL
    // =========================================================================
    useEffect(() => {
        const cargarDatosIniciales = async () => {
            if (!idEquipoReal) return;
            try {
                setCargando_bitacora_tecnico(true);
                
                // Consultamos tu endpoint individual para obtener el id_base correcto de la base de datos
                const resEquipo = await fetch(`/api/equipo/individual/${idEquipoReal}`);
                if (resEquipo.ok) {
                    const dataEquipo = await resEquipo.json();
                    setIdBaseEquipo(dataEquipo.id_base || 4);
                }

                // Consultamos el historial real de bitacora para el equipo 18
                const response = await fetch(`/api/bitacora-equipo/${idEquipoReal}`);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setRegistros_bitacora_tecnico(data); 
                    }
                }
            } catch (error) {
                console.error("❌ Error al conectar con el servidor para la carga inicial:", error);
            } finally {
                setCargando_bitacora_tecnico(false);
            }
        };

        cargarDatosIniciales();
    }, [idEquipoReal]);

    // Función intermedia para refrescar la tabla tras un guardado exitoso
    const obtenerBitacoraEquipo = async () => {
        try {
            const response = await fetch(`/api/bitacora-equipo/${idEquipoReal}`);
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
    // 2. GUARDAR COMENTARIO (PETICIÓN POST AL BACKEND)
    // =========================================================================
    const manejarEnvioComentario = async () => {
        const { 
            componente_afectado, 
            tipo_modificacion, 
            referencia_pieza, 
            estado_actual 
        } = formComentario_bitacora_tecnico;

        // Validación de campos requeridos antes de enviar
        if (!componente_afectado.trim() || !tipo_modificacion.trim() || !estado_actual.trim()) {
            alert("Error: Faltan campos obligatorios para guardar en la bitácora.");
            return;
        }

        // Mapeo exacto con los nombres de las columnas de tu tabla 'bitacora_equipo'
        const datosEnviar = {
            id_equipo: Number(idEquipoReal),          
            id_tecnico: 1, // ID de Raquel Amezcua en tu base de datos                           
            id_base: Number(idBaseEquipo) || 4,       
            componente_afectado: componente_afectado.trim(),
            tipo_modificacion: tipo_modificacion.trim(),
            referencia_pieza: referencia_pieza.trim() || 'N/A',
            estado_actual: estado_actual.trim()
        };

        console.log("📤 Guardando en la base de datos bitacora_equipo:", datosEnviar);

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
                // Si el backend guardó con éxito en SQL:
                setMostrarModal_bitacora_tecnico(false);
                
                // Reseteamos el formulario limpio
                setFormComentario_bitacora_tecnico({
                    componente_afectado: '',
                    tipo_modificacion: '',
                    referencia_pieza: '',
                    estado_actual: ''
                });
                
                // Volvemos a consultar la base de datos para pintar el nuevo registro real
                obtenerBitacoraEquipo(); 
                alert("🎉 Registro guardado con éxito en la base de datos.");
            } else {
                // Error devuelto directamente por las restricciones de tu Servidor Node/MySQL
                alert(`Error del Servidor: ${data.error || 'Faltan campos obligatorios en el JSON'}`);
            }
        } catch (error) {
            console.error("❌ Error crítico de conexión:", error);
            alert("Ocurrió un error de conexión con el servidor. Verifica que tu backend Node.js esté corriendo.");
        }
    };

    const formatearFecha = (fechaISO) => {
        if (!fechaISO) return '';
        return fechaISO.split('T')[0];
    };

    return (
        <div className="container-bitacora-tecnico">
            <EncabezadoTecnico />

            <main className="contenido-bitacora-tecnico">
                <div className="seccion-superior-bitacora-tecnico">
                    <h2 className="titulo-bitacora-tecnico">Bitácora del equipo (ID Equipo: {idEquipoReal})</h2>
                    
                    <button 
                        onClick={() => setMostrarModal_bitacora_tecnico(true)} 
                        className="boton-nuevo-comentario-bitacora-tecnico"
                    >
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
                            </tr>
                        </thead>
                        <tbody>
                            {cargando_bitacora_tecnico ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                        Consultando bitácora en la base de datos...
                                    </td>
                                </tr>
                            ) : registros_bitacora_tecnico.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
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
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* VENTANA EMERGENTE (MODAL) */}
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
                                <input type="text" value="Raquel Amezcua" readOnly className="input-auto-bitacora-tecnico" />
                            </div>

                            <div className="fila-modal-bitacora-tecnico">
                                <label>Componente afectado</label>
                                <input 
                                    type="text" 
                                    value={formComentario_bitacora_tecnico.componente_affected}
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