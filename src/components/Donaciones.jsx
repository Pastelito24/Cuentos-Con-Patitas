import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoSinTexto from '../assets/img/logosintexto.png';
import './Donaciones.css';
import perritoDonacion from '../assets/img/perrodonacion.png';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `http://localhost:5000/${url}`;
};

const Donaciones = () => {
  const navigate = useNavigate();
  const [fundaciones, setFundaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFundacion, setSelectedFundacion] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (fundacionId) => {
    setImageErrors(prev => ({ ...prev, [fundacionId]: true }));
  };
  
  const handleLogout = () => {
    // Lógica de logout
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const fetchFundaciones = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/fundaciones');
        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de fundaciones.');
        }
        const data = await response.json();
        setFundaciones(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFundaciones();
  }, []);

  return (
    <div className="donaciones-container">
      {/* Header/Navbar */}
      <header className="donaciones-header">
        <div className="header-content-donaciones">
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
          <nav className="nav-menu-donaciones">
            <a className="nav-link-animada" href="#">¿Quienes Somos?</a>
            <Link to="/fundaciones" className="nav-link-animada">Fundaciones</Link>
            <Link to="/donaciones" className="nav-link-animada active">¿Quieres Ayudar?</Link>
            <a className="nav-link-animada" href="#">Soporte</a>
            <div className="user-dropdown-container">
              <Link to="/micuenta" className="nav-link-animada">Mi cuenta</Link>
              <div className="logout-dropdown">
                <button onClick={handleLogout}>Cerrar sesión</button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="donaciones-main">
        <div className="donacion-card">
          <div className="donacion-form-container">
            <h1>Ayuda a una Fundación</h1>
            <p className="subtitle">Tu generosidad cambia vidas. Cada donación, sin importar su tamaño, hace una gran diferencia.</p>
            
            <form className="donacion-form">
              <div className="form-group">
                <label>Elige una fundación *</label>
                {loading ? (
                  <p>Cargando fundaciones...</p>
                ) : error ? (
                  <p className="error-text">{error}</p>
                ) : (
                  <div className="fundacion-gallery">
                    {fundaciones.map(fund => (
                      <div
                        key={fund.fundacion_id}
                        className={`fundacion-item ${selectedFundacion === fund.fundacion_id ? 'selected' : ''}`}
                        onClick={() => setSelectedFundacion(fund.fundacion_id)}
                      >
                        {imageErrors[fund.fundacion_id] || !fund.foto_url ? (
                          <div className="image-placeholder-donaciones">
                            <i className="fas fa-home"></i>
                          </div>
                        ) : (
                          <img
                            src={getImageUrl(fund.foto_url)}
                            alt={fund.nombre}
                            onError={() => handleImageError(fund.fundacion_id)}
                          />
                        )}
                        <span>{fund.nombre}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Tipo de Donación *</label>
                <div className="radio-group">
                  <label><input type="radio" name="tipo_donacion" value="Monetario" defaultChecked /> Monetaria</label>
                  <label><input type="radio" name="tipo_donacion" value="Alimentos" /> Alimentos</label>
                  <label><input type="radio" name="tipo_donacion" value="Medicina" /> Medicina</label>
                  <label><input type="radio" name="tipo_donacion" value="Otros" /> Otros</label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción</label>
                <textarea id="descripcion" name="descripcion" rows="4" placeholder="Ej: 5kg de concentrado para cachorros, medicinas para pulgas, etc."></textarea>
              </div>

              <button type="submit" className="btn-donar">Donar Ahora</button>
            </form>
          </div>
          <div className="donacion-image-container">
            <img src={perritoDonacion} alt="Perro feliz con donaciones" />
            <p className="image-slogan">¡Tu ayuda deja huella!</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Donaciones; 