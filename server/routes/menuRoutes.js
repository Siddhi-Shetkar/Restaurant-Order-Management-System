const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getMenuItems)
  .post(protect, authorize('Manager'), createMenuItem);

router.route('/:id')
  .get(getMenuItemById)
  .put(protect, authorize('Manager'), updateMenuItem)
  .delete(protect, authorize('Manager'), deleteMenuItem);

module.exports = router;
