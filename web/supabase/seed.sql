-- Seed Communities
INSERT INTO public.communities (id, name, slug, description, image_url, city, category, member_count) VALUES
('11111111-1111-1111-1111-111111111111', 'Dual Meet Perpignan', 'perpignan', 'Communauté locale des sorteurs et sportifs de Perpignan et de la Côte Vermeille.', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800', 'Perpignan', 'Ville', 142),
('22222222-2222-2222-2222-222222222222', 'Dual Meet Montpellier', 'montpellier', 'Sorties amicales, Afterworks, Plage et Rando à Montpellier et alentours.', 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=800', 'Montpellier', 'Ville', 215),
('33333333-3333-3333-3333-333333333333', 'Dual Meet Toulouse', 'toulouse', 'Rencontres passionnés de jeux, sport, bars à jeux et randonnées pyrénéennes.', 'https://images.unsplash.com/photo-1548625361-188b90151152?auto=format&fit=crop&q=80&w=800', 'Toulouse', 'Ville', 380),
('44444444-4444-4444-4444-444444444444', 'Randonnée & Nature Pyrenées', 'randonnee', 'Amoureux de montagne, lacs et sentiers des Pyrénées-Orientales.', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800', 'Perpignan', 'Randonnée', 98),
('55555555-5555-5555-5555-555555555555', 'Cyclisme & Vélo Club', 'velo-club', 'Sorties VTT, vélo de route et balades tranquilles le long du littoral.', 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&q=80&w=800', 'Perpignan', 'Vélo', 64)
ON CONFLICT (slug) DO NOTHING;

-- Seed Badges
INSERT INTO public.badges (code, title, description, icon) VALUES
('first_outing', 'Première sortie', 'A participé à sa toute première activité sur Dual Meet.', 'Sparkles'),
('explorer', 'Explorateur local', 'A rejoint des sorties dans au moins 3 catégories différentes.', 'Compass'),
('cyclist', 'Passionné de vélo', 'A participé à 5 sorties de cyclisme ou VTT.', 'Bike'),
('hiker', 'Amateur de randonnée', 'A conquis au moins 3 parcours de randonnée.', 'Mountain'),
('city_discoverer', 'Découvreur de villes', 'Inscrit à une communauté locale et actif dans sa ville.', 'MapPin')
ON CONFLICT (code) DO NOTHING;
