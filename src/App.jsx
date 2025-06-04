import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [cuentos, setCuentos] = useState([]);

  useEffect(() => {
    axios.get('/api/cuentos')
      .then(response => {
        setCuentos(response.data);
      })
      .catch(error => {
        console.error('Error al obtener cuentos:', error);
      });
  }, []);

  return (
    <div>
      <h1>Cuentos</h1>
      <ul>
        {cuentos.map((cuento, i) => (
          <li key={i}>{cuento.titulo}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
