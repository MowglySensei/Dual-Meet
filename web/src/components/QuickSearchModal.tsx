import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Sparkles,
  Compass,
  Dumbbell,
  Utensils,
  Trees,
  Gamepad2,
  Ticket,
  Users,
  User,
  Clock,
  Calendar,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { localStore } from '../lib/supabase';
import { ActivityCard } from './ActivityCard';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);

  // Form selections
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTiming, setSelectedTiming] = useState<string>('');
  const [selectedGroupSize, setSelectedGroupSize] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);

  if (!isOpen) return null;

  const categories = [
    { id: 'Sport', label: 'Sport', icon: Dumbbell, desc: 'Rando, vélo, footing, fitness' },
    { id: 'Restaurant', label: 'Restaurant & Bar', icon: Utensils, desc: 'Resto, verre, café, bistro' },
    { id: 'Plein air', label: 'Plein air & Plage', icon: Trees, desc: 'Promenade, plage, pique-nique' },
    { id: 'Jeux', label: 'Jeux de société & Jeux vidéo', icon: Gamepad2, desc: 'Bar à jeux, console, billard' },
    { id: 'Culture', label: 'Sortie culturelle', icon: Ticket, desc: 'Cinéma, musée, concert, théâtre' },
    { id: 'Loisirs', label: 'Bowling & Loisirs', icon: Compass, desc: 'Bowling, escape game, parc' },
  ];

  const timings = [
    { id: 'now', label: 'Maintenant / Tout de suite', icon: Clock, detail: 'Dans l’heure qui vient' },
    { id: 'today', label: 'Aujourd’hui / Ce soir', icon: Calendar, detail: 'Pour le reste de la journée' },
    { id: 'tomorrow', label: 'Demain', icon: Calendar, detail: 'Prévu pour demain' },
    { id: 'weekend', label: 'Ce week-end', icon: Sparkles, detail: 'Samedi ou dimanche' },
  ];

  const groupSizes = [
    { id: 'two', label: 'Une personne (Sortie à deux)', icon: User, detail: 'Idéal pour trouver un binôme' },
    { id: 'small', label: 'Petit groupe (3 à 5 pers.)', icon: Users, detail: 'Convivial et à taille humaine' },
    { id: 'open', label: 'Groupe ouvert (+6 pers.)', icon: Sparkles, detail: 'Plus on est de fous, plus on rit' },
  ];

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setStep(2);
  };

  const handleSelectTiming = (time: string) => {
    setSelectedTiming(time);
    setStep(3);
  };

  const handleSelectGroupSize = (size: string) => {
    setSelectedGroupSize(size);
    setIsSearching(true);
    setStep(4);

    // Filter activities
    setTimeout(() => {
      const filtered = localStore.activities.filter(act => {
        // match category loosely
        const matchCat = !selectedCategory || act.category.toLowerCase().includes(selectedCategory.toLowerCase()) || selectedCategory === 'Loisirs';
        return matchCat;
      });
      setResults(filtered.length > 0 ? filtered : localStore.activities.slice(0, 3));
      setIsSearching(false);
    }, 600);
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedCategory('');
    setSelectedTiming('');
    setSelectedGroupSize('');
    setResults([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-violet-500/30 rounded-3xl shadow-2xl overflow-hidden text-white my-8 max-h-[90vh] flex flex-col">

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-violet-900/40 via-slate-900 to-cyan-900/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-2xl text-white shadow-lg shadow-violet-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">JE VEUX SORTIR</h2>
              <p className="text-xs text-slate-300 font-medium">Trouve une activité en 3 clics rapides</p>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/50 h-1.5 flex">
          <div
            className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="text-center max-w-md mx-auto mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Étape 1 sur 3</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">Que veux-tu faire ?</h3>
                <p className="text-sm text-slate-400 mt-1">Choisis le domaine qui te tente aujourd’hui</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/80 hover:bg-violet-900/30 border border-white/10 hover:border-violet-500/50 transition-all text-left group"
                    >
                      <div className="p-3 bg-violet-500/10 text-violet-400 group-hover:bg-violet-600 group-hover:text-white rounded-xl transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base group-hover:text-violet-300 transition-colors">{cat.label}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{cat.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="text-center max-w-md mx-auto mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Étape 2 sur 3</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">Quand souhaites-tu sortir ?</h3>
                <p className="text-sm text-slate-400 mt-1">Sélectionne le moment où tu es disponible</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {timings.map(time => {
                  const Icon = time.icon;
                  return (
                    <button
                      key={time.id}
                      onClick={() => handleSelectTiming(time.id)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 hover:bg-cyan-900/30 border border-white/10 hover:border-cyan-500/50 transition-all text-left group"
                    >
                      <div className="p-3 bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white rounded-xl transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">{time.label}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{time.detail}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  ← Retour
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="text-center max-w-md mx-auto mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Étape 3 sur 3</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">Avec combien de personnes ?</h3>
                <p className="text-sm text-slate-400 mt-1">Préfères-tu un duo, un petit groupe ou une grande sortie ?</p>
              </div>

              <div className="space-y-3">
                {groupSizes.map(size => {
                  const Icon = size.icon;
                  return (
                    <button
                      key={size.id}
                      onClick={() => handleSelectGroupSize(size.id)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 hover:bg-violet-900/30 border border-white/10 hover:border-violet-500/50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-violet-500/10 text-violet-400 group-hover:bg-violet-600 group-hover:text-white rounded-xl transition-colors">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-base group-hover:text-violet-300 transition-colors">{size.label}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{size.detail}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  onClick={() => setStep(2)}
                  className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  ← Retour
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 : RESULTS */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {isSearching ? (
                <div className="py-16 text-center space-y-4">
                  <div className="inline-block p-4 bg-violet-500/20 text-violet-400 rounded-full animate-spin">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Recherche des meilleures sorties...</h3>
                  <p className="text-sm text-slate-400">Analyse des activités disponibles près de chez toi</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Résultats pour votre sortie</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {results.length} activité(s) trouvée(s) selon vos critères
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold text-violet-400 hover:text-violet-300 underline"
                    >
                      Modifier mes choix
                    </button>
                  </div>

                  {results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {results.map(act => (
                        <div key={act.id} onClick={resetAndClose}>
                          <ActivityCard activity={act} compact />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-white/10 space-y-4">
                      <div className="inline-flex p-3 bg-amber-500/10 text-amber-400 rounded-full">
                        <Compass className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-bold text-white">Aucune sortie exacte trouvée</h4>
                      <p className="text-sm text-slate-300 max-w-md mx-auto">
                        Soyez le premier à proposer cette sortie ! La communauté Dual Meet recherche souvent de nouveaux organisateurs.
                      </p>
                      <button
                        onClick={() => {
                          resetAndClose();
                          navigate('/activities/create');
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-violet-500/30 transition-all hover:scale-105"
                      >
                        <PlusCircle className="w-5 h-5" />
                        Créer mon activité maintenant
                      </button>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        resetAndClose();
                        navigate('/activities');
                      }}
                      className="text-sm text-slate-300 hover:text-white underline font-medium"
                    >
                      Voir toutes les activités disponibles
                    </button>

                    <button
                      onClick={() => {
                        resetAndClose();
                        navigate('/activities/create');
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600/80 hover:bg-violet-600 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Créer une activité
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
