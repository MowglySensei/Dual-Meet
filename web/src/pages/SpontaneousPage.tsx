import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ActivityCard } from '../components/ActivityCard';
import { localStore } from '../lib/supabase';
import { Zap, Clock, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SpontaneousPage: React.FC = () => {
  const [filterTime, setFilterTime] = useState<string>('all');

  const spontaneousActivities = localStore.activities.filter(a => a.is_spontaneous);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-violet-950/40 border border-amber-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
              <Zap className="w-4 h-4 fill-current text-amber-400" />
              <span>Improvisations & Envie de sortir tout de suite</span>
            </div>
            <h1 className="text-3xl font-black text-white">Activités Spontanées</h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Boire un verre ce soir, faire une promenade dans une heure, aller au bowling à 20h ou faire du vélo demain matin ? Découvre les sorties improvisées.
            </p>
          </div>

          <Link
            to="/activities/create"
            className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-violet-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg hover:scale-105 transition-all shrink-0 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Proposer une sortie spontanée
          </Link>
        </div>

        {/* Time Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          {[
            { id: 'all', label: 'Toutes les sorties spontanées' },
            { id: 'now', label: 'Maintenant (Dans l’heure)' },
            { id: 'today', label: 'Aujourd’hui & Ce soir' },
            { id: 'tomorrow', label: 'Demain' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterTime(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterTime === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spontaneousActivities.map(act => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
};
