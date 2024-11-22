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
    activity_start_date DATE NOT NULL,
    activity_end_date DATE NOT NULL,
    color VARCHAR(7),
    inProgress BOOLEAN DEFAULT FALSE NOT NULL,
    allDay BOOLEAN DEFAULT FALSE NOT NULL,
    draggable BOOLEAN DEFAULT FALSE NOT NULL,
    resizable_beforeStart BOOLEAN DEFAULT FALSE NOT NULL,
    resizable_afterEnd BOOLEAN DEFAULT FALSE NOT NULL,
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
  const { activity, category, description, start, end, activityStartDate, activityEndDate, color, inProgress, allDay, draggable, resizable_beforeStart, resizable_afterEnd } = req.body;
  pool.query(
    `INSERT INTO activities (activity, category, description, start_time, end_time, activity_start_date, activity_end_date, color, inProgress, allDay, draggable, resizable_beforeStart, resizable_afterEnd)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
    [activity, category, description, start, end, activityStartDate, activityEndDate, color, inProgress, allDay, draggable, resizable_beforeStart, resizable_afterEnd],
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
  pool.query('SELECT * FROM activities ORDER BY activity_start_date DESC', (err, result) => {
    if (err) {
      console.error('Error fetching activities:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(result.rows);
    }
  });
};

const getActivityById = (req, res) => {
  const { id } = req.params;

  pool.query(
    'SELECT * FROM activities WHERE id = $1',
    [id],
    (err, result) => {
      if (err) {
        console.error('Error fetching activity by ID:', err);
        res.status(500).json({ error: 'Database error' });
      } else if (result.rowCount === 0) {
        res.status(404).json({ error: 'Activity not found' });
      } else {
        res.status(200).json(result.rows[0]);
      }
    }
  );
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
  const { title, category, meta, start, end, color, allDay, draggable, resizable } = req.body;

  const activity = title;
  const description = meta.description;
  const formattedStart = format(new Date(start), 'HH:mm:ss');
  const formattedEnd = format(new Date(end), 'HH:mm:ss');
  const formattedActivityStartDate = format(new Date(start), 'yyyy-MM-dd');
  const formattedActivityEndDate = format(new Date(end), 'yyyy-MM-dd');
  const primaryColor = color.primary;
  const resizable_beforeStart = resizable.beforeStart;
  const resizable_afterEnd = resizable.afterEnd;

  pool.query(
    `UPDATE activities
     SET activity = $1, category = $2, description = $3, start_time = $4, end_time = $5, activity_start_date = $6, activity_end_date = $7, color = $8, allDay = $9, draggable = $10, resizable_beforeStart = $11, resizable_afterEnd = $12
     WHERE id = $13
     RETURNING *`,
    [activity, category, description, formattedStart, formattedEnd, formattedActivityStartDate, formattedActivityEndDate, primaryColor, allDay, draggable, resizable_beforeStart, resizable_afterEnd, id],
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

const endActivity = (req, res) => {
  const { id } = req.params;
  const { endTime } = req.body;

  pool.query(
    `UPDATE activities
     SET inprogress = false, end_time = $1
     WHERE id = $2
     RETURNING *`,
    [endTime, id],
    (err, result) => {
      if (err) {
        console.error('Error ending activity:', err);
        res.status(500).json({ error: 'Database error' });
      } else if (result.rowCount === 0) {
        res.status(404).json({ error: 'Activity not found' });
      } else {
        res.status(200).json({ message: 'Activity ended successfully', activity: result.rows[0] });
      }
    }
  );
};

const getTodayActivities = (req, res) => {
  const now = new Date();
  
  // Format the current date as YYYY-MM-DD without converting to UTC
  const today = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0');
  
  pool.query(
    'SELECT * FROM activities WHERE activity_start_date = $1',
    [today],
    (err, result) => {
      if (err) {
        console.error('Error fetching today\'s activities:', err);
        res.status(500).json({ error: 'Database error' });
      } else {
        res.json(result.rows);
      }
    }
  );
};

// Controller function to get activities by range, aggregated by category
const getActivitiesByRange = async (req, res) => {
  const { range, start, end } = req.query;
  let startDate, endDate;

  try {
    if (range) {
      ({ startDate, endDate } = getDateRange(range)); // Calculate startDate and endDate based on range
    } else if (start && end) {
      startDate = new Date(start);
      endDate = new Date(end);
    } else {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    const query = `
      WITH activity_segments AS (
          SELECT
              category,
              color,
              CASE
                  WHEN activity_start_date = activity_end_date THEN
                      EXTRACT(EPOCH FROM (end_time - start_time)) / 60
                  ELSE
                      EXTRACT(EPOCH FROM (end_time)) / 60 + 
                      (EXTRACT(EPOCH FROM (time '24:00:00') - start_time) / 60) +
                      (EXTRACT(DAY FROM age(activity_end_date, activity_start_date)) - 1) * 1440
              END AS total_duration
          FROM activities
          WHERE activity_start_date BETWEEN $1 AND $2
      )
      SELECT category, color, SUM(total_duration) AS total_duration
      FROM activity_segments
      GROUP BY category, color
      ORDER BY category;
    `;

    const result = await pool.query(query, [startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to calculate date ranges
const getDateRange = (range) => {
  const now = new Date();
  let startDate;
  
  switch (range) {
    case 'day':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    default:
      throw new Error('Invalid range type');
  }

  return { startDate, endDate: now };
};

const updateEventTime = (req, res) => {
  const { id } = req.params;
  const { startDate, endDate, startTime, endTime } = req.body;
  console.log('Updating event time:', {
    start_date: startDate,
    end_date: endDate,
    start_time: startTime,
    end_time: endTime,
  });

  pool.query(
    `UPDATE activities
     SET activity_start_date = $1, activity_end_date = $2, start_time = $3, end_time = $4
     WHERE id = $5
     RETURNING *`,
    [startDate, endDate, startTime, endTime, id],
    (err, result) => {
      if (err) {
        console.error('Error updating event time:', err);
        res.status(500).json({ error: 'Database error' });
      } else if (result.rowCount === 0) {
        res.status(404).json({ error: 'Activity not found' });
      } else {
        res.status(200).json({ message: 'Activity time updated successfully', activity: result.rows[0] });
      }
    }
  );
};

module.exports = { logActivity, getActivities, getActivityById, deleteActivity, updateActivity, endActivity, getTodayActivities,  getActivitiesByRange, updateEventTime };
