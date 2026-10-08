export type CategoryType =
  | 'Randonnée'
  | 'Bowling'
  | 'Restaurant'
  | 'Vélo'
  | 'Jeux vidéo'
  | 'Sport'
  | 'Padel & Tennis'
  | 'Escape Game'
  | 'Karaoké & Blind Test'
  | 'Bivouac & Camping'
  | 'Kayak & Paddle'
  | 'Escalade & Bloc'
  | 'Billard & Fléchettes'
  | 'Atelier & Cuisine'
  | 'Échange Linguistique'
  | 'Cleanwalk & Écologie'
  | 'Plage'
  | 'Sorties culturelles'
  | 'Café'
  | 'Course à pied'
  | 'Fitness'
  | 'Sports collectifs'
  | 'Cinéma'
  | 'Promenade'
  | 'Jeux de société'
  | 'Sorties nocturnes'
  | 'Voyages'
  | 'Autre';

export type UserCategoryPreference = 'friendship' | 'activity_partner' | 'group_outings';

export interface UserGalleryPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  is_main: boolean;
  display_order: number;
  created_at: string;
}

export type RelationshipStatus = 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'rejected';

export interface UserRelationship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  email?: string;
  email_verified?: boolean;
  phone?: string;
  phone_verified?: boolean;
  age?: number;
  birth_date?: string;
  city: string;
  latitude: number;
  longitude: number;
  avatar_url: string;
  bio?: string;
  interests: string[];
  preferred_activities: string[];
  availability: string;
  categories: UserCategoryPreference[];
  activity_levels?: Record<string, string>;
  show_activity_stats?: boolean;
  is_admin?: boolean;
  created_at: string;
  gallery?: UserGalleryPhoto[];
  stats?: {
    organized_count: number;
    joined_count: number;
    communities_count: number;
    badges_count: number;
  };
}

export interface Activity {
  id: string;
  organizer_id: string;
  organizer?: UserProfile;
  title: string;
  slug?: string;
  description: string;
  category: CategoryType;
  date_time: string;
  end_time?: string;
  city: string;
  latitude: number;
  longitude: number;
  address?: string;
  max_participants: number;
  current_participants_count?: number;
  is_spontaneous: boolean;
  is_two_person: boolean;
  has_carpooling?: boolean;
  budget: string;
  fitness_level: string;
  status: 'open' | 'full' | 'cancelled' | 'completed';
  image_url: string;
  created_at: string;
  participants?: UserProfile[];
}

export interface ActivityRequest {
  id: string;
  activity_id: string;
  activity?: Activity;
  user_id: string;
  user?: UserProfile;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  last_message?: string;
  last_message_at?: string;
  unread_count?: number;
  members?: UserProfile[];
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender?: UserProfile;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  meta_id?: string;
  created_at: string;
}

export interface TravelProject {
  id: string;
  organizer_id: string;
  organizer?: UserProfile;
  country: string;
  country_flag: string;
  visa_type: string;
  title: string;
  description: string;
  departure_date: string;
  duration: string;
  arrival_city: string;
  estimated_budget: string;
  travel_style: string;
  housing_plan: string;
  language_level: string;
  max_participants: number;
  current_participants_count: number;
  created_at: string;
  participants?: UserProfile[];
}
