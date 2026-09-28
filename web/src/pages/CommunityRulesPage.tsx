import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ShieldCheck, HeartHandshake, Smile, XCircle } from 'lucide-react';

export const CommunityRulesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-white">Règles de la Communauté Dual Meet</h1>
          <p className="text-xs text-slate-400">Pour des sorties conviviales, respectueuses et bienveillantes.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-3">
            <HeartHandshake className="w-8 h-8 text-emerald-400" />
            <h3 className="font-bold text-base text-white">1. Esprit strictement amical</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pas d'approche de séduction ou d'attitudes ambiguës. Tout le monde vient pour partager un bon moment et faire des activités.
            </p>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-3">
            <Smile className="w-8 h-8 text-cyan-400" />
            <h3 className="font-bold text-base text-white">2. Politesse & Ponctualité</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              En cas d'impondérable, prévenez l'organisateur à l'avance sur le tchat de la sortie.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
