import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoSinTexto from '../assets/img/logosintexto.png';

const COLORS = {
  fondo: '#FFF8F0', // Marfil suave
  secundario: '#F4E2D8', // Beige claro
  acento: '#E28F54', // Naranja zanahoria
  contraste: '#A8D5BA', // Verde agua pastel
  contrasteOscuro: '#7C6C5F', // Marrón claro/beige oscuro
  texto: '#4B3A2D', // Marrón oscuro cálido
  textoSec: '#7C6C5F', // Marrón claro/beige oscuro
};

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
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
          <Link className="nav-link-animada" to="/fundaciones" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Fundaciones</Link>
          <a className="nav-link-animada" href="#" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>¿Quieres Ayudar?</a>
          <a className="nav-link-animada" href="#" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Soporte</a>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <Link className="nav-link-animada" to="/micuenta" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem', cursor: 'pointer' }}>
              Mi cuenta
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
          {/* Barra de búsqueda estética */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {/* Orejas de gato */}
            <div style={{
              position: 'absolute',
              left: 18,
              top: -18,
              width: 18,
              height: 18,
              background: '#4B3A2D',
              borderRadius: '60% 60% 0 0',
              border: '2px solid #4B3A2D',
              transform: 'rotate(-18deg)',
              zIndex: 2,
            }} />
            <div style={{
              position: 'absolute',
              right: 18,
              top: -18,
              width: 18,
              height: 18,
              background: '#4B3A2D',
              borderRadius: '60% 60% 0 0',
              border: '2px solid #4B3A2D',
              transform: 'rotate(18deg)',
              zIndex: 2,
            }} />
            <form style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fff',
              borderRadius: 30,
              padding: '2px 22px',
              boxShadow: '0 4px 18px 0 #A7C7E733',
              border: 'none',
              minWidth: 220,
              maxWidth: 340,
              height: 36,
              transition: 'box-shadow 0.2s',
              position: 'relative',
              zIndex: 1,
            }} onSubmit={e => e.preventDefault()}>
              <input
                type="text"
                placeholder="Buscar"
                style={{
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '1.13rem',
                  color: '#4B3A2D',
                  width: 120,
                  fontFamily: 'inherit',
                  padding: '2px 0',
                  letterSpacing: '0.5px',
                  fontWeight: 500,
                }}
              />
              <style>{`input::placeholder { color: #7BA7D9; opacity: 1; font-size: 1.13rem; font-weight: 500; }`}</style>
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A7C7E7', fontSize: 22, marginLeft: 8, display: 'flex', alignItems: 'center', padding: 0 }}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
        </nav>
      </div>
      {/* Estilos animados para el navbar */}
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
    </header>
  );
};

export default Navbar; 