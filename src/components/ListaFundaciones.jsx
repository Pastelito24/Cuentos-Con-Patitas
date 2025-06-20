import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './ListaFundaciones.css';

const COLORS = {
  fondo: '#FFF8F0', // Marfil suave
  secundario: '#F4E2D8', // Beige claro
  acento: '#E28F54', // Naranja zanahoria
  contraste: '#A8D5BA', // Verde agua pastel
  contrasteOscuro: '#7C6C5F', // Marrón claro/beige oscuro
  texto: '#4B3A2D', // Marrón oscuro cálido
  textoSec: '#7C6C5F', // Marrón claro/beige oscuro
};

const FundacionCard = ({ fundacion }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [fundacion.foto_url]);

  const defaultImage = (
    <div style={{
      width: '100%',
      height: '200px',
      background: `linear-gradient(45deg, ${COLORS.secundario}, ${COLORS.fondo})`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '16px 16px 0 0',
      position: 'relative',
      overflow: 'hidden',
      filter: isHovered ? 'brightness(1.1) contrast(1.05)' : 'none',
      transition: 'all 0.3s ease'
    }}>
      <i className="fas fa-home" style={{ 
        fontSize: '3rem', 
        color: COLORS.acento,
        marginBottom: '0.5rem',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        transition: 'transform 0.3s ease'
      }}></i>
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1rem',
        background: 'rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: COLORS.textoSec,
        fontSize: '0.9rem'
      }}>
        Imagen no disponible
      </div>
    </div>
  );

  return (
    <Link 
      to={`/fundacion/${fundacion.fundacion_id}`}
      style={{ textDecoration: 'none' }}
    >
      <div 
        style={{
          background: '#fff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: isHovered ? '0 8px 16px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!imageError && fundacion.foto_url ? (
          <div style={{
            width: '100%',
            height: '200px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px 16px 0 0'
          }}>
            <img
              src={fundacion.foto_url}
              alt={fundacion.nombre}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'all 0.3s ease',
                filter: isHovered ? 'brightness(1.1) contrast(1.05)' : 'none',
                transform: isHovered ? 'scale(1.02)' : 'scale(1)'
              }}
              onError={() => setImageError(true)}
            />
          </div>
        ) : defaultImage}

        <div style={{
          padding: '1.5rem',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            color: isHovered ? COLORS.acento : COLORS.texto,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            transition: 'color 0.3s ease'
          }}>{fundacion.nombre}</h3>

          <div style={{
            display: 'grid',
            gap: '0.8rem',
            color: COLORS.textoSec,
            fontSize: '0.95rem',
            flex: 1
          }}>
            {[
              { icon: 'fa-map-marker-alt', text: fundacion.direccion },
              { icon: 'fa-phone', text: fundacion.telefono },
              { icon: 'fa-user', text: fundacion.persona_acargo }
            ].map((item, index) => (
              <p key={index} style={{ 
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                color: isHovered ? COLORS.texto : COLORS.textoSec
              }}>
                <i className={`fas ${item.icon}`} style={{ 
                  color: COLORS.acento,
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.3s ease'
                }}></i>
                {item.text}
              </p>
            ))}
          </div>

          {fundacion.descripcion && (
            <p style={{
              margin: '1rem 0 0 0',
              color: isHovered ? COLORS.texto : COLORS.textoSec,
              fontSize: '0.9rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.5',
              transition: 'color 0.3s ease'
            }}>{fundacion.descripcion}</p>
          )}

          <div style={{
            marginTop: '1.5rem',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button style={{
              background: isHovered ? '#f9a826' : COLORS.acento,
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: isHovered ? '0 4px 8px rgba(249, 168, 38, 0.3)' : 'none'
            }}>
              Ver más <i className={`fas fa-arrow-right`} style={{ 
                marginLeft: '4px',
                transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
                transition: 'transform 0.3s ease'
              }}></i>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ListaFundaciones = () => {
  const [fundaciones, setFundaciones] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFundaciones = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/fundaciones');
        if (!response.ok) {
          throw new Error('Error al cargar las fundaciones');
        }
        const data = await response.json();
        setFundaciones(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFundaciones();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!fundaciones || fundaciones.length === 0) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: COLORS.textoSec,
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <i className="fas fa-home" style={{ fontSize: '3rem', color: COLORS.acento, marginBottom: '1rem' }}></i>
        <h2 style={{ color: COLORS.texto, marginBottom: '0.5rem' }}>No hay fundaciones registradas</h2>
        <p>¡Sé el primero en registrar tu fundación!</p>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: COLORS.fondo,
      fontFamily: '"Edu NSW ACT Hand Pre", cursive'
    }}>
      <Navbar />
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px'
      }}>
        {fundaciones.map((fundacion) => (
          <FundacionCard key={fundacion.fundacion_id} fundacion={fundacion} />
        ))}
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    </div>
  );
};

export default ListaFundaciones; 