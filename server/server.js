const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // Import PostgreSQL library

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Set up PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DATABASE_USER, // Your PostgreSQL username
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME, // The name of your database
  password: process.env.DATABASE_PASSWORD, // Your PostgreSQL password
  port: process.env.DATABASE_PORT, // Default PostgreSQL port
});


// Update the activities table creation to include start, end, and description fields
pool.query(
  `CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    activity TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT, -- Optional field for activity description
    start TIME NOT NULL, -- Start time field
    end TIME NOT NULL,   -- End time field
    activity_date DATE NOT NULL, -- Date field for the activity
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

// API to log an activity with new fields
app.post('/api/activities', (req, res) => {
  const { activity, category, description, start, end, activityDate } = req.body;
  pool.query(
    'INSERT INTO activities (activity, category, description, start, end, activity_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [activity, category, description, start, end, activityDate],
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


// Create journals table
pool.query(
  `CREATE TABLE IF NOT EXISTS journals (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  (err, res) => {
    if (err) {
      console.error('Error creating journals table:', err);
    } else {
      console.log('Journals table is ready');
    }
  }
);

// API to log a journal
app.post('/api/journals', (req, res) => {
  const { content } = req.body;
  pool.query(
    'INSERT INTO journals (content) VALUES ($1) RETURNING *',
    [content],
    (err, result) => {
      if (err) {
        console.error('Error logging journal:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(201).json(result.rows[0]);
      }
    }
  );
});

// API to fetch all journals
app.get('/api/journals', (req, res) => {
  pool.query('SELECT * FROM journals ORDER BY date DESC', (err, result) => {
    if (err) {
      console.error('Error fetching journals:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(result.rows);
    }
  });
});


// Create small wins table
pool.query(
  `CREATE TABLE IF NOT EXISTS small_wins (
    id SERIAL PRIMARY KEY,
    win TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  (err, res) => {
    if (err) {
      console.error('Error creating small wins table:', err);
    } else {
      console.log('Small wins table is ready');
    }
  }
);

// API to log a small win
app.post('/api/small-wins', (req, res) => {
  const { win } = req.body;
  pool.query(
    'INSERT INTO small_wins (win) VALUES ($1) RETURNING *',
    [win],
    (err, result) => {
      if (err) {
        console.error('Error logging small win:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(201).json(result.rows[0]);
      }
    }
  );
});

// API to fetch all small wins
app.get('/api/small-wins', (req, res) => {
  pool.query('SELECT * FROM small_wins ORDER BY date DESC', (err, result) => {
    if (err) {
      console.error('Error fetching small wins:', err);
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
