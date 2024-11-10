const pool = require('../config/db');

// Create or alter the journals table
pool.query(`
  CREATE TABLE IF NOT EXISTS journals (
    id SERIAL PRIMARY KEY,
    journal_entry TEXT NOT NULL,
    journal_date DATE NOT NULL,
    journal_time TIME NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
  const { journal_entry, journal_date, journal_time } = req.body;

  // Insert into journals table
  pool.query(
    'INSERT INTO journals (journal_entry, journal_date, journal_time) VALUES ($1, $2, $3) RETURNING *',
    [journal_entry, journal_date, journal_time],
    (err, result) => {
      if (err) {
        console.error('Error logging journal:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(201).json(result.rows[0]);
      }
    }
  );
};


// Controller to fetch all journals
const getJournals = (req, res) => {
  pool.query('SELECT * FROM journals ORDER BY date_created DESC', (err, result) => {
    if (err) {
      console.error('Error fetching journals:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(result.rows);
    }
  });
};

module.exports = { logJournal, getJournals };
