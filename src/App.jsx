import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Clima from "./components/Clima"

function App() {
  const [cityName, setCityName] = useState(''); // Estado para almacenar el valor del input
  const [latitud, setLatitud]=useState(null);
  const[longitud,setLongitud]=useState(null)

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Evita que se recargue la página al enviar el formulario
  };

  const handleInputChange = (e) => {
    setCityName(e.target.value);
  };
  navigator.geolocation.getCurrentPosition(position => {
    setLatitud(position.coords.latitude);
    setLongitud(position.coords.longitude);
});

  return (
    <>
      <Header />
      <form onSubmit={handleFormSubmit}>
        <input autoComplete='off' type="text" name="ciudad" onChange={handleInputChange} />
        <button type="submit">Enviar</button>
      </form>
      <Clima cityName={cityName} latitud={latitud} longitud={longitud} />
      
    </>
  );
}

export default App;
