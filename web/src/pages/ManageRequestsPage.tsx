import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle2, XCircle, Calendar, MessageSquare, ShieldCheck, ChevronRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { localStore } from '../lib/supabase';
import { ActivityRequest } from '../types';

export const ManageRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [requests, setRequests] = useState<ActivityRequest[]>(() => localStore.requests);

  const handleAccept = (reqId: string) => {
    const req = localStore.requests.find(r => r.id === reqId);
    if (req) {
      req.status = 'accepted';

      // Add user to participants
      const act = localStore.activities.find(a => a.id === req.activity_id);
      if (act && req.user) {
        if (!act.participants) act.participants = [act.organizer!];
        if (!act.participants.some(p => p.id === req.user!.id)) {
          act.participants.push(req.user);
          act.current_participants_count = act.participants.length;
        }
      }

      setRequests([...localStore.requests]);
      showToast('Demande acceptée ! Le membre a rejoint votre sortie.', 'success');
    }
  };

  const handleReject = (reqId: string) => {
    const req = localStore.requests.find(r => r.id === reqId);
    if (req) {
      req.status = 'rejected';
      setRequests([...localStore.requests]);
      showToast('Demande refusée.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        <div>
          <h1 className="text-3xl font-black text-white">Gestion des demandes de participation</h1>
          <p className="text-xs text-slate-400 mt-1">
            Consultez les membres qui souhaitent participer à vos sorties et gérez les places.
          </p>
        </div>

        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map(req => (
              <div
                key={req.id}
                className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Applicant Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={req.user?.avatar_url}
                    alt={req.user?.display_name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-violet-500 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{req.user?.display_name}</h3>
                      <span className="text-xs text-cyan-400">📍 {req.user?.city}</span>
                    </div>

                    <p className="text-xs font-semibold text-violet-300">
                      Pour : « {req.activity?.title || 'Sortie amicale'} »
                    </p>

                    {req.message && (
                      <p className="text-xs text-slate-300 italic bg-slate-900/80 p-3 rounded-xl border border-slate-800 mt-2 max-w-xl">
                        « {req.message} »
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {req.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4 text-rose-400" />
                        Refuser
                      </button>

                      <button
                        onClick={() => handleAccept(req.id)}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Accepter
                      </button>
                    </>
                  ) : req.status === 'accepted' ? (
                    <span className="px-4 py-2 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Accepté(e)
                    </span>
                  ) : (
                    <span className="px-4 py-2 bg-rose-500/20 text-rose-300 font-bold text-xs rounded-xl border border-rose-500/30">
                      Refusé(e)
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-3">
            <Users className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="font-bold text-white text-lg">Aucune demande en attente</h3>
            <p className="text-xs text-slate-400">
              Lorsque des membres demanderont à rejoindre vos activités, elles s'afficheront ici.
            </p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
