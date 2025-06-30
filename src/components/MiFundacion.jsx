import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ListaAnimales from './ListaAnimales';
import AnimalFormCard from './AnimalFormCard';
import EditarFundacionCard from './EditarFundacionCard';
import ConfirmacionModal from './ConfirmacionModal';
import logoSinTexto from '../assets/img/logosintexto.png';
import './MiFundacion.css';
import { FaPlus, FaSignOutAlt, FaEdit, FaCamera, FaSave, FaTrash, FaUserFriends, FaRegSmileBeam, FaRegCalendarAlt, FaMoneyBillWave, FaRegCommentDots, FaUserCircle } from 'react-icons/fa';

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
  const [descripcion, setDescripcion] = useState('');
  const [animales, setAnimales] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [fundacionImageError, setFundacionImageError] = useState(false);
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshAnimales, setRefreshAnimales] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDonantes, setShowDonantes] = useState(false);
  const [donantes, setDonantes] = useState([]);
  const [loadingDonantes, setLoadingDonantes] = useState(false);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

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
  }, [navigate]);

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
          setFundacionImageError(false);
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
      body: JSON.stringify({ descripcion: descripcion })
    })
      .then(res => res.json())
      .then(resp => {
        if (resp.success) {
          setFundacion(prev => ({ ...prev, descripcion: descripcion }));
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
        credentials: 'include',
        body: animalData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error al ${isEditing ? 'actualizar' : 'agregar'} el animalito`);
      }

      if (result.success) {
        if (isEditing) {
          setAnimales(prev => prev.map(a => 
            a.animal_id === result.animal.animal_id ? result.animal : a
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

  const handleImageError = () => {
    setFundacionImageError(true);
  };

  const handleUpdateFundacion = (updatedFundacion) => {
    setFundacion(updatedFundacion);
    setDescripcion(updatedFundacion.descripcion || '');
    showSuccessMessage('¡Los datos de tu fundación se han actualizado!');
  };

  const handleDeleteRequest = () => {
    setShowConfirmationModal(true);
  };

  const handleDeleteFundacion = async () => {
    setShowConfirmationModal(false);
    try {
      const response = await fetch('http://localhost:5000/api/eliminar_fundacion', {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        alert('Tu fundación ha sido eliminada. ¡Gracias por haber sido parte de Cuentos Con Patitas!');
        handleLogout();
      } else {
        setError(data.error || 'No se pudo eliminar la fundación.');
      }
    } catch (err) {
      setError('Error de conexión al intentar eliminar la fundación.');
    }
  };

  const handleOpenDonantes = async () => {
    setShowDonantes(true);
    setLoadingDonantes(true);
    try {
      const res = await fetch('http://localhost:5000/api/donantes_fundacion', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setDonantes(data.donantes);
      } else {
        setDonantes([]);
      }
    } catch {
      setDonantes([]);
    } finally {
      setLoadingDonantes(false);
    }
  };

  const FundacionImagePlaceholder = () => (
    <div className="fundacion-image-placeholder">
      <i className="fas fa-home"></i>
      <span>Foto no disponible</span>
    </div>
  );

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
      <header style={{
        width: '100vw',
        background: '#A7D0F5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0',
        margin: '0',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000
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
            <Link to="/eventos" className="nav-link-animada" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Eventos</Link>
            <Link to="/AdopcionFundacion" className="nav-link-animada" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Adopciones</Link>
            <a className="nav-link-animada" href="#" style={{ color: '#4B3A2D', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem' }}>Soporte</a>
            <div className="fundacion-dropdown-container" style={{ position: 'relative', display: 'inline-block' }}>
              <Link className="nav-link-animada" to="/mifundacion" style={{ color: '#E28F54', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.35rem', cursor: 'pointer' }}>
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

      <div style={{ paddingTop: '150px' }}>
        {successMessage && (
          <div className="success-toast">
            <i className="fas fa-check-circle"></i> {successMessage}
          </div>
        )}
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

                {(fundacion.banco || fundacion.numero_cuenta || fundacion.titular_cuenta) && (
                  <div className="fundacion-bancaria">
                    <div className="bancaria-header">
                      <h4><i className="fas fa-university"></i> Información Bancaria</h4>
                      <span className="bancaria-badge">Para donaciones</span>
                    </div>
                    <div className="bancaria-details">
                      {fundacion.banco && (
                        <p><strong><i className="fas fa-building"></i> Banco:</strong> {fundacion.banco}</p>
                      )}
                      {fundacion.tipo_cuenta && (
                        <p><strong><i className="fas fa-credit-card"></i> Tipo de cuenta:</strong> {fundacion.tipo_cuenta}</p>
                      )}
                      {fundacion.numero_cuenta && (
                        <p><strong><i className="fas fa-hashtag"></i> Número de cuenta:</strong> {fundacion.numero_cuenta}</p>
                      )}
                      {fundacion.titular_cuenta && (
                        <p><strong><i className="fas fa-user-tie"></i> Titular:</strong> {fundacion.titular_cuenta}</p>
                      )}
                      {fundacion.telefono_contacto && (
                        <p><strong><i className="fas fa-mobile-alt"></i> Teléfono Nequi:</strong> {fundacion.telefono_contacto}</p>
                      )}
                    </div>
                  </div>
                )}

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
                        onChange={(e) => setDescripcion(e.target.value)}
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

                <button onClick={handleOpenDonantes} className="ver-donantes-btn pastel-menta">
                  <FaUserFriends style={{ marginRight: 8, fontSize: 22, verticalAlign: 'middle' }} /> Ver donantes
                </button>
              </div>

              <div className="fundacion-photo-section">
                <div className="photo-container">
                  {!fundacionImageError && fundacion.foto_url ? (
                    <img 
                      src={fundacion.foto_url} 
                      alt="Foto fundación" 
                      className="foto-fundacion"
                      onError={handleImageError}
                    />
                  ) : (
                    <FundacionImagePlaceholder />
                  )}
                </div>
                <button onClick={() => setEditandoFoto(true)} className="editar-foto-btn">
                  <i className="fas fa-camera"></i> Cambiar Foto
                </button>
                <button onClick={() => setShowEditModal(true)} className="editar-datos-btn">
                  <i className="fas fa-edit"></i> Editar Datos
                </button>
                <button onClick={handleDeleteRequest} className="eliminar-fundacion-btn">
                  <i className="fas fa-trash"></i> Eliminar Fundación
                </button>
                {editandoFoto && (
                  <form onSubmit={handleFotoSubmit} className="foto-form">
                    <input type="file" accept="image/*" onChange={e => setNuevaFoto(e.target.files[0])} required ref={fileInputRef} />
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

        {showEditModal && (
          <EditarFundacionCard
            fundacion={fundacion}
            onClose={() => setShowEditModal(false)}
            onUpdate={handleUpdateFundacion}
          />
        )}

        {showConfirmationModal && (
          <ConfirmacionModal
            isOpen={showConfirmationModal}
            onClose={() => setShowConfirmationModal(false)}
            onConfirm={handleDeleteFundacion}
            title="¿Estás seguro?"
            message="Esta acción eliminará permanentemente tu fundación y todos los animales asociados. Esta acción no se puede deshacer."
          />
        )}

        {showDonantes && (
          <DonantesModal
            isOpen={showDonantes}
            onClose={() => setShowDonantes(false)}
            donantes={donantes}
            loading={loadingDonantes}
          />
        )}
      </div>

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
        .ver-donantes-btn.pastel-menta {
          background: #c6f7e2;
          color: #22796b;
          border: none;
          border-radius: 16px;
          font-weight: bold;
          font-size: 1.13rem;
          padding: 12px 28px;
          box-shadow: 0 2px 12px #a7d0f544;
          margin-top: 12px;
          margin-bottom: 0;
          width: 100%;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ver-donantes-btn.pastel-menta:hover {
          background: #a8e6cf;
          color: #4B3A2D;
          box-shadow: 0 6px 24px #a7d0f544;
        }
      `}</style>
    </div>
  );
};

const DonantesModal = ({ isOpen, onClose, donantes, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-donantes-bg">
      <div className="modal-donantes-cute modal-donantes-amplio">
        <button className="close-donantes-btn" onClick={onClose}>&times;</button>
        <h2 className="donantes-title"><FaUserFriends style={{ color: '#E28F54', marginRight: 8 }} /> Donantes</h2>
        {loading ? (
          <div style={{ textAlign: 'center', margin: '2rem 0' }}><FaRegSmileBeam size={36} color="#E28F54" /> Cargando donantes...</div>
        ) : donantes.length === 0 ? (
          <div className="donantes-vacio">
            <FaRegSmileBeam size={60} color="#E28F54" style={{ marginBottom: 12 }} />
            <p style={{ color: '#E28F54', fontWeight: 'bold', fontSize: '1.2rem', marginTop: 16 }}>¡Aún no tienes donaciones!<br/>Cuando recibas una, aparecerán aquí 🐾</p>
          </div>
        ) : (
          <div className="donantes-lista">
            {donantes.map((d, idx) => (
              <div className="donante-card-cute" key={d.donacion_id || idx}>
                <div className="donante-card-header">
                  {d.usuariofoto_url ? (
                    <img src={d.usuariofoto_url} alt={d.nombre || 'Donante'} className="donante-foto" />
                  ) : (
                    <FaUserCircle size={48} color="#A7D0F5" style={{ marginRight: 10 }} />
                  )}
                  <div className="donante-nombre">{d.nombre || 'Donante anónimo'}</div>
                  <div className="donante-tipo">
                    <FaRegCommentDots style={{ color: '#E28F54', marginRight: 4 }} /> {d.Tipo_Donacion}
                  </div>
                </div>
                <div className="donante-card-body">
                  {d.monto && (
                    <div className="donante-monto"><FaMoneyBillWave style={{ color: '#E28F54', marginRight: 4 }} /> <span style={{ color: '#E28F54', fontWeight: 'bold' }}>{`$${d.monto} ${d.moneda || 'COP'}`}</span></div>
                  )}
                  <div className="donante-fecha"><FaRegCalendarAlt style={{ color: '#A7D0F5', marginRight: 4 }} /> {d.fecha_donacion ? new Date(d.fecha_donacion).toLocaleDateString() : ''}</div>
                  <div className="donante-descripcion">{d.Descripcion}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .modal-donantes-bg {
          position: fixed; left: 0; top: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.25); z-index: 9999;
          display: flex; align-items: center; justify-content: center;
        }
        .modal-donantes-cute {
          background: #FFF8F0;
          border-radius: 24px;
          padding: 56px 28px 28px 28px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
          min-width: 340px; max-width: 95vw; max-height: 80vh; overflow-y: auto;
          position: relative;
          animation: popIn 0.4s;
        }
        .modal-donantes-amplio {
          min-width: 520px;
          max-width: 700px;
        }
        .close-donantes-btn {
          position: absolute; top: 20px; right: 28px;
          font-size: 2rem; color: #e28f54; cursor: pointer; font-weight: bold;
          background: rgba(255,255,255,0.95); border: none;
          z-index: 10;
          padding: 2px 10px;
          border-radius: 50%;
          box-shadow: 0 2px 8px #E28F5444;
          transition: background 0.2s, box-shadow 0.2s;
        }
        .close-donantes-btn:hover {
          background: #fbe2cf;
        }
        .donantes-title {
          text-align: center; color: #E28F54; font-size: 2.1rem; font-family: 'Edu NSW ACT Hand Pre', cursive; margin-bottom: 18px; margin-top: 10px;
        }
        .donantes-vacio { text-align: center; margin-top: 24px; }
        .donantes-lista { display: flex; flex-direction: column; gap: 18px; }
        .donante-card-cute {
          background: #fff; border-radius: 16px; box-shadow: 0 2px 12px #E28F5444;
          padding: 18px 20px; display: flex; flex-direction: column; gap: 6px;
          border: 2px solid #FBE2CF;
          transition: box-shadow 0.2s, border 0.2s;
        }
        .donante-card-cute:hover {
          box-shadow: 0 6px 24px #E28F5444;
          border: 2px solid #E28F54;
        }
        .donante-card-header {
          display: flex; align-items: center; gap: 12px; margin-bottom: 4px;
        }
        .donante-foto {
          width: 48px; height: 48px; border-radius: 50%; object-fit: cover; margin-right: 10px; border: 2px solid #A7D0F5;
        }
        .donante-nombre { color: #4B3A2D; font-weight: bold; font-size: 1.1rem; }
        .donante-tipo { color: #A7D0F5; font-size: 1rem; margin-left: auto; display: flex; align-items: center; }
        .donante-monto { color: #E28F54; font-size: 1.1rem; font-weight: bold; display: flex; align-items: center; }
        .donante-fecha { color: #7C6C5F; font-size: 0.98rem; display: flex; align-items: center; }
        .donante-descripcion { color: #4B3A2D; font-size: 1.05rem; margin-top: 2px; }
        .ver-donantes-btn.pastel-lila {
          background: #e6d6f7;
          color: #6d4c9c;
          border: none;
          border-radius: 16px;
          font-weight: bold;
          font-size: 1.13rem;
          padding: 12px 28px;
          box-shadow: 0 2px 12px #a7d0f544;
          margin-top: 0;
          margin-bottom: 0;
          transition: background 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .ver-donantes-btn.pastel-lila:hover {
          background: #d1b3f7;
          color: #4B3A2D;
          box-shadow: 0 6px 24px #a7d0f544;
        }
        @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default MiFundacion; 