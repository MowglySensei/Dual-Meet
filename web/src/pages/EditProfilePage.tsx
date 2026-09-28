import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { localStore } from '../lib/supabase';
import {
  User,
  MapPin,
  Sparkles,
  Trash2,
  CheckCircle2,
  Upload,
  Images,
  Plus,
  Star,
  AlertTriangle,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EditProfilePage: React.FC = () => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState<string>(user?.display_name || '');
  const [city, setCity] = useState<string>(user?.city || '');
  const [bio, setBio] = useState<string>(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar_url || '');
  const [availability, setAvailability] = useState<string>(user?.availability || '');
  const [interestsText, setInterestsText] = useState<string>(user?.interests?.length ? user.interests.join(', ') : '');
  const [showStats, setShowStats] = useState<boolean>(user?.show_activity_stats !== false);

  // Gallery
  const [gallery, setGallery] = useState(() => user?.gallery || []);
  const [newPhotoUrl, setNewPhotoUrl] = useState<string>('');
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);

  // Activity Levels
  const [levels, setLevels] = useState<Record<string, string>>(() => user?.activity_levels || {});

  // Handle Photo Upload (Validated for image format and size)
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim() || !user) return;

    if (!newPhotoUrl.startsWith('http://') && !newPhotoUrl.startsWith('https://') && !newPhotoUrl.startsWith('data:image/')) {
      showToast('Veuillez entrer une URL d’image valide (http/https).', 'error');
      return;
    }

    try {
      const added = localStore.addGalleryPhoto(user.id, newPhotoUrl.trim());
      setGallery([...(user.gallery || []), added]);
      setNewPhotoUrl('');
      showToast('Photo ajoutée à votre galerie !', 'success');
    } catch (err) {
      showToast('Erreur lors de l’ajout de la photo.', 'error');
    }
  };

  const handleConfirmDeletePhoto = () => {
    if (!user || !photoToDelete) return;
    localStore.deleteGalleryPhoto(user.id, photoToDelete);
    setGallery(prev => prev.filter(p => p.id !== photoToDelete));
    setPhotoToDelete(null);
    showToast('Photo supprimée de votre galerie.', 'info');
  };

  const handleSetMainAvatar = (url: string) => {
    setAvatarUrl(url);
    if (user) localStore.setMainAvatar(user.id, url);
    showToast('Photo principale mise à jour !', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const interests = interestsText.split(',').map(s => s.trim()).filter(Boolean);

    await updateProfile({
      display_name: displayName,
      city,
      bio,
      avatar_url: avatarUrl,
      availability,
      interests,
      activity_levels: levels,
      show_activity_stats: showStats,
    });

    showToast('Profil mis à jour avec succès !', 'success');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement votre compte Dual Meet ?')) {
      await deleteAccount();
      showToast('Votre compte a été supprimé.', 'info');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        <div>
          <h1 className="text-3xl font-black text-white">Gestion du Profil & Compte</h1>
          <p className="text-xs text-slate-400 mt-1">Enrichissez votre profil, gérez votre galerie et ajustez vos paramètres.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">

          {/* Main Photo / Avatar */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
            <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-violet-500/50 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">URL Photo principale (Avatar)</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
              <p className="text-[10px] text-slate-400">Conseil : vous pouvez aussi sélectionner n'importe quelle photo de votre galerie ci-dessous.</p>
            </div>
          </div>

          {/* GALLERY MANAGEMENT SECTION (Section 3) */}
          <div className="space-y-4 pb-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Images className="w-5 h-5 text-violet-400" />
                  <span>Galerie Photo Personnelle</span>
                </h3>
                <p className="text-xs text-slate-400">Ajoutez des photos de vos sorties et activités (max 5 Mo)</p>
              </div>
            </div>

            {/* Add Photo Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={e => setNewPhotoUrl(e.target.value)}
                placeholder="URL de l'image (ex: https://images.unsplash.com/...)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>

            {/* Gallery Grid */}
            {gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {gallery.map(img => (
                  <div key={img.id} className="relative h-24 rounded-2xl overflow-hidden border border-slate-800 group">
                    <img src={img.photo_url} alt="Galerie" className="w-full h-full object-cover" />

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                      <button
                        type="button"
                        onClick={() => handleSetMainAvatar(img.photo_url)}
                        className="p-1.5 bg-violet-600 text-white rounded-lg hover:scale-110 transition-transform"
                        title="Définir comme photo principale"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setPhotoToDelete(img.id)}
                        className="p-1.5 bg-rose-600 text-white rounded-lg hover:scale-110 transition-transform"
                        title="Supprimer la photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Prénom ou Pseudonyme</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Ville d'origine</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Bio / Présentation</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Activity Levels Customizer */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Niveau par activité principale
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold block mb-1">Randonnée</span>
                <input
                  type="text"
                  value={levels['Randonnée'] || ''}
                  onChange={e => setLevels({ ...levels, 'Randonnée': e.target.value })}
                  placeholder="Ex: Intermédiaire, Débutant..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">Vélo / VTT</span>
                <input
                  type="text"
                  value={levels['Vélo'] || ''}
                  onChange={e => setLevels({ ...levels, 'Vélo': e.target.value })}
                  placeholder="Ex: Sportif (25km/h)..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Centres d'intérêt (séparés par des virgules)</label>
            <input
              type="text"
              value={interestsText}
              onChange={e => setInterestsText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Stats Toggle */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Afficher mes statistiques sociales</p>
              <p className="text-[11px] text-slate-400">Rendre visible le nombre de sorties créées et rejointes sur mon profil public.</p>
            </div>
            <input
              type="checkbox"
              checked={showStats}
              onChange={e => setShowStats(e.target.checked)}
              className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Enregistrer mes modifications
          </button>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer définitivement mon compte
            </button>
          </div>

        </form>

      </main>

      <Footer />

      {/* Delete Photo Confirmation Modal (Section 9) */}
      {photoToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 text-white">
            <h3 className="font-bold text-lg flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              Supprimer cette photo ?
            </h3>
            <p className="text-xs text-slate-300">
              Cette photo sera définitivement retirée de votre galerie personnelle.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePhoto}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
