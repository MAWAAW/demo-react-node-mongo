# Application de Gestion des Tâches

Cette application est une plateforme de gestion des tâches, construite avec un frontend en React.js, un backend en Node.js, une base de données MongoDB, et entièrement conteneurisée avec Docker. Elle permet aux utilisateurs de créer des listes de tâches et des tâches associées, avec une authentification via JWT.

## Fonctionnalités

- Authentification des utilisateurs (inscription et connexion).
- Gestion des **listes de tâches** : création, récupération et suppression des listes.
- Gestion des **tâches** : ajout, récupération, modification et suppression des tâches.
- Documentation API Swagger pour tester et visualiser les endpoints.

## Prérequis

Assurez-vous d'avoir les outils suivants installés sur votre machine :

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Installation

1. **Clonez le dépôt** :

   ```bash
   git clone https://github.com/MAWAAW/demo-react-node-mongo
   cd demo-react-node-mongo
   ```

2. **Lancer l'application avec Docker Compose** :

   ```bash
   docker-compose up --build
   ```

Cela construira les images Docker pour le backend et le frontend, démarrera les conteneurs, ainsi que MongoDB.

## Accès à l'application

- **Frontend** : Rendez-vous sur `http://localhost:3000` pour accéder à l'interface utilisateur en React.
- **Backend API** : Les endpoints de l'API sont disponibles sur `http://localhost:5000`.
- **Documentation Swagger** : La documentation de l'API est accessible via `http://localhost:5000/api-docs`.

## Utilisation de l'API

### Authentification

- **Inscription** : `POST /register`
- **Connexion** : `POST /login`

### Listes de tâches

- **Créer une liste de tâches** : `POST /tasklists`
- **Récupérer toutes les listes de tâches** : `GET /tasklists`
- **Supprimer une liste de tâches** : `DELETE /tasklists/{id}`

### Tâches

- **Ajouter une tâche** : `POST /tasks`
- **Récupérer les tâches d'une liste** : `GET /tasks/{taskListId}`
- **Modifier une tâche** : `PUT /tasks/{id}`
- **Supprimer une tâche** : `DELETE /tasks/{id}`

## Arrêter les services Docker

Pour arrêter les conteneurs, utilisez la commande suivante :

  ```bash
  docker-compose down
  ```

## Technologies utilisées

- **Frontend** : React.js
- **Backend** : Node.js, Express.js
- **Base de données** : MongoDB
- **Authentification** : JWT (JSON Web Token)
- **Conteneurisation** : Docker, Docker Compose
- **Documentation** : Swagger
