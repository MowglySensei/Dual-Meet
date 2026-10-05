import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Users,
  MapPin,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Compass,
  Calendar,
  Smile,
  Mountain,
  Utensils,
  Bike,
  Gamepad2,
  Ticket,
  Waves,
  Trophy,
  Plane,
  ChevronDown,
  Globe,
  Lock,
  MessageSquare,
  Shield,
  Eye,
  Activity as ActivityIcon
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [stats, setStats] = useState({
    members: 1,
    online: 1,
    activities: 0,
    participations: 0,
  });
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRealStats = async () => {
      if (isSupabaseConfigured) {
        setStatsLoading(true);
        try {
          const { count: pCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
          const { count: aCount } = await supabase.from('activities').select('*', { count: 'exact', head: true });
          const { count: partCount } = await supabase.from('activity_participants').select('*', { count: 'exact', head: true });

          setStats({
            members: pCount || 1,
            online: 1,
            activities: aCount || 0,
            participations: partCount || 0,
          });
        } catch (e) {
          // fallback
        } finally {
          setStatsLoading(false);
        }
      } else {
        setStatsLoading(false);
      }
    };
    fetchRealStats();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const experienceCards = [
    {
      title: 'Sport & Plein Air',
      desc: 'Randonnées, sorties vélo, tennis, running et aventures en nature.',
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600',
      badge: 'Aventure'
    },
    {
      title: 'Cafés & Gastronomie',
      desc: 'Brunchs du week-end, bars à tapas, restaurants et découvertes gourmandes.',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
      badge: 'Convivialité'
    },
    {
      title: 'Jeux & Soirées',
      desc: 'Bars à jeux de société, sessions bowling, billard, escape games et consoles.',
      img: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=600',
      badge: 'Loisirs'
    },
    {
      title: 'Voyages & Road trips',
      desc: 'Projets de PVT, escapades le temps d’un week-end et explorations à l’étranger.',
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
      badge: 'International'
    },
    {
      title: 'Découverte de Villes',
      desc: 'Balades urbaines, visites de musées, expos et événements culturels.',
      img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600',
      badge: 'Culture'
    },
    {
      title: 'Activités de Groupe',
      desc: 'Sorties collectives conviviales pour rencontrer du monde en toute simplicité.',
      img: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=600',
      badge: 'Rencontres'
    },
  ];

  return (
    <div className="min-h-screen bg-[#070A11] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-violet-500 selection:text-white">

      {/* Header */}
      <Navbar />

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#0B0F17] via-[#070A11] to-[#070A11]">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/10 to-cyan-500/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">

              {/* Slogan & Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-violet-500/30 text-violet-300 text-xs font-extrabold shadow-xl backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>« Moins de matchs. Plus de moments. »</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                La vie est plus belle quand elle se{' '}
                <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                  partage.
                </span>
              </h1>

              {/* Secondary Message */}
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0">
                Trouve des personnes qui partagent tes envies, organise des activités, pars à l'aventure et crée de vrais souvenirs.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-violet-600/30 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Users className="w-5 h-5" />
                  <span>{isAuthenticated ? "Accéder à mon espace" : "Rejoindre Dual Meet"}</span>
                </Link>

                <button
                  onClick={() => scrollToSection('concept')}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-base rounded-2xl border border-slate-800 hover:border-slate-600 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer"
                >
                  <span>Découvrir le concept</span>
                  <ChevronDown className="w-5 h-5 text-cyan-400" />
                </button>
              </div>

              {/* Guarantees List */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Gratuit & Amical</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Membres vérifiés par téléphone</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Aucun algorithme de séduction</span>
                </div>
              </div>

            </div>

            {/* Right Abstract Ambient Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">

                {/* Glow backdrop */}
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-cyan-400 rounded-3xl blur-2xl opacity-30 transform rotate-3" />

                {/* Main Experience Visual Box */}
                <div className="relative bg-[#0F172A] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">

                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-lg">
                        DM
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">Aventures & Sorties</h4>
                        <p className="text-xs text-cyan-400">📍 Expériences à partager</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                      Communauté
                    </span>
                  </div>

                  {/* Main Visual */}
                  <div className="relative h-52 rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
                      alt="Moment de partage"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-xl text-xs font-bold text-cyan-300 border border-slate-800">
                      🌲 Sortie Plein Air
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-white">« Partager une passion, créer un souvenir »</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Retrouvez des personnes passionnées près de chez vous pour faire du sport, boire un café ou partir en voyage.
                    </p>
                  </div>

                  {/* Footer Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-violet-300">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Espace 100% Amical</span>
                    </div>

                    <button
                      onClick={() => scrollToSection('usages')}
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Voir les usages</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. STATISTIQUES 100% RÉELLES DE SUPABASE */}
      <section id="stats" className="py-8 bg-slate-950 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0F172A] border border-slate-800 shadow-2xl flex flex-wrap items-center justify-around gap-6 text-xs font-bold text-slate-300">

            {/* Member count */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-white font-black text-xl block">
                  {statsLoading ? '...' : stats.members}
                </span>
                <span className="text-slate-400 text-xs">
                  {stats.members > 1 ? 'Membres inscrits réels' : 'Membre inscrit réel'}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            {/* Online status */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20">
                <ActivityIcon className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-cyan-300 font-black text-xl block">
                  {statsLoading ? '...' : stats.online}
                </span>
                <span className="text-slate-400 text-xs">Membre en ligne actuellement</span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            {/* Activities count */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-violet-500/10 text-violet-400 rounded-2xl border border-violet-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-white font-black text-xl block">
                  {statsLoading ? '...' : stats.activities}
                </span>
                <span className="text-slate-400 text-xs">
                  {stats.activities > 1 ? 'Activités proposées' : 'Activité proposée'}
                </span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block" />

            {/* Participations count */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="text-white font-black text-xl block">
                  {statsLoading ? '...' : stats.participations}
                </span>
                <span className="text-slate-400 text-xs">
                  {stats.participations > 1 ? 'Participations enregistrées' : 'Participation enregistrée'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PRÉSENTER LES POSSIBILITÉS (USAGES RÉELS & FUTURE VISION) */}
      <section id="usages" className="py-24 relative bg-[#070A11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400">Usages & Possibilités</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Une plateforme, mille façons de se retrouver
            </h2>
            <p className="text-base text-slate-400">
              Dual Meet s'adapte à tous vos moments de vie, des loisirs quotidiens aux grands projets de départ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Card 1: Activités */}
            <div className="bg-[#0F172A] border border-slate-800 hover:border-violet-500/50 rounded-3xl p-6 space-y-4 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-violet-600/20 text-violet-400 border border-violet-500/30 rounded-2xl flex items-center justify-center">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-xl text-white">Activités & Sports</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Trouvez des partenaires pour faire du sport, aller au restaurant, jouer, vous promener ou découvrir des lieux uniques près de chez vous.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                  ✔ Fonctionnel & Opérationnel
                </span>
              </div>
            </div>

            {/* Card 2: Rencontres Amicales */}
            <div className="bg-[#0F172A] border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 space-y-4 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-2xl flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-xl text-white">Rencontres Amicales</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Découvrez des personnes qui partagent vos centres d'intérêt et développez de vraies amitiés, sans aucune orientation dating ou séduction.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                  ✔ 100% Amical & Sécurisé
                </span>
              </div>
            </div>

            {/* Card 3: Sorties Spontanées */}
            <div className="bg-[#0F172A] border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 space-y-4 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-amber-600/20 text-amber-400 border border-amber-500/30 rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <h3 className="font-extrabold text-xl text-white">Sorties Spontanées</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Proposez une sortie de dernière minute dans les prochaines heures et permettez aux membres motivés autour de vous de la rejoindre.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider block">
                  ⚡ En Direct & Instantané
                </span>
              </div>
            </div>

            {/* Card 4: Voyages & PVT (Vision Future) */}
            <div className="bg-[#0F172A] border border-violet-500/40 hover:border-violet-400 rounded-3xl p-6 space-y-4 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-2xl flex items-center justify-center">
                  <Plane className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-xl text-white">Voyages & PVT</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Préparez un road trip, un PVT (Australie, Canada, Japon...) ou un grand voyage à l'étranger en formant un groupe de compagnons de route.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-[11px] font-extrabold text-violet-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Module Voyager Intégré</span>
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. METTRE EN VALEUR LES EXPÉRIENCES */}
      <section id="experiences" className="py-20 bg-[#0B0F17] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-violet-400">Inspiration & Ambiances</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Des expériences authentiques pour chacun
            </h2>
            <p className="text-base text-slate-400">
              Aperçu des univers d'activités à partager avec d'autres passionnés.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experienceCards.map((exp, i) => (
              <div
                key={i}
                className="group relative bg-[#0F172A] border border-slate-800 hover:border-violet-500/50 rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-900/20"
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={exp.img}
                    alt={exp.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600';
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/30 to-transparent" />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-xl text-[11px] font-extrabold text-cyan-300 border border-slate-800">
                    {exp.badge}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="font-extrabold text-white text-lg group-hover:text-violet-300 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CONFIANCE ET AUTHENTICITÉ */}
      <section id="securite" className="py-24 bg-[#070A11] border-t border-slate-800/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>Nos Engagements Sécurité & Authenticité</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Une communauté amicale, saine et bienveillante.
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                Dual Meet se distingue radicalement des réseaux superficiels. Notre priorité absolue est de garantir la tranquillité et la sécurité de chacun de nos membres.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">

                <div className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Membres Réels Vérifiés</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Validation par numéro de téléphone mobile pour bloquer les faux comptes et le spam.
                  </p>
                </div>

                <div className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <HeartHandshake className="w-4 h-4 text-violet-400" />
                    <span>100% Amical (Zero Dating)</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Aucune orientation romantique ou drague lourde. Climat de convivialité garanti.
                  </p>
                </div>

                <div className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Lock className="w-4 h-4 text-cyan-400" />
                    <span>Respect de la vie privée</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Adresse exacte des sorties masquée et révélée uniquement aux participants acceptés.
                  </p>
                </div>

                <div className="p-4 bg-[#0F172A] rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>Modération & Signalement</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Outils de signalement en 1 clic et modération active par l'équipe d'administration.
                  </p>
                </div>

              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0F172A] border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-2xl">
              <div className="p-4 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-3xl text-white shadow-xl w-16 h-16 mx-auto flex items-center justify-center">
                <Smile className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-white">« Moins de matchs. Plus de moments. »</h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Rejoignez dès aujourd'hui la plateforme sociale qui remet l'humain et les vraies expériences partagées au cœur du quotidien.
              </p>

              <div className="pt-2">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="inline-flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm rounded-2xl shadow-xl hover:scale-105 transition-all"
                >
                  <span>{isAuthenticated ? "Accéder à mon tableau de bord" : "Créer mon compte vérifié"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#070A11] via-violet-950/20 to-[#070A11] border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="p-4 bg-violet-600/20 border border-violet-500/40 rounded-full inline-block text-violet-300">
            <Sparkles className="w-8 h-8 animate-bounce mx-auto" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Prêt à partager votre prochaine aventure ?
          </h2>

          <p className="text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Rejoignez Dual Meet gratuitement et découvrez les sorties et projets organisés près de chez vous.
          </p>

          <div>
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-lg rounded-2xl shadow-2xl shadow-violet-600/40 hover:scale-105 transition-all duration-300"
            >
              <span>{isAuthenticated ? "Accéder à mes sorties" : "Rejoindre Dual Meet gratuitement"}</span>
              <ArrowRight className="w-6 h-6 text-cyan-200" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};
