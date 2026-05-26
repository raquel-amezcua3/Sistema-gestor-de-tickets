//El archivo es bitacoraEUsuario.jsx y bitacoraEUsuario.js
//Esta pantalla sirve para que el usuario vea la bitacora de sus equipos registrados
// USUARIO

import React, { useState, useEffect } from 'react';
import '../styles/bitacoraETecnico.css'; 
import { useParams, useLocation } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function BitacoraEUsuario() {
    const { id_equipo } = useParams(); // Captura el :id_equipo 
    const location = useLocation();
    
    // --- ESTADOS ---
    const [idEquipoReal, setIdEquipoReal] = useState(location.state?.idEquipoReal || id_equipo || 22);
    const [registros_bitacora_usuario, setRegistros_bitacora_usuario] = useState([]); 
    const [cargando_bitacora_usuario, setCargando_bitacora_usuario] = useState(false);

    // Obtener el ID del usuario desde la sesion
    const [usuarioAutenticado, setUsuarioAutenticado] = useState(() => {
        try {
            const usuarioLogueado = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
            if (usuarioLogueado) {
                const parsed = JSON.parse(usuarioLogueado);
                return {
                    id_usuario: parsed.id_usuario || parsed.id_base || null,
                    nombre: parsed.nombre || "Usuario General"
                };
            }
        } catch (error) {
            console.error("Error leyendo la sesión del usuario:", error);
        }
        return { id_usuario: null, nombre: "Usuario General" };
    });

    // 1. CARGA INICIAL: CONSULTA DE HISTORIAL (GET /api/bitacora-usuario/:id)
    useEffect(() => {
        const cargarBitacoraUsuario = async () => {
            if (!idEquipoReal) return;
            
            try {
                setCargando_bitacora_usuario(true);
                const idNumerico = parseInt(idEquipoReal, 10);

                console.log(`📡 Consultando bitácora (Vista Usuario) para el equipo ID: ${idNumerico}`);
                
                const response = await fetch(`http://localhost:3000/api/bitacora-usuario/${idNumerico}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("🎯 Historial recibido para el usuario:", data);
                    if (Array.isArray(data)) {
                        setRegistros_bitacora_usuario(data); 
                    }
                } else {
                    const errData = await response.json().catch(() => ({}));
                    console.error("❌ El backend respondió con error:", response.status, errData);
                }

            } catch (error) {
                console.error("❌ Error crítico al conectar con el servidor:", error);
            } finally {
                setCargando_bitacora_usuario(false);
            }
        };

        cargarBitacoraUsuario();
    }, [idEquipoReal]);

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
            <HeaderPU />
            <main className="contenido-bitacora-tecnico">
                
                <div className="seccion-superior-bitacora-tecnico">
                    <h2 className="titulo-bitacora-tecnico">Historial de comentarios del equipo (ID Equipo: {idEquipoReal})</h2>
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
                            {cargando_bitacora_usuario ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                                        Consultando bitácora en la base de datos...
                                    </td>
                                </tr>
                            ) : registros_bitacora_usuario.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
                                        No hay registros en la bitácora de este equipo.
                                    </td>
                                </tr>
                            ) : (
                                registros_bitacora_usuario.map((reg) => (
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
        </div>
    );
}

export default BitacoraEUsuario;