import React, { useState, useEffect } from 'react';
import Card from './Card';
import EditarUsuarioCard from './EditarUsuarioCard';
import ConfirmacionModal from './ConfirmacionModal';
import gatitoLloron from '../assets/img/Gatito_Lloron.png';
import { FaUserEdit, FaCommentDots, FaHeart, FaComments } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import logoSinTexto from '../assets/img/logosintexto.png';

const iconColor = '#FFA94D';

const HistorialIcon = () => (
  <div style={{ position: 'relative', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {/* Papeles */}
    <div style={{
      position: 'absolute',
      left: 10,
      top: 8,
      width: 32,
      height: 18,
      background: '#fff',
      border: `2px solid ${iconColor}`,
      borderRadius: 4,
      transform: 'rotate(-8deg)',
      zIndex: 1,
    }}></div>
    <div style={{
      position: 'absolute',
      left: 18,
      top: 16,
      width: 32,
      height: 18,
      background: '#fff',
      border: `2px solid ${iconColor}`,
      borderRadius: 4,
      transform: 'rotate(7deg)',
      zIndex: 2,
    }}></div>
    {/* Carpeta */}
    <div style={{
      position: 'absolute',
      left: 6,
      top: 28,
      width: 48,
      height: 22,
      background: iconColor,
      borderRadius: '0 0 8px 8px',
      zIndex: 3,
      boxShadow: '0 2px 8px #FFA94D33',
    }}></div>
    {/* Lengüeta */}
    <div style={{
      position: 'absolute',
      left: 6,
      top: 22,
      width: 18,
      height: 10,
      background: iconColor,
      borderRadius: '6px 6px 0 0',
      zIndex: 4,
      boxShadow: '0 1px 2px #FFA94D22',
    }}></div>
  </div>
);

const MiCuenta = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mi_cuenta', { credentials: 'include' });
        const data = await response.json();
        if (data.success) {
          setUsuario(data.usuario);
        } else {
          setError(data.error || 'No se pudieron cargar los datos del usuario.');
          if (response.status === 403) navigate('/');
        }
      } catch (err) {
        setError('Error de conexión.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleOpenEditModal = () => {
    if (usuario) {
      setShowEditModal(true);
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setUsuario(updatedUser);
    showSuccessMessage('¡Tus datos se han actualizado con éxito!');
  };

  const handleDeleteRequest = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    setShowDeleteConfirm(false);
    try {
      const response = await fetch('http://localhost:5000/api/eliminar_mi_cuenta', {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        alert('Tu cuenta ha sido eliminada. Te echaremos de menos.');
        handleLogout();
      } else {
        setError(data.error || 'No se pudo eliminar la cuenta.');
      }
    } catch (err) {
      setError('Error de conexión al intentar eliminar la cuenta.');
    }
  };
  
  const cards = [
    {
      title: 'Editar Datos',
      icon: <FaUserEdit size={56} color={iconColor} />,
      action: handleOpenEditModal,
    },
    {
      title: 'Historial',
      icon: <HistorialIcon />,
      action: () => alert('Funcionalidad de Historial en desarrollo.'),
    },
    {
      title: 'Eliminar Cuenta',
      icon: <img src={gatitoLloron} alt="Gatito llorón" style={{ width: 70, height: 70, objectFit: 'contain' }} />,
      action: handleDeleteRequest,
    },
    {
      title: 'Enviar comentarios',
      icon: <FaCommentDots size={56} color={iconColor} />,
    },
    {
      title: 'Ayuda',
      icon: <FaHeart size={56} color={iconColor} />,
    },
    {
      title: 'Tus Redes',
      icon: <FaComments size={56} color={iconColor} />,
    },
  ];

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0', fontFamily: '"Edu NSW ACT Hand Pre", cursive', padding: 0 }}>
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
            <a className="nav-link-animada" href="#" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>¿Quienes Somos?</a>
            <Link to="/fundaciones" className="nav-link-animada" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Fundaciones</Link>
            <Link to="/donaciones" className="nav-link-animada" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>¿Quieres Ayudar?</Link>
            <a className="nav-link-animada" href="#" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Soporte</a>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <a className="nav-link-animada" href="#" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem', cursor: 'pointer' }}>
                Mi cuenta
              </a>
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
      <h1 style={{ textAlign: 'center', fontSize: '3.2rem', margin: '32px 0 36px 0', fontWeight: 700, letterSpacing: 2, color: '#4B3A2D', fontFamily: '"Special Elite", "Edu NSW ACT Hand Pre", cursive' }}>Mi cuenta</h1>
      <div className="card-grid">
        {cards.map((card, idx) => (
          <Card key={idx} title={card.title} icon={card.icon} onClick={card.action} />
        ))}
      </div>
      {showEditModal && usuario && (
        <EditarUsuarioCard 
          usuario={usuario}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateUser}
        />
      )}
      <ConfirmacionModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteUser}
        title="¿Estás seguro?"
        message="Esta acción es permanente y no podrás recuperar tu cuenta. Todos tus datos serán eliminados."
      />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
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
        .nav-link-animada:hover + .logout-dropdown,
        .logout-dropdown:hover {
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
        .success-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(90deg, #86E3CE 0%, #A8D5BA 100%);
          color: #4B3A2D;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          z-index: 2000;
          font-size: 1.1rem;
          font-weight: bold;
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: slideInToast 0.4s forwards, fadeOutToast 0.4s 2.6s forwards;
        }
        
        @keyframes slideInToast {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fadeOutToast {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default MiCuenta; 