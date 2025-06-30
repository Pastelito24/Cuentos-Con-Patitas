import React, { useState, useEffect } from 'react';
import './EditarFundacionCard.css';

const EditarFundacionCard = ({ fundacion: initialFundacion, onClose, onUpdate }) => {
  const [fundacion, setFundacion] = useState(initialFundacion);
  const [error, setError] = useState('');

  useEffect(() => {
    setFundacion(initialFundacion);
  }, [initialFundacion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFundacion(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const datosParaActualizar = {};
    Object.keys(fundacion).forEach(key => {
      if (fundacion[key] !== initialFundacion[key]) {
        datosParaActualizar[key] = fundacion[key];
      }
    });

    if (Object.keys(datosParaActualizar).length === 0) {
      onClose();
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/actualizar_fundacion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(datosParaActualizar),
      });

      const data = await response.json();

      if (data.success) {
        onUpdate(data.fundacion);
        onClose();
      } else {
        setError(data.error || 'Ocurrió un error al actualizar.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="modal-overlay-fundacion" onClick={onClose}>
      <div className="edit-card-fundacion" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h2>Editar Datos de la Fundación</h2>
          
          <div className="form-grid-fundacion">
            <label htmlFor="nombre">Nombre de la Fundación</label>
            <input type="text" id="nombre" name="nombre" value={fundacion.nombre || ''} onChange={handleChange} />
            
            <label htmlFor="persona_acargo">Persona a Cargo</label>
            <input type="text" id="persona_acargo" name="persona_acargo" value={fundacion.persona_acargo || ''} onChange={handleChange} />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={fundacion.email || ''} onChange={handleChange} />

            <label htmlFor="telefono">Teléfono</label>
            <input type="tel" id="telefono" name="telefono" value={fundacion.telefono || ''} onChange={handleChange} />

            <label htmlFor="direccion" className="full-width">Dirección</label>
            <input type="text" id="direccion" name="direccion" value={fundacion.direccion || ''} onChange={handleChange} className="full-width" />
            
            <label htmlFor="contrasena" className="full-width">Nueva Contraseña</label>
            <input type="password" id="contrasena" name="contrasena" placeholder="Dejar en blanco para no cambiar" onChange={handleChange} className="full-width" />
          </div>

          <div className="form-section-divider">
            <h3>Información Bancaria</h3>
            <p className="section-description">Información para recibir donaciones por transferencia bancaria y Nequi</p>
          </div>

          <div className="form-grid-fundacion">
            <label htmlFor="banco">Banco</label>
            <select id="banco" name="banco" value={fundacion.banco || ''} onChange={handleChange}>
              <option value="">Seleccionar banco</option>
              <option value="Bancolombia">Bancolombia</option>
              <option value="Davivienda">Davivienda</option>
              <option value="Banco de Bogotá">Banco de Bogotá</option>
              <option value="BBVA Colombia">BBVA Colombia</option>
              <option value="Colpatria">Colpatria</option>
              <option value="Banco Popular">Banco Popular</option>
              <option value="Banco AV Villas">Banco AV Villas</option>
              <option value="Banco Caja Social">Banco Caja Social</option>
              <option value="Banco Agrario">Banco Agrario</option>
              <option value="Banco de Occidente">Banco de Occidente</option>
              <option value="Scotiabank Colpatria">Scotiabank Colpatria</option>
              <option value="Citibank Colombia">Citibank Colombia</option>
              <option value="HSBC Colombia">HSBC Colombia</option>
              <option value="Banco Santander">Banco Santander</option>
              <option value="Banco Falabella">Banco Falabella</option>
              <option value="Banco Pichincha">Banco Pichincha</option>
              <option value="Banco GNB Sudameris">Banco GNB Sudameris</option>
              <option value="Bancoomeva">Bancoomeva</option>
              <option value="Coopcentral">Coopcentral</option>
              <option value="Otro">Otro</option>
            </select>

            <label htmlFor="tipo_cuenta">Tipo de Cuenta</label>
            <select id="tipo_cuenta" name="tipo_cuenta" value={fundacion.tipo_cuenta || ''} onChange={handleChange}>
              <option value="">Seleccionar tipo</option>
              <option value="Ahorros">Ahorros</option>
              <option value="Corriente">Corriente</option>
            </select>

            <label htmlFor="numero_cuenta">Número de Cuenta</label>
            <input type="text" id="numero_cuenta" name="numero_cuenta" value={fundacion.numero_cuenta || ''} onChange={handleChange} placeholder="Ej: 1234567890" />

            <label htmlFor="titular_cuenta">Titular de la Cuenta</label>
            <input type="text" id="titular_cuenta" name="titular_cuenta" value={fundacion.titular_cuenta || ''} onChange={handleChange} placeholder="Nombre completo del titular" />

            <label htmlFor="telefono_contacto" className="full-width">Teléfono Nequi</label>
            <input type="tel" id="telefono_contacto" name="telefono_contacto" value={fundacion.telefono_contacto || ''} onChange={handleChange} placeholder="Número de celular registrado en Nequi" className="full-width" />
          </div>
          
          {error && <p className="error-message">{error}</p>}

          <div className="form-actions-fundacion">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarFundacionCard; 