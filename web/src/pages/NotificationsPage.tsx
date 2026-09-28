import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { localStore } from '../lib/supabase';
import { Bell, UserCheck, Sparkles, UserPlus, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notifs, setNotifs] = useState(() => localStore.notifications);

  const markAllRead = () => {
    localStore.notifications.forEach(n => (n.is_read = true));
    setNotifs([...localStore.notifications]);
  };

  const handleAcceptContactInline = (notifId: string, metaId?: string) => {
    if (!user || !metaId) return;
    localStore.acceptContactRequest(user.id, metaId);
    showToast('Demande de contact acceptée !', 'success');

    // Mark as read
    const n = localStore.notifications.find(item => item.id === notifId);
    if (n) n.is_read = true;
    setNotifs([...localStore.notifications]);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-2">
              <Bell className="w-7 h-7 text-violet-400" />
              Centre de Notifications
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Demandes de contacts, invitations aux sorties et messages récents.
            </p>
          </div>

          <button
            onClick={markAllRead}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline"
          >
            Tout marquer comme lu
          </button>
        </div>

        <div className="space-y-3">
          {notifs.map(n => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                n.is_read ? 'bg-[#0F172A] border-slate-800 text-slate-400' : 'bg-violet-950/40 border-violet-500/40 text-white font-semibold'
              }`}
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2.5 bg-violet-600/20 text-violet-400 rounded-xl shrink-0 mt-0.5">
                  {n.type === 'contact_request_received' ? <UserPlus className="w-4 h-4 text-cyan-400" /> : <Sparkles className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-white">{n.title}</h4>
                  <p className="text-xs text-slate-300">{n.message}</p>
                  <p className="text-[10px] text-slate-500">
                    {new Date(n.created_at).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Contextual Actions inside Notifications */}
              <div className="shrink-0 flex items-center gap-2">
                {n.type === 'contact_request_received' && !n.is_read && n.meta_id && (
                  <button
                    onClick={() => handleAcceptContactInline(n.id, n.meta_id)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1 transition-all"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Accepter
                  </button>
                )}

                {n.link && (
                  <Link
                    to={n.link}
                    className="px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Voir
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
};
