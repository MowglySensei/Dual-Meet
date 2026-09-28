import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Compass, Users, Sparkles, HeartHandshake, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-violet-600/30 text-violet-300 text-xs font-bold rounded-full border border-violet-500/40">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Guide d'utilisation</span>
          </div>
          <h1 className="text-4xl font-black text-white">Comment fonctionne Dual Meet ?</h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Dual Meet est conçu pour être la plateforme de rencontres amicales et d'activités la plus simple, rapide et sécurisée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 space-y-4 text-center">
            <div className="w-16 h-16 bg-violet-600/20 text-violet-400 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto">
              1
            </div>
            <h3 className="font-extrabold text-xl text-white">Inscrivez-vous gratuitement</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Renseignez votre prénom, votre ville, vos passions et votre disponibilité habituelle. Aucun abonnement ni frais cachés.
            </p>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 space-y-4 text-center">
            <div className="w-16 h-16 bg-cyan-600/20 text-cyan-400 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto">
              2
            </div>
            <h3 className="font-extrabold text-xl text-white">Trouvez ou créez une sortie</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recherchez une activité autour de chez vous ou utilisez le bouton « JE VEUX SORTIR » pour proposer votre propre événement.
            </p>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 space-y-4 text-center">
            <div className="w-16 h-16 bg-emerald-600/20 text-emerald-400 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto">
              3
            </div>
            <h3 className="font-extrabold text-xl text-white">Échangez & Sortez</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discutez avec les participants sur le tchat de groupe, retrouvez-vous au point de rendez-vous et créez de superbes amitiés.
            </p>
          </div>

        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Prêt à vivre de nouveaux moments ?</h2>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-xs rounded-2xl shadow-xl hover:scale-105 transition-all"
          >
            Rejoindre Dual Meet gratuitement
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
};
