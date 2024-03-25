import React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const PaintRoad = ({road}) => {
    const map = useMap();
    console.log(`Road: `, road);
    if (road && road.length > 0) { // Upewnij się, że road istnieje i ma elementy
        console.log(`Rysuje Mape`)
        const polyline = L.polyline(road, { color: 'red' }).addTo(map);
        map.fitBounds(polyline.getBounds());
      }
    return null;
  };

const AutoMap = ( {road} ) => {
    console.log(`Road AutoMap: ,`, road)
  return (
    <MapContainer center={[50.0619474, 19.9368564]} zoom={4} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
        <PaintRoad road={road} />
    </MapContainer>
  );
};

export default AutoMap;
