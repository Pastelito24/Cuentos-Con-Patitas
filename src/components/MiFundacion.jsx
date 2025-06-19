import React, { useEffect, useState } from 'react';

const MiFundacion = () => {
  const [fundacion, setFundacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editandoFoto, setEditandoFoto] = useState(false);
  const [nuevaFoto, setNuevaFoto] = useState(null);

  useEffect(() => {
    fetch('/api/mi_fundacion', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar la fundación');
        return res.json();
      })
      .then(data => {
        setFundacion(Object.keys(data).length === 0 ? null : data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error al cargar la fundación');
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    fetch('/api/crear_fundacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          window.location.reload();
        } else {
          setError(resp.error || 'Error al registrar la fundación');
        }
      })
      .catch(() => setError('Error al registrar la fundación'));
  };

  const handleFotoSubmit = (e) => {
    e.preventDefault();
    if (!nuevaFoto) {
      setError('Selecciona una imagen');
      return;
    }
    const formData = new FormData();
    formData.append('foto', nuevaFoto);
    fetch('/api/editar_foto_fundacion', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          setEditandoFoto(false);
          setNuevaFoto(null);
          window.location.reload();
        } else {
          setError(resp.error || 'Error al actualizar la foto');
        }
      })
      .catch(() => setError('Error al actualizar la foto'));
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  if (!fundacion) {
    return (
      <div>
        <h2>No tienes una fundación registrada.</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
          <div>
            <label>NIT:</label>
            <input type="text" name="nit" required />
          </div>
          <div>
            <label>Nombre:</label>
            <input type="text" name="nombre" required />
          </div>
          <div>
            <label>Dirección:</label>
            <input type="text" name="direccion" required />
          </div>
          <div>
            <label>Teléfono:</label>
            <input type="text" name="telefono" required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" required />
          </div>
          <div>
            <label>Persona a cargo:</label>
            <input type="text" name="persona_acargo" required />
          </div>
          <div>
            <label>Contraseña:</label>
            <input type="password" name="contrasena" required minLength={8} />
          </div>
          <button type="submit">Registrar fundación</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>¡Bienvenido, {fundacion.nombre}!</h2>
      {fundacion.foto_url && <img src={fundacion.foto_url} alt="Foto fundación" style={{ width: 200, height: 200, objectFit: 'cover', borderRadius: 8 }} />}
      {editandoFoto ? (
        <form onSubmit={handleFotoSubmit} style={{ marginTop: 16 }}>
          <input type="file" accept="image/*" onChange={e => setNuevaFoto(e.target.files[0])} required />
          <button type="submit">Guardar foto</button>
          <button type="button" onClick={() => { setEditandoFoto(false); setNuevaFoto(null); }}>Cancelar</button>
        </form>
      ) : (
        <button onClick={() => setEditandoFoto(true)} style={{ marginTop: 16 }}>Editar foto</button>
      )}
      <p>NIT: {fundacion.nit}</p>
      <p>Dirección: {fundacion.direccion}</p>
      <p>Teléfono: {fundacion.telefono}</p>
      <p>Email: {fundacion.email}</p>
      <p>Persona a cargo: {fundacion.persona_acargo}</p>
      {/* Aquí luego irá la lista de animalitos y botón para agregar */}
    </div>
  );
};

export default MiFundacion; 