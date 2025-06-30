import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './DetalleFundacion.css';
import './AdopcionRegistro.css';

const COLORS = {
  fondo: '#FFF8F0', // Marfil suave
  secundario: '#F4E2D8', // Beige claro
  acento: '#E28F54', // Naranja zanahoria
  contraste: '#A8D5BA', // Verde agua pastel
  contrasteOscuro: '#7C6C5F', // Marrón claro/beige oscuro
  texto: '#4B3A2D', // Marrón oscuro cálido
  textoSec: '#7C6C5F', // Marrón claro/beige oscuro
};

// Estilos constantes para evitar recreaciones
const styles = {
  animalCard: {
    background: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    height: '300px',
    position: 'relative',
    transition: 'all 0.3s ease'
  },
  animalImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '16px'
  },
  animalInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    padding: '1.5rem 1rem 1rem',
    color: '#fff'
  },
  animalName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  },
  animalDetails: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.9rem',
    opacity: 0.9
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    opacity: 0,
    animation: 'fadeIn 0.3s ease forwards'
  },
  modalContent: {
    background: '#fff',
    borderRadius: '20px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
    transform: 'translateY(20px)',
    animation: 'slideUp 0.3s ease forwards'
  }
};

const DetalleFundacion = () => {
  const { fundacion_id } = useParams();
  const [fundacion, setFundacion] = useState(null);
  const [animales, setAnimales] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fundacionImageError, setFundacionImageError] = useState(false);
  const [animalImageErrors, setAnimalImageErrors] = useState({});
  const [showAdopcionModal, setShowAdopcionModal] = useState(false);
  const [showAdopcionForm, setShowAdopcionForm] = useState(false);
  const [adopcionForm, setAdopcionForm] = useState({
    nombre: '',
    cedula: '',
    correo: '',
    fecha: '',
    fundacion: fundacion_id || '',
    animal: '',
    motivo: ''
  });
  const [adopcionLoading, setAdopcionLoading] = useState(false);
  const [adopcionError, setAdopcionError] = useState('');
  const [adopcionSuccess, setAdopcionSuccess] = useState('');

  useEffect(() => {
    const fetchFundacionDetails = async () => {
      try {
        // Obtener detalles de la fundación
        const fundacionResponse = await fetch('http://localhost:5000/api/fundaciones');
        if (!fundacionResponse.ok) throw new Error('Error al cargar la fundación');
        const fundaciones = await fundacionResponse.json();
        const fundacionData = fundaciones.find(f => f.fundacion_id === parseInt(fundacion_id));
        if (!fundacionData) throw new Error('Fundación no encontrada');
        setFundacion(fundacionData);

        // Obtener animales de la fundación
        const animalesResponse = await fetch(`http://localhost:5000/api/fundacion/${fundacion_id}/animales`);
        if (!animalesResponse.ok) throw new Error('Error al cargar los animales');
        const animalesData = await animalesResponse.json();
        setAnimales(animalesData);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      }
    };

    if (fundacion_id) {
      fetchFundacionDetails();
    }
  }, [fundacion_id]);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const handleAnimalClick = useCallback((animal) => {
    setSelectedAnimal(animal);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedAnimal(null);
  }, []);

  const handleFundacionImageError = useCallback(() => {
    setFundacionImageError(true);
  }, []);

  const handleAnimalImageError = useCallback((animalId) => {
    setAnimalImageErrors(prev => ({
      ...prev,
      [animalId]: true
    }));
  }, []);

  const handleOpenAdopcionModal = (animal) => {
    setShowAdopcionForm(true);
    setAdopcionError('');
    setAdopcionSuccess('');
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      const user = JSON.parse(userRaw);
      setAdopcionForm(prev => ({
        ...prev,
        nombre: user.nombre || '',
        cedula: user.cedula || '',
        correo: user.email || '',
        animal: animal.animal_id,
        fundacion: fundacion_id || '',
        fecha: ''
      }));
    } else {
      setAdopcionForm(prev => ({ ...prev, nombre: '', cedula: '', correo: '', animal: animal.animal_id, fundacion: fundacion_id || '', fecha: '' }));
    }
  };

  const handleCloseAdopcionForm = () => {
    setShowAdopcionForm(false);
    setAdopcionError('');
    setAdopcionSuccess('');
  };

  const handleAdopcionChange = (e) => {
    const { name, value } = e.target;
    setAdopcionForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdopcionSubmit = async (e) => {
    e.preventDefault();
    setAdopcionLoading(true);
    setAdopcionError('');
    setAdopcionSuccess('');
    const userRaw = localStorage.getItem('user');
    if (!userRaw) {
      setAdopcionError('Debes iniciar sesión para adoptar. Serás redirigido al login.');
      setAdopcionLoading(false);
      setTimeout(() => window.location.href = '/', 2000);
      return;
    }
    if (!adopcionForm.fundacion || !adopcionForm.animal || !adopcionForm.fecha) {
      setAdopcionError('Por favor completa todos los campos requeridos.');
      setAdopcionLoading(false);
      return;
    }
    try {
      const data = {
        usuario_id: JSON.parse(userRaw).cedula,
        animal_id: adopcionForm.animal,
        fundacion_id: adopcionForm.fundacion,
        fecha: adopcionForm.fecha
      };
      console.log('Enviando solicitud de adopción:', data);
      const response = await fetch('http://localhost:5000/api/solicitar_adopcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        setAdopcionSuccess('¡Solicitud de adopción enviada con éxito! La fundación te contactará pronto.');
        setTimeout(() => handleCloseAdopcionForm(), 3000);
      } else {
        setAdopcionError(result.error || 'Error al enviar la solicitud de adopción');
      }
    } catch (err) {
      setAdopcionError('Error de conexión con el servidor. Intenta nuevamente.');
    } finally {
      setAdopcionLoading(false);
    }
  };

  const FundacionImagePlaceholder = () => (
    <div style={{
      width: '100%',
      height: '100%',
      background: `linear-gradient(135deg, ${COLORS.secundario}, ${COLORS.fondo})`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: COLORS.textoSec,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <i className="fas fa-home" style={{ 
        fontSize: '3rem', 
        color: COLORS.acento,
        marginBottom: '0.5rem',
        zIndex: 1,
        position: 'relative'
      }}></i>
      <span style={{
        fontSize: '0.9rem',
        fontWeight: 500,
        zIndex: 1,
        position: 'relative',
        textAlign: 'center',
        lineHeight: '1.2'
      }}>Foto no disponible</span>
    </div>
  );

  const AnimalImagePlaceholder = ({ animal }) => (
    <div style={{
      width: '100%',
      height: '100%',
      background: `linear-gradient(135deg, ${COLORS.secundario}, ${COLORS.fondo})`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: COLORS.textoSec,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <i className="fas fa-paw" style={{ 
        fontSize: '3rem', 
        color: COLORS.acento,
        marginBottom: '0.5rem',
        zIndex: 1,
        position: 'relative'
      }}></i>
      <span style={{
        fontSize: '0.9rem',
        fontWeight: 500,
        zIndex: 1,
        position: 'relative',
        textAlign: 'center',
        lineHeight: '1.2'
      }}>Foto no disponible</span>
    </div>
  );

  // Componente Modal optimizado
  const AnimalModal = useMemo(() => {
    if (!selectedAnimal || !showModal) return null;

    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          {/* Botón de cerrar */}
          <button
            onClick={handleCloseModal}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 1,
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <i className="fas fa-times" style={{ color: COLORS.texto }}></i>
          </button>

          {/* Imagen y nombre del animal siempre arriba */}
          <div style={{
            height: '300px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '20px 20px 0 0'
          }}>
            {!animalImageErrors[selectedAnimal.animal_id] && selectedAnimal.fotoanimal_url ? (
              <img
                src={selectedAnimal.fotoanimal_url}
                alt={selectedAnimal.nombre}
                style={styles.animalImage}
                onError={() => handleAnimalImageError(selectedAnimal.animal_id)}
              />
            ) : (
              <AnimalImagePlaceholder animal={selectedAnimal} />
            )}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              padding: '2rem 1.5rem 1.5rem',
              color: '#fff'
            }}>
              <h2 style={styles.animalName}>{selectedAnimal.nombre}</h2>
            </div>
          </div>

          {/* Separador visual */}
          <div style={{
            width: '100%',
            height: '8px',
            background: `linear-gradient(90deg, ${COLORS.fondo} 0%, ${COLORS.acento} 50%, ${COLORS.fondo} 100%)`,
            margin: '0',
            border: 'none',
            opacity: 0.18
          }} />

          {/* Contenido del modal: detalles o formulario */}
          <div style={{ padding: '2rem', animation: 'modalFadeIn 0.4s' }}>
            {!showAdopcionForm ? (
              <>
                {/* Grid de información básica */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  background: COLORS.fondo,
                  borderRadius: '15px',
                  boxShadow: '0 2px 12px #e28f5422'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <i className="fas fa-paw" style={{ fontSize: '1.5rem', color: COLORS.acento, marginBottom: '0.5rem' }}></i>
                    <h4 style={{ margin: '0.5rem 0', color: COLORS.texto }}>Tipo</h4>
                    <p style={{ margin: 0, color: COLORS.textoSec }}>{selectedAnimal.tipo_animal ? selectedAnimal.tipo_animal.charAt(0).toUpperCase() + selectedAnimal.tipo_animal.slice(1) : 'No especificado'}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <i className="fas fa-venus-mars" style={{ fontSize: '1.5rem', color: COLORS.acento, marginBottom: '0.5rem' }}></i>
                    <h4 style={{ margin: '0.5rem 0', color: COLORS.texto }}>Género</h4>
                    <p style={{ margin: 0, color: COLORS.textoSec }}>{selectedAnimal.genero ? selectedAnimal.genero.charAt(0).toUpperCase() + selectedAnimal.genero.slice(1) : 'No especificado'}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <i className="fas fa-birthday-cake" style={{ fontSize: '1.5rem', color: COLORS.acento, marginBottom: '0.5rem' }}></i>
                    <h4 style={{ margin: '0.5rem 0', color: COLORS.texto }}>Edad</h4>
                    <p style={{ margin: 0, color: COLORS.textoSec }}>{selectedAnimal.edad} {selectedAnimal.edad === 1 ? 'año' : 'años'}</p>
                  </div>
                  {selectedAnimal.raza && (
                    <div style={{ textAlign: 'center' }}>
                      <i className="fas fa-dog" style={{ fontSize: '1.5rem', color: COLORS.acento, marginBottom: '0.5rem' }}></i>
                      <h4 style={{ margin: '0.5rem 0', color: COLORS.texto }}>Raza</h4>
                      <p style={{ margin: 0, color: COLORS.textoSec }}>{selectedAnimal.raza}</p>
                    </div>
                  )}
                </div>

                {/* Descripción y condición */}
                {(selectedAnimal.descripcion || selectedAnimal.condicion) && (
                  <div style={{
                    borderTop: `2px solid ${COLORS.secundario}`,
                    paddingTop: '1.5rem',
                    marginTop: '1.5rem'
                  }}>
                    {selectedAnimal.descripcion && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ color: COLORS.texto, marginBottom: '0.8rem' }}>Descripción</h3>
                        <p style={{ color: COLORS.textoSec, lineHeight: '1.6', margin: 0 }}>{selectedAnimal.descripcion}</p>
                      </div>
                    )}
                    {selectedAnimal.condicion && (
                      <div>
                        <h3 style={{ color: COLORS.texto, marginBottom: '0.8rem' }}>Condición</h3>
                        <p style={{ color: COLORS.textoSec, lineHeight: '1.6', margin: 0 }}>{selectedAnimal.condicion}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Fecha de ingreso */}
                <div style={{
                  marginTop: '2rem',
                  padding: '1rem',
                  background: COLORS.fondo,
                  borderRadius: '10px',
                  textAlign: 'center',
                  color: COLORS.textoSec,
                  fontSize: '0.9rem',
                  boxShadow: '0 1px 6px #e28f5411'
                }}>
                  <i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: COLORS.acento }}></i>
                  Ingresó el {formatDate(selectedAnimal.fecha_ingreso)}
                </div>

                {/* Botón de adoptar */}
                <button
                  style={{
                    width: '100%',
                    background: COLORS.acento,
                    color: '#fff',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '12px',
                    fontSize: '1.18rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '1.5rem',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 16px rgba(226,143,84,0.18)',
                    letterSpacing: '0.5px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(226,143,84,0.22)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(226,143,84,0.18)';
                  }}
                  onClick={() => handleOpenAdopcionModal(selectedAnimal)}
                >
                  Adoptar a {selectedAnimal.nombre}
                </button>
              </>
            ) : (
              <>
                <form className="form-adopcion-below" onSubmit={handleAdopcionSubmit} style={{
                  marginTop: 0,
                  background: 'linear-gradient(135deg, #fff8f0 60%, #f4e2d8 100%)',
                  borderRadius: '32px',
                  boxShadow: '0 12px 48px #e28f5440, 0 1.5px 0 #fff inset',
                  padding: '2.5rem 2.5rem 2.5rem 2.5rem',
                  maxWidth: '430px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'modalFadeIn 0.5s',
                  minHeight: '420px',
                  position: 'relative',
                }}>
                  <h2 style={{
                    color: COLORS.acento,
                    fontSize: '2rem',
                    fontFamily: 'Edu NSW ACT Hand Pre, cursive',
                    textAlign: 'center',
                    marginBottom: '2rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px',
                    textShadow: '0 2px 8px #e28f5422'
                  }}>Formulario de Adopción</h2>
                  {adopcionSuccess && (
                    <div className="success-message">{adopcionSuccess}</div>
                  )}
                  {adopcionError && (
                    <div className="error-message">{adopcionError}</div>
                  )}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.3rem' }}>
                    {/* Nombre completo */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{
                        color: COLORS.texto,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        textAlign: 'left',
                        letterSpacing: '0.2px',
                        margin: 0
                      }}>Nombre Completo *</label>
                      <input
                        name="nombre"
                        value={adopcionForm.nombre}
                        onChange={handleAdopcionChange}
                        placeholder="Ej: Juan Pérez"
                        className="input-grande input-left"
                        required
                        readOnly
                        style={{
                          background: COLORS.fondo,
                          border: `2px solid ${COLORS.secundario}`,
                          borderRadius: '16px',
                          fontSize: '1.08rem',
                          color: COLORS.textoSec,
                          padding: '1rem 1.2rem',
                          width: '100%',
                          boxShadow: '0 1px 4px #e28f5411',
                        }}
                      />
                    </div>
                    {/* Cédula */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{
                        color: COLORS.texto,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        textAlign: 'left',
                        letterSpacing: '0.2px',
                        margin: 0
                      }}>Cédula *</label>
                      <input
                        name="cedula"
                        value={adopcionForm.cedula}
                        onChange={handleAdopcionChange}
                        placeholder="Ej: 1234567890"
                        className="input-grande input-left"
                        required
                        readOnly
                        style={{
                          background: COLORS.fondo,
                          border: `2px solid ${COLORS.secundario}`,
                          borderRadius: '16px',
                          fontSize: '1.08rem',
                          color: COLORS.textoSec,
                          padding: '1rem 1.2rem',
                          width: '100%',
                          boxShadow: '0 1px 4px #e28f5411',
                        }}
                      />
                    </div>
                    {/* Correo */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{
                        color: COLORS.texto,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        textAlign: 'left',
                        letterSpacing: '0.2px',
                        margin: 0
                      }}>Correo *</label>
                      <input
                        name="correo"
                        value={adopcionForm.correo}
                        onChange={handleAdopcionChange}
                        placeholder="Ej: correo@ejemplo.com"
                        className="input-grande input-left"
                        required
                        readOnly
                        style={{
                          background: COLORS.fondo,
                          border: `2px solid ${COLORS.secundario}`,
                          borderRadius: '16px',
                          fontSize: '1.08rem',
                          color: COLORS.textoSec,
                          padding: '1rem 1.2rem',
                          width: '100%',
                          boxShadow: '0 1px 4px #e28f5411',
                        }}
                      />
                    </div>
                    {/* Fecha de solicitud */}
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{
                        color: COLORS.texto,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        textAlign: 'left',
                        letterSpacing: '0.2px',
                        margin: 0
                      }}>Fecha de solicitud *</label>
                      <input
                        name="fecha"
                        value={adopcionForm.fecha}
                        onChange={handleAdopcionChange}
                        type="date"
                        className="input-grande input-left"
                        required
                        style={{
                          background: COLORS.fondo,
                          border: `2px solid ${COLORS.secundario}`,
                          borderRadius: '16px',
                          fontSize: '1.08rem',
                          color: COLORS.textoSec,
                          padding: '1rem 1.2rem',
                          width: '100%',
                          boxShadow: '0 1px 4px #e28f5411',
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-buttons" style={{ marginTop: '2.5rem', gap: '1.5rem', justifyContent: 'center', display: 'flex', width: '100%' }}>
                    <button
                      type="submit"
                      className="btn-iniciar-adopcion"
                      disabled={adopcionLoading}
                      style={{
                        background: COLORS.acento,
                        color: '#fff',
                        border: 'none',
                        padding: '1rem 0',
                        borderRadius: '14px',
                        fontSize: '1.13rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(226,143,84,0.18)',
                        letterSpacing: '0.5px',
                        transition: 'all 0.2s',
                        width: '50%'
                      }}
                    >
                      {adopcionLoading ? 'Enviando...' : 'Iniciar adopción'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseAdopcionForm}
                      className="btn-cancelar-adopcion"
                      disabled={adopcionLoading}
                      style={{
                        background: COLORS.fondo,
                        color: COLORS.acento,
                        border: `2px solid ${COLORS.acento}`,
                        padding: '1rem 0',
                        borderRadius: '14px',
                        fontSize: '1.13rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px #e28f5411',
                        width: '50%',
                        transition: 'all 0.2s'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                  <style>{`
                    @keyframes modalFadeIn {
                      from { opacity: 0; transform: translateY(40px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `}</style>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }, [selectedAnimal, showModal, showAdopcionForm, formatDate, handleOpenAdopcionModal, handleAdopcionSubmit, adopcionForm, adopcionLoading, adopcionSuccess, adopcionError, animalImageErrors, handleAnimalImageError, COLORS, AnimalImagePlaceholder, handleCloseModal, handleCloseAdopcionForm, handleAdopcionChange]);

  if (error) return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.fondo,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <i className="fas fa-exclamation-circle" style={{
        fontSize: '3rem',
        color: COLORS.acento,
        marginBottom: '1rem'
      }}></i>
      <h2 style={{
        color: COLORS.texto,
        marginBottom: '1rem'
      }}>Ups, algo salió mal</h2>
      <p style={{
        color: COLORS.textoSec,
        maxWidth: '600px'
      }}>{error}</p>
    </div>
  );

  if (!fundacion) return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.fondo,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        color: COLORS.texto,
        fontSize: '1.2rem'
      }}>Cargando...</div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh',
      background: COLORS.fondo,
      fontFamily: '"Edu NSW ACT Hand Pre", cursive'
    }}>
      <Navbar />
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px' 
      }}>
        {/* Tarjeta principal de la fundación */}
        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'flex-start',
          background: '#fff',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: '900px',
          margin: '0 auto 3rem auto',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Imagen circular */}
          <div style={{
            flexShrink: 0,
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `4px solid ${COLORS.acento}`,
            boxShadow: '0 4px 12px rgba(226,143,84,0.2)'
          }}>
            {!fundacionImageError && fundacion.foto_url ? (
              <img
                src={fundacion.foto_url}
                alt={fundacion.nombre}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={handleFundacionImageError}
              />
            ) : (
              <FundacionImagePlaceholder />
            )}
          </div>

          {/* Información de la fundación */}
          <div style={{ flex: 1 }}>
            <h1 style={{
              color: COLORS.texto,
              fontSize: '2.5rem',
              marginTop: 0,
              marginBottom: '1rem',
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}>{fundacion.nombre}</h1>

            <div style={{ 
              color: COLORS.textoSec, 
              fontSize: '1.1rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.8rem'
            }}>
              <p style={{ 
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-map-marker-alt" style={{ color: COLORS.acento, fontSize: '1rem' }}></i>
                {fundacion.direccion}
              </p>
              <p style={{ 
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-phone" style={{ color: COLORS.acento, fontSize: '1rem' }}></i>
                {fundacion.telefono}
              </p>
              <p style={{ 
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-envelope" style={{ color: COLORS.acento, fontSize: '1rem' }}></i>
                {fundacion.email}
              </p>
              <p style={{ 
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-user" style={{ color: COLORS.acento, fontSize: '1rem' }}></i>
                {fundacion.persona_acargo}
              </p>
            </div>

            {fundacion.descripcion && (
              <div style={{ 
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: `2px solid ${COLORS.secundario}`
              }}>
                <h3 style={{ 
                  color: COLORS.texto,
                  marginBottom: '0.8rem',
                  fontSize: '1.3rem',
                  fontWeight: 'bold'
                }}>Sobre nosotros</h3>
                <p style={{ 
                  color: COLORS.textoSec,
                  lineHeight: '1.6',
                  margin: 0
                }}>{fundacion.descripcion}</p>
              </div>
            )}
          </div>
        </div>

        {/* Separador decorativo */}
        <div style={{
          width: '100%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${COLORS.acento}44, transparent)`,
          margin: '2rem auto',
          maxWidth: '600px'
        }} />

        {/* Sección de animales */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            color: COLORS.texto, 
            fontSize: '2.5rem',
            textAlign: 'center',
            marginBottom: '2rem',
            fontWeight: 'bold',
            position: 'relative',
            display: 'inline-block',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            Nuestros Animalitos
            <span style={{
              content: '""',
              position: 'absolute',
              bottom: '-10px',
              left: '0',
              right: '0',
              height: '4px',
              background: `linear-gradient(90deg, ${COLORS.acento}22, ${COLORS.acento}, ${COLORS.acento}22)`,
              borderRadius: '2px'
            }}></span>
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            padding: '1rem'
          }}>
            {animales.length > 0 ? (
              animales.map((animal, index) => (
                <div 
                  key={animal.animal_id} 
                  onClick={() => handleAnimalClick(animal)}
                  style={{
                    ...styles.animalCard,
                    animation: `fadeIn 0.5s ease forwards ${index * 0.1}s`,
                    opacity: 0,
                    transform: 'translateY(20px)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  {!animalImageErrors[animal.animal_id] && animal.fotoanimal_url ? (
                    <img
                      src={animal.fotoanimal_url}
                      alt={animal.nombre}
                      style={styles.animalImage}
                      onError={() => handleAnimalImageError(animal.animal_id)}
                    />
                  ) : (
                    <AnimalImagePlaceholder animal={animal} />
                  )}
                  <div style={styles.animalInfo}>
                    <h3 style={styles.animalName}>{animal.nombre}</h3>
                    <div style={styles.animalDetails}>
                      <span>
                        <i className="fas fa-paw" style={{ marginRight: '4px' }}></i>
                        {animal.tipo_animal.charAt(0).toUpperCase() + animal.tipo_animal.slice(1)}
                      </span>
                      <span>
                        <i className="fas fa-birthday-cake" style={{ marginRight: '4px' }}></i>
                        {animal.edad} {animal.edad === 1 ? 'año' : 'años'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '3rem',
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                color: COLORS.textoSec,
                fontSize: '1.2rem'
              }}>
                <i className="fas fa-paw" style={{ 
                  fontSize: '2.5rem', 
                  color: COLORS.acento,
                  marginBottom: '1rem',
                  display: 'block'
                }}></i>
                Aún no hay peluditos en adopción 🐾<br/>
                <span style={{ 
                  fontSize: '1rem',
                  opacity: 0.8,
                  marginTop: '0.5rem',
                  display: 'block'
                }}>¡Vuelve pronto!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalles del animal */}
      {AnimalModal}

      {/* Modal de adopción estilizado */}
      {showAdopcionModal && (
        <div className="modal-adopcion-overlay">
          <div className="modal-adopcion">
            <form className="form-adopcion-below" onSubmit={handleAdopcionSubmit}>
              <h2>Formulario de Adopción</h2>
              {adopcionSuccess && (
                <div className="success-message">{adopcionSuccess}</div>
              )}
              {adopcionError && (
                <div className="error-message">{adopcionError}</div>
              )}
              <label>Nombre Completo *</label>
              <input
                name="nombre"
                value={adopcionForm.nombre}
                onChange={handleAdopcionChange}
                placeholder="Ej: Juan Pérez"
                className="input-grande input-left"
                required
                readOnly
                style={{
                  background: COLORS.fondo,
                  border: `2.5px solid ${COLORS.secundario}`,
                  borderRadius: '10px',
                  fontSize: '1rem',
                  color: COLORS.textoSec,
                  marginBottom: '0.3rem',
                  padding: '0.7rem 1.1rem',
                  boxShadow: '0 2px 8px #e28f5411'
                }}
              />
              <label>Cédula *</label>
              <input
                name="cedula"
                value={adopcionForm.cedula}
                onChange={handleAdopcionChange}
                placeholder="Ej: 1234567890"
                className="input-grande input-left"
                required
                readOnly
                style={{
                  background: COLORS.fondo,
                  border: `2.5px solid ${COLORS.secundario}`,
                  borderRadius: '10px',
                  fontSize: '1rem',
                  color: COLORS.textoSec,
                  marginBottom: '0.3rem',
                  padding: '0.7rem 1.1rem',
                  boxShadow: '0 2px 8px #e28f5411'
                }}
              />
              <label>Correo *</label>
              <input
                name="correo"
                value={adopcionForm.correo}
                onChange={handleAdopcionChange}
                placeholder="Ej: correo@ejemplo.com"
                className="input-grande input-left"
                required
                readOnly
                style={{
                  background: COLORS.fondo,
                  border: `2.5px solid ${COLORS.secundario}`,
                  borderRadius: '10px',
                  fontSize: '1rem',
                  color: COLORS.textoSec,
                  marginBottom: '0.3rem',
                  padding: '0.7rem 1.1rem',
                  boxShadow: '0 2px 8px #e28f5411'
                }}
              />
              <label>Fecha de solicitud *</label>
              <input
                name="fecha"
                value={adopcionForm.fecha}
                onChange={handleAdopcionChange}
                type="date"
                className="input-grande input-left"
                required
                style={{
                  background: COLORS.fondo,
                  border: `2.5px solid ${COLORS.secundario}`,
                  borderRadius: '10px',
                  fontSize: '1rem',
                  color: COLORS.textoSec,
                  marginBottom: '0.3rem',
                  padding: '0.7rem 1.1rem',
                  boxShadow: '0 2px 8px #e28f5411'
                }}
              />
              <div className="form-buttons" style={{ marginTop: '2.2rem', gap: '2.5rem', justifyContent: 'center', display: 'flex' }}>
                <button
                  type="submit"
                  className="btn-iniciar-adopcion"
                  disabled={adopcionLoading}
                  style={{
                    background: COLORS.acento,
                    color: '#fff',
                    border: 'none',
                    padding: '1rem 2.2rem',
                    borderRadius: '14px',
                    fontSize: '1.05rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(226,143,84,0.18)',
                    letterSpacing: '0.5px',
                    transition: 'all 0.2s',
                    minWidth: '140px'
                  }}
                >
                  {adopcionLoading ? 'Enviando...' : 'Iniciar adopción'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseAdopcionForm}
                  className="btn-cancelar-adopcion"
                  disabled={adopcionLoading}
                  style={{
                    background: COLORS.fondo,
                    color: COLORS.acento,
                    border: `2.5px solid ${COLORS.acento}`,
                    padding: '1rem 2.2rem',
                    borderRadius: '14px',
                    fontSize: '1.05rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #e28f5411',
                    minWidth: '140px',
                    transition: 'all 0.2s'
                  }}
                >
                  Volver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DetalleFundacion; 