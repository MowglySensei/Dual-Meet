import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <h1 className="text-3xl font-black text-white">Conditions Générales d'Utilisation (CGU)</h1>

        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 space-y-4 text-xs leading-relaxed text-slate-300">
          <h2 className="text-base font-bold text-white">1. Objet du service Dual Meet</h2>
          <p>
            Dual Meet est un service gratuit destiné à faciliter l'organisation de sorties et rencontres strictement amicales et d'activités. La création de profils à des fins de drague ou de rencontres amoureuses y est formellement interdite.
          </p>

          <h2 className="text-base font-bold text-white">2. Gratuité absolue</h2>
          <p>
            Le service est 100% gratuit pour tous ses membres. Aucun abonnement payant ni micro-transaction n'est requis pour accéder à l'intégralité des fonctionnalités.
          </p>

          <h2 className="text-base font-bold text-white">3. Responsabilité de l'organisateur</h2>
          <p>
            Chaque utilisateur est responsable de la sincérité et de la sécurité des activités qu'il propose ou auxquelles il participe.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
