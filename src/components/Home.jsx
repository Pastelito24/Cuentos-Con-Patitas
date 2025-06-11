import React from 'react';
import { useNavigate } from 'react-router-dom';


export default function Home() {
  const navigate = useNavigate();

  const styles = {
    container: {
      fontFamily: "'Baloo 2', Arial, sans-serif",
    },
    header: {
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem',
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    logo: {
      height: '50px',
    },
    enlaces: {
      display: 'flex',
      gap: '2rem',
      alignItems: 'center',
    },
    link: {
      textDecoration: 'none',
      color: '#333',
      fontWeight: 'bold',
      transition: 'color 0.3s ease',
      '&:hover': {
        color: '#B87C4C',
      },
    },
    main: {
      maxWidth: '1200px',
      margin: '2rem auto',
      padding: '0 1rem',
    },
    fundaciones: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem',
    },
    fundacion: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      textAlign: 'center',
    },
    fundacionImg: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginTop: '1rem',
    },
    section: {
      textAlign: 'center',
      padding: '3rem 1rem',
      backgroundColor: '#f8f9fa',
    },
    title: {
      color: '#B87C4C',
      marginBottom: '1rem',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <nav style={styles.nav}>
          <img src="/assets/imagen_logo.png" alt="Logo" style={styles.logo} />
          <div style={styles.enlaces}>
            <a href="#" style={styles.link} onClick={() => navigate('/adopta')}>Adopta</a>
            <a href="#" style={styles.link} onClick={() => navigate('/ayuda')}>¿Quieres Ayudar?</a>
            <a href="#" style={styles.link} onClick={() => navigate('/soporte')}>Soporte</a>
            <a href="#" style={styles.link} onClick={() => navigate('/cuenta')}>Mi cuenta</a>
            <a href="#" style={styles.link}>
              <img src="/assets/lupa_busqueda.jpg" alt="Buscar" style={{ height: '20px', marginRight: '5px' }} />
              ¿Buscas alguna fundación?
            </a>
          </div>
        </nav>
      </header>

      <main style={styles.main}>
        <div style={styles.fundaciones}>
          <div style={styles.fundacion}>
            <h2>Fundación "Rescátame"</h2>
            <p>Bogotá</p>
            <img src="/assets/fundacion_1.png" alt="Fundación 1" style={styles.fundacionImg} />
          </div>
          <div style={styles.fundacion}>
            <h2>Fundación "Peluditos en apuros"</h2>
            <p>Medellín</p>
            <img src="/assets/fundacion_2.png" alt="Fundación 2" style={styles.fundacionImg} />
          </div>
          <div style={styles.fundacion}>
            <h2>Fundación "Dejando Huella"</h2>
            <p>Pereira</p>
            <img src="/assets/fundacion_3.png" alt="Fundación 3" style={styles.fundacionImg} />
          </div>
        </div>
      </main>

      <section style={styles.section}>
        <h1 style={styles.title}>¿Quieres adoptar? ¡Tenemos la mascota ideal para ti!</h1>
        <h1 style={styles.title}>¿Quienes Somos?</h1>
        <p>Una entidad que busca colaborar con las distintas fundaciones<br />de animales para dar mayor visibilidad</p>
      </section>

      <div className="cat" style={{background: 'red', width: 100, height: 100}}>PRUEBA</div>
    </div>
  );
} 