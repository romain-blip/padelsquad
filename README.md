# 🏸 PadelSquad

**Trouve ton match. Remplis le terrain.**

App de matchmaking pour joueurs de padel en France. Crée une session, trouve des joueurs, note-les après le match.

---

## 🚀 Déploiement en 4 étapes

### Étape 1 — Créer le projet Supabase (gratuit)

1. Va sur [supabase.com](https://supabase.com) et crée un compte
2. Clique "New Project", choisis un nom et un mot de passe DB
3. Attends que le projet soit prêt (~2 min)
4. Va dans **SQL Editor** (menu à gauche)
5. Clique "New Query"
6. Copie-colle TOUT le contenu de `supabase-schema.sql` et clique **Run**
7. Va dans **Settings > API** et copie :
   - `Project URL` → c'est ton `VITE_SUPABASE_URL`
   - `anon public key` → c'est ton `VITE_SUPABASE_ANON_KEY`

### Étape 2 — Configurer le projet en local

```bash
# Clone ou copie le projet
cd padelsquad

# Copie le fichier d'environnement
cp .env.example .env

# Édite .env avec tes clés Supabase
# VITE_SUPABASE_URL=https://xxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyXXXX

# Installe les dépendances
npm install

# Lance en local
npm run dev
```

L'app sera dispo sur `http://localhost:5173`

### Étape 3 — Déployer sur Vercel (gratuit)

1. Pousse le code sur un repo GitHub
2. Va sur [vercel.com](https://vercel.com) et connecte ton GitHub
3. Importe le repo `padelsquad`
4. Dans les settings du projet Vercel, ajoute les **Environment Variables** :
   - `VITE_SUPABASE_URL` = ta valeur
   - `VITE_SUPABASE_ANON_KEY` = ta valeur
5. Clique **Deploy**
6. Ton app est en ligne sur `padelsquad.vercel.app` 🎉

### Étape 4 — Brancher un nom de domaine (optionnel)

1. Achète `padelsquad.fr` sur OVH, Namecheap, ou Gandi (~10€/an)
2. Dans Vercel > Settings > Domains, ajoute ton domaine
3. Suis les instructions DNS (ajouter un CNAME)
4. C'est en ligne sur ton domaine !

---

## 🔐 Auth Google (optionnel)

Pour activer "Se connecter avec Google" :

1. Va sur [Google Cloud Console](https://console.cloud.google.com)
2. Crée un projet, active l'API OAuth
3. Crée des identifiants OAuth 2.0
4. Dans Supabase > Authentication > Providers > Google
5. Active Google et colle ton Client ID + Secret

---

## 📁 Structure du projet

```
padelsquad/
├── index.html              # Point d'entrée HTML
├── package.json            # Dépendances
├── vite.config.js          # Config Vite
├── vercel.json             # Config déploiement
├── supabase-schema.sql     # 👈 SQL à copier dans Supabase
├── .env.example            # Template variables d'env
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx            # Bootstrap React
    ├── App.jsx             # Routing auth/onboarding/home
    ├── styles.css          # Styles globaux
    ├── lib/
    │   ├── supabase.js     # Client Supabase
    │   ├── auth.jsx        # Context auth (login/signup/session)
    │   ├── db.js           # Fonctions DB (sessions, reviews, profils)
    │   ├── toast.jsx       # Notifications toast
    │   └── constants.js    # Niveaux, départements, helpers
    └── components/
        ├── AuthPage.jsx        # Page login/inscription
        ├── Onboarding.jsx      # Onboarding 3 étapes (nom, niveau, lieu)
        ├── HomePage.jsx        # Feed de sessions + filtres
        ├── Header.jsx          # Barre de navigation
        ├── SessionCard.jsx     # Carte d'une session
        ├── CreateSessionModal.jsx  # Création de session
        ├── EditProfileModal.jsx    # Édition profil
        ├── PlayerProfileModal.jsx  # Profil joueur + avis
        └── UI.jsx              # Composants réutilisables
```

---

## ✅ Features

- [x] Auth email + Google
- [x] Onboarding en 3 étapes
- [x] Créer / rejoindre des sessions
- [x] Filtrer par département et niveau
- [x] Profil joueur avec niveau et département
- [x] Système d'avis (étoiles + commentaire)
- [x] "Mes sessions" pour retrouver ses inscriptions
- [x] Sécurité Row Level Security (RLS) sur toutes les tables
- [ ] Notifications push
- [ ] Géolocalisation
- [ ] Chat entre joueurs
- [ ] Suppression / annulation de session

---

Fait avec ❤️ pour la communauté padel française.
