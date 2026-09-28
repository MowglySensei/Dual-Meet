import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Activity } from '../types';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin, Navigation, Compass, Crosshair } from 'lucide-react';

// Custom Activity Marker Icon
const createCustomIcon = (category: string) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: linear-gradient(135deg, #8B5CF6, #06B6D4);
        width: 38px;
        height: 38px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.6);
        border: 2px solid #ffffff;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 15px;
        ">📍</div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
};

// Live User GPS Location Pulse Marker Icon
const createUserGpsIcon = () => {
  return L.divIcon({
    className: 'user-gps-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px;">
        <div style="
          position: absolute;
          inset: 0;
          background: rgba(6, 182, 212, 0.4);
          border-radius: 50%;
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: absolute;
          inset: 4px;
          background: #06B6D4;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.9);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Map Recenter Helper Component
const MapRecenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom || map.getZoom(), { animate: true, duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// Haversine Distance Calculation (in km)
const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

interface InteractiveMapProps {
  activities: Activity[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onGpsLocate?: (lat: number, lng: number) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  activities,
  center = [42.6986, 2.8956],
  zoom = 11,
  height = '500px',
  onGpsLocate
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState<number>(zoom);
  const [userGpsLocation, setUserGpsLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Trigger HTML5 Device GPS Geolocation
  const handleLocateUserGps = () => {
    if (!navigator.geolocation) {
      setGpsError("La géolocalisation GPS n'est pas supportée par votre navigateur.");
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserGpsLocation([lat, lng]);
        setMapCenter([lat, lng]);
        setMapZoom(13);
        setIsLocating(false);
        if (onGpsLocate) onGpsLocate(lat, lng);
      },
      (error) => {
        setIsLocating(false);
        setGpsError("Impossible d'obtenir votre position GPS. Vérifiez les autorisations de votre navigateur.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative group" style={{ height }}>

      {/* GPS LIVE BUTTON overlay on map (Optimized for Mobile Touch) */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={handleLocateUserGps}
          disabled={isLocating}
          className="px-4 py-3 bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md text-white font-extrabold text-xs rounded-2xl border border-cyan-500/40 shadow-2xl flex items-center gap-2 hover:scale-105 transition-all cursor-pointer active:scale-95"
        >
          <Crosshair className={`w-4 h-4 text-cyan-400 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Recherche GPS...' : 'Ma position GPS en direct'}</span>
        </button>

        {gpsError && (
          <span className="px-3 py-1 bg-rose-900/90 text-rose-200 text-[10px] font-bold rounded-xl border border-rose-500/40 backdrop-blur-md max-w-xs">
            {gpsError}
          </span>
        )}
      </div>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
        className="z-0"
      >
        <MapRecenter center={mapCenter} zoom={mapZoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Live User GPS Pulse Marker */}
        {userGpsLocation && (
          <Marker position={userGpsLocation} icon={createUserGpsIcon()}>
            <Popup className="custom-popup">
              <div className="p-2 text-center text-slate-900 font-bold text-xs">
                <span className="text-cyan-600 block text-sm">📍 Vous êtes ici</span>
                <span className="text-[10px] text-slate-500 font-normal">Position GPS en direct</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Activity Markers */}
        {activities.map(act => {
          const distanceFromUser = userGpsLocation
            ? calculateDistanceKm(userGpsLocation[0], userGpsLocation[1], act.latitude, act.longitude)
            : null;

          return (
            <Marker
              key={act.id}
              position={[act.latitude, act.longitude]}
              icon={createCustomIcon(act.category)}
            >
              <Popup className="custom-popup">
                <div className="w-64 p-1 text-slate-900">
                  <img
                    src={act.image_url}
                    alt={act.title}
                    className="w-full h-28 object-cover rounded-xl mb-2"
                  />
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] font-bold rounded uppercase">
                      {act.category}
                    </span>
                    {distanceFromUser !== null && (
                      <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 text-[10px] font-extrabold rounded-full">
                        ⚡ à {distanceFromUser} km
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{act.title}</h4>

                  <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-violet-600" />
                      <span>{new Date(act.date_time).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-600" />
                      <span>{act.city}</span>
                    </div>
                  </div>

                  <Link
                    to={`/activity/${act.id}`}
                    className="block text-center w-full mt-3 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md"
                  >
                    Voir l'activité
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
