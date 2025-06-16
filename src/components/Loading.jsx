import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

const text = "Érase una vez...";

function LoaderContent() {
  useEffect(() => {
    const interval = setInterval(() => {
      window.scrollTo(0, 0);
      document.body.scrollLeft = 0;
      document.documentElement.scrollLeft = 0;
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999999,
        backgroundColor: '#fdecda', // fondo crema sólido
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        pointerEvents: 'none',
        paddingTop: 0,
      }}
    >
      {/* Texto */}
      <p
        style={{
          fontSize: '2.4rem',
          fontWeight: 'bold',
          color: '#b5936f',
          letterSpacing: '1px',
          display: 'flex',
          gap: '2px',
          textShadow: '2px 2px 8px #fff, 0 2px 8px #fff',
          marginBottom: '200px', // separación clara del gato
        }}
      >
        {text.split('').map((char, index) => (
          <span
            key={index}
            className="jump-letter"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </p>

      {/* Gato loader */}
      <div className="cat">
        {Array.from({ length: 30 }).map((_, i) => (
          <div className="cat__segment" key={i}></div>
        ))}
      </div>

      {/* Animación en línea */}
      <style>
        {`
          @keyframes jump {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .jump-letter {
            display: inline-block;
            animation: jump 1s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}

export default function Loading() {
  return ReactDOM.createPortal(
    <LoaderContent />,
    document.body
  );
}
