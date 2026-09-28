import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Calendar, ArrowRight, ShieldCheck, CheckSquare, Square, CheckCircle2, AlertCircle } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, authError } = useAuth();
  const { showToast } = useToast();

  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('1998-05-14');
  const [password, setPassword] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      showToast('Veuillez accepter les conditions d’utilisation.', 'error');
      return;
    }

    setLoading(true);
    const result = await signup(displayName, email, birthDate, password);
    setLoading(false);

    if (result.success) {
      if (result.requiresEmailConfirmation) {
        setEmailConfirmationSent(true);
        showToast('Lien de confirmation e-mail envoyé par Supabase !', 'info');
      } else {
        showToast('Compte créé avec succès ! Bienvenue.', 'success');
        navigate('/profile/edit');
      }
    } else {
      showToast('Erreur lors de l’inscription.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-8 relative z-10">

        {/* Logo */}
        <div className="text-center space-y-2">
          <Logo size="lg" showTagline />
          <h2 className="text-2xl font-black text-white pt-4">Créer votre compte gratuit</h2>
          <p className="text-xs text-slate-400">Rejoignez la première communauté de sorties amicales</p>
        </div>

        {/* Card */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">

          {authError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {emailConfirmationSent ? (
            <div className="py-6 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="font-bold text-lg text-white">E-mail de confirmation envoyé !</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Un lien de confirmation a été envoyé à l'adresse <span className="font-bold text-white">{email}</span>. Cliquez sur le lien reçu pour activer votre compte et vous connecter.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors mt-2"
              >
                Aller à la page de connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Prénom ou Pseudonyme
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Ex: Camille, Thomas..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Date de naissance (Vous devez avoir +18 ans)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Mot de passe (8 caractères min)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Terms checkbox */}
              <div className="pt-2 flex items-start gap-3 cursor-pointer" onClick={() => setAgreeTerms(!agreeTerms)}>
                <div className="mt-0.5 text-cyan-400">
                  {agreeTerms ? <CheckSquare className="w-5 h-5 fill-cyan-500/20" /> : <Square className="w-5 h-5 text-slate-600" />}
                </div>
                <p className="text-xs text-slate-300 leading-snug">
                  J’accepte les{' '}
                  <Link to="/terms" className="text-cyan-400 underline" onClick={e => e.stopPropagation()}>
                    Conditions d'utilisation
                  </Link>{' '}
                  et certifie que mon profil est exclusivement destiné à des{' '}
                  <strong className="text-white">rencontres amicales et d'activités</strong> (pas de rencontre amoureuse).
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 mt-4"
              >
                {loading ? 'Inscription en cours...' : 'Créer mon compte Dual Meet'}
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

          {/* Guarantee */}
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dual Meet est 100% gratuit, sans publicité invasive ni option payante.</span>
          </div>

        </div>

        {/* Bottom Link */}
        <p className="text-center text-xs text-slate-400 font-medium">
          Déjà inscrit ?{' '}
          <Link to="/login" className="text-cyan-400 font-bold hover:text-cyan-300 underline">
            Connectez-vous ici
          </Link>
        </p>

      </div>
    </div>
  );
};
