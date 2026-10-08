import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  Square,
  CheckCircle2,
  AlertCircle,
  Phone,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, authError } = useAuth();
  const { showToast } = useToast();

  const [displayName, setDisplayName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [birthDate, setBirthDate] = useState<string>('1998-05-14');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [resendingEmail, setResendingEmail] = useState<boolean>(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState<boolean>(false);

  // Real-time Validation Checks
  const isPasswordLengthValid = password.length >= 8;
  const isConfirmPasswordMatching = confirmPassword.length > 0 && password === confirmPassword;
  const hasConfirmError = confirmPassword.length > 0 && password !== confirmPassword;

  const isFormValid =
    displayName.trim().length > 0 &&
    email.includes('@') &&
    phone.length >= 8 &&
    isPasswordLengthValid &&
    isConfirmPasswordMatching &&
    agreeTerms &&
    !loading;

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

    if (!isPasswordLengthValid) {
      showToast('Le mot de passe doit contenir au moins 8 caractères.', 'error');
      return;
    }

    if (!isConfirmPasswordMatching) {
      showToast('Les mots de passe ne correspondent pas.', 'error');
      return;
    }

    setLoading(true);

    // Pass ONLY the real password to signup function
    const result = await signup(
      displayName.trim(),
      email.trim(),
      birthDate,
      password,
      phone.trim()
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

  const handleResendConfirmationEmail = async () => {
    if (!email || !isSupabaseConfigured) return;

    setResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: 'https://dual-meet-4ysc.vercel.app/dashboard'
        }
      });

      if (!error) {
        showToast('E-mail de confirmation renvoyé ! Vérifiez votre boîte de réception et vos spams.', 'success');
      } else {
        showToast(error.message || 'Erreur lors du renvoi de l’e-mail.', 'error');
      }
    } catch (err: any) {
      showToast('Erreur lors du renvoi de l’e-mail.', 'error');
    } finally {
      setResendingEmail(false);
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
              <h3 className="text-xl font-extrabold text-white">Compte créé !</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Vérifie ton adresse e-mail <strong className="text-cyan-400">{email}</strong> pour activer ton compte Dual Meet.
              </p>
              <p className="text-[11px] text-amber-300/90 font-medium">
                📩 Vérifie également ton dossier de spams ou courriers indésirables.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResendConfirmationEmail}
                  disabled={resendingEmail}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${resendingEmail ? 'animate-spin' : ''}`} />
                  <span>{resendingEmail ? 'Envoi en cours...' : 'Renvoyer l\'e-mail de confirmation'}</span>
                </button>

                <Link to="/login" className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-xl shadow transition-colors">
                  Page de connexion
                </Link>
              </div>
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
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="8 caractères minimum"
                    className={`w-full bg-slate-900 border rounded-xl pl-10 pr-11 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                      password.length > 0 && !isPasswordLengthValid
                        ? 'border-rose-500 focus:border-rose-400'
                        : isPasswordLengthValid
                        ? 'border-emerald-500 focus:border-emerald-400'
                        : 'border-slate-700 focus:border-cyan-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Helper Indicator */}
                {password.length > 0 && !isPasswordLengthValid ? (
                  <p className="text-[10px] text-rose-400 mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Le mot de passe doit contenir au moins 8 caractères.</span>
                  </p>
                ) : isPasswordLengthValid ? (
                  <p className="text-[10px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Mot de passe valide (8+ caractères).</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-400 mt-1">8 caractères minimum.</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirmer le mot de passe <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Saisissez à nouveau votre mot de passe"
                    className={`w-full bg-slate-900 border rounded-xl pl-10 pr-11 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                      hasConfirmError
                        ? 'border-rose-500 focus:border-rose-400'
                        : isConfirmPasswordMatching
                        ? 'border-emerald-500 focus:border-emerald-400'
                        : 'border-slate-700 focus:border-cyan-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Masquer la confirmation du mot de passe' : 'Afficher la confirmation du mot de passe'}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Confirm Password Helper */}
                {hasConfirmError ? (
                  <p className="text-[10px] text-rose-400 mt-1 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Les mots de passe ne correspondent pas.</span>
                  </p>
                ) : isConfirmPasswordMatching ? (
                  <p className="text-[10px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Mots de passe identiques.</span>
                  </p>
                ) : null}
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
                disabled={!isFormValid}
                className={`w-full py-3.5 font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isFormValid
                    ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-violet-600/30 hover:scale-[1.01]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>{loading ? 'Création du compte...' : 'Créer mon compte vérifié'}</span>
                <ArrowRight className={`w-4 h-4 ${isFormValid ? 'text-cyan-200' : 'text-slate-600'}`} />
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
