const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Middleware token e ruolo
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token mancante');
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Token non valido');
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
}

router.post('/create', verifyToken, async (req, res) => {
  if (req.userRole !== 'admin') return res.status(403).send('Accesso negato');

  const { name, surname, email, password, phone, slug } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const uuid = uuidv4();

  await pool.query(
    `INSERT INTO users (uuid, name, surname, email, password_hash, phone, slug)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [uuid, name, surname, email, passwordHash, phone, slug]
  );

  res.json({ message: 'Utente creato con successo', uuid });
});

module.exports = router;
