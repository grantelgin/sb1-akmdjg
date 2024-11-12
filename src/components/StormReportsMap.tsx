import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { StormReport } from '../types/StormReport';

// Replace with your Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface Props {
  userLocation: {
    lat: number;
    lon: number;
  };
  stormReports: StormReport[];
}

export const StormReportsMap: React.FC<Props> = ({ userLocation, stormReports }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [userLocation.lon, userLocation.lat],
      zoom: 8
    });

    // Add user location marker
    new mapboxgl.Marker({
      color: '#2563eb', // blue-600
      scale: 1.2
    })
      .setLngLat([userLocation.lon, userLocation.lat])
      .addTo(map.current);

    // Add storm report markers
    stormReports.forEach(report => {
      const markerElement = document.createElement('div');
      markerElement.className = 'storm-marker';
      
      // Set marker icon based on storm type
      switch (report.type) {
        case 'TORNADO':
          markerElement.innerHTML = '🌪️';
          break;
        case 'WIND':
          markerElement.innerHTML = '💨';
          break;
        case 'HAIL':
          markerElement.innerHTML = '🧊';
          break;
        case 'HURRICANE':
          markerElement.innerHTML = '🌀';
          break;
      }

      const marker = new mapboxgl.Marker({
        element: markerElement
      })
        .setLngLat([report.lon, report.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <strong>${report.type}</strong><br>
              ${report.description}<br>
              ${report.distance.toFixed(1)} miles away
            `)
        )
        .addTo(map.current);
    });

    return () => map.current?.remove();
  }, [userLocation, stormReports]);

  return <div ref={mapContainer} style={{ height: '400px', width: '100%' }} />;
};
