//Pantalla de la bitacora equipo
// USUARIO Y TECNICO

import React, { useState, useEffect } from 'react';
import '../styles/bitacoraEquipo.css';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';
import { Link } from 'react-router-dom';

function BitacoraEquipo() {
    const navigate_bitacora_equipo = useNavigate();
    const { id } = useParams(); // Por si necesitas el ID del equipo para el fetch
    const [registros_bitacora_equipo, setRegistros_bitacora_equipo] = useState([]);
    const [cargando_bitacora_equipo, setCargando_bitacora_equipo] = useState(false);

    return (
        <div className="container-bitacora-equipo">
            <HeaderPU />

            <main className="contenido-bitacora-equipo">
                <div className="seccion-superior-bitacora-equipo">
                    <h2 className="titulo-bitacora-equipo">Bitacora del equipo</h2>
                    
                    <Link to="/equipoRegistro" className="boton-registrar-bitacora-equipo">
                        + Registrar nuevo equipo
                    </Link>
                </div>

                <div className="tabla-wrapper-bitacora-equipo">
                    <table className="tabla-principal-bitacora-equipo">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha del comentario</th>
                                <th>Componente afectado</th>
                                <th>Tipo de modificación</th>
                                <th>Referencia pieza</th>
                                <th>Estado actual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cargando_bitacora_equipo ? (
                                <tr><td colSpan="6">Cargando bitácora...</td></tr>
                            ) : (
                                // Ejemplo de 2 filas vacías como en tu imagen
                                [1, 2].map((i) => (
                                    <tr key={i} className="fila-bitacora-equipo">
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
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

export default BitacoraEquipo;