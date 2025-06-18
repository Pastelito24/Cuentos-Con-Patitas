import React, { useEffect, useState } from 'react';

const MiFundacion = () => {
  const [fundacion, setFundacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/fundacion_bp')
      .then(res => res.json())
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
  if (error) return <div>{error}</div>;

  if (!fundacion) {
    return (
      <div>
        <h2>No tienes una fundación registrada.</h2>
        <button>Registrar fundación</button>
      </div>
    );
  }

  return (
    <div>
      <h2>¡Bienvenido, {fundacion.nombre}!</h2>
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