const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey';

// Middleware d'authentification
function auth(req, res, next) {
    const token = req.header('x-auth-token');
  
    // Vérifier si le token existe
    if (!token) {
      return res.status(401).json({ msg: 'Pas de token, autorisation refusée' });
    }
  
    try {
      // Décoder et vérifier le token
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded.user; // Ajouter l'utilisateur décodé à la requête
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token invalide' });
    }
  }

module.exports = auth;