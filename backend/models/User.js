const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définir le schéma pour le modèle User
const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now }
});

// Méthode pour hacher le mot de passe
UserSchema.methods.hashPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
};

// Exporter le modèle User
module.exports = mongoose.model('User', UserSchema);