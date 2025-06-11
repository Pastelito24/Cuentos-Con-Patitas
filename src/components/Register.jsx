import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import backgroundImage from '../assets/img/fondoperrogato.jpg';
import Loading from './Loading';
import '../App.css';

function Register({ onSwitchToLogin, onFormSubmit }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    documentNumber: '',
    phone: '',
    birthdate: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterHovered, setIsRegisterHovered] = useState(false);
  const [isPasswordToggleHovered, setIsPasswordToggleHovered] = useState(false);
  const [isConfirmPasswordToggleHovered, setIsConfirmPasswordToggleHovered] = useState(false);
  const [showFields, setShowFields] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          documentNumber: formData.documentNumber,
          phone: formData.phone,
          birthdate: formData.birthdate,
          address: formData.address
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => {
          setIsLoading(false);
          navigate('/index1');
        }, 2000);
      } else {
        setError(data.message || 'Error al registrar usuario');
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
    registerButton: {
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
    registerButtonHover: {
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
    }
  };

  return (
    <div className="form-wrapper sign-up">
      <div className={`stagger-logo${showFields ? ' stagger-in' : ''}${!showFields ? ' stagger-hide' : ''}`} style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '140px', height: '140px', backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <img src={logo} alt="Logo" style={{ width: '120px', height: '120px', objectFit: 'contain', display: 'block' }} />
        </div>
        <h2 style={{ color: '#B87C4C', fontWeight: 'bold', fontSize: '2.2rem', margin: 0, fontFamily: "'Baloo 2', Arial, sans-serif", letterSpacing: '1px', textShadow: '1px 1px 0 #fff, 0 2px 8px rgba(0,0,0,0.1)' }}>Cuentos Con Patitas</h2>
        <p style={{ color: '#14b8a6', fontWeight: 'bold', margin: '8px 0 18px 0', fontSize: '1.1rem', textShadow: '1px 1px 0 #fff, 0 2px 8px rgba(0,0,0,0.06)' }}>
          "Cada huellita tiene una historia... ¡Crea la tuya!"
        </p>
      </div>
      <div className={`stagger-fields${showFields ? ' stagger-in' : ''}${!showFields ? ' stagger-hide' : ''}`}>
        <form onSubmit={onFormSubmit} style={styles.form}>
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
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" />
            </svg>
            <input
              type="text"
              name="documentNumber"
              placeholder="Número de Documento"
              value={formData.documentNumber}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" />
            </svg>
            <input
              type="text"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              name="birthdate"
              placeholder="Fecha de nacimiento"
              value={formData.birthdate}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2h5" />
            </svg>
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              value={formData.address}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
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
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{...styles.input, ...styles.inputPassword}}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              onMouseEnter={() => setIsConfirmPasswordToggleHovered(true)}
              onMouseLeave={() => setIsConfirmPasswordToggleHovered(false)}
              style={{
                ...styles.togglePassword,
                ...(isConfirmPasswordToggleHovered ? styles.togglePasswordHover : {})
              }}
            >
              {showConfirmPassword ? (
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
          <button
            type="submit"
            className="btn-register"
            onMouseEnter={() => setIsRegisterHovered(true)}
            onMouseLeave={() => setIsRegisterHovered(false)}
            style={{
              ...styles.registerButton,
              ...(isRegisterHovered ? styles.registerButtonHover : {})
            }}
          >
            Registrarse
            <span className="paw-icon">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="16" cy="24" rx="7" ry="5" fill="#fff" stroke="#06b6d4" strokeWidth="2"/>
                <ellipse cx="8.5" cy="13.5" rx="2.5" ry="4.5" fill="#fff" stroke="#06b6d4" strokeWidth="2"/>
                <ellipse cx="23.5" cy="13.5" rx="2.5" ry="4.5" fill="#fff" stroke="#06b6d4" strokeWidth="2"/>
                <ellipse cx="11" cy="8" rx="2" ry="3" fill="#fff" stroke="#06b6d4" strokeWidth="2"/>
                <ellipse cx="21" cy="8" rx="2" ry="3" fill="#fff" stroke="#06b6d4" strokeWidth="2"/>
              </svg>
            </span>
          </button>
        </form>
        <div style={styles.links}>
          <span
            onClick={onSwitchToLogin}
            style={{
              ...styles.link,
              ...(isRegisterHovered ? styles.linkHover : {})
            }}
          >
            ¿Ya tienes cuenta? Inicia sesión aquí
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;

export function RegisterContent(props) {
  const {
    styles,
    error,
    isRegisterHovered,
    isPasswordToggleHovered,
    isConfirmPasswordToggleHovered,
    showPassword,
    setShowPassword,
    setIsPasswordToggleHovered,
    showConfirmPassword,
    setShowConfirmPassword,
    setIsConfirmPasswordToggleHovered,
    setIsRegisterHovered,
    onSwitchToLogin,
    handleSubmit,
    formData,
    handleChange
  } = props;

  const [showFields, setShowFields] = useState(false);

  useEffect(() => {
    setShowFields(false);
    const timeout = setTimeout(() => setShowFields(true), 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="form-wrapper sign-up">
      <div className={`stagger-logo${showFields ? ' stagger-in' : ''}${!showFields ? ' stagger-hide' : ''}`} style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '140px', height: '140px', backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
          <img src={logo} alt="Logo" style={{ width: '120px', height: '120px', objectFit: 'contain', display: 'block' }} />
        </div>
        <h2 style={{ color: '#B87C4C', fontWeight: 'bold', fontSize: '2.2rem', margin: 0, fontFamily: "'Baloo 2', Arial, sans-serif", letterSpacing: '1px', textShadow: '1px 1px 0 #fff, 0 2px 8px rgba(0,0,0,0.1)' }}>Cuentos Con Patitas</h2>
        <p style={{ color: '#14b8a6', fontWeight: 'bold', margin: '8px 0 18px 0', fontSize: '1.1rem', textShadow: '1px 1px 0 #fff, 0 2px 8px rgba(0,0,0,0.06)' }}>
          "Cada huellita tiene una historia... ¡Crea la tuya!"
        </p>
      </div>
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
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" />
            </svg>
            <input
              type="text"
              name="documentNumber"
              placeholder="Número de Documento"
              value={formData.documentNumber}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" />
            </svg>
            <input
              type="text"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              name="birthdate"
              placeholder="Fecha de nacimiento"
              value={formData.birthdate}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2h5" />
            </svg>
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              value={formData.address}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
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
          <div style={styles.inputContainer}>
            <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{...styles.input, ...styles.inputPassword}}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              onMouseEnter={() => setIsConfirmPasswordToggleHovered(true)}
              onMouseLeave={() => setIsConfirmPasswordToggleHovered(false)}
              style={{
                ...styles.togglePassword,
                ...(isConfirmPasswordToggleHovered ? styles.togglePasswordHover : {})
              }}
            >
              {showConfirmPassword ? (
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
          <button
            type="submit"
            className="btn-register"
            onMouseEnter={() => setIsRegisterHovered(true)}
            onMouseLeave={() => setIsRegisterHovered(false)}
            style={{
              ...styles.registerButton,
              ...(isRegisterHovered ? styles.registerButtonHover : {})
            }}
          >
            Registrarse
            <span className="paw-icon">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="16" cy="24" rx="7" ry="5" fill="#fff" stroke="#06b6d4" strokeWidth="2"/>
                <ellipse cx="8.5" cy="13.5" rx="2.5" ry="4.5" fill="#fff" stroke="#06b6d4" strokeWidth="2"/>
                <ellipse cx="23.5" cy="13.5" rx="2.5" ry="4.5" fill="#fff" stroke="#06b6d4" strokeWidth="2"/>
                <ellipse cx="11" cy="8" rx="2" ry="3" fill="#fff" stroke="#06b6d4" strokeWidth="2"/>
                <ellipse cx="21" cy="8" rx="2" ry="3" fill="#fff" stroke="#06b6d4" strokeWidth="2"/>
              </svg>
            </span>
          </button>
        </form>
        <div style={styles.links}>
          <span
            onClick={onSwitchToLogin}
            style={{
              ...styles.link,
              ...(isRegisterHovered ? styles.linkHover : {})
            }}
          >
            ¿Ya tienes cuenta? Inicia sesión aquí
          </span>
        </div>
      </div>
    </div>
  );
} 