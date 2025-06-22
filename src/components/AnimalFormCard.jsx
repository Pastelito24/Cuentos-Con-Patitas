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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="form-card" onClick={(e) => e.stopPropagation()}>
        <h2>{animal.animal_id ? 'Editar Animalito' : 'Agregar Animalito'}</h2>
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

          <div className="form-group-checkbox">
            <label htmlFor="disponibilidad">Disponible para adopción</label>
            <input id="disponibilidad" type="checkbox" name="disponibilidad" checked={formData.disponibilidad} onChange={handleChange} />
          </div>

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