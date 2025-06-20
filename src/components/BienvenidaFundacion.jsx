import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoSinTexto from '../assets/img/logosintexto.png';
import pastorConGato from '../assets/img/pastor_con_gato.png';
import corgiCulon from '../assets/img/corgiculon.png';

const COLORS = {
  fondo: '#FFF8F0',
  secundario: '#F4E2D8',
  acento: '#E28F54',
  contraste: '#A8D5BA',
  contrasteOscuro: '#7C6C5F',
  texto: '#4B3A2D',
  textoSec: '#7C6C5F',
};

const socialLinks = [
  { href: '#', icon: 'fa-brands fa-whatsapp' },
  { href: '#', icon: 'fa-brands fa-facebook' },
  { href: '#', icon: 'fa-brands fa-x-twitter' },
  { href: '#', icon: 'fa-brands fa-instagram' },
];

const getFundacionFromLocalStorage = () => {
  try {
    const fundacionRaw = localStorage.getItem('fundacion');
    if (!fundacionRaw) return null;
    let fundacion = fundacionRaw;
    if (typeof fundacionRaw === 'string' && (fundacionRaw.startsWith('{') || fundacionRaw.startsWith('"'))){
      fundacion = JSON.parse(fundacionRaw);
    }
    return fundacion;
  } catch {
    return null;
  }
};

const BienvenidaFundacion = () => {
  const [fundacion, setFundacion] = useState(null);
  const [showBubble, setShowBubble] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fund = getFundacionFromLocalStorage();
    setFundacion(fund);
    // Aquí podrías hacer fetch a los animales de la fundación si tienes endpoint
    // Por ahora, ejemplo vacío:
    // fetch(`/api/animales?fundacion_nit=${fund?.nit}`)
    //   .then(res => res.json())
    //   .then(data => setAnimales(data));
  }, []);

  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => setShowBubble(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [showBubble]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.fondo,
      color: COLORS.texto,
      fontFamily: '"Edu NSW ACT Hand Pre", cursive',
      padding: 0,
    }}>
      {/* Header/Nav */}
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
            <a className="nav-link-animada" href="#" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Eventos</a>
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
      {/* Main Section */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
        gap: 60,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 7vw',
        position: 'relative',
      }}>
        {/* Imagen grande con doble difuminado */}
        <div style={{
          position: 'relative',
          width: 370,
          height: 370,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: -300,
        }}>
          {/* Difuminado exterior azul clarito pastel */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 560,
            height: 560,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #A7C7E7 0%, transparent 80%)',
            zIndex: 1,
            filter: 'blur(14px)'
          }} />
          {/* Difuminado azul clarito pastel muy notorio */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 500,
            height: 500,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #B3D8F7 0%, #A7C7E7 60%, transparent 85%)',
            zIndex: 2,
            filter: 'blur(22px)'
          }} />
          <img src={pastorConGato} alt="Perro y gato" style={{ width: 370, height: 370, objectFit: 'contain', borderRadius: '50%', position: 'relative', zIndex: 3 }} />
        </div>
        {/* Contenido principal */}
        <div style={{ maxWidth: 600, marginLeft: 300 }}>
          <h1 style={{ fontSize: '3.2rem', fontWeight: 'bold', margin: 0, lineHeight: 1.1, color: COLORS.acento }}>
            ¡Bienvenida, {fundacion?.nombre || 'Fundación'}!
          </h1>
          <h3 style={{ fontSize: '1.7rem', fontWeight: 600, margin: '18px 0 10px 0', color: COLORS.texto, display: 'flex', alignItems: 'center', gap: 10 }}>
            Este es tu panel principal de gestión
            <span style={{ fontSize: '2.2rem', color: COLORS.acento, marginLeft: 2 }}>
              <i className="fa-solid fa-paw"></i>
            </span>
          </h3>
          <div style={{ color: COLORS.textoSec, fontSize: '1.18rem', marginBottom: 18, whiteSpace: 'pre-line', lineHeight: 1.6 }}>
            <p><b>NIT:</b> {fundacion?.nit}</p>
            <p><b>Dirección:</b> {fundacion?.direccion}</p>
            <p><b>Teléfono:</b> {fundacion?.telefono}</p>
            <p><b>Email:</b> {fundacion?.email}</p>
            <p><b>Persona a cargo:</b> {fundacion?.persona_acargo}</p>
          </div>
          <div style={{ display: 'flex', gap: 18, marginBottom: 24 }}>
            {socialLinks.map((s, i) => (
              <a key={i} href={s.href} style={{ color: COLORS.acento, fontSize: 28, transition: 'color 0.2s' }} target="_blank" rel="noopener noreferrer">
                <i className={s.icon + (s.icon.includes('whatsapp') ? ' icon-whatsapp-ajustado' : '')}></i>
              </a>
            ))}
          </div>
          <a href="#" style={{
            display: 'inline-block',
            background: COLORS.fondo,
            color: COLORS.acento,
            border: `2px solid ${COLORS.acento}`,
            borderRadius: 30,
            padding: '12px 38px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            textDecoration: 'none',
            letterSpacing: '1px',
            transition: 'all 0.2s',
            boxShadow: `0 2px 8px ${COLORS.secundario}55`,
          }}>Contactar soporte</a>
        </div>
      </section>
      {/* Imagen de corgiculón en la esquina inferior derecha */}
      <div style={{ position: 'fixed', right: 24, bottom: 18, zIndex: 51 }}>
        {showBubble && (
          <div style={{
            position: 'absolute',
            bottom: 170,
            right: 10,
            background: '#fff',
            color: '#E28F54',
            borderRadius: 18,
            padding: '12px 22px',
            boxShadow: '0 4px 18px #E28F5444',
            fontWeight: 'bold',
            fontSize: '1.08rem',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            animation: 'bubbleIn 0.25s',
          }}>
            ¡Hola fundación!
            <span style={{
              position: 'absolute',
              left: '88%',
              bottom: -16,
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '16px solid #fff',
              filter: 'drop-shadow(0 2px 4px #E28F5444)'
            }}></span>
          </div>
        )}
        <img
          src={corgiCulon}
          alt="Corgi culón"
          style={{
            width: 120,
            cursor: 'pointer',
            opacity: 0.97,
            zIndex: 50,
          }}
          onClick={() => setShowBubble(true)}
        />
      </div>
      {/* Tipografía para iconos FontAwesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
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
        .fundacion-dropdown-container:hover .logout-dropdown,
        .logout-dropdown:hover {
          display: block !important;
        }
        .logout-dropdown button:hover {
          background: #FFF8F0;
        }
        .icon-whatsapp-ajustado {
          transform: scale(1.18);
          display: inline-block;
        }
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
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

export default BienvenidaFundacion; 