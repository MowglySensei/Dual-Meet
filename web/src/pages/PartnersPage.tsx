import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { localStore } from '../lib/supabase';
import { Users, Bike, Mountain, Dumbbell, Gamepad2, MessageSquare, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export const PartnersPage: React.FC = () => {
  const { showToast } = useToast();
  const partnerSearches = localStore.partnerSearches;

  const [selectedType, setSelectedType] = useState<string>('Tous');

  const filtered = partnerSearches.filter(p =>
    selectedType === 'Tous' || p.activity_type.toLowerCase().includes(selectedType.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Users className="w-8 h-8 text-violet-400" />
              Recherche de Partenaires Réguliers
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Trouvez des coéquipiers réguliers pour le vélo, la randonnée, la muscu, le footing ou le gaming.
            </p>
          </div>

          <button
            onClick={() => showToast('Formulaire de partenaire régulier enregistré !', 'success')}
            className="px-5 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-lg hover:scale-105 transition-all self-start md:self-auto flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Publier ma recherche de partenaire
          </button>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['Tous', 'Vélo', 'Randonnée', 'Running', 'Fitness', 'Jeux vidéo'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === type ? 'bg-violet-600 text-white shadow-lg' : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-[#0F172A] border border-slate-800 hover:border-violet-500/50 rounded-3xl p-6 shadow-xl space-y-4 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.user?.avatar_url}
                    alt={item.user?.display_name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-violet-500"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base">{item.user?.display_name}</h3>
                    <p className="text-xs text-cyan-400">📍 {item.city}</p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-violet-600/30 text-violet-300 text-xs font-extrabold rounded-xl border border-violet-500/40">
                  {item.activity_type}
                </span>
              </div>

              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Niveau :</span>
                  <span className="text-white font-semibold">{item.fitness_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Disponibilités :</span>
                  <span className="text-white font-semibold">{item.availability}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-bold">Fréquence :</span>
                  <span className="text-emerald-400 font-semibold">{item.frequency}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic">
                « {item.description} »
              </p>

              <div className="pt-2">
                <Link
                  to={`/user/${item.user?.id}`}
                  className="w-full py-2.5 bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white font-bold text-xs rounded-xl border border-violet-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Proposer un contact
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
};
