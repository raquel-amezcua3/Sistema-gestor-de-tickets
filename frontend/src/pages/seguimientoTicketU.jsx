import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/seguimientoTicketU.css';
import HeaderPU from '../components/HeaderPU';

function SeguimientoTicketU() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estado real que viene de la base de datos
    const [estadoActual, setEstadoActual] = useState(''); 
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const obtenerEstadoTicket = async () => {
            try {
                // Usamos la misma ruta de detalle que ya tienes
                const response = await fetch(`http://localhost:3000/detalle-ticket/${id}`);
                const data = await response.json();
                
                if (response.ok) {
                    // Importante: Asegúrate de que coincida con los IDs de pasos_seguimiento
                    setEstadoActual(data.estado); 
                }
            } catch (error) {
                console.error("Error al obtener seguimiento:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerEstadoTicket();
    }, [id]);

    const pasos_seguimiento_usuario = [
        {
            id: 'Abierto',
            titulo: 'Abierto',
            icono: '/img/ticket.png',
            desc: 'Tu solicitud ha sido recibida y está en espera de técnico.'
        },
        {
            id: 'En proceso',
            titulo: 'En proceso',
            icono: '/img/trabajando.png',
            desc: 'El técnico está trabajando en la solución.'
        },
        {
            id: 'Resuelto',
            titulo: 'Resuelto',
            icono: '/img/informacion-personal.png',
            desc: 'Se ha dado solucionado al problema. Favor de acudir a Soporte por su computadora.'
        },
        {
            id: 'Cerrado',
            titulo: 'Cerrado',
            icono: '/img/mis-tickets.png',
            desc: 'Tu ticket ha sido resuelto. ¡Gracias por utilizar nuestro servicio!'
        }
    ];

    if (cargando) return <div style={{textAlign: 'center', padding: '50px'}}>Cargando seguimiento...</div>;

    return (
        <div className='container-seguimiento-usuario'>
            <HeaderPU />
            
            <main className='contenido-seguimiento-usuario'>
                <div className='cuadro-gris-seguimiento-usuario'>
                    <h2 className='titulo-seguimiento-usuario'>Seguimiento de tu ticket #{id}</h2>

                    <div className='contenedor-pasos-seguimiento-usuario'>
                        {pasos_seguimiento_usuario.map((paso) => {
                            const esActivo = estadoActual?.toLowerCase() === paso.id.toLowerCase();

                            return (
                                <div 
                                    key={paso.id} 
                                    className={`tarjeta-paso-seguimiento-usuario ${esActivo ? 'activo' : 'inactivo'}`}
                                >
                                    <img src={paso.icono} alt={paso.titulo} className='icono-paso-seguimiento-usuario' />
                                    <h3>{paso.titulo}</h3>
                                    <p>{paso.desc}</p>
                                </div>
                            );
                        })}
                    </div>

                    <button 
                        className='btn-enterado-seguimiento-usuario'
                        onClick={() => navigate('/pendientesTicketU')}
                    >
                        Enterado
                    </button>
                </div>
            </main>
        </div>
    );
}

export default SeguimientoTicketU;