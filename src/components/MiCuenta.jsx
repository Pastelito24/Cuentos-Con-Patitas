import React from 'react';
import Card from './Card';
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

const cards = [
  {
    title: 'Editar Datos',
    icon: <FaUserEdit size={56} color={iconColor} />,
  },
  {
    title: 'Historial',
    icon: <HistorialIcon />,
  },
  {
    title: 'Eliminar Cuenta',
    icon: <img src={gatitoLloron} alt="Gatito llorón" style={{ width: 70, height: 70, objectFit: 'contain' }} />,
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

const MiCuenta = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F0', fontFamily: '"Edu NSW ACT Hand Pre", cursive', padding: 0 }}>
      {/* Navbar reutilizado */}
      {/* Puedes importar y usar <Navbar /> si ya tienes el componente, aquí lo dejo comentado: */}
      {/* <Navbar /> */}
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
          {/* Logo y texto apilado */}
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
            <a className="nav-link-animada" href="#" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Fundaciones</a>
            <a className="nav-link-animada" href="#" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>¿Quieres Ayudar?</a>
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
          <Card key={idx} title={card.title} icon={card.icon} />
        ))}
      </div>
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
      `}</style>
    </div>
  );
};

export default MiCuenta; 