const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const vCardsJS = require('vcards-js');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

router.get('/:slug', async (req, res) => {
  const result = await pool.query('SELECT * FROM users WHERE slug=$1', [req.params.slug]);
  if (result.rowCount === 0) return res.status(404).send('Utente non trovato');
  const user = result.rows[0];

  const vCard = vCardsJS();
  vCard.firstName = user.name;
  vCard.lastName = user.surname;
  vCard.email = user.email;
  vCard.cellPhone = user.phone;
  if (user.is_website_selected && user.website) vCard.url = user.website;

  res.set('Content-Type', `text/vcard; name="${user.slug}.vcf"`);
  res.set('Content-Disposition', `attachment; filename="${user.slug}.vcf"`);
  res.send(vCard.getFormattedString());
});

module.exports = router;
