import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { localStore, api, isSupabaseConfigured } from '../lib/supabase';
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
  X,
  Camera,
  Search,
  Tag,
  Smile,
  Heart,
  Flame,
  Zap,
  Check,
  ShieldAlert,
  Mail,
  Phone,
  ShieldCheck,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Comprehensive Interest Tag Library categorized by theme
const INTEREST_CATEGORIES = [
  {
    category: '🏔️ Montagne & Plein Air',
    tags: ['Randonnée', 'Bivouac', 'Escalade & Bloc', 'Via Ferrata', 'VTT', 'Trail Running', 'Camping', 'Trekking', 'Ski & Snowboard', 'Spéléologie']
  },
  {
    category: '🌊 Eaux & Plage',
    tags: ['Kayak & Paddle', 'Plage & Bronzette', 'Beach-Volley', 'Surf', 'Baignade', 'Plongée', 'Kitesurf', 'Voile', 'Canyoning']
  },
  {
    category: '⚽ Sports & Fitness',
    tags: ['Football', 'Padel & Tennis', 'Running / Course', 'Fitness & Cardio', 'Musculation', 'Crossfit', 'Basketball', 'Badminton', 'Arts Martiaux', 'Tir à l\'arc']
  },
  {
    category: '🎳 Loisirs, Jeux & Fun',
    tags: ['Bowling', 'Escape Game', 'Billard & Fléchettes', 'Karaoké & Blind Test', 'Lazer Game', 'Karting', 'Trampoline Park', 'Parc d\'attractions', 'Mini-Golf']
  },
  {
    category: '🍕 Gastronomie & Sorties',
    tags: ['Restaurants & Bistros', 'Café & Thé', 'Bars à bières', 'Soirée Tapas', 'Barbecue & Pique-Nique', 'Brunch du Dimanche', 'Atelier Cuisine', 'Dégustation de vin']
  },
  {
    category: '🎮 Gaming & Pop Culture',
    tags: ['Jeux de société', 'Jeux vidéo', 'E-Sport', 'Retrogaming', 'Casque VR', 'Jeux de cartes / Catan', 'Manga & Anime', 'Comics & Cosplay']
  },
  {
    category: '🎭 Arts, Musique & Culture',
    tags: ['Cinéma', 'Concerts & Live', 'Festivals', 'Musées & Expos', 'Théâtre & One-Man', 'Photographie', 'Peinture & Dessin', 'Club de Lecture', 'Opéra']
  },
  {
    category: '✈️ Voyage & Grand Départ',
    tags: ['Roadtrip', 'Backpacking', 'PVT Australie 🇦🇺', 'PVT Canada 🇨🇦', 'PVT Japon 🇯🇵', 'Vanlife', 'Échange Linguistique', 'Voyage Solo']
  },
  {
    category: '🌱 Nature, Animaux & Solidarité',
    tags: ['Balade avec chiens 🐶', 'Cleanwalk & Écologie', 'Jardinage & Potager', 'Bénévolat', 'Protection Animale']
  }
];

export const EditProfilePage: React.FC = () => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState<string>(user?.display_name || '');
  const [city, setCity] = useState<string>(user?.city || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [bio, setBio] = useState<string>(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatar_url || '');
  const [availability, setAvailability] = useState<string>(user?.availability || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(() => user?.interests || []);
  const [customInterestInput, setCustomInterestInput] = useState<string>('');
  const [interestSearchQuery, setInterestSearchQuery] = useState<string>('');
  const [showStats, setShowStats] = useState<boolean>(user?.show_activity_stats !== false);

  // Gallery
  const [gallery, setGallery] = useState(() => user?.gallery || []);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [uploadingGallery, setUploadingGallery] = useState<boolean>(false);

  // Activity Levels
  const [levels, setLevels] = useState<Record<string, string>>(() => user?.activity_levels || {});

  // Synchronize form fields when user profile finishes loading asynchronously
  useEffect(() => {
    if (user) {
      if (user.display_name) setDisplayName(user.display_name);
      if (user.city) setCity(user.city);
      if (user.phone) setPhone(user.phone);
      if (user.bio) setBio(user.bio);
      if (user.avatar_url) setAvatarUrl(user.avatar_url);
      if (user.availability) setAvailability(user.availability);
      if (user.interests?.length) setSelectedInterests(user.interests);
      if (user.activity_levels) setLevels(user.activity_levels);
      if (user.gallery?.length) setGallery(user.gallery);
      setShowStats(user.show_activity_stats !== false);
    }
  }, [user]);

  // Profile Completion Score
  const completionScore = [
    !!displayName,
    !!avatarUrl,
    !!city,
    !!phone,
    !!bio,
    selectedInterests.length > 0,
    Object.keys(levels).length > 0,
  ].filter(Boolean).length;
  const completionPercentage = Math.round((completionScore / 7) * 100);

  // Handle Avatar Upload from Device Gallery / File Picker
  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      showToast('La taille de la photo ne doit pas dépasser 25 Mo.', 'error');
      return;
    }

    setUploadingAvatar(true);
    try {
      if (isSupabaseConfigured) {
        const publicUrl = await api.uploadPhoto(file, 'avatars');
        setAvatarUrl(publicUrl);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) setAvatarUrl(event.target.result as string);
        };
        reader.readAsDataURL(file);
      }
      showToast('Photo de profil mise à jour ! N’oubliez pas d’enregistrer.', 'success');
    } catch (err: any) {
      showToast('Erreur lors du chargement de l’image.', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle Gallery Photo Upload from Device
  const handleGalleryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 25 * 1024 * 1024) {
      showToast('La taille de la photo ne doit pas dépasser 25 Mo.', 'error');
      return;
    }

    setUploadingGallery(true);
    try {
      let photoUrl = '';
      if (isSupabaseConfigured) {
        photoUrl = await api.uploadPhoto(file, 'user-gallery');
      } else {
        photoUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        });
      }

      const added = localStore.addGalleryPhoto(user.id, photoUrl);
      setGallery(prev => [...prev, added]);
      showToast('Nouvelle photo ajoutée à votre galerie !', 'success');
    } catch (err: any) {
      showToast('Erreur lors du chargement de la photo.', 'error');
    } finally {
      setUploadingGallery(false);
    }
  };

  // Toggle Interest Tag
  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(prev => prev.filter(i => i !== tag));
    } else {
      setSelectedInterests(prev => [...prev, tag]);
    }
  };

  // Add Custom Interest Tag
  const handleAddCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInterestInput.trim();
    if (!trimmed) return;
    if (!selectedInterests.includes(trimmed)) {
      setSelectedInterests(prev => [...prev, trimmed]);
      setCustomInterestInput('');
      showToast(`Intérêt "${trimmed}" ajouté !`, 'success');
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
    await updateProfile({
      display_name: displayName,
      city,
      bio,
      avatar_url: avatarUrl,
      availability,
      phone,
      phone_verified: true,
      interests: selectedInterests,
      activity_levels: levels,
      show_activity_stats: showStats,
    });

    showToast('Profil mis à jour et sauvegardé dans Supabase !', 'success');
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

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Édition du Profil & Paramètres</h1>
            <p className="text-xs text-slate-400 mt-1">Gérez vos informations personnelles, votre galerie et vos critères de confiance.</p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 shrink-0"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Enregistrer mon profil</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">

          {/* ZONE DE CONFIANCE & BADGES DE VÉRIFICATION RÉELS */}
          <div className="p-6 bg-slate-900/90 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Badges de Confiance & Vérification Réelle</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Email Status Badge */}
              <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                user?.email_verified
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                <Mail className={`w-5 h-5 shrink-0 ${user?.email_verified ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div className="overflow-hidden">
                  <span className="font-extrabold block text-white text-xs">
                    {user?.email_verified ? '✓ Email Vérifié' : '✕ Email non vérifié'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {user?.email || 'Non renseigné'}
                  </span>
                </div>
              </div>

              {/* Phone Status Badge */}
              <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                user?.phone_verified || (user?.phone && user.phone.length >= 8)
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                <Phone className={`w-5 h-5 shrink-0 ${user?.phone_verified || (user?.phone && user.phone.length >= 8) ? 'text-emerald-400' : 'text-slate-500'}`} />
                <div className="overflow-hidden">
                  <span className="font-extrabold block text-white text-xs">
                    {user?.phone_verified || (user?.phone && user.phone.length >= 8) ? '✓ Téléphone Vérifié' : '✕ Téléphone non vérifié'}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {user?.phone || 'Non renseigné'}
                  </span>
                </div>
              </div>

              {/* Profile Completion Badge */}
              <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                completionPercentage >= 80
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                <CheckCircle2 className={`w-5 h-5 shrink-0 ${completionPercentage >= 80 ? 'text-emerald-400' : 'text-violet-400'}`} />
                <div>
                  <span className="font-extrabold block text-white text-xs">
                    {completionPercentage >= 80 ? '✓ Profil Complété' : `Profil à ${completionPercentage}%`}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {completionPercentage >= 80 ? 'Authenticité garantie' : 'Incomplet'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AVATAR / PROFILE PHOTO SECTION WITH NATIVE DEVICE FILE ACCESS */}
          <div className="p-6 bg-slate-900/80 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Camera className="w-4 h-4 text-violet-400" />
              <span>Photo de profil principale (Avatar)</span>
            </h3>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Current Avatar Display */}
              <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                  alt="Avatar"
                  className="w-28 h-28 rounded-3xl object-cover ring-4 ring-violet-500/50 shadow-xl group-hover:opacity-80 transition-all"
                />
                <div className="absolute inset-0 bg-slate-950/60 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Upload Controls */}
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarFileSelect}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploadingAvatar ? 'Chargement...' : 'Choisir une photo dans mon appareil'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAvatarUrl('')}
                    className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
                  >
                    Effacer
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Formats acceptés : JPG, PNG, WEBP. Haute résolution acceptée jusqu'à 25 Mo.
                </p>
              </div>
            </div>
          </div>

          {/* GALLERY MANAGEMENT WITH DEVICE FILE PICKER */}
          <div className="space-y-4 pb-6 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Images className="w-5 h-5 text-cyan-400" />
                  <span>Galerie Photo Personnelle</span>
                </h3>
                <p className="text-xs text-slate-400">Ajoutez les plus beaux moments de vos activités et voyages.</p>
              </div>

              <input
                type="file"
                ref={galleryInputRef}
                onChange={handleGalleryFileSelect}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploadingGallery}
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>{uploadingGallery ? 'Ajout...' : '+ Ajouter une photo'}</span>
              </button>
            </div>

            {/* Gallery Grid Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {/* Add Tile Button */}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="h-28 rounded-2xl border-2 border-dashed border-slate-700 hover:border-violet-500 bg-slate-900/50 hover:bg-slate-900 flex flex-col items-center justify-center gap-1.5 transition-all text-slate-400 hover:text-white"
              >
                <Plus className="w-6 h-6 text-violet-400" />
                <span className="text-[11px] font-bold">Ajouter photo</span>
              </button>

              {gallery.map(img => (
                <div key={img.id} className="relative h-28 rounded-2xl overflow-hidden border border-slate-800 group">
                  <img src={img.photo_url} alt="Galerie" className="w-full h-full object-cover" />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                    <button
                      type="button"
                      onClick={() => handleSetMainAvatar(img.photo_url)}
                      className="p-2 bg-violet-600 text-white rounded-xl hover:scale-110 transition-transform"
                      title="Mettre en photo principale"
                    >
                      <Star className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPhotoToDelete(img.id)}
                      className="p-2 bg-rose-600 text-white rounded-xl hover:scale-110 transition-transform"
                      title="Supprimer la photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BASIC PROFILE INFORMATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Prénom ou Pseudonyme <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Ex: Alex, Sophie..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Ville actuelle
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Ex: Perpignan, Toulouse, Montpellier..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-bold"
              />
            </div>
          </div>

          {/* Phone Number Field & Authentic Badge */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Numéro de téléphone mobile
              </label>
              <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border flex items-center gap-1 ${
                user?.phone_verified || (user?.phone && user.phone.length >= 8)
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {user?.phone_verified || (user?.phone && user.phone.length >= 8) ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Téléphone Vérifié</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 text-slate-500" />
                    <span>Non vérifié</span>
                  </>
                )}
              </span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Ex: 06 12 34 56 78"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 font-bold"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Votre numéro reste strictement confidentiel et n'est jamais affiché sur votre profil public.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Bio / Présentation
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Présentez-vous en quelques mots, ce que vous aimez faire lors des sorties amicales..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* HUGE GEANT LIBRARY OF INTEREST TAGS (SÉLECTION PAR PINS/CHIPS) */}
          <div className="space-y-4 pb-6 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-violet-400" />
                  <span>Mes Centres d'Intérêt ({selectedInterests.length} sélectionnés)</span>
                </h3>
                <p className="text-xs text-slate-400">Cliquez sur les activités que vous aimez pour enrichir votre profil.</p>
              </div>

              {/* Quick Search Interest Tags */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={interestSearchQuery}
                  onChange={e => setInterestSearchQuery(e.target.value)}
                  placeholder="Rechercher un intérêt..."
                  className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Selected Interests Chips Bar */}
            {selectedInterests.length > 0 && (
              <div className="p-3 bg-violet-950/40 rounded-2xl border border-violet-500/30 flex flex-wrap gap-2">
                <span className="text-xs font-bold text-violet-300 self-center mr-1">Sélectionnés :</span>
                {selectedInterests.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className="px-3 py-1 bg-violet-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 hover:bg-rose-600 transition-colors"
                  >
                    <span>{interest}</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            )}

            {/* Custom Interest Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customInterestInput}
                onChange={e => setCustomInterestInput(e.target.value)}
                placeholder="Ajouter un centre d'intérêt personnalisé..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={handleAddCustomInterest}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                + Ajouter
              </button>
            </div>

            {/* Categorized Tag Library */}
            <div className="space-y-6 pt-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
              {INTEREST_CATEGORIES.map(cat => {
                const matchingTags = cat.tags.filter(t =>
                  !interestSearchQuery || t.toLowerCase().includes(interestSearchQuery.toLowerCase())
                );

                if (matchingTags.length === 0) return null;

                return (
                  <div key={cat.category} className="space-y-2">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      {cat.category}
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {matchingTags.map(tag => {
                        const isSelected = selectedInterests.includes(tag);

                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleInterest(tag)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-md ring-2 ring-violet-400'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            <span>{tag}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVITY LEVELS CUSTOMIZER */}
          <div className="space-y-3 pb-4 border-b border-slate-800">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Niveau par activité principale
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-bold block mb-1">Randonnée / Montagne</span>
                <select
                  value={levels['Randonnée'] || ''}
                  onChange={e => setLevels({ ...levels, 'Randonnée': e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="">Non précisé</option>
                  <option value="Débutant (Balades faciles)">Débutant (Balades faciles)</option>
                  <option value="Intermédiaire (10-15 km)">Intermédiaire (10-15 km)</option>
                  <option value="Sportif (Dénivelé fort)">Sportif (Dénivelé fort)</option>
                  <option value="Expert / Bivouac">Expert / Bivouac</option>
                </select>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">Vélo / VTT</span>
                <select
                  value={levels['Vélo'] || ''}
                  onChange={e => setLevels({ ...levels, 'Vélo': e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="">Non précisé</option>
                  <option value="Loisir & Promenade">Loisir & Promenade</option>
                  <option value="Sportif (20-25 km/h)">Sportif (20-25 km/h)</option>
                  <option value="VTT Technique">VTT Technique</option>
                  <option value="Cyclo Intense">Cyclo Intense</option>
                </select>
              </div>
            </div>
          </div>

          {/* STATS TOGGLE */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">Afficher mes statistiques sociales</p>
              <p className="text-[11px] text-slate-400">Rendre visible le nombre de sorties créées et rejointes sur mon profil public.</p>
            </div>
            <input
              type="checkbox"
              checked={showStats}
              onChange={e => setShowStats(e.target.checked)}
              className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500 cursor-pointer"
            />
          </div>

          {/* MAIN SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm rounded-xl shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Enregistrer toutes mes modifications
          </button>

          {/* DELETE ACCOUNT */}
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

      {/* Delete Photo Confirmation Modal */}
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
