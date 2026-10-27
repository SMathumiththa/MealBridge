import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import io from 'socket.io-client';

// Removed require() calls for leaflet icons as they break in Vite

const markerIcon = (color) => L.divIcon({
  className: '',
  html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.45)"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const donorIcon = markerIcon('#e74c3c');
const ngoIcon = markerIcon('#3498db');
const volunteerIcon = markerIcon('#2ecc71');

const validLocation = (location) => Boolean(
  location && Number.isFinite(Number(location.lat)) && Number.isFinite(Number(location.lng))
);

const locationPoint = (location) => validLocation(location)
  ? [Number(location.lat), Number(location.lng)]
  : null;

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center)) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

export default function LiveTracker({ roomId, currentUserRole, donorLocation, ngoLocation: initialNgoLocation, volunteerLocation: initialVolunteerLocation }) {
  const [ngoLocation, setNgoLocation] = useState(validLocation(initialNgoLocation) ? initialNgoLocation : null);
  const [volunteerLocation, setVolunteerLocation] = useState(validLocation(initialVolunteerLocation) ? initialVolunteerLocation : null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [socket, setSocket] = useState(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:5000`);
    setSocket(newSocket);
    
    newSocket.emit("join_room", roomId);

    newSocket.on("receive_location", (data) => {
      if (data.role === 'ngo') {
        setNgoLocation({ lat: data.lat, lng: data.lng });
      } else if (data.role === 'volunteer') {
        setVolunteerLocation({ lat: data.lat, lng: data.lng });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, currentUserRole]);

  // Only the volunteer broadcasts live movement during an active delivery.
  useEffect(() => {
    if (currentUserRole === 'volunteer' && socket) {
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const newLoc = { lat: latitude, lng: longitude };
            setVolunteerLocation(newLoc);
            
            socket.emit("send_location", {
              roomId,
              lat: latitude,
              lng: longitude,
              role: currentUserRole
            });
          },
          (err) => console.error("Geolocation Error: ", err),
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
      } else {
        console.warn("Geolocation is not supported by this browser.");
      }
    }

    return () => {
      if (watchIdRef.current && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [currentUserRole, socket, roomId]);

  // Fetch Route from OSRM
  useEffect(() => {
    const movingLocation = volunteerLocation || ngoLocation;
    if (validLocation(movingLocation) && validLocation(donorLocation)) {
      const url = `https://router.project-osrm.org/route/v1/driving/${movingLocation.lng},${movingLocation.lat};${donorLocation.lng},${donorLocation.lat}?overview=full&geometries=geojson`;
      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            // GeoJSON coordinates are [lng, lat], Leaflet polyline requires [lat, lng]
            const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
            setRouteCoords(coords);
          }
        })
        .catch(err => console.error("Failed to fetch route:", err));
    }
  }, [ngoLocation, volunteerLocation, donorLocation]);

  const movingLocation = volunteerLocation || ngoLocation;
  const mapCenter = locationPoint(movingLocation) || locationPoint(donorLocation) || [6.9271, 79.8612];

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "12px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)", background: "#111" }}>
      <MapContainer center={mapCenter} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Draw the Route Line (Uber Style) */}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="#2ecc71" weight={6} opacity={0.8} />
        )}

        {/* Donor Pin (Static) */}
        {validLocation(donorLocation) && (
          <Marker position={locationPoint(donorLocation)} icon={donorIcon}>
            <Popup>Donor Location (Food is here)</Popup>
          </Marker>
        )}

        {validLocation(initialNgoLocation) && (
          <Marker position={locationPoint(ngoLocation)} icon={ngoIcon}>
            <Popup>NGO Location</Popup>
          </Marker>
        )}

        {validLocation(volunteerLocation) && (
          <Marker position={locationPoint(volunteerLocation)} icon={volunteerIcon}>
            <Popup>Volunteer Live Location</Popup>
          </Marker>
        )}

        <MapUpdater center={locationPoint(movingLocation) || locationPoint(donorLocation)} />
      </MapContainer>
      <div style={{ display: 'flex', gap: 12, padding: '8px 10px', background: 'rgba(0,0,0,.72)', color: 'white', fontSize: 12 }}>
        <span><b style={{ color: '#e74c3c' }}>●</b> Donor</span>
        <span><b style={{ color: '#3498db' }}>●</b> NGO</span>
        <span><b style={{ color: '#2ecc71' }}>●</b> Volunteer</span>
      </div>
    </div>
  );
}
