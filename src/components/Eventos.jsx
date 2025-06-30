import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import EventoCard from './EventoCard';
import CrearEventoModal from './CrearEventoModal';
import logoSinTexto from '../assets/img/logosintexto.png';
import { FaPlus, FaSignOutAlt, FaCalendarAlt, FaCalendarTimes } from 'react-icons/fa';
import './Eventos.css';

const Eventos = () => {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/eventos', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setEventos(data.eventos);
      } else {
        setError(data.error || 'Error al cargar los eventos');
        if (response.status === 403) navigate('/');
      }
    } catch (err) {
      setError('Error de conexión');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleCrearEvento = (nuevoEvento) => {
    setEventos(prev => [nuevoEvento, ...prev]);
    setShowCrearModal(false);
    showSuccessMessage('¡Evento creado con éxito!');
  };

  const handleActualizarEvento = (eventoActualizado) => {
    setEventos(prev => prev.map(evento => 
      evento.id === eventoActualizado.id ? eventoActualizado : evento
    ));
    showSuccessMessage('¡Evento actualizado con éxito!');
  };

  const handleEliminarEvento = (eventoId) => {
    setEventos(prev => prev.filter(evento => evento.id !== eventoId));
    showSuccessMessage('¡Evento eliminado con éxito!');
  };

  if (loading) {
    return (
      <div className="eventos-container">
        <div className="loading-state">Cargando eventos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="eventos-container">
        <div className="error-state">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="eventos-container">
      {successMessage && (
        <div className="success-toast">
          <i className="fas fa-check-circle"></i> {successMessage}
        </div>
      )}
      
      <header style={{
        width: '100vw',
        background: '#A7D0F5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0',
        margin: '0',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000
      }}>
        <div style={{
          width: '100%',
          maxWidth: 1600,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 4vw 0 4vw',
        }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 24, marginLeft: -150, cursor: 'pointer' }}
            onClick={() => navigate('/index1')}
            className="logo-titulo-navbar"
          >
            <img src={logoSinTexto} alt="Logo Cuentos Con Patitas" style={{ width: 130, height: 130, objectFit: 'contain', marginRight: 12 }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
              <span className="titulo-navbar-superior" style={{ color: '#4B3A2D', fontWeight: 'bold', fontSize: '2.3rem', letterSpacing: '2px', fontFamily: '"Edu NSW ACT Hand Pre", cursive' }}>Cuentos Con</span>
              <span className="titulo-navbar-inferior" style={{ color: '#4B3A2D', fontWeight: 'bold', fontSize: '2.7rem', letterSpacing: '2px', fontFamily: '"Edu NSW ACT Hand Pre", cursive', marginTop: 4 }}>Patitas</span>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: 36, alignItems: 'center', position: 'relative' }}>
            <Link to="/eventos" className="nav-link-animada" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Eventos</Link>
            <Link to="/AdopcionFundacion" className="nav-link-animada" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Adopciones</Link>
            <a className="nav-link-animada" href="#" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Soporte</a>
            <div className="fundacion-dropdown-container" style={{ position: 'relative', display: 'inline-block' }}>
              <Link className="nav-link-animada" to="/mifundacion" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem', cursor: 'pointer' }}>
                Mi fundación
              </Link>
              <div className="logout-dropdown" style={{
                display: 'none',
                position: 'absolute',
                top: '110%',
                right: 0,
                background: '#fff',
                borderRadius: 10,
                boxShadow: '0 4px 16px #0001',
                padding: '8px 0',
                minWidth: 140,
                zIndex: 100,
                textAlign: 'center',
              }}>
                <button onClick={handleLogout} style={{
                  background: 'none',
                  border: 'none',
                  color: '#E28F54',
                  fontWeight: 'bold',
                  fontSize: '1.08rem',
                  padding: '10px 0',
                  width: '100%',
                  cursor: 'pointer',
                  borderRadius: 8,
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#FFF8F0'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}
                >Cerrar sesión</button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="eventos-main-content">
        <div className="eventos-header-section" style={{ paddingTop: '150px' }}>
          <h1>
            <FaCalendarAlt style={{ marginRight: '1rem', verticalAlign: 'middle' }} />
            Eventos de la Fundación
          </h1>
          <p>Gestiona los eventos especiales para conectar con la comunidad</p>
          {eventos.length > 0 && (
            <button 
              onClick={() => setShowCrearModal(true)} 
              className="btn-crear-evento"
            >
              <FaPlus /> Crear Nuevo Evento
            </button>
          )}
        </div>

        <div className="eventos-grid">
          {eventos.length === 0 ? (
            <div className="no-eventos">
              <div className="no-eventos-icon">
                <FaCalendarTimes />
              </div>
              <h3>No hay eventos programados</h3>
              <p>¡Crea tu primer evento para conectar con la comunidad!</p>
              <button 
                onClick={() => setShowCrearModal(true)} 
                className="btn-crear-primer-evento"
              >
                <FaPlus /> Crear mi primer evento
              </button>
            </div>
          ) : (
            eventos.map(evento => (
              <EventoCard
                key={evento.id}
                evento={evento}
                onUpdate={handleActualizarEvento}
                onDelete={handleEliminarEvento}
              />
            ))
          )}
        </div>
      </main>

      {showCrearModal && (
        <CrearEventoModal
          onClose={() => setShowCrearModal(false)}
          onSave={handleCrearEvento}
        />
      )}
      <style>{`
        .nav-link-animada {
          position: relative;
          transition: color 0.2s, filter 0.2s;
        }
        .nav-link-animada::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -3px;
          height: 3px;
          border-radius: 2px;
          background: linear-gradient(90deg, #A7C7E7 0%, #E28F54 100%);
          opacity: 0;
          transform: scaleX(0.7);
          transition: opacity 0.2s, transform 0.2s;
        }
        .nav-link-animada:hover {
          color: #E28F54;
          filter: drop-shadow(0 2px 8px #E28F5444);
        }
        .nav-link-animada:hover::after {
          opacity: 1;
          transform: scaleX(1);
        }
        .logout-dropdown {
          display: none;
        }
        .fundacion-dropdown-container:hover .logout-dropdown {
          display: block !important;
        }
        .logout-dropdown button:hover {
          background: #FFF8F0;
        }
        .logo-titulo-navbar span {
          position: relative;
          transition: color 0.2s;
        }
        .logo-titulo-navbar:hover .titulo-navbar-superior,
        .logo-titulo-navbar:hover .titulo-navbar-inferior {
          color: #E28F54;
        }
        .logo-titulo-navbar .titulo-navbar-superior::after,
        .logo-titulo-navbar .titulo-navbar-inferior::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -6px;
          height: 5px;
          border-radius: 3px;
          background: linear-gradient(90deg, #E28F54 0%, #A7D0F5 100%);
          opacity: 0;
          transform: scaleX(0.7);
          transition: opacity 0.3s, transform 0.3s;
        }
        .logo-titulo-navbar:hover .titulo-navbar-superior::after,
        .logo-titulo-navbar:hover .titulo-navbar-inferior::after {
          opacity: 1;
          transform: scaleX(1);
        }
      `}</style>
    </div>
  );
};

export default Eventos; 