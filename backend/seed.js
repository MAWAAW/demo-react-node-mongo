const mongoose = require('mongoose');
const User = require('./models/User');
const TaskList = require('./models/TaskList');
const Task = require('./models/Task');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('Initialisation des données de base...');

    // Vérifier s'il y a déjà un utilisateur
    let user = await User.findOne({ email: 'user@example.com' });
    if (!user) {
      console.log('Création d\'un utilisateur de base');
      user = new User({
        nom: 'Utilisateur',
        prenom: 'Exemple',
        email: 'user@example.com',
        password: await bcrypt.hash('password123', 10),
      });
      await user.save();
    } else {
      console.log('Utilisateur déjà existant');
    }

    // Vérifier s'il y a déjà des listes de tâches
    let taskList = await TaskList.findOne({ user: user._id, nom: 'Liste par défaut' });
    if (!taskList) {
      console.log('Création de la liste de tâches par défaut');
      taskList = new TaskList({
        user: user._id,
        nom: 'Liste par défaut'
      });
      await taskList.save();
    } else {
      console.log('Liste de tâches déjà existante');
    }

    // Vérifier s'il y a déjà des tâches dans cette liste
    const taskCount = await Task.countDocuments({ taskList: taskList._id });
    if (taskCount === 0) {
      console.log('Création de tâches par défaut');
      await Task.insertMany([
        {
          taskList: taskList._id,
          shortDescription: 'Première tâche par défaut',
          longDescription: 'Description plus longue de la première tâche',
          dateEcheance: new Date(),
        },
        {
          taskList: taskList._id,
          shortDescription: 'Deuxième tâche par défaut',
          longDescription: 'Description plus longue de la deuxième tâche',
          dateEcheance: new Date(),
        }
      ]);
    } else {
      console.log('Les tâches par défaut sont déjà présentes');
    }

    console.log('Base de données initialisée avec succès');

  } catch (err) {
    console.error('Erreur lors de l\'initialisation des données:', err);
  }
};

module.exports = seedDatabase;