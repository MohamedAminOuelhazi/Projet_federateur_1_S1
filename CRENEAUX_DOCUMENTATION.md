# Système de Créneaux Disponibles - Documentation

## 📅 Vue d'ensemble

Le système de créneaux disponibles permet la prise de rendez-vous en ligne avec affichage des disponibilités du médecin en temps réel.

## ✅ Fonctionnalités implémentées

### Backend (Spring Boot)

1. **TimeSlotDTO** - `/cabinet/src/main/java/com/projet/cabinet/DTO/TimeSlotDTO.java`
   - Représente un créneau horaire avec :
     - `startTime` : Heure de début
     - `endTime` : Heure de fin
     - `available` : Disponibilité (true/false)
     - `label` : Label formaté (ex: "09:00 - 09:30")

2. **Service de calcul des créneaux** - `RendezVousServiceImpl.java`
   - Méthode `getAvailableSlots(Long medecinId, LocalDate date)`
   - Configuration :
     - Heures de travail : 9h00 - 17h00
     - Durée des créneaux : 30 minutes
     - Créneaux générés toutes les 30 minutes
   - Logique :
     - Récupère les RDV existants pour le médecin à la date donnée
     - Génère tous les créneaux possibles
     - Marque comme indisponibles les créneaux déjà réservés ou passés
     - Détecte les chevauchements automatiquement

3. **Endpoint REST** - `RendezVousController.java`
   ```java
   GET /api/rendezvous/medecin/{medecinId}/slots-disponibles?date=YYYY-MM-DD
   ```
   - Retourne la liste des créneaux disponibles et occupés
   - Paramètres :
     - `medecinId` : ID du médecin
     - `date` : Date au format ISO (YYYY-MM-DD)

### Frontend (Next.js)

1. **API Client** - `/src/lib/api/rendezvous.ts`
   - Interface `TimeSlotDTO`
   - Méthode `getAvailableSlots(medecinId, date)`

2. **Page de prise de rendez-vous** - `/src/app/dashboard/rendezvous/nouveau/page.tsx`
   - Composants utilisés :
     - Calendrier interactif (react-day-picker)
     - Grille de créneaux horaires
     - Sélection patient/médecin
     - Récapitulatif en temps réel
   
   - Fonctionnalités :
     - ✅ Sélection de date via calendrier
     - ✅ Chargement automatique des créneaux à la sélection médecin/date
     - ✅ Affichage visuel des créneaux disponibles/occupés
     - ✅ Désactivation des dates passées
     - ✅ Désactivation des créneaux occupés ou passés
     - ✅ Récapitulatif avant validation
     - ✅ Protection par rôle (MEDECIN, ASSISTANT)

## 🚀 Utilisation

### Pour créer un rendez-vous :

#### En tant que PATIENT :
1. Aller sur `/dashboard/rendezvous`
2. Cliquer sur "Nouveau rendez-vous"
3. Votre nom est automatiquement sélectionné comme patient
4. Choisir une **date** dans le calendrier
5. Les **créneaux disponibles** s'affichent automatiquement
6. Cliquer sur un créneau disponible (vert)
7. Optionnel : Ajouter un **motif** de consultation
8. Vérifier le récapitulatif
9. Cliquer sur "Créer le rendez-vous"

#### En tant que ASSISTANT ou MÉDECIN :
1. Aller sur `/dashboard/rendezvous`
2. Cliquer sur "Nouveau rendez-vous"
3. Sélectionner un **patient** dans la liste
4. Le médecin du cabinet est automatiquement sélectionné
5. Choisir une **date** dans le calendrier
6. Les **créneaux disponibles** s'affichent automatiquement
7. Cliquer sur un créneau disponible (vert)
8. Optionnel : Ajouter un **motif** de consultation
9. Vérifier le récapitulatif
10. Cliquer sur "Créer le rendez-vous"

### Codes couleur des créneaux :

- **Bleu** (bordure) : Créneau disponible
- **Bleu foncé** (plein) : Créneau sélectionné
- **Gris** (désactivé) : Créneau occupé ou passé

## ⚙️ Configuration

### Modifier les horaires de travail :

Dans `RendezVousServiceImpl.java`, ligne ~210 :

```java
LocalTime startWork = LocalTime.of(9, 0);  // Heure de début
LocalTime endWork = LocalTime.of(17, 0);   // Heure de fin
int slotDurationMinutes = 30;              // Durée des créneaux
```

### Exemples de modification :

```java
// Horaires 8h-18h avec créneaux de 15 minutes
LocalTime startWork = LocalTime.of(8, 0);
LocalTime endWork = LocalTime.of(18, 0);
int slotDurationMinutes = 15;

// Horaires 10h-16h avec créneaux de 1 heure
LocalTime startWork = LocalTime.of(10, 0);
LocalTime endWork = LocalTime.of(16, 0);
int slotDurationMinutes = 60;
```

## 📊 Flux de données

```
1. Utilisateur sélectionne médecin + date
   ↓
2. Frontend → GET /api/rendezvous/medecin/{id}/slots-disponibles?date=...
   ↓
3. Backend calcule les créneaux :
   - Récupère RDV existants
   - Génère créneaux 9h-17h (30min)
   - Marque disponibles/occupés
   ↓
4. Frontend affiche grille de créneaux
   ↓
5. Utilisateur sélectionne un créneau
   ↓
6. Frontend → POST /api/rendezvous/assistants/{assistantId}/patients/{patientId}/rdv
   ↓
7. Backend crée le RDV + Dossier patient automatique
```

## 🔒 Sécurité

- ✅ Protection par JWT token
- ✅ Vérification des rôles (MEDECIN, ASSISTANT)
- ✅ Validation côté backend des dates
- ✅ Impossible de réserver dans le passé
- ✅ Impossible de réserver un créneau déjà pris

## 📱 Responsive

- ✅ Mobile : 1 colonne pour créneaux
- ✅ Tablet : 2 colonnes pour créneaux  
- ✅ Desktop : Calendrier + créneaux côte à côte

## 🔧 Améliorations futures possibles

1. **Notifications**
   - Email de confirmation lors de la prise de RDV
   - Rappel 24h avant le RDV

2. **Personnalisation horaires**
   - Horaires spécifiques par médecin (table Medecin)
   - Jours de congé/fermeture
   - Pauses déjeuner

3. **Gestion avancée**
   - Créneaux de durée variable selon type de consultation
   - Réservation multiple (plusieurs créneaux d'affilée)
   - Liste d'attente si créneau complet

4. **UX**
   - Afficher nombre de créneaux disponibles par jour
   - Proposer le prochain créneau disponible
   - Vue hebdomadaire/mensuelle

## 🐛 Dépannage

### Les créneaux ne s'affichent pas

1. Vérifier que le backend est démarré (port 8080)
2. Vérifier la console navigateur (F12) pour les erreurs
3. Vérifier qu'un médecin est bien sélectionné
4. Vérifier que la date est dans le futur

### Tous les créneaux sont gris

- Les créneaux sont tous occupés pour cette date
- Ou la date sélectionnée est dans le passé
- Vérifier les RDV existants dans la base de données

### Erreur lors de la création

- Vérifier que l'utilisateur connecté est bien un ASSISTANT
- Vérifier les logs backend pour plus de détails
- Vérifier que le patient et médecin existent

## 📞 Support

Pour toute question ou problème :
- Vérifier les logs backend : `cabinet/target/` ou console IntelliJ/Eclipse
- Vérifier la console navigateur (F12 → Console)
- Vérifier la base de données MySQL
