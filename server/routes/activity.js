const express = require('express');
const {
    logActivity,
    getActivities,
    deleteActivity,
    updateActivity,
    getTodayActivities,
    getActivitiesByRange,
    updateEventTime,
    getActivityById,
    endActivity
} = require('../controllers/activityController');
const router = express.Router();

// Route to log an activity
router.post('/', logActivity);

// Route to fetch all activities
router.get('/all', getActivities);

// Add the route
router.get('/id=:id', getActivityById);

// Route to delete an activity by ID
router.delete('/:id', deleteActivity);

// Route to update an activity by ID
router.put('/:id', updateActivity);

// Add the route
router.put('/:id/end', endActivity);

// Route to fetch activities for current date
router.get('/today', getTodayActivities);

// Route to fetch activities by range type or date range
router.get('/range', getActivitiesByRange);

// Route to fetch activities by range type or date range
router.put('/:id/time', updateEventTime);

module.exports = router;
