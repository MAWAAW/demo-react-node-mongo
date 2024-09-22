const mongoose = require('mongoose');

const TaskListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nom: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now }
});

// Index unique pour éviter les doublons (nom de liste unique par utilisateur)
TaskListSchema.index({ user: 1, nom: 1 }, { unique: true });

module.exports = mongoose.model('TaskList', TaskListSchema);