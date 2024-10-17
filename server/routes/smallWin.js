const express = require('express');
const { logSmallWin, getSmallWins } = require('../controllers/smallWinController');
const router = express.Router();

router.post('/', logSmallWin);
router.get('/', getSmallWins);

module.exports = router;
