import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoSinTexto from '../assets/img/logosintexto.png';
import './Donaciones.css';
import perritoDonacion from '../assets/img/perrodonacion.png';
import gatitoDonacion from '../assets/img/gatitodonacion.png';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `http://localhost:5000/${url}`;
};

const Donaciones = () => {
  const navigate = useNavigate();
  const [fundaciones, setFundaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFundacion, setSelectedFundacion] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [tipoDonacion, setTipoDonacion] = useState('Monetario');
  const [descripcion, setDescripcion] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [cedulaUsuario, setCedulaUsuario] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [monto, setMonto] = useState('');
  const [urlPago, setUrlPago] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [showNequiModal, setShowNequiModal] = useState(false);
  const [nequiCode, setNequiCode] = useState('');
  const [inputNequiCode, setInputNequiCode] = useState('');
  const [nequiError, setNequiError] = useState('');

  const handleImageError = (fundacionId) => {
    setImageErrors(prev => ({ ...prev, [fundacionId]: true }));
  };
  
  const handleLogout = () => {
    // Lógica de logout
    localStorage.clear();
    navigate('/');
  };

  useEffect(() => {
    const fetchFundaciones = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/fundaciones');
        if (!response.ok) {
          throw new Error('No se pudo cargar la lista de fundaciones.');
        }
        const data = await response.json();
        setFundaciones(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFundaciones();
  }, []);

  useEffect(() => {
    // Al cargar el componente, trae los datos del usuario logueado
    const nombre = localStorage.getItem('nombre');
    const cedula = localStorage.getItem('cedula');
    const usuarioId = localStorage.getItem('usuario_id');
    if (nombre) setNombreUsuario(nombre);
    if (cedula) setCedulaUsuario(cedula);
    if (usuarioId) setUsuarioId(usuarioId);
  }, []);

  // Generar código aleatorio de 6 dígitos
  const generarCodigoNequi = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setError('');
    setUrlPago('');

    if (!selectedFundacion) {
      setError('Por favor selecciona una fundación.');
      return;
    }
    if (!nombreUsuario || !cedulaUsuario || !descripcion) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    if (!usuarioId) {
      setError('No se encontró el usuario logueado.');
      return;
    }
    if (!monto || isNaN(monto) || Number(monto) <= 0) {
      setError('Por favor ingresa un monto válido.');
      return;
    }
    if (!metodoPago) {
      setError('Por favor selecciona un método de pago.');
      return;
    }
    if (metodoPago === 'Tarjeta') {
      if (!cardNumber || !expMonth || !expYear || !cvc || !cardHolder || !email) {
        setError('Por favor completa todos los datos de la tarjeta.');
        return;
      }
    }
    if (metodoPago === 'Nequi') {
      if (!phoneNumber || !email) {
        setError('Por favor ingresa tu número de celular y correo.');
        return;
      }
      // Simular envío de código
      const code = generarCodigoNequi();
      setNequiCode(code);
      setShowNequiModal(true);
      setNequiError('');
      setInputNequiCode('');
      return; // No enviar aún, esperar confirmación
    }

    try {
      const body = {
        usuario_id: usuarioId,
        fundacion_id: selectedFundacion,
        Tipo_Donacion: tipoDonacion,
        Descripcion: descripcion,
        monto: monto,
        nombre_usuario: nombreUsuario,
        cedula_usuario: cedulaUsuario,
        moneda: 'COP',
        metodo_pago: metodoPago,
        ...(metodoPago === 'Tarjeta' && {
          card_number: cardNumber,
          exp_month: expMonth,
          exp_year: expYear,
          cvc: cvc,
          card_holder: cardHolder,
          email: email
        }),
        ...(metodoPago === 'Nequi' && {
          phone_number: phoneNumber,
          email: email
        })
      };
      const response = await fetch('http://localhost:5000/api/iniciar_pago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setSuccessMsg('¡Gracias por tu donación! 🎉');
        setShowThankYou(true);
        setUrlPago(data.url_pago || '');
        setDescripcion('');
        setNombreUsuario('');
        setCedulaUsuario('');
        setSelectedFundacion(null);
        setMonto('');
        setMetodoPago('');
        setCardNumber('');
        setExpMonth('');
        setExpYear('');
        setCvc('');
        setCardHolder('');
        setPhoneNumber('');
        setEmail('');
      } else {
        setError(data.message || 'Error al realizar la donación.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    }
  };

  // Confirmar código Nequi
  const handleConfirmNequi = async () => {
    if (inputNequiCode !== nequiCode) {
      setNequiError('El código ingresado es incorrecto. Intenta nuevamente.');
      return;
    }
    setShowNequiModal(false);
    setNequiError('');
    // Ahora sí, enviar la donación
    try {
      const body = {
        usuario_id: usuarioId,
        fundacion_id: selectedFundacion,
        Tipo_Donacion: tipoDonacion,
        Descripcion: descripcion,
        monto: monto,
        nombre_usuario: nombreUsuario,
        cedula_usuario: cedulaUsuario,
        moneda: 'COP',
        metodo_pago: metodoPago,
        phone_number: phoneNumber,
        email: email
      };
      const response = await fetch('http://localhost:5000/api/iniciar_pago', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setSuccessMsg('¡Gracias por tu donación! 🎉');
        setShowThankYou(true);
        setUrlPago(data.url_pago || '');
        setDescripcion('');
        setNombreUsuario('');
        setCedulaUsuario('');
        setSelectedFundacion(null);
        setMonto('');
        setMetodoPago('');
        setCardNumber('');
        setExpMonth('');
        setExpYear('');
        setCvc('');
        setCardHolder('');
        setPhoneNumber('');
        setEmail('');
      } else {
        setError(data.message || 'Error al realizar la donación.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    }
  };

  // Obtener la fundación seleccionada (objeto completo)
  const fundacionSeleccionada = fundaciones.find(f => f.fundacion_id === selectedFundacion);

  return (
    <div className="donaciones-container">
      {/* Modal de agradecimiento */}
      {showThankYou && (
        <div className="modal-thankyou">
          <div className="modal-content-thankyou">
            <span className="close-thankyou" onClick={() => setShowThankYou(false)}>&times;</span>
            <img src={gatitoDonacion} alt="Gracias" style={{ width: 120, marginBottom: 16 }} />
            <h2>¡Gracias por tu donación!</h2>
            <p>Tu ayuda deja huella y cambia vidas 🧡</p>
            {urlPago && (
              <div style={{ margin: '18px 0' }}>
                <a href={urlPago} target="_blank" rel="noopener noreferrer" className="btn-thankyou">Ir a pagar</a>
              </div>
            )}
            <button className="btn-thankyou" onClick={() => setShowThankYou(false)}>Cerrar</button>
          </div>
        </div>
      )}
      {/* Modal de confirmación Nequi */}
      {showNequiModal && (
        <div className="modal-thankyou">
          <div className="modal-content-thankyou">
            <h2>¡Confirma tu donación!</h2>
            <p>Hemos enviado un código de confirmación a tu celular Nequi.<br/>Ingresa el código recibido para completar tu donación a la fundación.</p>
            <div style={{margin: '12px 0', fontWeight: 'bold', color: '#E28F54', fontSize: '1.2em'}}>Código para demo: <span style={{letterSpacing: '2px'}}>{nequiCode}</span></div>
            <input
              type="text"
              value={inputNequiCode}
              onChange={e => setInputNequiCode(e.target.value)}
              placeholder="Ingresa el código de 6 dígitos"
              maxLength={6}
              style={{fontSize: '1.1em', padding: '8px', borderRadius: '8px', border: '1px solid #E28F54', marginBottom: '8px'}}
            />
            {nequiError && <div style={{color: 'red', marginBottom: '8px'}}>{nequiError}</div>}
            <button className="btn-thankyou" onClick={handleConfirmNequi}>Confirmar donación</button>
            <button className="btn-thankyou" style={{background:'#F0E5D8', color:'#E28F54', marginLeft:'10px'}} onClick={()=>setShowNequiModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
      {/* Header/Navbar */}
      <header className="donaciones-header">
        <div className="header-content-donaciones">
          <div
            className="logo-titulo-navbar"
            onClick={() => navigate('/index1')}
          >
            <img src={logoSinTexto} alt="Logo Cuentos Con Patitas" />
            <div className="titulo-container">
              <span className="titulo-navbar-superior">Cuentos Con</span>
              <span className="titulo-navbar-inferior">Patitas</span>
            </div>
          </div>
          <nav className="nav-menu-donaciones">
            <a className="nav-link-animada" href="#">¿Quienes Somos?</a>
            <Link to="/fundaciones" className="nav-link-animada">Fundaciones</Link>
            <Link to="/donaciones" className="nav-link-animada active">¿Quieres Ayudar?</Link>
            <a className="nav-link-animada" href="#">Soporte</a>
            <div className="user-dropdown-container">
              <Link to="/micuenta" className="nav-link-animada">Mi cuenta</Link>
              <div className="logout-dropdown">
                <button onClick={handleLogout}>Cerrar sesión</button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="donaciones-main">
        <div className="donacion-card">
          <div className="donacion-form-container">
            <h1>Ayuda a una Fundación</h1>
            <p className="subtitle">Tu generosidad cambia vidas. Cada donación, sin importar su tamaño, hace una gran diferencia.</p>
            
            <form className="donacion-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Elige una fundación *</label>
                {loading ? (
                  <p>Cargando fundaciones...</p>
                ) : error ? (
                  <p className="error-text">{error}</p>
                ) : (
                  <div className="fundacion-gallery">
                    {fundaciones.map(fund => (
                      <div
                        key={fund.fundacion_id}
                        className={`fundacion-item ${selectedFundacion === fund.fundacion_id ? 'selected' : ''}`}
                        onClick={() => setSelectedFundacion(fund.fundacion_id)}
                      >
                        {imageErrors[fund.fundacion_id] || !fund.foto_url ? (
                          <div className="image-placeholder-donaciones">
                            <i className="fas fa-home"></i>
                          </div>
                        ) : (
                          <img
                            src={getImageUrl(fund.foto_url)}
                            alt={fund.nombre}
                            onError={() => handleImageError(fund.fundacion_id)}
                          />
                        )}
                        <span>{fund.nombre}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Nombre *</label>
                <input
                  type="text"
                  value={nombreUsuario}
                  onChange={e => setNombreUsuario(e.target.value)}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="form-group">
                <label>Cédula *</label>
                <input
                  type="number"
                  value={cedulaUsuario}
                  onChange={e => setCedulaUsuario(e.target.value)}
                  placeholder="Tu cédula"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipo de Donación *</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="tipo_donacion"
                      value="Monetario"
                      checked={tipoDonacion === 'Monetario'}
                      onChange={() => setTipoDonacion('Monetario')}
                    /> Monetario
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="tipo_donacion"
                      value="Alimento"
                      checked={tipoDonacion === 'Alimento'}
                      onChange={() => setTipoDonacion('Alimento')}
                    /> Alimento
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="tipo_donacion"
                      value="Otros"
                      checked={tipoDonacion === 'Otros'}
                      onChange={() => setTipoDonacion('Otros')}
                    /> Otros
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción *</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows="4"
                  placeholder="Ej: 5kg de concentrado para cachorros, medicinas para pulgas, etc."
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Monto a donar (COP) *</label>
                <input
                  type="number"
                  value={monto}
                  onChange={e => setMonto(e.target.value)}
                  placeholder="Ej: 50000"
                  required
                  min={1}
                />
              </div>

              <div className="form-group">
                <label>Método de pago *</label>
                <select
                  value={metodoPago}
                  onChange={e => setMetodoPago(e.target.value)}
                  required
                >
                  <option value="">Selecciona un banco o método</option>
                  <option value="Bancolombia">Bancolombia</option>
                  <option value="Davivienda">Davivienda</option>
                  <option value="Nequi">Nequi</option>
                  <option value="PSE">PSE</option>
                  <option value="Tarjeta">Tarjeta de crédito/débito</option>
                </select>
              </div>

              {/* Mostrar información bancaria/nequi de la fundación seleccionada */}
              {fundacionSeleccionada && metodoPago && (
                <div className="info-donacion-fundacion">
                  {metodoPago === 'Nequi' && fundacionSeleccionada.telefono_contacto && (
                    <div className="info-nequi">
                      <span role="img" aria-label="nequi" style={{fontSize: '1.3em'}}>📱</span>
                      <strong> Dona a Nequi:</strong> {fundacionSeleccionada.telefono_contacto}
                      <br/>
                      <span style={{fontSize: '0.95em', color: '#7C6C5F'}}>A nombre de: {fundacionSeleccionada.titular_cuenta || fundacionSeleccionada.nombre}</span>
                    </div>
                  )}
                  {(metodoPago === 'Bancolombia' || metodoPago === 'Davivienda' || metodoPago === 'PSE') && (
                    <div className="info-bancaria">
                      <span role="img" aria-label="banco" style={{fontSize: '1.3em'}}>🏦</span>
                      <strong> Banco:</strong> {fundacionSeleccionada.banco || metodoPago}
                      <br/>
                      <strong>Tipo de cuenta:</strong> {fundacionSeleccionada.tipo_cuenta || 'No especificado'}
                      <br/>
                      <strong>Número:</strong> {fundacionSeleccionada.numero_cuenta || 'No especificado'}
                      <br/>
                      <strong>Titular:</strong> {fundacionSeleccionada.titular_cuenta || fundacionSeleccionada.nombre}
                    </div>
                  )}
                </div>
              )}

              {metodoPago === 'Tarjeta' && (
                <div className="form-group">
                  <label>Número de tarjeta</label>
                  <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required />
                  <label>Fecha de expiración (MM/AA)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" value={expMonth} onChange={e => setExpMonth(e.target.value)} placeholder="MM" required style={{ width: '50%' }} />
                    <input type="text" value={expYear} onChange={e => setExpYear(e.target.value)} placeholder="AA" required style={{ width: '50%' }} />
                  </div>
                  <label>CVV</label>
                  <input type="text" value={cvc} onChange={e => setCvc(e.target.value)} required />
                  <label>Nombre en la tarjeta</label>
                  <input type="text" value={cardHolder} onChange={e => setCardHolder(e.target.value)} required />
                  <label>Correo electrónico</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              )}

              {metodoPago === 'Nequi' && (
                <div className="form-group">
                  <label>Celular Nequi</label>
                  <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
                  <label>Correo electrónico</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              )}

              {(metodoPago === 'Bancolombia' || metodoPago === 'Davivienda' || metodoPago === 'PSE') && (
                <div className="form-group">
                  <p>Serás redirigido a la pasarela de pago para completar tu donación con {metodoPago}.</p>
                </div>
              )}

              {error && <p className="error-text">{error}</p>}
              {successMsg && <p className="success-text">{successMsg}</p>}

              <button type="submit" className="btn-donar">Donar Ahora</button>
            </form>
          </div>
          <div className="donacion-image-container">
            <img src={perritoDonacion} alt="Perro feliz con donaciones" />
            <p className="image-slogan">¡Tu ayuda deja huella!</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Donaciones; 