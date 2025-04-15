const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

router.get('/:slug', async (req, res) => {
  const result = await pool.query('SELECT * FROM users WHERE slug=$1', [req.params.slug]);
  if (result.rowCount === 0) return res.status(404).send('Utente non trovato');
  const user = result.rows[0];

  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${user.slug}.pdf"`);

  doc.fontSize(20).text(`${user.name} ${user.surname}`, 100, 100);
  doc.fontSize(14).text(`Email: ${user.email}`);
  doc.text(`Telefono: ${user.phone}`);
  if (user.website) doc.text(`Sito: ${user.website}`);

  const qrUrl = `http://tuodominio.it/public/${user.slug}`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl);

  doc.image(qrDataUrl, 100, 200, { width: 150 });

  doc.end();
  doc.pipe(res);
});

module.exports = router;