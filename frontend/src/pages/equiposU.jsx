//Archivos equiposU.jsx y equipo.js (solo una parte)
//Sirve para ver todos los equipos registrados por ese usuario.
// USUARIO

import React, { useState, useEffect } from 'react';
import '../styles/equiposU.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';
import { Link } from 'react-router-dom';

function EquiposU() {
    const navigate = useNavigate();
    const [busqueda, setBusqueda] = useState("");
    const [equipos, setEquipos] = useState([]);
    const [cargando, setCargando] = useState(true);

    // 1. Cargar los equipos desde la base de datos al montar el componente
    useEffect(() => {
        const obtenerEquiposUser = async () => {
            // Recogemos los posibles identificadores del almacenamiento local
            const idUsuario = localStorage.getItem('id_usuario');
            const idBase = localStorage.getItem('id_base');
            const idGenerico = localStorage.getItem('id');

            // Enviamos con prioridad id_usuario, si no id_base, si no el id genérico
            const idIdentificador = idUsuario || idBase || idGenerico;

            if (!idIdentificador || idIdentificador === 'undefined' || idIdentificador === 'null') {
                console.error("❌ No se encontró un ID válido en el storage");
                setCargando(false);
                return;
            }

            try {
                setCargando(true);
                console.log("Consultando equipos para el ID:", idIdentificador);
                
                // SOLUCIÓN: Usamos la ruta relativa sin 'http://localhost:3000' para que funcione en Render
                const respuesta = await fetch(`/api/equipo/usuario/${idIdentificador}`);
                if (!respuesta.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }
                const datos = await respuesta.json();
                console.log("Equipos recibidos del servidor:", datos);
                setEquipos(datos);
            } catch (error) {
                console.error("❌ Error al conectar con la API de equipos:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerEquiposUser();
    }, []);

    // 2. Filtrado en tiempo real según lo que escriba el usuario en el input
    const equiposFiltrados = equipos.filter((equipo) => {
        const marca = equipo.marca?.toLowerCase() || "";
        const tipo = equipo.tipo_equipo?.toLowerCase() || "";
        const serie = equipo.numero_serie?.toLowerCase() || "";
        const termino = busqueda.toLowerCase();

        return marca.includes(termino) || tipo.includes(termino) || serie.includes(termino);
    });

    // Redirección al hacer doble click
    const manejarDobleClick = (id) => {
        try {
            const usuarioLogueado = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
            
            if (usuarioLogueado) {
                const parsed = JSON.parse(usuarioLogueado);
                const esUsuario = parsed.id_usuario || parsed.rol?.toLowerCase() === 'usuario' || !parsed.id_tecnico;

                if (esUsuario) {
                    navigate(`/bitacoraU/${id}`, { state: { idEquipoReal: id } });
                    return;
                }
            }
        } catch (error) {
            console.error("Error al detectar el rol en el doble click:", error);
        }

        navigate(`/bitacoraEquipo/${id}`, { state: { idEquipoReal: id } });
    };

    return (
        <div className="container-equipo-registrado">
            <HeaderPU />

            <main className="contenido-equipo-registrado">
                <div className="seccion-superior-equipo-registrado">
                    <div className="seccion-busqueda-equipo-registrado">
                        <div className="info-busqueda-equipo-registrado">
                            <span className="lupa-grande-equipo-registrado">🔍</span>
                            <h2>Buscar equipo que he registrado</h2>
                        </div>
                        <input 
                            type="text" 
                            className="input-redondeado-equipo-registrado"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar por marca, serie o tipo..."
                        />
                    </div>
                    
                    <Link to="/equipoRegistro" className="boton-registrar-equipo-registrado">
                        + Registrar nuevo equipo
                    </Link>
                </div>

                <p className="aviso-rojo-equipo-registrado">
                    *Doble click en el equipo para mostrar la bitacora de este.
                </p>

                <div className="tabla-wrapper-equipo-registrado">
                    <table className="tabla-principal-equipo-registrado">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo de equipo</th>
                                <th>Marca</th>
                                <th>Número de serie</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargando ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                        Cargando equipos...
                                    </td>
                                </tr>
                            ) : equiposFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                        {busqueda ? `No se encontraron equipos que coincidan con "${busqueda}"` : "No tienes equipos registrados actualmente."}
                                    </td>
                                </tr>
                            ) : (
                                equiposFiltrados.map((equipo) => (
                                    <tr 
                                        key={equipo.id_equipo} 
                                        className="fila-equipo-registrado"
                                        onDoubleClick={() => manejarDobleClick(equipo.id_equipo)}
                                        style={{ cursor: 'pointer' }}
                                        title="Doble clic para ver bitácora"
                                    >
                                        <td>{equipo.id_equipo}</td>
                                        <td>{equipo.tipo_equipo || 'No especificado'}</td>
                                        <td>{equipo.marca}</td>
                                        <td>{equipo.numero_serie || '—'}</td>
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

export default EquiposU;