import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { localStore } from '../lib/supabase';
import { Users2, MapPin, CheckCircle2, UserPlus, Sparkles } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const CommunitiesPage: React.FC = () => {
  const { showToast } = useToast();
  const [communities, setCommunities] = useState(() => localStore.communities);

  const toggleJoin = (comId: string) => {
    const com = communities.find(c => c.id === comId);
    if (com) {
      com.is_joined = !com.is_joined;
      com.member_count += com.is_joined ? 1 : -1;
      setCommunities([...communities]);
      showToast(com.is_joined ? `Vous avez rejoint ${com.name} !` : `Vous avez quitté ${com.name}.`, 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
            <Users2 className="w-3.5 h-3.5" />
            <span>Groupes & Villes</span>
          </div>
          <h1 className="text-3xl font-black text-white">Communautés Locales Dual Meet</h1>
          <p className="text-xs text-slate-400">
            Rejoignez les hubs de votre ville ou de vos passions pour échanger et organiser des sorties facilement.
          </p>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map(com => (
            <div
              key={com.id}
              className="bg-[#0F172A] border border-slate-800 hover:border-cyan-500/50 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={com.image_url}
                  alt={com.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
                <span className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md text-cyan-300 text-[10px] font-extrabold rounded-xl border border-white/10">
                  📍 {com.city || 'Général'}
                </span>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-cyan-300 transition-colors">
                    {com.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {com.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Users2 className="w-4 h-4 text-violet-400" />
                    {com.member_count} membres
                  </span>

                  <button
                    onClick={() => toggleJoin(com.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      com.is_joined
                        ? 'bg-slate-800 text-slate-300 hover:bg-rose-500/20 hover:text-rose-300'
                        : 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md hover:scale-105'
                    }`}
                  >
                    {com.is_joined ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Inscrit(e)</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Rejoindre</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
};
