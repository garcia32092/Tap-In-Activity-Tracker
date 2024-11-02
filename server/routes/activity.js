const express = require('express');
const { logActivity, getActivities, deleteActivity, updateActivity } = require('../controllers/activityController');
const router = express.Router();

// Route to log an activity
router.post('/', logActivity);

// Route to fetch all activities
router.get('/', getActivities);

// Route to delete an activity by ID
router.delete('/:id', deleteActivity);

// Route to update an activity by ID
router.put('/:id', updateActivity);

module.exports = router;
