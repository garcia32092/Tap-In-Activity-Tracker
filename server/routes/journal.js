const express = require('express');
const { logJournal, getJournals } = require('../controllers/journalController');
const router = express.Router();

router.post('/', logJournal);
router.get('/', getJournals);

module.exports = router;
