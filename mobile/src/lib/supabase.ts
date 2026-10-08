import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity, UserProfile, TravelProject, Conversation, Message, NotificationItem } from '../types';

const supabaseUrl = 'https://vwvdjwfgkeqdfuecaris.supabase.co';
const supabaseAnonKey = 'sb_publishable_rZyt5iXdRuXJ0qQ4HC9-Cw__blKtmJY';

export const isSupabaseConfigured = true;

export const COUNTRY_GUIDES = [
  {
    country: 'Australie',
    flag: '🇦🇺',
    visa_name: 'PVT 417 / Working Holiday Visa',
    official_url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417',
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    visa_name: 'PVT Canada (EIC)',
    official_url: 'https://www.canada.ca/fr/immigration-refugies-citoyennete/services/travailler-canada/eic.html',
  },
  {
    country: 'Nouvelle-Zélande',
    flag: '🇳🇿',
    visa_name: 'Working Holiday Visa (NZ)',
    official_url: 'https://www.immigration.govt.nz/new-zealand-visas/visas/visa/france-working-holiday-visa',
  },
  {
    country: 'Japon',
    flag: '🇯🇵',
    visa_name: 'PVT Japon / Working Holiday',
    official_url: 'https://www.fr.emb-japan.go.jp/itpr_fr/consulat_visa_vacances-travail.html',
  },
  {
    country: 'Corée du Sud',
    flag: '🇰🇷',
    visa_name: 'PVT Corée du Sud (H-1)',
    official_url: 'https://overseas.mofa.go.kr/fr-fr/brd/m_27218/view.do?seq=2',
  }
];

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const api = {
  async getActivities(): Promise<Activity[]> {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*, organizer:profiles(*), participants:activity_participants(user:profiles(*))')
        .order('date_time', { ascending: true });
      if (!error && data) return data as Activity[];
      return [];
    } catch (e) {
      return [];
    }
  },

  async getRealMembers(currentUserId?: string): Promise<UserProfile[]> {
    try {
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (currentUserId) {
        query = query.neq('id', currentUserId);
      }
      const { data, error } = await query;
      if (!error && data) return data as UserProfile[];
      return [];
    } catch (e) {
      return [];
    }
  },

  async getTravelProjects(): Promise<TravelProject[]> {
    try {
      const { data, error } = await supabase
        .from('travel_projects')
        .select('*, organizer:profiles(*), participants:travel_project_participants(user:profiles(*))')
        .order('created_at', { ascending: false });
      if (!error && data) return data as TravelProject[];
      return [];
    } catch (e) {
      return [];
    }
  },

  async createActivity(act: Omit<Activity, 'id' | 'created_at'>): Promise<Activity> {
    const { data, error } = await supabase
      .from('activities')
      .insert({
        organizer_id: act.organizer_id,
        title: act.title,
        description: act.description,
        category: act.category,
        date_time: act.date_time,
        city: act.city,
        latitude: act.latitude,
        longitude: act.longitude,
        address: act.address,
        max_participants: act.max_participants,
        is_spontaneous: act.is_spontaneous,
        is_two_person: act.is_two_person,
        has_carpooling: act.has_carpooling,
        budget: act.budget,
        fitness_level: act.fitness_level,
        image_url: act.image_url,
      })
      .select()
      .single();

    if (error || !data) throw error || new Error("Erreur de création de l'activité");
    return data as Activity;
  },

  async uploadPhoto(fileUri: string, bucket: 'avatars' | 'user-gallery'): Promise<string> {
    const fileExt = fileUri.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const response = await fetch(fileUri);
    const blob = await response.blob();

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, blob, { cacheControl: '3600', upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  }
};
