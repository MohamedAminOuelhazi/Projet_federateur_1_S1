Cabinet — Backend
==================

Description
-----------
Backend Spring Boot responsable des API REST et de la logique serveur.

Prérequis
---------
- Java 17+
- Maven (le projet inclut le wrapper `mvnw` / `mvnw.cmd`)
- Base de données (configurable dans `src/main/resources/application.properties`)

Configuration
-------------
- Éditez `src/main/resources/application.properties` pour renseigner la connexion à la base de données, le port et autres paramètres.
- Le script `verify_assistant.sql` (à la racine du dossier `cabinet`) peut servir d'exemple/outil d'initialisation.

Commandes courantes
-------------------
- Lancer en développement (Windows):
  - `mvnw.cmd spring-boot:run`
- Lancer en développement (Linux/Mac):
  - `./mvnw spring-boot:run`
- Créer un paquet exécutable:
  - `./mvnw package` (ou `mvnw.cmd package` sous Windows)
- Exécuter les tests:
  - `./mvnw test`

Points d'entrée utiles
----------------------
- Application principale: `src/main/java/com/projet/cabinet/CabinetApplication.java`
- Fichiers de configuration: `src/main/resources/application.properties`

Conseils de déploiement
-----------------------
- Construisez avec `mvnw package`, puis lancez le JAR produit dans `target/` via `java -jar target/*.jar`.
- Préparez vos variables d'environnement ou un fichier `application-*.properties` pour séparer les configurations (dev/prod).

Dépannage rapide
----------------
- Si l'application ne se connecte pas à la base: vérifiez l'URL, le user/password et que la base accepte les connexions réseau.
- Vérifiez les logs (console) pour les messages d'exception au démarrage.
