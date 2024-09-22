const mongoose = require('mongoose');

// Définir le schéma pour le modèle TaskList
const TaskListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nom: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now }
});

// Index unique pour éviter les doublons (nom de liste unique par utilisateur)
TaskListSchema.index({ user: 1, nom: 1 }, { unique: true });

// Exporter le modèle TaskList
module.exports = mongoose.model('TaskList', TaskListSchema);