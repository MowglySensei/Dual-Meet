import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { localStore } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, ChevronLeft, Calendar, ShieldAlert } from 'lucide-react';
import { Conversation, Message } from '../types';
import { Link } from 'react-router-dom';

export const MessagingPage: React.FC = () => {
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>(() => localStore.conversations);
  const [activeConvId, setActiveConvId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState<string>('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const messages = localStore.messages.filter(m => m.conversation_id === activeConvId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !activeConv) return;

    localStore.addMessage(activeConv.id, user, inputText.trim());
    setInputText('');
    setConversations([...localStore.conversations]);
  };

  const handleSelectConv = (id: string) => {
    setActiveConvId(id);
    const conv = conversations.find(c => c.id === id);
    if (conv) conv.unread_count = 0;
    setMobileView('chat');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">

        <div className="bg-[#0F172A] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex-1 grid grid-cols-1 md:grid-cols-12 min-h-[600px]">

          {/* Conversation List (Left 4 cols - Mobile responsive toggle) */}
          <div className={`md:col-span-4 border-r border-slate-800 flex flex-col ${
            mobileView === 'chat' ? 'hidden md:flex' : 'flex'
          }`}>
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-violet-400" />
                <span>Messagerie</span>
              </h2>
              <span className="text-xs text-slate-400 font-bold">{conversations.length} discussion(s)</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
              {conversations.length > 0 ? (
                conversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConv(conv.id)}
                    className={`w-full p-4 text-left flex items-start gap-3 transition-colors ${
                      activeConvId === conv.id ? 'bg-violet-600/20 border-l-4 border-violet-500' : 'hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.members[0]?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                        alt={conv.title || 'Discussion'}
                        className="w-11 h-11 rounded-2xl object-cover ring-2 ring-violet-500/40"
                      />
                      {conv.type === 'activity' && (
                        <span className="absolute -bottom-1 -right-1 bg-violet-600 text-white text-[9px] p-0.5 rounded-full">
                          🎪
                        </span>
                      )}
                    </div>

                    <div className="overflow-hidden flex-1 space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-xs text-white truncate">{conv.title || 'Discussion'}</h4>
                        <span className="text-[10px] text-slate-500 shrink-0">12:30</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate">{conv.last_message || 'Nouvelle conversation'}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Aucune conversation active pour le moment.
                </div>
              )}
            </div>
          </div>

          {/* Active Chat Window (Right 8 cols - Mobile responsive toggle) */}
          <div className={`md:col-span-8 flex flex-col bg-[#0B0F17]/50 ${
            mobileView === 'list' ? 'hidden md:flex' : 'flex'
          }`}>

            {activeConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-800 bg-[#0F172A] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setMobileView('list')}
                      className="md:hidden p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-xl border border-slate-800"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <img
                      src={activeConv.members[0]?.avatar_url}
                      alt={activeConv.title || 'Chat'}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-white">{activeConv.title || 'Discussion'}</h3>
                      <p className="text-[10px] text-cyan-400">
                        {activeConv.type === 'activity' ? 'Tchat de groupe de la sortie' : 'Conversation privée'}
                      </p>
                    </div>
                  </div>

                  {activeConv.activity_id && (
                    <Link
                      to={`/activity/${activeConv.activity_id}`}
                      className="px-3 py-1.5 bg-violet-600/20 text-violet-300 text-xs font-bold rounded-xl border border-violet-500/30 hover:bg-violet-600 hover:text-white transition-colors"
                    >
                      Voir la sortie
                    </Link>
                  )}
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {messages.length > 0 ? (
                    messages.map(msg => {
                      const isMe = msg.sender_id === user?.id;
                      return (
                        <div key={msg.id} className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          {!isMe && (
                            <img
                              src={msg.sender?.avatar_url}
                              alt={msg.sender?.display_name}
                              className="w-8 h-8 rounded-xl object-cover shrink-0 mt-1"
                            />
                          )}
                          <div className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                            isMe
                              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-none'
                              : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                          }`}>
                            {!isMe && (
                              <p className="font-bold text-[10px] text-cyan-300">{msg.sender?.display_name}</p>
                            )}
                            <p>{msg.content}</p>
                            <span className="block text-[9px] opacity-60 text-right">
                              {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 text-center text-xs text-slate-500">
                      Soyez le premier à envoyer un message dans cette discussion !
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-[#0F172A] flex items-center gap-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-violet-500"
                  />
                  <button
                    type="submit"
                    className="p-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-xl shadow-lg hover:scale-105 transition-all shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3">
                <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-white">Aucune conversation sélectionnée</p>
                <p className="text-xs text-slate-400">Sélectionnez une discussion à gauche pour échanger avec vos contacts.</p>
              </div>
            )}

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};
