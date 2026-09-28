import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  MessageSquare,
  Bell,
  Compass,
  Calendar,
  MapPin,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  ShieldCheck,
  Moon,
  Sun,
  Users2,
  UserCheck,
  ChevronDown,
  Search
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { QuickSearchModal } from './QuickSearchModal';
import { localStore, MOCK_USERS, isSupabaseConfigured } from '../lib/supabase';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout, switchDemoUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState<boolean>(false);

  // Unread counts
  const unreadMessagesCount = localStore.conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);
  const unreadNotifsCount = localStore.notifications.filter(n => !n.is_read).length;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0B0F17]/90 backdrop-blur-md border-b border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

          {/* Logo */}
          <Logo showTagline size="md" />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 font-semibold text-sm">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3.5 py-2 rounded-xl transition-all ${
                    isActive('/dashboard')
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Découvrir
                </Link>

                <Link
                  to="/activities"
                  className={`px-3.5 py-2 rounded-xl transition-all ${
                    isActive('/activities')
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Activités
                </Link>

                <Link
                  to="/map"
                  className={`px-3.5 py-2 rounded-xl transition-all ${
                    isActive('/map')
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Carte
                </Link>

                <Link
                  to="/partners"
                  className={`px-3.5 py-2 rounded-xl transition-all ${
                    isActive('/partners')
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Partenaires
                </Link>

                <Link
                  to="/communities"
                  className={`px-3.5 py-2 rounded-xl transition-all ${
                    isActive('/communities')
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Communautés
                </Link>

                <Link
                  to="/travel"
                  className={`px-3.5 py-2 rounded-xl transition-all ${
                    isActive('/travel')
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Voyager ✈️
                </Link>
              </>
            ) : (
              <>
                <Link to="/explore" className="px-3.5 py-2 text-slate-300 hover:text-white transition-colors">
                  Découvrir
                </Link>
                <Link to="/how-it-works" className="px-3.5 py-2 text-slate-300 hover:text-white transition-colors">
                  Comment ça marche
                </Link>
                <Link to="/about" className="px-3.5 py-2 text-slate-300 hover:text-white transition-colors">
                  À propos
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">

            {/* Signature "JE VEUX SORTIR" Button */}
            {isAuthenticated && (
              <button
                onClick={() => setIsQuickSearchOpen(true)}
                className="relative group px-4 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-xs tracking-wider rounded-2xl shadow-lg shadow-violet-600/30 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 animate-spin text-cyan-200" style={{ animationDuration: '4s' }} />
                <span>JE VEUX SORTIR</span>
              </button>
            )}

            {/* Authenticated Icons & User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">

                {/* Messages icon */}
                <Link
                  to="/messages"
                  className="relative p-2.5 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
                  title="Messagerie"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                      {unreadMessagesCount}
                    </span>
                  )}
                </Link>

                {/* Notifications icon */}
                <Link
                  to="/notifications"
                  className="relative p-2.5 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center">
                      {unreadNotifsCount}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all"
                  >
                    <img
                      src={user?.avatar_url}
                      alt={user?.display_name}
                      className="w-8 h-8 rounded-xl object-cover ring-2 ring-violet-500/50"
                    />
                    <span className="hidden sm:block text-xs font-bold text-white max-w-[100px] truncate">
                      {user?.display_name}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-slate-800">
                        <p className="text-xs text-slate-400">Connecté en tant que</p>
                        <p className="text-sm font-bold text-white truncate">{user?.display_name}</p>
                        <p className="text-[11px] text-cyan-400 mt-0.5">📍 {user?.city || 'Ville non renseignée'}</p>
                      </div>

                      <div className="py-1 text-xs font-semibold">
                        <Link
                          to={`/user/${user?.id}`}
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-600/20 hover:text-violet-300 transition-colors"
                        >
                          <User className="w-4 h-4 text-violet-400" />
                          <span>Mon Profil Public</span>
                        </Link>

                        <Link
                          to="/my-activities"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-600/20 hover:text-violet-300 transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-cyan-400" />
                          <span>Mes Sorties & Demandes</span>
                        </Link>

                        <Link
                          to="/activities/create"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-600/20 hover:text-violet-300 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 text-emerald-400" />
                          <span>Créer une activité</span>
                        </Link>

                        <Link
                          to="/profile/edit"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-violet-600/20 hover:text-violet-300 transition-colors"
                        >
                          <UserCheck className="w-4 h-4 text-indigo-400" />
                          <span>Paramètres du compte</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-rose-400" />
                            <span>Espace Administrateur</span>
                          </Link>
                        )}
                      </div>

                      {/* Demo Switcher for testing offline/demo mode only */}
                      {!isSupabaseConfigured && (
                        <div className="pt-2 px-4 border-t border-slate-800">
                          <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Changer de compte demo</p>
                          <div className="flex gap-1.5">
                            {MOCK_USERS.map(u => (
                              <button
                                key={u.id}
                                onClick={() => {
                                  switchDemoUser(u.id);
                                  setIsProfileDropdownOpen(false);
                                }}
                                title={u.display_name}
                                className={`p-1 rounded-lg border text-[10px] font-bold ${
                                  user?.id === u.id ? 'border-violet-500 bg-violet-600/30' : 'border-slate-800 bg-slate-900'
                                }`}
                              >
                                {u.display_name.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-800 mt-2">
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              /* Unauthenticated Buttons */
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-300 hover:text-white text-xs font-bold transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-violet-600/30 transition-all hover:scale-105"
                >
                  Rejoindre Dual Meet
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white bg-slate-900 rounded-xl border border-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-30 bg-[#0B0F17]/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top duration-200">
          <div className="space-y-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white font-bold text-sm"
                >
                  📍 Découvrir les sorties
                </Link>
                <Link
                  to="/activities"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white font-bold text-sm"
                >
                  🔍 Moteur de recherche d'activités
                </Link>
                <Link
                  to="/map"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white font-bold text-sm"
                >
                  🗺️ Carte interactive
                </Link>
                <Link
                  to="/messages"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white font-bold text-sm"
                >
                  💬 Messagerie ({unreadMessagesCount})
                </Link>
                <Link
                  to="/partners"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white font-bold text-sm"
                >
                  🚴 Partneraires réguliers
                </Link>
                <Link
                  to="/travel"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white font-bold text-sm"
                >
                  ✈️ Voyager & Projets PVT
                </Link>
                <Link
                  to="/communities"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white font-bold text-sm"
                >
                  👥 Communautés locales
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/explore"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white font-bold text-sm"
                >
                  Découvrir
                </Link>
                <Link
                  to="/how-it-works"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white font-bold text-sm"
                >
                  Comment ça marche
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-3 bg-slate-800 text-white font-bold rounded-2xl"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-2xl"
                >
                  Rejoindre gratuitement
                </Link>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            <p>Dual Meet © {new Date().getFullYear()} — Plateforme sociale de rencontres amicales</p>
          </div>
        </div>
      )}

      {/* Signature Quick Search Wizard Modal */}
      <QuickSearchModal isOpen={isQuickSearchOpen} onClose={() => setIsQuickSearchOpen(false)} />

      {/* FIXED MOBILE BOTTOM NAVIGATION BAR FOR SMARTPHONES */}
      {isAuthenticated && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F172A]/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl flex items-center justify-around py-2 px-1 text-[11px] font-bold text-slate-400">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              isActive('/dashboard') ? 'text-violet-400 font-extrabold' : 'hover:text-white'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>Découvrir</span>
          </Link>

          <Link
            to="/activities"
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              isActive('/activities') ? 'text-violet-400 font-extrabold' : 'hover:text-white'
            }`}
          >
            <Search className="w-5 h-5" style={{ width: '20px', height: '20px' }} />
            <span>Sorties</span>
          </Link>

          <Link
            to="/map"
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              isActive('/map') ? 'text-cyan-400 font-extrabold' : 'hover:text-white'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span>GPS Carte</span>
          </Link>

          <Link
            to="/travel"
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              isActive('/travel') ? 'text-violet-400 font-extrabold' : 'hover:text-white'
            }`}
          >
            <span className="text-base leading-none">✈️</span>
            <span>Voyager</span>
          </Link>

          <Link
            to="/messages"
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors relative ${
              isActive('/messages') ? 'text-cyan-400 font-extrabold' : 'hover:text-white'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Tchat</span>
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 right-1 w-4 h-4 bg-cyan-500 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center">
                {unreadMessagesCount}
              </span>
            )}
          </Link>

          <Link
            to="/profile/edit"
            className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
              isActive('/profile/edit') ? 'text-violet-400 font-extrabold' : 'hover:text-white'
            }`}
          >
            <User className="w-5 h-5" />
            <span>Profil</span>
          </Link>
        </div>
      )}
    </>
  );
};
