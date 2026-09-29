import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Calendar,
  Zap,
  Users,
  Search,
  PlusCircle,
  Compass,
  UserCheck,
  Bell,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ActivityCard } from '../components/ActivityCard';
import { ActivityCardSkeleton } from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';
import { localStore, supabase, isSupabaseConfigured, api } from '../lib/supabase';
import { Activity } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [feedMode, setFilterFeedMode] = useState<'priority' | 'contacts' | 'spontaneous'>('priority');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activitiesList, setActivitiesList] = useState<Activity[]>([]);

  const [realStats, setRealStats] = useState({
    members: 1,
    online: 1,
    activities: 0,
    participations: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const acts = await api.getActivities();
      setActivitiesList(acts);

      if (isSupabaseConfigured) {
        try {
          const { count: pCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
          const { count: aCount } = await supabase.from('activities').select('*', { count: 'exact', head: true });
          const { count: partCount } = await supabase.from('activity_participants').select('*', { count: 'exact', head: true });

          setRealStats({
            members: pCount || 1,
            online: 1,
            activities: aCount || 0,
            participations: partCount || 0,
          });
        } catch (e) {
          // fallback
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Smart Priority Feed (Section 2 & 5)
  const priorityActivities = localStore.getPriorityFeed(user, activitiesList);
  const contactsList = user ? localStore.getContactsList(user.id) : [];
  const contactIds = contactsList.map(c => c.id);

  const myUpcomingOutings = activitiesList.filter(
    a => a.participants?.some(p => p.id === user?.id) || a.organizer_id === user?.id
  ).slice(0, 2);

  const pendingNotifsCount = localStore.notifications.filter(n => !n.is_read).length;

  const spontaneousActivities = activitiesList.filter(a => a.is_spontaneous && a.status === 'open');
  const contactActivities = activitiesList.filter(a => contactIds.includes(a.organizer_id));

  const activeSource = feedMode === 'contacts' ? contactActivities : feedMode === 'spontaneous' ? spontaneousActivities : priorityActivities;

  const filteredActivities = activeSource.filter(act => {
    const matchCat = selectedCategory === 'Toutes' || act.category === selectedCategory;
    const matchQuery = !searchQuery ||
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

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
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* Welcome & Quick Action Hero */}
        <div className="relative rounded-3xl bg-gradient-to-r from-violet-900/60 via-slate-900 to-cyan-900/40 border border-violet-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/30 text-violet-300 text-xs font-bold border border-violet-500/40">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>Espace Membre Dual Meet</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ravi de te revoir, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">{user?.display_name || 'Ami Dual Meet'}</span> !
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Que souhaites-tu faire aujourd'hui ? Propose une sortie ou rejoins des membres motivés près de chez toi.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/activities/create"
                className="px-6 py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-xl shadow-violet-600/30 hover:scale-105 transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Créer une activité
              </Link>

              <Link
                to="/map"
                className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
              >
                <MapPin className="w-4 h-4 text-cyan-400" />
                Voir la carte interactive
              </Link>
            </div>
          </div>
        </div>

        {/* REAL DYNAMIC COMMUNITY STATS BAR (0 MYTHO) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-around gap-4 text-xs font-bold text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white font-extrabold text-sm">{realStats.members}</span>
            <span className="text-slate-400">{realStats.members > 1 ? 'membres inscrits' : 'membre inscrit'}</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-cyan-300 font-extrabold text-sm">{realStats.online}</span>
            <span className="text-slate-400">en ligne en ce moment</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <span className="text-violet-400 text-sm">⚡</span>
            <span className="text-white font-extrabold text-sm">{realStats.activities}</span>
            <span className="text-slate-400">{realStats.activities > 1 ? 'activités proposées' : 'activité proposée'}</span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-sm">🤝</span>
            <span className="text-white font-extrabold text-sm">{realStats.participations}</span>
            <span className="text-slate-400">{realStats.participations > 1 ? 'participations amicales' : 'participation amicale'}</span>
          </div>
        </div>

        {/* MY UPCOMING OUTINGS & NOTIFICATIONS SUMMARY ROW (Section 2) */}
        {myUpcomingOutings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Upcoming outings card */}
            <div className="md:col-span-2 bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-violet-400" />
                  <span>Mes prochaines sorties</span>
                </h3>
                <Link to="/my-activities" className="text-xs font-bold text-violet-400 hover:underline">
                  Voir tout ({activitiesList.length}) →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myUpcomingOutings.map(act => (
                  <div key={act.id} className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="px-2 py-0.5 bg-violet-600/30 text-violet-300 text-[10px] font-bold rounded uppercase">
                        {act.category}
                      </span>
                      <h4 className="font-bold text-xs text-white mt-1 line-clamp-1">{act.title}</h4>
                      <p className="text-[10px] text-slate-400">📍 {act.city}</p>
                    </div>
                    <Link to={`/activity/${act.id}`} className="px-3 py-1.5 bg-violet-600 text-white font-bold text-[10px] rounded-lg shadow shrink-0">
                      Voir
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Notifs Summary */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    <Bell className="w-5 h-5 text-cyan-400" />
                    <span>Notifications</span>
                  </h3>
                  {pendingNotifsCount > 0 && (
                    <span className="px-2.5 py-0.5 bg-cyan-500 text-slate-950 font-black text-xs rounded-full">
                      {pendingNotifsCount} nouvelle(s)
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {pendingNotifsCount > 0 ? `Vous avez ${pendingNotifsCount} notification(s) en attente.` : 'Aucune nouvelle notification pour le moment.'}
                </p>
              </div>

              <Link
                to="/notifications"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl text-center block transition-colors"
              >
                Accéder aux notifications
              </Link>
            </div>

          </div>
        )}

        {/* FEED FILTER BAR & SEARCH (Section 5) */}
        <div className="space-y-6">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">

            {/* Feed Mode Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start">
              <button
                onClick={() => setFilterFeedMode('priority')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  feedMode === 'priority'
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎯 Fil Prioritaire
              </button>

              <button
                onClick={() => setFilterFeedMode('contacts')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  feedMode === 'contacts'
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Mes Contacts ({contactsList.length})</span>
              </button>

              <button
                onClick={() => setFilterFeedMode('spontaneous')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  feedMode === 'spontaneous'
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span>Spontanés ({spontaneousActivities.length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre, ville..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ACTIVITIES FEED GRID */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ActivityCardSkeleton />
              <ActivityCardSkeleton />
              <ActivityCardSkeleton />
            </div>
          ) : filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map(act => (
                <ActivityCard key={act.id} activity={act} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#0F172A] rounded-3xl border border-slate-800 space-y-4">
              <Compass className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="font-extrabold text-white text-lg">Aucune activité pour le moment dans ce secteur</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Soyez le tout premier membre à proposer une sortie conviviale près de chez vous !
              </p>
              <Link
                to="/activities/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Créer la première activité
              </Link>
            </div>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
};
