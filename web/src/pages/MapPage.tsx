import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { InteractiveMap } from '../components/InteractiveMap';
import { localStore } from '../lib/supabase';
import { ActivityCard } from '../components/ActivityCard';
import { MapPin, Filter, Layers } from 'lucide-react';

export const MapPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const activities = localStore.activities;

  const filtered = activities.filter(act =>
    selectedCategory === 'Toutes' || act.category === selectedCategory
  );

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <MapPin className="w-7 h-7 text-cyan-400" />
              Carte interactive des sorties
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Visualisez les activités prévues près de chez vous sur OpenStreetMap.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {['Toutes', 'Randonnée', 'Bowling', 'Restaurant', 'Vélo', 'Jeux de société', 'Course à pied'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat ? 'bg-cyan-500 text-slate-950 font-extrabold' : 'bg-slate-900 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* OpenStreetMap Component */}
        <InteractiveMap activities={filtered} height="550px" />

        {/* Activities List below map */}
        <div className="space-y-4 pt-4">
          <h2 className="font-extrabold text-lg text-white">
            Activités visibles sur la carte ({filtered.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(act => (
              <ActivityCard key={act.id} activity={act} compact />
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
};
