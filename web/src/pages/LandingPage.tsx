import React from 'react';
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
  Trophy
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const sampleCategories = [
    { name: 'Randonnée', icon: Mountain, img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600', desc: 'Sentiers, bivouacs et lacs en montagne' },
    { name: 'Bowling', icon: Trophy, img: 'https://images.unsplash.com/photo-1538388149542-5e24932d11a8?auto=format&fit=crop&q=80&w=600', desc: 'Parties conviviales et fous rires entre amis' },
    { name: 'Restaurant', icon: Utensils, img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600', desc: 'Découvertes gourmandes, cafés et bistros' },
    { name: 'Vélo & VTT', icon: Bike, img: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&q=80&w=600', desc: 'Sorties route, VTT et balades le long des côtes' },
    { name: 'Jeux vidéo & Société', icon: Gamepad2, img: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=600', desc: 'Bar à jeux, soirées console et jeux de plateau' },
    { name: 'Sport & Running', icon: Zap, img: 'https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&q=80&w=600', desc: 'Footing, tennis, musculation et partenaires de sport' },
    { name: 'Plage & Detente', icon: Waves, img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600', desc: 'Beach volley, baignade et bronzette au soleil' },
    { name: 'Sorties Culturelles', icon: Ticket, img: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=600', desc: 'Cinéma, concerts, théâtre et visites de musées' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">

      {/* Header */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Background Gradients & Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/10 to-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">

              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-bold shadow-lg shadow-violet-950/50">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Plateforme Sociale 100% Gratuite & Amicale</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Trouve quelqu’un pour faire{' '}
                <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                  ce que tu aimes.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0">
                Une randonnée, un resto, du vélo ou une sortie improvisée ? Rencontre des personnes près de chez toi et partage de nouvelles expériences.
              </p>

              {/* CTAs - Context-aware based on Auth state */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/explore"}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-violet-600/30 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                >
                  <Compass className="w-5 h-5" />
                  {isAuthenticated ? "Accéder au Tableau de Bord" : "Découvrir les activités"}
                </Link>

                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-2xl border border-slate-700 hover:border-slate-500 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Créer mon compte gratuitement
                    <ArrowRight className="w-5 h-5 text-cyan-400" />
                  </Link>
                )}
              </div>

              {/* Guarantees List */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Aucun algorithme de séduction</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sorties à deux ou en groupe</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Inscriptions illimitées</span>
                </div>
              </div>

            </div>

            {/* Right Illustration / Dynamic Preview Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">

                {/* Decorative Frame glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-cyan-400 rounded-3xl blur-2xl opacity-40 transform rotate-3" />

                {/* Main Card */}
                <div className="relative bg-[#0F172A] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">

                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                        alt="Membre Dual Meet"
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-violet-500"
                      />
                      <div>
                        <h4 className="font-bold text-white text-base">Membre Organisateur</h4>
                        <p className="text-xs text-cyan-400">📍 Exemple de sortie • Dual Meet</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-violet-600/30 text-violet-300 text-xs font-bold rounded-full border border-violet-500/40">
                      Randonnée
                    </span>
                  </div>

                  {/* Main Outing Image */}
                  <div className="relative h-48 rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
                      alt="Randonnée Pyrénées"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-slate-950/80 backdrop-blur-md rounded-lg text-xs font-bold text-emerald-400">
                      Gratuit • 4 places restantes
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div>
                    <h3 className="font-bold text-lg text-white">Randonnée au Lac des Bouillouses</h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      « Qui est chaud pour une superbe rando dans le Capcir ce samedi ? Ambiance amicale garantie ! »
                    </p>
                  </div>

                  {/* Participant Avatars */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex -space-x-2">
                      <img className="w-8 h-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="1" />
                      <img className="w-8 h-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100" alt="2" />
                      <img className="w-8 h-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="3" />
                      <div className="w-8 h-8 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center ring-2 ring-slate-900">
                        +2
                      </div>
                    </div>

                    <Link to={isAuthenticated ? "/dashboard" : "/register"} className="px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold text-xs rounded-xl shadow-md">
                      Rejoindre la sortie
                    </Link>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION DES ACTIVITÉS */}
      <section className="py-20 bg-[#070A10] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Diversité d'expériences</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Une multitude d’activités t’attendent
            </h2>
            <p className="text-base text-slate-400">
              Chaque jour, des membres proposent de nouvelles sorties amicales.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-[#0F172A] border border-slate-800 hover:border-violet-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/20"
                >
                  <div className="h-40 relative overflow-hidden">
                    <img
                      src={cat.img}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />
                    <div className="absolute top-3 left-3 p-2 bg-slate-950/80 backdrop-blur-md rounded-xl text-violet-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <h3 className="font-bold text-white text-base group-hover:text-violet-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION EXPLICATION EN 3 ÉTAPES */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Fonctionnement simple</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Comment fonctionne Dual Meet ?
            </h2>
            <p className="text-base text-slate-400">
              Rencontrer de nouveaux amis près de chez vous n’a jamais été aussi fluide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">

            {/* Step 1 */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 space-y-4 relative group hover:border-violet-500/50 transition-all">
              <div className="w-14 h-14 bg-violet-600/20 text-violet-400 border border-violet-500/30 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
                1
              </div>
              <h3 className="font-extrabold text-xl text-white">Trouve une activité</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Parcours le fil d’actualité ou utilise le moteur de recherche géographique pour voir les sorties prévues près de chez toi.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 space-y-4 relative group hover:border-cyan-500/50 transition-all">
              <div className="w-14 h-14 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                2
              </div>
              <h3 className="font-extrabold text-xl text-white">Rejoins ou crée la tienne</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Envoie une demande de participation en un clic ou publie gratuitement ta propre activité si rien ne correspond à tes envies.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 space-y-4 relative group hover:border-indigo-500/50 transition-all">
              <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                3
              </div>
              <h3 className="font-extrabold text-xl text-white">Rencontre & Partage</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Échange via le tchat dédié à la sortie, retrouve le groupe au lieu de rendez-vous et passe un super moment authentique.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION LES AVANTAGES DUAL MEET */}
      <section className="py-20 bg-[#070A10] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Pourquoi nous choisir ?</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Une plateforme pensée exclusivement pour la véritable amitié.
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Dual Meet se distingue radicalement des réseaux traditionnels et des applications de rencontre : ici, pas de superficialité, pas de likes basés sur le physique, uniquement la passion des activités partagées.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl mt-1 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Gratuit à 100%</h4>
                    <p className="text-xs text-slate-400">Pas d'abonnement mystère, pas de frais cachés, pas de limites de demandes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-violet-500/10 text-violet-400 rounded-xl mt-1 shrink-0">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Rencontres amicales uniquement</h4>
                    <p className="text-xs text-slate-400">Zéro drague lourde, une communauté modérée 24/7 bienveillante et chaleureuse.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl mt-1 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Sorties duo ou en groupe</h4>
                    <p className="text-xs text-slate-400">Ajuste le nombre de participants selon que tu préfères une sortie intime ou une grande table.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 space-y-6 text-center">
              <div className="inline-p-4 bg-gradient-to-tr from-violet-600 to-cyan-500 p-4 rounded-3xl text-white shadow-xl shadow-violet-600/30 mb-2">
                <Smile className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-2xl font-black text-white">« Moins de matchs. Plus de moments. »</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                Parce que la vraie vie se déroule sur un sentier de randonnée, autour d’une table de bowling ou devant une bonne pizza.
              </p>
              <div className="pt-4">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="inline-block px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-sm rounded-2xl shadow-xl hover:scale-105 transition-all"
                >
                  {isAuthenticated ? "Accéder à mon tableau de bord" : "Créer un compte maintenant"}
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#0B0F17] via-violet-950/20 to-[#070A10]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="p-4 bg-violet-600/20 border border-violet-500/40 rounded-full inline-block text-violet-300">
            <Sparkles className="w-8 h-8 animate-bounce mx-auto" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Et si ta prochaine sortie commençait ici ?
          </h2>

          <p className="text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Rejoins dès aujourd'hui les membres impatients de partager des activités conviviales près de chez toi.
          </p>

          <div>
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-lg rounded-2xl shadow-2xl shadow-violet-600/40 hover:scale-105 transition-all duration-300"
            >
              {isAuthenticated ? "Accéder à mes sorties" : "Rejoindre Dual Meet gratuitement"}
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
