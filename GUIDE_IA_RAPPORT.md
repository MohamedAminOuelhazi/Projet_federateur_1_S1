# 🤖 GUIDE D'UTILISATION DE L'IA POUR ACCÉLÉRER LA RÉDACTION DU RAPPORT

**Projet Fédérateur - Cabinet Médical**  
**Guide pour Wajdi, Nesrine, Fares, Menyar**

---

## 📌 RÉPARTITION DES CHAPITRES PAR SPRINT

| Membre | Chapitre | Contenu |
|--------|----------|---------|
| **Wajdi** | Chapitre 2 | Étude Préliminaire |
| **Nesrine** | Chapitre 3 | Gestion d'espace Médecin (Sprint 1) |
| **Fares** | Chapitre 4 | Gestion d'espace Assistant (Sprint 2) |
| **Menyar** | Chapitre 5 | Gestion d'espace Patient (Sprint 3) |

---

## 🚀 COMMENT UTILISER L'IA POUR ACCÉLÉRER LE TRAVAIL

### Option 1: GitHub Copilot Chat (Recommandé)
Dans VS Code, ouvrez Copilot Chat et copiez-collez les prompts fournis ci-dessous.

### Option 2: ChatGPT / Claude
Copiez les prompts dans ChatGPT ou Claude, en ajoutant le contexte de notre projet.

### Option 3: Copilot Edits
Utilisez Copilot Edits dans VS Code pour générer directement dans des fichiers Markdown.

---

## 📘 CHAPITRE 2: ÉTUDE PRÉLIMINAIRE (Wajdi)

### Structure du Chapitre 2

```
2.1 INTRODUCTION
2.2 Spécification des besoins
    2.2.1 Identification des acteurs
    2.2.2 Les besoins fonctionnels
    2.2.3 Les besoins non fonctionnels
2.3 Détails fonctionnels
    2.3.1 Diagramme de cas d'utilisation global
    2.3.2 Diagramme de classe global
2.4 Mise en œuvre
    2.4.1 Product backlog
    2.4.2 Planification des sprints
    2.4.3 Diagramme de Gantt
    2.4.4 L'architecture du système
2.5 CONCLUSION
```

---

### 🎯 PROMPT POUR CHAPITRE 2 - Section 2.1 INTRODUCTION

```
Contexte: Je travaille sur un projet de gestion de cabinet médical avec Spring Boot et Next.js.
Le système gère 4 acteurs: Patient, Médecin, Assistant, et un Chatbot IA.

Rédige une introduction pour le chapitre "Étude Préliminaire" qui:
- Présente l'importance de l'étude préliminaire dans le développement
- Explique la méthodologie Scrum/Agile utilisée
- Annonce les sections du chapitre (spécification besoins, détails fonctionnels, mise en œuvre)
- Contexte: système de gestion de cabinet médical moderne avec IA
- Ton académique, 2-3 paragraphes
```

---

### 🎯 PROMPT POUR CHAPITRE 2 - Section 2.2.1 Identification des acteurs

```
Contexte: Projet cabinet médical avec 4 acteurs principaux.

Voici les acteurs identifiés dans mon système:
1. PATIENT - Utilisateur qui consulte et gère ses informations médicales
2. MÉDECIN - Professionnel qui gère consultations, dossiers, supervise assistants
3. ASSISTANT - Personnel administratif gérant RDV, patients, facturation
4. SYSTÈME (Chatbot IA) - Assistant virtuel pour questions médicales

Rédige la section 2.2.1 "Identification des acteurs" en:
- Présentant chaque acteur avec description détaillée
- Expliquant leur rôle dans le système
- Justifiant leur importance
- Utiliser un tableau récapitulatif si possible
- Ton académique
```

---

### 🎯 PROMPT POUR CHAPITRE 2 - Section 2.2.2 Besoins fonctionnels

```
Contexte: Cabinet médical, 4 acteurs, utilise Spring Boot + Next.js

Voici les fonctionnalités principales par acteur:

PATIENT:
- Authentification avec vérification email
- Gestion rendez-vous (consultation)
- Consultation dossiers médicaux
- Chatbot IA pour questions
- Gestion notifications
- Téléchargement documents

MÉDECIN:
- Gestion complète des assistants (CRUD)
- Gestion patients
- Gestion rendez-vous avec calendrier
- Création/modification dossiers médicaux
- Upload documents (ordonnances, analyses)
- Gestion factures et paiements
- Rapports financiers
- Notifications

ASSISTANT:
- Création patients
- Création/modification rendez-vous
- Création factures (patients liés uniquement)
- Consultation dossiers (lecture seule)
- Notifications

CHATBOT:
- Répondre aux questions médicales des patients
- Analyse symptômes avec IA

Rédige la section 2.2.2 "Besoins fonctionnels" en:
- Organisant par acteur
- Détaillant chaque fonctionnalité
- Expliquant la valeur métier
- Utilisant des listes à puces claires
- Ton académique et structuré
```

---

### 🎯 PROMPT POUR CHAPITRE 2 - Section 2.2.3 Besoins non fonctionnels

```
Rédige la section 2.2.3 "Besoins non fonctionnels" pour un système de cabinet médical.

Couvre ces aspects:

1. SÉCURITÉ:
- Authentification JWT
- Chiffrement mots de passe (BCrypt)
- Contrôle d'accès basé sur les rôles (RBAC)
- Protection des données médicales sensibles (RGPD)

2. PERFORMANCE:
- Temps de réponse < 2 secondes
- Support de 100+ utilisateurs simultanés
- Optimisation requêtes base de données

3. DISPONIBILITÉ:
- Disponibilité 99.5%
- Sauvegarde quotidienne des données
- Plan de reprise après sinistre

4. UTILISABILITÉ:
- Interface responsive (mobile, tablette, desktop)
- Navigation intuitive
- Support multi-navigateurs

5. MAINTENABILITÉ:
- Architecture modulaire (Spring Boot microservices potentiel)
- Code documenté
- Tests unitaires et intégration

6. CONFORMITÉ:
- Respect RGPD (données médicales)
- Secret médical
- Traçabilité des accès

Rédige de manière académique avec justifications.
```

---

### 🎯 PROMPT POUR CHAPITRE 2 - Section 2.4.1 Product Backlog

```
Contexte: Projet cabinet médical en méthodologie Scrum.

Voici les User Stories principales:

SPRINT 0 (Préparation):
- Configuration environnement (Spring Boot, Next.js, BD)
- Setup sécurité (JWT, Spring Security)
- Architecture système

SPRINT 1 (Espace Médecin):
- US-01: En tant que médecin, je veux me connecter
- US-02: En tant que médecin, je veux créer un assistant
- US-03: En tant que médecin, je veux gérer mes assistants
- US-04: En tant que médecin, je veux consulter le calendrier de RDV
- US-05: En tant que médecin, je veux créer un dossier médical
- US-06: En tant que médecin, je veux générer un rapport financier

SPRINT 2 (Espace Assistant):
- US-07: En tant qu'assistant, je veux me connecter
- US-08: En tant qu'assistant, je veux créer un patient
- US-09: En tant qu'assistant, je veux créer un rendez-vous
- US-10: En tant qu'assistant, je veux créer une facture
- US-11: En tant qu'assistant, je veux consulter mes patients liés

SPRINT 3 (Espace Patient):
- US-12: En tant que patient, je veux m'inscrire avec vérification email
- US-13: En tant que patient, je veux me connecter
- US-14: En tant que patient, je veux consulter mes RDV
- US-15: En tant que patient, je veux consulter mes dossiers médicaux
- US-16: En tant que patient, je veux poser des questions au chatbot
- US-17: En tant que patient, je veux télécharger mes documents

Crée un tableau Product Backlog avec colonnes:
- ID
- User Story
- Priorité (Haute/Moyenne/Basse)
- Sprint assigné
- Estimation (points de complexité)
- Statut

Format académique.
```

---

### 🎯 PROMPT POUR CHAPITRE 2 - Section 2.4.2 Planification des sprints

```
Contexte: Projet cabinet médical, 3 sprints principaux (+ Sprint 0).

Durée de chaque sprint: 2 semaines

Rédige la section "Planification des sprints" en détaillant:

SPRINT 0 (Initialisation - 1 semaine):
- Setup environnement développement
- Configuration Spring Boot + Next.js
- Setup base de données
- Configuration sécurité (JWT)
- Architecture système

SPRINT 1 (Espace Médecin - 2 semaines):
- Authentification médecin
- CRUD Assistants
- Gestion rendez-vous
- Création dossiers médicaux
- Gestion factures
- Rapports financiers

SPRINT 2 (Espace Assistant - 2 semaines):
- Authentification assistant
- CRUD Patients
- Création rendez-vous
- Création factures (avec restrictions)
- Consultation dossiers

SPRINT 3 (Espace Patient - 2 semaines):
- Inscription avec email verification
- Authentification patient
- Consultation rendez-vous
- Consultation dossiers médicaux
- Chatbot IA
- Téléchargement documents

Pour chaque sprint, détaille:
- Objectifs
- Fonctionnalités développées
- Critères d'acceptation
- Livrables

Ton académique.
```

---

### 🎯 PROMPT POUR CHAPITRE 2 - Section 2.4.4 Architecture du système

```
Contexte: Cabinet médical avec architecture 3-tiers (Frontend, Backend, BD).

Technologies:
- Frontend: Next.js 14 (React, TypeScript, Tailwind CSS)
- Backend: Spring Boot 3.5.7 (Java 21, Spring Security, JPA)
- Base de données: PostgreSQL/MySQL
- Sécurité: JWT
- Services externes: OpenAI (Chatbot), SMTP (Emails)

Rédige la section "Architecture du système" en décrivant:

1. Architecture globale (3-tiers)
2. Couche Présentation (Frontend):
   - Next.js avec App Router
   - Pages et composants
   - Gestion état (Context API)
   - Communication API REST

3. Couche Métier (Backend):
   - Controllers REST
   - Services métier
   - Repositories (JPA)
   - Sécurité (Spring Security + JWT)
   - Services transversaux (Email, Notifications, Chatbot)

4. Couche Données:
   - Base de données relationnelle
   - Modèle entité-relation
   - Gestion fichiers (uploads)

5. Flux de données
6. Diagramme d'architecture (décrire verbalement pour inclusion future)

Ton académique et technique.
```

---

## 📗 CHAPITRES 3, 4, 5: GESTION D'ESPACES (Nesrine, Fares, Menyar)

### Structure commune pour chapitres 3, 4, 5

```
X.1 INTRODUCTION
X.2 Backlog de sprint X
X.3 Spécifications fonctionnelles
    X.3.1 Diagramme de cas d'utilisation du sprint X
    X.3.2 Descriptions textuelles
X.4 Conception
    X.4.1 Diagrammes de séquences
    X.4.2 Diagrammes de classes de sprint X
X.5 Réalisation
X.6 CONCLUSION
```

---

### 🎯 PROMPT GÉNÉRIQUE - Section X.1 INTRODUCTION (Adapter selon l'acteur)

```
Contexte: Chapitre sur la gestion de l'espace [MÉDECIN/ASSISTANT/PATIENT] dans un système de cabinet médical.

Rédige une introduction qui:
- Rappelle le contexte du sprint [1/2/3]
- Présente l'acteur [MÉDECIN/ASSISTANT/PATIENT] et son rôle
- Annonce les fonctionnalités développées dans ce sprint
- Explique l'importance de cet espace pour le système global
- Présente la structure du chapitre

Ton académique, 2-3 paragraphes.
```

**Exemple pour Nesrine (Médecin):**
```
Contexte: Chapitre 3 sur la gestion de l'espace MÉDECIN (Sprint 1) dans un système de cabinet médical.

Le médecin est l'acteur principal qui supervise l'ensemble du cabinet, gère les assistants, 
les dossiers médicaux, et les aspects financiers.

Fonctionnalités du sprint 1:
- Authentification médecin
- Création et gestion des assistants
- Gestion du calendrier de rendez-vous
- Création de dossiers médicaux avec upload de documents
- Gestion des factures et paiements
- Génération de rapports financiers

Rédige l'introduction du chapitre 3.
```

---

### 🎯 PROMPT - Section X.2 Backlog de Sprint

```
Contexte: Sprint [1/2/3] - Gestion espace [MÉDECIN/ASSISTANT/PATIENT]

User Stories du sprint:

[COLLER LES USER STORIES DEPUIS LA DOCUMENTATION_UML.md]

Crée un tableau "Backlog de Sprint X" avec:
- ID User Story
- Description (En tant que... je veux... afin de...)
- Priorité (Haute/Moyenne/Basse)
- Estimation (points)
- Critères d'acceptation (3-4 points par US)
- Statut (À faire/En cours/Terminé)

Format académique et professionnel.
```

---

### 🎯 PROMPT - Section X.3.2 Descriptions textuelles

```
Contexte: Description détaillée des cas d'utilisation pour Sprint [X]

User Story: [TITRE DE LA USER STORY]

Crée une description textuelle complète avec:

**Titre:** [Nom du cas d'utilisation]
**Acteur principal:** [Médecin/Assistant/Patient]
**Acteurs secondaires:** [Système, BD, Services externes]
**Préconditions:** [Ce qui doit être vrai avant]
**Déclencheur:** [Événement qui lance le cas d'utilisation]

**Scénario nominal (flux principal):**
1. L'acteur [action]
2. Le système [réaction]
3. ...
[Étapes détaillées jusqu'à la fin]

**Scénarios alternatifs:**
- 2a. Si [condition]: [action alternative]
- 3a. Si [erreur]: [gestion erreur]

**Postconditions:** [État du système après succès]
**Règles métier:** [Règles spécifiques]

Format académique, détaillé et précis.
```

---

## 🎨 DIAGRAMMES DE SÉQUENCE EN MERMAID

### 📐 Format standard des diagrammes

Tous les diagrammes de séquence doivent suivre ce format:

```
Actor (lifeline) → Interface Frontend (boundary) → Service Backend (control) → BD (entity)
```

**Éléments à utiliser:**
- ✅ Activation bars (rectangles sur les lifelines)
- ✅ Messages synchrones (flèches pleines)
- ✅ Messages de retour (flèches pointillées)
- ✅ Conditions (alt/opt/loop)
- ✅ Notes explicatives
- ✅ Destruction (X) si nécessaire

---

## 📊 EXEMPLES DE DIAGRAMMES MERMAID

### Exemple 1: Inscription Patient avec Vérification Email

```mermaid
sequenceDiagram
    actor Patient
    participant RegisterPage as "Page Inscription<br/>(Frontend)"
    participant AuthAPI as "UserController<br/>(Backend)"
    participant EmailService as "EmailVerificationService<br/>(Backend)"
    participant DB as "Base de Données"
    participant SMTP as "Serveur Email"

    Note over Patient,SMTP: Étape 1: Demande de code de vérification
    
    Patient->>+RegisterPage: Saisit email et clique "Envoyer code"
    activate RegisterPage
    RegisterPage->>+AuthAPI: POST /api/users/send-verification-code<br/>{email: "patient@email.com"}
    activate AuthAPI
    
    AuthAPI->>+EmailService: sendVerificationCode(email)
    activate EmailService
    EmailService->>EmailService: Générer code aléatoire (6 chiffres)
    EmailService->>+DB: Sauvegarder code avec expiration
    activate DB
    DB-->>-EmailService: Code sauvegardé
    deactivate DB
    
    EmailService->>+SMTP: Envoyer email avec code
    activate SMTP
    SMTP-->>-EmailService: Email envoyé
    deactivate SMTP
    EmailService-->>-AuthAPI: Code envoyé avec succès
    deactivate EmailService
    
    AuthAPI-->>-RegisterPage: 200 OK {message: "Code envoyé"}
    deactivate AuthAPI
    RegisterPage-->>Patient: Affiche "Code envoyé à votre email"
    deactivate RegisterPage

    Note over Patient,SMTP: Étape 2: Vérification du code

    Patient->>+RegisterPage: Saisit code reçu et clique "Vérifier"
    activate RegisterPage
    RegisterPage->>+AuthAPI: POST /api/users/verify-email<br/>{email, code}
    activate AuthAPI
    
    AuthAPI->>+EmailService: verifyCode(email, code)
    activate EmailService
    EmailService->>+DB: SELECT code WHERE email AND expiration > NOW()
    activate DB
    
    alt Code valide et non expiré
        DB-->>EmailService: Code trouvé et valide
        deactivate DB
        EmailService->>+DB: Marquer code comme utilisé
        activate DB
        DB-->>-EmailService: OK
        deactivate DB
        EmailService-->>-AuthAPI: true (code valide)
        deactivate EmailService
        AuthAPI-->>-RegisterPage: 200 OK {verified: true}
        deactivate AuthAPI
        RegisterPage-->>Patient: ✓ Email vérifié, formulaire complet activé
        deactivate RegisterPage
    else Code invalide ou expiré
        DB-->>EmailService: Code non trouvé ou expiré
        EmailService-->>AuthAPI: false (code invalide)
        AuthAPI-->>RegisterPage: 400 Bad Request {verified: false}
        RegisterPage-->>Patient: ✗ Code invalide ou expiré
    end

    Note over Patient,SMTP: Étape 3: Création du compte

    Patient->>+RegisterPage: Remplit formulaire et soumet
    activate RegisterPage
    RegisterPage->>+AuthAPI: POST /api/users/Patient/register<br/>{username, password, nom, prenom, ...}
    activate AuthAPI
    
    AuthAPI->>AuthAPI: Valider données (Jakarta Validation)
    
    alt Données valides
        AuthAPI->>+DB: Vérifier si username existe
        activate DB
        
        alt Username disponible
            DB-->>-AuthAPI: Username libre
            deactivate DB
            
            AuthAPI->>AuthAPI: Hash password (BCrypt)
            AuthAPI->>+DB: INSERT INTO users (patient)
            activate DB
            DB-->>-AuthAPI: Patient créé (ID généré)
            deactivate DB
            
            AuthAPI-->>-RegisterPage: 201 Created {user: {...}}
            deactivate AuthAPI
            RegisterPage-->>RegisterPage: Redirection vers /login
            RegisterPage-->>-Patient: Compte créé avec succès
            deactivate RegisterPage
            
        else Username déjà utilisé
            DB-->>AuthAPI: Username existe
            AuthAPI-->>RegisterPage: 409 Conflict {error: "Username existe"}
            RegisterPage-->>Patient: ✗ Username déjà pris
        end
        
    else Données invalides
        AuthAPI-->>RegisterPage: 400 Bad Request {errors: [...]}
        RegisterPage-->>Patient: ✗ Erreurs de validation
    end
```

---

### Exemple 2: Création Rendez-vous par Assistant

```mermaid
sequenceDiagram
    actor Assistant
    participant RdvPage as "Page Nouveau RDV<br/>(Frontend)"
    participant RdvAPI as "RendezVousController<br/>(Backend)"
    participant PatientAPI as "PatientController<br/>(Backend)"
    participant RdvService as "RendezVousService<br/>(Backend)"
    participant NotifService as "NotificationService<br/>(Backend)"
    participant EmailService as "EmailService<br/>(Backend)"
    participant DB as "Base de Données"

    Note over Assistant,DB: Étape 1: Chargement des données initiales

    Assistant->>+RdvPage: Accède à /dashboard/rendezvous/nouveau
    activate RdvPage
    
    RdvPage->>+PatientAPI: GET /api/patients/liste
    activate PatientAPI
    PatientAPI->>+DB: SELECT id, nom, prenom FROM patients
    activate DB
    DB-->>-PatientAPI: Liste patients
    deactivate DB
    PatientAPI-->>-RdvPage: 200 OK [{id, nom, prenom}, ...]
    deactivate PatientAPI
    
    RdvPage-->>-Assistant: Affiche formulaire avec liste patients
    deactivate RdvPage

    Note over Assistant,DB: Étape 2: Sélection patient et vérification créneaux

    Assistant->>+RdvPage: Sélectionne patient et date
    activate RdvPage
    
    RdvPage->>+RdvAPI: GET /api/rendezvous/creneaux-disponibles?<br/>date=2026-01-15&medecinId=1
    activate RdvAPI
    
    RdvAPI->>+RdvService: getCreneauxDisponibles(date, medecinId)
    activate RdvService
    RdvService->>+DB: SELECT * FROM rendez_vous<br/>WHERE medecin_id=1 AND date=2026-01-15
    activate DB
    DB-->>-RdvService: RDV existants
    deactivate DB
    
    RdvService->>RdvService: Calculer créneaux libres<br/>(9h-18h, exclure RDV existants)
    RdvService-->>-RdvAPI: Liste créneaux disponibles
    deactivate RdvService
    
    RdvAPI-->>-RdvPage: 200 OK [{heure: "09:00"}, {heure: "10:00"}, ...]
    deactivate RdvAPI
    
    RdvPage-->>-Assistant: Affiche créneaux disponibles
    deactivate RdvPage

    Note over Assistant,DB: Étape 3: Création du rendez-vous

    Assistant->>+RdvPage: Sélectionne créneau, saisit motif, soumet
    activate RdvPage
    
    RdvPage->>+RdvAPI: POST /api/rendezvous/assistants/5/patients/12/rdv<br/>{dateHeure, motif, medecinId, duree}
    activate RdvAPI
    
    RdvAPI->>+RdvService: createRdv(assistantId, patientId, dto)
    activate RdvService
    
    %% Vérification disponibilité
    RdvService->>+DB: Vérifier disponibilité créneau
    activate DB
    
    alt Créneau disponible
        DB-->>-RdvService: Créneau libre
        deactivate DB
        
        %% Récupération des entités
        RdvService->>+DB: SELECT assistant, patient, medecin
        activate DB
        DB-->>-RdvService: Entités récupérées
        deactivate DB
        
        %% Création RDV
        RdvService->>+DB: INSERT INTO rendez_vous
        activate DB
        DB-->>-RdvService: RDV créé (ID: 45)
        deactivate DB
        
        %% Notification patient
        RdvService->>+NotifService: createNotification(patientId, "Nouveau RDV")
        activate NotifService
        NotifService->>+DB: INSERT INTO notifications
        activate DB
        DB-->>-NotifService: Notification créée
        deactivate DB
        NotifService-->>-RdvService: OK
        deactivate NotifService
        
        %% Email patient
        RdvService->>+EmailService: sendRdvConfirmation(patient, rdv)
        activate EmailService
        EmailService->>EmailService: Générer email HTML
        EmailService->>EmailService: Envoyer via SMTP
        EmailService-->>-RdvService: Email envoyé
        deactivate EmailService
        
        RdvService-->>-RdvAPI: RDV créé avec succès
        deactivate RdvService
        RdvAPI-->>-RdvPage: 201 Created {rdv: {...}}
        deactivate RdvAPI
        
        RdvPage-->>RdvPage: Redirection vers /dashboard/rendezvous
        RdvPage-->>-Assistant: ✓ Rendez-vous créé, patient notifié
        deactivate RdvPage
        
    else Créneau occupé
        DB-->>RdvService: Créneau déjà pris
        RdvService-->>RdvAPI: Erreur: Créneau occupé
        RdvAPI-->>RdvPage: 409 Conflict {error: "Créneau déjà réservé"}
        RdvPage-->>Assistant: ✗ Créneau déjà pris, choisir autre heure
    end
```

---

### Exemple 3: Création Dossier Médical par Médecin

```mermaid
sequenceDiagram
    actor Medecin
    participant DossierPage as "Page Nouveau Dossier<br/>(Frontend)"
    participant DossierAPI as "DossierPatientController<br/>(Backend)"
    participant DossierService as "DossierPatientService<br/>(Backend)"
    participant FileService as "FileStorageService<br/>(Backend)"
    participant NotifService as "NotificationService<br/>(Backend)"
    participant DB as "Base de Données"
    participant FileSystem as "Système Fichiers"

    Note over Medecin,FileSystem: Étape 1: Accès formulaire création dossier

    Medecin->>+DossierPage: Clique "Créer dossier" depuis RDV terminé
    activate DossierPage
    DossierPage->>DossierPage: Pré-remplit patientId et rdvId
    DossierPage-->>-Medecin: Affiche formulaire vide
    deactivate DossierPage

    Note over Medecin,FileSystem: Étape 2: Saisie des informations médicales

    Medecin->>+DossierPage: Saisit données consultation:<br/>- Diagnostic<br/>- Traitement<br/>- Notes médicales<br/>- Allergies<br/>- Antécédents
    activate DossierPage
    Medecin->>DossierPage: Ajoute fichiers (ordonnances, analyses)
    DossierPage-->>-Medecin: Aperçu fichiers sélectionnés
    deactivate DossierPage

    Note over Medecin,FileSystem: Étape 3: Soumission et création dossier

    Medecin->>+DossierPage: Clique "Enregistrer"
    activate DossierPage
    
    DossierPage->>+DossierAPI: POST /api/dossiers<br/>{patientId, rdvId, diagnostic, traitement, ...}
    activate DossierAPI
    
    DossierAPI->>+DossierService: createDossier(dto)
    activate DossierService
    
    %% Validation et récupération entités
    DossierService->>+DB: SELECT patient, rdv, medecin
    activate DB
    
    alt Entités valides
        DB-->>-DossierService: Patient, RDV, Médecin trouvés
        deactivate DB
        
        %% Vérifier si dossier existe déjà pour ce RDV
        DossierService->>+DB: SELECT dossier WHERE rdv_id = ?
        activate DB
        
        opt Dossier n'existe pas encore
            DB-->>-DossierService: Aucun dossier existant
            deactivate DB
            
            %% Création dossier
            DossierService->>+DB: INSERT INTO dossiers_patients
            activate DB
            DB-->>-DossierService: Dossier créé (ID: 78)
            deactivate DB
            
            DossierService-->>-DossierAPI: Dossier créé {id: 78, ...}
            deactivate DossierService
            DossierAPI-->>-DossierPage: 201 Created {dossier: {...}}
            deactivate DossierAPI
            
            DossierPage-->>-Medecin: Dossier créé, ID: 78
            deactivate DossierPage
        end
        
    else Erreur validation
        DB-->>DossierService: Entité non trouvée
        DossierService-->>DossierAPI: Erreur validation
        DossierAPI-->>DossierPage: 400 Bad Request
        DossierPage-->>Medecin: ✗ Erreur: données invalides
    end

    Note over Medecin,FileSystem: Étape 4: Upload des documents (si fichiers présents)

    opt Si fichiers ajoutés
        loop Pour chaque fichier
            Medecin->>+DossierPage: Upload fichier
            activate DossierPage
            
            DossierPage->>+DossierAPI: POST /api/dossiers/78/files<br/>(multipart/form-data)
            activate DossierAPI
            
            DossierAPI->>+DossierService: addDocument(dossierId, file)
            activate DossierService
            
            %% Validation fichier
            DossierService->>DossierService: Valider type fichier (PDF, JPG, PNG)<br/>Valider taille < 10MB
            
            alt Fichier valide
                DossierService->>+FileService: saveFile(file, dossierId)
                activate FileService
                
                FileService->>FileService: Générer nom unique (UUID)
                FileService->>+FileSystem: Créer dossier /uploads/dossier-78/
                activate FileSystem
                FileSystem-->>-FileService: Dossier créé
                deactivate FileSystem
                
                FileService->>+FileSystem: Écrire fichier
                activate FileSystem
                FileSystem-->>-FileService: Fichier sauvegardé
                deactivate FileSystem
                
                FileService-->>-DossierService: filepath
                deactivate FileService
                
                %% Enregistrer métadonnées en BD
                DossierService->>+DB: INSERT INTO documents<br/>(dossier_id, filename, filepath, size, type)
                activate DB
                DB-->>-DossierService: Document enregistré (ID: 123)
                deactivate DB
                
                DossierService-->>-DossierAPI: Document ajouté {id: 123, ...}
                deactivate DossierService
                DossierAPI-->>-DossierPage: 200 OK {document: {...}}
                deactivate DossierAPI
                DossierPage-->>-Medecin: ✓ Fichier uploadé
                deactivate DossierPage
                
            else Fichier invalide
                DossierService-->>DossierAPI: 400 Bad Request {error: "Type/taille invalide"}
                DossierAPI-->>DossierPage: Erreur
                DossierPage-->>Medecin: ✗ Fichier refusé
            end
        end
    end

    Note over Medecin,FileSystem: Étape 5: Notification patient

    DossierService->>+NotifService: createNotification(patientId, "Nouveau dossier médical")
    activate NotifService
    NotifService->>+DB: INSERT INTO notifications
    activate DB
    DB-->>-NotifService: Notification créée
    deactivate DB
    NotifService-->>-DossierService: OK
    deactivate NotifService

    DossierPage->>DossierPage: Redirection vers /dashboard/dossiers/78
    DossierPage->>Medecin: Affiche dossier créé
```

---

### Exemple 4: Création Facture par Assistant (avec contrôle d'accès)

```mermaid
sequenceDiagram
    actor Assistant
    participant FacturePage as "Page Nouvelle Facture<br/>(Frontend)"
    participant FactureAPI as "FactureController<br/>(Backend)"
    participant PatientAPI as "PatientController<br/>(Backend)"
    participant FactureService as "FactureService<br/>(Backend)"
    participant AuthService as "Spring Security<br/>(Backend)"
    participant DB as "Base de Données"

    Note over Assistant,DB: Étape 1: Chargement patients autorisés

    Assistant->>+FacturePage: Accède à /dashboard/factures (clique "Nouvelle")
    activate FacturePage
    
    FacturePage->>+PatientAPI: GET /api/patients/mes-patients<br/>(JWT token dans header)
    activate PatientAPI
    
    PatientAPI->>+AuthService: Vérifier token JWT
    activate AuthService
    AuthService->>AuthService: Décoder token, extraire username
    AuthService->>+DB: SELECT user WHERE username
    activate DB
    DB-->>-AuthService: Assistant trouvé (ID: 5)
    deactivate DB
    AuthService-->>-PatientAPI: Utilisateur authentifié (Assistant ID: 5)
    deactivate AuthService
    
    %% Récupérer patients liés via RDV créés
    PatientAPI->>+DB: SELECT DISTINCT patient<br/>FROM rendez_vous<br/>WHERE assistant_id = 5
    activate DB
    DB-->>-PatientAPI: Patients liés (IDs: 10, 12, 15)
    deactivate DB
    
    PatientAPI-->>-FacturePage: 200 OK [{id: 10, nom, prenom}, ...]
    deactivate PatientAPI
    
    FacturePage-->>-Assistant: Affiche formulaire avec patients autorisés uniquement
    deactivate FacturePage

    Note over Assistant,DB: Étape 2: Saisie et soumission facture

    Assistant->>+FacturePage: Sélectionne patient (ID: 12)<br/>Saisit: montant, description<br/>Clique "Créer"
    activate FacturePage
    
    FacturePage->>+FactureAPI: POST /api/factures<br/>{patientId: 12, montant: 150, description: "..."}
    activate FactureAPI
    
    %% Authentification et autorisation
    FactureAPI->>+AuthService: Vérifier token et rôle
    activate AuthService
    AuthService->>AuthService: Extraire username et rôles
    AuthService->>AuthService: Vérifier role = ASSISTANT
    AuthService-->>-FactureAPI: Authentifié en tant qu'Assistant (ID: 5)
    deactivate AuthService
    
    %% Contrôle d'accès spécifique
    FactureAPI->>+PatientAPI: getPatientsForCurrentAssistant()
    activate PatientAPI
    PatientAPI->>+DB: SELECT DISTINCT patient_id<br/>FROM rendez_vous WHERE assistant_id = 5
    activate DB
    DB-->>-PatientAPI: Patient IDs: [10, 12, 15]
    deactivate DB
    PatientAPI-->>-FactureAPI: Liste IDs patients autorisés
    deactivate PatientAPI
    
    %% Vérification autorisation
    alt Patient ID 12 dans liste autorisée [10, 12, 15]
        FactureAPI->>FactureAPI: ✓ Autorisation accordée
        
        FactureAPI->>+FactureService: createFacture(dto)
        activate FactureService
        
        FactureService->>+DB: SELECT patient WHERE id = 12
        activate DB
        DB-->>-FactureService: Patient trouvé
        deactivate DB
        
        FactureService->>+DB: INSERT INTO factures<br/>(patient_id, montant, description, statut: IMPAYEE)
        activate DB
        DB-->>-FactureService: Facture créée (ID: 201)
        deactivate DB
        
        FactureService-->>-FactureAPI: Facture créée {id: 201, ...}
        deactivate FactureService
        
        FactureAPI-->>-FacturePage: 201 Created {facture: {...}}
        deactivate FactureAPI
        FacturePage-->>-Assistant: ✓ Facture créée avec succès
        deactivate FacturePage
        
    else Patient ID 12 NON autorisé
        FactureAPI->>FactureAPI: ✗ Patient non autorisé pour cet assistant
        FactureAPI-->>FacturePage: 403 Forbidden<br/>{error: "Vous ne pouvez créer des factures<br/>que pour vos patients liés"}
        FacturePage-->>Assistant: ✗ Erreur: Patient non autorisé
    end
```

---

### Exemple 5: Question au Chatbot (Patient)

```mermaid
sequenceDiagram
    actor Patient
    participant ChatPage as "Page Chatbot<br/>(Frontend)"
    participant ChatAPI as "ChatbotController<br/>(Backend)"
    participant ChatService as "ChatbotService<br/>(Backend)"
    participant OpenAI as "OpenAI API<br/>(Externe)"
    participant DB as "Base de Données"

    Note over Patient,DB: Scénario: Patient pose question au chatbot IA

    Patient->>+ChatPage: Accède à /dashboard/chatbot
    activate ChatPage
    ChatPage-->>-Patient: Affiche interface chat
    deactivate ChatPage

    Note over Patient,DB: Patient saisit question

    Patient->>+ChatPage: Saisit: "J'ai mal à la tête depuis 2 jours,<br/>que dois-je faire ?"<br/>Clique "Envoyer"
    activate ChatPage
    
    ChatPage->>+ChatAPI: POST /api/chatbot/ask<br/>{question: "J'ai mal à la tête...", patientId: 25}
    activate ChatAPI
    
    %% Vérification autorisation (Patient uniquement)
    ChatAPI->>ChatAPI: @PreAuthorize("hasRole('PATIENT')")<br/>Vérifier que l'utilisateur est un patient
    
    alt Utilisateur est PATIENT
        ChatAPI->>+ChatService: askChatbot(request)
        activate ChatService
        
        %% Enregistrement question en BD (historique)
        ChatService->>+DB: INSERT INTO chat_history<br/>(patient_id, question, timestamp)
        activate DB
        DB-->>-ChatService: Question enregistrée (ID: 456)
        deactivate DB
        
        %% Préparation prompt pour IA
        ChatService->>ChatService: Construire prompt système:<br/>"Tu es un assistant médical virtuel.<br/>Donne des conseils généraux, pas de diagnostic."
        
        ChatService->>ChatService: Ajouter contexte question:<br/>"Patient demande: J'ai mal à la tête..."
        
        %% Appel API OpenAI
        ChatService->>+OpenAI: POST /v1/chat/completions<br/>{model: "gpt-4", messages: [...]}
        activate OpenAI
        
        OpenAI->>OpenAI: Analyse question avec modèle IA
        OpenAI->>OpenAI: Génère réponse appropriée
        
        OpenAI-->>-ChatService: Réponse IA:<br/>"Les maux de tête peuvent avoir plusieurs causes.<br/>Si persistants, consultez un médecin.<br/>En attendant: repos, hydratation..."
        deactivate OpenAI
        
        %% Enregistrement réponse
        ChatService->>+DB: UPDATE chat_history SET response<br/>WHERE id = 456
        activate DB
        DB-->>-ChatService: Réponse enregistrée
        deactivate DB
        
        ChatService->>ChatService: Créer ChatbotResponseDTO
        ChatService-->>-ChatAPI: {success: true, response: "...", timestamp}
        deactivate ChatService
        
        ChatAPI-->>-ChatPage: 200 OK {response: {...}}
        deactivate ChatAPI
        
        ChatPage->>ChatPage: Afficher réponse dans interface chat
        ChatPage-->>-Patient: Affiche réponse du chatbot
        deactivate ChatPage
        
    else Utilisateur n'est PAS patient
        ChatAPI->>ChatAPI: Access Denied
        ChatAPI-->>ChatPage: 403 Forbidden<br/>{error: "Chatbot réservé aux patients"}
        ChatPage-->>Patient: ✗ Accès refusé
    end

    Note over Patient,DB: Patient peut continuer la conversation

    opt Patient pose question de suivi
        Patient->>ChatPage: "Quel médicament prendre ?"
        ChatPage->>ChatAPI: POST /api/chatbot/ask (nouvelle question)
        Note over ChatService: Même processus que précédemment
        ChatAPI-->>ChatPage: Réponse du chatbot
        ChatPage-->>Patient: Affiche réponse
    end
```

---

### Exemple 6: Connexion Utilisateur (Tous acteurs)

```mermaid
sequenceDiagram
    actor Utilisateur as "Utilisateur<br/>(Patient/Médecin/Assistant)"
    participant LoginPage as "Page Login<br/>(Frontend)"
    participant AuthAPI as "UserController<br/>(Backend)"
    participant AuthManager as "AuthenticationManager<br/>(Spring Security)"
    participant UserDetails as "CustomUserDetailsService<br/>(Backend)"
    participant JWTGenerator as "JWTGenerator<br/>(Backend)"
    participant DB as "Base de Données"

    Note over Utilisateur,DB: Scénario: Connexion utilisateur avec JWT

    Utilisateur->>+LoginPage: Accède à /login
    activate LoginPage
    LoginPage-->>-Utilisateur: Affiche formulaire connexion
    deactivate LoginPage

    Utilisateur->>+LoginPage: Saisit username et password<br/>Clique "Se connecter"
    activate LoginPage
    
    LoginPage->>+AuthAPI: POST /api/users/login<br/>{username: "med_ali", mot_de_passe: "******"}
    activate AuthAPI
    
    AuthAPI->>+AuthManager: authenticate(username, password)
    activate AuthManager
    
    %% Chargement utilisateur
    AuthManager->>+UserDetails: loadUserByUsername("med_ali")
    activate UserDetails
    
    UserDetails->>+DB: SELECT * FROM users WHERE username = 'med_ali'
    activate DB
    
    alt Utilisateur trouvé
        DB-->>-UserDetails: User {id: 3, username, password_hash, usertype: MEDECIN}
        deactivate DB
        
        UserDetails->>UserDetails: Créer UserDetails avec rôle ROLE_MEDECIN
        UserDetails-->>-AuthManager: UserDetails object
        deactivate UserDetails
        
        %% Vérification mot de passe
        AuthManager->>AuthManager: BCrypt.matches(password, stored_hash)
        
        alt Mot de passe correct
            AuthManager-->>-AuthAPI: Authentication object (authentifié)
            deactivate AuthManager
            
            %% Génération JWT
            AuthAPI->>+JWTGenerator: generateToken(authentication)
            activate JWTGenerator
            
            JWTGenerator->>JWTGenerator: Créer claims (username, role: MEDECIN)
            JWTGenerator->>JWTGenerator: Signer token avec secret key
            JWTGenerator->>JWTGenerator: Expiration: 24h
            JWTGenerator-->>-AuthAPI: JWT token: "eyJhbGciOiJIUzI1NiIs..."
            deactivate JWTGenerator
            
            %% Récupérer rôle
            AuthAPI->>+DB: SELECT usertype FROM users WHERE username = 'med_ali'
            activate DB
            DB-->>-AuthAPI: usertype: "MEDECIN"
            deactivate DB
            
            AuthAPI-->>-LoginPage: 200 OK<br/>{token: "eyJhbG...", role: "MEDECIN"}
            deactivate AuthAPI
            
            LoginPage->>LoginPage: Stocker token dans localStorage
            LoginPage->>LoginPage: Stocker role dans Context
            LoginPage->>LoginPage: Redirection vers /dashboard
            LoginPage-->>-Utilisateur: ✓ Connecté, accès au tableau de bord
            deactivate LoginPage
            
        else Mot de passe incorrect
            AuthManager->>AuthManager: Mot de passe invalide
            AuthManager-->>AuthAPI: AuthenticationException
            AuthAPI-->>LoginPage: 401 Unauthorized<br/>{error: "Invalid username or password"}
            LoginPage-->>Utilisateur: ✗ Identifiants incorrects
        end
        
    else Utilisateur non trouvé
        DB-->>UserDetails: Aucun utilisateur trouvé
        UserDetails-->>AuthManager: UsernameNotFoundException
        AuthManager-->>AuthAPI: AuthenticationException
        AuthAPI-->>LoginPage: 401 Unauthorized<br/>{error: "Invalid username or password"}
        LoginPage-->>Utilisateur: ✗ Identifiants incorrects
    end
```

---

## 🔧 COMMENT GÉNÉRER VOS DIAGRAMMES

### Méthode 1: Avec un prompt IA

```
Contexte: Projet cabinet médical, Spring Boot + Next.js, acteurs: Patient/Médecin/Assistant

User Story: [COLLER LA USER STORY]

Endpoints impliqués:
- [ENDPOINT 1]
- [ENDPOINT 2]

Services backend:
- [SERVICE 1]
- [SERVICE 2]

Tables BD:
- [TABLE 1]
- [TABLE 2]

Génère un diagramme de séquence en syntaxe Mermaid qui montre:
- Actor (lifeline)
- Page Frontend (boundary lifeline)
- Controller Backend (control lifeline)
- Service Backend (control lifeline si différent du controller)
- Base de Données (entity lifeline)

Inclus:
- Activation bars sur chaque lifeline quand active
- Messages synchrones (flèches pleines →)
- Messages retour (flèches pointillées -->>)
- Conditions alt/opt si nécessaire
- Notes explicatives
- Gestion erreurs (else)

Format: code Mermaid valide, prêt à copier dans draw.io ou un éditeur Mermaid.
```

---

### Méthode 2: Template à adapter

Voici un template générique à adapter:

```mermaid
sequenceDiagram
    actor Acteur as "[NOM_ACTEUR]"
    participant Page as "[NOM_PAGE]<br/>(Frontend)"
    participant API as "[NOM_CONTROLLER]<br/>(Backend)"
    participant Service as "[NOM_SERVICE]<br/>(Backend)"
    participant DB as "Base de Données"

    Note over Acteur,DB: [DESCRIPTION DU SCÉNARIO]

    Acteur->>+Page: [ACTION UTILISATEUR]
    activate Page
    
    Page->>+API: [HTTP_METHOD] [ENDPOINT]<br/>{données}
    activate API
    
    API->>+Service: [methodName(params)]
    activate Service
    
    Service->>+DB: [REQUÊTE SQL ou description]
    activate DB
    
    alt [CONDITION SUCCÈS]
        DB-->>-Service: [RÉSULTAT]
        deactivate DB
        Service-->>-API: [RETOUR]
        deactivate Service
        API-->>-Page: [HTTP_CODE] [RÉPONSE]
        deactivate API
        Page-->>-Acteur: [AFFICHAGE]
        deactivate Page
        
    else [CONDITION ÉCHEC]
        DB-->>Service: [ERREUR]
        Service-->>API: [EXCEPTION]
        API-->>Page: [HTTP_ERROR_CODE]
        Page-->>Acteur: [MESSAGE ERREUR]
    end
```

---

## 📚 RESSOURCES POUR CHAQUE MEMBRE

### Pour Wajdi (Chapitre 2 - Étude Préliminaire)

**Utilise ce fichier:** `DOCUMENTATION_UML.md`

**Sections clés à exploiter:**
- Acteurs du système
- Fonctionnalités par acteur
- Matrice d'autorisation
- Architecture système

**Diagrammes à créer:**
- Use Case global (4 acteurs)
- Diagramme de classes global
- Diagramme de Gantt (planification)

---

### Pour Nesrine (Chapitre 3 - Espace Médecin)

**User Stories principales:**
- US-01: Connexion médecin
- US-02: Créer un assistant
- US-03: Gérer assistants (activer/désactiver)
- US-04: Consulter calendrier RDV
- US-05: Créer dossier médical
- US-06: Générer rapport financier

**Endpoints:**
- `/api/users/login`
- `/api/assistants/*`
- `/api/rendezvous/medecin/{id}`
- `/api/dossiers`
- `/api/factures/rapport-financier`

**Diagrammes séquence à créer:**
1. Connexion médecin (adapte Exemple 6)
2. Création assistant (adapte structure Exemple 1)
3. Création dossier médical (utilise Exemple 3)
4. Génération rapport financier (crée nouveau)

---

### Pour Fares (Chapitre 4 - Espace Assistant)

**User Stories principales:**
- US-07: Connexion assistant
- US-08: Créer un patient
- US-09: Créer un rendez-vous
- US-10: Créer une facture
- US-11: Consulter patients liés

**Endpoints:**
- `/api/users/login`
- `/api/patients`
- `/api/rendezvous/assistants/{id}/patients/{id}/rdv`
- `/api/factures`
- `/api/patients/mes-patients`

**Diagrammes séquence à créer:**
1. Connexion assistant (adapte Exemple 6)
2. Création patient (adapte structure Exemple 1)
3. Création RDV (utilise Exemple 2)
4. Création facture avec contrôle accès (utilise Exemple 4)

---

### Pour Menyar (Chapitre 5 - Espace Patient)

**User Stories principales:**
- US-12: Inscription avec vérification email
- US-13: Connexion patient
- US-14: Consulter mes RDV
- US-15: Consulter mes dossiers médicaux
- US-16: Poser question au chatbot
- US-17: Télécharger documents

**Endpoints:**
- `/api/users/send-verification-code`
- `/api/users/verify-email`
- `/api/users/Patient/register`
- `/api/users/login`
- `/api/rendezvous/me`
- `/api/dossiers/me`
- `/api/chatbot/ask`
- `/api/dossiers/{id}/files/{docId}`

**Diagrammes séquence à créer:**
1. Inscription avec email verify (utilise Exemple 1)
2. Connexion patient (adapte Exemple 6)
3. Consultation dossiers (adapte Exemple 3 en lecture)
4. Question chatbot (utilise Exemple 5)
5. Téléchargement document (crée nouveau)

---

## 🎨 OUTILS POUR VISUALISER LES DIAGRAMMES MERMAID

### Option 1: Mermaid Live Editor (En ligne)
🔗 https://mermaid.live/

1. Copiez le code Mermaid
2. Collez dans l'éditeur
3. Visualisez en temps réel
4. Exportez en PNG/SVG

### Option 2: VS Code Extension
📦 Extension: "Markdown Preview Mermaid Support"

1. Installez l'extension
2. Créez un fichier `.md`
3. Ajoutez le code Mermaid entre ` ```mermaid ` et ` ``` `
4. Prévisualisez avec `Ctrl+Shift+V`

### Option 3: Draw.io (Convertir depuis Mermaid)
🔗 https://app.diagrams.net/

1. Fichier → Import → Text
2. Collez le code Mermaid
3. Ajustez le style si nécessaire
4. Exportez

---

## ✅ CHECKLIST POUR CHAQUE CHAPITRE

### Chapitre 2 (Wajdi)
- [ ] 2.1 Introduction rédigée
- [ ] 2.2.1 Acteurs identifiés (tableau + descriptions)
- [ ] 2.2.2 Besoins fonctionnels (par acteur)
- [ ] 2.2.3 Besoins non fonctionnels (6 catégories)
- [ ] 2.3.1 Diagramme Use Case global créé
- [ ] 2.3.2 Diagramme de classes global créé
- [ ] 2.4.1 Product Backlog (tableau avec toutes US)
- [ ] 2.4.2 Planification sprints (4 sprints détaillés)
- [ ] 2.4.3 Diagramme de Gantt créé
- [ ] 2.4.4 Architecture système décrite + schéma
- [ ] 2.5 Conclusion rédigée

### Chapitres 3, 4, 5 (Nesrine, Fares, Menyar)
- [ ] X.1 Introduction rédigée
- [ ] X.2 Backlog de sprint (tableau avec US du sprint)
- [ ] X.3.1 Diagramme Use Case du sprint créé
- [ ] X.3.2 Descriptions textuelles (pour chaque US principale)
- [ ] X.4.1 Diagrammes de séquences (4-5 diagrammes minimum)
- [ ] X.4.2 Diagramme de classes du sprint créé
- [ ] X.5 Réalisation (captures d'écran + code clé)
- [ ] X.6 Conclusion rédigée

---

## 🚀 CONSEILS FINAUX

### 1. Travaillez en parallèle
- Chacun dans son chapitre
- Réunions régulières pour cohérence
- Partagez les diagrammes pour éviter duplication

### 2. Utilisez l'IA intelligemment
- Donnez toujours le contexte complet
- Vérifiez et adaptez les réponses
- Ne copiez pas aveuglément, comprenez

### 3. Maintenez la cohérence
- Utilisez les mêmes noms (entités, services, endpoints)
- Référez-vous à `DOCUMENTATION_UML.md`
- Style académique uniforme

### 4. Qualité des diagrammes
- Utilisez Mermaid pour uniformité
- Activation bars sur toutes les lifelines
- Alt/opt pour conditions
- Notes pour clarification

### 5. Validation
- Relecture croisée entre membres
- Vérifiez que les diagrammes correspondent au code réel
- Testez les diagrammes dans Mermaid Live Editor

---

## 📞 SUPPORT

Si vous avez des questions:
1. Consultez `DOCUMENTATION_UML.md` en premier
2. Utilisez les exemples Mermaid fournis
3. Adaptez les prompts à vos besoins spécifiques
4. Partagez entre vous les bonnes pratiques

---

**Bonne rédaction à tous ! 🎓📝**

*Document créé pour faciliter la rédaction du rapport académique*  
*Projet Fédérateur - Cabinet Médical - Janvier 2026*
