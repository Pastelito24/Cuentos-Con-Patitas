import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import corgiAbrazo from '../assets/img/corgiabrazo.png';
import corgiCulon from '../assets/img/corgiculon.png';

const socialLinks = [
  { href: '#', icon: 'fa-brands fa-whatsapp' },
  { href: '#', icon: 'fa-brands fa-facebook' },
  { href: '#', icon: 'fa-brands fa-x-twitter' },
  { href: '#', icon: 'fa-brands fa-instagram' },
];

// Colores sugeridos
const COLORS = {
  fondo: '#FFF8F0', // Marfil suave
  secundario: '#F4E2D8', // Beige claro
  acento: '#E28F54', // Naranja zanahoria
  contraste: '#A8D5BA', // Verde agua pastel
  contrasteOscuro: '#7C6C5F', // Marrón claro/beige oscuro (más oscuro para difuminado extra)
  texto: '#4B3A2D', // Marrón oscuro cálido
  textoSec: '#7C6C5F', // Marrón claro/beige oscuro
};

const getUserFromLocalStorage = () => {
  try {
    const userRaw = localStorage.getItem('user');
    if (!userRaw) return null;
    let user = userRaw;
    if (typeof userRaw === 'string' && (userRaw.startsWith('{') || userRaw.startsWith('"'))){
      user = JSON.parse(userRaw);
    }
    return user;
  } catch {
    return null;
  }
};

const fetchNombreUsuario = async (user) => {
  // Si ya tiene nombre, retornarlo
  if (user && (user.nombre || user.name)) return user.nombre || user.name;
  // Buscar por email o documento
  let query = '';
  if (user && user.email) query = `?email=${encodeURIComponent(user.email)}`;
  else if (user && user.documentNumber) query = `?documentNumber=${encodeURIComponent(user.documentNumber)}`;
  if (!query) return 'Patitas';
  try {
    const res = await fetch(`http://localhost:5000/api/usuario${query}`);
    const data = await res.json();
    if (data && data.nombre) return data.nombre;
    if (data && data.name) return data.name;
    return 'Patitas';
  } catch {
    return 'Patitas';
  }
};

const Bienvenida = () => {
  const [nombre, setNombre] = useState('Patitas');
  const [showBubble, setShowBubble] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUserFromLocalStorage();
    fetchNombreUsuario(user).then(setNombre);
  }, []);

  // Ocultar la burbuja automáticamente después de 2.5 segundos
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
        background: 'transparent',
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
          padding: '12px 4vw 0 4vw', // Menos padding vertical
        }}>
          <a href="#" style={{
            color: '#A7C7E7',
            fontWeight: 'bold',
            fontSize: '2.5rem',
            letterSpacing: '2px',
            textDecoration: 'none',
            whiteSpace: 'pre-line',
            fontFamily: '"Edu NSW ACT Hand Pre", cursive',
            transition: 'color 0.3s',
          }}>Cuentos Con Patitas</a>
          <nav style={{ display: 'flex', gap: 28, alignItems: 'center', position: 'relative' }}>
            <a className="nav-link-animada" href="#" style={{ color: COLORS.texto, textDecoration: 'none', fontWeight: 'bold', fontSize: '1.05rem' }}>¿Quienes Somos?</a>
            <a className="nav-link-animada" href="#" style={{ color: COLORS.texto, textDecoration: 'none', fontWeight: 'bold', fontSize: '1.05rem' }}>Fundaciones</a>
            <a className="nav-link-animada" href="#" style={{ color: COLORS.texto, textDecoration: 'none', fontWeight: 'bold', fontSize: '1.05rem' }}>¿Quieres Ayudar?</a>
            <a className="nav-link-animada" href="#" style={{ color: COLORS.texto, textDecoration: 'none', fontWeight: 'bold', fontSize: '1.05rem' }}>Soporte</a>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Link className="nav-link-animada" to="/micuenta" style={{ color: COLORS.texto, textDecoration: 'none', fontWeight: 'bold', fontSize: '1.05rem', cursor: 'pointer' }}>
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
                background: '#A7C7E7',
                borderRadius: '60% 60% 0 0',
                border: '2px solid #7BA7D9',
                transform: 'rotate(-18deg)',
                zIndex: 2,
              }} />
              <div style={{
                position: 'absolute',
                right: 18,
                top: -18,
                width: 18,
                height: 18,
                background: '#A7C7E7',
                borderRadius: '60% 60% 0 0',
                border: '2px solid #7BA7D9',
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
                    color: COLORS.texto,
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
      }}>
        {/* Imagen grande con doble difuminado */}
        <div style={{
          position: 'relative',
          width: 360,
          height: 360,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 0,
        }}>
          {/* Difuminado exterior azul clarito pastel */}
          <div style={{
            position: 'absolute',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #A7C7E7 0%, transparent 80%)',
            zIndex: 1,
            filter: 'blur(10px)'
          }} />
          {/* Difuminado azul clarito pastel muy notorio */}
          <div style={{
            position: 'absolute',
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #B3D8F7 0%, #A7C7E7 60%, transparent 85%)',
            zIndex: 2,
            filter: 'blur(18px)'
          }} />
          <img src={corgiAbrazo} alt="Corgi abrazo" style={{ width: 270, height: 270, objectFit: 'contain', borderRadius: '50%', position: 'relative', zIndex: 3 }} />
        </div>
        {/* Contenido principal */}
        <div style={{ maxWidth: 500, marginLeft: 40 }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 'bold', margin: 0, lineHeight: 1.1, color: COLORS.acento }}>
            Hola <span style={{ color: COLORS.acento }}>{nombre}</span>
          </h1>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 600, margin: '18px 0 10px 0', color: COLORS.texto, display: 'flex', alignItems: 'center', gap: 10 }}>
            Comienza a escribir esta historia con una huellita
            <span style={{ fontSize: '2rem', color: COLORS.acento, marginLeft: 2 }}>
              <i className="fa-solid fa-paw"></i>
            </span>
          </h3>
          <p style={{ color: COLORS.textoSec, fontSize: '1.13rem', marginBottom: 28, whiteSpace: 'pre-line', lineHeight: 1.6 }}>
            {`Bienvenido a Cuentos con Patitas,
un lugar donde cada adopción es el comienzo de una historia única.
Aquí, cada perrito y gatito encuentra no solo un hogar, sino un corazón que los acompaña en su nuevo capítulo de vida.
Este es tu espacio para contar, compartir y ser parte de relatos llenos de amor, esperanza y segundas oportunidades.
Explora, conecta y ayúdanos a escribir finales felices... una patita a la vez.`}
          </p>
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
          }}>Contáctame</a>
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
            Ey, donde estas tocando
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
        .nav-link-animada:hover + .logout-dropdown,
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
      `}</style>
    </div>
  );
};

export default Bienvenida; 