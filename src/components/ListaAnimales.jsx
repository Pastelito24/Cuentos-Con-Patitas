import React from 'react';

const ListaAnimales = ({ animales }) => {
  if (!animales || animales.length === 0) return <div>No hay animalitos registrados.</div>;
  return (
    <ul>
      {animales.map(animal => (
        <li key={animal.animal_id}>{animal.nombre} - {animal.especie} - {animal.edad} años</li>
      ))}
    </ul>
  );
};

export default ListaAnimales; 