import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useToast } from '../context/ToastContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const ForgotPasswordPage: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState<string>('');
  const [sent, setSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isSupabaseConfigured) {
      try {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });

        if (resetError) {
          setError(resetError.message);
          showToast(resetError.message, 'error');
          setLoading(false);
          return;
        }

        setSent(true);
        showToast('E-mail de réinitialisation envoyé avec succès !', 'success');
        setLoading(false);
        return;
      } catch (err: any) {
        setError(err?.message || 'Erreur lors de l’envoi de l’e-mail.');
        setLoading(false);
        return;
      }
    }

    // Demo Mode
    setSent(true);
    showToast('Un e-mail de réinitialisation vous a été envoyé (Mode Démo).', 'info');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-center items-center px-4 py-12 relative">
      <div className="w-full max-w-md space-y-8">

        <div className="text-center space-y-2">
          <Logo size="lg" />
          <h2 className="text-2xl font-black text-white pt-4">Mot de passe oublié</h2>
          <p className="text-xs text-slate-400">Entrez votre e-mail pour recevoir le lien de réinitialisation</p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {sent ? (
            <div className="text-center space-y-4 py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-lg text-white">E-mail envoyé !</h3>
              <p className="text-xs text-slate-300">
                Si un compte existe avec l'adresse <span className="font-bold text-white">{email}</span>, vous recevrez les instructions par e-mail sous quelques minutes.
              </p>
              <Link to="/login" className="inline-block mt-4 text-xs font-bold text-violet-400 hover:underline">
                ← Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
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
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-violet-600/30 transition-all"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>

              <div className="text-center pt-2">
                <Link to="/login" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Retour à la connexion
                </Link>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
