import React, { useEffect, useRef, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { timeFromSecond } from '../methods/timeMethods';

export const PaintRoad = ({allRoutes, changeMainRoute}) => {

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
    
    const changeMainLine = (index) => {
        changeMainRoute(index);
    };
  
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
  
      const actualMainRoute = allRoutes[0];
        allRoutes.forEach((route, index) => {
          if(route && Array.isArray(route.points) && route.points.length > 0) {
            const isMainRoute = index === 0;
            const differenceTime = route.travelTimeInSeconds - actualMainRoute.travelTimeInSeconds;
            const routeTimeInfo = L.divIcon({
              className: 'routeTimeInfo',
              html: `<p>${differenceTime > 0 ? "Slower " : "Faster"} by ${timeFromSecond(Math.abs(differenceTime))}</p>`,
              iconSize: "auto",
              iconAnchor: [-10,0],
            });
  
            const mainRouteTimeInfo = L.divIcon({
              className: 'mainRouteTimeInfo',
              html: `<p>${timeFromSecond(route.travelTimeInSeconds)}</p>`,
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
            routeLine.on('click', () => changeMainLine(index));
  
            const halfOfArray = Math.floor(route.points.length/2);
            if(!isMainRoute) {
              const marker = L.marker([route.points[halfOfArray].latitude, route.points[halfOfArray].longitude], {icon: routeTimeInfo}).addTo(map);
              routeTimesRefs.current[index].current = marker;
  
              routeLine.on('mouseover', () => {
                highlightLine(routeRefs.current[index].current, 'rgba(100, 180, 242,1)');
                marker.setIcon(L.divIcon({
                  className: 'routeTimeInfo routeTimeInfo-hover', // Zmiana klasy przy hover
                  html: `<p>${differenceTime > 0 ? "Slower " : "Faster"} by ${timeFromSecond(Math.abs(differenceTime))}</p>`,
                  iconSize: "auto",
                  iconAnchor: [-10,0],
                }));
              }); 
              
              routeLine.on('mouseout', () => {
                highlightLine(routeRefs.current[index].current, isMainRoute ? 'rgba(80, 160, 222,1)' : 'rgba(128, 128, 128, 1)');
                marker.setIcon(routeTimeInfo);
              }); 
            } else {
              const marker = L.marker([route.points[halfOfArray].latitude, route.points[halfOfArray].longitude], {icon: mainRouteTimeInfo}).addTo(map);
              routeTimesRefs.current[index].current = marker;
  
              routeLine.on('mouseover', () => {
                highlightLine(routeRefs.current[index].current, 'rgba(100, 180, 242,1)');
                marker.setIcon(L.divIcon({
                  className: 'mainRouteTimeInfo mainRouteTimeInfo-hover', // Zmiana klasy przy hover
                  html: `<p>${timeFromSecond(route.travelTimeInSeconds)}</p>`,
                  iconSize: "auto",
                  iconAnchor: [-10,0],
                }));
              }); 
              
              routeLine.on('mouseout', () => {
                highlightLine(routeRefs.current[index].current, isMainRoute ? 'rgba(80, 160, 222,1)' : 'rgba(128, 128, 128, 1)');
                marker.setIcon(mainRouteTimeInfo);
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