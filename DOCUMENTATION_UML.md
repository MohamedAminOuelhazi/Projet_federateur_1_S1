# Documentation UML - Cabinet Médical
**Projet Fédérateur - Documentation pour Diagrammes UML**

---

## 📋 ACTEURS DU SYSTÈME

Le système de gestion de cabinet médical comporte **4 acteurs principaux** :

### 1. **PATIENT** 
- Utilisateur externe qui consulte et gère ses informations médicales
- Peut prendre des rendez-vous et consulter ses dossiers médicaux

### 2. **MÉDECIN**
- Professionnel de santé principal
- Gère les consultations, dossiers médicaux et supervise les assistants
- A accès complet à toutes les fonctionnalités

### 3. **ASSISTANT**
- Personnel administratif du cabinet
- Gère les rendez-vous, les patients et la facturation
- Créé et géré par le médecin

### 4. **SYSTÈME (Chatbot IA)**
- Assistant virtuel pour les patients
- Répond automatiquement aux questions médicales

---

## 🎯 FONCTIONNALITÉS PAR ACTEUR

## ACTEUR 1: PATIENT

### **F1. Authentification & Profil**
- **Endpoints Backend:**
  - `POST /api/users/Patient/register` - Inscription patient
  - `POST /api/users/send-verification-code` - Envoi code de vérification email
  - `POST /api/users/verify-email` - Vérification du code email
  - `POST /api/users/login` - Connexion
  - `GET /api/users/me` - Récupérer profil utilisateur
  - `PUT /api/users/me/profile` - Modifier profil
  - `POST /api/users/me/change-password` - Changer mot de passe

- **Pages Frontend:**
  - `/register` - Page d'inscription
  - `/login` - Page de connexion
  - `/dashboard/profil` - Page de profil

---

### **F2. Gestion des Rendez-vous (Patient)**
- **Endpoints Backend:**
  - `GET /api/rendezvous/patient/{patientId}` - Voir mes rendez-vous
  - `GET /api/rendezvous/me` - Mes rendez-vous (authentifié)

- **Pages Frontend:**
  - `/dashboard/rendezvous` - Liste des rendez-vous
  - `/dashboard/rendezvous/{id}` - Détails d'un rendez-vous

---

### **F3. Consultation des Dossiers Médicaux (Patient)**
- **Endpoints Backend:**
  - `GET /api/dossiers/me` - Voir mes dossiers médicaux
  - `GET /api/dossiers/{id}` - Détails d'un dossier
  - `GET /api/dossiers/{dossierId}/files` - Liste des documents
  - `GET /api/dossiers/{dossierId}/files/{docId}` - Télécharger un document

- **Pages Frontend:**
  - `/dashboard/dossiers` - Liste des dossiers
  - `/dashboard/dossiers/{id}` - Détails d'un dossier

---

### **F4. Chatbot IA (Patient uniquement)**
- **Endpoints Backend:**
  - `POST /api/chatbot/ask` - Poser une question au chatbot

- **Pages Frontend:**
  - `/dashboard/chatbot` - Interface du chatbot

---

### **F5. Notifications (Patient)**
- **Endpoints Backend:**
  - `GET /api/notifications/me` - Mes notifications
  - `GET /api/notifications/me/unread` - Notifications non lues
  - `GET /api/notifications/me/unread/count` - Nombre de notifications non lues
  - `PATCH /api/notifications/{id}/read` - Marquer comme lu
  - `POST /api/notifications/me/read-all` - Tout marquer comme lu
  - `DELETE /api/notifications/{id}` - Supprimer notification

---

### **F6. Préférences de Notification (Patient)**
- **Endpoints Backend:**
  - `GET /api/preferences/me` - Mes préférences
  - `PUT /api/preferences/me` - Mettre à jour préférences

- **Pages Frontend:**
  - `/dashboard/parametres` - Page de paramètres

---

## ACTEUR 2: MÉDECIN

### **F7. Authentification & Profil (Médecin)**
- **Endpoints Backend:**
  - `POST /api/users/Medecin/register` - Inscription médecin
  - `POST /api/users/login` - Connexion
  - `GET /api/users/me` - Récupérer profil (avec spécialité, description, photo)
  - `PUT /api/users/me/profile` - Modifier profil

- **Pages Frontend:**
  - `/login` - Connexion
  - `/dashboard/profil` - Profil médecin

---

### **F8. Gestion des Assistants (Médecin uniquement)**
- **Endpoints Backend:**
  - `POST /api/assistants` - Créer un assistant
  - `GET /api/assistants/allAssistants` - Liste de tous les assistants
  - `GET /api/assistants/get/{id}` - Détails d'un assistant
  - `PUT /api/assistants/modifier/{id}` - Modifier un assistant
  - `PATCH /api/assistants/activer/{id}` - Activer/Désactiver un assistant
  - `DELETE /api/assistants/supprimer/{id}` - Supprimer un assistant

- **Pages Frontend:**
  - `/dashboard/assistants` - Gestion des assistants

---

### **F9. Gestion des Patients (Médecin)**
- **Endpoints Backend:**
  - `GET /api/patients/allPatients` - Liste de tous les patients
  - `GET /api/patients/get/{id}` - Détails d'un patient
  - `PUT /api/patients/update/{id}` - Modifier un patient
  - `DELETE /api/patients/delete/{id}` - Supprimer un patient
  - `GET /api/patients/liste` - Liste simplifiée pour sélecteurs

- **Pages Frontend:**
  - `/dashboard/patients` - Liste des patients
  - `/dashboard/patients/nouveau` - Créer un patient

---

### **F10. Gestion des Rendez-vous (Médecin)**
- **Endpoints Backend:**
  - `GET /api/rendezvous/medecin/{medecinId}` - Rendez-vous du médecin (avec filtres date)
  - `GET /api/rendezvous/me` - Mes rendez-vous
  - `GET /api/rendezvous/patient/{patientId}/simple` - Rendez-vous d'un patient (vue simple)
  - `GET /api/rendezvous/creneaux-disponibles` - Créneaux disponibles

- **Pages Frontend:**
  - `/dashboard/rendezvous` - Calendrier des rendez-vous
  - `/dashboard/rendezvous/{id}` - Détails rendez-vous
  - `/dashboard/rendezvous/nouveau` - Nouveau rendez-vous

---

### **F11. Gestion des Dossiers Médicaux (Médecin)**
- **Endpoints Backend:**
  - `GET /api/dossiers/me` - Mes dossiers (tous)
  - `GET /api/dossiers/patient/{patientId}` - Dossiers d'un patient
  - `GET /api/dossiers/{id}` - Détails d'un dossier
  - `GET /api/dossiers/rdv/{rdvId}` - Dossier lié à un rendez-vous
  - `POST /api/dossiers` - Créer un dossier
  - `PUT /api/dossiers/{id}` - Modifier un dossier
  - `POST /api/dossiers/{id}/files` - Ajouter un document
  - `GET /api/dossiers/{dossierId}/files` - Liste documents
  - `GET /api/dossiers/{dossierId}/files/{docId}` - Télécharger document

- **Pages Frontend:**
  - `/dashboard/dossiers` - Liste des dossiers
  - `/dashboard/dossiers/{id}` - Détails d'un dossier

---

### **F12. Gestion des Factures (Médecin)**
- **Endpoints Backend:**
  - `POST /api/factures` - Créer une facture
  - `GET /api/factures` - Toutes les factures
  - `GET /api/factures/{id}` - Détails d'une facture
  - `PUT /api/factures/{id}` - Modifier une facture
  - `DELETE /api/factures/{id}` - Supprimer une facture
  - `PATCH /api/factures/{id}/statut` - Changer statut (payée/impayée)
  - `POST /api/factures/{id}/paiement` - Enregistrer un paiement
  - `GET /api/factures/patient/{patientId}` - Factures d'un patient
  - `GET /api/factures/rapport-financier` - Rapport financier

- **Pages Frontend:**
  - `/dashboard/factures` - Gestion des factures
  - `/dashboard/rapports` - Rapports financiers

---

### **F13. Gestion des Médecins (Auto-gestion)**
- **Endpoints Backend:**
  - `GET /api/medcins/allMedcins` - Liste des médecins
  - `GET /api/medcins/{id}` - Détails médecin
  - `PUT /api/medcins/{id}` - Modifier médecin
  - `DELETE /api/medcins/{id}` - Supprimer médecin

- **Pages Frontend:**
  - `/dashboard/medecins` - Liste médecins
  - `/dashboard/medecins/{id}` - Détails
  - `/dashboard/medecins/{id}/modifier` - Modifier

---

### **F14. Notifications (Médecin)**
- Mêmes endpoints que Patient (F5)

---

## ACTEUR 3: ASSISTANT

### **F15. Authentification & Profil (Assistant)**
- **Endpoints Backend:**
  - `POST /api/users/Assistant/register` - Inscription assistant
  - `POST /api/users/login` - Connexion
  - `GET /api/users/me` - Profil
  - `PUT /api/users/me/profile` - Modifier profil

---

### **F16. Gestion des Patients (Assistant)**
- **Endpoints Backend:**
  - `GET /api/patients/allPatients` - Liste de tous les patients
  - `GET /api/patients/get/{id}` - Détails d'un patient
  - `GET /api/patients/mes-patients` - Patients liés à l'assistant (via RDV créés)
  - `PUT /api/patients/update/{id}` - Modifier un patient
  - `DELETE /api/patients/delete/{id}` - Supprimer un patient

- **Pages Frontend:**
  - `/dashboard/patients` - Liste des patients
  - `/dashboard/patients/nouveau` - Créer patient

---

### **F17. Gestion des Rendez-vous (Assistant)**
- **Endpoints Backend:**
  - `POST /api/rendezvous/assistants/{assistantId}/patients/{patientId}/rdv` - Créer RDV
  - `PATCH /api/rendezvous/assistants/rdv/{id}` - Modifier RDV
  - `GET /api/rendezvous/assistants/{assistantId}` - RDV de l'assistant
  - `GET /api/rendezvous/patient/{patientId}/simple` - RDV patient (filtré par assistant)
  - `GET /api/rendezvous/me` - Mes rendez-vous

- **Pages Frontend:**
  - `/dashboard/rendezvous` - Liste des rendez-vous
  - `/dashboard/rendezvous/nouveau` - Nouveau RDV
  - `/dashboard/rendezvous/{id}/modifier` - Modifier RDV

---

### **F18. Gestion des Factures (Assistant - Restreint)**
- **Endpoints Backend:**
  - `POST /api/factures` - Créer facture (seulement pour ses patients liés)
  - `GET /api/factures` - Factures filtrées (seulement ses patients)
  - `GET /api/factures/{id}` - Détails facture
  - `GET /api/factures/patient/{patientId}` - Factures d'un patient

- **Pages Frontend:**
  - `/dashboard/factures` - Liste des factures

---

### **F19. Consultation des Dossiers (Assistant)**
- **Endpoints Backend:**
  - `GET /api/dossiers/me` - Dossiers accessibles
  - `GET /api/dossiers/{id}` - Détails dossier
  - `GET /api/dossiers/patient/{patientId}` - Dossiers patient
  - `GET /api/dossiers/{dossierId}/files` - Documents

- **Pages Frontend:**
  - `/dashboard/dossiers` - Liste des dossiers

---

### **F20. Notifications (Assistant)**
- Mêmes endpoints que Patient (F5)

---

## ACTEUR 4: SYSTÈME (Chatbot IA)

### **F21. Traitement des Questions (IA)**
- **Service Backend:**
  - `ChatbotService.askChatbot()` - Traiter la question du patient
  - Analyse les symptômes et fournit des conseils

- **Logique:**
  - Reçoit une question du patient
  - Analyse avec un moteur IA (probablement OpenAI ou similaire)
  - Retourne une réponse médicale appropriée

---

## 📊 WORKFLOWS DÉTAILLÉS

### WORKFLOW 1: Inscription Patient (Use Case)

**Acteur:** Patient

**Prérequis:** Aucun

**Étapes:**

1. **Patient** → Accède à la page `/register`
2. **Patient** → Saisit son email
3. **Patient** → Clique sur "Envoyer code de vérification"
4. **Système** → Appelle `POST /api/users/send-verification-code`
5. **Système** → Génère un code aléatoire à 6 chiffres
6. **Système** → Envoie l'email avec le code
7. **Patient** → Reçoit l'email et saisit le code
8. **Patient** → Clique sur "Vérifier"
9. **Système** → Appelle `POST /api/users/verify-email`
10. **Système** → Valide le code
11. **Patient** → Saisit ses informations (nom, prénom, username, password, etc.)
12. **Patient** → Soumet le formulaire
13. **Système** → Appelle `POST /api/users/Patient/register`
14. **Système** → Hash le mot de passe (BCrypt)
15. **Système** → Crée le compte patient dans la BD
16. **Système** → Redirige vers `/login`

**Postcondition:** Patient créé avec succès

---

### WORKFLOW 2: Connexion Utilisateur (Use Case)

**Acteurs:** Patient, Médecin, Assistant

**Prérequis:** Compte existant

**Étapes:**

1. **Utilisateur** → Accède à `/login`
2. **Utilisateur** → Saisit username et mot de passe
3. **Utilisateur** → Clique sur "Se connecter"
4. **Système** → Appelle `POST /api/users/login`
5. **Système** → Authentifie avec Spring Security
6. **Système** → Vérifie le mot de passe (BCrypt)
7. **Système** → Génère un token JWT
8. **Système** → Retourne token + rôle (PATIENT/MEDECIN/ASSISTANT)
9. **Système** → Stocke le token dans le localStorage
10. **Système** → Redirige vers `/dashboard`

**Postcondition:** Utilisateur connecté avec token JWT valide

---

### WORKFLOW 3: Créer un Rendez-vous (Assistant)

**Acteur:** Assistant

**Prérequis:** Assistant connecté, Patient existant

**Étapes:**

1. **Assistant** → Accède à `/dashboard/rendezvous/nouveau`
2. **Assistant** → Appelle `GET /api/patients/liste` pour charger la liste des patients
3. **Assistant** → Sélectionne un patient
4. **Assistant** → Sélectionne une date
5. **Assistant** → Appelle `GET /api/rendezvous/creneaux-disponibles?date=...&medecinId=...`
6. **Système** → Retourne les créneaux horaires disponibles
7. **Assistant** → Sélectionne un créneau disponible
8. **Assistant** → Saisit le motif de consultation
9. **Assistant** → Soumet le formulaire
10. **Système** → Appelle `POST /api/rendezvous/assistants/{assistantId}/patients/{patientId}/rdv`
11. **Système** → Vérifie la disponibilité du médecin
12. **Système** → Crée le rendez-vous en BD
13. **Système** → Crée une notification pour le patient
14. **Système** → Envoie un email de confirmation au patient
15. **Système** → Retourne le rendez-vous créé
16. **Système** → Redirige vers `/dashboard/rendezvous`

**Postcondition:** Rendez-vous créé, patient notifié

---

### WORKFLOW 4: Créer un Dossier Médical (Médecin)

**Acteur:** Médecin

**Prérequis:** Médecin connecté, Patient avec rendez-vous

**Étapes:**

1. **Médecin** → Consulte un rendez-vous terminé
2. **Médecin** → Clique sur "Créer dossier médical"
3. **Système** → Appelle `GET /api/rendezvous/{rdvId}`
4. **Système** → Pré-remplit les informations du patient et RDV
5. **Médecin** → Saisit les données de consultation:
   - Diagnostic
   - Traitement prescrit
   - Résultat consultation
   - Notes médicales
   - Allergies
   - Antécédents médicaux
6. **Médecin** → Peut ajouter des documents (ordonnances, analyses, etc.)
7. **Médecin** → Clique sur "Enregistrer"
8. **Système** → Appelle `POST /api/dossiers`
9. **Système** → Crée le dossier en BD avec lien vers le RDV
10. **Système** → Si documents ajoutés:
    - Appelle `POST /api/dossiers/{id}/files` pour chaque fichier
    - Stocke les fichiers dans `/uploads/dossier-{id}/`
11. **Système** → Crée une notification pour le patient
12. **Système** → Retourne le dossier créé
13. **Système** → Redirige vers `/dashboard/dossiers/{id}`

**Postcondition:** Dossier médical créé et accessible au patient

---

### WORKFLOW 5: Créer une Facture (Assistant ou Médecin)

**Acteurs:** Assistant, Médecin

**Prérequis:** Utilisateur connecté, Patient existant

**Étapes:**

1. **Utilisateur** → Accède à `/dashboard/factures`
2. **Utilisateur** → Clique sur "Nouvelle facture"
3. **Système** → Si Assistant:
   - Appelle `GET /api/patients/mes-patients`
   - Affiche seulement les patients liés à l'assistant
4. **Système** → Si Médecin:
   - Appelle `GET /api/patients/allPatients`
   - Affiche tous les patients
5. **Utilisateur** → Sélectionne un patient
6. **Utilisateur** → Saisit les informations:
   - Montant
   - Description des services
   - Date de la facture
7. **Utilisateur** → Clique sur "Créer"
8. **Système** → Appelle `POST /api/factures`
9. **Système** → Si Assistant:
   - Vérifie que le patient est dans la liste autorisée
   - Refuse si le patient n'est pas lié (403 Forbidden)
10. **Système** → Crée la facture en BD (statut: IMPAYEE)
11. **Système** → Crée une notification pour le patient
12. **Système** → Envoie un email au patient avec la facture
13. **Système** → Retourne la facture créée
14. **Système** → Redirige vers `/dashboard/factures`

**Postcondition:** Facture créée et patient notifié

---

### WORKFLOW 6: Enregistrer un Paiement (Médecin)

**Acteur:** Médecin

**Prérequis:** Facture existante (IMPAYEE)

**Étapes:**

1. **Médecin** → Accède à `/dashboard/factures`
2. **Médecin** → Clique sur une facture impayée
3. **Médecin** → Clique sur "Enregistrer paiement"
4. **Médecin** → Saisit:
   - Montant payé
   - Mode de paiement (CB, Espèces, Chèque, Virement)
   - Date de paiement
   - Référence de transaction (optionnel)
5. **Médecin** → Clique sur "Valider"
6. **Système** → Appelle `POST /api/factures/{id}/paiement`
7. **Système** → Crée l'enregistrement de paiement en BD
8. **Système** → Si montant payé >= montant facture:
   - Appelle `PATCH /api/factures/{id}/statut` avec statut=PAYEE
   - Change le statut à PAYEE
9. **Système** → Crée une notification pour le patient
10. **Système** → Envoie un reçu par email au patient
11. **Système** → Retourne la facture mise à jour

**Postcondition:** Paiement enregistré, facture mise à jour

---

### WORKFLOW 7: Poser une Question au Chatbot (Patient)

**Acteur:** Patient

**Prérequis:** Patient connecté

**Étapes:**

1. **Patient** → Accède à `/dashboard/chatbot`
2. **Patient** → Saisit une question médicale (ex: "J'ai mal à la tête, que faire ?")
3. **Patient** → Clique sur "Envoyer"
4. **Système** → Appelle `POST /api/chatbot/ask`
5. **Système** → `ChatbotService` reçoit la question
6. **Système** → Appelle l'API IA (OpenAI/autre)
7. **Système** → L'IA analyse la question
8. **Système** → L'IA génère une réponse appropriée
9. **Système** → Retourne la réponse au patient
10. **Interface** → Affiche la réponse dans le chat
11. **Patient** → Peut poser d'autres questions

**Postcondition:** Patient reçoit une réponse du chatbot

**Note:** Ce chatbot est réservé aux patients uniquement (`@PreAuthorize("hasRole('PATIENT')")`)

---

### WORKFLOW 8: Créer un Assistant (Médecin)

**Acteur:** Médecin

**Prérequis:** Médecin connecté

**Étapes:**

1. **Médecin** → Accède à `/dashboard/assistants`
2. **Médecin** → Clique sur "Nouvel assistant"
3. **Médecin** → Saisit les informations:
   - Username
   - Nom, Prénom
   - Email
   - Téléphone
   - Mot de passe
   - Date de naissance
4. **Médecin** → Soumet le formulaire
5. **Système** → Appelle `POST /api/assistants`
6. **Système** → Vérifie que l'utilisateur connecté est un MEDECIN
7. **Système** → Si non médecin → 403 Forbidden
8. **Système** → Appelle `UserService.createUser(dto, "ASSISTANT")`
9. **Système** → Hash le mot de passe
10. **Système** → Crée l'assistant en BD
11. **Système** → Envoie un email de bienvenue à l'assistant
12. **Système** → Retourne l'assistant créé
13. **Système** → Redirige vers `/dashboard/assistants`

**Postcondition:** Assistant créé et peut se connecter

---

### WORKFLOW 9: Activer/Désactiver un Assistant (Médecin)

**Acteur:** Médecin

**Prérequis:** Médecin connecté, Assistant existant

**Étapes:**

1. **Médecin** → Accède à `/dashboard/assistants`
2. **Médecin** → Voit la liste des assistants avec leur statut (Actif/Inactif)
3. **Médecin** → Clique sur le bouton "Activer" ou "Désactiver"
4. **Système** → Appelle `PATCH /api/assistants/activer/{id}?active=true/false`
5. **Système** → Met à jour le champ `actif` dans la BD
6. **Système** → Si désactivé:
   - L'assistant ne peut plus se connecter
   - Ses rendez-vous existants restent valides
7. **Système** → Retourne succès
8. **Interface** → Met à jour le statut affiché

**Postcondition:** Statut de l'assistant modifié

---

### WORKFLOW 10: Consulter un Dossier Médical (Patient)

**Acteur:** Patient

**Prérequis:** Patient connecté, Dossier existant

**Étapes:**

1. **Patient** → Accède à `/dashboard/dossiers`
2. **Système** → Appelle `GET /api/dossiers/me`
3. **Système** → Filtre les dossiers du patient connecté
4. **Système** → Retourne la liste des dossiers
5. **Interface** → Affiche la liste avec:
   - Date de consultation
   - Médecin
   - Diagnostic
6. **Patient** → Clique sur un dossier
7. **Système** → Appelle `GET /api/dossiers/{id}`
8. **Système** → Retourne les détails complets:
   - Diagnostic
   - Traitement
   - Notes médicales
   - Allergies
   - Antécédents
9. **Système** → Appelle `GET /api/dossiers/{dossierId}/files`
10. **Système** → Retourne la liste des documents (ordonnances, analyses, etc.)
11. **Interface** → Affiche les détails et les documents
12. **Patient** → Peut télécharger les documents
13. **Système** → Appelle `GET /api/dossiers/{dossierId}/files/{docId}`
14. **Système** → Retourne le fichier en bytes
15. **Navigateur** → Télécharge le fichier

**Postcondition:** Patient consulte son dossier médical

---

### WORKFLOW 11: Générer un Rapport Financier (Médecin)

**Acteur:** Médecin

**Prérequis:** Médecin connecté, Factures existantes

**Étapes:**

1. **Médecin** → Accède à `/dashboard/rapports`
2. **Médecin** → Sélectionne une période (date début, date fin)
3. **Médecin** → Clique sur "Générer rapport"
4. **Système** → Appelle `GET /api/factures/rapport-financier?dateDebut=...&dateFin=...`
5. **Système** → Requête BD pour toutes les factures de la période
6. **Système** → Calcule:
   - Total des factures émises
   - Total payé
   - Total impayé
   - Nombre de factures
   - Répartition par mode de paiement
   - Montant moyen par facture
7. **Système** → Retourne `RapportFinancierDTO`
8. **Interface** → Affiche le rapport avec graphiques
9. **Médecin** → Peut exporter en PDF (fonctionnalité future)

**Postcondition:** Rapport financier généré

---

### WORKFLOW 12: Gérer les Préférences de Notification

**Acteurs:** Patient, Médecin, Assistant

**Prérequis:** Utilisateur connecté

**Étapes:**

1. **Utilisateur** → Accède à `/dashboard/parametres`
2. **Système** → Appelle `GET /api/preferences/me`
3. **Système** → Retourne les préférences actuelles:
   - emailNotifications (boolean)
   - smsNotifications (boolean)
   - pushNotifications (boolean)
   - notificationTypes (array: RDV, FACTURE, DOSSIER, etc.)
4. **Interface** → Affiche les checkboxes avec les valeurs actuelles
5. **Utilisateur** → Modifie les préférences
6. **Utilisateur** → Clique sur "Enregistrer"
7. **Système** → Appelle `PUT /api/preferences/me`
8. **Système** → Met à jour les préférences en BD
9. **Système** → Retourne les préférences mises à jour
10. **Interface** → Affiche message de succès

**Postcondition:** Préférences de notification mises à jour

**Impact:** Les futures notifications respecteront ces préférences

---

## 🔄 DIAGRAMMES DE SÉQUENCE SUGGÉRÉS

Pour vos collègues qui créent les diagrammes de séquence, voici les scénarios clés:

### Séquence 1: Inscription Patient avec Vérification Email
```
Patient -> Frontend -> Backend (send-verification-code) -> EmailService -> Patient (reçoit email)
Patient -> Frontend -> Backend (verify-email) -> Backend vérifie code
Patient -> Frontend -> Backend (register) -> Database -> Patient (compte créé)
```

### Séquence 2: Création Rendez-vous par Assistant
```
Assistant -> Frontend -> Backend (GET créneaux) -> Database
Backend -> Frontend (créneaux disponibles)
Assistant -> Frontend -> Backend (POST créer RDV) -> Database
Backend -> NotificationService -> EmailService -> Patient
Backend -> Frontend (RDV créé)
```

### Séquence 3: Création Dossier Médical
```
Médecin -> Frontend -> Backend (POST dossier) -> Database
Backend -> FileService (upload documents) -> Filesystem
Backend -> NotificationService -> Patient
Backend -> Frontend (dossier créé)
```

### Séquence 4: Création Facture par Assistant (avec contrôle d'accès)
```
Assistant -> Frontend -> Backend (GET mes-patients) -> Database
Backend -> Frontend (liste patients autorisés)
Assistant -> Frontend -> Backend (POST facture) -> AuthService vérifie autorisation
Backend -> Database (crée facture)
Backend -> EmailService -> Patient
Backend -> Frontend (facture créée)
```

### Séquence 5: Question Chatbot
```
Patient -> Frontend -> Backend (POST /chatbot/ask) -> ChatbotService
ChatbotService -> OpenAI API (analyse question)
OpenAI API -> ChatbotService (réponse)
ChatbotService -> Backend -> Frontend -> Patient (affiche réponse)
```

---

## 📐 DIAGRAMMES DE CLASSES SUGGÉRÉS

### Entités Principales

**user (classe abstraite)**
- id: Long
- username: String
- nom: String
- prenom: String
- email: String
- motDePasse: String
- telephone: String
- usertype: String
- dateNaissance: String
- dateCreation: OffsetDateTime

**Patient extends user**
- dossiers: List&lt;DossierPatient&gt;
- rendezvous: List&lt;RendezVous&gt;
- factures: List&lt;Facture&gt;

**Medecin extends user**
- specialite: String
- description: String
- photoUrl: String
- rendezvous: List&lt;RendezVous&gt;

**Assistant extends user**
- actif: boolean
- rendezvousCreated: List&lt;RendezVous&gt;

**RendezVous**
- id: Long
- patient: Patient
- medecin: Medecin
- assistant: Assistant (créateur)
- dateHeure: LocalDateTime
- motifConsultation: String
- statut: StatutRDV (CONFIRME, ANNULE, TERMINE)
- duree: Integer (minutes)

**DossierPatient**
- id: Long
- patient: Patient
- medecin: Medecin
- rendezvous: RendezVous
- dateCreation: LocalDateTime
- diagnostic: String
- traitement: String
- resultatConsultation: String
- notesMedicales: String
- allergies: String
- antecedentsMedicaux: String
- documents: List&lt;Document&gt;

**Facture**
- id: Long
- patient: Patient
- montant: BigDecimal
- dateFacture: LocalDate
- statut: String (PAYEE, IMPAYEE)
- description: String
- paiements: List&lt;Paiement&gt;

**Paiement**
- id: Long
- facture: Facture
- montant: BigDecimal
- datePaiement: LocalDate
- modePaiement: String (CB, ESPECES, CHEQUE, VIREMENT)
- reference: String

**Notification**
- id: Long
- user: user
- titre: String
- message: String
- type: String (RDV, FACTURE, DOSSIER)
- lu: boolean
- dateCreation: LocalDateTime

**PreferenceNotification**
- id: Long
- user: user
- emailNotifications: boolean
- smsNotifications: boolean
- pushNotifications: boolean
- notificationTypes: String (JSON array)

**Document**
- id: Long
- dossier: DossierPatient
- filename: String
- filepath: String
- contentType: String
- size: Long
- dateUpload: LocalDateTime

---

## 🎨 DIAGRAMMES DE USE CASE SUGGÉRÉS

### Use Case Diagram 1: Patient
- Acteur: **Patient**
- Use Cases:
  - S'inscrire (avec vérification email)
  - Se connecter
  - Consulter mes rendez-vous
  - Consulter mes dossiers médicaux
  - Télécharger documents médicaux
  - Poser question au chatbot
  - Consulter mes factures
  - Gérer mes notifications
  - Configurer préférences notification
  - Modifier mon profil

### Use Case Diagram 2: Médecin
- Acteur: **Médecin**
- Use Cases:
  - Se connecter
  - Créer un assistant (includes: Vérifier autorisation)
  - Gérer assistants (Activer/Désactiver, Modifier, Supprimer)
  - Gérer patients (Consulter, Modifier, Supprimer)
  - Consulter calendrier rendez-vous
  - Créer dossier médical (extends: Ajouter documents)
  - Consulter tous dossiers
  - Créer facture
  - Enregistrer paiement
  - Générer rapport financier
  - Gérer notifications
  - Modifier profil

### Use Case Diagram 3: Assistant
- Acteur: **Assistant**
- Use Cases:
  - Se connecter
  - Créer patient
  - Gérer patients (limité)
  - Créer rendez-vous (includes: Vérifier créneaux disponibles)
  - Modifier rendez-vous
  - Consulter mes rendez-vous
  - Créer facture (includes: Vérifier autorisation patient)
  - Consulter factures (filtrées)
  - Consulter dossiers (lecture seule)
  - Gérer notifications
  - Modifier profil

### Use Case Diagram 4: Système (Chatbot)
- Acteur: **Système**
- Use Cases:
  - Recevoir question patient
  - Analyser question avec IA
  - Générer réponse médicale
  - Retourner réponse

---

## 🔐 MATRICE D'AUTORISATION (pour diagrammes)

| Fonctionnalité | Patient | Médecin | Assistant |
|----------------|---------|---------|-----------|
| S'inscrire (avec email verify) | ✅ | ✅ | ❌ (créé par médecin) |
| Se connecter | ✅ | ✅ | ✅ |
| Créer assistant | ❌ | ✅ | ❌ |
| Gérer assistants | ❌ | ✅ | ❌ |
| Créer patient | ❌ | ✅ | ✅ |
| Voir tous patients | ❌ | ✅ | ✅ |
| Voir mes patients liés | ❌ | N/A | ✅ |
| Créer RDV | ❌ | ✅ | ✅ |
| Voir mes RDV | ✅ | ✅ | ✅ |
| Voir tous RDV | ❌ | ✅ | ❌ |
| Créer dossier médical | ❌ | ✅ | ❌ |
| Voir mes dossiers | ✅ | ✅ (tous) | ✅ (lecture) |
| Modifier dossier | ❌ | ✅ | ❌ |
| Ajouter documents | ❌ | ✅ | ❌ |
| Créer facture | ❌ | ✅ (tous patients) | ✅ (patients liés) |
| Voir toutes factures | ❌ | ✅ | ✅ (filtrées) |
| Enregistrer paiement | ❌ | ✅ | ❌ |
| Rapport financier | ❌ | ✅ | ❌ |
| Chatbot | ✅ | ❌ | ❌ |
| Notifications | ✅ | ✅ | ✅ |
| Préférences | ✅ | ✅ | ✅ |

---

## 📌 NOTES IMPORTANTES POUR VOS COLLÈGUES

### Pour les Diagrammes de Classes:
- Utilisez l'héritage pour `user` (abstract) → `Patient`, `Medecin`, `Assistant`
- Relations importantes:
  - Patient **1-n** RendezVous
  - Medecin **1-n** RendezVous
  - Assistant **1-n** RendezVous (en tant que créateur)
  - RendezVous **1-1** DossierPatient (optionnel)
  - Patient **1-n** DossierPatient
  - DossierPatient **1-n** Document
  - Patient **1-n** Facture
  - Facture **1-n** Paiement
  - user **1-n** Notification
  - user **1-1** PreferenceNotification

### Pour les Diagrammes de Séquence:
- Montrez les interactions Frontend → Backend → Services → Database
- N'oubliez pas les services transversaux: EmailService, NotificationService, FileService
- Incluez les contrôles d'autorisation (Spring Security)
- Montrez les appels asynchrones (emails, notifications)

### Pour les Diagrammes de Use Case:
- Séparez par acteur pour plus de clarté
- Utilisez `<<include>>` pour les fonctions obligatoires (ex: vérification email dans inscription)
- Utilisez `<<extend>>` pour les fonctions optionnelles (ex: ajouter documents dans créer dossier)
- Montrez les relations entre acteurs (ex: Médecin supervise Assistant)

---

## 📋 RÉCAPITULATIF DES ENDPOINTS PAR CONTRÔLEUR

### UserController (`/api/users`)
- POST `/login` - Connexion
- POST `/Patient/register` - Inscription patient
- POST `/Medecin/register` - Inscription médecin
- POST `/Assistant/register` - Inscription assistant
- GET `/me` - Profil utilisateur
- PUT `/me/profile` - Modifier profil
- POST `/me/change-password` - Changer mot de passe
- POST `/send-verification-code` - Envoyer code vérification
- POST `/verify-email` - Vérifier code email
- GET `/medecins` - Liste publique médecins

### AssistantController (`/api/assistants`)
- POST `` - Créer assistant (Médecin uniquement)
- GET `/allAssistants` - Liste assistants
- GET `/get/{id}` - Détails assistant
- PUT `/modifier/{id}` - Modifier assistant
- PATCH `/activer/{id}` - Activer/Désactiver
- DELETE `/supprimer/{id}` - Supprimer assistant

### PatientController (`/api/patients`)
- GET `/get/{id}` - Détails patient
- GET `/allPatients` - Tous les patients
- GET `/liste` - Liste simplifiée
- GET `/mes-patients` - Patients liés (Assistant)
- PUT `/update/{id}` - Modifier patient
- DELETE `/delete/{id}` - Supprimer patient

### MedcinController (`/api/medcins`)
- GET `/{id}` - Détails médecin
- GET `/allMedcins` - Tous médecins
- PUT `/{id}` - Modifier médecin
- DELETE `/{id}` - Supprimer médecin

### RendezVousController (`/api/rendezvous`)
- POST `/assistants/{assistantId}/patients/{patientId}/rdv` - Créer RDV
- PATCH `/assistants/rdv/{id}` - Modifier RDV
- GET `/patient/{patientId}` - RDV d'un patient
- GET `/patient/{patientId}/simple` - RDV patient (vue simple)
- GET `/assistants/{assistantId}` - RDV d'un assistant
- GET `/medecin/{medecinId}` - RDV d'un médecin
- GET `/me` - Mes RDV
- GET `/creneaux-disponibles` - Créneaux disponibles

### DossierPatientController (`/api/dossiers`)
- GET `/me` - Mes dossiers
- GET `/{id}` - Détails dossier
- GET `/patient/{patientId}` - Dossiers d'un patient
- GET `/rdv/{rdvId}` - Dossier d'un RDV
- POST `` - Créer dossier
- PUT `/{id}` - Modifier dossier
- POST `/{id}/files` - Ajouter document
- GET `/{dossierId}/files` - Liste documents
- GET `/{dossierId}/files/{docId}` - Télécharger document

### FactureController (`/api/factures`)
- POST `` - Créer facture
- GET `` - Toutes factures
- GET `/{id}` - Détails facture
- PUT `/{id}` - Modifier facture
- DELETE `/{id}` - Supprimer facture
- PATCH `/{id}/statut` - Changer statut
- POST `/{id}/paiement` - Enregistrer paiement
- GET `/patient/{patientId}` - Factures patient
- GET `/rapport-financier` - Rapport financier

### ChatbotController (`/api/chatbot`)
- POST `/ask` - Poser question (Patient uniquement)

### NotificationController (`/api/notifications`)
- GET `/me` - Mes notifications
- GET `/me/unread` - Notifications non lues
- GET `/me/unread/count` - Compte non lues
- PATCH `/{id}/read` - Marquer comme lu
- POST `/me/read-all` - Tout marquer comme lu
- DELETE `/{id}` - Supprimer notification
- POST `` - Créer notification

### PreferenceNotificationController (`/api/preferences`)
- GET `/me` - Mes préférences
- PUT `/me` - Modifier préférences

---

## 🔧 TECHNOLOGIES UTILISÉES

### Backend
- **Framework:** Spring Boot 3.5.7
- **Langage:** Java 21
- **Base de données:** JPA/Hibernate (probablement PostgreSQL/MySQL)
- **Sécurité:** Spring Security + JWT
- **Email:** Spring Mail
- **Validation:** Jakarta Validation

### Frontend
- **Framework:** Next.js (React)
- **Langage:** TypeScript
- **UI Library:** Composants personnalisés (probablement shadcn/ui)
- **Styling:** Tailwind CSS
- **State Management:** Context API (AuthContext)

### Services Externes
- **IA Chatbot:** Probablement OpenAI API ou similaire
- **Email:** Service SMTP configuré

---

**Document créé pour faciliter la création des diagrammes UML**
**Date:** Janvier 2026
**Projet:** Cabinet Médical - Projet Fédérateur

---

✅ **Ce document contient:**
- ✔ 4 Acteurs identifiés
- ✔ 21+ Fonctionnalités détaillées
- ✔ 12 Workflows complets
- ✔ Suggestions pour diagrammes UML
- ✔ Matrice d'autorisation
- ✔ Liste complète des endpoints
- ✔ Modèle de données

**Bonne chance pour vos diagrammes UML !** 🎓
