import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="space-y-4 text-center sm:text-left">
          <h1 className="text-4xl font-black text-white">À propos de Dual Meet</h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Dual Meet fait partie de l'écosystème Dual. Notre mission : rapprocher les personnes grâce aux passions, aux loisirs et aux sorties authentiques, sans aucun filtre superficiel.
          </p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl leading-relaxed text-slate-300 text-sm">
          <h2 className="text-xl font-bold text-white">Notre Philosophie : Moins de matchs. Plus de moments.</h2>
          <p>
            Nous sommes convaincus que les meilleures amitiés se nouent sur le terrain : en grimpant une montagne, en partageant une pizza après une partie de bowling ou en découvrant un nouveau jeu de société.
          </p>
          <p>
            C'est pourquoi Dual Meet est à 100% dédié aux rencontres amicales. Nous luttons activement contre le harcèlement et les comportements ambigus pour vous garantir un environnement sain et rassurant.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
