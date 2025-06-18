import React, { useEffect, useState } from 'react';

const FormularioFundacion = () => {
  const [fundacion, setFundacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div>Cargando...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  if (!fundacion) {
    // Si no hay fundación registrada, muestra el formulario de registro
    return (
      <form>
        <h3>Registrar Fundación</h3>
        <input type="text" placeholder="Nombre" name="nombre" /><br />
        <input type="text" placeholder="NIT" name="nit" /><br />
        <input type="text" placeholder="Dirección" name="direccion" /><br />
        <input type="text" placeholder="Teléfono" name="telefono" /><br />
        <input type="email" placeholder="Email" name="email" /><br />
        <input type="text" placeholder="Persona a cargo" name="persona_acargo" /><br />
        <input type="password" placeholder="Contraseña" name="contrasena" /><br />
        <button type="submit">Registrar</button>
      </form>
    );
  }

  // Si hay fundación registrada, muestra los datos
  return (
    <div style={{padding: 24}}>
      <h2>¡Bienvenido, {fundacion.nombre}!</h2>
      <p><b>NIT:</b> {fundacion.nit}</p>
      <p><b>Dirección:</b> {fundacion.direccion}</p>
      <p><b>Teléfono:</b> {fundacion.telefono}</p>
      <p><b>Email:</b> {fundacion.email}</p>
      <p><b>Persona a cargo:</b> {fundacion.persona_acargo}</p>
      {/* Aquí puedes agregar más paneles, como ListaAnimales, etc. */}
    </div>
  );
};

export default FormularioFundacion; 