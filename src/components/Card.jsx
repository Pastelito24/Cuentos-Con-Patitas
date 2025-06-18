import React from 'react';
import './Card.css';

const Card = ({ title, icon, onClick }) => {
  return (
    <div className="custom-card" onClick={onClick}>
      <div className="custom-card-title">{title}</div>
      <div className="custom-card-icon">{icon}</div>
    </div>
  );
};

export default Card; 