import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ShieldCheck, Users, Calendar, ShieldAlert, CheckCircle2, Trash2, Ban } from 'lucide-react';
import { localStore } from '../lib/supabase';
import { useToast } from '../context/ToastContext';

export const AdminDashboardPage: React.FC = () => {
  const { showToast } = useToast();
  const [reports, setReports] = useState(() => localStore.reports);

  const pendingReports = reports.filter(r => r.status === 'pending');

  const handleResolveReport = (reportId: string) => {
    const rep = localStore.reports.find(r => r.id === reportId);
    if (rep) {
      rep.status = 'resolved';
      setReports([...localStore.reports]);
      showToast('Signalement résolu avec succès.', 'success');
    }
  };

  const handleDismissReport = (reportId: string) => {
    const rep = localStore.reports.find(r => r.id === reportId);
    if (rep) {
      rep.status = 'dismissed';
      setReports([...localStore.reports]);
      showToast('Signalement classé sans suite.', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/40">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Espace d'Administration Dual Meet</h1>
            <p className="text-xs text-slate-400">Centre de modération, sécurité des membres et gestion de la plateforme.</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Membres Inscrits</span>
            <p className="text-3xl font-black text-white">1,420</p>
            <p className="text-[11px] text-emerald-400">+28 cette semaine</p>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activités Ouvertes</span>
            <p className="text-3xl font-black text-cyan-400">{localStore.activities.length}</p>
            <p className="text-[11px] text-slate-400">Partout en France</p>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Signalements en attente</span>
            <p className="text-3xl font-black text-rose-400">{pendingReports.length}</p>
            <p className="text-[11px] text-rose-300 font-semibold">À traiter par la modération</p>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Communautés</span>
            <p className="text-3xl font-black text-violet-400">{localStore.communities.length}</p>
            <p className="text-[11px] text-slate-400">Centres urbains & thématiques</p>
          </div>

        </div>

        {/* Reports Moderation Table */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-xl text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Signalements et Modération en direct</span>
            </h2>
          </div>

          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map(rep => (
                <div
                  key={rep.id}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 font-bold text-[10px] rounded uppercase">
                        {rep.reason}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(rep.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-xs text-white font-medium">Précisions : « {rep.details || 'Aucune précision'} »</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rep.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleDismissReport(rep.id)}
                          className="px-3 py-1.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 transition-colors"
                        >
                          Classer sans suite
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id)}
                          className="px-4 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-xl shadow transition-colors"
                        >
                          Sanctionner / Résoudre
                        </button>
                      </>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 font-bold text-xs rounded-xl">
                        Traité ({rep.status})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-6">Aucun signalement à traiter. La communauté est sereine !</p>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
};
