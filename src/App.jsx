import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Login from './components/login';
import Register from './components/Register';
import Home from './components/Home';
import Bienvenida from './components/Bienvenida';
import BienvenidaFundacion from './components/BienvenidaFundacion';
import MiCuenta from './components/MiCuenta';
import FormularioFundacion from './components/FormularioFundacion';
import MiFundacion from './components/MiFundacion';
import './App.css'; // Asegúrate de importar los estilos globales
import backgroundImage from './assets/img/fondoperrogato.jpg';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Loading from './components/Loading';

function getAuthInfo() {
  const user = localStorage.getItem('user');
  if (user) return { tipo: 'usuario', data: JSON.parse(user) };
  const fundacion = localStorage.getItem('fundacion');
  if (fundacion) return { tipo: 'fundacion', data: JSON.parse(fundacion) };
  return null;
}

function BackgroundWithRoutes() {
  // Estados y refs de login/register
  const [isLogin, setIsLogin] = useState(true);
  const [authInfo, setAuthInfo] = useState(getAuthInfo());
  const loginRef = useRef(null);
  const registerRef = useRef(null);

  // Handlers para Login/Register
  const handleSwitchToRegister = () => setIsLogin(false);
  const handleSwitchToLogin = () => setIsLogin(true);

  // Reactividad: escucha cambios en localStorage
  useEffect(() => {
    const checkAuth = () => {
      setAuthInfo(getAuthInfo());
    };
    window.addEventListener('storage', checkAuth);
    const interval = setInterval(checkAuth, 500);
    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const isAuthenticated = !!authInfo;
  const rol = authInfo?.tipo;

  // Fondo decorativo global solo en '/'
  const location = useLocation();
  const showBackground = location.pathname === '/';
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

  return (
    <div style={{ minHeight: '100vh', minWidth: '100vw', position: 'relative' }}>
      {showBackground && <div style={backgroundStyles}></div>}
      {showBackground && <div style={overlayStyles}></div>}
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
          element={
            isAuthenticated
              ? rol === 'usuario'
                ? <Bienvenida />
                : <BienvenidaFundacion />
              : <Navigate to="/" replace />
          }
        />
        <Route
          path="/micuenta"
          element={isAuthenticated ? <MiCuenta /> : <Navigate to="/" replace />}
        />
        <Route
          path="/mifundacion"
          element={
            isAuthenticated
              ? rol === 'fundacion'
                ? <MiFundacion />
                : <Navigate to="/index1" replace />
              : <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <BackgroundWithRoutes />
    </Router>
  );
}

export default App;   