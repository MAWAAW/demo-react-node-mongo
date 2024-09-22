# Utiliser une image Node.js officielle
FROM node:20-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le contenu dans le conteneur
COPY . .

# Construire l'application React
RUN npm run build

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application avec un serveur HTTP pour servir les fichiers statiques
CMD ["npm", "start"]
