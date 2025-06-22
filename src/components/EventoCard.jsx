import React, { useState } from 'react';
import { FaEdit, FaTrash, FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import EditarEventoModal from './EditarEventoModal';
import ConfirmacionModal from './ConfirmacionModal';
import './EventoCard.css';

const EventoCard = ({ evento, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventPassed = () => {
    return new Date(evento.fecha_hora) < new Date();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/eventos/${evento.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        onDelete(evento.id);
      } else {
        console.error('Error al eliminar el evento:', data.error);
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error de red al eliminar el evento:', error);
      alert('Error de conexión al intentar eliminar el evento.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const EventImagePlaceholder = () => (
    <div className="event-image-placeholder">
      <i className="fas fa-calendar-alt"></i>
      <span>Sin imagen</span>
    </div>
  );

  return (
    <>
      <div className={`event-card ${isEventPassed() ? 'event-passed' : ''}`}>
        <div className="event-status-indicator">
          {isEventPassed() ? (
            <span className="status-passed">Finalizado</span>
          ) : (
            <span className="status-active">Activo</span>
          )}
        </div>

        <div className="event-image-container">
          {!imageError && evento.imagen_url ? (
            <img
              src={evento.imagen_url}
              alt={evento.titulo}
              className="event-image"
              onError={handleImageError}
            />
          ) : (
            <EventImagePlaceholder />
          )}
        </div>

        <div className="event-content">
          <h3 className="event-title">{evento.titulo}</h3>
          
          <div className="event-details">
            <div className="event-detail">
              <FaCalendarAlt className="detail-icon" />
              <span>{formatDate(evento.fecha_hora)}</span>
            </div>
            
            <div className="event-detail">
              <FaClock className="detail-icon" />
              <span>{formatTime(evento.fecha_hora)}</span>
            </div>
            
            <div className="event-detail">
              <FaMapMarkerAlt className="detail-icon" />
              <span>{evento.lugar}</span>
            </div>
          </div>

          <p className="event-description">
            {evento.descripcion.length > 120 
              ? `${evento.descripcion.substring(0, 120)}...` 
              : evento.descripcion
            }
          </p>

          <div className="event-actions">
            <button 
              onClick={() => setShowEditModal(true)}
              className="btn-edit-event"
              disabled={isEventPassed()}
            >
              <FaEdit /> Editar
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="btn-delete-event"
            >
              <FaTrash /> Eliminar
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditarEventoModal
          evento={evento}
          onClose={() => setShowEditModal(false)}
          onSave={onUpdate}
        />
      )}

      {showDeleteModal && (
        <ConfirmacionModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="¿Eliminar evento?"
          message={`¿Estás seguro de que quieres eliminar el evento "${evento.titulo}"? Esta acción no se puede deshacer.`}
        />
      )}
    </>
  );
};

export default EventoCard; 