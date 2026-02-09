# 🔐 Système de Gestion des Comptes

## 📋 Vue d'ensemble

Ce document décrit les nouvelles fonctionnalités de gestion des comptes implémentées dans le système de cabinet médical.

## ✨ Fonctionnalités implémentées

### 1. **Inscription Patient avec Vérification Email** 📧

#### Page : `/register`
- **Accès public** - Uniquement pour les patients (pas d'accès médecin/assistant)
- **Flux en 2 étapes** :

#### Étape 1 : Formulaire d'inscription
- Prénom et Nom
- Nom d'utilisateur
- Email
- Date de naissance
- Mot de passe (min 6 caractères)
- Confirmation mot de passe

Au clic sur "Continuer" :
- Un code de vérification à 4 chiffres est envoyé par email
- Le système passe automatiquement à l'étape 2

#### Étape 2 : Vérification email
- Saisie du code à 4 chiffres
- Validation du code (expire après 15 minutes)
- Options :
  - **Vérifier et créer le compte** - Valide le code et crée le compte
  - **Renvoyer le code** - Envoie un nouveau code
  - **Retour** - Retourne au formulaire

### 2. **Gestion des Assistants** 👥

#### Page : `/dashboard/assistants`
- **Accès réservé aux MÉDECINS uniquement**
- **Fonctionnalités** :

#### ➕ Création d'assistant
- Bouton "Nouvel Assistant" en haut à droite
- Formulaire modal avec :
  - Prénom, Nom
  - Nom d'utilisateur
  - Email
  - Mot de passe (min 6 caractères)
- Validation des doublons (email/username)

#### 📊 Liste des assistants
Tableau affichant :
- Nom, Prénom
- Email
- Username
- Statut (Badge Actif/Inactif)
- Actions :
  - **Toggle Activation** - Switch pour activer/désactiver un assistant

### 3. **Paramètres - Sécurité** 🔒

#### Page : `/dashboard/parametres`
Deux nouvelles sections ajoutées :

#### Section "Sécurité"
Accessible à **tous les utilisateurs** (Patient, Médecin, Assistant)

**Changement de mot de passe** :
- Ancien mot de passe
- Nouveau mot de passe (min 6 caractères)
- Confirmer nouveau mot de passe
- Validation :
  - Vérification ancien mot de passe correct
  - Les deux nouveaux mots de passe correspondent
  - Longueur minimale respectée

#### Section "Zone dangereuse" ⚠️
Accessible **uniquement aux PATIENTS**

**Suppression de compte** :
- Bouton rouge "Supprimer mon compte"
- Modal de confirmation :
  - Titre : "Êtes-vous absolument sûr ?"
  - Description : "Cette action est irréversible..."
  - Actions :
    - **Annuler** - Ferme le modal
    - **Oui, supprimer mon compte** - Supprime le compte et déconnecte l'utilisateur
- Après suppression :
  - Déconnexion automatique
  - Redirection vers `/home`

## 🔌 API Endpoints

### Backend (Spring Boot)

#### Email Verification
- `POST /api/users/send-verification-code` - Envoie un code de vérification
  - Body: `{ email: string }`
  - Génère un code à 4 chiffres
  - Envoie l'email avec le code
  - Expire après 15 minutes

- `POST /api/users/verify-email` - Vérifie un code
  - Body: `{ email: string, code: string }`
  - Retourne: `{ verified: boolean }`

#### Account Management
- `PUT /api/users/me/change-password` - Change le mot de passe
  - Body: `{ oldPassword: string, newPassword: string }`
  - Vérifie l'ancien mot de passe avec BCrypt
  - Hash et sauvegarde le nouveau

- `DELETE /api/users/me` - Supprime le compte (patients uniquement)
  - Vérifie que l'utilisateur est un PATIENT
  - Supprime toutes les données associées
  - Retourne 204 No Content

#### Assistants Management
- `POST /api/assistants` - Crée un assistant (médecins uniquement)
  - Body: `{ firstname, lastname, username, email, password }`
  - Vérifie que l'utilisateur est MEDECIN
  - Hash le mot de passe
  - Retourne l'assistant créé

- `PATCH /api/assistants/{id}/toggle-activation` - Active/Désactive un assistant
  - Vérifie que l'utilisateur est MEDECIN
  - Inverse le statut `active` de l'assistant
  - Retourne l'assistant mis à jour

### Frontend (Next.js)

#### API Clients

**`src/lib/api/account.ts`**
```typescript
accountApi.sendVerificationCode(email: string): Promise<void>
accountApi.verifyEmail({ email, code }): Promise<{ verified: boolean }>
accountApi.changePassword({ oldPassword, newPassword }): Promise<void>
accountApi.deleteAccount(): Promise<void>
```

**`src/lib/api/assistants.ts`**
```typescript
assistantsApi.getAll(): Promise<Assistant[]>
assistantsApi.create(data: CreateAssistantDTO): Promise<Assistant>
assistantsApi.toggleActivation(id: number): Promise<Assistant>
assistantsApi.update(id, data): Promise<Assistant>
assistantsApi.delete(id): Promise<void>
```

## 🎨 UI/UX

### Composants utilisés
- **shadcn/ui** pour tous les composants
- **Toasts (Sonner)** pour les notifications
- **Dialog** pour les modals
- **AlertDialog** pour les confirmations
- **Switch** pour les toggles
- **Badge** pour les statuts

### Icônes (Lucide React)
- `Mail`, `Lock`, `User`, `Calendar` - Formulaires
- `Plus`, `UserPlus` - Création
- `Loader2` - Chargement
- `ArrowLeft` - Navigation
- `Trash2`, `AlertTriangle` - Suppression

### Styles
- **Gradients** : from-blue-50 via-white to-blue-50
- **Cards** : shadow-xl, backdrop-blur
- **Buttons** : bg-blue-600 hover:bg-blue-700
- **Destructive** : bg-red-600 hover:bg-red-700

## 📧 Templates Email

### Code de vérification
```html
Sujet: Code de vérification - Cabinet Médical

Contenu:
- En-tête bleu dégradé
- Code à 4 chiffres en grand
- Message : "Saisissez ce code pour vérifier votre email"
- Avertissement : "Le code expire dans 15 minutes"
- Footer avec informations cabinet
```

## 🔒 Sécurité

### Authentification
- **JWT** pour l'authentification
- **BCrypt** pour le hashing des mots de passe
- **Role-based access control** :
  - `/dashboard/assistants` → MEDECIN uniquement
  - Suppression compte → PATIENT uniquement
  - Changement mot de passe → Tous

### Validation
- Vérification ancien mot de passe avant changement
- Validation longueur mot de passe (min 6 caractères)
- Vérification correspondance mots de passe
- Validation emails et usernames uniques
- Codes de vérification expirés après 15 minutes

### Protection CSRF
- Tokens JWT dans les headers
- Validation côté serveur pour toutes les actions sensibles

## 🧪 Tests

### Scénarios à tester

#### 1. Inscription patient
1. Aller sur `/register`
2. Remplir le formulaire
3. Vérifier réception email avec code
4. Saisir le code
5. Vérifier création du compte
6. Se connecter avec les credentials

#### 2. Création assistant (médecin)
1. Se connecter en tant que médecin
2. Aller sur `/dashboard/assistants`
3. Cliquer "Nouvel Assistant"
4. Remplir le formulaire
5. Vérifier apparition dans la liste
6. Tester toggle activation

#### 3. Changement mot de passe
1. Aller sur `/dashboard/parametres`
2. Section "Sécurité"
3. Saisir ancien + nouveau mot de passe
4. Vérifier toast de succès
5. Se déconnecter et reconnecter avec nouveau mot de passe

#### 4. Suppression compte (patient)
1. Se connecter en tant que patient
2. Aller sur `/dashboard/parametres`
3. Section "Zone dangereuse"
4. Cliquer "Supprimer mon compte"
5. Confirmer dans le modal
6. Vérifier redirection vers `/home`
7. Vérifier impossibilité de se reconnecter

## 🎯 Améliorations futures possibles

1. **Récupération mot de passe oublié** :
   - Envoyer code par email
   - Réinitialiser le mot de passe

2. **Authentification 2FA** :
   - Code SMS
   - Authenticator app

3. **Audit logs** :
   - Historique des actions sensibles
   - Date/heure de connexion

4. **Gestion des sessions** :
   - Liste des appareils connectés
   - Déconnexion à distance

5. **Validation email renforcée** :
   - Vérifier format email
   - Vérifier domaine existant

6. **Rate limiting** :
   - Limiter tentatives de connexion
   - Limiter envoi de codes

## 📝 Notes de développement

### Fichiers modifiés/créés

#### Frontend
- ✅ `src/app/register/page.tsx` - Refonte complète avec vérification email
- ✅ `src/app/dashboard/parametres/page.tsx` - Ajout sections sécurité + suppression
- ✅ `src/app/dashboard/assistants/page.tsx` - Ajout bouton création + toggle
- ✅ `src/lib/api/account.ts` - Nouveau fichier API client
- ✅ `src/lib/api/assistants.ts` - Méthodes create() et toggleActivation() ajoutées

#### Backend
- ✅ `VerificationCode.java` - Nouvelle entité
- ✅ `EmailVerificationService.java` - Nouveau service
- ✅ `UserController.java` - Nouveaux endpoints
- ✅ `AssistantController.java` - Endpoints création + toggle
- ✅ `UserService.java` & `UserServiceImpl.java` - Nouvelles méthodes
- ✅ `CorsConfig.java` - Ajout méthode PATCH

### Dépendances
- Aucune nouvelle dépendance requise
- Utilise JavaMailSender déjà configuré
- shadcn/ui components déjà installés

---

**Date de création** : Janvier 2025  
**Version** : 1.0  
**Auteur** : Équipe de développement Cabinet Médical
