import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Calendar, ArrowRight, ShieldCheck, CheckSquare, Square, CheckCircle2, AlertCircle, Phone } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, authError } = useAuth();
  const { showToast } = useToast();

  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
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

    if (!phone || phone.length < 8) {
      showToast('Veuillez saisir un numéro de téléphone portable valide.', 'error');
      return;
    }

    setLoading(true);

    const result = await signup(
      displayName,
      email,
      birthDate,
      password,
      phone
    );

    setLoading(false);

    if (result.success) {
      if (result.requiresEmailConfirmation) {
        setEmailConfirmationSent(true);
        showToast('Lien de confirmation e-mail envoyé par Supabase !', 'info');
      } else {
        showToast('Compte vérifié et créé avec succès ! Bienvenue.', 'success');
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
          <h2 className="text-2xl font-black text-white pt-4">Créer votre compte authentique</h2>
          <p className="text-xs text-slate-400">Rejoignez la première communauté de sorties amicales avec vérification mobile</p>
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
              <div className="p-4 bg-violet-600/20 text-violet-300 border border-violet-500/30 rounded-full inline-block">
                <CheckCircle2 className="w-10 h-10 mx-auto text-cyan-400" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Vérification envoyée !</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Un e-mail de confirmation a été envoyé à <strong className="text-cyan-400">{email}</strong>. Cliquez sur le lien pour finaliser la création de votre compte.
              </p>
              <Link to="/login" className="inline-block px-6 py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-700">
                Aller à la page de connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Prénom ou Pseudonyme <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Ex: Camille, Thomas..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-bold"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Adresse e-mail <span className="text-rose-400">*</span>
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

              {/* Phone Verification Field */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Numéro de téléphone mobile <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="06 12 34 56 78 ou +33 6 12 34 56 78"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-semibold"
                  />
                </div>
                <p className="text-[10px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 shrink-0" />
                  <span>Validation anti-faux comptes : garantit 100% de membres réels et vérifiés.</span>
                </p>
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Date de naissance (Vous devez avoir +18 ans) <span className="text-rose-400">*</span>
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
                  Mot de passe <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="6 caractères minimum"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div
                onClick={() => setAgreeTerms(!agreeTerms)}
                className="flex items-start gap-2.5 cursor-pointer pt-1 group"
              >
                {agreeTerms ? (
                  <CheckSquare className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-600 shrink-0 mt-0.5 group-hover:text-slate-400" />
                )}
                <p className="text-xs text-slate-400 leading-snug">
                  J'accepte les <Link to="/terms" className="text-cyan-400 underline font-semibold">Conditions Générales (CGU)</Link> et confirme être majeur(e).
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-violet-600/30 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Création et vérification du compte...' : 'Créer mon compte vérifié'}</span>
                <ArrowRight className="w-4 h-4 text-cyan-200" />
              </button>

            </form>
          )}

        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  );
};
