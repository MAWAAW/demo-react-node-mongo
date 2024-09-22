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

# Exposer le port 5000
EXPOSE 5000

# Démarrer le serveur backend
CMD ["npm", "start"]