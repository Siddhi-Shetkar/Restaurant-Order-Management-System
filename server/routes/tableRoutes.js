const express = require('express');
const router = express.Router();
const {
  getTables,
  createTable,
  updateTable,
  deleteTable
} = require('../controllers/tableController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getTables) // Note: Making it public for customers to see table availability? Or private. The prompt says customers select table.
  .post(protect, authorize('Manager'), createTable);

router.route('/:id')
  .put(protect, authorize('Manager'), updateTable)
  .delete(protect, authorize('Manager'), deleteTable);

module.exports = router;
