import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ActivityCard } from '../components/ActivityCard';
import { localStore } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Calendar, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyActivitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'organized' | 'joined'>('organized');

  const organized = localStore.activities.filter(a => a.organizer_id === user?.id);
  const joined = localStore.activities.filter(a => a.participants?.some(p => p.id === user?.id) && a.organizer_id !== user?.id);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Mes Sorties</h1>
            <p className="text-xs text-slate-400 mt-1">Gérez vos activités organisées et rejointes.</p>
          </div>

          <Link
            to="/activities/create"
            className="px-5 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Créer une activité
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <button
            onClick={() => setTab('organized')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'organized' ? 'bg-violet-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            👑 Mes activités organisées ({organized.length})
          </button>

          <button
            onClick={() => setTab('joined')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'joined' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            🎉 Activités rejointes ({joined.length})
          </button>
        </div>

        {/* Grid */}
        {tab === 'organized' ? (
          organized.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {organized.map(act => (
                <ActivityCard key={act.id} activity={act} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="font-bold text-white text-base">Vous n'avez pas encore créé d'activité</h3>
              <p className="text-xs text-slate-400">Lancez votre première sortie dès maintenant !</p>
            </div>
          )
        ) : (
          joined.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {joined.map(act => (
                <ActivityCard key={act.id} activity={act} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="font-bold text-white text-base">Aucune activité rejointes actuellement</h3>
              <p className="text-xs text-slate-400">Parcourez le fil d'actualité pour rejoindre une sortie.</p>
            </div>
          )
        )}

      </main>

      <Footer />
    </div>
  );
};
