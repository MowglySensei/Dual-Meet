-- ==========================================
-- DUAL MEET - BASE DE DONNÉES POSTGRESQL (SUPABASE)
-- SCHÉMA DE PRODUCTION FIABILISÉ AVEC TRIGGERS & RLS
-- ==========================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  age INT CHECK (age IS NULL OR age >= 18),
  birth_date DATE,
  city TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  avatar_url TEXT,
  bio TEXT,
  interests TEXT[] DEFAULT '{}',
  preferred_activities TEXT[] DEFAULT '{}',
  availability TEXT,
  categories TEXT[] DEFAULT '{"friendship", "activity_partner", "group_outings"}',
  activity_levels JSONB DEFAULT '{}',
  show_activity_stats BOOLEAN DEFAULT TRUE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for geographical & city searches
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);

-- 2. USER RELATIONSHIPS TABLE (FRIENDLY CONTACTS)
CREATE TABLE IF NOT EXISTS public.user_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_different_users CHECK (user_id != friend_id),
  UNIQUE(user_id, friend_id)
);

CREATE INDEX IF NOT EXISTS idx_relationships_users ON public.user_relationships(user_id, friend_id);

-- 3. USER GALLERY PHOTOS TABLE
CREATE TABLE IF NOT EXISTS public.user_gallery_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gallery_user ON public.user_gallery_photos(user_id);

-- 4. ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  category TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  city TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT, -- Secret address, revealed only to accepted participants
  max_participants INT DEFAULT 4 CHECK (max_participants >= 2),
  current_participants_count INT DEFAULT 1 CHECK (current_participants_count >= 1),
  is_spontaneous BOOLEAN DEFAULT FALSE,
  is_two_person BOOLEAN DEFAULT FALSE,
  budget TEXT DEFAULT 'Gratuit',
  fitness_level TEXT DEFAULT 'Tous niveaux',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'cancelled', 'completed')),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_city_cat ON public.activities(city, category, status);
CREATE INDEX IF NOT EXISTS idx_activities_date ON public.activities(date_time);

-- 5. ACTIVITY REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.activity_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_requests_activity ON public.activity_requests(activity_id, user_id);

-- 6. ACTIVITY INVITATIONS TABLE (INVITER UN CONTACT)
CREATE TABLE IF NOT EXISTS public.activity_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_different_invite_users CHECK (inviter_id != invitee_id),
  UNIQUE(activity_id, invitee_id)
);

-- 7. ACTIVITY PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS public.activity_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID NOT NULL REFERENCES public.activities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_participants_activity ON public.activity_participants(activity_id, user_id);

-- 8. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
  type TEXT NOT NULL DEFAULT 'private' CHECK (type IN ('private', 'group', 'activity')),
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CONVERSATION MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.conversation_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conv_members ON public.conversation_members(conversation_id, user_id);

-- 10. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conv ON public.messages(conversation_id, created_at);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  meta_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifs_user ON public.notifications(user_id, is_read);

-- 12. REPORTS TABLE (MODERATION)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_activity_id UUID REFERENCES public.activities(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. BLOCKS TABLE
CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_different_block_users CHECK (blocker_id != blocked_id),
  UNIQUE(blocker_id, blocked_id)
);

-- 14. RECURRING PARTNER SEARCHES
CREATE TABLE IF NOT EXISTS public.recurring_partner_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  fitness_level TEXT DEFAULT 'Intermédiaire',
  availability TEXT NOT NULL,
  city TEXT NOT NULL,
  frequency TEXT DEFAULT '1x par semaine',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. COMMUNITIES & MEMBERS
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  city TEXT,
  category TEXT,
  member_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

-- 16. BADGES & USER BADGES
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- 17. TRAVEL PROJECTS (SECTION VOYAGER & PVT)
CREATE TABLE IF NOT EXISTS public.travel_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  country_flag TEXT DEFAULT '✈️',
  visa_type TEXT DEFAULT 'PVT / Working Holiday',
  title TEXT NOT NULL,
  description TEXT,
  departure_date TEXT NOT NULL,
  duration TEXT DEFAULT '12 mois',
  arrival_city TEXT NOT NULL,
  estimated_budget TEXT DEFAULT '5 000 €',
  travel_style TEXT DEFAULT 'Roadtrip + Travail',
  housing_plan TEXT DEFAULT 'Colocation',
  language_level TEXT DEFAULT 'Anglais intermédiaire',
  max_participants INT DEFAULT 4 CHECK (max_participants >= 2),
  current_participants_count INT DEFAULT 1 CHECK (current_participants_count >= 1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_travel_projects_country ON public.travel_projects(country);

CREATE TABLE IF NOT EXISTS public.travel_project_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.travel_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_travel_participants ON public.travel_project_participants(project_id, user_id);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_partner_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_project_participants ENABLE ROW LEVEL SECURITY;

-- Travel Projects Policies
CREATE POLICY "Travel projects viewable by everyone" ON public.travel_projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create travel projects" ON public.travel_projects FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update own travel projects" ON public.travel_projects FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Organizers can delete own travel projects" ON public.travel_projects FOR DELETE USING (auth.uid() = organizer_id);

CREATE POLICY "Travel participants viewable by everyone" ON public.travel_project_participants FOR SELECT USING (true);
CREATE POLICY "Users can join travel project" ON public.travel_project_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles Policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User Relationships Policies
CREATE POLICY "Relationships viewable by involved users" ON public.user_relationships
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can create contact request" ON public.user_relationships
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update relationship status" ON public.user_relationships
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can delete relationship" ON public.user_relationships
  FOR DELETE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- User Gallery Photos Policies
CREATE POLICY "Gallery photos viewable by everyone" ON public.user_gallery_photos FOR SELECT USING (true);
CREATE POLICY "Users manage own gallery photos" ON public.user_gallery_photos
  FOR ALL USING (auth.uid() = user_id);

-- Activity Invitations Policies
CREATE POLICY "Invitations viewable by inviter or invitee" ON public.activity_invitations
  FOR SELECT USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

CREATE POLICY "Organizers can send invitations" ON public.activity_invitations
  FOR INSERT WITH CHECK (auth.uid() = inviter_id);

CREATE POLICY "Invitees can respond to invitations" ON public.activity_invitations
  FOR UPDATE USING (auth.uid() = invitee_id);

-- Activities Policies
CREATE POLICY "Activities are viewable by everyone" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create activities" ON public.activities FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update own activities" ON public.activities FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Organizers can delete own activities" ON public.activities FOR DELETE USING (auth.uid() = organizer_id);

-- Requests Policies
CREATE POLICY "Requests viewable by user or organizer" ON public.activity_requests FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() IN (SELECT organizer_id FROM public.activities WHERE id = activity_id)
);
CREATE POLICY "Users can create join request" ON public.activity_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Organizer can update request status" ON public.activity_requests FOR UPDATE USING (
  auth.uid() IN (SELECT organizer_id FROM public.activities WHERE id = activity_id)
);

-- Participants Policies
CREATE POLICY "Participants viewable by everyone" ON public.activity_participants FOR SELECT USING (true);
CREATE POLICY "Users or Organizers can insert participant" ON public.activity_participants
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT organizer_id FROM public.activities WHERE id = activity_id)
  );

-- Conversations & Messages Policies
CREATE POLICY "Members view conversations" ON public.conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_members WHERE conversation_id = conversations.id AND user_id = auth.uid())
);
CREATE POLICY "Members view messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_members WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Members send messages" ON public.messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND EXISTS (SELECT 1 FROM public.conversation_members WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);

-- Notifications Policies
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Reports & Admin Policies
CREATE POLICY "Users can create report" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admins view all reports" ON public.reports FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ==========================================
-- OVERBOOKING PREVENTION TRIGGERS & GUARDRAILS
-- ==========================================

-- Function to prevent overbooking beyond max_participants (Prevents Race Conditions)
CREATE OR REPLACE FUNCTION public.check_activity_capacity()
RETURNS TRIGGER AS $$
DECLARE
  v_max INT;
  v_current INT;
  v_status TEXT;
BEGIN
  SELECT max_participants, current_participants_count, status
  INTO v_max, v_current, v_status
  FROM public.activities
  WHERE id = NEW.activity_id;

  IF v_status = 'cancelled' THEN
    RAISE EXCEPTION 'Cette activité a été annulée et n accepte plus de nouveaux participants.';
  END IF;

  IF v_current >= v_max THEN
    RAISE EXCEPTION 'Cette activité est déjà complète (capacité maximale atteinte).';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER before_participant_inserted
  BEFORE INSERT ON public.activity_participants
  FOR EACH ROW EXECUTE FUNCTION public.check_activity_capacity();

-- Trigger to update participant count and status automatically
CREATE OR REPLACE FUNCTION public.sync_activity_participant_count()
RETURNS TRIGGER AS $$
DECLARE
  v_act_id UUID;
  v_count INT;
  v_max INT;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_act_id := OLD.activity_id;
  ELSE
    v_act_id := NEW.activity_id;
  END IF;

  SELECT COUNT(*) INTO v_count FROM public.activity_participants WHERE activity_id = v_act_id;
  SELECT max_participants INTO v_max FROM public.activities WHERE id = v_act_id;

  UPDATE public.activities
  SET
    current_participants_count = GREATEST(1, v_count),
    status = CASE
      WHEN status = 'cancelled' THEN 'cancelled'
      WHEN GREATEST(1, v_count) >= v_max THEN 'full'
      ELSE 'open'
    END,
    updated_at = NOW()
  WHERE id = v_act_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER after_participant_changed
  AFTER INSERT OR DELETE ON public.activity_participants
  FOR EACH ROW EXECUTE FUNCTION public.sync_activity_participant_count();

-- Trigger to automatically add organizer as first participant
CREATE OR REPLACE FUNCTION public.handle_new_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_participants (activity_id, user_id)
  VALUES (NEW.id, NEW.organizer_id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_activity_created
  AFTER INSERT ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_activity();

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, birth_date, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    CASE
      WHEN (NEW.raw_user_meta_data->>'birth_date') IS NOT NULL AND (NEW.raw_user_meta_data->>'birth_date') != ''
      THEN (NEW.raw_user_meta_data->>'birth_date')::DATE
      ELSE NULL
    END,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Realtime Publication Setup
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_relationships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_invitations;
