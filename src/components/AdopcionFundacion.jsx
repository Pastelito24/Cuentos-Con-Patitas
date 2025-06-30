import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoSinTexto from '../assets/img/logosintexto.png';
import './AdopcionFundacion.css';

const AdopcionFundacion = () => {
  const navigate = useNavigate();
  const [adopciones, setAdopciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/adopciones_fundacion', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) setAdopciones(data.adopciones);
        setLoading(false);
      });
  }, []);

  return (
    <div className="adopcion-fundacion-container">
      <header className="eventos-header">
        <div className="header-content">
          <div
            className="logo-titulo-navbar"
            onClick={() => navigate('/index1')}
          >
            <img src={logoSinTexto} alt="Logo Cuentos Con Patitas" />
            <div className="titulo-container">
              <span className="titulo-navbar-superior">Cuentos Con</span>
              <span className="titulo-navbar-inferior">Patitas</span>
            </div>
          </div>
          <nav className="nav-menu">
            <Link to="/eventos" className="nav-link-animada">Eventos</Link>
            <Link to="/adopcionfundacion" className="nav-link-animada">Adopciones</Link>
            <a className="nav-link-animada" href="#">Soporte</a>
            <div className="fundacion-dropdown-container">
              <Link className="nav-link-animada" to="/mifundacion">Mi fundación</Link>
              <div className="logout-dropdown">
                <button onClick={handleLogout}>Cerrar sesión</button>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <main className="adopcion-fundacion-main">
        <h2>Registros de Adopciones</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="adopciones-cards-container">
            {adopciones.map(adop => (
              <div className="adopcion-card" key={adop.adopcion_id}>
                <div className="adopcion-card-img-container">
                  {adop.fotoanimal_url && (
                    <img
                      className="adopcion-card-img"
                      src={adop.fotoanimal_url}
                      alt={adop.animal_nombre}
                    />
                  )}
                </div>
                <div className="adopcion-card-info">
                  <h3 className="adopcion-card-animal">{adop.animal_nombre}</h3>
                  <div className="adopcion-card-row-group">
                    <div className="adopcion-card-row">
                      <span className="adopcion-card-label">Adoptante:</span>
                      <span>{adop.nombre_adoptante}</span>
                      <span className="adopcion-card-label" style={{marginLeft: '2rem'}}>Cédula:</span>
                      <span>{adop.cedula_adoptante}</span>
                    </div>
                    <div className="adopcion-card-row">
                      <span className="adopcion-card-label">Fecha:</span>
                      <span>{adop.fecha_adopcion}</span>
                      <span className="adopcion-card-label" style={{marginLeft: '2rem'}}>Estado:</span>
                      <span>{adop.estado_adopcion}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdopcionFundacion;