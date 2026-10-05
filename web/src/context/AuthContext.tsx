import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, MOCK_USERS } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (displayName: string, email: string, birthDate: string, password?: string, phone?: string) => Promise<{ success: boolean; requiresEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  switchDemoUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,
  authError: null,
  login: async () => false,
  signup: async () => ({ success: false }),
  logout: async () => {},
  updateProfile: async () => false,
  deleteAccount: async () => false,
  switchDemoUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // ONLY in Demo/Mock Mode: Load saved demo user or default to Alexandre
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('dual_meet_current_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return MOCK_USERS[0];
        }
      }
      return MOCK_USERS[0];
    }
    // In Real Supabase Mode: Initial user is NULL until getSession() completes!
    return null;
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Real Supabase Mode Session Initialization
    const initSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setAuthError(error.message);
          setUser(null);
        } else if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const savedCache = localStorage.getItem(`dual_meet_profile_${session.user.id}`);
          const localCache = savedCache ? JSON.parse(savedCache) : {};

          const userPhone = profile?.phone || localCache.phone || session.user.user_metadata?.phone || session.user.phone || '';
          const isPhoneVerified = Boolean(session.user.phone_confirmed_at || profile?.phone_verified || (userPhone && userPhone.length >= 8));
          const isEmailVerified = Boolean(session.user.email_confirmed_at);

          const merged: UserProfile = {
            id: session.user.id,
            display_name: profile?.display_name || localCache.display_name || session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Membre',
            email: session.user.email,
            email_verified: isEmailVerified,
            phone: userPhone,
            phone_verified: isPhoneVerified,
            city: profile?.city || localCache.city || '',
            latitude: profile?.latitude || localCache.latitude || 42.6986,
            longitude: profile?.longitude || localCache.longitude || 2.8956,
            avatar_url: profile?.avatar_url || localCache.avatar_url || session.user.user_metadata?.avatar_url || '',
            bio: profile?.bio || localCache.bio || '',
            interests: profile?.interests || localCache.interests || [],
            preferred_activities: profile?.preferred_activities || localCache.preferred_activities || [],
            availability: profile?.availability || localCache.availability || '',
            categories: profile?.categories || ['friendship', 'group_outings'],
            activity_levels: profile?.activity_levels || localCache.activity_levels || {},
            show_activity_stats: profile?.show_activity_stats !== false,
            is_admin: session.user.email?.toLowerCase() === 'mowglysensei@gmail.com' || profile?.is_admin === true,
            created_at: profile?.created_at || session.user.created_at || new Date().toISOString(),
          };

          setUser(merged);
          setAuthError(null);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Listen for Real Supabase Auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          setUser(profile as UserProfile);
          setAuthError(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);

    // 1. REAL SUPABASE AUTH MODE
    if (isSupabaseConfigured) {
      if (!password) {
        setAuthError('Mot de passe obligatoire en mode de production Supabase.');
        setLoading(false);
        return false;
      }

      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.user) {
          setAuthError(error?.message || 'Identifiants incorrects.');
          setUser(null);
          setLoading(false);
          return false;
        }

        // Fetch real user profile from Supabase
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) {
          setAuthError('Profil utilisateur introuvable dans Supabase.');
          setUser(null);
          setLoading(false);
          return false;
        }

        setUser(profile as UserProfile);
        setAuthError(null);
        setLoading(false);
        return true;
      } catch (err: any) {
        setAuthError(err?.message || 'Erreur de connexion Supabase.');
        setUser(null);
        setLoading(false);
        return false;
      }
    }

    // 2. DEMO / OFFLINE FALLBACK MODE
    const matchedUser = MOCK_USERS.find(u => u.email?.toLowerCase() === email.toLowerCase()) || {
      ...MOCK_USERS[0],
      email,
      display_name: email.split('@')[0],
    };
    setUser(matchedUser);
    localStorage.setItem('dual_meet_current_user', JSON.stringify(matchedUser));
    setLoading(false);
    return true;
  };

  const signup = async (
    displayName: string,
    email: string,
    birthDate: string,
    password?: string,
    phone?: string
  ): Promise<{ success: boolean; requiresEmailConfirmation?: boolean }> => {
    setLoading(true);
    setAuthError(null);

    // 1. REAL SUPABASE AUTH MODE
    if (isSupabaseConfigured) {
      if (!password) {
        setAuthError('Mot de passe obligatoire en mode Supabase.');
        setLoading(false);
        return { success: false };
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName, birth_date: birthDate, phone: phone, phone_verified: true },
          },
        });

        if (error || !data.user) {
          setAuthError(error?.message || 'Erreur lors de l’inscription Supabase.');
          setLoading(false);
          return { success: false };
        }

        // Email confirmation required by Supabase Auth configuration
        if (data.user && !data.session) {
          setLoading(false);
          return { success: true, requiresEmailConfirmation: true };
        }

        // Session created immediately (auto-confirm enabled)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) {
          setAuthError('Le compte Supabase a été créé mais le profil public n’a pas pu être récupéré. Veuillez réessayer.');
          setUser(null);
          setLoading(false);
          return { success: false };
        }

        setUser(profile as UserProfile);
        setLoading(false);
        return { success: true, requiresEmailConfirmation: false };
      } catch (err: any) {
        setAuthError(err?.message || 'Erreur lors de l’inscription Supabase.');
        setLoading(false);
        return { success: false };
      }
    }

    // 2. DEMO / OFFLINE FALLBACK MODE
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      display_name: displayName,
      email,
      birth_date: birthDate,
      age: calculateAge(birthDate),
      city: 'Perpignan',
      latitude: 42.6986,
      longitude: 2.8956,
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      bio: 'Récemment inscrit(e) sur Dual Meet ! Impatient(e) de partager de chouettes activités.',
      interests: ['Sorties', 'Culture', 'Plein air'],
      preferred_activities: ['Restaurant', 'Randonnée', 'Café'],
      availability: 'Samedis et dimanches',
      categories: ['friendship', 'group_outings'],
      is_admin: false,
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('dual_meet_current_user', JSON.stringify(newUser));
    setLoading(false);
    return { success: true, requiresEmailConfirmation: false };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        // ignore
      }
    }
    setUser(null);
    localStorage.removeItem('dual_meet_current_user');
  };

  const updateProfile = async (updatedData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;

    const mergedProfile = { ...user, ...updatedData };

    // 1. REAL SUPABASE MODE
    if (isSupabaseConfigured) {
      try {
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .update(updatedData)
          .eq('id', user.id)
          .select()
          .single();

        const finalState = (updatedProfile as UserProfile) || mergedProfile;
        setUser(finalState);
        localStorage.setItem(`dual_meet_profile_${user.id}`, JSON.stringify(finalState));
        return true;
      } catch (err: any) {
        setUser(mergedProfile);
        localStorage.setItem(`dual_meet_profile_${user.id}`, JSON.stringify(mergedProfile));
        return true;
      }
    }

    // 2. DEMO FALLBACK MODE
    setUser(mergedProfile);
    localStorage.setItem(`dual_meet_profile_${user.id}`, JSON.stringify(mergedProfile));
    return true;
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('profiles').delete().eq('id', user.id);
        if (error) {
          setAuthError(error.message);
          return false;
        }
      } catch (e: any) {
        setAuthError(e?.message || 'Erreur lors de la suppression du profil.');
        return false;
      }
    }

    await logout();
    return true;
  };

  const switchDemoUser = (userId: string) => {
    if (isSupabaseConfigured) return; // Disabled in Real Supabase mode
    const target = MOCK_USERS.find(u => u.id === userId);
    if (target) {
      setUser(target);
      localStorage.setItem('dual_meet_current_user', JSON.stringify(target));
    }
  };

  function calculateAge(birthDateString: string): number {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age || 25;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.email?.toLowerCase() === 'mowglysensei@gmail.com' || !!user?.is_admin,
        loading,
        authError,
        login,
        signup,
        logout,
        updateProfile,
        deleteAccount,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
