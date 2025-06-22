import React, { useState } from 'react';
import './ListaAnimales.css';

const ListaAnimales = ({ animales, onEdit, onAnimalDeleted }) => {
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  if (!animales || animales.length === 0) return <div className="no-animales">No hay animalitos registrados.</div>;
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleImageError = (animalId) => {
    setImageErrors(prev => ({
      ...prev,
      [animalId]: true
    }));
  };

  const handleDelete = async (animalId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este animalito?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/eliminar_animal/${animalId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          onAnimalDeleted(animalId);
        } else {
          setError(data.error || 'Error al eliminar el animalito');
        }
      } catch (error) {
        setError('Error al eliminar el animalito. Por favor, intenta de nuevo.');
      }
    }
  };

  const AnimalImagePlaceholder = ({ animal }) => (
    <div className="animal-image-placeholder">
      <i className="fas fa-paw"></i>
      <span>Foto no disponible</span>
    </div>
  );

  return (
    <div className="lista-animales-grid">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {animales.map((animal, index) => (
        <div 
          key={animal.animal_id} 
          className="card-animalito" 
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="animal-card-header">
            {!imageErrors[animal.animal_id] && animal.fotoanimal_url ? (
              <img 
                src={animal.fotoanimal_url} 
                alt={animal.nombre} 
                className="animal-card-imagen"
                onError={() => handleImageError(animal.animal_id)}
              />
            ) : (
              <AnimalImagePlaceholder animal={animal} />
            )}
            <div className={`disponibilidad-chip ${animal.disponibilidad ? 'disponible' : 'adoptado'}`}>
              {animal.disponibilidad ? 'Disponible' : 'No disponible'}
            </div>
          </div>
          <div className="animal-card-body">
            <div className="animal-card-info-main">
              <h3>{animal.nombre}</h3>
              <p className="animal-raza">{animal.raza}</p>
            </div>
            <div className="animal-card-info-grid">
              <p><strong>Tipo:</strong> {animal.tipo_animal}</p>
              <p><strong>Sexo:</strong> {animal.genero}</p>
              <p><strong>Edad:</strong> {animal.edad} años</p>
              <p><strong>Peso:</strong> {animal.peso} kg</p>
            </div>
            <div className="animal-card-descripcion">
              <p><strong>Condición:</strong> {animal.condicion}</p>
              <p><strong>Ingresó:</strong> {formatDate(animal.fecha_ingreso)}</p>
            </div>
          </div>
          <div className="animal-card-actions">
            <button onClick={() => onEdit(animal)} className="action-btn edit">
              <i className="fas fa-pencil-alt"></i> Editar
            </button>
            <button onClick={() => handleDelete(animal.animal_id)} className="action-btn delete">
              <i className="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListaAnimales; 