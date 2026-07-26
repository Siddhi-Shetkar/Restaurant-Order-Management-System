const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.route('/stats').get(protect, authorize('Manager'), getStats);

module.exports = router;
