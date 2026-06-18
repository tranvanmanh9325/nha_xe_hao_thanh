import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const originIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to auto-fit bounds when markers change
const MapBounds = ({ originCoords, destCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (originCoords && destCoords) {
      const bounds = L.latLngBounds([originCoords, destCoords]);
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (originCoords) {
      map.setView(originCoords, 10);
    } else if (destCoords) {
      map.setView(destCoords, 10);
    }
  }, [originCoords, destCoords, map]);
  return null;
};

const handleGeocode = async (address) => {
  if (!address) return null;
  try {
    const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`);
    const data = await res.json();
    if (data && data.features && data.features.length > 0) {
      const coords = data.features[0].geometry.coordinates;
      return [coords[1], coords[0]];
    }
  } catch (err) {
    console.error("Geocoding failed:", err);
  }
  return null;
};

const RouteMapPreview = ({ origin, destination }) => {
  const [originCoords, setOriginCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [routePath, setRoutePath] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCoords = async () => {
      const [originResult, destResult] = await Promise.all([
        handleGeocode(origin),
        handleGeocode(destination)
      ]);
      if (isMounted) {
        setOriginCoords(originResult);
        setDestCoords(destResult);
      }
    };
    fetchCoords();
    return () => { isMounted = false; };
  }, [origin, destination]);

  useEffect(() => {
    let isMounted = true;
    if (originCoords && destCoords) {
      const fetchDrivingRoute = async () => {
        try {
          const OSRM_BASE_URL = import.meta.env.VITE_OSRM_API_URL || 'https://router.project-osrm.org';
          const url = `${OSRM_BASE_URL}/route/v1/driving/${originCoords[1]},${originCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Routing API failed`);
          const data = await res.json();
          if (isMounted && data && data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates;
            const mappedCoordinates = coords.map(c => [c[1], c[0]]);
            setRoutePath(mappedCoordinates);
          }
        } catch (err) {
          console.error("Routing failed:", err);
        }
      };
      fetchDrivingRoute();
    }
    return () => { isMounted = false; };
  }, [originCoords, destCoords]);

  return (
    <div style={{ height: '100%', width: '100%', backgroundColor: 'var(--neutral-100)', position: 'relative' }}>
      <MapContainer 
        center={[16.047079, 108.206230]} 
        zoom={5} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        touchZoom={false}
        keyboard={false}
      >
        <TileLayer
          url="https://mt0.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}"
        />
        {originCoords && <Marker position={originCoords} icon={originIcon} />}
        {destCoords && <Marker position={destCoords} icon={destIcon} />}
        {routePath && (
          <Polyline positions={routePath} color="#3b82f6" weight={3} opacity={0.7} />
        )}
        <MapBounds originCoords={originCoords} destCoords={destCoords} />
      </MapContainer>
    </div>
  );
};

export default RouteMapPreview;