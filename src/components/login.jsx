import { useState } from 'react';
import logo from '../assets/img/logo.png';
import backgroundImage from '../assets/img/fondoperrogato.jpg';  

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login con:', email, password);
    onLogin?.();
  };

  const styles = {
    container: {
      minHeight: '100vh',
      minWidth: '100vw',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Baloo 2', Arial, sans-serif"
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(255, 255, 255, 0.3) 100%)'
    },
    card: {
      position: 'relative',
      zIndex: 10,
      width: '60vw',
      maxWidth: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.35)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '32px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    logoContainer: {
      width: '180px',
      height: '180px',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 36px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    logo: {
      fontSize: '48px'
    },
    title: {
      fontFamily: "'Baloo 2', Arial, sans-serif",
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#B87C4C',
      marginBottom: '8px',
      letterSpacing: '1px',
      textShadow: `
        1px 1px 0 #fff,
        0 2px 8px rgba(0, 0, 0, 0.1)
      `
    },
    btitle: {
      fontSize: '22px',
      color: '#333',
      textShadow: '0 1px 2px rgba(255,255,255,0.5)'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    inputContainer: {
      position: 'relative'
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '20px',
      height: '20px',
      color: 'rgba(255, 255, 255, 0.7)',
      pointerEvents: 'none'
    },
    input: {
      width: '100%',
      padding: '16px 16px 16px 48px',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      border: '1.5px solid #bdbdbd',
      borderRadius: '16px',
      color: '#222',
      fontSize: '16px',
      outline: 'none',
      backdropFilter: 'blur(4px)',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    inputPassword: {
      paddingRight: '56px'
    },
    inputFocus: {
      borderColor: 'rgba(255, 255, 255, 0.5)',
      boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.25)'
    },
    placeholder: {
      color: 'rgba(255, 255, 255, 0.7)'
    },
    togglePassword: {
      position: 'absolute',
      right: '14px',
      top: 'calc(50% - 18px)', // ✅ Ajuste exacto para centrar visualmente
      background: '#fff',
      border: 'none',
      color: '#06b6d4',
      cursor: 'pointer',
      width: '36px',
      height: '36px',
      padding: '0',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      zIndex: 2,
      outline: 'none'
    },
    togglePasswordHover: {
      background: '#06b6d4',
      color: '#fff'
    },
    loginButton: {
      width: '100%',
      padding: '16px',
      background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
      border: 'none',
      borderRadius: '16px',
      color: 'white',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    loginButtonHover: {
      background: 'linear-gradient(135deg, #0891b2 0%, #0f766e 100%)',
      transform: 'scale(1.02)',
      boxShadow: '0 0 0 4px rgba(6, 182, 212, 0.3)'
    },
    links: {
      marginTop: '32px',
      textAlign: 'center'
    },
    link: {
      display: 'block',
      color: '#0891b2',
      fontSize: '16px',
      textDecoration: 'underline',
      textDecorationColor: '#0891b2',
      margin: '12px 0',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    linkHover: {
      color: '#0f766e',
      textDecorationColor: '#0f766e'
    },
    decorativeElement1: {
      position: 'absolute',
      top: '-24px',
      left: '-24px',
      width: '48px',
      height: '48px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      filter: 'blur(16px)',
      animation: 'pulse 2s infinite'
    },
    decorativeElement2: {
      position: 'absolute',
      bottom: '-32px',
      right: '-32px',
      width: '64px',
      height: '64px',
      backgroundColor: 'rgba(6, 182, 212, 0.3)',
      borderRadius: '50%',
      filter: 'blur(16px)',
      animation: 'pulse 2s infinite 1s'
    },
    decorativeElement3: {
      position: 'absolute',
      top: '50%',
      left: '-48px',
      width: '32px',
      height: '32px',
      backgroundColor: 'rgba(20, 184, 166, 0.4)',
      borderRadius: '50%',
      filter: 'blur(12px)',
      animation: 'bounce 3s infinite 0.5s'
    }
  };

  // Estados para hover effects
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isPasswordToggleHovered, setIsPasswordToggleHovered] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
            40%, 43% { transform: translate3d(0, -15px, 0); }
            70% { transform: translate3d(0, -7px, 0); }
            90% { transform: translate3d(0, -2px, 0); }
          }
          input::placeholder {
            color: #888 !important;
            opacity: 1;
          }
        `}
      </style>
      
      {/* Background */}
      <div style={styles.background}></div>
      <div style={styles.overlay}></div>

      {/* Card principal */}
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <img
              src={logo}
              alt="Logo"
              style={{
                width: '180px',
                height: '180px',
                objectFit: 'contain',
                padding: '0px',
                display: 'block'
              }}
            />
          </div>
          <h1 style={styles.title}>Cuentos con Patitas</h1>
          <h2 style={{
            fontSize: '22px',
            color: '#14b8a6',
            fontWeight: 'bold',
            margin: '8px 0 18px 0',
            textShadow: '1px 1px 0 #fff, 0 2px 8px rgba(0,0,0,0.06)'
          }}>
            “Cada huellita tiene una historia... ¡Crea la tuya!”
          </h2>
        </div>

        {/* Formulario */}
        <div style={styles.form}>
          {/* Email input */}
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {/* Password input */}
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{...styles.input, ...styles.inputPassword}}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              onMouseEnter={() => setIsPasswordToggleHovered(true)}
              onMouseLeave={() => setIsPasswordToggleHovered(false)}
              style={{
                ...styles.togglePassword,
                ...(isPasswordToggleHovered ? styles.togglePasswordHover : {})
              }}
            >
              {showPassword ? (
                <svg width="24" height="24" style={{ display: 'block', margin: 0, padding: 0 }} fill="none" viewBox="0 0 24 24" stroke="#06b6d4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg width="24" height="24" style={{ display: 'block', margin: 0, padding: 0 }} fill="none" viewBox="0 0 24 24" stroke="#06b6d4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12s4-7 9-7 9 7 9 7-4 7-9 7-9-7-9-7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.5 9.5l5 5m0-5l-5 5" />
                </svg>
              )}
            </button>
          </div>

          {/* Login button */}
          <button
            type="submit"
            onClick={handleSubmit}
            onMouseEnter={() => setIsLoginHovered(true)}
            onMouseLeave={() => setIsLoginHovered(false)}
            style={{
              ...styles.loginButton,
              ...(isLoginHovered ? styles.loginButtonHover : {})
            }}
          >
            Iniciar sesión
          </button>
        </div>

        {/* Links */}
        <div style={styles.links}>
          <a
            href="#"
            onMouseEnter={() => setHoveredLink('forgot')}
            onMouseLeave={() => setHoveredLink(null)}
            style={{
              ...styles.link,
              ...(hoveredLink === 'forgot' ? styles.linkHover : {})
            }}
          >
            ¿Olvidaste tu contraseña?
          </a>
          <a
            href="#"
            onMouseEnter={() => setHoveredLink('register')}
            onMouseLeave={() => setHoveredLink(null)}
            style={{
              ...styles.link,
              ...(hoveredLink === 'register' ? styles.linkHover : {})
            }}
          >
            ¿No tienes cuenta? Regístrate aquí
          </a>
        </div>

        {/* Elementos decorativos */}
        <div style={styles.decorativeElement1}></div>
        <div style={styles.decorativeElement2}></div>
        <div style={styles.decorativeElement3}></div>
      </div>
    </div>
  );
}

export default Login;