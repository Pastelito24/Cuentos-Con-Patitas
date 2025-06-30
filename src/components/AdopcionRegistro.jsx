import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoSinTexto from '../assets/img/logosintexto.png';
import './AdopcionRegistro.css';

const AdopcionRegistro = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    cedula: '',
    correo: '',
    fecha: '',
    fundacion: '',
    animal: '',
    motivo: ''
  });
  const [fundaciones, setFundaciones] = useState([]);
  const [animales, setAnimales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleOpenModal = () => {
    setShowForm(true);
    setError('');
    setSuccess('');
    cargarFundaciones();

    // Autocompletar datos del usuario logeado
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      setForm(prev => ({
        ...prev,
        nombre: user.nombre || '',
        cedula: user.cedula || '',
        correo: user.email || ''
      }));
    }
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setForm({
      nombre: '',
      cedula: '',
      correo: '',
      fecha: '',
      fundacion: '',
      animal: '',
      motivo: ''
    });
    setAnimales([]);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const cargarFundaciones = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/fundaciones');
      if (response.ok) {
        const data = await response.json();
        setFundaciones(data);
      }
    } catch (error) {
      console.error('Error cargando fundaciones:', error);
    }
  };

  const cargarAnimales = async (fundacionId) => {
    if (!fundacionId) {
      setAnimales([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/fundacion/${fundacionId}/animales`);
      if (response.ok) {
        const data = await response.json();
        setAnimales(data);
      }
    } catch (error) {
      console.error('Error cargando animales:', error);
    }
  };

  const handleFundacionChange = (e) => {
    const fundacionId = e.target.value;
    setForm(prev => ({
      ...prev,
      fundacion: fundacionId,
      animal: '' // Resetear animal cuando cambia fundación
    }));
    cargarAnimales(fundacionId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Verificar que el usuario esté autenticado
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      setError('Debes iniciar sesión para adoptar. Serás redirigido al login.');
      setLoading(false);
      setTimeout(() => navigate('/'), 2000);
      return;
    }

    // Validar campos requeridos
    if (!form.fundacion || !form.animal || !form.fecha) {
      setError('Por favor completa todos los campos requeridos.');
      setLoading(false);
      return;
    }

    try {
      const data = {
        usuario_id: user.cedula,
        animal_id: form.animal,
        fundacion_id: form.fundacion,
        fecha: form.fecha
      };

      const response = await fetch('http://localhost:5000/api/solicitar_adopcion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('¡Solicitud de adopción enviada con éxito! La fundación te contactará pronto.');
        // Limpiar formulario después de 3 segundos
        setTimeout(() => {
          handleCloseModal();
        }, 3000);
      } else {
        setError(result.error || 'Error al enviar la solicitud de adopción');
      }
    } catch (err) {
      setError('Error de conexión con el servidor. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adopcion-container">
      {/* Header/Navbar */}
      <header className="adopcion-header">
        <div className="header-content-donaciones">
          <div
            className="logo-titulo-navbar"
            onClick={() => navigate('/index1')}
            style={{ cursor: 'pointer' }}
          >
            <img src={logoSinTexto} alt="Logo" className="logo-navbar" />
            <div className="titulo-container">
              <span className="titulo-navbar-superior">Cuentos Con</span>
              <span className="titulo-navbar-inferior">Patitas</span>
            </div>
          </div>
          <nav className="nav-menu-donaciones">
            <a className="nav-link-animada" href="#">¿Quienes Somos?</a>
            <Link to="/fundaciones" className="nav-link-animada">Fundaciones</Link>
            <Link to="/donaciones" className="nav-link-animada">¿Quieres Ayudar?</Link>
            <a className="nav-link-animada" href="#">Soporte</a>
            <a className="nav-link-animada" href="#">Adopción</a>
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
      <main className="adopcion-main card-margin-top">
        {/* Card con frase motivacional */}
        <div className="adopcion-card">
          <div className="adopcion-card-text frase-anatole">
            "Hasta que no hayas amado a un animal, una parte de tu alma permanecerá dormida"
            <span className="anatole-author">-Anatole France-</span>
          </div>
          <div className="adopcion-card-img">
            {/* <img src={mujerAbrazandoPerro} alt="Mujer abrazando perro" /> */}
          </div>
        </div>

        {/* Botón para abrir formulario */}
        {!showForm && (
          <button onClick={handleOpenModal} className="btn-form-adopcion">
            Formulario de adopción
          </button>
        )}

        {/* Formulario de adopción */}
        {showForm && (
          <form className="form-adopcion-below" onSubmit={handleSubmit}>
            <h2>Formulario de Adopción</h2>
            
            {/* Mensajes de éxito y error */}
            {success && (
              <div className="success-message">
                {success}
              </div>
            )}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <label>Nombre Completo *</label>
            <input 
              name="nombre" 
              value={form.nombre} 
              onChange={handleChange} 
              placeholder="Ej: Juan Pérez" 
              className="input-grande input-left" 
              required 
              readOnly
            />
            
            <label>Cédula *</label>
            <input 
              name="cedula" 
              value={form.cedula} 
              onChange={handleChange} 
              placeholder="Ej: 1234567890" 
              className="input-grande input-left" 
              required 
              readOnly
            />
            
            <label>Correo *</label>
            <input 
              name="correo" 
              value={form.correo} 
              onChange={handleChange} 
              placeholder="Ej: correo@ejemplo.com" 
              className="input-grande input-left" 
              required 
              readOnly
            />
            
            <label>Fecha de solicitud *</label>
            <input 
              name="fecha" 
              value={form.fecha} 
              onChange={handleChange} 
              type="date" 
              className="input-grande input-left" 
              required 
            />
            
            <label>Fundación *</label>
            <select 
              name="fundacion" 
              value={form.fundacion} 
              onChange={handleFundacionChange} 
              className="select-fundacion" 
              required
            >
              <option value="">Selecciona una fundación</option>
              {fundaciones.map(fundacion => (
                <option key={fundacion.fundacion_id} value={fundacion.fundacion_id}>
                  {fundacion.nombre}
                </option>
              ))}
            </select>
            
            <label>Animal *</label>
            <select 
              name="animal" 
              value={form.animal} 
              onChange={handleChange} 
              className="select-fundacion" 
              required
              disabled={!form.fundacion}
              style={{marginBottom: '1.5rem'}}
            >
              <option value="">
                {form.fundacion ? 'Selecciona un animal' : 'Primero selecciona una fundación'}
              </option>
              {animales.map(animal => (
                <option key={animal.animal_id} value={animal.animal_id}>
                  {animal.nombre} - {animal.tipo_animal} ({animal.edad} años)
                </option>
              ))}
            </select>
            
            <div className="form-buttons">
              <button 
                type="submit" 
                className="btn-iniciar-adopcion"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Iniciar adopción'}
              </button>
              <button 
                type="button" 
                onClick={handleCloseModal} 
                className="btn-cancelar-adopcion"
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default AdopcionRegistro;