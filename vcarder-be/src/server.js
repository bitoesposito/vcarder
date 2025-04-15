require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connessione PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Multer per upload immagini
const storage = multer.diskStorage({
  destination: './src/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Middleware autenticazione
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

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const user = result.rows[0];
  if (!user) return res.status(404).send('Utente non trovato');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).send('Password errata');

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
  res.json({ token, role: user.role, uuid: user.uuid });
});

// Upload immagine profilo
app.post('/users/:id/upload', verifyToken, upload.single('profileImage'), async (req, res) => {
  const fileUrl = `/uploads/${req.file.filename}`;
  await pool.query('UPDATE users SET profile_image_url=$1 WHERE uuid=$2', [fileUrl, req.params.id]);
  res.json({ url: fileUrl });
});

// Pagina pubblica profilo via slug
app.get('/public/:slug', async (req, res) => {
  const result = await pool.query('SELECT * FROM users WHERE slug=$1', [req.params.slug]);
  if (result.rowCount === 0) return res.status(404).send('Profilo non trovato');
  res.json(result.rows[0]);
});

// Avvio server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend avviato sulla porta ${PORT}`));

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const vcardRoutes = require('./routes/vcard');
app.use('/vcard', vcardRoutes);
