import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import Login from './components/login';
import Register from './components/Register';
import Home from './components/Home';
import './App.css'; // Asegúrate de importar los estilos globales
import backgroundImage from './assets/img/fondoperrogato.jpg';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Loading from './components/Loading';


function App() {
  const [isLogin, setIsLogin] = useState(true);
  const isAuthenticated = !!localStorage.getItem('user');
  const loginRef = useRef(null);
  const registerRef = useRef(null);

  // Estados para Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPassword, setLoginShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isPasswordToggleHovered, setIsPasswordToggleHovered] = useState(false);
  const [loginHoveredLink, setLoginHoveredLink] = useState(null);

  // Estados para Register
  const [registerFormData, setRegisterFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [registerShowPassword, setRegisterShowPassword] = useState(false);
  const [registerShowConfirmPassword, setRegisterShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [isRegisterHovered, setIsRegisterHovered] = useState(false);
  const [isPasswordToggleHoveredR, setIsPasswordToggleHoveredR] = useState(false);
  const [isConfirmPasswordToggleHovered, setIsConfirmPasswordToggleHovered] = useState(false);
  const [registerHoveredLink, setRegisterHoveredLink] = useState(null);

  // Handlers para Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    // Aquí puedes poner la lógica real de login o llamar a la función original
  };

  // Handlers para Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    // Aquí puedes poner la lógica real de registro o llamar a la función original
  };

  const handleSwitchToRegister = () => setIsLogin(false);
  const handleSwitchToLogin = () => {
    console.log('Cambiando a login');
    setIsLogin(true);
  };

  // Fondo decorativo global
  const backgroundStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1,
    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(255, 255, 255, 0.3) 100%)',
    pointerEvents: 'none',
  };
  // Estilos copiados directamente de Login.jsx y Register.jsx
  const loginStyles = {
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
      textShadow: `1px 1px 0 #fff, 0 2px 8px rgba(0, 0, 0, 0.1)`
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

  const registerStyles = { ...loginStyles, registerButton: {
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
  }, registerButtonHover: {
    background: 'linear-gradient(135deg, #0891b2 0%, #0f766e 100%)',
    transform: 'scale(1.02)',
    boxShadow: '0 0 0 4px rgba(6, 182, 212, 0.3)'
  }};

  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', position: 'relative' }}>
      <div style={backgroundStyles}></div>
      <div style={overlayStyles}></div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div className={`auth-center-container`}>
                <div className={`${isLogin ? 'auth-card' : 'register-card'}${isLogin === null ? '' : ' card-animate-in'}`}>  
                  <TransitionGroup component={null}>
                    <CSSTransition
                      key={isLogin ? 'login' : 'register'}
                      timeout={800}
                      classNames="slide-up"
                      unmountOnExit
                      nodeRef={isLogin ? loginRef : registerRef}
                    >
                      <div ref={isLogin ? loginRef : registerRef} style={{ width: '100%' }}>
                        {isLogin ? (
                          <Login
                            key="login"
                            onSwitchToRegister={handleSwitchToRegister}
                          />
                        ) : (
                          <Register
                            key="register"
                            onSwitchToLogin={handleSwitchToLogin}
                          />
                        )}
                      </div>
                    </CSSTransition>
                  </TransitionGroup>
                </div>
              </div>
            }
          />
          <Route
            path="/index1"
            element={isAuthenticated ? <Home /> : <Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;   