import React from 'react';
import './AnimalFormCard.css'; // Agrega los estilos aquí

const AnimalFormCard = ({ onClose, onSubmit, animal = {} }) => {
  // Comprobación explícita para el estado inicial de disponibilidad.
  const isInitiallyAvailable = animal.disponibilidad === true;

  const [formData, setFormData] = React.useState({
    nombre: animal.nombre || '',
    edad: animal.edad || '',
    tipo_animal: animal.tipo_animal || 'Perro',
    genero: animal.genero || 'macho',
    raza: animal.raza || '',
    peso: animal.peso || '',
    condicion: animal.condicion || '',
    descripcion: animal.descripcion || '',
    disponibilidad: isInitiallyAvailable, // Usar el valor verificado
    foto: null,
  });

  const [showAdopcionCard, setShowAdopcionCard] = React.useState(false);
  const [adopcionLoading, setAdopcionLoading] = React.useState(false);
  const [adopcionError, setAdopcionError] = React.useState('');
  const [adopcionSuccess, setAdopcionSuccess] = React.useState('');
  const [adopcionId, setAdopcionId] = React.useState(null);

  // Mostrar la card si: (1) se está editando y el animal no está disponible al abrir, o (2) el usuario desmarca el checkbox de disponibilidad
  React.useEffect(() => {
    if (animal.animal_id && animal.disponibilidad === false) {
      setShowAdopcionCard(true);
    } else if (formData.disponibilidad === false && animal.animal_id) {
      setShowAdopcionCard(true);
    } else {
      setShowAdopcionCard(false);
    }
    // eslint-disable-next-line
  }, [animal.animal_id, animal.disponibilidad, formData.disponibilidad]);

  // Al abrir el modal de edición de un animal no disponible, obtener el adopcion_id correcto
  React.useEffect(() => {
    if (animal.animal_id && animal.disponibilidad === false) {
      fetch(`http://localhost:5000/api/adopcion_actual/${animal.animal_id}`, {
        credentials: 'include',
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.adopcion) {
            setAdopcionId(data.adopcion.adopcion_id);
          } else {
            setAdopcionId(null);
          }
        })
        .catch(() => setAdopcionId(null));
    } else {
      setAdopcionId(null);
    }
  }, [animal.animal_id, animal.disponibilidad]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSend = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        dataToSend.append(key, formData[key]);
      }
    }
    onSubmit(dataToSend);
  };

  const handleActualizarEstadoAdopcion = async (nuevoEstado) => {
    setAdopcionLoading(true);
    setAdopcionError('');
    setAdopcionSuccess('');
    try {
      const response = await fetch('http://localhost:5000/api/actualizar_estado_adopcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          adopcion_id: adopcionId,
          nuevo_estado: nuevoEstado
        })
      });
      const result = await response.json();
      if (result.success) {
        setAdopcionSuccess('¡Estado actualizado correctamente!');
        setShowAdopcionCard(false);
      } else {
        setAdopcionError(result.error || 'Error al actualizar el estado');
      }
    } catch (err) {
      setAdopcionError('Error de conexión con el servidor.');
    } finally {
      setAdopcionLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="form-card" onClick={(e) => e.stopPropagation()}>
        <h2>{animal.animal_id ? 'Editar Animalito' : 'Agregar Animalito'}</h2>
        {/* Formulario de animalito */}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
            <input type="number" name="edad" placeholder="Edad (años)" value={formData.edad} onChange={handleChange} required min="0" />
            
            <select name="tipo_animal" value={formData.tipo_animal} onChange={handleChange} required>
              <option value="Perro">Perro</option>
              <option value="Gato">Gato</option>
            </select>

            <select name="genero" value={formData.genero} onChange={handleChange} required>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>

            <input name="raza" placeholder="Raza" value={formData.raza} onChange={handleChange} required/>
            <input type="number" step="0.1" name="peso" placeholder="Peso (kg)" value={formData.peso} onChange={handleChange} required min="0"/>
          </div>

          <textarea name="condicion" placeholder="Condición médica y de salud" value={formData.condicion} onChange={handleChange} required/>
          <textarea name="descripcion" placeholder="Describe su personalidad y características" value={formData.descripcion} onChange={handleChange} required/>

          <div className="form-group">
            <label htmlFor="foto">Foto del animalito</label>
            <input id="foto" type="file" name="foto" accept="image/*" onChange={handleChange} />
          </div>

          <div className="form-group-checkbox" style={{ marginBottom: '0.5rem' }}>
            <label htmlFor="disponibilidad">Disponible para adopción</label>
            <input id="disponibilidad" type="checkbox" name="disponibilidad" checked={formData.disponibilidad} onChange={handleChange} />
          </div>

          {/* Card de estado de adopción debajo del checkbox */}
          {showAdopcionCard && (
            <div style={{
              background: '#FFF8F0',
              border: '2px solid #E28F54',
              borderRadius: '14px',
              padding: '1.5rem',
              margin: '1.2rem 0 1.5rem 0',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(226,143,84,0.13)',
              zIndex: 10,
              position: 'relative',
              maxWidth: '100%',
              width: '100%',
              fontSize: '1.08rem',
            }}>
              <h3 style={{ color: '#E28F54', marginBottom: '1rem', fontSize: '1.25rem' }}>¿La mascota fue adoptada?</h3>
              <p style={{ color: '#7C6C5F', marginBottom: '1.2rem' }}>
                Selecciona el estado final de la adopción para este animalito.
              </p>
              {adopcionSuccess && <div style={{ color: 'green', marginBottom: '1rem', fontWeight: 600 }}>{adopcionSuccess}</div>}
              {adopcionError && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 600 }}>{adopcionError}</div>}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  style={{ background: '#A8D5BA', color: '#4B3A2D', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer', minWidth: '120px' }}
                  disabled={adopcionLoading}
                  onClick={() => handleActualizarEstadoAdopcion('adoptado')}
                >
                  Adoptado
                </button>
                <button
                  style={{ background: '#F4E2D8', color: '#4B3A2D', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer', minWidth: '120px' }}
                  disabled={adopcionLoading}
                  onClick={() => handleActualizarEstadoAdopcion('no adoptado')}
                >
                  No adoptado
                </button>
                <button
                  style={{ background: '#e0e0e0', color: '#7C6C5F', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer', minWidth: '120px' }}
                  disabled={adopcionLoading}
                  onClick={() => setShowAdopcionCard(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="submit">Guardar</button>
            <button type="button" className="cancel" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnimalFormCard; 