import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
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
  refreshProfile: () => Promise<void>;
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
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchProfile = async (userId: string, email?: string, metadata?: any) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const userPhone = profile?.phone || metadata?.phone || '';
      const isPhoneVerified = Boolean(profile?.phone_verified || (userPhone && userPhone.length >= 8));

      const merged: UserProfile = {
        id: userId,
        display_name: profile?.display_name || metadata?.display_name || email?.split('@')[0] || 'Membre',
        email: email || profile?.email || '',
        email_verified: true,
        phone: userPhone,
        phone_verified: isPhoneVerified,
        city: profile?.city || '',
        latitude: profile?.latitude || 42.6986,
        longitude: profile?.longitude || 2.8956,
        avatar_url: profile?.avatar_url || metadata?.avatar_url || '',
        bio: profile?.bio || '',
        interests: profile?.interests || [],
        preferred_activities: profile?.preferred_activities || [],
        availability: profile?.availability || '',
        categories: profile?.categories || ['friendship', 'group_outings'],
        activity_levels: profile?.activity_levels || {},
        show_activity_stats: profile?.show_activity_stats !== false,
        is_admin: email?.toLowerCase() === 'mowglysensei@gmail.com' || profile?.is_admin === true,
        created_at: profile?.created_at || new Date().toISOString(),
      };

      setUser(merged);
    } catch (e) {
      // Fallback
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email);
    }
  };

  useEffect(() => {
    const initSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setAuthError(error.message);
          setUser(null);
        } else if (session?.user) {
          await fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
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

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
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

    if (!password) {
      setAuthError('Mot de passe obligatoire.');
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

      await fetchProfile(data.user.id, data.user.email, data.user.user_metadata);
      setAuthError(null);
      setLoading(false);
      return true;
    } catch (err: any) {
      setAuthError(err?.message || 'Erreur de connexion.');
      setUser(null);
      setLoading(false);
      return false;
    }
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

    if (!password) {
      setAuthError('Mot de passe obligatoire.');
      setLoading(false);
      return { success: false };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName, birth_date: birthDate, phone, phone_verified: true },
        },
      });

      if (error || !data.user) {
        setAuthError(error?.message || "Erreur lors de l'inscription.");
        setLoading(false);
        return { success: false };
      }

      if (data.user && !data.session) {
        setLoading(false);
        return { success: true, requiresEmailConfirmation: true };
      }

      await fetchProfile(data.user.id, data.user.email, data.user.user_metadata);
      setLoading(false);
      return { success: true, requiresEmailConfirmation: false };
    } catch (err: any) {
      setAuthError(err?.message || "Échec de l'inscription.");
      setLoading(false);
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  const updateProfile = async (updatedData: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data: updatedProfile, error } = await supabase
        .from('profiles')
        .update({
          display_name: updatedData.display_name,
          avatar_url: updatedData.avatar_url,
          bio: updatedData.bio,
          city: updatedData.city,
          phone: updatedData.phone,
          phone_verified: updatedData.phone_verified !== undefined ? updatedData.phone_verified : user.phone_verified,
          interests: updatedData.interests,
          preferred_activities: updatedData.preferred_activities,
          availability: updatedData.availability,
          activity_levels: updatedData.activity_levels,
          show_activity_stats: updatedData.show_activity_stats,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      const finalState = (updatedProfile as UserProfile) || { ...user, ...updatedData };
      setUser(finalState);
      return true;
    } catch (err: any) {
      setUser({ ...user, ...updatedData });
      return true;
    }
  };

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
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
