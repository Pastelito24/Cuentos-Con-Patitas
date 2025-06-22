import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './EditarUsuarioCard.css';

const EditarUsuarioCard = ({ usuario: initialUsuario, onClose, onUpdate }) => {
  const [usuario, setUsuario] = useState(initialUsuario);
  const [nuevaFoto, setNuevaFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setUsuario(initialUsuario);
    setPreviewFoto(initialUsuario.usuariofoto_url || null);
  }, [initialUsuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNuevaFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Añadir solo los campos que han cambiado
    Object.keys(usuario).forEach(key => {
      if (usuario[key] !== initialUsuario[key]) {
        formData.append(key, usuario[key]);
      }
    });
    
    if (nuevaFoto) {
      formData.append('foto', nuevaFoto);
    }
    
    // Si no hay cambios, simplemente cerrar
    if (formData.entries().next().done) {
        onClose();
        return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/actualizar_mi_cuenta', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onUpdate(data.usuario);
        onClose();
      } else {
        setError(data.error || 'Ocurrió un error al actualizar.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  const UserImagePlaceholder = () => (
    <div className="profile-placeholder">
      <FaUserCircle />
      <span>Sin foto</span>
    </div>
  );

  return (
    <div className="modal-overlay-user" onClick={onClose}>
      <div className="edit-card-user" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Editar Perfil</h2>
          
          <div className="photo-upload-section">
            {previewFoto ? (
              <img 
                src={previewFoto} 
                alt="Vista previa" 
                className="profile-preview"
                onError={(e) => { 
                  e.target.style.display = 'none';
                  // Forzamos un re-render o mostramos el placeholder de otra forma
                  setPreviewFoto(null); 
                }}
              />
            ) : (
              <UserImagePlaceholder />
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange} 
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button type="button" className="upload-btn" onClick={() => fileInputRef.current.click()}>
              <i className="fas fa-camera"></i> Cambiar Foto
            </button>
          </div>

          <div className="form-grid-user">
            <label htmlFor="nombre">Nombre</label>
            <label htmlFor="telefono">Teléfono</label>

            <input type="text" id="nombre" name="nombre" value={usuario.nombre || ''} onChange={handleChange} />
            <input type="tel" id="telefono" name="telefono" value={usuario.telefono || ''} onChange={handleChange} />
            
            <label htmlFor="email" className="full-width">Email</label>
            <input type="email" id="email" name="email" value={usuario.email || ''} onChange={handleChange} className="full-width" />
            
            <label htmlFor="direccion" className="full-width">Dirección</label>
            <input type="text" id="direccion" name="direccion" value={usuario.direccion || ''} onChange={handleChange} className="full-width" />

            <label htmlFor="contrasena">Nueva Contraseña</label>
            <label htmlFor="edad">Edad</label>
            
            <input type="password" id="contrasena" name="contrasena" placeholder="Dejar en blanco para no cambiar" onChange={handleChange} />
            <input type="number" id="edad" name="edad" value={usuario.edad || ''} onChange={handleChange} />
          </div>
          
          {error && <p className="error-message">{error}</p>}

          <div className="form-actions-user">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarUsuarioCard; 