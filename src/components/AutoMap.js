import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getIconLink } from './methods/iconsMethods';
import '../styles/automap.css';
import { calculateTimeAtRoute, timeFromSecond } from './methods/timeMethods';


const PaintRoad = ({ allRoutes}) => {
  const map = useMap();
  const mainRouteRef = useRef(null); // Referencja do polilinii
  const alternativeRouteRef = useRef(null);
  const alternativeRouteSecondRef = useRef(null);

  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  const timeTravelInfoRef = useRef(null);

  const actualMainRoute = allRoutes[0];

  const startPoint = L.divIcon({
    className: 'startAndEndPoints',
    html: `<span class="material-symbols-outlined startAndEndPoints">radio_button_unchecked</span>`,
    iconSize: [20,20],
  });

  const endPoint = L.divIcon({
    className: 'startAndEndPoints',
    html: `<span class="material-symbols-outlined startAndEndPoints">location_on</span>`,
    iconSize: [20,20],
    iconAnchor: [10,20]
  });

 /* const timeTravelInfo = L.divIcon({
    className: 'timeTravelInfo',
    html: `
      <div className="timeTravelInfo">
        <p>Czas przejazdu</p>
        <p>${timeFromSecond(actualMainRoute.travelTimeInSeconds)}</p>
      </div>
    `,
    iconSize: [200,70]
  })
*/

  useEffect(() => {
    if (mainRouteRef.current) {
      map.removeLayer(mainRouteRef.current);
      mainRouteRef.current = null;
    }
    if (alternativeRouteRef.current) {
      map.removeLayer(alternativeRouteRef.current);
      alternativeRouteRef.current = null;
    }
    if (alternativeRouteSecondRef.current) {
      map.removeLayer(alternativeRouteSecondRef.current);
      alternativeRouteSecondRef.current = null;
    }
    if (startMarkerRef.current) {
      map.removeLayer(startMarkerRef.current);
      startMarkerRef.current = null;
    }
    if (endMarkerRef.current) {
      map.removeLayer(endMarkerRef.current);
      endMarkerRef.current = null;
    }
    if(timeTravelInfoRef.current) {
      map.removeLayer(timeTravelInfoRef.current);
      timeTravelInfoRef.current = null;
    }

    if (allRoutes[0] && Array.isArray(allRoutes[0].points) && allRoutes[0].points.length > 0) {
      mainRouteRef.current = L.polyline(
      allRoutes[0].points.map(point => [point.latitude, point.longitude]), 
      { 
        weight: 5,
        color: "rgba(80, 160, 222,1)",
        className: 'mainRoadLine'
      }
    ).addTo(map);
      map.fitBounds(mainRouteRef.current.getBounds());

    if(allRoutes[1] && Array.isArray(allRoutes[1].points) && allRoutes[1].points.length > 0) {
      alternativeRouteRef.current = L.polyline(
        allRoutes[1].points.map(point => [point.latitude, point.longitude]),
        {
          weight: 3,
          className: 'alternativeRoutes',
          color: "rgba(128, 128, 128, 1)",
          dashArray: '10, 10'
        }
      ).addTo(map);
      map.fitBounds(alternativeRouteRef.current.getBounds());
    }

    if(allRoutes[2] && Array.isArray(allRoutes[2].points) && allRoutes[2].points.length > 0) {
      alternativeRouteSecondRef.current = L.polyline(
        allRoutes[2].points.map(point => [point.latitude, point.longitude]),
        {
          weight: 3,
          className: 'alternativeRoutes',
          color: "rgba(128, 128, 128, 1)",
          dashArray: '10, 10'
        }
      ).addTo(map);
      map.fitBounds(alternativeRouteSecondRef.current.getBounds());
    }

      startMarkerRef.current = L.marker([actualMainRoute.points[0].latitude, actualMainRoute.points[0].longitude], { icon: startPoint }).addTo(map);
      endMarkerRef.current = L.marker([actualMainRoute.points[actualMainRoute.points.length - 1].latitude, actualMainRoute.points[actualMainRoute.points.length - 1].longitude], { icon: endPoint }).addTo(map);
      //timeTravelInfoRef.current = L.marker([actualMainRoute[Math.floor(actualMainRoute.length/2)].latitude, actualMainRoute[Math.floor(actualMainRoute.length/2)].longitude], {icon: timeTravelInfo}).addTo(map);
    
    }

    
  }, [allRoutes, map]); // Reaguje na zmiany `road`

  return null;
};



const WeatherMarkers = ({ locationsInfo, options }) => {
  const map = useMap();

  useEffect(() => {
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


const AutoMap = ( {allRoutes, locations, options} ) => {
  console.log(`[AutoMap LOG], allRoutes: `, allRoutes);
  return (
    <MapContainer center={[50.0619474, 19.9368564]} zoom={4} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'/>
        <PaintRoad allRoutes={allRoutes}/>
        <WeatherMarkers locationsInfo={locations} options={options}/>
    </MapContainer>
  );
};

export default AutoMap;
