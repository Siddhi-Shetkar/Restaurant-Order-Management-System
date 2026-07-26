const Order = require('../models/Order');

// @desc    Get dashboard stats
// @route   GET /api/analytics/stats
// @access  Private (Manager)
const getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await Order.find({ createdAt: { $gte: today } });

    const totalOrdersToday = orders.length;
    
    let pending = 0, preparing = 0, ready = 0, delivered = 0;
    let revenueToday = 0;
    let dineInCount = 0, takeawayCount = 0;

    orders.forEach(order => {
      if (order.status === 'Pending') pending++;
      else if (order.status === 'Preparing') preparing++;
      else if (order.status === 'Ready') ready++;
      else if (order.status === 'Delivered') {
        delivered++;
        revenueToday += order.totalAmount;
      }

      if (order.orderType === 'Dine-in') dineInCount++;
      else takeawayCount++;
    });

    // Valid completed/delivered orders for average calculation
    const avgOrderValue = delivered > 0 ? (revenueToday / delivered) : 0;

    res.json({
      totalOrdersToday,
      pending,
      preparing,
      ready,
      delivered,
      revenueToday,
      avgOrderValue,
      dineInCount,
      takeawayCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats
};
