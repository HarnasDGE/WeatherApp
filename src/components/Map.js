import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { APIKEY_OPENWEATHERAPI } from '../constans/constans';
import L from 'leaflet';


const WeatherLayer = ({ layer }) => {
  const map = useMap();
  const layerUrl = `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${APIKEY_OPENWEATHERAPI}`;

  L.tileLayer(layerUrl, {
    attribution: 'Weather data © OpenWeatherMap',
  }).addTo(map);

  return null;
};

const Map = ( {layer}) => {
  return (
    <MapContainer center={[50.0619474, 19.9368564]} zoom={4} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <WeatherLayer layer={layer} />
    </MapContainer>
  );
};

export default Map;
