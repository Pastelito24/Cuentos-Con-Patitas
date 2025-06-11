import React from 'react';

const text = "Érase una vez...";

export default function Loading() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#fdecda',
      zIndex: 1000,
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
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
      <div style={{
        position: 'absolute',
        top: '8%',
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <p
          className="loading-text"
          style={{
            color: '#b5936f',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            letterSpacing: '1px',
            display: 'flex',
            gap: '2px',
            margin: 0
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
      </div>
      {/* Loader del gato centrado */}
      <div className="cat">
        {Array.from({ length: 30 }).map((_, i) => (
          <div className="cat__segment" key={i}></div>
        ))}
      </div>
    </div>
  );
} 