import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ActivityCard } from '../components/ActivityCard';
import { localStore } from '../lib/supabase';
import { Search, Filter, MapPin, Calendar, Users, SlidersHorizontal, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ActivitiesPage: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('Toutes');
  const [categoryFilter, setCategoryFilter] = useState<string>('Toutes');
  const [freeOnly, setFreeOnly] = useState<boolean>(false);
  const [spontaneousOnly, setSpontaneousOnly] = useState<boolean>(false);

  const activities = localStore.activities;

  const cities = ['Toutes', 'Perpignan', 'Montpellier', 'Toulouse'];
  const categories = [
    'Toutes',
    'Randonnée',
    'Bowling',
    'Restaurant',
    'Vélo',
    'Jeux de société',
    'Course à pied',
    'Plage',
    'Sorties culturelles',
    'Café',
  ];

  const filtered = activities.filter(act => {
    const matchSearch = !search || act.title.toLowerCase().includes(search.toLowerCase()) || act.description.toLowerCase().includes(search.toLowerCase());
    const matchCity = cityFilter === 'Toutes' || act.city === cityFilter;
    const matchCategory = categoryFilter === 'Toutes' || act.category === categoryFilter;
    const matchFree = !freeOnly || act.budget.toLowerCase().includes('gratuit');
    const matchSpontaneous = !spontaneousOnly || act.is_spontaneous;

    return matchSearch && matchCity && matchCategory && matchFree && matchSpontaneous;
  });

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Moteur de recherche d’activités</h1>
            <p className="text-sm text-slate-400 mt-1">
              Trouve des sorties amicales selon tes disponibilités et ta localisation.
            </p>
          </div>

          <Link
            to="/activities/create"
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-violet-600/30 hover:scale-105 transition-all self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Créer mon activité
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Mot-clé (ex: Canigou, bowling)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* City Select */}
            <div>
              <select
                value={cityFilter}
                onChange={e => setCityFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                {cities.map(c => (
                  <option key={c} value={c}>
                    📍 Ville : {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Select */}
            <div>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    🏷️ Catégorie : {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Checkbox Toggles */}
            <div className="flex items-center gap-4 text-xs font-semibold">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={freeOnly}
                  onChange={e => setFreeOnly(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-violet-600 focus:ring-violet-500"
                />
                <span>Gratuit uniquement</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={spontaneousOnly}
                  onChange={e => setSpontaneousOnly(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span>Spontané uniquement</span>
              </label>
            </div>

          </div>

        </div>

        {/* Results Count & Grid */}
        <div className="space-y-4">
          <p className="text-xs font-bold text-slate-400">
            {filtered.length} activité(s) trouvée(s)
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(act => (
                <ActivityCard key={act.id} activity={act} />
              ))}
            </div>
          ) : (
            <div className="p-16 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
              <SlidersHorizontal className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="font-bold text-white text-lg">Aucun résultat pour cette recherche</h3>
              <p className="text-xs text-slate-400">Essayez de réinitialiser vos filtres ou de créer une nouvelle sortie.</p>
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
};
