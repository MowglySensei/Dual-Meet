import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ReportModal } from '../components/ReportModal';
import { MOCK_USERS, localStore } from '../lib/supabase';
import {
  UserPlus,
  UserCheck,
  Clock,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Calendar,
  Users2,
  Award,
  Images,
  UserMinus,
  XCircle,
  MapPin,
  X,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { RelationshipStatus, UserProfile } from '../types';

export const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const isSelf = !id || currentUser?.id === id;
  const profileUser: UserProfile | null = isSelf
    ? currentUser
    : (MOCK_USERS.find(u => u.id === id) || null);

  const [relationshipStatus, setRelationshipStatus] = useState<RelationshipStatus>(() => {
    if (!currentUser || !profileUser) return 'none';
    return localStore.getRelationshipStatus(currentUser.id, profileUser.id);
  });

  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<boolean>(false);

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
        <Navbar />
        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6">
          <div className="p-4 bg-slate-900 rounded-3xl border border-slate-800">
            <Compass className="w-12 h-12 text-slate-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-white">Profil introuvable</h2>
          <p className="text-xs text-slate-400">Ce profil n'existe pas ou a été retiré.</p>
          <Link to="/dashboard" className="px-5 py-2.5 bg-violet-600 text-white font-bold text-xs rounded-xl">
            Retour au tableau de bord
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const userActivities = localStore.activities.filter(a => a.organizer_id === profileUser.id);

  // Social Contact Actions
  const handleAddContact = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    localStore.sendContactRequest(currentUser.id, profileUser.id);
    setRelationshipStatus('pending_sent');
    showToast('Demande de contact amical envoyée !', 'success');
  };

  const handleAcceptContact = () => {
    if (!currentUser) return;
    localStore.acceptContactRequest(currentUser.id, profileUser.id);
    setRelationshipStatus('accepted');
    showToast(`Vous êtes désormais en contact avec ${profileUser.display_name} !`, 'success');
  };

  const handleConfirmRemoveContact = () => {
    if (!currentUser) return;
    localStore.removeContact(currentUser.id, profileUser.id);
    setRelationshipStatus('none');
    setShowRemoveConfirm(false);
    showToast(`Contact retiré.`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Profile Header Box */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">

            {/* Main Avatar */}
            <div className="relative group cursor-pointer" onClick={() => setSelectedImage(profileUser.avatar_url)}>
              <img
                src={profileUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={profileUser.display_name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-violet-500/50 shadow-xl group-hover:opacity-90 transition-opacity"
              />
              <span className="absolute bottom-1 right-1 p-1.5 bg-slate-950/80 rounded-xl text-violet-300 text-[10px] font-bold">
                🔍
              </span>
            </div>

            <div className="space-y-2 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{profileUser.display_name}</h1>

                <span className="px-3 py-1 bg-violet-600/30 text-violet-300 text-xs font-bold rounded-xl border border-violet-500/40 self-center sm:self-auto">
                  Membre Dual Meet
                </span>
              </div>

              <p className="text-xs text-cyan-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{profileUser.city || 'Ville non renseignée'} • {profileUser.age || 25} ans</span>
              </p>

              <p className="text-xs text-slate-300 leading-relaxed max-w-xl italic">
                « {profileUser.bio || 'Aucune biographie rédigée pour le moment.'} »
              </p>
            </div>
          </div>

          {/* Social Stats Row */}
          {profileUser.show_activity_stats !== false && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-center">
              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                <p className="text-lg font-black text-violet-400">{profileUser.stats?.organized_count || userActivities.length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Organisées</p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                <p className="text-lg font-black text-cyan-400">{profileUser.stats?.joined_count || 0}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Rejointes</p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                <p className="text-lg font-black text-emerald-400">{profileUser.stats?.communities_count || 0}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Communautés</p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                <p className="text-lg font-black text-amber-400">{profileUser.stats?.badges_count || 0}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Badges</p>
              </div>
            </div>
          )}

          {/* Activity Levels Section */}
          {profileUser.activity_levels && Object.keys(profileUser.activity_levels).length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Niveaux par activité</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(profileUser.activity_levels).map(([act, lvl]) => (
                  <span key={act} className="px-3 py-1 bg-slate-900 border border-slate-800 text-xs rounded-xl font-semibold text-slate-200">
                    <strong className="text-violet-300">{act} :</strong> {lvl}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interests & Categories */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div>
              <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2">Centres d'intérêt</h4>
              <div className="flex flex-wrap gap-1.5">
                {profileUser.interests && profileUser.interests.length > 0 ? (
                  profileUser.interests.map(i => (
                    <span key={i} className="px-3 py-1 bg-slate-900 text-slate-200 font-semibold rounded-lg border border-slate-800">
                      {i}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic">Aucun centre d'intérêt renseigné</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2">Objectifs amicaux</h4>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-300 font-semibold rounded-lg border border-emerald-500/30">
                  🤝 Amitié & Sorties
                </span>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-300 font-semibold rounded-lg border border-cyan-500/30">
                  🚴 Partenaire d'activité
                </span>
              </div>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          {profileUser.gallery && profileUser.gallery.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Images className="w-4 h-4 text-violet-400" />
                <span>Galerie Photo ({profileUser.gallery.length})</span>
              </h4>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {profileUser.gallery.map(img => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.photo_url)}
                    className="relative h-24 rounded-2xl overflow-hidden border border-slate-800 hover:border-violet-500 transition-all group"
                  >
                    <img src={img.photo_url} alt="Galerie" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CONTEXTUAL ACTION BUTTON BAR */}
          {!isSelf && (
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">

              <div className="flex items-center gap-3">
                {/* Single Contextual Relationship Button */}
                {relationshipStatus === 'none' && (
                  <button
                    onClick={handleAddContact}
                    className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Ajouter aux contacts</span>
                  </button>
                )}

                {relationshipStatus === 'pending_sent' && (
                  <div className="px-4 py-2 bg-slate-800/80 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Demande envoyée</span>
                  </div>
                )}

                {relationshipStatus === 'pending_received' && (
                  <button
                    onClick={handleAcceptContact}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Accepter la demande</span>
                  </button>
                )}

                {relationshipStatus === 'accepted' && (
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 bg-emerald-500/20 text-emerald-300 font-extrabold text-xs rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>Contacts ✔</span>
                    </span>

                    <button
                      onClick={() => setShowRemoveConfirm(true)}
                      className="p-2 bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-xl border border-slate-800 transition-colors"
                      title="Retirer de mes contacts"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Direct Private Chat Button */}
                <Link
                  to="/messages"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>Envoyer un message</span>
                </Link>
              </div>

              {/* Report button */}
              <button
                onClick={() => setIsReportOpen(true)}
                className="text-xs text-slate-500 hover:text-rose-400 font-bold flex items-center gap-1.5 transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Signaler ce profil</span>
              </button>

            </div>
          )}

        </div>

        {/* Public Activity History */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-xl text-white">Activités organisées par {profileUser.display_name}</h3>

          {userActivities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {userActivities.map(act => (
                <div key={act.id} className="bg-[#0F172A] border border-slate-800 rounded-2xl p-4 space-y-2">
                  <h4 className="font-bold text-sm text-white">{act.title}</h4>
                  <p className="text-xs text-slate-400">📍 {act.city} • {act.category}</p>
                  <Link to={`/activity/${act.id}`} className="inline-block text-xs text-violet-400 font-bold hover:underline">
                    Voir la sortie →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Aucune sortie publique actuellement.</p>
          )}
        </div>

      </main>

      <Footer />

      {/* Image Modal Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white bg-slate-800 p-2 rounded-full hover:bg-slate-700"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={selectedImage} alt="Aperçu" className="max-w-full max-h-[80vh] rounded-3xl object-contain shadow-2xl" />
          </div>
        </div>
      )}

      {/* Confirmation Modal before removing contact */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 text-white">
            <h3 className="font-bold text-lg">Retirer des contacts ?</h3>
            <p className="text-xs text-slate-300">
              Souhaitez-vous vraiment retirer <strong className="text-white">{profileUser.display_name}</strong> de votre liste de contacts amicals ?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmRemoveContact}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg"
              >
                Oui, retirer
              </button>
            </div>
          </div>
        </div>
      )}

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportedUserId={profileUser.id}
        targetName={profileUser.display_name}
      />
    </div>
  );
};
