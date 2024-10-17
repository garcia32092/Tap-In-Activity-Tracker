const pool = require('../config/db');

// Create small wins table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS small_wins (
    id SERIAL PRIMARY KEY,
    win TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Error creating small wins table:', err);
  } else {
    console.log('Small wins table is ready');
  }
});

// Controller to log a small win
const logSmallWin = (req, res) => {
  const { win } = req.body;
  pool.query('INSERT INTO small_wins (win) VALUES ($1) RETURNING *', [win], (err, result) => {
    if (err) {
      console.error('Error logging small win:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.status(201).json(result.rows[0]);
    }
  });
};

// Controller to fetch all small wins
const getSmallWins = (req, res) => {
  pool.query('SELECT * FROM small_wins ORDER BY date DESC', (err, result) => {
    if (err) {
      console.error('Error fetching small wins:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(result.rows);
    }
  });
};

module.exports = { logSmallWin, getSmallWins };
