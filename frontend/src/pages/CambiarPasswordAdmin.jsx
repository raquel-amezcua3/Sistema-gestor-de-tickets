import React, { useState } from 'react';

function CambiarPasswordAdmin() {
  const [datos, setDatos] = useState({
    correo: 'admin@bodesa.com', // Lo dejamos por defecto para tu comodidad
    nuevaContrasena: ''
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('Procesando...');

    try {
      const response = await fetch('/api/admin/cambiar-password-manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: datos.correo.trim(),
          nuevaContrasena: datos.nuevaContrasena
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(`✅ ${data.mensaje}`);
        setDatos({ ...datos, nuevaContrasena: '' }); // Limpia el input
      } else {
        setMensaje(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      setMensaje("❌ No se pudo conectar con el servidor.");
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Llave Maestra de Contraseñas</h2>
      <p style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>Cambia la contraseña de cualquier perfil de forma segura.</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Correo electrónico:</label>
          <input 
            type="email" 
            name="correo"
            value={datos.correo} 
            onChange={handleChange}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontWeight: 'bold' }}>Nueva Contraseña (Texto plano):</label>
          <input 
            type="text" 
            name="nuevaContrasena"
            placeholder="Ej: T34MTicket*"
            value={datos.nuevaContrasena} 
            onChange={handleChange}
            required
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Actualizar Contraseña con Bcrypt
        </button>
      </form>

      {mensaje && (
        <div style={{ marginTop: '20px', padding: '10px', borderRadius: '4px', textAlign: 'center', backgroundColor: '#f8f9fa', fontWeight: 'bold', fontSize: '14px' }}>
          {mensaje}
        </div>
      )}
    </div>
  );
}

export default CambiarPasswordAdmin;