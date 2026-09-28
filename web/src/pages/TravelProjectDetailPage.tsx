import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Plane,
  Calendar,
  MapPin,
  Users,
  User,
  Clock,
  CheckCircle2,
  MessageSquare,
  Share2,
  ShieldAlert,
  Send,
  ChevronLeft,
  DollarSign,
  Compass,
  Home,
  Languages
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ReportModal } from '../components/ReportModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api, COUNTRY_GUIDES, isSupabaseConfigured } from '../lib/supabase';
import { TravelProject, UserProfile } from '../types';

export const TravelProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [project, setProject] = useState<TravelProject | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [requestMessage, setRequestMessage] = useState<string>('');
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const all = await api.getTravelProjects();
      const found = all.find(p => p.id === id) || all[0] || null;
      setProject(found);
      if (found && user) {
        setHasJoined(found.participants?.some(p => p.id === user.id) || found.organizer_id === user.id);
      }
      setLoading(false);
    };
    fetchProject();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        <Navbar />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-20 text-center space-y-4">
          <Plane className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold">Projet introuvable</h2>
          <Link to="/travel" className="px-4 py-2 bg-violet-600 text-white font-bold text-xs rounded-xl inline-block">
            Retour aux projets de voyage
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isOrganizer = user?.id === project.organizer_id;
  const guide = COUNTRY_GUIDES.find(g => g.country.toLowerCase() === project.country.toLowerCase());

  const handleJoinProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!project.participants) project.participants = [project.organizer!];
    if (!project.participants.some(p => p.id === user.id)) {
      project.participants.push(user);
      project.current_participants_count = project.participants.length;
    }

    setHasJoined(true);
    showToast('Demande envoyée pour rejoindre le groupe de voyage !', 'success');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Lien du projet de voyage copié !', 'info');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Back Link */}
        <button
          onClick={() => navigate('/travel')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour aux projets de voyage
        </button>

        {/* Hero Banner */}
        <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-violet-950/80 via-slate-900 to-cyan-950/60 border border-violet-500/30 shadow-2xl space-y-4 overflow-hidden">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{project.country_flag}</span>
            <span className="px-3 py-1 bg-violet-600/30 text-violet-300 text-xs font-extrabold rounded-xl border border-violet-500/40">
              {project.visa_type}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-violet-400" />
              <span>Départ : {project.departure_date}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Arrivée : {project.arrival_city}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Budget : {project.estimated_budget}</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Specs (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Description */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h2 className="font-extrabold text-xl text-white">Présentation du projet de départ</h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {project.description || 'Aucune description détaillée renseignée.'}
              </p>

              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block">Style de voyage</span>
                  <span className="text-white font-semibold">{project.travel_style}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Logement prévu</span>
                  <span className="text-white font-semibold">{project.housing_plan}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Niveau de langue</span>
                  <span className="text-white font-semibold">{project.language_level}</span>
                </div>
              </div>
            </div>

            {/* Country Official Info Guide */}
            {guide && (
              <div className="bg-[#0F172A] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{guide.flag}</span>
                  <div>
                    <h3 className="font-extrabold text-lg text-white">Fiche Pratique & Démarches : {guide.country}</h3>
                    <p className="text-xs text-cyan-400">{guide.visa_name}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <p><strong className="text-white">Conditions :</strong> {guide.conditions}</p>
                  <p><strong className="text-white">Coût du visa :</strong> <span className="text-emerald-400 font-bold">{guide.cost}</span></p>
                  <p><strong className="text-white">Villes populaires :</strong> {guide.popular_cities.join(', ')}</p>
                </div>

                <div className="pt-2 text-xs space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">Conseils utiles :</span>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {guide.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Participants */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-400" />
                  <span>Groupe de départ ({project.participants?.length || 1}/{project.max_participants})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.participants?.map(part => (
                  <Link
                    key={part.id}
                    to={`/user/${part.id}`}
                    className="flex items-center gap-3 p-3 bg-slate-900/80 hover:bg-slate-800 rounded-2xl border border-slate-800 transition-colors"
                  >
                    <img
                      src={part.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                      alt={part.display_name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-violet-500/40"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{part.display_name}</p>
                      <p className="text-[10px] text-slate-400">
                        {part.id === project.organizer_id ? '👑 Initiateur du projet' : 'Compagnon de voyage'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Right Action Sidebar (Right 4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Organizer Card */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Projet proposé par</span>

              <div className="flex items-center gap-3">
                <img
                  src={project.organizer?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                  alt={project.organizer?.display_name || 'Organisateur'}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-violet-500"
                />
                <div>
                  <h4 className="font-bold text-white text-base">{project.organizer?.display_name}</h4>
                  <p className="text-xs text-cyan-400">📍 {project.organizer?.city || 'Ville non renseignée'}</p>
                </div>
              </div>

              <Link
                to={`/user/${project.organizer?.id}`}
                className="block text-center w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors"
              >
                Voir le profil
              </Link>
            </div>

            {/* Action Box */}
            <div className="bg-[#0F172A] border border-violet-500/30 rounded-3xl p-6 space-y-4 shadow-2xl">

              {isOrganizer ? (
                <div className="p-3 bg-violet-600/20 text-violet-300 text-xs font-bold rounded-2xl text-center border border-violet-500/40">
                  👑 Vous êtes l'initiateur de ce projet de voyage
                </div>
              ) : hasJoined ? (
                <div className="p-3 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-2xl text-center border border-emerald-500/40 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Vous faites partie de ce groupe de voyage !</span>
                </div>
              ) : (
                <form onSubmit={handleJoinProject} className="space-y-3">
                  <h4 className="font-extrabold text-base text-white">Rejoindre ce groupe de départ</h4>
                  <p className="text-xs text-slate-400">
                    Présentez votre projet de départ et contactez l'initiateur.
                  </p>

                  <textarea
                    value={requestMessage}
                    onChange={e => setRequestMessage(e.target.value)}
                    rows={3}
                    placeholder="Salut ! Je prévois aussi de partir en PVT à cette période..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500"
                  />

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer ma candidature au groupe
                  </button>
                </form>
              )}

              {/* Utility */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white font-semibold transition-colors"
                >
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>Partager le projet</span>
                </button>

                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-rose-400 font-semibold transition-colors"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Signaler</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </main>

      <Footer />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetName={project.title}
      />
    </div>
  );
};
