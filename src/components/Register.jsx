import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import backgroundImage from '../assets/img/fondoperrogato.jpg';
import huella from '../assets/img/huella-login-registro.png';
import Loading from './Loading';
import '../App.css';
import { motion, AnimatePresence } from 'framer-motion';

function Register({ onSwitchToLogin, onFormSubmit }) {
  const navigate = useNavigate();
  const [tipoRegistro, setTipoRegistro] = useState(null); // null, 'usuario', 'fundacion'
  const [formData, setFormData] = useState({
    // Usuario
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    documentNumber: '',
    phone: '',
    birthdate: '',
    address: '',
    // Fundación
    nit: '',
    nombre: '',
    direccion: '',
    telefono: '',
    persona_acargo: '',
    // Rol
    rol: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterHovered, setIsRegisterHovered] = useState(false);
  const [isPasswordToggleHovered, setIsPasswordToggleHovered] = useState(false);
  const [isConfirmPasswordToggleHovered, setIsConfirmPasswordToggleHovered] = useState(false);
  const [showFields, setShowFields] = useState(false);

  const paleYellow = '#FFF9E5'; // fondo general
  const paleYellowButton = '#FFE066'; // botones

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

    if (tipoRegistro === 'usuario') {
      // Validaciones usuario
      if (!/^\d{7,11}$/.test(formData.documentNumber)) {
        setError('El número de documento debe tener entre 7 y 11 dígitos.');
        return;
      }
      if (!/^\d{10}$/.test(formData.phone)) {
        setError('El número de teléfono debe tener exactamente 10 dígitos.');
        return;
      }
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) {
        setError('El correo electrónico no es válido.');
        return;
      }
      const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setError('La contraseña debe tener al menos 8 caracteres y una letra mayúscula.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
    } else if (tipoRegistro === 'fundacion') {
      // Validaciones fundación
      if (!/^\d{7,15}$/.test(formData.nit)) {
        setError('El NIT debe tener entre 7 y 15 dígitos.');
        return;
      }
      if (!formData.nombre) {
        setError('El nombre de la fundación es obligatorio.');
        return;
      }
      if (!formData.direccion) {
        setError('La dirección es obligatoria.');
        return;
      }
      if (!/^\d{10}$/.test(formData.telefono)) {
        setError('El teléfono debe tener exactamente 10 dígitos.');
        return;
      }
      if (!/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) {
        setError('El correo electrónico no es válido.');
        return;
      }
      if (!formData.persona_acargo) {
        setError('El nombre de la persona a cargo es obligatorio.');
        return;
      }
      const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setError('La contraseña debe tener al menos 8 caracteres y una letra mayúscula.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
    }

    setIsLoading(true);
    try {
      let body = {};
      if (tipoRegistro === 'usuario') {
        body = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          documentNumber: formData.documentNumber,
          phone: formData.phone,
          birthdate: formData.birthdate,
          address: formData.address,
          rol: 'usuario'
        };
      } else if (tipoRegistro === 'fundacion') {
        body = {
          nit: formData.nit,
          nombre: formData.nombre,
          direccion: formData.direccion,
          telefono: formData.telefono,
          email: formData.email,
          persona_acargo: formData.persona_acargo,
          contrasena: formData.password,
          rol: 'fundacion'
        };
      }
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (response.ok) {
        if (tipoRegistro === 'usuario') {
          localStorage.setItem('user', JSON.stringify(data.user));
        } else if (tipoRegistro === 'fundacion' && data.fundacion) {
          localStorage.setItem('fundacion', JSON.stringify(data.fundacion));
        }
        setTimeout(() => {
          setIsLoading(false);
          navigate('/index1');
        }, 2000);
      } else {
        setError(data.message || 'Error al registrar');
        setIsLoading(false);
      }
    } catch (error) {
      setError('Error al conectar con el servidor');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setShowFields(false);
    const timeout = setTimeout(() => setShowFields(true), 100);
    return () => clearTimeout(timeout);
  }, [tipoRegistro]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, position: 'relative', overflow: 'hidden', fontFamily: "'Baloo 2', Arial, sans-serif" }}>
      <div style={{ position: 'absolute', top: -150, left: -200, right: -200, bottom: -180, backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{
        position: 'relative',
        zIndex: 3,
        width: '100%',
        maxWidth: 340,
        minHeight: tipoRegistro === 'fundacion' ? 'unset' : '95vh',
        margin: '32px auto',
        borderRadius: 32,
        padding: tipoRegistro === 'fundacion' ? '8px 0 12px 0' : '64px 0',
        background: 'rgba(179, 218, 255, 0.65)',
        boxShadow: '0 10px 40px rgba(238, 238, 238, 0.87)',
        border: '1.5px solid rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}>
        {/* LOGO SIEMPRE VISIBLE Y CENTRADO */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 0 8px 0' }}>
          <div style={{ width: '120px', height: '120px', backgroundColor: 'rgba(255,255,255,0.98)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 10px -3px rgba(0,0,0,0.1)' }}>
            <img src={logo} alt="Logo" style={{ width: '100px', height: '100px', objectFit: 'contain', display: 'block' }} />
          </div>
        </div>
        {/* HEADER SIEMPRE VISIBLE */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: tipoRegistro === 'fundacion' ? '8px' : '32px',
            paddingTop: '0',
            paddingBottom: '0',
          }}
        >
          <h2
            style={{
              color: '#B87C4C',
              fontWeight: 'bold',
              fontSize: '1.4rem',
              margin: tipoRegistro === 'fundacion' ? '0 0 4px 0' : '0',
              fontFamily: "'Baloo 2', Arial, sans-serif",
              letterSpacing: '1px',
              textShadow: '1px 1px 0 #fff, 0 2px 8px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            {tipoRegistro === 'usuario' && 'Registro de Usuario'}
            {tipoRegistro === 'fundacion' && 'Registro de Fundación'}
            {!tipoRegistro && 'Cuentos Con Patitas'}
          </h2>
          <p
            style={{
              color: '#14b8a6',
              fontWeight: 'bold',
              margin: tipoRegistro === 'fundacion' ? '2px 0 8px 0' : '8px 0 18px 0',
              fontSize: '1.05rem',
              textShadow: '1px 1px 0 #fff, 0 2px 8px rgba(0,0,0,0.06)',
              textAlign: 'center',
            }}
          >
            "Cada huellita tiene una historia... ¡Crea la tuya!"
          </p>
        </div>
        {/* FORMULARIO O SELECCIÓN DE TIPO */}
        {!tipoRegistro ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ color: '#B87C4C', fontWeight: 'bold', marginBottom: 24, fontSize: '1.5rem', transition: 'color 0.5s' }}>¿Cómo deseas registrarte?</h2>
              <button
                onClick={() => setTipoRegistro('usuario')}
                className="rol-btn"
                style={{
                  margin: 8,
                  padding: '14px 32px',
                  fontSize: '1.1rem',
                  borderRadius: 16,
                  border: 'none',
                  background: paleYellowButton,
                  color: '#B87C4C',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px 0 rgba(0,0,0,0.07)',
                  transition: 'background 0.3s, box-shadow 0.3s, transform 0.25s cubic-bezier(0.4,0,0.2,1)',
                  outline: 'none',
                  letterSpacing: '0.5px',
                  filter: 'drop-shadow(0 2px 8px #ffe06655)',
                  zIndex: 10,
                  width: '90%',
                  maxWidth: 300,
                  marginBottom: 12
                }}
              >
                Persona Natural
              </button>
              <button
                onClick={() => setTipoRegistro('fundacion')}
                className="rol-btn"
                style={{
                  margin: 8,
                  padding: '14px 32px',
                  fontSize: '1.1rem',
                  borderRadius: 16,
                  border: 'none',
                  background: paleYellowButton,
                  color: '#B87C4C',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px 0 rgba(0,0,0,0.07)',
                  transition: 'background 0.3s, box-shadow 0.3s, transform 0.25s cubic-bezier(0.4,0,0.2,1)',
                  outline: 'none',
                  letterSpacing: '0.5px',
                  filter: 'drop-shadow(0 2px 8px #ffe06655)',
                  zIndex: 10,
                  width: '90%',
                  maxWidth: 300
                }}
              >
                Fundación
              </button>
              <div style={{ marginTop: 18 }}>
                <span
                  onClick={onSwitchToLogin}
                  style={{
                    display: 'block',
                    color: '#0891b2',
                    fontSize: '16px',
                    textDecoration: 'underline',
                    textDecorationColor: '#0891b2',
                    margin: '12px 0',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ¿Ya tienes cuenta? Inicia sesión aquí
                </span>
              </div>
              <style>{`
                .rol-btn:hover {
                  background: #ffd600 !important;
                  color: #b87c4c !important;
                  box-shadow: 0 8px 24px 0 #ffe06699;
                  transform: scale(1.06) translateY(-2px);
                }
              `}</style>
            </div>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
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
            {/* Campos para usuario */}
            {tipoRegistro === 'usuario' && (
              <>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'rgba(34,197,94,0.7)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <input type="text" name="username" placeholder="Nombre de usuario" value={formData.username} onChange={handleChange} required style={{ width: '92%', margin: '0 auto 8px auto', display: 'block', padding: '7px 7px 7px 40px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid #bdbdbd', borderRadius: '14px', color: '#222', fontSize: '13px', outline: 'none', backdropFilter: 'blur(4px)', transition: 'all 0.3s ease', boxSizing: 'border-box' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'rgba(59,130,246,0.7)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required style={{ width: '92%', margin: '0 auto 8px auto', display: 'block', padding: '7px 7px 7px 40px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid #bdbdbd', borderRadius: '14px', color: '#222', fontSize: '13px', outline: 'none', backdropFilter: 'blur(4px)', transition: 'all 0.3s ease', boxSizing: 'border-box' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'rgba(34,197,94,0.7)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" /></svg>
                  <input type="number" name="documentNumber" placeholder="Número de Documento" value={formData.documentNumber} onChange={handleChange} required min="1000000" max="99999999999" pattern="\d{7,11}" style={{ width: '92%', margin: '0 auto 8px auto', display: 'block', padding: '7px 7px 7px 40px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid #bdbdbd', borderRadius: '14px', color: '#222', fontSize: '13px', outline: 'none', backdropFilter: 'blur(4px)', transition: 'all 0.3s ease', boxSizing: 'border-box' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'rgba(34,197,94,0.7)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" /></svg>
                  <input type="number" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required min="1000000000" max="9999999999" pattern="\d{10}" style={{ width: '92%', margin: '0 auto 8px auto', display: 'block', padding: '7px 7px 7px 40px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid #bdbdbd', borderRadius: '14px', color: '#222', fontSize: '13px', outline: 'none', backdropFilter: 'blur(4px)', transition: 'all 0.3s ease', boxSizing: 'border-box' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'rgba(59,130,246,0.7)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <input type="date" name="birthdate" placeholder="Fecha de nacimiento" value={formData.birthdate} onChange={handleChange} required style={{ width: '92%', margin: '0 auto 8px auto', display: 'block', padding: '7px 7px 7px 40px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid #bdbdbd', borderRadius: '14px', color: '#222', fontSize: '13px', outline: 'none', backdropFilter: 'blur(4px)', transition: 'all 0.3s ease', boxSizing: 'border-box' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'rgba(34,197,94,0.7)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2h5" /></svg>
                  <input type="text" name="address" placeholder="Dirección" value={formData.address} onChange={handleChange} required style={{ width: '92%', margin: '0 auto 8px auto', display: 'block', padding: '7px 7px 7px 40px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid #bdbdbd', borderRadius: '14px', color: '#222', fontSize: '13px', outline: 'none', backdropFilter: 'blur(4px)', transition: 'all 0.3s ease', boxSizing: 'border-box' }} />
                </div>
              </>
            )}
            {/* Campos para fundación */}
            {tipoRegistro === 'fundacion' && (
              <>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'rgba(34,197,94,0.7)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" /></svg>
                  <input type="text" name="nit" placeholder="NIT" value={formData.nit} onChange={handleChange} required style={{ width: '92%', margin: '0 auto 8px auto', display: 'block', padding: '7px 7px 7px 40px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid #bdbdbd', borderRadius: '14px', color: '#222', fontSize: '13px', outline: 'none', backdropFilter: 'blur(4px)', transition: 'all 0.3s ease', boxSizing: 'border-box' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'rgba(34,197,94,0.7)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <input type="text" name="nombre" placeholder="Nombre de la Fundación" value={formData.nombre} onChange={handleChange} required style={{ width: '92%', margin: '0 auto 8px auto', display: 'block', padding: '7px 7px 7px 40px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid #bdbdbd', borderRadius: '14px', color: '#222', fontSize: '13px', outline: 'none', backdropFilter: 'blur(4px)', transition: 'all 0.3s ease', boxSizing: 'border-box' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'rgba(34,197,94,0.7)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2h5" /></svg>
                  <input type="text" name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleChange} required style={{ width: '92%', margin: '0 auto 8px auto', display: 'block', padding: '7px 7px 7px 40px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid #bdbdbd', borderRadius: '14px', color: '#222', fontSize: '13px', outline: 'none', backdropFilter: 'blur(4px)', transition: 'all 0.3s ease', boxSizing: 'border-box' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'rgba(34,197,94,0.7)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" /></svg>
                  <input type="number" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} required min="1000000000" max="9999999999" pattern="\d{10}" style={{ width: '92%', margin: '0 auto 8px auto', display: 'block', padding: '7px 7px 7px 40px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid #bdbdbd', borderRadius: '14px', color: '#222', fontSize: '13px', outline: 'none', backdropFilter: 'blur(4px)', transition: 'all 0.3s ease', boxSizing: 'border-box' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'rgba(59,130,246,0.7)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required style={{ width: '92%', margin: '0 auto 8px auto', display: 'block', padding: '7px 7px 7px 40px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid #bdbdbd', borderRadius: '14px', color: '#222', fontSize: '13px', outline: 'none', backdropFilter: 'blur(4px)', transition: 'all 0.3s ease', boxSizing: 'border-box' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'rgba(34,197,94,0.7)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <input type="text" name="persona_acargo" placeholder="Persona a cargo" value={formData.persona_acargo} onChange={handleChange} required style={{ width: '92%', margin: '0 auto 8px auto', display: 'block', padding: '7px 7px 7px 40px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid #bdbdbd', borderRadius: '14px', color: '#222', fontSize: '13px', outline: 'none', backdropFilter: 'blur(4px)', transition: 'all 0.3s ease', boxSizing: 'border-box' }} />
                </div>
              </>
            )}
            {/* Contraseña y confirmación */}
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'rgba(6,182,212,0.7)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required style={{ width: '92%', margin: '0 auto 8px auto', display: 'block', padding: '7px 7px 7px 40px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid #bdbdbd', borderRadius: '14px', color: '#222', fontSize: '13px', outline: 'none', backdropFilter: 'blur(4px)', transition: 'all 0.3s ease', boxSizing: 'border-box', paddingRight: '56px' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} onMouseEnter={() => setIsPasswordToggleHovered(true)} onMouseLeave={() => setIsPasswordToggleHovered(false)} style={{ position: 'absolute', right: '14px', top: 'calc(50% - 18px)', background: isPasswordToggleHovered ? '#06b6d4' : '#fff', border: 'none', color: isPasswordToggleHovered ? '#fff' : '#06b6d4', cursor: 'pointer', width: '36px', height: '36px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', zIndex: 2, outline: 'none' }}>
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 22, height: 22 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.01c2.282 4.03 6.617 6.99 10.066 6.99 1.676 0 3.37-.44 4.922-1.277M21.07 15.977A10.451 10.451 0 0022.066 12c-2.282-4.03-6.617-6.99-10.066-6.99-1.676 0-3.37.44-4.922 1.277M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 22, height: 22 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.808 2.808l18.384 18.384M9.878 9.878A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .414-.08.81-.222 1.172M6.343 6.343A10.477 10.477 0 001.934 12.01c2.282 4.03 6.617 6.99 10.066 6.99 1.676 0 3.37-.44 4.922-1.277M15 12a3 3 0 01-6 0c0-.414.08-.81.222-1.172" />
                  </svg>
                )}
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: 'rgba(6,182,212,0.7)', pointerEvents: 'none' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirmar contraseña" value={formData.confirmPassword} onChange={handleChange} required style={{ width: '92%', margin: '0 auto 8px auto', display: 'block', padding: '7px 7px 7px 40px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid #bdbdbd', borderRadius: '14px', color: '#222', fontSize: '13px', outline: 'none', backdropFilter: 'blur(4px)', transition: 'all 0.3s ease', boxSizing: 'border-box', paddingRight: '56px' }} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} onMouseEnter={() => setIsConfirmPasswordToggleHovered(true)} onMouseLeave={() => setIsConfirmPasswordToggleHovered(false)} style={{ position: 'absolute', right: '14px', top: 'calc(50% - 18px)', background: isConfirmPasswordToggleHovered ? '#06b6d4' : '#fff', border: 'none', color: isConfirmPasswordToggleHovered ? '#fff' : '#06b6d4', cursor: 'pointer', width: '36px', height: '36px', padding: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', zIndex: 2, outline: 'none' }}>
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 22, height: 22 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.01c2.282 4.03 6.617 6.99 10.066 6.99 1.676 0 3.37-.44 4.922-1.277M21.07 15.977A10.451 10.451 0 0022.066 12c-2.282-4.03-6.617-6.99-10.066-6.99-1.676 0-3.37.44-4.922 1.277M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 22, height: 22 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.808 2.808l18.384 18.384M9.878 9.878A3 3 0 0112 9c1.657 0 3 1.343 3 3 0 .414-.08.81-.222 1.172M6.343 6.343A10.477 10.477 0 001.934 12.01c2.282 4.03 6.617 6.99 10.066 6.99 1.676 0 3.37-.44 4.922-1.277M15 12a3 3 0 01-6 0c0-.414.08-.81.222-1.172" />
                  </svg>
                )}
              </button>
            </div>
            <button type="submit" className="btn-register" onMouseEnter={() => setIsRegisterHovered(true)} onMouseLeave={() => setIsRegisterHovered(false)} style={{
              width: '92%',
              margin: '0 auto 8px auto',
              display: 'block',
              padding: '16px 0',
              background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
              border: 'none',
              borderRadius: '22px',
              color: 'white',
              fontSize: '1.15rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 6px 24px 0 rgba(6,182,212,0.18)',
              transition: 'all 0.3s ease',
              outline: 'none',
              letterSpacing: '0.5px',
              ...(isRegisterHovered ? {
                background: 'linear-gradient(135deg, #0891b2 0%, #0f766e 100%)',
                transform: 'scale(1.03)',
                boxShadow: '0 0 0 6px rgba(6, 182, 212, 0.18)'
              } : {})
            }}>Registrarse<span className="paw-icon"><img src={huella} alt="huella" style={{ width: '18px', height: '18px', marginLeft: '8px', verticalAlign: 'middle' }} /></span></button>
            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <span onClick={onSwitchToLogin} className="login-link-hover" style={{ display: 'block', color: '#0891b2', fontSize: '16px', textDecoration: 'underline', textDecorationColor: '#0891b2', margin: '12px 0', transition: 'all 0.2s ease', cursor: 'pointer', fontWeight: 'bold', ...(isRegisterHovered ? { color: '#0f766e', textDecorationColor: '#0f766e' } : {}) }}>¿Ya tienes cuenta? Inicia sesión aquí</span>
              <br />
              <span onClick={() => setTipoRegistro(null)} className="back-role-link-hover" style={{ display: 'block', color: '#b87c4c', textDecoration: 'underline', textDecorationColor: '#b87c4c', fontWeight: 'bold', margin: '12px 0', transition: 'all 0.2s ease', cursor: 'pointer' }}>Volver a selección de rol</span>
            </div>
            <style>{`
              .rol-btn:hover {
                background: #ffd600 !important;
                color: #b87c4c !important;
                box-shadow: 0 8px 24px 0 #ffe06699;
                transform: scale(1.06) translateY(-2px);
              }
              .login-link-hover:hover {
                color: #0f766e !important;
                text-decoration-color: #0f766e !important;
                text-shadow: 0 2px 8px #b2f5ea55;
                transform: scale(1.06) translateY(-2px);
              }
              .back-role-link-hover:hover {
                color: #b87c4c !important;
                text-decoration-color: #b87c4c !important;
                text-shadow: 0 2px 8px #ffe06655;
                transform: scale(1.06) translateY(-2px);
              }
              form {
                gap: 12px !important;
              }
              form input {
                margin-bottom: 0 !important;
              }
            `}</style>
          </motion.form>
        )}
      </div>
    </div>
  );
}

export default Register; 