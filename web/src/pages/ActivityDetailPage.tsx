import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ReportModal } from '../components/ReportModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { localStore } from '../lib/supabase';
import { UserProfile } from '../types';

export const ActivityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const activity = localStore.activities.find(a => a.id === id || a.slug === id) || localStore.activities[0];

  const [requestMessage, setRequestMessage] = useState<string>('');
  const [hasRequested, setHasRequested] = useState<boolean>(() => {
    return localStore.requests.some(r => r.activity_id === activity.id && r.user_id === user?.id);
  });

  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState<boolean>(false);

  const isOrganizer = user?.id === activity.organizer_id;
  const isParticipant = activity.participants?.some(p => p.id === user?.id) || isOrganizer;
  const contactsList = user ? localStore.getContactsList(user.id) : [];

  const formattedDate = new Date(activity.date_time).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    localStore.addRequest(activity.id, user, requestMessage);
    setHasRequested(true);
    showToast('Demande de participation envoyée à l’organisateur !', 'success');
  };

  const handleInviteContact = (contact: UserProfile) => {
    if (!user) return;
    localStore.inviteContactToActivity(user.id, contact.id, activity.id);
    showToast(`Invitation envoyée à ${contact.display_name} !`, 'success');
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
        // Fallback
        navigator.clipboard.writeText(window.location.href);
        showToast('Lien de la sortie copié dans le presse-papier !', 'info');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Lien de la sortie copié dans le presse-papier !', 'info');
    }
  };

  const handleConfirmCancelActivity = () => {
    activity.status = 'cancelled';
    setShowCancelConfirm(false);
    showToast('La sortie a été annulée.', 'info');
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
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-slate-950/40 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-violet-600/90 backdrop-blur-md text-white text-xs font-extrabold rounded-xl uppercase tracking-wider">
              {activity.category}
            </span>
            {activity.is_spontaneous && (
              <span className="px-3 py-1 bg-amber-500/90 text-slate-950 text-xs font-extrabold rounded-xl flex items-center gap-1 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-current" />
                Sortie Spontanée
              </span>
            )}
            <span className="px-3 py-1 bg-emerald-500/90 text-slate-950 text-xs font-extrabold rounded-xl">
              {activity.budget}
            </span>
            {activity.status === 'cancelled' && (
              <span className="px-3 py-1 bg-rose-600 text-white text-xs font-extrabold rounded-xl uppercase">
                Annulée
              </span>
            )}
          </div>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
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
                {activity.description}
              </p>

              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-bold block">Niveau sportif</span>
                  <span className="text-white font-semibold">{activity.fitness_level}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Capacité maximale</span>
                  <span className="text-white font-semibold">{activity.max_participants} personnes</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Type d'événement</span>
                  <span className="text-white font-semibold">
                    {activity.is_two_person ? 'Sortie à deux (Binôme)' : 'Sortie en groupe'}
                  </span>
                </div>
              </div>
            </div>

            {/* Address Security Card */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <MapPin className="w-5 h-5" />
                <h3>Lieu exact du rendez-vous</h3>
              </div>

              {isParticipant ? (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-medium space-y-1">
                  <p className="font-bold text-white">📍 Adresse confirmée :</p>
                  <p>{activity.address || 'Point de rendez-vous transmis par l’organisateur.'}</p>
                </div>
              ) : (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs flex items-center gap-3">
                  <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>
                    L'adresse exacte et les consignes de rendez-vous sont visibles uniquement par les personnes acceptées à la sortie.
                  </span>
                </div>
              )}
            </div>

            {/* Participants Card */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-400" />
                  <span>Participants ({activity.participants?.length || 1}/{activity.max_participants})</span>
                </h3>

                <div className="flex items-center gap-3">
                  {/* Invite Contacts Button */}
                  {user && (
                    <button
                      onClick={() => setIsInviteModalOpen(true)}
                      className="px-3.5 py-1.5 bg-violet-600/30 hover:bg-violet-600 text-violet-300 hover:text-white text-xs font-bold rounded-xl border border-violet-500/40 flex items-center gap-1.5 transition-all"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Inviter des contacts</span>
                    </button>
                  )}

                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                    {activity.max_participants - (activity.participants?.length || 1)} places restantes
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activity.participants?.map(part => (
                  <Link
                    key={part.id}
                    to={`/user/${part.id}`}
                    className="flex items-center gap-3 p-3 bg-slate-900/80 hover:bg-slate-800 rounded-2xl border border-slate-800 transition-colors"
                  >
                    <img
                      src={part.avatar_url}
                      alt={part.display_name}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-violet-500/40"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{part.display_name}</p>
                      <p className="text-[10px] text-slate-400">
                        {part.id === activity.organizer_id ? '👑 Organisateur' : 'Participant'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar Action Card (Right 4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Organizer Profile Snippet */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Proposé par</span>

              <div className="flex items-center gap-3">
                <img
                  src={activity.organizer?.avatar_url}
                  alt={activity.organizer?.display_name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-violet-500"
                />
                <div>
                  <h4 className="font-bold text-white text-base">{activity.organizer?.display_name}</h4>
                  <p className="text-xs text-cyan-400">📍 {activity.organizer?.city}</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed italic">
                « {activity.organizer?.bio || 'Membre passionné de nouvelles rencontres amicales !'} »
              </p>

              <Link
                to={`/user/${activity.organizer?.id}`}
                className="block text-center w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors"
              >
                Voir le profil de l'organisateur
              </Link>
            </div>

            {/* Action Box */}
            <div className="bg-[#0F172A] border border-violet-500/30 rounded-3xl p-6 space-y-4 shadow-2xl">

              {isOrganizer ? (
                <div className="space-y-3">
                  <div className="p-3 bg-violet-600/20 text-violet-300 text-xs font-bold rounded-2xl text-center border border-violet-500/40">
                    👑 Vous êtes l'organisateur de cette sortie
                  </div>

                  <Link
                    to="/requests"
                    className="block w-full text-center py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-lg"
                  >
                    Gérer les demandes reçues
                  </Link>

                  {activity.status !== 'cancelled' && (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="w-full py-2.5 bg-slate-900 hover:bg-rose-500/20 text-rose-400 font-bold text-xs rounded-xl border border-slate-800 transition-colors"
                    >
                      Annuler la sortie
                    </button>
                  )}
                </div>
              ) : isParticipant ? (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-2xl text-center border border-emerald-500/40 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Vous participez à cette activité !</span>
                  </div>

                  <Link
                    to="/messages"
                    className="block w-full text-center py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Ouvrir le tchat de la sortie
                  </Link>
                </div>
              ) : hasRequested ? (
                <div className="p-4 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-2xl text-center border border-amber-500/40 space-y-1">
                  <p>⏳ Demande en attente de réponse</p>
                  <p className="text-[11px] font-normal text-slate-300">L’organisateur examinera votre profil très bientôt.</p>
                </div>
              ) : (
                <form onSubmit={handleSendRequest} className="space-y-3">
                  <h4 className="font-extrabold text-base text-white">Rejoindre la sortie</h4>
                  <p className="text-xs text-slate-400">
                    Envoyez un court message à l'organisateur pour vous présenter.
                  </p>

                  <textarea
                    value={requestMessage}
                    onChange={e => setRequestMessage(e.target.value)}
                    rows={3}
                    placeholder="Salut ! Je serais ravi(e) de participer à cette sortie..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500"
                  />

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Envoyer ma demande de participation
                  </button>
                </form>
              )}

              {/* Utility Buttons */}
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

      {/* Invite Contacts Modal (Section 6) */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-violet-400" />
                <span>Inviter mes contacts</span>
              </h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Sélectionnez un contact pour lui envoyer une invitation directe à cette sortie.
            </p>

            {contactsList.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {contactsList.map(contact => (
                  <div key={contact.id} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={contact.avatar_url} alt={contact.display_name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-xs text-white">{contact.display_name}</p>
                        <p className="text-[10px] text-cyan-400">📍 {contact.city}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInviteContact(contact)}
                      className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow transition-colors"
                    >
                      Inviter
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                Vous n'avez pas encore de contacts acceptés. Rendez-vous sur les profils des membres pour ajouter des contacts.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal before cancelling activity (Section 9) */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 text-white">
            <h3 className="font-bold text-lg flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              Annuler cette activité ?
            </h3>
            <p className="text-xs text-slate-300">
              Êtes-vous sûr de vouloir annuler cette sortie ? Les membres enregistrés seront avertis.
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
                Oui, annuler la sortie
              </button>
            </div>
          </div>
        </div>
      )}

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportedActivityId={activity.id}
        targetName={activity.title}
      />
    </div>
  );
};
