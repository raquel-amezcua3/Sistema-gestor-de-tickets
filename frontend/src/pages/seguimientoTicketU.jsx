//El .js de esta pantalla es seguimientoTrazabilidad.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/seguimientoTicketU.css';
import HeaderPU from '../components/HeaderPU';

function SeguimientoTicketU() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [estadoActual, setEstadoActual] = useState('');
    const [comentarios, setComentarios] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerDatosSeguimiento = async () => {
            try {
                const response = await fetch(`/api/detalle-ticket/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setEstadoActual(data.estado);
                    setComentarios(data.historial || []); 
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setCargando(false);
            }
        };
        obtenerDatosSeguimiento();
    }, [id]);

    // =========================================================================
    // FUNCIÓN DEFINITIVA: ELIMINA LA HORA POR COMPLETO USANDO RECORTES
    // =========================================================================
    const formatearSoloFecha = (fechaInput) => {
        if (!fechaInput) return 'Sin fecha';
        
        try {
            const stringLimpio = fechaInput.toString().trim();

            // Si viene de MySQL tipo "2026-05-17 22:41:41", tomamos solo "2026-05-17"
            if (stringLimpio.includes('-')) {
                const soloFechaParte = stringLimpio.split(' ')[0]; // Corta y desecha la hora
                const [año, mes, dia] = soloFechaParte.split('-');
                
                if (año && mes && dia) {
                    return `${dia}/${mes}/${año}`; // Retorna estrictamente DD/MM/YYYY
                }
            }

            // Fallback por si es un objeto Date puro de JS
            const fechaObjeto = new Date(fechaInput);
            if (!isNaN(fechaObjeto.getTime())) {
                const dia = fechaObjeto.getDate().toString().padStart(2, '0');
                const mes = (fechaObjeto.getMonth() + 1).toString().padStart(2, '0');
                const año = fechaObjeto.getFullYear();
                return `${dia}/${mes}/${año}`;
            }

            return stringLimpio; 
        } catch (error) {
            console.error("Error al formatear la fecha:", error);
            return String(fechaInput);
        }
    };

    const estadosProgreso = [
        { id: 'Abierto', label: 'Abierto' },
        { id: 'En proceso', label: 'En Proceso' },
        { id: 'En espera de compra', label: 'En Espera de Compra' },
        { id: 'Resuelto', label: 'Resuelto' },
        { id: 'Cerrado', label: 'Cerrado' }
    ];

    if (cargando) return <div className="cargando">Cargando seguimiento...</div>;

    return (
        <div className='container-seguimiento-usuario'>
            <HeaderPU />
            
            <main className='contenido-seguimiento-usuario'>
                {/* ESTE ES EL CUADRO GRIS DE FONDO */}
                <div className='cuadro-gris-fondo'>
                    
                    <div className='cuadro-blanco-seguimiento'>
                        <h2 className='titulo-seguimiento-usuario'>Seguimiento del ticket.</h2>
                        <p style={{ color: '#666', fontSize: '15px', marginTop: '-15px', textAlign: 'left' }}>
                           Deslice la barra lateral azul para consultar el historial completo de actualizaciones.
                        </p>

                        {/* BARRA DE PROGRESO */}
                        <div className='barra-progreso-contenedor'>
                            {estadosProgreso.map((paso) => {
                                const esActivo = estadoActual?.toLowerCase() === paso.id.toLowerCase();
                                return (
                                    <div key={paso.id} className={`paso-flecha ${esActivo ? 'activo' : ''}`}>
                                        <span>{esActivo && '✓ '} {paso.label}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* SECCIÓN DE TRAZABILIDAD */}
                        <div className='seccion-trazabilidad'>
                            {comentarios.length === 0 ? (
                                <div className='no-comentarios' style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                    No hay actualizaciones disponibles en el seguimiento todavía.
                                </div>
                            ) : (
                                comentarios.map((item, index) => {
                                    // Se procesa de forma estricta para obtener sólo la fecha
                                    const fechaFormateada = formatearSoloFecha(item.fecha_registro || item.fecha);

                                    return (
                                        <div key={index} className='fila-seguimiento'>
                                            <div className='col-tiempo'>
                                                <div className='circulo-reloj'>
                                                    <img src="/img/reloj.png" alt="icon" />
                                                </div>
                                                <div className='datos-meta'>
                                                    <strong>{fechaFormateada}</strong>
                                                </div>
                                            </div>

                                            <div className='cuadro-comentario-item'>
                                                {item.evento ? (
                                                    <p><strong>Evento:</strong> {item.evento}</p>
                                                ) : (
                                                    <div className='detalles-tecnicos'>
                                                        <p style={{ margin: '0 0 8px 0' }}>
                                                            <span className="badge-estado-trazabilidad" style={{ fontWeight: 'bold', color: '#0056b3' }}>
                                                                Estado: {item.estado}
                                                            </span>
                                                        </p>
                                                        
                                                        {item.diagnostico_tecnico && (
                                                            <p><strong>Diagnóstico técnico:</strong> {item.diagnostico_tecnico}</p>
                                                        )}
                                                        {item.falla_real && (
                                                            <p><strong>Falla real:</strong> {item.falla_real}</p>
                                                        )}
                                                        {item.accion_tomada && (
                                                            <p><strong>Acción tomada:</strong> {item.accion_tomada}</p>
                                                        )}
                                                        {item.piezas_reemplazadas && (
                                                            <p><strong>Piezas reemplazadas:</strong> {item.piezas_reemplazadas}</p>
                                                        )}
                                                        {item.tiempo_laborado !== undefined && item.tiempo_laborado !== null && (
                                                            <p><strong>Tiempo laborado:</strong> {item.tiempo_laborado} min.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Botón fuera del cuadro blanco */}
                    <div className='contenedor-boton-footer'>
                        <button 
                            className='btn-enterado-seguimiento'
                            onClick={() => navigate('/pendientesTicketU')}
                        >
                            Enterado
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default SeguimientoTicketU;