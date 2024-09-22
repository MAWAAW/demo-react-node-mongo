const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  taskList: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskList', required: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String },
  dateEcheance: { type: Date, required: true },
  dateCreation: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Task', TaskSchema);