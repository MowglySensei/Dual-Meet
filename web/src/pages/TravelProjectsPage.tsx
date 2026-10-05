import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { api, COUNTRY_GUIDES, isSupabaseConfigured } from '../lib/supabase';
import { TravelProject, CountryGuide } from '../types';
import {
  Plane,
  PlusCircle,
  Calendar,
  MapPin,
  Users,
  Compass,
  DollarSign,
  Clock,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const TravelProjectsPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('Tous');
  const [projects, setProjects] = useState<TravelProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const data = await api.getTravelProjects();
      setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const countries = ['Tous', 'Australie', 'Canada', 'Nouvelle-Zélande', 'Japon', 'Corée du Sud'];

  const filteredProjects = projects.filter(p =>
    selectedCountry === 'Tous' || p.country.toLowerCase().includes(selectedCountry.toLowerCase())
  );

  const activeGuide = COUNTRY_GUIDES.find(g => g.country.toLowerCase() === selectedCountry.toLowerCase());

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Banner Hero */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-violet-950/70 via-slate-900 to-cyan-950/50 border border-violet-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-violet-600/30 text-violet-300 text-xs font-bold rounded-full border border-violet-500/40">
              <Plane className="w-4 h-4 text-cyan-300" />
              <span>Section VOYAGER & PVT (Working Holiday)</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Partir à l'étranger, <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">mais pas seul.</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Tu rêves d'un PVT en Australie, au Canada, au Japon ou en Nouvelle-Zélande ? Trouve des compagnons pour monter un projet de départ, partager un logement ou partir en roadtrip.
            </p>
          </div>

          <Link
            to="/travel/create"
            className="px-6 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-violet-600/30 hover:scale-105 transition-all shrink-0 flex items-center gap-2 relative z-10"
          >
            <PlusCircle className="w-5 h-5" />
            Créer un projet de voyage / PVT
          </Link>
        </div>

        {/* Destination Country Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {countries.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedCountry === c
                  ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {c === 'Australie' && '🇦🇺 '}
              {c === 'Canada' && '🇨🇦 '}
              {c === 'Nouvelle-Zélande' && '🇳🇿 '}
              {c === 'Japon' && '🇯🇵 '}
              {c === 'Corée du Sud' && '🇰🇷 '}
              {c}
            </button>
          ))}
        </div>

        {/* PROJECTS FEED GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-xl text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>
                {selectedCountry === 'Tous' ? 'Projets de voyage & PVT disponibles' : `Projets pour ${selectedCountry}`}
              </span>
            </h2>
            <span className="text-xs text-slate-400 font-semibold">{filteredProjects.length} projet(s)</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">Chargement des projets de voyage...</div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(proj => (
                <div
                  key={proj.id}
                  className="bg-[#0F172A] border border-slate-800 hover:border-violet-500/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all group"
                >
                  <div className="space-y-3">
                    {/* Country & Visa Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-xs font-bold text-white rounded-xl flex items-center gap-1.5">
                        <span className="text-base">{proj.country_flag}</span>
                        <span>{proj.country}</span>
                      </span>

                      <span className="px-2.5 py-1 bg-violet-600/20 text-violet-300 text-[11px] font-extrabold rounded-xl border border-violet-500/30">
                        {proj.visa_type}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-bold text-base text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      « {proj.description} »
                    </p>

                    {/* Details Box */}
                    <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Départ prévu :</span>
                        <span className="text-white font-semibold">{proj.departure_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Ville d'arrivée :</span>
                        <span className="text-cyan-400 font-semibold">{proj.arrival_city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Budget indicatif :</span>
                        <span className="text-emerald-400 font-semibold">{proj.estimated_budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Style :</span>
                        <span className="text-slate-200 font-semibold">{proj.travel_style}</span>
                      </div>
                    </div>
                  </div>

                  {/* Organizer & Action */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 mt-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={proj.organizer?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                        alt={proj.organizer?.display_name || 'Organisateur'}
                        className="w-8 h-8 rounded-xl object-cover ring-2 ring-violet-500/40"
                      />
                      <span className="text-xs font-bold text-slate-300 truncate max-w-[100px]">
                        {proj.organizer?.display_name || 'Organisateur'}
                      </span>
                    </div>

                    <Link
                      to={`/travel/${proj.id}`}
                      className="px-4 py-2 bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white font-extrabold text-xs rounded-xl border border-violet-500/30 transition-all shrink-0"
                    >
                      Voir le projet
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
              <Plane className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="font-bold text-white text-lg">Pas encore de projet de voyage</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Tu veux partir, mais pas forcément seul ? Crée le premier projet de départ !
              </p>
              <Link
                to="/travel/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-lg"
              >
                <PlusCircle className="w-4 h-4" />
                Créer le premier projet de voyage
              </Link>
            </div>
          )}
        </div>

        {/* COUNTRY GUIDE CARD SECTION (INFORMATIF ET PRATIQUE) */}
        {activeGuide && (
          <div className="bg-[#0F172A] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeGuide.flag}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">Guide Officiel & Visa : {activeGuide.country}</h3>
                  <p className="text-xs text-cyan-400">{activeGuide.visa_name}</p>
                </div>
              </div>

              {activeGuide.official_url && (
                <a
                  href={activeGuide.official_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/30 transition-colors inline-flex items-center gap-1.5 shrink-0"
                >
                  <span>Site Officiel Immigration ↗</span>
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold uppercase block">Conditions d'éligibilité</span>
                <p className="text-slate-200 font-medium">{activeGuide.conditions}</p>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-bold uppercase block">Coût officiel du Visa</span>
                <p className="text-emerald-400 font-bold">{activeGuide.cost}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider">Conseils pratiques :</h4>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                {activeGuide.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 text-[11px] text-slate-400">
              <span className="font-bold text-amber-300">⚠️ Avertissement Légal :</span> Dual Meet n'est pas une autorité gouvernementale. Pour toutes vos démarches administratives officielles, référez-vous toujours aux sites d'immigration officiels de chaque gouvernement.
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
