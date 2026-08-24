const mysql = require('mysql2/promise');

const allowedLevels = new Set(['Beginner', 'Intermediate', 'Advanced']);

let pool;

function getPool() {
  if (!pool) {
    const useSsl = process.env.DB_SSL === 'true';
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      ssl: useSsl ? { minVersion: 'TLSv1.2', rejectUnauthorized: true } : undefined,
    });
  }
  return pool;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const clean = (value) => (typeof value === 'string' ? value.trim() : '');
  const { name, branch, scholar, sport, level = 'Beginner' } = req.body || {};
  const player = {
    name: clean(name),
    branch: clean(branch),
    scholar: clean(scholar),
    sport: clean(sport),
    level: clean(level),
  };

  if (!player.name || !player.branch || !player.scholar || player.sport !== 'Chess') {
    return res.status(400).json({ message: 'Please enter all required details and select Chess.' });
  }
  if (!allowedLevels.has(player.level)) {
    return res.status(400).json({ message: 'Please select a valid experience level.' });
  }
  if (player.name.length > 100 || player.branch.length > 50 || player.scholar.length > 50) {
    return res.status(400).json({ message: 'One or more fields are too long.' });
  }

  try {
    await getPool().execute(
      'INSERT INTO registrations (full_name, branch, scholar_number, sport, experience_level) VALUES (?, ?, ?, ?, ?)',
      [player.name, player.branch, player.scholar, player.sport, player.level],
    );
    return res.status(201).json({ message: 'Registration saved.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'This scholar number is already registered.' });
    }
    console.error('Database error:', error.message);
    return res.status(500).json({ message: 'We could not save your registration. Please try again later.' });
  }
};
