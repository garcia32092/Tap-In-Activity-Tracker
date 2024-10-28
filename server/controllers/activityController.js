const pool = require('../config/db');

// Create activities table if it doesn't exist
pool.query(
  `CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    activity TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    activity_date DATE NOT NULL,
    color TEXT,
    date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  (err) => {
    if (err) {
      console.error('Error creating activities table:', err);
    } else {
      console.log('Activities table is ready');
    }
  }
);

// Controller to log an activity
const logActivity = (req, res) => {
  const { activity, category, description, start, end, activityDate, color } = req.body;
  pool.query(
    'INSERT INTO activities (activity, category, description, start_time, end_time, activity_date, color) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
    [activity, category, description, start, end, activityDate, color],
    (err, result) => {
      if (err) {
        console.error('Error logging activity:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.status(201).json(result.rows[0]);
      }
    }
  );
};

// Controller to fetch all activities
const getActivities = (req, res) => {
  pool.query('SELECT * FROM activities ORDER BY activity_date DESC', (err, result) => {
    if (err) {
      console.error('Error fetching activities:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(result.rows);
    }
  });
};

module.exports = { logActivity, getActivities };
