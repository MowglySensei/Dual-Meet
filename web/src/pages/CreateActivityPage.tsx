import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Image,
  DollarSign,
  Zap,
  FileText,
  PlusCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { localStore } from '../lib/supabase';
import { CategoryType } from '../types';

export const CreateActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<CategoryType>('Randonnée');
  const [dateTime, setDateTime] = useState<string>('');
  const [city, setCity] = useState<string>(user?.city || 'Perpignan');
  const [address, setAddress] = useState<string>('');
  const [maxParticipants, setMaxParticipants] = useState<number>(4);
  const [description, setDescription] = useState<string>('');
  const [budget, setBudget] = useState<string>('Gratuit');
  const [fitnessLevel, setFitnessLevel] = useState<string>('Tous niveaux');
  const [isSpontaneous, setIsSpontaneous] = useState<boolean>(false);
  const [isTwoPerson, setIsTwoPerson] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800');

  const presetImages = [
    { label: 'Montagne / Rando', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' },
    { label: 'Bowling', url: 'https://images.unsplash.com/photo-1538388149542-5e24932d11a8?auto=format&fit=crop&q=80&w=800' },
    { label: 'Restaurant / Café', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800' },
    { label: 'Vélo / Cyclisme', url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&q=80&w=800' },
    { label: 'Jeux de société', url: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=800' },
    { label: 'Running / Sport', url: 'https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&q=80&w=800' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!title || !dateTime || !city) {
      showToast('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    const newActivity = localStore.addActivity({
      organizer_id: user.id,
      organizer: user,
      title,
      description,
      category,
      date_time: new Date(dateTime).toISOString(),
      city,
      latitude: 42.6986,
      longitude: 2.8956,
      address,
      max_participants: maxParticipants,
      is_spontaneous: isSpontaneous,
      is_two_person: isTwoPerson,
      budget,
      fitness_level: fitnessLevel,
      status: 'open',
      image_url: imageUrl,
      participants: [user],
    });

    showToast('Votre activité a été publiée avec succès !', 'success');
    navigate(`/activity/${newActivity.id}`);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/30 text-violet-300 text-xs font-bold border border-violet-500/40">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Formulaire de création</span>
          </div>
          <h1 className="text-3xl font-black text-white">Créer une nouvelle activité</h1>
          <p className="text-xs text-slate-400">
            Propose une sortie amicale et trouve des participants motivés près de chez toi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Titre de l'activité <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Randonnée au Lac des Bouillouses, Session Bowling..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Category & Date/Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Catégorie <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CategoryType)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Randonnée">Randonnée</option>
                <option value="Bowling">Bowling</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Vélo">Vélo</option>
                <option value="Padel & Tennis">Padel & Tennis</option>
                <option value="Escape Game">Escape Game</option>
                <option value="Karaoké & Blind Test">Karaoké & Blind Test</option>
                <option value="Bivouac & Camping">Bivouac & Camping</option>
                <option value="Kayak & Paddle">Kayak & Paddle</option>
                <option value="Escalade & Bloc">Escalade & Bloc</option>
                <option value="Billard & Fléchettes">Billard & Fléchettes</option>
                <option value="Atelier & Cuisine">Atelier & Cuisine</option>
                <option value="Échange Linguistique">Échange Linguistique</option>
                <option value="Cleanwalk & Écologie">Cleanwalk & Écologie</option>
                <option value="Jeux de société">Jeux de société</option>
                <option value="Jeux vidéo">Jeux vidéo</option>
                <option value="Course à pied">Course à pied</option>
                <option value="Sport">Sport / Fitness</option>
                <option value="Plage">Plage</option>
                <option value="Sorties culturelles">Sorties culturelles</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Date et Heure de rendez-vous <span className="text-rose-400">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={dateTime}
                onChange={e => setDateTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

          </div>

          {/* Location & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Ville ou secteur <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Ex: Perpignan, Canet, Montpellier..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Adresse exacte (Optionnelle / Masquée)
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Révélée uniquement aux participants acceptés"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Group Type & Max Participants */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Type de groupe & Places disponibles
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsTwoPerson(true);
                  setMaxParticipants(2);
                }}
                className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                  isTwoPerson ? 'bg-violet-600/30 border-violet-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                👤 Sortie en Binôme (2 pers.)
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsTwoPerson(false);
                  setMaxParticipants(5);
                }}
                className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                  !isTwoPerson && maxParticipants <= 5 ? 'bg-violet-600/30 border-violet-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                👥 Petit Groupe (3-5 pers.)
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsTwoPerson(false);
                  setMaxParticipants(10);
                }}
                className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                  !isTwoPerson && maxParticipants > 5 ? 'bg-violet-600/30 border-violet-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                ✨ Groupe Ouvert (6+ pers.)
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Description de la sortie
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Expliquez le déroulement, le niveau requis, les choses à apporter..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Budget & Fitness Level Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Budget estimé
              </label>
              <input
                type="text"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                placeholder="Ex: Gratuit, ~15€..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Niveau physique / sportif
              </label>
              <select
                value={fitnessLevel}
                onChange={e => setFitnessLevel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Tous niveaux">Tous niveaux</option>
                <option value="Débutant">Débutant</option>
                <option value="Moyen / Intermédiaire">Moyen / Intermédiaire</option>
                <option value="Sportif confirmé">Sportif confirmé</option>
              </select>
            </div>
          </div>

          {/* Spontaneous Toggle */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Marquer comme « Sortie Spontanée » ?</p>
                <p className="text-[11px] text-slate-400">Pour les activités prévues dans les prochaines heures.</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isSpontaneous}
              onChange={e => setIsSpontaneous(e.target.checked)}
              className="w-5 h-5 rounded text-amber-500 focus:ring-amber-400"
            />
          </div>

          {/* Image Presets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Choisissez une illustration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {presetImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImageUrl(img.url)}
                  className={`relative h-20 rounded-xl overflow-hidden border transition-all ${
                    imageUrl === img.url ? 'border-violet-500 ring-2 ring-violet-500' : 'border-slate-800 opacity-60'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 right-1 text-[10px] font-bold text-white bg-slate-950/80 px-1 py-0.5 rounded text-center truncate">
                    {img.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-violet-600/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Publier mon activité gratuitement
          </button>

        </form>

      </main>

      <Footer />
    </div>
  );
};
