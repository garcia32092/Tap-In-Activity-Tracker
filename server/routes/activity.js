const express = require('express');
const {
    logActivity,
    getActivities,
    deleteActivity,
    updateActivity,
    getTodayActivities,
    getActivitiesByRange
} = require('../controllers/activityController');
const router = express.Router();

// Route to log an activity
router.post('/', logActivity);

// Route to fetch all activities
router.get('/all', getActivities);

// Route to delete an activity by ID
router.delete('/:id', deleteActivity);

// Route to update an activity by ID
router.put('/:id', updateActivity);

// Route to fetch activities for current date
router.get('/today', getTodayActivities);

// Route to fetch activities by range type or date range
router.get('/range', getActivitiesByRange);

module.exports = router;
