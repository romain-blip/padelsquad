# 🎾 PadelSquad — Guide Capacitor (App Native)

## Prérequis

### Pour Android :
- **Node.js** (tu l'as déjà)
- **Android Studio** → [developer.android.com/studio](https://developer.android.com/studio)
  - Pendant l'install, coche "Android SDK" et "Android Virtual Device"
  - Après install : ouvre Android Studio → More Actions → SDK Manager → SDK Tools → coche "Android SDK Command-line Tools"

### Pour iOS (Mac uniquement) :
- **Xcode** depuis le Mac App Store
- `xcode-select --install` dans le terminal

---

## Étapes pour builder l'app

### 1. Installe les dépendances
```bash
cd C:\Users\Romai\Downloads\padelsquad (1)\padelsquad
npm install
```

### 2. Build le site
```bash
npm run build
```
Ça crée un dossier `dist/` avec le site compilé.

### 3. Initialise Capacitor
```bash
npx cap init PadelSquad com.padelsquad.app --web-dir dist
```
Si ça dit que le fichier existe déjà, c'est normal, skip.

### 4. Ajoute la plateforme Android
```bash
npx cap add android
```

### 5. Synchronise le code web avec l'app native
```bash
npx cap sync
```

### 6. Ouvre dans Android Studio
```bash
npx cap open android
```
Ça ouvre Android Studio avec le projet Android.

### 7. Teste sur ton téléphone
- Branche ton téléphone Android en USB
- Active le "Mode développeur" sur ton tel : Paramètres → À propos → tape 7x sur "Numéro de build"
- Active "Débogage USB" dans les Options développeur
- Dans Android Studio, ton tel devrait apparaître en haut → clique ▶️ Run

### 8. Génère l'APK pour distribuer
Dans Android Studio :
- Menu → Build → Build Bundle(s) / APK(s) → Build APK(s)
- L'APK sera dans `android/app/build/outputs/apk/debug/`
- Tu peux l'envoyer par mail/WhatsApp pour que les gens l'installent

---

## Pour publier sur le Play Store

1. **Crée un compte développeur Google** → [play.google.com/console](https://play.google.com/console) (25$ one-time)
2. Dans Android Studio → Build → Generate Signed Bundle/APK → Android App Bundle
3. Crée une clé de signature (keystore) — **GARDE-LA PRÉCIEUSEMENT**
4. Upload le .aab sur le Play Store Console
5. Remplis les infos (description, screenshots, icône)
6. Soumets pour review (1-3 jours)

---

## Pour publier sur l'App Store (Mac requis)

1. `npx cap add ios` puis `npx cap open ios`
2. Ça ouvre Xcode
3. **Compte développeur Apple** → [developer.apple.com](https://developer.apple.com) (99€/an)
4. Configure le signing dans Xcode
5. Archive → Upload to App Store Connect
6. Soumets pour review (1-3 jours)

---

## Icônes de l'app

Tu auras besoin d'icônes à différentes tailles. Le plus simple :
1. Va sur [easyappicon.com](https://easyappicon.com)
2. Upload ton logo (le favicon.svg ou une version PNG 1024x1024)
3. Ça génère toutes les tailles
4. Copie-les dans `android/app/src/main/res/` (Android) ou via Xcode (iOS)

---

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm run build` | Compile le site |
| `npx cap sync` | Copie le build dans l'app native |
| `npx cap open android` | Ouvre Android Studio |
| `npx cap open ios` | Ouvre Xcode |
| `npm run cap:sync` | Build + sync en une commande |

---

## En cas de problème

- **"SDK not found"** → Android Studio → SDK Manager → installe le SDK manquant
- **"No device found"** → vérifie que le débogage USB est activé
- **Écran blanc dans l'app** → `npx cap sync` pour re-copier les fichiers web
- **L'API marche pas** → vérifie que `androidScheme: 'https'` est dans capacitor.config.ts
