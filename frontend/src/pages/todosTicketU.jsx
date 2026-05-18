//El .js de esta pantalla es el de misTickets.js
import React, { useState, useEffect } from 'react'; 
import '../styles/todosTicketU.css';
import { useNavigate } from 'react-router-dom';
import HeaderPU from '../components/HeaderPU';

function TodosTicketU() {
  const navigate_todosTickettU = useNavigate();
  
  const [tickets_todosTickettU, setTickets_todosTickettU] = useState([]);
  const [busqueda_todosTickettU, setBusqueda_todosTickettU] = useState('');
  const [cargando, setCargando] = useState(true);

  // Lógica para traer los datos del Backend
useEffect(() => {
  const obtenerTickets = async () => {
    // Buscamos exhaustivamente en las claves que usas en el sistema
    const id_usuario = localStorage.getItem('id_base') || localStorage.getItem('id_usuario') || localStorage.getItem('id');
    
    // Si no existe, o si tiene almacenado textualmente la palabra "undefined"
    if (!id_usuario || id_usuario === 'undefined') {
      console.error("No se encontró un ID de usuario válido en el localStorage");
      setCargando(false);
      return;
    }

    try {
      const response = await fetch(`/api/mis-tickets/${id_usuario}`);
      const data = await response.json();
      
      if (response.ok) {
        setTickets_todosTickettU(data); 
      } else {
        console.error("Error al obtener tickets:", data.error);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    } finally {
      document.title = "Mis Tickets"; // Opcional, o lo que gustes
      setCargando(false);
    }
  };

  obtenerTickets();
}, []);

  // Función utilitaria para evitar desbordes en celdas largas
  const recortarTexto = (texto, maximo = 40) => {
    if (!texto) return "";
    return texto.length > maximo ? texto.substring(0, maximo) + "..." : texto;
  };

  // Lógica de filtrado dinámico (Actualizada a las propiedades nativas)
  const filtrados_todosTickettU = tickets_todosTickettU.filter((ticket) => {
    const idStr = ticket.id_ticket?.toString() || "";
    const tituloStr = (ticket.titulo || ticket.titulo_falla || "")?.toLowerCase(); // Soporta ambos formatos
    const estadoStr = ticket.estado?.toLowerCase() || "";
    const termino = busqueda_todosTickettU.toLowerCase();

    return idStr.includes(termino) || tituloStr.includes(termino) || estadoStr.includes(termino);
  });

  return (
    <div className="container-todosTickettU">
      <HeaderPU />

      <main className="contenido-tabla-todosTickettU">
        <div className="encabezado-flex-todosTickettU">
          <h2 className='titulo-todosTickettU'>Mis Tickets Reportados</h2>
          
          <div className="buscador-contenedor-todosTickettU">
            <input 
              type="text" 
              placeholder="Buscar por título o estado..." 
              value={busqueda_todosTickettU}
              onChange={(e) => setBusqueda_todosTickettU(e.target.value)}
            />
            <span className="icono-lupa-todosTickettU">🔍</span>
          </div>
        </div>

        <div className="tabla-wrapper-todosTickettU">
          <table className="tabla-tickets-todosTickettU">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Título</th>
                <th>Descripción</th>
                <th className="col-fecha-todosTickettU">Fecha Creación</th>
                <th className="col-fecha-todosTickettU">Fecha Cierre</th>
                <th>Estado</th>
                <th className="col-tecnico-todosTickettU">Técnico</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>
                    Cargando tu historial de tickets...
                  </td>
                </tr>
              ) : filtrados_todosTickettU.length > 0 ? (
                filtrados_todosTickettU.map((ticket) => {
                  // Respaldo dinámico de campos para evitar celdas vacías
                  const tituloFinal = ticket.titulo || ticket.titulo_falla;
                  const descripcionFinal = ticket.descripcion || ticket.descripcion_falla;
                  const fechaFinal = ticket.fecha || ticket.fecha_creacion;

                  return (
                    <tr 
                      key={ticket.id_ticket} 
                      className="fila-ticket-todosTickettU"
                      onDoubleClick={() => navigate_todosTickettU(`/detalle-ticket/${ticket.id_ticket}`)} 
                    >
                      <td><strong>{ticket.id_ticket}</strong></td>
                      <td>{localStorage.getItem('usuarioNombre') || 'Prueba'}</td>
                      <td title={tituloFinal}>{recortarTexto(tituloFinal, 25)}</td>
                      <td className="celda-descripcion" title={descripcionFinal}>
                        {recortarTexto(descripcionFinal, 35)}
                      </td>
                      <td>{fechaFinal}</td>
                      <td>{ticket.fechacierre}</td> 
                      <td>
                        <span className={`estado-badge estado-${ticket.estado ? ticket.estado.toLowerCase().replace(" ", "-") : "abierto"}`}>
                          {ticket.estado}
                        </span>
                      </td>
                      <td>{ticket.tecnico || 'Pendiente'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>
                    {busqueda_todosTickettU ? `No se encontraron resultados para "${busqueda_todosTickettU}"` : "No tienes tickets registrados aún."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default TodosTicketU;