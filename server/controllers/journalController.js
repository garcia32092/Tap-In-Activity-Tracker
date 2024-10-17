const pool = require('../config/db');

// Create journals table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS journals (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Error creating journals table:', err);
  } else {
    console.log('Journals table is ready');
  }
});

// Controller to log a journal
const logJournal = (req, res) => {
  const { content } = req.body;
  pool.query('INSERT INTO journals (content) VALUES ($1) RETURNING *', [content], (err, result) => {
    if (err) {
      console.error('Error logging journal:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.status(201).json(result.rows[0]);
    }
  });
};

// Controller to fetch all journals
const getJournals = (req, res) => {
  pool.query('SELECT * FROM journals ORDER BY date DESC', (err, result) => {
    if (err) {
      console.error('Error fetching journals:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(result.rows);
    }
  });
};

module.exports = { logJournal, getJournals };
