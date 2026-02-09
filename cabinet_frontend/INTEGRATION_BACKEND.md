# Intégration Backend Spring Boot

Ce document décrit l'intégration complète du frontend Next.js avec le backend Spring Boot.

## 📁 Structure des fichiers créés

### Services API (`src/lib/api/`)

- **`config.ts`** : Configuration de base pour les appels API (URL, headers, helpers)
- **`auth.ts`** : Authentification (login, register)
- **`patients.ts`** : Gestion des patients
- **`medecins.ts`** : Gestion des médecins
- **`assistants.ts`** : Gestion des assistants
- **`rendezvous.ts`** : Gestion des rendez-vous
- **`dossiers.ts`** : Gestion des dossiers patients

### Pages créées

#### Patients
- `/dashboard/patients` - Liste des patients
- `/dashboard/patients/nouveau` - Création d'un patient
- `/dashboard/patients/[id]` - Détails d'un patient
- `/dashboard/patients/[id]/modifier` - Modification d'un patient

#### Médecins
- `/dashboard/medecins` - Liste des médecins
- `/dashboard/medecins/[id]` - Détails d'un médecin
- `/dashboard/medecins/[id]/modifier` - Modification d'un médecin

#### Assistants
- `/dashboard/assistants` - Liste des assistants
- `/dashboard/assistants/[id]` - Détails d'un assistant
- `/dashboard/assistants/[id]/modifier` - Modification d'un assistant

#### Rendez-vous
- `/dashboard/rendezvous` - Liste des rendez-vous
- `/dashboard/rendezvous/nouveau` - Création d'un rendez-vous
- `/dashboard/rendezvous/[id]` - Détails d'un rendez-vous
- `/dashboard/rendezvous/[id]/modifier` - Modification d'un rendez-vous

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env.local` à la racine du projet `cabinet_frontend` :

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### Authentification

Le système utilise JWT pour l'authentification. Le token est stocké dans `localStorage` après la connexion.

Pour utiliser l'authentification backend au lieu de Firebase, vous pouvez modifier les pages de login/register pour utiliser `authApi.login()` et `authApi.registerPatient/Medecin/Assistant()`.

## 📡 Endpoints utilisés

### Patients
- `GET /api/patients/allPatients` - Liste tous les patients
- `GET /api/patients/get/{id}` - Récupère un patient
- `PUT /api/patients/update/{id}` - Met à jour un patient
- `DELETE /api/patients/delete/{id}` - Supprime un patient

### Médecins
- `GET /api/medcins/allMedcins` - Liste tous les médecins
- `GET /api/medcins/{id}` - Récupère un médecin
- `PUT /api/medcins/{id}` - Met à jour un médecin
- `DELETE /api/medcins/{id}` - Supprime un médecin

### Assistants
- `GET /api/assistants/allAssistants` - Liste tous les assistants
- `GET /api/assistants/get/{id}` - Récupère un assistant
- `PUT /api/assistants/modifier/{id}` - Met à jour un assistant
- `PATCH /api/assistants/activer/{id}?active={boolean}` - Active/désactive un assistant
- `DELETE /api/assistants/supprimer/{id}` - Supprime un assistant

### Rendez-vous
- `GET /api/rendezvous/me` - Récupère mes rendez-vous
- `GET /api/rendezvous/me/upcoming?daysAhead={days}` - Rendez-vous à venir
- `POST /api/rendezvous/assistants/{assistantId}/patients/{patientId}/rdv` - Crée un rendez-vous
- `PATCH /api/rendezvous/assistants/rdv/{id}` - Met à jour un rendez-vous
- `DELETE /api/rendezvous/assistants/rdv/{id}` - Annule un rendez-vous
- `GET /api/rendezvous/patient/{patientId}` - Rendez-vous d'un patient
- `GET /api/rendezvous/assistants/{assistantId}` - Rendez-vous d'un assistant
- `GET /api/rendezvous/medecin/{medecinId}?from={date}&to={date}` - Rendez-vous d'un médecin

### Dossiers
- `GET /api/dossiers/{id}` - Récupère un dossier
- `GET /api/dossiers/patient/{patientId}` - Dossiers d'un patient
- `GET /api/dossiers/rdv/{rdvId}` - Dossier d'un rendez-vous
- `POST /api/dossiers` - Crée un dossier
- `PUT /api/dossiers/{id}` - Met à jour un dossier
- `POST /api/dossiers/{id}/files` - Upload un document
- `GET /api/dossiers/{dossierId}/files` - Liste les documents
- `GET /api/dossiers/{dossierId}/files/{docId}` - Télécharge un document

## 🎨 Design System

Toutes les pages utilisent le même design system que les pages existantes :

- **Couleurs principales** : `#1E40AF` (bleu principal)
- **Composants** : Card, Button, Input, Table, Badge, etc. de `@/components/ui/`
- **Styles** : Gradients, ombres, backdrop-blur, animations
- **Layout** : DashboardLayout avec sidebar et header

## 📝 Notes importantes

1. **Création de patients/médecins/assistants** : Les endpoints de création passent par `/api/users/{type}/register`. Les pages "nouveau" affichent un message pour rediriger vers l'inscription.

2. **Authentification** : Actuellement, le frontend utilise Firebase. Pour utiliser l'authentification Spring Boot, il faut :
   - Modifier les pages login/register
   - Utiliser `authApi.login()` au lieu de Firebase
   - Gérer le token JWT dans les appels API

3. **Gestion des erreurs** : Toutes les erreurs sont affichées via `toast` (sonner).

4. **Format des dates** : Les dates sont converties entre les formats ISO (backend) et datetime-local (frontend).

## 🚀 Prochaines étapes

1. Adapter les pages Dossiers existantes pour utiliser le backend Spring Boot
2. Intégrer l'authentification Spring Boot dans les pages login/register
3. Ajouter la gestion des documents (upload/download)
4. Implémenter la recherche avancée et les filtres
5. Ajouter la pagination pour les grandes listes

