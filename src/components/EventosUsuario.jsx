import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import corgiAbrazo from '../assets/img/corgiabrazo.png';
import corgiCulon from '../assets/img/corgiculon.png';
import logoSinTexto from '../assets/img/logosintexto.png';
import { FiCalendar, FiMapPin, FiHeart } from 'react-icons/fi';
import { MdCelebration } from 'react-icons/md';
import { BsBuilding } from 'react-icons/bs';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

// Paleta pastel de la marca
const COLORS = {
  fondo: '#FFF8F0', // Beige pastel (fondo general)
  secundario: '#F4E2D8', // Beige claro
  acento: '#E28F54', // Naranja pastel
  azulPastel: '#A7D0F5', // Azul pastel (card evento destacado)
  cafePastel: '#7C6C5F', // Café pastel
  amarilloPastel: '#FFE066', // Amarillo pastel
  texto: '#4B3A2D', // Café oscuro cálido
  textoSec: '#7C6C5F', // Café claro
  gradienteEventos: 'linear-gradient(135deg, #A7D0F5 0%, #FFF8F0 100%)', // azul a beige
  gradienteCards: 'linear-gradient(145deg, #FFF8F0 0%, #F4E2D8 100%)',
  pastelTablero: 'rgba(255, 248, 240, 0.98)', // beige pastel con transparencia
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

const EventosUsuario = () => {
  const [eventos, setEventos] = useState([]);
  const [eventoActual, setEventoActual] = useState(0);
  const [showBubble, setShowBubble] = useState(false);
  const [loading, setLoading] = useState(true);
  const slideRef = useRef(null);
  const navigate = useNavigate();

  // Cargar eventos desde la API
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/eventos_inicio');
        const data = await response.json();
        
        if (data.success && data.eventos.length > 0) {
          setEventos(data.eventos);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar eventos:', error);
        setLoading(false);
      }
    };
    cargarEventos();
  }, []);

  // Rotación automática de eventos
  useEffect(() => {
    if (eventos.length > 1) {
      const intervalo = setInterval(() => {
        setEventoActual((prev) => (prev + 1) % eventos.length);
      }, 5000);
      return () => clearInterval(intervalo);
    }
  }, [eventos.length]);

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

  const mostrarEvento = (index) => {
    setTimeout(() => setEventoActual(index), 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha por confirmar';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
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
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
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
            <Link className="nav-link-animada" to="/fundaciones" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Fundaciones</Link>
            <Link className="nav-link-animada" to="/eventos" style={{ color: '#E28F54', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Eventos</Link>
            <Link className="nav-link-animada" to="/donaciones" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>¿Quieres Ayudar?</Link>
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
                  <FiHeart />
                </button>
              </form>
            </div>
          </nav>
        </div>
      </header>

      {/* Sección Hero con Ruleta de Eventos */}
      <section style={{
        background: 'transparent',
        padding: '60px 7vw',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Elementos decorativos de fondo */}
        <div style={{
          position: 'absolute',
          top: -50,
          left: -50,
          width: 200,
          height: 200,
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          bottom: -30,
          right: -30,
          width: 150,
          height: 150,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
        }} />
        
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 20,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontFamily: '"Edu NSW ACT Hand Pre", cursive',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}>
            <MdCelebration style={{ fontSize: '2.2rem', color: '#FFD700' }} />
            Eventos Destacados
            <MdCelebration style={{ fontSize: '2.2rem', color: '#FFD700' }} />
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 40,
            fontFamily: '"Edu NSW ACT Hand Pre", cursive',
          }}>
            Descubre los eventos más emocionantes de nuestras fundaciones
          </p>
          
          {loading ? (
            <div style={{
              background: COLORS.pastelTablero,
              borderRadius: 30,
              padding: 60,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 300,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 60,
                  height: 60,
                  border: '4px solid #E28F54',
                  borderTop: '4px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 20px',
                }} />
                <p style={{ fontSize: '1.2rem', color: '#4B3A2D', margin: 0 }}>Cargando eventos...</p>
              </div>
            </div>
          ) : eventos.length > 0 ? (
            <div style={{
              position: 'relative',
              minHeight: 340,
              maxWidth: 820,
              margin: '0 auto 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <TransitionGroup component={null}>
                <CSSTransition
                  key={eventoActual}
                  timeout={600}
                  classNames="fade"
                  nodeRef={slideRef}
                >
                  <div ref={slideRef} style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: COLORS.azulPastel,
                    borderRadius: 32,
                    padding: 36,
                    boxShadow: '0 8px 32px 0 rgba(0,0,0,0.13)',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 36,
                    transition: 'background 0.3s',
                    overflow: 'visible',
                  }}>
                    {/* Imagen del evento */}
                    <div style={{
                      flex: '0 0 260px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <img
                        src={eventos[eventoActual]?.evento_imagen || corgiAbrazo}
                        alt={eventos[eventoActual]?.nombreEvento}
                        style={{
                          width: 260,
                          height: 180,
                          objectFit: 'cover',
                          borderRadius: 22,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                          background: '#fff',
                        }}
                        onError={e => { e.target.src = corgiAbrazo; }}
                      />
                      <div style={{
                        position: 'absolute',
                        top: 18,
                        left: 18,
                        background: '#E28F54',
                        color: 'white',
                        padding: '7px 18px',
                        borderRadius: 16,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                      }}>
                        ¡Destacado!
                      </div>
                    </div>
                    {/* Contenido del evento */}
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: 10,
                    }}>
                      <h2 style={{
                        fontSize: '2.1rem',
                        color: COLORS.texto,
                        marginBottom: 6,
                        fontWeight: 'bold',
                        fontFamily: '"Edu NSW ACT Hand Pre", cursive',
                        lineHeight: 1.1,
                      }}>
                        {eventos[eventoActual]?.nombreEvento}
                      </h2>
                      <div style={{
                        color: '#7b7bfa',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        marginBottom: 2,
                      }}>
                        <a href="#" style={{ color: '#7b7bfa', textDecoration: 'none' }}>{eventos[eventoActual]?.nombre_fundacion}</a>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: COLORS.cafePastel,
                        fontSize: '1rem',
                        marginBottom: 2,
                      }}>
                        <FiCalendar style={{ fontSize: '1.1rem' }} />
                        <span>{formatDate(eventos[eventoActual]?.fecha_hora)}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        color: COLORS.acento,
                        fontSize: '1rem',
                        marginBottom: 2,
                      }}>
                        <FiMapPin style={{ fontSize: '1.1rem' }} />
                        <span>{eventos[eventoActual]?.nombrelugar}</span>
                      </div>
                      <p style={{
                        fontSize: '1rem',
                        color: COLORS.textoSec,
                        lineHeight: 1.5,
                        marginBottom: 10,
                        fontFamily: '"Edu NSW ACT Hand Pre", cursive',
                      }}>
                        {eventos[eventoActual]?.Descripcion}
                      </p>
                      <button style={{
                        background: COLORS.acento,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 20,
                        padding: '12px 32px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 8,
                        opacity: 0.95,
                      }}>
                        <FiHeart style={{ marginRight: 4 }} />
                        Participar
                      </button>
                    </div>
                  </div>
                </CSSTransition>
              </TransitionGroup>
            </div>
          ) : (
            <div style={{
              background: COLORS.pastelTablero,
              borderRadius: 25,
              padding: 60,
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '4rem', marginBottom: 20 }}>🐾</div>
              <h3 style={{ fontSize: '1.5rem', color: '#4B3A2D', marginBottom: 10 }}>No hay eventos disponibles</h3>
              <p style={{ fontSize: '1.1rem', color: '#666' }}>Pronto tendremos eventos emocionantes para ti</p>
            </div>
          )}
          {/* Indicadores */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 12,
            marginTop: 20,
          }}>
            {eventos.map((_, index) => (
              <button
                key={index}
                onClick={() => mostrarEvento(index)}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  border: 'none',
                  background: index === eventoActual ? COLORS.acento : COLORS.secundario,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: index === eventoActual ? '0 2px 8px rgba(0,0,0,0.18)' : 'none',
                  outline: index === eventoActual ? '2px solid #fff' : 'none',
                }}
                aria-label={`Ir al evento ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Eventos Fijos */}
      {eventos.length > 0 && (
        <section style={{
          padding: '80px 7vw',
          background: COLORS.fondo,
        }}>
          <div style={{
            maxWidth: 1200,
            margin: '0 auto',
          }}>
            <h2 style={{
              fontSize: '2.8rem',
              fontWeight: 'bold',
              color: COLORS.texto,
              textAlign: 'center',
              marginBottom: 20,
              fontFamily: '"Edu NSW ACT Hand Pre", cursive',
            }}>
              📅 Todos Nuestros Eventos
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: COLORS.textoSec,
              textAlign: 'center',
              marginBottom: 50,
              fontFamily: '"Edu NSW ACT Hand Pre", cursive',
            }}>
              Explora todos los eventos disponibles y encuentra el perfecto para ti
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: 30,
              marginTop: 40,
            }}>
              {eventos.map((evento, index) => (
                <div key={index} style={{
                  background: COLORS.gradienteCards,
                  borderRadius: 20,
                  padding: 25,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}>
                  {/* Imagen del evento */}
                  <div style={{
                    position: 'relative',
                    marginBottom: 20,
                  }}>
                    <img 
                      src={evento.evento_imagen || corgiAbrazo} 
                      alt={evento.nombreEvento} 
                      style={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 15,
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                      }}
                      onError={(e) => {
                        e.target.src = corgiAbrazo;
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: 'rgba(231, 76, 60, 0.9)',
                      color: 'white',
                      padding: '5px 12px',
                      borderRadius: 15,
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                    }}>
                      Evento
                    </div>
                  </div>
                  
                  {/* Contenido del evento */}
                  <h3 style={{
                    fontSize: '1.4rem',
                    color: COLORS.texto,
                    marginBottom: 12,
                    fontWeight: 'bold',
                    fontFamily: '"Edu NSW ACT Hand Pre", cursive',
                    lineHeight: 1.3,
                  }}>
                    {evento.nombreEvento}
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 10,
                    color: '#667eea',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                  }}>
                    <i className="fa-solid fa-building-columns"></i>
                    <span>{evento.nombre_fundacion}</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 10,
                    color: '#666',
                    fontSize: '0.9rem',
                  }}>
                    <i className="fa-solid fa-calendar-days"></i>
                    <span>{formatDate(evento.fecha_hora)}</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 15,
                    color: '#e74c3c',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}>
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{evento.nombrelugar}</span>
                  </div>
                  
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#555',
                    lineHeight: 1.5,
                    marginBottom: 20,
                    fontFamily: '"Edu NSW ACT Hand Pre", cursive',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {evento.Descripcion}
                  </p>
                  
                  <button style={{
                    background: COLORS.acento,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 20,
                    padding: '10px 25px',
                    fontSize: '0.95rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}>
                    <FiHeart style={{ marginRight: 8 }} />
                    Participar en Evento
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
      
      {/* Estilos animados */}
      <style>{`
        .fade-enter {
          opacity: 0;
          z-index: 1;
        }
        .fade-enter-active {
          opacity: 1;
          transition: opacity 600ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .fade-exit {
          opacity: 1;
          z-index: 1;
        }
        .fade-exit-active {
          opacity: 0;
          transition: opacity 600ms cubic-bezier(0.23, 1, 0.32, 1);
        }
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
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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

export default EventosUsuario; 