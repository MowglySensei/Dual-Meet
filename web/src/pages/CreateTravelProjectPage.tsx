import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  PlusCircle,
  Calendar,
  MapPin,
  DollarSign,
  Compass,
  Users,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../lib/supabase';

export const CreateTravelProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [country, setCountry] = useState<string>('Australie');
  const [countryFlag, setCountryFlag] = useState<string>('🇦🇺');
  const [visaType, setVisaType] = useState<string>('PVT / Working Holiday');
  const [title, setTitle] = useState<string>('');
  const [departureDate, setDepartureDate] = useState<string>('Janvier 2027');
  const [duration, setDuration] = useState<string>('12 mois');
  const [arrivalCity, setArrivalCity] = useState<string>('Sydney');
  const [estimatedBudget, setEstimatedBudget] = useState<string>('8 000 €');
  const [travelStyle, setTravelStyle] = useState<string>('Roadtrip + Travail');
  const [housingPlan, setHousingPlan] = useState<string>('Colocation');
  const [languageLevel, setLanguageLevel] = useState<string>('Anglais intermédiaire');
  const [description, setDescription] = useState<string>('');
  const [maxParticipants, setMaxParticipants] = useState<number>(4);
  const [loading, setLoading] = useState<boolean>(false);

  const countryFlagsMap: Record<string, string> = {
    'Australie': '🇦🇺',
    'Canada': '🇨🇦',
    'Nouvelle-Zélande': '🇳🇿',
    'Japon': '🇯🇵',
    'Corée du Sud': '🇰🇷',
    'Autre': '✈️',
  };

  const handleCountryChange = (c: string) => {
    setCountry(c);
    setCountryFlag(countryFlagsMap[c] || '✈️');
    if (c === 'Australie') {
      setArrivalCity('Sydney');
      setVisaType('PVT 417 / Working Holiday');
    } else if (c === 'Canada') {
      setArrivalCity('Vancouver');
      setVisaType('PVT Canada EIC');
    } else if (c === 'Nouvelle-Zélande') {
      setArrivalCity('Auckland');
      setVisaType('Working Holiday Visa');
    } else if (c === 'Japon') {
      setArrivalCity('Tokyo');
      setVisaType('PVT Japon');
    } else if (c === 'Corée du Sud') {
      setArrivalCity('Séoul');
      setVisaType('PVT Corée (H-1)');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!title || !departureDate || !arrivalCity) {
      showToast('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    setLoading(true);
    try {
      const created = await api.createTravelProject({
        organizer_id: user.id,
        organizer: user,
        country,
        country_flag: countryFlag,
        visa_type: visaType,
        title,
        description,
        departure_date: departureDate,
        duration,
        arrival_city: arrivalCity,
        estimated_budget: estimatedBudget,
        travel_style: travelStyle,
        housing_plan: housingPlan,
        language_level: languageLevel,
        max_participants: maxParticipants,
        participants: [user],
      });

      showToast('Projet de voyage créé avec succès !', 'success');
      navigate(`/travel/${created.id}`);
    } catch (err: any) {
      showToast(err?.message || 'Erreur lors de la création du projet de voyage.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-600/30 text-violet-300 text-xs font-bold border border-violet-500/40">
            <Plane className="w-4 h-4 text-cyan-300" />
            <span>Créer un projet de voyage / PVT</span>
          </div>
          <h1 className="text-3xl font-black text-white">Proposer un départ à l'étranger</h1>
          <p className="text-xs text-slate-400">
            Définissez votre projet de PVT ou de grand voyage et trouvez des compagnons avec la même destination.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">

          {/* Destination Country */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Pays de destination <span className="text-rose-400">*</span>
            </label>
            <select
              value={country}
              onChange={e => handleCountryChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 font-bold"
            >
              <option value="Australie">🇦🇺 Australie</option>
              <option value="Canada">🇨🇦 Canada</option>
              <option value="Nouvelle-Zélande">🇳🇿 Nouvelle-Zélande</option>
              <option value="Japon">🇯🇵 Japon</option>
              <option value="Corée du Sud">🇰🇷 Corée du Sud</option>
              <option value="Autre">✈️ Autre destination</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Titre du projet <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: PVT Australie — Départ Janvier 2027"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Visa Type & Departure Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Type de Visa / Projet <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={visaType}
                onChange={e => setVisaType(e.target.value)}
                placeholder="Ex: PVT 417, Working Holiday..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Date approximative de départ <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={departureDate}
                onChange={e => setDepartureDate(e.target.value)}
                placeholder="Ex: Janvier 2027, Automne 2026..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Arrival City & Estimated Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Ville d'arrivée <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={arrivalCity}
                onChange={e => setArrivalCity(e.target.value)}
                placeholder="Ex: Sydney, Vancouver, Tokyo..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Budget prévisionnel
              </label>
              <input
                type="text"
                value={estimatedBudget}
                onChange={e => setEstimatedBudget(e.target.value)}
                placeholder="Ex: 8 000 €, 5 000 $..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Travel Style & Housing Plan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Style de voyage
              </label>
              <select
                value={travelStyle}
                onChange={e => setTravelStyle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Roadtrip + Travail">Roadtrip + Travail</option>
                <option value="Installation en ville">Installation en ville</option>
                <option value="Vanlife">Vanlife & Exploration</option>
                <option value="Backpacking">Backpacking & Sac à dos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Projet de logement
              </label>
              <select
                value={housingPlan}
                onChange={e => setHousingPlan(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
              >
                <option value="Colocation">Colocation</option>
                <option value="Auberge de jeunesse au début">Auberge de jeunesse au début</option>
                <option value="Achat/Location d'un Van">Achat/Location d'un Van</option>
                <option value="Logement seul">Logement individuel</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Présentation détaillée du projet
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Décrivez vos motivations, le type d'emploi recherché, vos étapes prévues..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          {/* Max Participants */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Nombre de compagnons recherchés (Max {maxParticipants})
            </label>
            <input
              type="number"
              min={2}
              max={8}
              value={maxParticipants}
              onChange={e => setMaxParticipants(parseInt(e.target.value) || 4)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            {loading ? 'Publication en cours...' : 'Publier mon projet de voyage'}
          </button>

        </form>

      </main>

      <Footer />
    </div>
  );
};
