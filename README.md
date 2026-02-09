Projet Fédérateur — Cabinet
============================

Résumé
------
Ce dépôt contient l'application de gestion du cabinet médical : backend Spring Boot (`cabinet`) et frontend Next.js (`cabinet_frontend`). Ce README sert d'entrée rapide pour cloner, installer et lancer les deux parties.

Contenu du dépôt
----------------
- [cabinet](cabinet): backend Java / Spring Boot (API REST, Maven)
- [cabinet_frontend](cabinet_frontend): frontend Next.js (React)

Prérequis rapides
------------------
- Java 17+ et Maven (le projet contient un wrapper Maven `mvnw`/`mvnw.cmd`)
- Node 18+ et `npm` ou `pnpm` pour le frontend

Démarrage rapide
-----------------

Backend (développement)

- Ouvrez un terminal dans [cabinet](cabinet)
- Windows: `mvnw.cmd spring-boot:run`
- Linux/Mac: `./mvnw spring-boot:run`

Frontend (développement)

- Ouvrez un terminal dans [cabinet_frontend](cabinet_frontend)
- `npm install`
- `npm run dev`

Configuration importante
-----------------------
- Backend: éditez `cabinet/src/main/resources/application.properties` pour les paramètres (base de données, ports, credentials).
- Frontend: copiez/ajoutez un fichier `.env.local` dans `cabinet_frontend` contenant `NEXT_PUBLIC_API_BASE_URL` pointant vers l'API backend.

Scripts utiles
-------------
- Backend build: `./mvnw package` (ou `mvnw.cmd package` sous Windows)
- Backend tests: `./mvnw test`
- Frontend build: `npm run build`
- Frontend start (production): `npm start` ou `npm run start`

SQL d'initialisation
--------------------
Le dépôt contient `cabinet/verify_assistant.sql` (script d'assistance / vérification). Utilisez-le selon votre configuration de base de données.

Contribuer
---------
Merci pour les contributions — ouvrez une issue ou une Pull Request. Ajoutez des instructions ou scripts d'initialisation si vous automatisez l'installation.

Licence
-------
Ajoutez ici la licence que vous souhaitez utiliser (ex. MIT, Apache-2.0). Si vous voulez, je peux ajouter un fichier `LICENSE`.
