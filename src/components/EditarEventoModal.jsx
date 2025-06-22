import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaImage } from 'react-icons/fa';
import './CrearEventoModal.css';

const EditarEventoModal = ({ evento, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    fecha_hora: '',
    lugar: '',
    descripcion: '',
    imagen: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);

  useEffect(() => {
    if (evento) {
      // Formatear la fecha para el input datetime-local
      const fecha = new Date(evento.fecha_hora);
      const fechaFormateada = fecha.toISOString().slice(0, 16);
      
      setFormData({
        titulo: evento.titulo || '',
        fecha_hora: fechaFormateada,
        lugar: evento.lugar || '',
        descripcion: evento.descripcion || '',
        imagen: null
      });
      
      if (evento.imagen_url) {
        setOriginalImageUrl(evento.imagen_url);
        setImagePreview(evento.imagen_url);
      }
    }
  }, [evento]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'imagen' && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, imagen: file }));
      
      // Crear preview de la nueva imagen
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }
    
    if (!formData.fecha_hora) {
      newErrors.fecha_hora = 'La fecha y hora son obligatorias';
    }
    
    if (!formData.lugar.trim()) {
      newErrors.lugar = 'El lugar es obligatorio';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('fecha_hora', formData.fecha_hora);
      formDataToSend.append('lugar', formData.lugar);
      formDataToSend.append('descripcion', formData.descripcion);
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }
      
      const response = await fetch(`http://localhost:5000/api/eventos/${evento.id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (data.success) {
        onSave(data.evento);
      } else {
        setErrors({ general: data.error || 'Error al actualizar el evento' });
      }
    } catch (err) {
      setErrors({ general: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, imagen: null }));
    setImagePreview(originalImageUrl);
  };

  const handleImageChange = () => {
    setImagePreview(null);
  };

  return (
    <div className="modal-overlay-evento" onClick={onClose}>
      <div className="modal-evento" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Editar Evento</h2>
          <button onClick={onClose} className="btn-close">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="evento-form">
          <div className="form-group">
            <label htmlFor="titulo">Título del Evento *</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              className={errors.titulo ? 'error' : ''}
              placeholder="Ej: Adopción de mascotas"
            />
            {errors.titulo && <span className="error-message">{errors.titulo}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fecha_hora">Fecha y Hora *</label>
              <div className="input-with-icon">
                <FaCalendarAlt className="input-icon" />
                <input
                  type="datetime-local"
                  id="fecha_hora"
                  name="fecha_hora"
                  value={formData.fecha_hora}
                  onChange={handleChange}
                  className={errors.fecha_hora ? 'error' : ''}
                />
              </div>
              {errors.fecha_hora && <span className="error-message">{errors.fecha_hora}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lugar">Lugar *</label>
              <div className="input-with-icon">
                <FaMapMarkerAlt className="input-icon" />
                <input
                  type="text"
                  id="lugar"
                  name="lugar"
                  value={formData.lugar}
                  onChange={handleChange}
                  className={errors.lugar ? 'error' : ''}
                  placeholder="Ej: Parque Central"
                />
              </div>
              {errors.lugar && <span className="error-message">{errors.lugar}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className={errors.descripcion ? 'error' : ''}
              placeholder="Describe tu evento, qué actividades habrá, cómo participar..."
              rows="4"
            />
            {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="imagen">Imagen del Evento</label>
            <div className="image-upload-container">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button type="button" onClick={handleImageRemove} className="btn-remove-image">
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <div className="image-upload-placeholder">
                  <FaImage className="upload-icon" />
                  <span>Haz clic para cambiar la imagen</span>
                  <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    accept="image/*"
                    onChange={handleChange}
                    className="file-input"
                  />
                </div>
              )}
            </div>
          </div>
          
          {errors.general && (
            <div className="error-message general-error">{errors.general}</div>
          )}
          
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarEventoModal; 