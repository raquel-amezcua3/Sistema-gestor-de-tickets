import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/seguimientoTicketU.css';
import HeaderPU from '../components/HeaderPU';

function SeguimientoTicketU() {
    const { id } = useParams();
    const navigate_seguimiento_usuario = useNavigate();

    // Este estado simula el estado real del ticket que vendría de tu BD
    // Valores posibles: 'Abierto', 'En proceso', 'Resuelto', 'Cerrado'
    const [estadoActual_seguimiento_usuario] = useState('Resuelto'); 

    const pasos_seguimiento_usuario = [
        {
            id: 'Abierto',
            titulo: 'Abierto',
            icono: '/img/ticket.png', // Asegúrate de tener estas imágenes
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

    return (
        <div className='container-seguimiento-usuario'>
            <HeaderPU />
            
            <main className='contenido-seguimiento-usuario'>
                <div className='cuadro-gris-seguimiento-usuario'>
                    <h2 className='titulo-seguimiento-usuario'>Seguimiento de tu ticket</h2>

                    <div className='contenedor-pasos-seguimiento-usuario'>
                        {pasos_seguimiento_usuario.map((paso) => (
                            <div 
                                key={paso.id} 
                                className={`tarjeta-paso-seguimiento-usuario ${estadoActual_seguimiento_usuario === paso.id ? 'activo' : 'inactivo'}`}
                            >
                                <img src={paso.icono} alt={paso.titulo} className='icono-paso-seguimiento-usuario' />
                                <h3>{paso.titulo}</h3>
                                <p>{paso.desc}</p>
                            </div>
                        ))}
                    </div>

                    <button 
                        className='btn-enterado-seguimiento-usuario'
                        onClick={() => navigate_seguimiento_usuario('/pendientesTicketU')}
                    >
                        Enterado
                    </button>
                </div>
            </main>
        </div>
    );
}

export default SeguimientoTicketU;