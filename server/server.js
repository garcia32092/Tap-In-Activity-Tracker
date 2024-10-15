const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // Import PostgreSQL library

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Set up PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres', // Your PostgreSQL username
  host: 'localhost',
  database: 'activity_tracker_db', // The name of your database
  password: 'Trustnothing1$', // Your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

// Create the activities table if it doesn't exist
pool.query(
  `CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    activity TEXT NOT NULL,
    category TEXT NOT NULL,
    hour TIME NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  (err, res) => {
    if (err) {
      console.error('Error creating activities table:', err);
    } else {
      console.log('Activities table is ready');
    }
  }
);

// API to log an activity
app.post('/api/activities', (req, res) => {
  const { activity, category, hour } = req.body;
  pool.query(
    'INSERT INTO activities (activity, category, hour) VALUES ($1, $2, $3) RETURNING *',
    [activity, category, hour],
    (err, result) => {
      if (err) {
        console.error('Error logging activity:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(201).json(result.rows[0]);
      }
    }
  );
});

// API to fetch all activities
app.get('/api/activities', (req, res) => {
  pool.query('SELECT * FROM activities ORDER BY date DESC', (err, result) => {
    if (err) {
      console.error('Error fetching activities:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(result.rows);
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
