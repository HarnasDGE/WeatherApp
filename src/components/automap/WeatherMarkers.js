import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { getIconLink } from '../methods/iconsMethods';
import { calculateTimeAtRoute } from '../methods/timeMethods';

export const WeatherMarkers = ({ locationsInfo, options }) => {
    const map = useMap();
  
    useEffect(() => {
      console.log(`[WeatherMarkers LOG] loationsInfo: `, locationsInfo);
      const markers = []; // Tablica do przechowywania markerów
      const isTemperatureOnMap = options.isTemperatureOnMap;
      if (locationsInfo && locationsInfo.length > 0 && isTemperatureOnMap) {
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