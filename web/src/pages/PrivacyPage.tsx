import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <h1 className="text-3xl font-black text-white">Politique de Confidentialité</h1>

        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 space-y-4 text-xs leading-relaxed text-slate-300">
          <h2 className="text-base font-bold text-white">1. Protection des données privées</h2>
          <p>
            Dual Meet ne vend et ne commercialise aucune donnée personnelle. Vos informations sensibles (adresse e-mail, localisation exacte) restent confidentielles et ne sont jamais affichées publiquement.
          </p>

          <h2 className="text-base font-bold text-white">2. Géolocalisation approximative</h2>
          <p>
            Pour préserver votre vie privée, les cartes et fiches d'activités utilisent uniquement une géolocalisation approximative par ville ou secteur.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
