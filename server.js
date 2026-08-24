require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const allowedLevels = new Set(['Beginner', 'Intermediate', 'Advanced']);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(express.json({ limit: '20kb' }));
app.use(express.static(__dirname));

app.post('/api/registrations', async (req, res) => {
  const { name, branch, scholar, sport, level = 'Beginner' } = req.body;
  const clean = (value) => (typeof value === 'string' ? value.trim() : '');
  const player = { name: clean(name), branch: clean(branch), scholar: clean(scholar), sport: clean(sport), level: clean(level) };

  if (!player.name || !player.branch || !player.scholar || player.sport !== 'Chess') {
    return res.status(400).json({ message: 'Please enter all required details and select Chess.' });
  }
  if (!allowedLevels.has(player.level)) return res.status(400).json({ message: 'Please select a valid experience level.' });
  if (player.name.length > 100 || player.branch.length > 50 || player.scholar.length > 50) {
    return res.status(400).json({ message: 'One or more fields are too long.' });
  }

  try {
    await pool.execute(
      'INSERT INTO registrations (full_name, branch, scholar_number, sport, experience_level) VALUES (?, ?, ?, ?, ?)',
      [player.name, player.branch, player.scholar, player.sport, player.level],
    );
    return res.status(201).json({ message: 'Registration saved.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'This scholar number is already registered.' });
    console.error('Database error:', error.message);
    return res.status(500).json({ message: 'We could not save your registration. Please try again later.' });
  }
});

app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(port, () => console.log(`Checkmate is running at http://localhost:${port}`));
