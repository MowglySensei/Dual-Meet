import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Compass, ArrowLeft, Sparkles } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6">

        <div className="p-5 bg-violet-600/20 text-violet-400 rounded-3xl border border-violet-500/30">
          <Compass className="w-16 h-16 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Erreur 404</span>
          <h1 className="text-4xl font-black text-white">Page introuvable</h1>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Oups ! La page que vous cherchez n'existe pas ou a été déplacée. Pas de panique, de nombreuses sorties amicales vous attendent !
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="px-6 py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-violet-600/30 transition-all hover:scale-105 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Découvrir les activités
          </Link>

          <Link
            to="/"
            className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
};
