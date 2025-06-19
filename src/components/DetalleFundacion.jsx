import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DetalleFundacion = () => {
  const { nit } = useParams();
  const [fundacion, setFundacion] = useState(null);
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/fundaciones`).then(res => res.json()),
      fetch(`/api/fundacion/${nit}/animales`).then(res => res.json())
    ])
      .then(([fundaciones, animales]) => {
        const f = fundaciones.find(f => String(f.nit) === String(nit));
        setFundacion(f);
        setAnimales(animales);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar la fundación o los animales');
        setLoading(false);
      });
  }, [nit]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!fundacion) return <div>Fundación no encontrada.</div>;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 8, padding: 24 }}>
      {fundacion.foto_url && <img src={fundacion.foto_url} alt={fundacion.nombre} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }} />}
      <h2>{fundacion.nombre}</h2>
      <p><b>Dirección:</b> {fundacion.direccion}</p>
      <p><b>Teléfono:</b> {fundacion.telefono}</p>
      <p><b>Email:</b> {fundacion.email}</p>
      <p><b>Persona a cargo:</b> {fundacion.persona_acargo}</p>
      <h3>Animalitos disponibles:</h3>
      {animales.length === 0 ? (
        <p>No hay animalitos registrados en esta fundación.</p>
      ) : (
        <ul>
          {animales.map(animal => (
            <li key={animal.animal_id}>
              <b>{animal.nombre}</b> - {animal.especie} - {animal.edad} años
              {animal.imagen_url && <img src={animal.imagen_url} alt={animal.nombre} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginLeft: 8 }} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DetalleFundacion; 