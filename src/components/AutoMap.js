import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getIconLink } from './methods/iconsMethods';
import '../styles/automap.css';
import { calculateTimeAtRoute } from './methods/timeMethods';

const PaintRoad = ({ road }) => {
  const map = useMap();
  const polylineRef = useRef(null); // Referencja do polilinii

  useEffect(() => {
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (road && Array.isArray(road) && road.length > 0) {
      polylineRef.current = L.polyline(road.map(point => [point.latitude, point.longitude]), { color: 'rgb(60, 98, 188)' }).addTo(map);
      map.fitBounds(polylineRef.current.getBounds());
    }
  }, [road, map]); // Reaguje na zmiany `road`

  return null;
};


const WeatherMarkers = ({ locationsInfo }) => {
  const map = useMap();

  useEffect(() => {
    const markers = []; // Tablica do przechowywania markerów

    if (locationsInfo && locationsInfo.length > 0) {
      locationsInfo.forEach(location => {
        const iconUrl = getIconLink(location.code, location.isDay);
        const weatherInfo_large = L.divIcon({
          className: 'custom-icon',
          html: `
            <div class="custom-icon-container">
              <img src="${iconUrl}" alt="Weather icon" style="width: 50px; height: 50px;">
              <div class="custom-icon-text">
                <h2>${location.name} [${calculateTimeAtRoute(location.travelTimeInSeconds)}]</h2>
                <p>${location.temperature}</p>
              </div>
            </div>`,
          iconSize: [35, 35],
          iconAnchor: [17, 35],
          popupAnchor: [0, -35],
        });
        const weatherInfo_small = L.divIcon({
          className: 'custom-icon',
          html: `
            <div class="custom-icon-container-small">
              <img src="${iconUrl}" alt="Weather icon" style="width: 50px; height: 50px;">
            </div>`,
          iconSize: [15, 15],
          iconAnchor: [17, 35],
          popupAnchor: [0, -35],
        });


        const marker = L.marker([location.lat, location.lon], { icon: weatherInfo_small }).addTo(map);

        // Funkcja do aktualizacji ikony markera
        const updateIconBasedOnZoom = () => {
          const currentZoom = map.getZoom();
          const newIcon = currentZoom > 7 ? weatherInfo_large : weatherInfo_small; // Tutaj dostosuj logikę, jeśli potrzebujesz różnych ikon
          marker.setIcon(newIcon);
        };

        map.on('zoomend', updateIconBasedOnZoom);
        markers.push({ marker, updateIconBasedOnZoom }); // Dodaj marker i funkcję do tablicy
      });
    }

    return () => {
      // Usuń nasłuchiwacze i markery
      markers.forEach(({ marker, updateIconBasedOnZoom }) => {
        map.off('zoomend', updateIconBasedOnZoom);
        map.removeLayer(marker);
      });
    };
  }, [locationsInfo, map]);

  return null;
};


const AutoMap = ( {road, locations} ) => {
  return (
    <MapContainer center={[50.0619474, 19.9368564]} zoom={4} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
        <PaintRoad road={road} />
        <WeatherMarkers locationsInfo={locations}/>
    </MapContainer>
  );
};

export default AutoMap;
