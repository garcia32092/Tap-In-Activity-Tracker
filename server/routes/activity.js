const express = require('express');
const { logActivity, getActivities } = require('../controllers/activityController');
const router = express.Router();

// Route to log an activity
router.post('/', logActivity);

// Route to fetch all activities
router.get('/', getActivities);

module.exports = router;
