import React from 'react';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-ears">
        <div className="ear left-ear"></div>
        <div className="ear right-ear"></div>
      </div>
      <div className="navbar-content">
        <div className="logo">Patitas</div>
        <ul className="nav-links">
          <li>Inicio</li>
          <li>Historias</li>
          <li>Mi cuenta</li>
          <li>Contacto</li>
        </ul>
        <div className="search-box">
          <input type="text" placeholder="Buscar" />
          <span className="icon">🔍</span>
        </div>
      </div>
    </nav>
  );
} 