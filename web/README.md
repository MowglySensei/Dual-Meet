# 🚀 DUAL MEET — PLATEFORME WEB DE RENCONTRES AMICALES ET D'ACTIVITÉS (V1 WEB)

> **Slogan :** *« Moins de matchs. Plus de moments. »*

Dual Meet est une plateforme sociale 100% gratuite et moderne permettant aux utilisateurs de trouver des compagnons de sorties, de créer des événements et de trouver des partenaires d'activités (sport, rando, bowling, vélo, restaurant, jeux de société, plage, sorties culturelles, etc.).

---

## 🛠️ Stack Technique

### Frontend Web
* **Framework :** React 19 + TypeScript + Vite 6.
* **Styles & Thème :** Tailwind CSS v4, palette Anthracite Sombre (`#0B0F17`), Violet Électrique (`#8B5CF6`), Bleu Lumineux (`#06B6D4`).
* **Icônes :** Lucide React.
* **Navigation :** React Router DOM v7.
* **Cartographie :** OpenStreetMap via Leaflet & React Leaflet.

### Backend & Base de données
* **Backend BaaS :** Supabase (PostgreSQL 15, Auth, Storage, Realtime messaging & notifications).
* **Sécurité & Contrôle :** Row Level Security (RLS), contraintes d'unicité, déclencheurs d'anti-surréservation (`check_activity_capacity`), et fonctions serveur PostgreSQL.

---

## 📁 Structure du Projet

```text
C:/Dev/Dual Meet/
└── web/                  # Plateforme Web React/TypeScript/Vite
    ├── public/
    │   ├── logo.svg      # Logo vectoriel Dual Meet
    │   ├── robots.txt    # Directives d'indexation SEO
    │   └── sitemap.xml   # Plan du site XML
    ├── src/
    │   ├── components/   # Navbar, Footer, Logo, QuickSearchModal, ActivityCard, InteractiveMap, ReportModal, Skeleton...
    │   ├── context/      # AuthContext, ThemeContext, ToastContext
    │   ├── lib/          # Client Supabase, Service API Dual-Mode & Moteur de secours
    │   ├── pages/        # 32 pages web (Landing, Dashboard, Activities, ActivityDetail, CreateActivity, Map, Messaging, Admin, Profiles...)
    │   ├── types/        # Interfaces TypeScript (UserProfile, Activity, Request, Message, Relationship...)
    │   ├── App.tsx       # Routage global & Gardiens de routes
    │   ├── main.tsx      # Point d'entrée React
    │   └── index.css     # Directives Tailwind CSS & styles Leaflet
    ├── supabase/
    │   ├── schema.sql    # Schéma PostgreSQL complet avec RLS, Triggers et Realtime
    │   └── seed.sql      # Données initiales (Communautés, Badges...)
    ├── index.html        # Entrée HTML & polices
    ├── package.json      # Dépendances du projet
    └── vite.config.ts    # Configuration Vite & Alias
```

---

## ⚙️ Configuration & Lancement en Local

### 1. Installation des dépendances

Dans un terminal dans le répertoire `C:/Dev/Dual Meet/web` :

```bash
cd "C:\Dev\Dual Meet\web"
npm install
```

### 2. Démarrage du serveur de développement Vite

```bash
npm run dev
```

L'application s'ouvrira sur `http://localhost:3000`.

---

## 🗄️ Configuration du Backend Supabase (Production)

1. Créez un projet gratuit sur [Supabase.com](https://supabase.com).
2. Dans la console Supabase, ouvrez l'onglet **SQL Editor**.
3. Copiez-collez et exécutez le script `web/supabase/schema.sql`.
4. Copiez-collez et exécutez le script `web/supabase/seed.sql`.
5. Dans l'onglet **Storage**, créez deux buckets publics :
   * `avatars` (Public)
   * `user-gallery` (Public)
6. Récupérez votre **URL Supabase** et votre **Clé Anonyme (Anon Key)** dans *Project Settings > API*.
7. Créez/Modifiez le fichier `web/.env` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon
VITE_ENABLE_MOCK_DATA=false
```

---

## 🚀 Déploiement Web (Vercel / Netlify / Cloudflare Pages)

Le site web est prêt à être déployé en un clic sur n'importe quel hébergeur compatible Vite / React :

### Déploiement Vercel
1. Connectez votre dépôt Git à Vercel.
2. Définissez le répertoire racine du projet : `web`.
3. Ajoutez les variables d'environnement dans l'interface Vercel :
   * `VITE_SUPABASE_URL`
   * `VITE_SUPABASE_ANON_KEY`
   * `VITE_ENABLE_MOCK_DATA=false`
4. Cliquez sur **Deploy**.

---

## 📱 Futur développement de l'Application Android (Phase ultérieure)

Le projet actuel est **100% WEB**.

Lorsque la future phase d'application Android native débutera :
* L'application mobile utilisera le **Supabase Kotlin SDK** pour se connecter au même backend PostgreSQL, réutiliser la même authentification JWT, les mêmes tables, les mêmes politiques RLS et la messagerie Realtime.
