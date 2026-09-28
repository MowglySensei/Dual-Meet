import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Activity } from '../types';
import { Link } from 'react-router-dom';
import { Calendar, Users, MapPin } from 'lucide-react';

// Custom Marker Icon
const createCustomIcon = (category: string) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: linear-gradient(135deg, #8B5CF6, #06B6D4);
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.5);
        border: 2px solid #ffffff;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 14px;
        ">📍</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

interface InteractiveMapProps {
  activities: Activity[];
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  height?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  activities,
  center = [42.6986, 2.8956], // Default Perpignan
  zoom = 10,
  height = '500px',
}) => {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative z-0" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {activities.map(act => (
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
                <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] font-bold rounded uppercase">
                  {act.category}
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-1 line-clamp-1">{act.title}</h4>
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
                  className="block text-center w-full mt-2 py-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Voir l'activité
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
