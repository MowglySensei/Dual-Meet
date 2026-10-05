import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  UserPlus,
  Clock,
  CheckCircle2,
  MessageSquare,
  Share2,
  ShieldAlert,
  Send,
  Zap,
  Lock,
  ChevronLeft,
  UserCheck,
  AlertTriangle,
  X,
  XCircle,
  ShieldCheck,
  UserMinus,
  Edit,
  Car
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ReportModal } from '../components/ReportModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { localStore, supabase, isSupabaseConfigured, api } from '../lib/supabase';
import { UserProfile, Activity } from '../types';

export const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [requestMessage, setRequestMessage] = useState<string>('');
  const [hasRequested, setHasRequested] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);
  const [submittingAction, setSubmittingAction] = useState<boolean>(false);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      setLoading(true);
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('activities')
            .select('*, organizer:profiles(*), participants:activity_participants(user:profiles(*))')
            .eq('id', id)
            .single();

          if (!error && data) {
            setActivity(data as Activity);
          } else {
            const fallback = localStore.activities.find(a => a.id === id || a.slug === id);
            setActivity(fallback || null);
          }
        } catch (e) {
          const fallback = localStore.activities.find(a => a.id === id || a.slug === id);
          setActivity(fallback || null);
        }
      } else {
        const fallback = localStore.activities.find(a => a.id === id || a.slug === id);
        setActivity(fallback || null);
      }
      setLoading(false);
    };

    fetchActivityDetails();
  }, [id]);

  useEffect(() => {
    if (activity && user) {
      setHasRequested(localStore.requests.some(r => r.activity_id === activity.id && r.user_id === user.id));
    }
  }, [activity, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-violet-500" />
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        <Navbar />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-20 text-center space-y-4">
          <Zap className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-2xl font-bold">Activité introuvable</h2>
          <p className="text-xs text-slate-400">Cette sortie n'existe pas ou a été annulée.</p>
          <Link to="/activities" className="px-5 py-2.5 bg-violet-600 text-white font-bold text-xs rounded-xl inline-block">
            Retour aux activités
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const isOrganizer = user?.id === activity.organizer_id;
  const participantsList = activity.participants || [activity.organizer!];
  const isParticipant = participantsList.some(p => p.id === user?.id) || isOrganizer;

  const realCount = participantsList.length;
  const isFull = realCount >= activity.max_participants || activity.status === 'full';
  const isCancelled = activity.status === 'cancelled';
  const isPast = new Date(activity.date_time).getTime() < Date.now();

  const formattedDate = new Date(activity.date_time).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Handle Joining Activity
  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (isFull) {
      showToast('Cette activité est déjà complète.', 'error');
      return;
    }

    setSubmittingAction(true);
    try {
      if (isSupabaseConfigured) {
        // Direct insertion into activity_participants
        const { error: joinError } = await supabase
          .from('activity_participants')
          .insert({ activity_id: activity.id, user_id: user.id });

        if (joinError) throw joinError;

        // Create notification for organizer
        await supabase.from('notifications').insert({
          user_id: activity.organizer_id,
          type: 'activity_request_received',
          title: 'Nouveau participant !',
          message: `${user.display_name} s'est inscrit(e) à votre sortie "${activity.title}".`,
          link: `/activity/${activity.id}`,
          is_read: false,
        });
      }

      // Update local state
      const updatedParticipants = [...participantsList, user];
      setActivity({
        ...activity,
        participants: updatedParticipants,
        current_participants_count: updatedParticipants.length,
      });

      setHasRequested(true);
      showToast('Votre participation a été enregistrée avec succès !', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Erreur lors de la demande de participation.', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Handle Leaving Activity
  const handleLeaveActivity = async () => {
    if (!user || isOrganizer) return;

    setSubmittingAction(true);
    try {
      if (isSupabaseConfigured) {
        await supabase
          .from('activity_participants')
          .delete()
          .eq('activity_id', activity.id)
          .eq('user_id', user.id);
      }

      const updatedParticipants = participantsList.filter(p => p.id !== user.id);
      setActivity({
        ...activity,
        participants: updatedParticipants,
        current_participants_count: updatedParticipants.length,
      });

      setHasRequested(false);
      showToast('Votre participation a été annulée.', 'info');
    } catch (err: any) {
      showToast('Erreur lors de la désinscription.', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Organizer Cancels Activity
  const handleConfirmCancelActivity = async () => {
    setSubmittingAction(true);
    try {
      if (isSupabaseConfigured) {
        await supabase
          .from('activities')
          .update({ status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('id', activity.id);
      }

      setActivity({ ...activity, status: 'cancelled' });
      setShowCancelConfirm(false);
      showToast('La sortie a été annulée.', 'info');
    } catch (err: any) {
      showToast('Erreur lors de l’annulation de l’activité.', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: activity.title,
      text: `Rejoins-moi pour la sortie "${activity.title}" sur Dual Meet !`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Activité partagée !', 'success');
      } catch (err) {
        navigator.clipboard.writeText(window.location.href);
        showToast('Lien copié dans le presse-papier !', 'info');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Lien copié dans le presse-papier !', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour aux sorties
        </button>

        {/* Hero Section Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl h-80 sm:h-96">
          <img
            src={activity.image_url}
            alt={activity.title}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-slate-950/40 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
            <span className="px-3 py-1 bg-violet-600/90 backdrop-blur-md text-white text-xs font-extrabold rounded-xl uppercase tracking-wider">
              {activity.category}
            </span>

            {activity.is_spontaneous && !isCancelled && (
              <span className="px-3 py-1 bg-amber-500/90 text-slate-950 text-xs font-extrabold rounded-xl flex items-center gap-1 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Sortie Spontanée
              </span>
            )}

            {activity.has_carpooling && (
              <span className="px-3 py-1 bg-emerald-500/90 text-slate-950 text-xs font-extrabold rounded-xl flex items-center gap-1">
                🚗 Covoiturage
              </span>
            )}

            <span className="px-3 py-1 bg-slate-900/90 text-emerald-400 text-xs font-extrabold rounded-xl border border-white/10">
              {activity.budget || 'Gratuit'}
            </span>

            {isCancelled && (
              <span className="px-3 py-1 bg-rose-600 text-white text-xs font-extrabold rounded-xl uppercase">
                Annulée
              </span>
            )}

            {isPast && !isCancelled && (
              <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-extrabold rounded-xl uppercase">
                Terminée
              </span>
            )}
          </div>

          <div className="absolute bottom-6 left-6 right-6 space-y-2 z-10">
            <div className="flex items-center gap-2 text-violet-300 text-xs font-bold capitalize">
              <Calendar className="w-4 h-4 text-violet-400" />
              <span>{formattedDate}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {activity.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold">{activity.city} (Secteur approximatif)</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Details (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Description Card */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <h2 className="font-extrabold text-xl text-white">À propos de cette sortie</h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {activity.description || 'Aucune description détaillée.'}
              </p>

              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block">Niveau physique</span>
                  <span className="text-white font-semibold">{activity.fitness_level || 'Tous niveaux'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Budget</span>
                  <span className="text-emerald-400 font-bold">{activity.budget || 'Gratuit'}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Places</span>
                  <span className="text-cyan-400 font-bold">{realCount} / {activity.max_participants} participants</span>
                </div>
              </div>
            </div>

            {/* Private Location Box (Protected Privacy) */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>Lieu de rendez-vous</span>
              </h3>

              {isParticipant ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs space-y-1">
                  <span className="font-extrabold text-emerald-300 block">📍 Adresse exacte déverrouillée :</span>
                  <p className="text-white font-bold">{activity.address || `Centre-ville de ${activity.city}`}</p>
                </div>
              ) : (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs flex items-center gap-3 text-slate-400">
                  <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                  <p>
                    <strong className="text-white">Adresse exacte masquée.</strong> Le lieu de rendez-vous précis est automatiquement révélé uniquement aux participants confirmés.
                  </p>
                </div>
              )}
            </div>

            {/* Registered Participants */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-400" />
                  <span>Participants inscrits ({realCount}/{activity.max_participants})</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {participantsList.map(part => (
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
                      <p className="text-[10px] text-slate-400 truncate">
                        {part.id === activity.organizer_id ? '👑 Organisateur' : 'Participant inscrit'}
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
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Organisé par</span>

              <div className="flex items-center gap-3">
                <img
                  src={activity.organizer?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                  alt={activity.organizer?.display_name || 'Organisateur'}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-violet-500"
                />
                <div>
                  <h4 className="font-bold text-white text-base">{activity.organizer?.display_name}</h4>
                  <p className="text-xs text-cyan-400">📍 {activity.organizer?.city || 'Ville non renseignée'}</p>
                </div>
              </div>

              <Link
                to={`/user/${activity.organizer?.id}`}
                className="block text-center w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors"
              >
                Voir le profil
              </Link>
            </div>

            {/* Action Box */}
            <div className="bg-[#0F172A] border border-violet-500/30 rounded-3xl p-6 space-y-4 shadow-2xl">

              {isCancelled ? (
                <div className="p-4 bg-rose-500/20 text-rose-300 text-xs font-bold rounded-2xl text-center border border-rose-500/40">
                  Cette activité a été annulée par l'organisateur.
                </div>
              ) : isPast ? (
                <div className="p-4 bg-slate-800 text-slate-400 text-xs font-bold rounded-2xl text-center border border-slate-700">
                  Cette activité est terminée.
                </div>
              ) : isOrganizer ? (
                <div className="space-y-3">
                  <div className="p-3 bg-violet-600/20 text-violet-300 text-xs font-bold rounded-2xl text-center border border-violet-500/40">
                    👑 Vous êtes l'organisateur de cette sortie
                  </div>

                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full py-2.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs rounded-xl border border-rose-500/40 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Annuler la sortie
                  </button>
                </div>
              ) : isParticipant ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-2xl text-center border border-emerald-500/40 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Vous êtes inscrit(e) à cette sortie !</span>
                  </div>

                  <button
                    onClick={handleLeaveActivity}
                    disabled={submittingAction}
                    className="w-full py-2.5 bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <UserMinus className="w-4 h-4" />
                    <span>Annuler ma participation</span>
                  </button>
                </div>
              ) : isFull ? (
                <div className="p-4 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-2xl text-center border border-amber-500/40">
                  ⚠️ Capacité maximale atteinte ({realCount}/{activity.max_participants}).
                </div>
              ) : (
                <form onSubmit={handleSendRequest} className="space-y-3">
                  <h4 className="font-extrabold text-base text-white">Participer à cette sortie</h4>
                  <p className="text-xs text-slate-400">
                    Rejoins la sortie en un clic. L'adresse exacte te sera révélée automatiquement.
                  </p>

                  <button
                    type="submit"
                    disabled={submittingAction}
                    className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submittingAction ? 'Inscription...' : 'Rejoindre la sortie'}</span>
                  </button>
                </form>
              )}

              {/* Share & Report */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-white font-semibold transition-colors"
                >
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>Partager</span>
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

      {/* Confirm Cancel Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 text-white">
            <h3 className="font-bold text-lg flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              Annuler cette sortie ?
            </h3>
            <p className="text-xs text-slate-300">
              Tous les participants seront notifiés de l'annulation de la sortie.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={handleConfirmCancelActivity}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg"
              >
                Oui, annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetName={activity.title}
      />
    </div>
  );
};
