import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState<string>('alex@dualmeet.fr');
  const [password, setPassword] = useState<string>('password123');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      showToast('Bienvenue sur Dual Meet !', 'success');
      navigate('/dashboard');
    } else {
      setError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">

        {/* Logo */}
        <div className="text-center space-y-2">
          <Logo size="lg" showTagline />
          <h2 className="text-2xl font-black text-white pt-4">Connexion à votre espace</h2>
          <p className="text-xs text-slate-400">Retrouvez vos activités et vos messages amicaux</p>
        </div>

        {/* Card */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Mot de passe
                </label>
                <Link to="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 font-semibold">
                  Oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-violet-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Guarantee */}
          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Dual Meet est 100% gratuit et sécurisé.</span>
          </div>

        </div>

        {/* Bottom Link */}
        <p className="text-center text-xs text-slate-400 font-medium">
          Vous n'avez pas encore de compte ?{' '}
          <Link to="/register" className="text-violet-400 font-bold hover:text-violet-300 underline">
            Inscrivez-vous gratuitement
          </Link>
        </p>

      </div>
    </div>
  );
};
