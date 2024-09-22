const mongoose = require('mongoose');

// Définir le schéma pour le modèle Task
const TaskSchema = new mongoose.Schema({
  taskList: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskList', required: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String },
  dateEcheance: { type: Date, required: true },
  dateCreation: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false }
});

// Exporter le modèle Task
module.exports = mongoose.model('Task', TaskSchema);