import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Login from './components/login';
import Register from './components/Register';
import Home from './components/Home';
import Bienvenida from './components/Bienvenida';
import BienvenidaFundacion from './components/BienvenidaFundacion';
import MiCuenta from './components/MiCuenta';
import MiFundacion from './components/MiFundacion';
import Eventos from './components/Eventos';
import EventosUsuario from './components/EventosUsuario';
import './App.css'; // Asegúrate de importar los estilos globales
import backgroundImage from './assets/img/fondoperrogato.jpg';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Loading from './components/Loading';
import ListaFundaciones from './components/ListaFundaciones';
import DetalleFundacion from './components/DetalleFundacion';
import Donaciones from './components/Donaciones';
// Importaciones para adopción
import AdopcionRegistro from './components/AdopcionRegistro';
import AdopcionFundacion from './components/AdopcionFundacion';

// --- Componentes de Rutas Protegidas ---

// Componente para proteger rutas que requieren solo autenticación
const AuthRoute = ({ isAuthenticated, element }) => {
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return element;
};

// Componente para proteger rutas que requieren un rol específico
const RoleRoute = ({ isAuthenticated, userRole, requiredRole, element }) => {
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (userRole !== requiredRole) return <Navigate to="/index1" replace />;
  return element;
};

// Componente para rutas públicas o de usuarios
const UserOrPublicRoute = ({ isAuthenticated, userRole, element }) => {
  if (!isAuthenticated || userRole === 'usuario') {
    return element;
  }
  // Si es una fundación, no debería ver esta página (ej: /fundaciones), redirigir
  return <Navigate to="/index1" replace />;
};

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

  // Validación de sesión real para fundación
  useEffect(() => {
    if (rol === 'fundacion') {
      fetch('http://localhost:5000/api/mi_fundacion', { credentials: 'include' })
        .then(res => {
          if (!res.ok) {
            localStorage.removeItem('fundacion');
            window.location.href = '/';
          }
        })
        .catch(() => {
          localStorage.removeItem('fundacion');
          window.location.href = '/';
        });
    }
  }, [rol]);

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
            <AuthRoute
              isAuthenticated={isAuthenticated}
              element={rol === 'usuario' ? <Bienvenida /> : <BienvenidaFundacion />}
            />
          }
        />
        <Route
          path="/micuenta"
          element={<AuthRoute isAuthenticated={isAuthenticated} element={<MiCuenta />} />}
        />
        <Route
          path="/mifundacion"
          element={
            <RoleRoute
              isAuthenticated={isAuthenticated}
              userRole={rol}
              requiredRole="fundacion"
              element={<MiFundacion />}
            />
          }
        />
        <Route
          path="/adopcionfundacion"
          element={
            <RoleRoute
              isAuthenticated={isAuthenticated}
              userRole={rol}
              requiredRole="fundacion"
              element={<AdopcionFundacion />}
            />
          }
        />
        <Route
          path="/eventos"
          element={
            <AuthRoute
              isAuthenticated={isAuthenticated}
              element={rol === 'usuario' ? <EventosUsuario /> : <Eventos />}
            />
          }
        />
        <Route
          path="/donaciones"
          element={<AuthRoute isAuthenticated={isAuthenticated} element={<Donaciones />} />}
        />
        {/* Rutas para usuarios o no autenticados */}
        <Route
          path="/fundaciones"
          element={
            <UserOrPublicRoute
              isAuthenticated={isAuthenticated}
              userRole={rol}
              element={<ListaFundaciones />}
            />
          }
        />
        <Route
          path="/fundacion/:fundacion_id"
          element={
            <UserOrPublicRoute
              isAuthenticated={isAuthenticated}
              userRole={rol}
              element={<DetalleFundacion />}
            />
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