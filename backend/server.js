const express = require('express');
const mongoose = require('mongoose');
const seedDatabase = require('./seed');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const User = require('./models/User');
const TaskList = require('./models/TaskList');
const Task = require('./models/Task');

const auth = require('./middleware/auth');

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation de l\'API de gestion des tâches',
      contact: {
        name: 'John Doe',
        email: 'john.doe@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement'
      }
    ],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['taskListId', 'shortDescription', 'longDescription', 'dateEcheance'],
          properties: {
            taskListId: {
              type: 'string',
              description: 'ID de la liste de tâches associée'
            },
            shortDescription: {
              type: 'string',
              description: 'Brève description de la tâche'
            },
            longDescription: {
              type: 'string',
              description: 'Description détaillée de la tâche'
            },
            dateEcheance: {
              type: 'string',
              format: 'date',
              description: 'Date limite de la tâche'
            },
            completed: {
              type: 'boolean',
              description: 'Statut d\'achèvement de la tâche'
            }
          }
        },
      }
    }
  },
  apis: ['./server.js'], // Chemins vers les fichiers à documenter
};

const app = express();

// Swagger setup
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(cors());

const jwtSecret = 'supersecretjwtkey'; // Remplacez par votre clé secrète JWT

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/task-manager')
  .then(() => {
    console.log('MongoDB connecté')
    seedDatabase();
  })
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Routes d'authentification

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Le nom de l'utilisateur
 *               prenom:
 *                 type: string
 *                 description: Le prénom de l'utilisateur
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur
 *               emailConfirm:
 *                 type: string
 *                 description: Confirmation de l'email
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *               passwordConfirm:
 *                 type: string
 *                 description: Confirmation du mot de passe
 *     responses:
 *       201:
 *         description: Utilisateur inscrit avec succès
 *       400:
 *         description: Erreurs de validation
 */
app.post(
  '/register',
  [
    check('nom', 'Le nom est requis').not().isEmpty(),
    check('prenom', 'Le prénom est requis').not().isEmpty(),
    check('email', 'Veuillez inclure un email valide').isEmail(),
    check('emailConfirm', 'La confirmation de l\'email est requise').exists(),
    check('emailConfirm', 'Les emails ne correspondent pas').custom((value, { req }) => value === req.body.email),
    check('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 }),
    check('passwordConfirm', 'La confirmation du mot de passe est requise').exists(),
    check('passwordConfirm', 'Les mots de passe ne correspondent pas').custom((value, { req }) => value === req.body.password)
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nom, prenom, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'L\'utilisateur existe déjà' }] });
      }

      user = new User({ nom, prenom, email, password });

      // Hachage du mot de passe
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Création du token JWT
      const payload = { user: user.id };
      jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  }
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion de l'utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *     responses:
 *       200:
 *         description: Connexion réussie, renvoie un jeton JWT
 *       400:
 *         description: Erreurs de validation
 *       401:
 *         description: Identifiants incorrects
 */
app.post(
  '/login',
  [
    check('email', 'Veuillez inclure un email valide').isEmail(),
    check('password', 'Le mot de passe est requis').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Identifiants invalides' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Identifiants invalides' }] });
      }

      // Création du token JWT
      const payload = { user: user.id };
      jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  }
);

// Routes des listes de tâches

/**
 * @swagger
 * /tasklists:
 *   post:
 *     summary: Créer une nouvelle liste de tâches
 *     tags: [TaskLists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom de la liste de tâches
 *     responses:
 *       201:
 *         description: Liste de tâches créée avec succès
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 */
app.post(
  '/tasklists',
  [auth, [check('nom', 'Le nom est requis').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { nom } = req.body;

      // Vérifier si le nom existe déjà pour cet utilisateur
      let existingList = await TaskList.findOne({ user: req.user, nom });
      if (existingList) {
        return res.status(400).json({ msg: 'Une liste avec ce nom existe déjà' });
      }

      const newList = new TaskList({
        user: req.user,
        nom
      });

      const list = await newList.save();
      res.json(list);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  }
);

/**
 * @swagger
 * /tasklists:
 *   get:
 *     summary: Récupérer toutes les listes de tâches de l'utilisateur
 *     tags: [TaskLists]
 *     responses:
 *       200:
 *         description: Liste des listes de tâches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: L'ID de la liste de tâches
 *                   name:
 *                     type: string
 *                     description: Le nom de la liste de tâches
 *       500:
 *         description: Erreur serveur
 */
app.get('/tasklists', auth, async (req, res) => {
  try {
    const lists = await TaskList.find({ user: req.user }).sort({ dateCreation: -1 });
    res.json(lists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

/**
 * @swagger
 * /tasklists/{id}:
 *   delete:
 *     summary: Supprimer une liste de tâches
 *     tags: [TaskLists]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la liste de tâches à supprimer
 *     responses:
 *       200:
 *         description: Liste de tâches supprimée avec succès
 *       404:
 *         description: Liste de tâches non trouvée
 *       500:
 *         description: Erreur serveur
 */
app.delete('/tasklists/:id', auth, async (req, res) => {
  try {
    const list = await TaskList.findById(req.params.id);

    if (!list) {
      return res.status(404).json({ msg: 'Liste non trouvée' });
    }

    // Vérifier que l'utilisateur est bien le propriétaire
    if (list.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'Autorisation refusée' });
    }

    await TaskList.deleteOne({ _id: req.params.id });

    // Supprimer les tâches associées
    await Task.deleteMany({ taskList: req.params.id });

    res.json({ msg: 'Liste supprimée' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Routes des tâches

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Créer une nouvelle tâche dans une liste de tâches
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskListId:
 *                 type: string
 *                 description: L'ID de la liste de tâches associée
 *               shortDescription:
 *                 type: string
 *                 description: Brève description de la tâche
 *               longDescription:
 *                 type: string
 *                 description: Description détaillée de la tâche
 *               dateEcheance:
 *                 type: string
 *                 format: date
 *                 description: Date limite de la tâche
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur serveur
 */
app.post(
  '/tasks',
  [
    auth,
    [
      check('taskListId', 'L\'ID de la liste de tâches est requis').not().isEmpty(),
      check('shortDescription', 'La description courte est requise').not().isEmpty(),
      check('dateEcheance', 'La date d\'échéance est requise').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { taskListId, shortDescription, longDescription, dateEcheance } = req.body;

      // Vérifier que la liste de tâches existe et appartient à l'utilisateur
      const taskList = await TaskList.findById(taskListId);
      if (!taskList) {
        return res.status(404).json({ msg: 'Liste de tâches non trouvée' });
      }
      if (taskList.user.toString() !== req.user) {
        return res.status(401).json({ msg: 'Autorisation refusée' });
      }

      const newTask = new Task({
        taskList: taskListId,
        shortDescription,
        longDescription,
        dateEcheance,
        completed: false
      });

      const task = await newTask.save();
      res.json(task);

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erreur serveur');
    }
  }
);

/**
 * @swagger
 * /tasks/{taskListId}:
 *   get:
 *     summary: Récupérer les tâches d'une liste spécifique
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: taskListId
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la liste de tâches
 *     responses:
 *       200:
 *         description: Liste des tâches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       404:
 *         description: Liste de tâches non trouvée
 *       500:
 *         description: Erreur serveur
 */
app.get('/tasks/:taskListId', auth, async (req, res) => {
  try {
    // Vérifier que la liste de tâches existe et appartient à l'utilisateur
    const taskList = await TaskList.findById(req.params.taskListId);
    if (!taskList) {
      return res.status(404).json({ msg: 'Liste de tâches non trouvée' });
    }
    if (taskList.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'Autorisation refusée' });
    }

    const tasks = await Task.find({ taskList: req.params.taskListId }).sort({ dateCreation: -1 });
    res.json(tasks);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Mettre à jour une tâche
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la tâche à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shortDescription:
 *                 type: string
 *                 description: Brève description de la tâche
 *               longDescription:
 *                 type: string
 *                 description: Description détaillée de la tâche
 *               dateEcheance:
 *                 type: string
 *                 format: date
 *                 description: Date limite de la tâche
 *               completed:
 *                 type: boolean
 *                 description: Statut d'achèvement de la tâche
 *     responses:
 *       200:
 *         description: Tâche mise à jour avec succès
 *       404:
 *         description: Tâche non trouvée
 *       500:
 *         description: Erreur serveur
 */
app.put('/tasks/:id', auth, async (req, res) => {
  const { shortDescription, longDescription, dateEcheance, completed } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Tâche non trouvée' });
    }

    // Vérifier que la tâche appartient à une liste de l'utilisateur
    const taskList = await TaskList.findById(task.taskList);
    if (taskList.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'Autorisation refusée' });
    }

    // Mettre à jour la tâche
    task.shortDescription = shortDescription || task.shortDescription;
    task.longDescription = longDescription || task.longDescription;
    task.dateEcheance = dateEcheance || task.dateEcheance;
    task.completed = completed !== undefined ? completed : task.completed;

    await task.save();
    res.json(task);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Supprimer une tâche
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'ID de la tâche à supprimer
 *     responses:
 *       200:
 *         description: Tâche supprimée avec succès
 *       404:
 *         description: Tâche non trouvée
 *       500:
 *         description: Erreur serveur
 */
app.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Tâche non trouvée' });
    }

    // Vérifier que la tâche appartient à une liste de l'utilisateur
    const taskList = await TaskList.findById(task.taskList);
    if (taskList.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'Autorisation refusée' });
    }

    await Task.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Tâche supprimée' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
  console.log(`Documentation disponible à http://localhost:${PORT}/api-docs`);
});