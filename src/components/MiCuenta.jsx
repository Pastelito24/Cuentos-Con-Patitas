import React, { useState, useEffect } from 'react';
import Card from './Card';
import EditarUsuarioCard from './EditarUsuarioCard';
import ConfirmacionModal from './ConfirmacionModal';
import gatitoLloron from '../assets/img/Gatito_Lloron.png';
import gatitodonacion from '../assets/img/gatitodonacion.png';
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

const HistorialModal = ({ isOpen, onClose, historial }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-historial-bg">
      <div className="modal-historial-cute">
        <button className="close-historial-btn" onClick={onClose}>&times;</button>
        <h2 className="historial-title">🐾 Historial de Donaciones</h2>
        {historial.length === 0 ? (
          <div className="historial-vacio">
            <img src={gatitodonacion} alt="Sin donaciones" style={{ width: 120, margin: '0 auto', display: 'block' }} />
            <p style={{ color: '#E28F54', fontWeight: 'bold', fontSize: '1.2rem', marginTop: 16 }}>¡Aún no has realizado donaciones!<br/>Cuando dones, tus patitas aparecerán aquí 🐾</p>
          </div>
        ) : (
          <div className="historial-lista">
            {historial.map((d, idx) => (
              <div className="historial-card-cute" key={d.id || idx}>
                <div className="historial-card-header">
                  <span className="historial-icon">💖</span>
                  <span className="historial-tipo">{d.tipo}</span>
                  <span className="historial-estado {d.estado_pago === 'pendiente' ? 'pendiente' : 'completado'}">
                    {d.estado_pago === 'pendiente' ? '⏳ Pendiente' : '✔️ Completado'}
                  </span>
                </div>
                <div className="historial-card-body">
                  <div className="historial-monto">{d.monto ? `$${d.monto} ${d.moneda || 'COP'}` : ''}</div>
                  <div className="historial-fecha">{d.fecha ? new Date(d.fecha).toLocaleDateString() : ''}</div>
                  <div className="historial-descripcion">{d.descripcion}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .modal-historial-bg {
          position: fixed; left: 0; top: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.25); z-index: 9999;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-historial-cute {
          background: #FFF8F0;
          border-radius: 24px;
          padding: 56px 28px 28px 28px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
          min-width: 340px; max-width: 95vw; max-height: 80vh; overflow-y: auto;
          position: relative;
          animation: popIn 0.4s;
        }
        .close-historial-btn {
          position: absolute; top: 20px; right: 28px;
          font-size: 2rem; color: #e28f54; cursor: pointer; font-weight: bold;
          background: rgba(255,255,255,0.95); border: none;
          z-index: 10;
          padding: 2px 10px;
          border-radius: 50%;
          box-shadow: 0 2px 8px #E28F5444;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .close-historial-btn:hover {
          background: #fbe2cf;
        }
        .historial-title {
          text-align: center; color: #E28F54; font-size: 2.1rem; font-family: 'Edu NSW ACT Hand Pre', cursive; margin-bottom: 18px; margin-top: 10px;
        }
        .historial-vacio { text-align: center; margin-top: 24px; }
        .historial-lista { display: flex; flex-direction: column; gap: 18px; }
        .historial-card-cute {
          background: #fff; border-radius: 16px; box-shadow: 0 2px 12px #E28F5444;
          padding: 18px 20px; display: flex; flex-direction: column; gap: 6px;
          border: 2px solid #FBE2CF;
          transition: box-shadow 0.2s, border 0.2s;
        }
        .historial-card-cute:hover {
          box-shadow: 0 6px 24px #E28F5444;
          border: 2px solid #E28F54;
        }
        .historial-card-header {
          display: flex; align-items: center; gap: 12px; margin-bottom: 4px;
        }
        .historial-icon { font-size: 1.5rem; }
        .historial-tipo { color: #A7D0F5; font-weight: bold; font-size: 1.1rem; }
        .historial-estado { margin-left: auto; font-size: 1rem; font-weight: bold; }
        .historial-estado.pendiente { color: #E28F54; }
        .historial-estado.completado { color: #4B3A2D; }
        .historial-monto { color: #E28F54; font-size: 1.2rem; font-weight: bold; }
        .historial-fecha { color: #7C6C5F; font-size: 0.98rem; }
        .historial-descripcion { color: #4B3A2D; font-size: 1.05rem; margin-top: 2px; }
        @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

const MiCuenta = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showHistorial, setShowHistorial] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mi_cuenta', { credentials: 'include' });
        const data = await response.json();
        if (data.success) {
          setUsuario(data.usuario);
        } else {
          // Si no hay sesión backend, intenta cargar desde localStorage
          const localUser = {
            nombre: localStorage.getItem('nombre') || '',
            cedula: localStorage.getItem('cedula') || '',
            email: localStorage.getItem('email') || '',
            telefono: localStorage.getItem('telefono') || '',
            direccion: localStorage.getItem('direccion') || '',
            edad: localStorage.getItem('edad') || '',
            usuariofoto_url: localStorage.getItem('usuariofoto_url') || '',
          };
          if (localUser.nombre || localUser.cedula) {
            setUsuario(localUser);
          } else {
            setError(data.error || 'No se pudieron cargar los datos del usuario.');
            if (response.status === 403) navigate('/');
          }
        }
      } catch (err) {
        // Si hay error de conexión, intenta cargar desde localStorage
        const localUser = {
          nombre: localStorage.getItem('nombre') || '',
          cedula: localStorage.getItem('cedula') || '',
          email: localStorage.getItem('email') || '',
          telefono: localStorage.getItem('telefono') || '',
          direccion: localStorage.getItem('direccion') || '',
          edad: localStorage.getItem('edad') || '',
          usuariofoto_url: localStorage.getItem('usuariofoto_url') || '',
        };
        if (localUser.nombre || localUser.cedula) {
          setUsuario(localUser);
        } else {
          setError('Error de conexión.');
          navigate('/');
        }
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

  const handleOpenHistorial = async () => {
    setShowHistorial(true);
    setLoadingHistorial(true);
    try {
      const res = await fetch('http://localhost:5000/api/historial_donaciones', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setHistorial(data.historial);
      } else {
        setHistorial([]);
      }
    } catch {
      setHistorial([]);
    } finally {
      setLoadingHistorial(false);
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
      action: handleOpenHistorial,
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
    return <div style={{ color: '#E28F54', textAlign: 'center', marginTop: '3rem', fontSize: '1.3rem' }}>Error: {error}</div>;
  }

  // Si no hay datos de usuario, mostrar mensaje amigable
  if (!usuario || (!usuario.nombre && !usuario.cedula)) {
    return (
      <div style={{ color: '#E28F54', textAlign: 'center', marginTop: '3rem', fontSize: '1.3rem' }}>
        No se encontraron datos de usuario.<br />
        Por favor inicia sesión nuevamente.
      </div>
    );
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
      {showHistorial && (
        <HistorialModal
          isOpen={showHistorial}
          onClose={() => setShowHistorial(false)}
          historial={historial}
        />
      )}
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