import React, { useState, useEffect } from 'react';

function Clima(props) {
  const [cargando, setCargando] = useState(false);
  const [okey, setOkey] = useState(true);
  const [ciudades, setCiudades] = useState([]);
  const [temp, setTemp] = useState(null);
  const [feelsLike, setFeelsLike] = useState(null);
  const [presion, setPresion] = useState(null);
  const [velocidadViento, setVelocidadViento] = useState(null);
  const [direccionViento, setDireccionViento] = useState(null);
  const [ciudad, setCiudad] = useState(null);

  useEffect(() => {
    const obtenerCiudades = async () => {
      try {
        setCargando(true);
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${props.cityName}&limit=5&appid=c1107c21652adeb2a440fbe30e0dc935`
        );
        if (!response.ok) {
          throw new Error('Error al cargar los datos.');
        }
        const data = await response.json();
        console.log(data);
        setOkey(true);
        setCiudades(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setOkey(false);
      } finally {
        setCargando(false);
      }
    };

    if (props.cityName) {
      obtenerCiudades();
    }
  }, [props.cityName]);

  useEffect(() => {
    if (props.latitud && props.longitud) {
      setCargando(true)
      mostrarClima(props.latitud, props.longitud);
    }
  }, [props.latitud, props.longitud]);

  const mostrarClima = async (lat, lon) => {
    try {
      setCargando(true)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=c1107c21652adeb2a440fbe30e0dc935`
      );
      if (!response.ok) {
        throw new Error('Error al cargar los datos del clima.');
      }
      const json = await response.json();
      setTemp(json.main.temp);
      setFeelsLike(json.main.feels_like);
      setPresion(json.main.pressure);
      setVelocidadViento(json.wind.speed * 3.6); // 1 m/s = 3.6 km/h
      setDireccionViento(json.wind.deg);
      setCiudad(json.name);
      setCargando(false)
    } catch (error) {
      console.error('Error fetching weather:', error);
      setTemp(null);
      setFeelsLike(null);
      setPresion(null);
      setVelocidadViento(null);
      setDireccionViento(null);
    }
  };

  const obtenerCords = (index) => {
    const { lat, lon } = ciudades[index];
    mostrarClima(lat, lon);
  };

  return (
    <>
      {!okey && <p>Ha ocurrido un error.</p>}
      <div>
        {ciudades.map((e, index) => (
          <div key={index}>
            <a onClick={() => obtenerCords(index)}>
              {e.name}, {e.state}
            </a>
          </div>
        ))}
      </div>
      {cargando && <p>Cargando...</p>}

      {temp !== null && (
        <div>
          <p>Estacion: {ciudad}</p>
          <p>Temperatura: {temp} °C</p>
          <p>Sensacion térmica: {feelsLike} °C</p>
          <p>Presión: {presion} hPa</p>
          <p>
            Viento: {velocidadViento !== null ? `${velocidadViento.toFixed(2)} km/h` : 'N/A'}, {direccionViento}°
          </p>
        </div>
      )}
    </>
  );
}

export default Clima;
