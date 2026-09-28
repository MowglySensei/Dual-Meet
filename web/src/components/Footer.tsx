import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { ShieldCheck, Heart, Sparkles, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070A10] border-t border-slate-800/80 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo showTagline size="lg" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Dual Meet est la plateforme sociale gratuite pour trouver des compagnons de sorties, de sport et d'activités près de chez soi. Pas de rencontre amoureuse, juste de vrais moments partagés.
            </p>
            <div className="flex items-center gap-3 text-xs text-violet-300 bg-violet-950/40 border border-violet-800/40 p-3 rounded-2xl max-w-sm font-semibold">
              <ShieldCheck className="w-5 h-5 text-violet-400 shrink-0" />
              <span>100% Gratuit — Aucune option payante, sécurité & modération garantie.</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Découvrir</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link to="/explore" className="hover:text-violet-300 transition-colors">Découvrir les activités</Link></li>
              <li><Link to="/how-it-works" className="hover:text-violet-300 transition-colors">Comment ça marche</Link></li>
              <li><Link to="/partners" className="hover:text-violet-300 transition-colors">Partenaires réguliers</Link></li>
              <li><Link to="/communities" className="hover:text-violet-300 transition-colors">Communautés locales</Link></li>
              <li><Link to="/map" className="hover:text-violet-300 transition-colors">Carte des sorties</Link></li>
            </ul>
          </div>

          {/* Institutional Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">À propos</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link to="/about" className="hover:text-violet-300 transition-colors">À propos de Dual Meet</Link></li>
              <li><Link to="/contact" className="hover:text-violet-300 transition-colors">Contact & Support</Link></li>
              <li><Link to="/community-rules" className="hover:text-violet-300 transition-colors">Règles de la communauté</Link></li>
              <li><Link to="/help" className="hover:text-violet-300 transition-colors">Centre d'aide</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Légal</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link to="/terms" className="hover:text-violet-300 transition-colors">Conditions d'utilisation (CGU)</Link></li>
              <li><Link to="/privacy" className="hover:text-violet-300 transition-colors">Politique de confidentialité</Link></li>
              <li><Link to="/cookies" className="hover:text-violet-300 transition-colors">Gestion des cookies</Link></li>
              <li><Link to="/security" className="hover:text-violet-300 transition-colors">Sécurité des membres</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p>© 2025 Dual Meet — Fait avec passion pour des rencontres amicales authentiques.</p>
          <div className="flex items-center gap-6">
            <span>Écosystème Dual</span>
            <span>•</span>
            <span>Perpignan, France</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
