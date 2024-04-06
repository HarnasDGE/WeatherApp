import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getIconLink } from './methods/iconsMethods';
import '../styles/automap.css';
import { calculateTimeAtRoute, timeFromSecond } from './methods/timeMethods';


const PaintRoad = ({ allRoutes}) => {
  const map = useMap();
  const routeRefs = useRef(allRoutes.map(() => React.createRef()));
  const routeTimesRefs = useRef(allRoutes.map(() => React.createRef()));

  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  const timeTravelInfoRef = useRef(null);
  
  const startPoint = L.divIcon({
    className: 'startAndEndPoints',
    html: `<span class="material-symbols-outlined startAndEndPoints">radio_button_checked</span>`,
    iconSize: [20,20],
  });

  const endPoint = L.divIcon({
    className: 'startAndEndPoints',
    html: `<span class="material-symbols-outlined startAndEndPoints">distance</span>`,
    iconSize: [10,10],
    iconAnchor: [10,20]
  });




  useEffect(() => {
    
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

    routeRefs.current.forEach(ref => {
      if (ref.current) {
        map.removeLayer(ref.current);
        ref.current = null;
      }
    });

    routeTimesRefs.current.forEach(ref => {
      if (ref.current) {
        map.removeLayer(ref.current);
        ref.current = null;
      }
    });

    routeRefs.current = allRoutes.map(() => React.createRef());
    routeTimesRefs.current = allRoutes.map(() => React.createRef());

    if(!(allRoutes && allRoutes[0] && Array.isArray(allRoutes[0].points) && allRoutes[0].points.length > 0)) return;

    const highlightLine = (line, color) => {
      if (line) {
        line.setStyle({ color });
      }
    };
    /*
    const highlightTimeTravel = (route, isMainRoute = false) => {
      const travelTimeInSeconds = route ? route.travelTimeInSeconds : 0;
      const classInfoLabel = isMainRoute ? "mainTimeTravelInfo" : "alternativeTimeTravelInfo";

      const timeTravelInfo = L.divIcon({
        className: classInfoLabel,
        html: `
          <div className=${classInfoLabel}>
            <p>TIME TRAVEL</p>
            <p>${timeFromSecond(travelTimeInSeconds)}</p>
          </div>
        `,
        iconAnchor: [-70,-30]
      })
      const halfOfArray = Math.floor(route.points.length/2);
      timeTravelInfoRef.current = L.marker([route.points[halfOfArray].latitude, route.points[halfOfArray].longitude], {icon: timeTravelInfo}).addTo(map);
    }
    */
    const actualMainRoute = allRoutes[0];
      allRoutes.forEach((route, index) => {
        if(route && Array.isArray(route.points) && route.points.length > 0) {
          const isMainRoute = index === 0;
          const differenceTime = route.travelTimeInSeconds - actualMainRoute.travelTimeInSeconds;
          const routeTimeInfo = L.divIcon({
            className: 'routeTimeInfo',
            html: `
                <p>${differenceTime > 0 ? "Slower " : "Faster"} by ${timeFromSecond(differenceTime)}</p>
            `,
            iconSize: "auto",
            iconAnchor: [-10,0],
          });

          const mainRouteTimeInfo = L.divIcon({
            className: 'mainRouteTimeInfo',
            html: `
                <p>${timeFromSecond(route.travelTimeInSeconds)}</p>
            `,
            iconSize: "auto",
            iconAnchor: [-10,0],
          })
        
          const routeLine = L.polyline(
            route.points.map(point => [point.latitude, point.longitude]),
            {
              weight: 5,
              className: isMainRoute ? 'mainRoadLine' : 'alternativeRoutes',
              color: isMainRoute ? "rgba(80, 160, 222,1)" : "rgba(128, 128, 128, 1)",
            }
          ).addTo(map);
          routeRefs.current[index].current = routeLine;

          const halfOfArray = Math.floor(route.points.length/2);
          if(!isMainRoute) {
            const marker = L.marker([route.points[halfOfArray].latitude, route.points[halfOfArray].longitude], {icon: routeTimeInfo}).addTo(map);
            routeTimesRefs.current[index].current = marker;

            routeLine.on('mouseover', () => {
              highlightLine(routeRefs.current[index].current, 'rgba(100, 180, 242,1)');
              marker.setIcon(L.divIcon({
                className: 'routeTimeInfo routeTimeInfo-hover', // Zmiana klasy przy hover
                html: `
                    <p>${differenceTime > 0 ? "Slower " : "Faster"} by ${timeFromSecond(Math.abs(differenceTime))}</p>
                `,
                iconSize: "auto",
                iconAnchor: [-10,0],
              }));
            }); 
            
            routeLine.on('mouseout', () => {
              highlightLine(routeRefs.current[index].current, isMainRoute ? 'rgba(80, 160, 222,1)' : 'rgba(128, 128, 128, 1)');
              marker.setIcon(L.divIcon({
                className: 'routeTimeInfo', // Powrót do oryginalnej klasy
                html: `
                    <p>${differenceTime > 0 ? "Slower " : "Faster"} by ${timeFromSecond(Math.abs(differenceTime))}</p>
                `,
                iconSize: "auto",
                iconAnchor: [-10,0],
              }));
            }); 
          } else {
            const marker = L.marker([route.points[halfOfArray].latitude, route.points[halfOfArray].longitude], {icon: mainRouteTimeInfo}).addTo(map);
            routeTimesRefs.current[index].current = marker;

            routeLine.on('mouseover', () => {
              highlightLine(routeRefs.current[index].current, 'rgba(100, 180, 242,1)');
              marker.setIcon(L.divIcon({
                className: 'mainRouteTimeInfo mainRouteTimeInfo-hover', // Zmiana klasy przy hover
                html: `
                  <p>${timeFromSecond(route.travelTimeInSeconds)}</p>                
                  `,
                iconSize: "auto",
                iconAnchor: [-10,0],
              }));
            }); 
            
            routeLine.on('mouseout', () => {
              highlightLine(routeRefs.current[index].current, isMainRoute ? 'rgba(80, 160, 222,1)' : 'rgba(128, 128, 128, 1)');
              marker.setIcon(L.divIcon({
                className: 'mainRouteTimeInfo', 
                html: `
                  <p>${timeFromSecond(route.travelTimeInSeconds)}</p>
                `,
                iconSize: "auto",
                iconAnchor: [-10,0],
              }));
            }); 
          }
          
        }
      });

      if (allRoutes.length > 0 && routeRefs.current[0].current) {
        routeRefs.current[0].current.bringToFront();
      }

      startMarkerRef.current = L.marker([actualMainRoute.points[0].latitude, actualMainRoute.points[0].longitude], { icon: startPoint }).addTo(map);
      endMarkerRef.current = L.marker([actualMainRoute.points[actualMainRoute.points.length - 1].latitude, actualMainRoute.points[actualMainRoute.points.length - 1].longitude], { icon: endPoint }).addTo(map);
    
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
