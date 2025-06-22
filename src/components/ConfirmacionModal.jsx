import React from 'react';
import './ConfirmacionModal.css';
import gatitoLloron from '../assets/img/Gatito_Lloron.png';

const ConfirmacionModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-confirm" onClick={onClose}>
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <img src={gatitoLloron} alt="Gatito triste" className="confirm-icon" />
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirm-actions">
          <button onClick={onClose} className="btn-cancel-confirm">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn-confirm-delete">
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionModal; 