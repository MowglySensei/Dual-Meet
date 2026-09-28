import React, { useState } from 'react';
import { ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { localStore } from '../lib/supabase';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId?: string;
  reportedActivityId?: string;
  targetName: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportedUserId,
  reportedActivityId,
  targetName,
}) => {
  const { showToast } = useToast();
  const [reason, setReason] = useState<string>('Comportement inapproprié');
  const [details, setDetails] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Log report in localStore
    localStore.reports.unshift({
      id: `rep-${Date.now()}`,
      reporter_id: 'current-user',
      reported_user_id: reportedUserId,
      reported_activity_id: reportedActivityId,
      reason,
      details,
      status: 'pending',
      created_at: new Date().toISOString(),
    });

    setSubmitted(true);
    showToast('Signalement transmis à l’équipe de modération Dual Meet.', 'success');

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-3xl shadow-2xl p-6 text-white">

        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Signaler un contenu</h3>
              <p className="text-xs text-slate-400 truncate max-w-[200px]">Cible : {targetName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-lg">Signalement bien reçu</h4>
            <p className="text-xs text-slate-400">
              Merci de nous aider à maintenir Dual Meet sécurisé et bienveillant. Nos modérateurs analysent votre demande.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Raison du signalement
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Comportement inapproprié">Comportement inapproprié</option>
                <option value="Tentative de séduction / Rencontre amoureuse (Interdit)">Tentative de séduction (Non-respect charte amicale)</option>
                <option value="Propos injurieux ou haineux">Propos injurieux ou haineux</option>
                <option value="Spam ou publicité commerciale">Spam ou publicité commerciale</option>
                <option value="Faux profil ou fausse activité">Faux profil ou fausse activité</option>
                <option value="Autre">Autre motif</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Précisions supplémentaires
              </label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                rows={3}
                placeholder="Décrivez brièvement le problème rencontré..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors shadow-lg shadow-rose-600/30"
              >
                Envoyer le signalement
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
