import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ListaAnimales from './ListaAnimales';
import AnimalFormCard from './AnimalFormCard';
import logoSinTexto from '../assets/img/logosintexto.png';
import './MiFundacion.css';

const COLORS = {
  fondo: '#FFF8F0',
  secundario: '#F4E2D8',
  acento: '#E28F54',
  contraste: '#A8D5BA',
  contrasteOscuro: '#7C6C5F',
  texto: '#4B3A2D',
  textoSec: '#7C6C5F',
};

const MiFundacion = () => {
  const [fundacion, setFundacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editandoFoto, setEditandoFoto] = useState(false);
  const [editandoDescripcion, setEditandoDescripcion] = useState(false);
  const [nuevaFoto, setNuevaFoto] = useState(null);
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');
  const [animales, setAnimales] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [animalForm, setAnimalForm] = useState({
    nombre: '',
    tipo_animal: 'Perro',
    edad: '',
    peso: '',
    condicion: '',
    descripcion: '',
    foto: null,
    genero: 'macho',
    raza: ''
  });
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const fundacionRes = await fetch('http://localhost:5000/api/mi_fundacion', { 
        credentials: 'include',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });
      if (!fundacionRes.ok) throw new Error('No se pudo cargar la fundación');
      const fundacionData = await fundacionRes.json();
      setFundacion(Object.keys(fundacionData).length === 0 ? null : fundacionData);

      if (fundacionData && fundacionData.nit) {
        const cacheBust = `?t=${new Date().getTime()}`;
        const animalesRes = await fetch(`http://localhost:5000/api/animales_de_fundacion${cacheBust}`, { 
          credentials: 'include',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });
        const animalesData = await animalesRes.json();
        setAnimales(animalesData);
      }
      setError(null);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos. Intenta recargar la página.');
      setAnimales([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    fetch('http://localhost:5000/api/crear_fundacion', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          window.location.reload();
        } else {
          setError(resp.error || 'Error al registrar la fundación');
        }
      })
      .catch(() => setError('Error al registrar la fundación'));
  };

  const handleFotoSubmit = (e) => {
    e.preventDefault();
    if (!nuevaFoto) {
      setError('Selecciona una imagen');
      return;
    }
    const formData = new FormData();
    formData.append('foto', nuevaFoto);
    fetch('http://localhost:5000/api/editar_foto_fundacion', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          setEditandoFoto(false);
          setNuevaFoto(null);
          showSuccessMessage('¡Foto de perfil actualizada con éxito!');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          setError(resp.error || 'Error al actualizar la foto');
        }
      })
      .catch(() => setError('Error al actualizar la foto'));
  };

  const handleDescripcionSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/editar_descripcion_fundacion', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ descripcion: nuevaDescripcion })
    })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          setFundacion(prev => ({ ...prev, descripcion: nuevaDescripcion }));
          setEditandoDescripcion(false);
          showSuccessMessage('¡Descripción actualizada con éxito!');
        } else {
          setError(resp.error || 'Error al actualizar la descripción');
        }
      })
      .catch(() => setError('Error al actualizar la descripción'));
  };

  const handleAnimalFormChange = (e) => {
    const { name, value, files } = e.target;
    setAnimalForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleOpenForm = (animal = null) => {
    setEditingAnimal(animal);
    setShowForm(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAnimal(null);
    document.body.style.overflow = 'auto';
  };
  
  const handleSaveAnimal = async (animalData) => {
    const isEditing = editingAnimal && editingAnimal.animal_id;
    const url = isEditing 
      ? `http://localhost:5000/api/editar_animal/${editingAnimal.animal_id}`
      : 'http://localhost:5000/api/agregar_animal';
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(animalData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error al ${isEditing ? 'actualizar' : 'agregar'} el animalito`);
      }

      if (result.success) {
        if (isEditing) {
          const updatedAnimal = { ...editingAnimal, ...animalData };
          setAnimales(prev => prev.map(a => 
            a.animal_id === updatedAnimal.animal_id ? updatedAnimal : a
          ));
        } else {
          setAnimales(prev => [result.animal, ...prev]);
        }
        handleCloseForm();
        showSuccessMessage(result.message || `Animalito ${isEditing ? 'actualizado' : 'agregado'} con éxito!`);
      } else {
        setError(result.error || `Un error ocurrió.`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAnimalDeleted = (deletedAnimalId) => {
    setAnimales(prevAnimales => 
      prevAnimales.filter(animal => animal.animal_id !== deletedAnimalId)
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) return <div style={{ background: COLORS.fondo, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando...</div>;
  if (error) return <div style={{ background: COLORS.fondo, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{error}</div>;

  if (!fundacion) {
    return (
      <div>
        <h2>No tienes una fundación registrada.</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
          <div className="form-group">
            <label>NIT:</label>
            <input type="text" name="nit" required />
          </div>
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" name="nombre" required />
          </div>
          <div className="form-group">
            <label>Dirección:</label>
            <input type="text" name="direccion" required />
          </div>
          <div className="form-group">
            <label>Teléfono:</label>
            <input type="text" name="telefono" required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" required />
          </div>
          <div className="form-group">
            <label>Persona a cargo:</label>
            <input type="text" name="persona_acargo" required />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea 
              name="descripcion" 
              required 
              placeholder="Describe tu fundación, su misión, visión y objetivos..."
              rows="4"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" name="contrasena" required minLength={8} />
          </div>
          <button type="submit" className="submit-btn">Registrar fundación</button>
        </form>
      </div>
    );
  }

  return (
    <div className="fundacion-dashboard">
      {successMessage && <div className="success-toast">{successMessage}</div>}
      <header style={{
        width: '100vw',
        background: '#A7D0F5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0',
        margin: '0',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 1600,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 4vw 0 4vw',
        }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 24, marginLeft: -150, cursor: 'pointer' }}
            onClick={() => navigate('/index1')}
            className="logo-titulo-navbar"
          >
            <img src={logoSinTexto} alt="Logo Cuentos Con Patitas" style={{ width: 130, height: 130, objectFit: 'contain', marginRight: 12 }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
              <span className="titulo-navbar-superior" style={{ color: '#4B3A2D', fontWeight: 'bold', fontSize: '2.3rem', letterSpacing: '2px', fontFamily: '"Edu NSW ACT Hand Pre", cursive' }}>Cuentos Con</span>
              <span className="titulo-navbar-inferior" style={{ color: '#4B3A2D', fontWeight: 'bold', fontSize: '2.7rem', letterSpacing: '2px', fontFamily: '"Edu NSW ACT Hand Pre", cursive', marginTop: 4 }}>Patitas</span>
            </div>
          </div>
          <nav style={{ display: 'flex', gap: 36, alignItems: 'center', position: 'relative' }}>
            <a className="nav-link-animada" href="#" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Eventos</a>
            <a className="nav-link-animada" href="#" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Soporte</a>
            <div className="fundacion-dropdown-container" style={{ position: 'relative', display: 'inline-block' }}>
              <Link className="nav-link-animada" to="/mifundacion" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem', cursor: 'pointer' }}>
                Mi fundación
              </Link>
              <div className="logout-dropdown" style={{
                display: 'none',
                position: 'absolute',
                top: '110%',
                right: 0,
                background: '#fff',
                borderRadius: 10,
                boxShadow: '0 4px 16px #0001',
                padding: '8px 0',
                minWidth: 140,
                zIndex: 100,
                textAlign: 'center',
              }}>
                <button onClick={handleLogout} style={{
                  background: 'none',
                  border: 'none',
                  color: '#E28F54',
                  fontWeight: 'bold',
                  fontSize: '1.08rem',
                  padding: '10px 0',
                  width: '100%',
                  cursor: 'pointer',
                  borderRadius: 8,
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#FFF8F0'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}
                >Cerrar sesión</button>
              </div>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="fundacion-main-content">
        <div className="card-fundacion">
          <div className="fundacion-info-grid">
            <div className="fundacion-details-text">
              <h2>¡Bienvenido, {fundacion.nombre}!</h2>
              
              <div className="details-grid">
                <p><strong><i className="fas fa-id-card"></i> NIT:</strong> {fundacion.nit}</p>
                <p><strong><i className="fas fa-map-marker-alt"></i> Dirección:</strong> {fundacion.direccion}</p>
                <p><strong><i className="fas fa-phone"></i> Teléfono:</strong> {fundacion.telefono}</p>
                <p><strong><i className="fas fa-envelope"></i> Email:</strong> {fundacion.email}</p>
                <p><strong><i className="fas fa-user"></i> A cargo:</strong> {fundacion.persona_acargo}</p>
              </div>

              <div className="fundacion-descripcion">
                <div className="descripcion-header">
                  <h4><i className="fas fa-info-circle"></i> Sobre nosotros</h4>
                  <button onClick={() => setEditandoDescripcion(true)} className="editar-btn-link">
                    <i className="fas fa-pencil-alt"></i> Editar
                  </button>
                </div>
                {editandoDescripcion ? (
                  <form onSubmit={handleDescripcionSubmit} className="descripcion-form">
                    <textarea
                      defaultValue={fundacion.descripcion || ''}
                      onChange={(e) => setNuevaDescripcion(e.target.value)}
                      rows="4"
                      required
                    />
                    <div className="form-actions">
                      <button type="submit" className="btn-guardar">Guardar</button>
                      <button type="button" onClick={() => setEditandoDescripcion(false)} className="btn-cancelar">Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <p className="descripcion-texto">{fundacion.descripcion || 'No hay descripción disponible. ¡Añade una!'}</p>
                )}
              </div>
            </div>

            <div className="fundacion-photo-section">
              <div className="photo-container">
                <img 
                  src={fundacion.foto_url || '/placeholder-fundacion.png'} 
                  alt="Foto fundación" 
                  className="foto-fundacion"
                  onError={(e) => { e.target.src = '/placeholder-fundacion.png'; }}
                />
              </div>
              <button onClick={() => setEditandoFoto(true)} className="editar-foto-btn">
                <i className="fas fa-camera"></i> Cambiar Foto
              </button>
              {editandoFoto && (
                <form onSubmit={handleFotoSubmit} className="foto-form">
                  <input type="file" accept="image/*" onChange={e => setNuevaFoto(e.target.files[0])} required />
                  <div className="foto-buttons">
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={() => { setEditandoFoto(false); setNuevaFoto(null); }}>Cancelar</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="animales-section">
          <div className="animales-header">
            <h3><i className="fas fa-paw"></i> Animalitos Registrados</h3>
            <button onClick={() => handleOpenForm(null)} className="agregar-btn">
              <i className="fas fa-plus"></i> Agregar Animalito
            </button>
          </div>

          <ListaAnimales 
            animales={animales} 
            onEdit={handleOpenForm}
            onAnimalDeleted={handleAnimalDeleted}
          />
        </div>
      </main>

      {showForm && (
        <AnimalFormCard 
          animal={editingAnimal || {}}
          onClose={handleCloseForm}
          onSubmit={handleSaveAnimal}
        />
      )}

      <style>{`
        .nav-link-animada {
          position: relative;
          transition: color 0.2s, filter 0.2s;
        }
        .nav-link-animada::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -3px;
          height: 3px;
          border-radius: 2px;
          background: linear-gradient(90deg, #A7C7E7 0%, #E28F54 100%);
          opacity: 0;
          transform: scaleX(0.7);
          transition: opacity 0.2s, transform 0.2s;
        }
        .nav-link-animada:hover {
          color: #E28F54;
          filter: drop-shadow(0 2px 8px #E28F5444);
        }
        .nav-link-animada:hover::after {
          opacity: 1;
          transform: scaleX(1);
        }
        .logout-dropdown {
          display: none;
        }
        .fundacion-dropdown-container:hover .logout-dropdown,
        .logout-dropdown:hover {
          display: block !important;
        }
        .logout-dropdown button:hover {
          background: #FFF8F0;
        }
        .icon-whatsapp-ajustado {
          transform: scale(1.18);
          display: inline-block;
        }
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .logo-titulo-navbar span {
          position: relative;
          transition: color 0.2s;
        }
        .logo-titulo-navbar:hover .titulo-navbar-superior,
        .logo-titulo-navbar:hover .titulo-navbar-inferior {
          color: #E28F54;
        }
        .logo-titulo-navbar .titulo-navbar-superior::after,
        .logo-titulo-navbar .titulo-navbar-inferior::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -6px;
          height: 5px;
          border-radius: 3px;
          background: linear-gradient(90deg, #E28F54 0%, #A7D0F5 100%);
          opacity: 0;
          transform: scaleX(0.7);
          transition: opacity 0.3s, transform 0.3s;
        }
        .logo-titulo-navbar:hover .titulo-navbar-superior::after,
        .logo-titulo-navbar:hover .titulo-navbar-inferior::after {
          opacity: 1;
          transform: scaleX(1);
        }
        .success-toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: linear-gradient(90deg, #86E3CE 0%, #A8D5BA 100%);
          color: #4B3A2D;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          z-index: 2000;
          font-size: 1.1rem;
          font-weight: bold;
          box-shadow: 0 5px 15px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: slideInToast 0.4s forwards, fadeOutToast 0.4s 2.6s forwards;
        }
        .success-toast::before {
          content: '✔';
          font-size: 1.2rem;
        }
        @keyframes slideInToast {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOutToast {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default MiFundacion; 