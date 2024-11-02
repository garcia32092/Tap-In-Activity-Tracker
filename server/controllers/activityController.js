const pool = require('../config/db');
const { format } = require('date-fns');

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

// Controller to delete an activity
const deleteActivity = (req, res) => {
  const { id } = req.params;
  
  pool.query(
    'DELETE FROM activities WHERE id = $1 RETURNING *',
    [id],
    (err, result) => {
      if (err) {
        console.error('Error deleting activity:', err);
        res.status(500).json({ error: 'Database error' });
      } else if (result.rowCount === 0) {
        res.status(404).json({ error: 'Activity not found' });
      } else {
        res.status(200).json({ message: 'Activity deleted successfully', activity: result.rows[0] });
      }
    }
  );
};

// Controller to update an activity
const updateActivity = (req, res) => {
  const { id } = req.params;
  const { title, category, meta, start, end, color } = req.body;

  const activity = title;
  const description = meta.description;
  const formattedStart = format(new Date(start), 'HH:mm:ss');
  const formattedEnd = format(new Date(end), 'HH:mm:ss');
  const formattedActivityDate = format(new Date(start), 'yyyy-MM-dd');
  const primaryColor = color.primary;

  pool.query(
    `UPDATE activities 
     SET activity = $1, category = $2, description = $3, start_time = $4, end_time = $5, activity_date = $6, color = $7 
     WHERE id = $8 
     RETURNING *`,
    [activity, category, description, formattedStart, formattedEnd, formattedActivityDate, primaryColor, id],
    (err, result) => {
      if (err) {
        console.error('Error updating activity:', err);
        res.status(500).json({ error: 'Database error' });
      } else if (result.rowCount === 0) {
        res.status(404).json({ error: 'Activity not found' });
      } else {
        res.status(200).json({ message: 'Activity updated successfully', activity: result.rows[0] });
      }
    }
  );
};

module.exports = { logActivity, getActivities, deleteActivity, updateActivity };
