import { useState } from 'react'
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

//Principales
import Home from './pages/home';
import Registro from './pages/registro';
import Login from './pages/login';
import PrincipalUsuario from './pages/principalUsuario';
import HeaderPU from './components/HeaderPU';
import NuevoTicketU from './pages/nuevoTicketU';
import PendientesTicketU from './pages/pendientesTicketU';
import DetalleTicketU from './pages/detalleTicketU';
import TodosTicketU from './pages/todosTicketU';
import BuscarTicketU from './pages/buscarTicketU';
import DirectorioU from './pages/directorioU';
import PerfilU from './pages/perfilU';
import SeguimientoTicketU from './pages/seguimientoTicketU';
import EquiposU from './pages/equiposU';
import EquipoRegistro from './pages/equipoRegistro';
import BitacoraEquipo from './pages/bitacoraEquipo';


import BitacoraEUsuario from './pages/bitacoraEUsuario';


//Pantallas de Admin
import PrincipalAdmin from './pages/principalAdmin';
import EncabezadoAdmin from './components/EncabezadoAdmin';
import ListaAdmin from './pages/listaAdmin';
import DetallesAdmin from './pages/detallesAdmin';
import NuevoTAdmin from './pages/nuevoTAdmin';
import BuscarAdmin from './pages/buscarAdmin';
import DatosTicketAdmin from './pages/datosTicketAdmin';
import AsignarAdmin from './pages/asignarAdmin';
import CambiarPasswordAdmin from "./pages/CambiarPasswordAdmin"; 



//Pantallas de Tecnico
import PrincipalTecnico from './pages/principalTecnico';
import PendienteTecnico from './pages/pendientesTecnico';
import DatosTicketTecnico from './pages/datosTicketTecnico';
import ResueltoTecnico from './pages/resueltoTecnico';
import DatosResueltoTecnico from './pages/datosResueltoTecnico';
import BuscarTecnico from './pages/buscarTecnico';
import DirectorioTecnico from './pages/directorioTecnico';
import PerfilTecnico from './pages/perfilTecnico';
import BitacoraETecnico from './pages/bitacoraETecnico';






function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/registro" element={<Registro/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/principalUsuario" element={<PrincipalUsuario/>} />
        <Route path="/headerPU" element={<HeaderPU/>} />
        <Route path="/nuevoTicketU" element={<NuevoTicketU/>} />
        <Route path="/pendientesTicketU" element={<PendientesTicketU/>} />
        <Route path="/detalleTicketU" element={<DetalleTicketU/>} />
        <Route path="/detalle-ticket/:id" element={<DetalleTicketU />} />
        <Route path="/todosTicketU" element={<TodosTicketU />} />
        <Route path="/buscarTicketU" element={<BuscarTicketU />} />
        <Route path="/directorioU" element={<DirectorioU />} />
        <Route path="/perfilU" element={<PerfilU />} />
        <Route path="/seguimientoTicketU/:id" element={<SeguimientoTicketU />} />
        <Route path="/equiposU" element={<EquiposU />} />
        <Route path="/equipoRegistro" element={<EquipoRegistro />} />
        <Route path="/bitacoraEquipo/:id" element={<BitacoraEquipo />} />

        {/* Pantallas del Administrador del sistema (rol 1) */}
        <Route path="/principalAdmin" element={<PrincipalAdmin />} />
        <Route path="/EncabezadoAdmin" element={<EncabezadoAdmin />} />
        <Route path="/listaAdmin" element={<ListaAdmin />} />
        <Route path="/detallesAdmin/:id" element={<DetallesAdmin />} />
        <Route path="/nuevoTAdmin" element={<NuevoTAdmin />} />
        <Route path="/buscarAdmin" element={<BuscarAdmin />} />
        <Route path="/datosTicketAdmin/:id" element={<DatosTicketAdmin />} />
        <Route path="/asignarAdmin" element={<AsignarAdmin />} />

        {/* Pantalla de tecnico (rol 2) */}
        <Route path="/principalTecnico" element={<PrincipalTecnico />} />
        <Route path="/pendientesTecnico" element={<PendienteTecnico />} />
        <Route path="/datosTicketTecnico/:id" element={<DatosTicketTecnico />} /> 
        <Route path="/resueltoTecnico" element={<ResueltoTecnico/>} /> 
        <Route path="/datosResueltoTecnico/:id" element={<DatosResueltoTecnico/>} /> 
        <Route path="/buscarTecnico" element={<BuscarTecnico/>} /> 
        <Route path="/directorioTecnico" element={<DirectorioTecnico/>} /> 
        <Route path="/perfilTecnico" element={<PerfilTecnico/>} /> 
        <Route path="/recuperar-admin-fácil" element={<CambiarPasswordAdmin />} />
        <Route path="/bitacoraU/:id_equipo" element={<BitacoraEUsuario />} />
        <Route path="/bitacoraETecnico/:id_equipo" element={<BitacoraETecnico />} />
      </Routes>
    </Router>
  )
}

export default App;
