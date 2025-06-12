import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import backgroundImage from '../assets/img/fondoperrogato.jpg';  
import Loading from './Loading';
import '../App.css';
import huella from '../assets/img/huella-login-registro.png';

function Login({ onSwitchToRegister, onFormSubmit }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isPasswordToggleHovered, setIsPasswordToggleHovered] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [showFields, setShowFields] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Validar contraseña
  const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(password)) {
  setIsLoading(false);
  setError('La contraseña debe tener al menos 8 caracteres y contener una letra mayúscula.');
  return;
}

    setIsLoading(true);
    
    try {
      console.log('Intentando login con:', { email, password });
      
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      console.log('Respuesta del servidor:', response.status);
      const data = await response.json();
      console.log('Datos recibidos:', data);

      if (response.ok) {
        console.log('Login exitoso:', data);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Simula el tiempo de carga del loader
        setTimeout(() => {
          setIsLoading(false);
          navigate('/index1');
        }, 2000);
      } else {
        setError(data.message || 'Error al iniciar sesión');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
      setError('Error al conectar con el servidor');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setShowFields(false);
    const timeout = setTimeout(() => setShowFields(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

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
      width: '100%',
      height: '100%',
      padding: '0'
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
      top: 'calc(50% - 18px)',
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

  return (
    <div className="form-wrapper sign-in">
      {/* Logo, título y texto motivacional */}
      <div className={`stagger-logo${showFields ? ' stagger-in' : ''}${!showFields ? ' stagger-hide' : ''}`} style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '140px', height: '140px', backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <img src={logo} alt="Logo" style={{ width: '120px', height: '120px', objectFit: 'contain', display: 'block' }} />
        </div>
        <h2 style={{ color: '#B87C4C', fontWeight: 'bold', fontSize: '2.2rem', margin: 0, fontFamily: "'Baloo 2', Arial, sans-serif", letterSpacing: '1px', textShadow: '1px 1px 0 #fff, 0 2px 8px rgba(0,0,0,0.1)' }}>Cuentos Con Patitas</h2>
        <p style={{ color: '#14b8a6', fontWeight: 'bold', margin: '8px 0 18px 0', fontSize: '1.1rem', textShadow: '1px 1px 0 #fff, 0 2px 8px rgba(0,0,0,0.06)' }}>
          "Cada huellita tiene una historia... ¡Crea la tuya!"
        </p>
      </div>
      {/* Campos y links */}
      <div className={`stagger-fields${showFields ? ' stagger-in' : ''}${!showFields ? ' stagger-hide' : ''}`}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={{
              color: '#ef4444',
              backgroundColor: '#fee2e2',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          {/* Email input */}
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Número de Identificación"
              value={email}
              onChange={(e) => {
                // Solo permite números
                const value = e.target.value.replace(/[^0-9]/g, '');
                setEmail(value);
              }}
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
            onMouseEnter={() => setIsLoginHovered(true)}
            onMouseLeave={() => setIsLoginHovered(false)}
            style={{
              ...styles.loginButton,
              ...(isLoginHovered ? styles.loginButtonHover : {})
            }}
            className="loginButton"
          >
            Iniciar sesión
            <span className="paw-icon">
              <img src={huella} alt="huella" style={{ width: '28px', height: '28px', marginLeft: '8px', verticalAlign: 'middle' }} />
            </span>
          </button>
        </form>
        {/* Links y decorativos */}
        <div style={styles.links}>
          <span
            onClick={onSwitchToRegister}
            style={styles.link}
          >
            ¿No tienes cuenta? Regístrate aquí
          </span>
        </div>
        <div style={styles.decorativeElement1}></div>
        <div style={styles.decorativeElement2}></div>
        <div style={styles.decorativeElement3}></div>
      </div>
    </div>
  );
}

export default Login;

export function LoginContent(props) {
  // Copio todo el contenido del return de Login aquí, menos el Loading
  const {
    styles,
    error,
    isLoginHovered,
    isPasswordToggleHovered,
    hoveredLink,
    showPassword,
    setShowPassword,
    setIsPasswordToggleHovered,
    setIsLoginHovered,
    onSwitchToRegister,
    handleSubmit,
    email,
    setEmail,
    password,
    setPassword
  } = props;

  const [showFields, setShowFields] = useState(false);

  useEffect(() => {
    setShowFields(false);
    const timeout = setTimeout(() => setShowFields(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="form-wrapper sign-in">
      {/* Logo, título y texto motivacional */}
      <div className={`stagger-logo${showFields ? ' stagger-in' : ''}${!showFields ? ' stagger-hide' : ''}`} style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '140px', height: '140px', backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <img src={logo} alt="Logo" style={{ width: '120px', height: '120px', objectFit: 'contain', display: 'block' }} />
        </div>
        <h2 style={{ color: '#B87C4C', fontWeight: 'bold', fontSize: '2.2rem', margin: 0, fontFamily: "'Baloo 2', Arial, sans-serif", letterSpacing: '1px', textShadow: '1px 1px 0 #fff, 0 2px 8px rgba(0,0,0,0.1)' }}>Cuentos Con Patitas</h2>
        <p style={{ color: '#14b8a6', fontWeight: 'bold', margin: '8px 0 18px 0', fontSize: '1.1rem', textShadow: '1px 1px 0 #fff, 0 2px 8px rgba(0,0,0,0.06)' }}>
          "Cada huellita tiene una historia... ¡Crea la tuya!"
        </p>
      </div>
      {/* Campos y links */}
      <div className={`stagger-fields${showFields ? ' stagger-in' : ''}${!showFields ? ' stagger-hide' : ''}`}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={{
              color: '#ef4444',
              backgroundColor: '#fee2e2',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          {/* Email input */}
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Número de Identificación"
              value={email}
              onChange={(e) => {
                // Solo permite números
                const value = e.target.value.replace(/[^0-9]/g, '');
                setEmail(value);
              }}
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
            onMouseEnter={() => setIsLoginHovered(true)}
            onMouseLeave={() => setIsLoginHovered(false)}
            style={{
              ...styles.loginButton,
              ...(isLoginHovered ? styles.loginButtonHover : {})
            }}
            className="loginButton"
          >
            Iniciar sesión
            <span className="paw-icon">
              <img src={huella} alt="huella" style={{ width: '28px', height: '28px', marginLeft: '8px', verticalAlign: 'middle' }} />
            </span>
          </button>
        </form>
        {/* Links y decorativos */}
        <div style={styles.links}>
          <span
            onClick={onSwitchToRegister}
            style={styles.link}
          >
            ¿No tienes cuenta? Regístrate aquí
          </span>
        </div>
        <div style={styles.decorativeElement1}></div>
        <div style={styles.decorativeElement2}></div>
        <div style={styles.decorativeElement3}></div>
      </div>
    </div>
  );
}