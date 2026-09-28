import { createClient } from '@supabase/supabase-js';
import {
  Activity,
  UserProfile,
  ActivityRequest,
  Conversation,
  Message,
  NotificationItem,
  Community,
  PartnerSearch,
  ReportItem,
  UserRelationship,
  UserGalleryPhoto,
  ActivityInvitation,
  RelationshipStatus,
  TravelProject,
  CountryGuide
} from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'example-key';

export const isSupabaseConfigured =
  Boolean(import.meta.env.VITE_SUPABASE_URL) &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://example.supabase.co' &&
  Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) &&
  import.meta.env.VITE_SUPABASE_ANON_KEY !== 'example-key' &&
  import.meta.env.VITE_ENABLE_MOCK_DATA !== 'true';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const COUNTRY_GUIDES: CountryGuide[] = [
  {
    country: 'Australie',
    flag: '🇦🇺',
    visa_name: 'PVT 417 / Working Holiday Visa',
    conditions: 'Âge : 18 à 35 ans • Passeport valide • Preuve de fonds (~5 000 AUD)',
    cost: '~640 AUD (~390 €)',
    popular_cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Cairns'],
    tips: [
      'Demande de visa en ligne sur le site officiel de l’Immigration australienne.',
      'Acheter un van d’occasion pour explorer la côte Est en roadtrip.',
      'Possibilité de renouveler le visa pour une 2e et 3e année (88 jours de travail agricole/farmwork).'
    ]
  },
  {
    country: 'Canada',
    flag: '🇨🇦',
    visa_name: 'PVT Canada (Expérience Internationale Canada)',
    conditions: 'Âge : 18 à 35 ans • Tirage au sort (Bassin EIC) • Preuve de fonds (2 500 CAD)',
    cost: '~357 CAD (~240 €)',
    popular_cities: ['Montreal', 'Vancouver', 'Toronto', 'Quebec', 'Calgary'],
    tips: [
      'Inscrivez-vous dès l’ouverture des bassins EIC chaque année.',
      'Prévoyez des vêtements très chauds pour les mois d’hiver (-20°C).',
      'Possibilité de travailler dans le domaine de la restauration, vente, ou station de ski.'
    ]
  },
  {
    country: 'Nouvelle-Zélande',
    flag: '🇳🇿',
    visa_name: 'Working Holiday Visa (NZ)',
    conditions: 'Âge : 18 à 30 ans (ou 35 pour certaines nationalités) • Preuve de fonds (4 200 NZD)',
    cost: '~420 NZD (~230 €)',
    popular_cities: ['Auckland', 'Wellington', 'Christchurch', 'Queenstown'],
    tips: [
      'Visa facile à obtenir en ligne avec réponse rapide.',
      'Idéal pour louer un van et explorer les îles du Nord et du Sud.',
      'Saisons de cueillette de fruits (fruit picking) très populaires pour financer son trip.'
    ]
  },
  {
    country: 'Japon',
    flag: '🇯🇵',
    visa_name: 'PVT Japon / Working Holiday',
    conditions: 'Âge : 18 à 30 ans • Preuve de fonds (4 500 € ou 3 000 € avec billet A/R)',
    cost: 'Gratuit',
    popular_cities: ['Tokyo', 'Kyoto', 'Osaka', 'Fukuoka', 'Sapporo'],
    tips: [
      'Compétences de base en japonais recommandées pour trouver un job étudiant/arubaito.',
      'Excellente opportunité d’immersion culturelle et de découverte de la gastronomie.',
      'Possibilité d’enseigner le français ou l’anglais en eikaiwa.'
    ]
  },
  {
    country: 'Corée du Sud',
    flag: '🇰🇷',
    visa_name: 'PVT Corée du Sud (H-1)',
    conditions: 'Âge : 18 à 30 ans • Preuve de fonds (~3 000 €) • Extrait de casier judiciaire',
    cost: 'Gratuit',
    popular_cities: ['Séoul', 'Busan', 'Incheon', 'Jeju'],
    tips: [
      'Visa gratuit à faire auprès de l’ambassade de Corée.',
      'Logements en colocation ou goshiwon très abordables à Séoul.',
      'Communautés internationales très dynamiques dans les quartiers de Hongdae et Itaewon.'
    ]
  }
];

// ==========================================
// SAMPLE DEMO DATA (FOR OFFLINE / DEMO MODE ONLY)
// ==========================================

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user-1',
    display_name: 'Alexandre',
    email: 'alex@dualmeet.fr',
    age: 28,
    city: 'Perpignan',
    latitude: 42.6986,
    longitude: 2.8956,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    bio: 'Passionné de randonnée dans le Canigou et de VTT. Toujours partant pour boire une bonne limonade artisanale en terrasse !',
    interests: ['Randonnée', 'VTT', 'Photographie', 'Café', 'Jeux de société'],
    preferred_activities: ['Randonnée', 'Vélo', 'Café', 'Jeux de société'],
    availability: 'Week-ends et mercredis soirs',
    categories: ['friendship', 'activity_partner', 'group_outings'],
    activity_levels: { 'Randonnée': 'Intermédiaire (12-18km)', 'Vélo': 'Sportif (VTT)', 'Jeux de société': 'Tous niveaux' },
    show_activity_stats: true,
    is_admin: true,
    created_at: '2025-01-15T10:00:00Z',
    stats: { organized_count: 5, joined_count: 12, communities_count: 2, badges_count: 4 },
    gallery: [
      { id: 'gal-1', user_id: 'user-1', photo_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', is_main: false, display_order: 1, created_at: '2025-01-16T00:00:00Z' },
      { id: 'gal-2', user_id: 'user-1', photo_url: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&q=80&w=800', is_main: false, display_order: 2, created_at: '2025-01-17T00:00:00Z' },
    ]
  },
  {
    id: 'user-2',
    display_name: 'Sophie M.',
    email: 'sophie@dualmeet.fr',
    age: 26,
    city: 'Perpignan',
    latitude: 42.6950,
    longitude: 2.8900,
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    bio: 'Nouveau logement à Perpignan. Je cherche du monde pour faire du beach volley à Canet ou tester des nouveaux restos !',
    interests: ['Beach-Volley', 'Cuisine italienne', 'Cinéma', 'Voyages'],
    preferred_activities: ['Plage', 'Restaurant', 'Cinéma', 'Sport'],
    availability: 'Soirs de semaine à partir de 18h30',
    categories: ['friendship', 'group_outings'],
    activity_levels: { 'Beach-Volley': 'Loisir/Debutant', 'Restaurant': 'Gourmand' },
    show_activity_stats: true,
    is_admin: false,
    created_at: '2025-01-20T14:30:00Z',
    stats: { organized_count: 2, joined_count: 8, communities_count: 1, badges_count: 2 },
    gallery: [
      { id: 'gal-3', user_id: 'user-2', photo_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800', is_main: false, display_order: 1, created_at: '2025-01-21T00:00:00Z' },
    ]
  },
  {
    id: 'user-3',
    display_name: 'Thomas D.',
    email: 'thomas@dualmeet.fr',
    age: 31,
    city: 'Montpellier',
    latitude: 43.6108,
    longitude: 3.8767,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    bio: 'Gamer le soir, cycliste le dimanche matin. Recherche des partenaires réguliers pour rouler autour du Pic Saint-Loup.',
    interests: ['Vélo de route', 'Jeux vidéo', 'Comédie', 'Technologie'],
    preferred_activities: ['Vélo', 'Jeux vidéo', 'Course à pied'],
    availability: 'Dimanches matins & jeudi soirs',
    categories: ['activity_partner'],
    activity_levels: { 'Vélo de route': 'Sportif (25-28km/h)', 'Jeux vidéo': 'Coop & Fun' },
    show_activity_stats: true,
    is_admin: false,
    created_at: '2025-02-01T09:15:00Z',
    stats: { organized_count: 3, joined_count: 6, communities_count: 1, badges_count: 3 },
  },
  {
    id: 'user-4',
    display_name: 'Camille & Julien',
    email: 'camille@dualmeet.fr',
    age: 29,
    city: 'Toulouse',
    latitude: 43.6047,
    longitude: 1.4442,
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    bio: 'On adore les soirées jeux de plateau (Catan, 7 Wonders, Dixit). On organise souvent des sessions à la maison ou en bar à jeux !',
    interests: ['Jeux de société', 'Escape Games', 'Bières artisanales', 'Barbecue'],
    preferred_activities: ['Jeux de société', 'Bowling', 'Sorties nocturnes'],
    availability: 'Vendredi et samedi soir',
    categories: ['group_outings', 'friendship'],
    activity_levels: { 'Jeux de société': 'Expert/Passionné' },
    show_activity_stats: true,
    is_admin: false,
    created_at: '2025-02-03T18:00:00Z',
    stats: { organized_count: 4, joined_count: 15, communities_count: 2, badges_count: 5 },
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    organizer_id: 'user-1',
    organizer: MOCK_USERS[0],
    title: 'Randonnée au Lac des Bouillouses & Pique-nique',
    slug: 'randonnee-au-lac-des-bouillouses-act-1',
    description: 'Une superbe boucle de 12 km autour des lacs du Capcir. Ambiance conviviale, rythme modéré accessible à tous. Prévoyez votre pique-nique et des chaussures de rando !',
    category: 'Randonnée',
    date_time: new Date(Date.now() + 86400000 * 2).toISOString(),
    end_time: new Date(Date.now() + 86400000 * 2 + 21600000).toISOString(),
    city: 'Perpignan',
    latitude: 42.6986,
    longitude: 2.8956,
    address: 'Point de rdv : Parking de la Gare de Perpignan (Covoiturage)',
    max_participants: 6,
    current_participants_count: 3,
    is_spontaneous: false,
    is_two_person: false,
    budget: 'Gratuit',
    fitness_level: 'Moyen',
    status: 'open',
    image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    participants: [MOCK_USERS[0], MOCK_USERS[1]],
  },
  {
    id: 'act-2',
    organizer_id: 'user-2',
    organizer: MOCK_USERS[1],
    title: 'Soirée Bowling & Verre en centre-ville',
    slug: 'soiree-bowling-et-verre-act-2',
    description: 'Session bowling décontractée à Perpignan suivie d’un verre. Aucun niveau requis, juste de la bonne humeur pour rigoler et faire connaissance !',
    category: 'Bowling',
    date_time: new Date(Date.now() + 7200000 * 4).toISOString(),
    end_time: new Date(Date.now() + 7200000 * 7).toISOString(),
    city: 'Perpignan',
    latitude: 42.7010,
    longitude: 2.9020,
    address: 'Bowling Mega Castillet, Perpignan',
    max_participants: 8,
    current_participants_count: 4,
    is_spontaneous: true,
    is_two_person: false,
    budget: '~15€',
    fitness_level: 'Tous niveaux',
    status: 'open',
    image_url: 'https://images.unsplash.com/photo-1538388149542-5e24932d11a8?auto=format&fit=crop&q=80&w=800',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    participants: [MOCK_USERS[1], MOCK_USERS[0], MOCK_USERS[3]],
  },
  {
    id: 'act-3',
    organizer_id: 'user-3',
    organizer: MOCK_USERS[2],
    title: 'Sortie Vélo de Route - Boucle du Pic Saint-Loup (65km)',
    slug: 'sortie-velo-pic-saint-loup-act-3',
    description: 'Sortie cyclo tonique d’environ 65 km avec 700m de dénivelé positif. Allure moyenne visée autour de 25-27 km/h. Pause café à mi-parcours !',
    category: 'Vélo',
    date_time: new Date(Date.now() + 86400000 * 4).toISOString(),
    city: 'Montpellier',
    latitude: 43.6108,
    longitude: 3.8767,
    address: 'Place de la Comédie, Montpellier',
    max_participants: 4,
    current_participants_count: 2,
    is_spontaneous: false,
    is_two_person: false,
    budget: 'Gratuit',
    fitness_level: 'Sportif',
    status: 'open',
    image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    participants: [MOCK_USERS[2]],
  },
  {
    id: 'act-4',
    organizer_id: 'user-4',
    organizer: MOCK_USERS[3],
    title: 'Session Jeux de Société au Bar à Jeux Toulouse',
    slug: 'session-jeux-de-societe-act-4',
    description: 'Découverte de nouveaux jeux de stratégie et d’ambiance. Venez seul(e) ou accompagné(e), la communauté est très accueillante !',
    category: 'Jeux de société',
    date_time: new Date(Date.now() + 86400000 * 1 + 18000000).toISOString(),
    city: 'Toulouse',
    latitude: 43.6047,
    longitude: 1.4442,
    address: 'Bar Les Tricheurs, Toulouse',
    max_participants: 6,
    current_participants_count: 5,
    is_spontaneous: false,
    is_two_person: false,
    budget: 'Conso sur place',
    fitness_level: 'Tous niveaux',
    status: 'open',
    image_url: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=800',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    participants: [MOCK_USERS[3]],
  }
];

export const MOCK_RELATIONSHIPS: UserRelationship[] = [];

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'com-1',
    name: 'Dual Meet Perpignan',
    slug: 'perpignan',
    description: 'La communauté officielle des sorties amicales et activités dans la métropole de Perpignan et la Côte Vermeille.',
    image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    city: 'Perpignan',
    category: 'Ville',
    member_count: 142,
    is_joined: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'com-2',
    name: 'Dual Meet Montpellier',
    slug: 'montpellier',
    description: 'Rejoignez la tribu montpelliéraine pour des sorties plage, restos, randos et soirées convivialité !',
    image_url: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=800',
    city: 'Montpellier',
    category: 'Ville',
    member_count: 215,
    is_joined: false,
    created_at: '2025-01-05T00:00:00Z',
  }
];

export const MOCK_PARTNER_SEARCHES: PartnerSearch[] = [];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [];

export const MOCK_CONVERSATIONS: Conversation[] = [];

export const MOCK_MESSAGES: Message[] = [];

export const MOCK_REQUESTS: ActivityRequest[] = [];

export const MOCK_INVITATIONS: ActivityInvitation[] = [];

export const MOCK_TRAVEL_PROJECTS: TravelProject[] = [];

// Local store class handling mutations & social relationships in demo mode
class LocalStore {
  activities: Activity[] = MOCK_ACTIVITIES;
  requests: ActivityRequest[] = MOCK_REQUESTS;
  notifications: NotificationItem[] = MOCK_NOTIFICATIONS;
  conversations: Conversation[] = MOCK_CONVERSATIONS;
  messages: Message[] = MOCK_MESSAGES;
  communities: Community[] = MOCK_COMMUNITIES;
  partnerSearches: PartnerSearch[] = MOCK_PARTNER_SEARCHES;
  relationships: UserRelationship[] = MOCK_RELATIONSHIPS;
  invitations: ActivityInvitation[] = MOCK_INVITATIONS;
  travelProjects: TravelProject[] = MOCK_TRAVEL_PROJECTS;
  reports: ReportItem[] = [];

  getRelationshipStatus(currentUserId: string, targetUserId: string): RelationshipStatus {
    if (currentUserId === targetUserId) return 'none';

    const rel = this.relationships.find(
      r => (r.user_id === currentUserId && r.friend_id === targetUserId) ||
           (r.user_id === targetUserId && r.friend_id === currentUserId)
    );

    if (!rel) return 'none';
    if (rel.status === 'accepted') return 'accepted';
    if (rel.status === 'pending') {
      return rel.user_id === currentUserId ? 'pending_sent' : 'pending_received';
    }
    return 'none';
  }

  sendContactRequest(currentUserId: string, targetUserId: string): UserRelationship {
    const existingIndex = this.relationships.findIndex(
      r => (r.user_id === currentUserId && r.friend_id === targetUserId) ||
           (r.user_id === targetUserId && r.friend_id === currentUserId)
    );

    if (existingIndex >= 0) {
      this.relationships.splice(existingIndex, 1);
    }

    const rel: UserRelationship = {
      id: `rel-${Date.now()}`,
      user_id: currentUserId,
      friend_id: targetUserId,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    this.relationships.push(rel);

    const inviter = MOCK_USERS.find(u => u.id === currentUserId);
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: targetUserId,
      type: 'contact_request_received',
      title: 'Demande de contact amical',
      message: `${inviter?.display_name || 'Un membre'} vous a envoyé une demande de contact.`,
      link: `/user/${currentUserId}`,
      is_read: false,
      meta_id: rel.id,
      created_at: new Date().toISOString(),
    });

    return rel;
  }

  acceptContactRequest(currentUserId: string, targetUserId: string) {
    const rel = this.relationships.find(
      r => (r.user_id === targetUserId && r.friend_id === currentUserId) ||
           (r.user_id === currentUserId && r.friend_id === targetUserId)
    );
    if (rel) {
      rel.status = 'accepted';

      const accepter = MOCK_USERS.find(u => u.id === currentUserId);
      this.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: targetUserId,
        type: 'contact_request_accepted',
        title: 'Demande de contact acceptée !',
        message: `${accepter?.display_name || 'Un membre'} a accepté votre demande. Vous êtes désormais en contact !`,
        link: `/user/${currentUserId}`,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }
  }

  removeContact(currentUserId: string, targetUserId: string) {
    this.relationships = this.relationships.filter(
      r => !( (r.user_id === currentUserId && r.friend_id === targetUserId) ||
              (r.user_id === targetUserId && r.friend_id === currentUserId) )
    );
  }

  getContactsList(userId: string): UserProfile[] {
    const acceptedRels = this.relationships.filter(
      r => (r.user_id === userId || r.friend_id === userId) && r.status === 'accepted'
    );
    const friendIds = acceptedRels.map(r => r.user_id === userId ? r.friend_id : r.user_id);
    return MOCK_USERS.filter(u => friendIds.includes(u.id));
  }

  inviteContactToActivity(inviterId: string, inviteeId: string, activityId: string): ActivityInvitation {
    const inv: ActivityInvitation = {
      id: `inv-${Date.now()}`,
      activity_id: activityId,
      activity: this.activities.find(a => a.id === activityId),
      inviter_id: inviterId,
      inviter: MOCK_USERS.find(u => u.id === inviterId),
      invitee_id: inviteeId,
      invitee: MOCK_USERS.find(u => u.id === inviteeId),
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    this.invitations.push(inv);

    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: inviteeId,
      type: 'activity_invitation_received',
      title: 'Invitation à une sortie',
      message: `${inv.inviter?.display_name || 'Un contact'} vous a invité(e) à la sortie "${inv.activity?.title}".`,
      link: `/activity/${activityId}`,
      is_read: false,
      meta_id: inv.id,
      created_at: new Date().toISOString(),
    });

    return inv;
  }

  addGalleryPhoto(userId: string, photoUrl: string): UserGalleryPhoto {
    const targetUser = MOCK_USERS.find(u => u.id === userId);
    if (!targetUser) throw new Error('Utilisateur non trouvé');
    if (!targetUser.gallery) targetUser.gallery = [];

    const photo: UserGalleryPhoto = {
      id: `gal-${Date.now()}`,
      user_id: userId,
      photo_url: photoUrl,
      is_main: false,
      display_order: targetUser.gallery.length + 1,
      created_at: new Date().toISOString(),
    };
    targetUser.gallery.push(photo);
    return photo;
  }

  deleteGalleryPhoto(userId: string, photoId: string) {
    const targetUser = MOCK_USERS.find(u => u.id === userId);
    if (targetUser && targetUser.gallery) {
      targetUser.gallery = targetUser.gallery.filter(p => p.id !== photoId);
    }
  }

  setMainAvatar(userId: string, photoUrl: string) {
    const targetUser = MOCK_USERS.find(u => u.id === userId);
    if (targetUser) {
      targetUser.avatar_url = photoUrl;
    }
  }

  addActivity(act: Omit<Activity, 'id' | 'created_at'>): Activity {
    const titleSlug = act.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newAct: Activity = {
      ...act,
      id: `act-${Date.now()}`,
      slug: `${titleSlug}-act-${Date.now()}`,
      created_at: new Date().toISOString(),
      current_participants_count: 1,
    };
    this.activities.unshift(newAct);
    return newAct;
  }

  addTravelProject(proj: Omit<TravelProject, 'id' | 'created_at' | 'current_participants_count'>): TravelProject {
    const newProj: TravelProject = {
      ...proj,
      id: `proj-${Date.now()}`,
      current_participants_count: 1,
      created_at: new Date().toISOString(),
    };
    this.travelProjects.unshift(newProj);
    return newProj;
  }

  addRequest(activityId: string, user: UserProfile, message?: string): ActivityRequest {
    const activity = this.activities.find(a => a.id === activityId);
    const req: ActivityRequest = {
      id: `req-${Date.now()}`,
      activity_id: activityId,
      activity: activity,
      user_id: user.id,
      user: user,
      status: 'pending',
      message: message || '',
      created_at: new Date().toISOString(),
    };
    this.requests.unshift(req);
    return req;
  }

  addMessage(conversationId: string, sender: UserProfile, content: string): Message {
    const msg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: sender.id,
      sender: sender,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    this.messages.push(msg);

    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.last_message = content;
      conv.last_message_at = msg.created_at;
      conv.updated_at = msg.created_at;
    }
    return msg;
  }

  getPriorityFeed(currentUser: UserProfile | null, activitiesList?: Activity[]): Activity[] {
    const source = activitiesList || (isSupabaseConfigured ? [] : this.activities);
    if (!currentUser) return source;

    const contacts = this.getContactsList(currentUser.id);
    const contactIds = contacts.map(c => c.id);

    return [...source].sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      if (currentUser.city && a.city.toLowerCase() === currentUser.city.toLowerCase()) scoreA += 50;
      if (currentUser.city && b.city.toLowerCase() === currentUser.city.toLowerCase()) scoreB += 50;

      if (contactIds.includes(a.organizer_id)) scoreA += 40;
      if (contactIds.includes(b.organizer_id)) scoreB += 40;

      if (currentUser.interests.some(i => a.category.toLowerCase().includes(i.toLowerCase()))) scoreA += 20;
      if (currentUser.interests.some(i => b.category.toLowerCase().includes(i.toLowerCase()))) scoreB += 20;

      const timeDiffA = new Date(a.date_time).getTime() - Date.now();
      const timeDiffB = new Date(b.date_time).getTime() - Date.now();
      if (timeDiffA > 0 && timeDiffA < 86400000 * 3) scoreA += 15;
      if (timeDiffB > 0 && timeDiffB < 86400000 * 3) scoreB += 15;

      return scoreB - scoreA;
    });
  }
}

export const localStore = new LocalStore();

// ==========================================
// DUAL-MODE API CLIENT (REAL SUPABASE + FALLBACK)
// ==========================================

export const api = {
  async getActivities(): Promise<Activity[]> {
    if (isSupabaseConfigured) {
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
    }
    return localStore.activities;
  },

  async createActivity(act: Omit<Activity, 'id' | 'created_at'>): Promise<Activity> {
    if (isSupabaseConfigured) {
      try {
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
            budget: act.budget,
            fitness_level: act.fitness_level,
            image_url: act.image_url,
          })
          .select()
          .single();
        if (!error && data) return data as Activity;
        throw error || new Error("Erreur de création d'activité dans Supabase");
      } catch (e) {
        throw e;
      }
    }
    return localStore.addActivity(act);
  },

  async getTravelProjects(): Promise<TravelProject[]> {
    if (isSupabaseConfigured) {
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
    }
    return localStore.travelProjects;
  },

  async createTravelProject(project: Omit<TravelProject, 'id' | 'created_at' | 'current_participants_count'>): Promise<TravelProject> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('travel_projects')
          .insert({
            organizer_id: project.organizer_id,
            country: project.country,
            country_flag: project.country_flag,
            visa_type: project.visa_type,
            title: project.title,
            description: project.description,
            departure_date: project.departure_date,
            duration: project.duration,
            arrival_city: project.arrival_city,
            estimated_budget: project.estimated_budget,
            travel_style: project.travel_style,
            housing_plan: project.housing_plan,
            language_level: project.language_level,
            max_participants: project.max_participants,
          })
          .select()
          .single();

        if (!error && data) {
          // Add organizer as participant
          await supabase.from('travel_project_participants').insert({ project_id: data.id, user_id: project.organizer_id });
          return data as TravelProject;
        }
        throw error || new Error("Erreur lors de la création du projet de voyage");
      } catch (e) {
        throw e;
      }
    }
    return localStore.addTravelProject(project);
  },

  async getCommunities(): Promise<Community[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('communities').select('*');
        if (!error && data) return data as Community[];
        return [];
      } catch (e) {
        return [];
      }
    }
    return localStore.communities;
  },

  async uploadPhoto(file: File, bucket: 'avatars' | 'user-gallery'): Promise<string> {
    if (isSupabaseConfigured) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data.publicUrl;
    }
    return URL.createObjectURL(file);
  }
};
