# 📝 ToDo App 

## 📌 Description

Ce projet est une application **fullstack** de gestion de tâches et de projets.
Elle permet à des utilisateurs de créer, modifier et organiser leurs tâches personnelles ou collaboratives.
Les administrateurs peuvent gérer les utilisateurs et superviser les projets.

👉 L’application inclut une **interface utilisateur Angular** moderne, un **backend Spring Boot** sécurisé avec JWT et une base de données **PostgreSQL**.
👉 Elle est conçue pour être lancée **en local** ou **via Docker** (1 seul Dockerfile pour tout).

---

## ✨ Fonctionnalités principales

* 🔐 **Authentification JWT** (inscription, connexion, rôles `USER` et `ADMIN`)
* ✅ Gestion des tâches : création, édition, suppression, marquage comme terminée
* 📅 Attribution d’une **date d’échéance**
* 🏷️ Gestion des **projets** (tags pour grouper les tâches)
* 👥 **Assignation de membres** à une tâche (multi-utilisateurs)
* 🧑‍💻 Interface **ADMIN** :

  * Gestion des utilisateurs (création, visualisation, suppression)
  * Visualisation des tâches d’un utilisateur
* 🎨 UI stylisée avec **Angular + CSS (Poppins, badges, sidebar animée)**
* 📊 Badges dynamiques pour afficher le nombre de tâches par statut ou par projet

---

## 🛠️ Stack technique

### **Frontend**

* [Angular 17+](https://angular.io/)
* TypeScript, HTML, CSS (Poppins, custom UI)

### **Backend**

* [Spring Boot 3+](https://spring.io/projects/spring-boot)
* Sécurité : Spring Security + JWT
* Gestion ORM : Spring Data JPA + Hibernate

### **Base de données**

* [PostgreSQL 15+](https://www.postgresql.org/)

### **Outils & Build**

* **Maven** (build backend)
* **npm / Angular CLI** (build frontend)
* **Docker** (packaging complet)

---

## 🚀 Installation & Lancement

### 🔹 Prérequis

* **Option 1 : Avec Docker**

  * [Docker](https://docs.docker.com/get-docker/) installé sur votre machine
* **Option 2 : Sans Docker**

  * **Backend** : JDK 17+ et Maven (`mvn -v`)
  * **Frontend** : Node.js 18+ et Angular CLI (`npm install -g @angular/cli`)
  * **Base de données** : PostgreSQL 15+ installé localement

---

### 🔹 Lancer avec Docker (recommandé 🚀)

Tout est packagé dans **un seul Dockerfile**.

1. Construire l’image Docker :

   ```bash
   docker build -t todo-app .
   ```

2. Lancer le conteneur :

   ```bash
   docker run -p 8080:8080 -p 4200:4200 todo-app
   ```

3. Accéder à l’application :

   * Frontend : [http://localhost:4200](http://localhost:4200)
   * Backend API : [http://localhost:8080/api](http://localhost:8080/api)

📌 **Remarque** : La base PostgreSQL est lancée dans le même conteneur.

---

### 🔹 Lancer en local (sans Docker)

#### 1️⃣ Démarrer PostgreSQL

Créer une base de données nommée `todoapp` :

```sql
CREATE DATABASE todoapp;
```

Vérifier que ton `application.properties` pointe vers la bonne configuration :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/todoapp
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

#### 2️⃣ Lancer le backend

```bash
cd todo-backend
mvn spring-boot:run
```

👉 Le backend sera dispo sur [http://localhost:8080](http://localhost:8080)

---

#### 3️⃣ Lancer le frontend

```bash
cd todo-frontend
npm install
ng serve -o
```

👉 Le frontend sera dispo sur [http://localhost:4200](http://localhost:4200)

---

## 👤 Utilisation

* **Utilisateur standard** peut :

  * Créer, modifier et supprimer ses propres tâches
  * Organiser ses tâches par projets
  * Être assigné à des tâches collaboratives

* **Administrateur** peut :

  * Gérer les utilisateurs (ajout, suppression, rôles)
  * Visualiser toutes les tâches des utilisateurs

---

## 📂 Structure du projet

```
todo-app/
│── todo-frontend/     # Application Angular (UI)
│   └── src/
│── todo-backend/      # Application Spring Boot (API REST + Security + JPA)
│   └── src/main/java/com/example/todo
│── Dockerfile         # Dockerfile unique pour build frontend + backend + db
```

---

## 🔒 Authentification & Rôles

* Un utilisateur est créé par défaut (via inscription) avec rôle `USER`.
* Un `ADMIN` peut créer d’autres comptes depuis l’interface utilisateur.
* Les routes protégées utilisent un token **JWT** transmis via `Authorization: Bearer <token>`.

---

## 🎯 Améliorations possibles

* Notifications en temps réel (WebSocket / SignalR)
* Ajout d’un Kanban pour la gestion visuelle des tâches
* Export/Import des tâches (CSV/Excel)
* Tests unitaires (Jest/Angular, JUnit/Mockito)
* Messages d'erreurs et de validation (mauvais identifiants, caractères non gérés...)
