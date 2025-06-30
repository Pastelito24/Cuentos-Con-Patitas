import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import backgroundImage from '../assets/img/fondoperrogato.jpg';  
import Loading from './Loading';
import '../App.css';
import huella from '../assets/img/huella-login-registro.png';
import { motion, AnimatePresence } from "framer-motion";

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
  const [tipoLogin, setTipoLogin] = useState('usuario'); // 'usuario' o 'fundacion'

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
      console.log('Intentando login con:', { email, password, rol: tipoLogin });
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...(tipoLogin === 'usuario' ? { cedula: email } : { nit: email }),
          password,
          rol: tipoLogin
        })
      });
      const data = await response.json();
      console.log('Respuesta del servidor:', response.status);
      console.log('Datos recibidos:', data);
      if (response.ok) {
        if (tipoLogin === 'usuario') {
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.user && data.user.usuario_id) {
            localStorage.setItem('usuario_id', data.user.usuario_id);
          } else if (data.user && data.user.cedula) {
            localStorage.setItem('usuario_id', data.user.cedula);
          }
        } else if (tipoLogin === 'fundacion' && data.fundacion) {
          localStorage.setItem('fundacion', JSON.stringify(data.fundacion));
        }
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
      width: '100%',
      minWidth: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Edu NSW ACT Hand Pre", cursive'
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
      fontFamily: '"Edu NSW ACT Hand Pre", cursive',
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
      textShadow: '0 1px 2px rgba(255,255,255,0.5)',
      fontFamily: '"Edu NSW ACT Hand Pre", cursive',
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
      boxSizing: 'border-box',
      fontFamily: '"Edu NSW ACT Hand Pre", cursive',
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
    <div className="form-wrapper sign-in" style={{
      width: '100%',
      maxWidth: '420px',
      background: 'rgba(255,255,255,0.55)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      padding: '20px 12px',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1.5px solid rgba(255,255,255,0.25)',
      margin: '32px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: 0,
      transition: 'height 0.5s cubic-bezier(0.4,0,0.2,1), min-height 0.5s cubic-bezier(0.4,0,0.2,1), max-height 0.5s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
      zIndex: 3
    }}>
      <AnimatePresence>
        {showFields && (
          <motion.div
            key="login-card-outer"
            layout
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
              overflow: 'hidden',
              minHeight: '100vh',
            }}
          >
            <motion.div
              key="login-card"
              layout
              initial={{ y: 200, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 60, damping: 16 }}
              style={{
                originY: 0.5,
                width: '100%',
                maxWidth: '420px',
                minHeight: '560px',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(255,255,255,0.25)'
              }}
            >
              {/* Logo, título y texto motivacional */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '140px', height: '140px', backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  <img src={logo} alt="Logo" style={{ width: '120px', height: '120px', objectFit: 'contain', display: 'block' }} />
                </div>
                <div style={{ ...styles.title, fontFamily: '"Edu NSW ACT Hand Pre", cursive' }}>Cuentos Con Patitas</div>
                <div style={{ ...styles.btitle, fontFamily: '"Edu NSW ACT Hand Pre", cursive' }}>
                  "Cada huellita tiene una historia... ¡Crea la tuya!"
                </div>
              </div>
              {/* Selector de tipo de login */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={() => setTipoLogin('usuario')}
                  className="rol-btn-login"
                  style={{
                    background: tipoLogin === 'usuario' ? '#06b6d4' : '#eee',
                    color: tipoLogin === 'usuario' ? '#fff' : '#333',
                    border: 'none',
                    outline: 'none',
                    borderRadius: '16px 0 0 16px',
                    padding: '10px 24px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.3s, color 0.3s, box-shadow 0.3s, filter 0.3s, transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                    transform: tipoLogin === 'usuario' ? 'scale(1.15) translateY(-4px)' : 'scale(1)',
                    boxShadow: tipoLogin === 'usuario' ? '0 6px 24px 0 rgba(6,182,212,0.25)' : 'none',
                    filter: tipoLogin === 'usuario' ? 'blur(0.5px)' : 'none',
                    zIndex: tipoLogin === 'usuario' ? 2 : 1
                  }}
                >
                  Usuario
                </button>
                <button
                  type="button"
                  onClick={() => setTipoLogin('fundacion')}
                  className="rol-btn-login"
                  style={{
                    background: tipoLogin === 'fundacion' ? '#06b6d4' : '#eee',
                    color: tipoLogin === 'fundacion' ? '#fff' : '#333',
                    border: 'none',
                    outline: 'none',
                    borderRadius: '0 16px 16px 0',
                    padding: '10px 24px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.3s, color 0.3s, box-shadow 0.3s, filter 0.3s, transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                    transform: tipoLogin === 'fundacion' ? 'scale(1.15) translateY(-4px)' : 'scale(1)',
                    boxShadow: tipoLogin === 'fundacion' ? '0 6px 24px 0 rgba(6,182,212,0.25)' : 'none',
                    filter: tipoLogin === 'fundacion' ? 'blur(0.5px)' : 'none',
                    zIndex: tipoLogin === 'fundacion' ? 2 : 1
                  }}
                >
                  Fundación
                </button>
                <style>{`
                  .rol-btn-login:hover {
                    background: #0891b2 !important;
                    color: #fff !important;
                    box-shadow: 0 8px 24px 0 #06b6d499;
                    transform: scale(1.08) translateY(-2px);
                  }
                `}</style>
              </div>
              {/* Campos y links */}
              <div>
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
                      placeholder={tipoLogin === 'usuario' ? 'Número de Identificación' : 'NIT'}
                      value={email}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9]/g, '');
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
                  {/* Link para cambiar a registro debajo del botón */}
                  <div style={{ textAlign: 'center', marginTop: 18 }}>
                    <span
                      onClick={onSwitchToRegister}
                      style={{
                        color: '#0891b2',
                        fontSize: '16px',
                        textDecoration: 'underline',
                        textDecorationColor: '#0891b2',
                        margin: '12px 0',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        padding: '4px 0',
                        borderRadius: '8px'
                      }}
                      className="login-link-anim"
                    >
                      ¿No tienes cuenta? Regístrate aquí
                    </span>
                    <style>{`
                      .login-link-anim:hover {
                        color: #0f766e !important;
                        text-decoration-color: #0f766e !important;
                        background: #e0f7fa;
                        transform: scale(1.06);
                        transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
                      }
                    `}</style>
                  </div>
                </form>
                <div style={styles.decorativeElement1}></div>
                <div style={styles.decorativeElement2}></div>
                <div style={styles.decorativeElement3}></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .rol-selector-btn {
          transition: background 0.3s, color 0.3s, transform 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .rol-selector-btn.active {
          transform: scale(1.08);
        }
      `}</style>
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
    <div className="form-wrapper sign-in" style={{
      width: '100%',
      maxWidth: '420px',
      background: 'rgba(255,255,255,0.55)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      padding: '20px 12px',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1.5px solid rgba(255,255,255,0.25)',
      margin: '32px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: 0,
      transition: 'height 0.5s cubic-bezier(0.4,0,0.2,1), min-height 0.5s cubic-bezier(0.4,0,0.2,1), max-height 0.5s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
      zIndex: 3
    }}>
      <AnimatePresence>
        {showFields && (
          <motion.div
            key="login-card-outer"
            layout
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '24px',
              overflow: 'hidden',
              minHeight: '100vh',
            }}
          >
            <motion.div
              key="login-card"
              layout
              initial={{ y: 200, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 60, damping: 16 }}
              style={{
                originY: 0.5,
                width: '100%',
                maxWidth: '420px',
                minHeight: '560px',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                background: 'rgba(255,255,255,0.55)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(255,255,255,0.25)'
              }}
            >
              {/* Logo, título y texto motivacional */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{ width: '140px', height: '140px', backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  <img src={logo} alt="Logo" style={{ width: '120px', height: '120px', objectFit: 'contain', display: 'block' }} />
                </div>
                <div style={{ ...styles.title, fontFamily: '"Edu NSW ACT Hand Pre", cursive' }}>Cuentos Con Patitas</div>
                <div style={{ ...styles.btitle, fontFamily: '"Edu NSW ACT Hand Pre", cursive' }}>
                  "Cada huellita tiene una historia... ¡Crea la tuya!"
                </div>
              </div>
              {/* Selector de tipo de login */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={() => setTipoLogin('usuario')}
                  className="rol-btn-login"
                  style={{
                    background: tipoLogin === 'usuario' ? '#06b6d4' : '#eee',
                    color: tipoLogin === 'usuario' ? '#fff' : '#333',
                    border: 'none',
                    outline: 'none',
                    borderRadius: '16px 0 0 16px',
                    padding: '10px 24px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.3s, color 0.3s, box-shadow 0.3s, filter 0.3s, transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                    transform: tipoLogin === 'usuario' ? 'scale(1.15) translateY(-4px)' : 'scale(1)',
                    boxShadow: tipoLogin === 'usuario' ? '0 6px 24px 0 rgba(6,182,212,0.25)' : 'none',
                    filter: tipoLogin === 'usuario' ? 'blur(0.5px)' : 'none',
                    zIndex: tipoLogin === 'usuario' ? 2 : 1
                  }}
                >
                  Usuario
                </button>
                <button
                  type="button"
                  onClick={() => setTipoLogin('fundacion')}
                  className="rol-btn-login"
                  style={{
                    background: tipoLogin === 'fundacion' ? '#06b6d4' : '#eee',
                    color: tipoLogin === 'fundacion' ? '#fff' : '#333',
                    border: 'none',
                    outline: 'none',
                    borderRadius: '0 16px 16px 0',
                    padding: '10px 24px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.3s, color 0.3s, box-shadow 0.3s, filter 0.3s, transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                    transform: tipoLogin === 'fundacion' ? 'scale(1.15) translateY(-4px)' : 'scale(1)',
                    boxShadow: tipoLogin === 'fundacion' ? '0 6px 24px 0 rgba(6,182,212,0.25)' : 'none',
                    filter: tipoLogin === 'fundacion' ? 'blur(0.5px)' : 'none',
                    zIndex: tipoLogin === 'fundacion' ? 2 : 1
                  }}
                >
                  Fundación
                </button>
                <style>{`
                  .rol-btn-login:hover {
                    background: #0891b2 !important;
                    color: #fff !important;
                    box-shadow: 0 8px 24px 0 #06b6d499;
                    transform: scale(1.08) translateY(-2px);
                  }
                `}</style>
              </div>
              {/* Campos y links */}
              <div>
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
                      placeholder={tipoLogin === 'usuario' ? 'Número de Identificación' : 'NIT'}
                      value={email}
                      onChange={(e) => {
                        let value = e.target.value.replace(/[^0-9]/g, '');
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
                  {/* Link para cambiar a registro debajo del botón */}
                  <div style={{ textAlign: 'center', marginTop: 18 }}>
                    <span
                      onClick={onSwitchToRegister}
                      style={{
                        color: '#0891b2',
                        fontSize: '16px',
                        textDecoration: 'underline',
                        textDecorationColor: '#0891b2',
                        margin: '12px 0',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        padding: '4px 0',
                        borderRadius: '8px'
                      }}
                      className="login-link-anim"
                    >
                      ¿No tienes cuenta? Regístrate aquí
                    </span>
                    <style>{`
                      .login-link-anim:hover {
                        color: #0f766e !important;
                        text-decoration-color: #0f766e !important;
                        background: #e0f7fa;
                        transform: scale(1.06);
                        transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
                      }
                    `}</style>
                  </div>
                </form>
                <div style={styles.decorativeElement1}></div>
                <div style={styles.decorativeElement2}></div>
                <div style={styles.decorativeElement3}></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .rol-selector-btn {
          transition: background 0.3s, color 0.3s, transform 0.25s cubic-bezier(0.4,0,0.2,1);
        }
        .rol-selector-btn.active {
          transform: scale(1.08);
        }
      `}</style>
    </div>
  );
}