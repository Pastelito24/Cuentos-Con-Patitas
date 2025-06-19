import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ListaFundaciones = () => {
  const [fundaciones, setFundaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/fundaciones')
      .then(res => res.json())
      .then(data => {
        setFundaciones(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar las fundaciones');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando fundaciones...</div>;
  if (error) return <div>{error}</div>;

  if (fundaciones.length === 0) return <div>No hay fundaciones registradas.</div>;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
      {fundaciones.map(f => (
        <div
          key={f.nit}
          style={{ border: '1px solid #ccc', borderRadius: 12, padding: 16, width: 260, cursor: 'pointer', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 2px 8px #0001' }}
          onClick={() => navigate(`/fundacion/${f.nit}`)}
        >
          {f.foto_url ? (
            <img
              src={f.foto_url}
              alt={f.nombre}
              style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, background: '#eee', border: '2px solid #A7D0F5', marginBottom: 12 }}
              onError={e => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.querySelector('.no-foto').style.display = 'flex'; }}
            />
          ) : null}
          <div className="no-foto" style={{ width: '100%', height: 140, borderRadius: 8, background: '#eee', marginBottom: 12, display: f.foto_url ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 28, border: '2px dashed #A7D0F5' }}>
            Sin foto
          </div>
          <h3 style={{ textAlign: 'center', color: '#4B3A2D', fontWeight: 'bold', fontSize: '1.3rem', margin: 0 }}>{f.nombre}</h3>
        </div>
      ))}
    </div>
  );
};

export default ListaFundaciones; 